import React, { useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface MapViewProps {
  coordinates: Array<{ latitude: number; longitude: number }>;
  fromPlace?: { lat: number; lng: number; name: string } | null;
  toPlace?: { lat: number; lng: number; name: string } | null;
  warnings?: Array<{ latitude: number; longitude: number; message: string; severity: number }>;
  routeColor?: string;
  onMapReady?: () => void;
}

export default function OpenStreetMapView({
  coordinates,
  fromPlace,
  toPlace,
  warnings,
  routeColor = '#4CAF50',
  onMapReady,
}: MapViewProps) {
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    if (webViewRef.current && coordinates.length > 0) {
      const jsCode = `
        // Remove old route layers
        if (window.routeLayer) {
          map.removeLayer(window.routeLayer);
        }
        if (window.routeBorder) {
          map.removeLayer(window.routeBorder);
        }
        
        var latlngs = ${JSON.stringify(coordinates.map(c => [c.latitude, c.longitude]))};
        
        // Draw border (darker, thicker) first
        window.routeBorder = L.polyline(latlngs, {
          color: '#000000',
          weight: 8,
          opacity: 0.3,
          smoothFactor: 1,
          className: 'route-line'
        }).addTo(map);
        
        // Draw main route on top
        window.routeLayer = L.polyline(latlngs, {
          color: '${routeColor}',
          weight: 6,
          opacity: 1,
          smoothFactor: 1,
          lineCap: 'round',
          lineJoin: 'round',
          className: 'route-line'
        }).addTo(map);
        
        // Animate the route drawing
        var totalLength = 0;
        for (var i = 0; i < latlngs.length - 1; i++) {
          var latlng1 = L.latLng(latlngs[i]);
          var latlng2 = L.latLng(latlngs[i + 1]);
          totalLength += latlng1.distanceTo(latlng2);
        }
        
        // Fit map to route with smooth animation
        map.flyToBounds(window.routeLayer.getBounds(), { 
          padding: [80, 80],
          duration: 1.5,
          easeLinearity: 0.5
        });
      `;
      webViewRef.current.injectJavaScript(jsCode);
    }
  }, [coordinates, routeColor]);

  useEffect(() => {
    if (webViewRef.current && (fromPlace || toPlace || warnings)) {
      let jsCode = `
        if (window.markers) {
          window.markers.forEach(m => map.removeLayer(m));
        }
        window.markers = [];
      `;

      if (fromPlace) {
        jsCode += `
          // Enhanced FROM marker with pulsing effect
          var fromIcon = L.divIcon({
            html: \`
              <div style="position: relative;">
                <div class="pulse-marker" style="
                  width: 48px; 
                  height: 48px; 
                  border-radius: 50%; 
                  background: rgba(76, 175, 80, 0.3);
                  position: absolute;
                  top: -24px;
                  left: -24px;
                "></div>
                <div style="
                  width: 24px; 
                  height: 24px; 
                  border-radius: 50%; 
                  background: #4CAF50;
                  border: 4px solid white;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                  position: absolute;
                  top: -12px;
                  left: -12px;
                "></div>
              </div>
            \`,
            iconSize: [48, 48],
            iconAnchor: [24, 24],
            className: 'custom-marker'
          });
          var fromMarker = L.marker([${fromPlace.lat}, ${fromPlace.lng}], { icon: fromIcon })
            .addTo(map)
            .bindPopup('<div style="text-align: center; padding: 4px;"><b>${fromPlace.name}</b><br><small>Starting point</small></div>');
          window.markers.push(fromMarker);
        `;
      }

      if (toPlace) {
        jsCode += `
          // Enhanced TO marker (destination pin)
          var toIcon = L.divIcon({
            html: \`
              <div style="position: relative;">
                <svg width="40" height="50" viewBox="0 0 40 50" style="filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));">
                  <path d="M20,0 C12,0 5,7 5,15 C5,25 20,50 20,50 C20,50 35,25 35,15 C35,7 28,0 20,0 Z" fill="#EA4335"/>
                  <circle cx="20" cy="15" r="6" fill="white"/>
                </svg>
              </div>
            \`,
            iconSize: [40, 50],
            iconAnchor: [20, 50],
            className: 'custom-marker bounce-marker'
          });
          var toMarker = L.marker([${toPlace.lat}, ${toPlace.lng}], { icon: toIcon })
            .addTo(map)
            .bindPopup('<div style="text-align: center; padding: 4px;"><b>${toPlace.name}</b><br><small>Destination</small></div>');
          window.markers.push(toMarker);
        `;
      }

      if (warnings && warnings.length > 0) {
        warnings.forEach((warning, index) => {
          const severityColor = warning.severity >= 70 ? '#F44336' : warning.severity >= 40 ? '#FF9800' : '#FFC107';
          jsCode += `
            var warningIcon = L.divIcon({
              html: \`
                <div style="
                  background: ${severityColor}; 
                  color: white; 
                  width: 32px; 
                  height: 32px; 
                  border-radius: 50%; 
                  display: flex; 
                  align-items: center; 
                  justify-content: center; 
                  font-weight: 900; 
                  font-size: 20px; 
                  border: 3px solid white;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                  font-family: -apple-system, sans-serif;
                ">!</div>
              \`,
              iconSize: [32, 32],
              iconAnchor: [16, 16],
              className: 'warning-marker pulse-marker'
            });
            var warningMarker = L.marker([${warning.latitude}, ${warning.longitude}], { icon: warningIcon })
              .addTo(map)
              .bindPopup('<div style="text-align: center; padding: 4px;"><b>⚠️ Warning</b><br>${warning.message}<br><small>Severity: ${warning.severity}/100</small></div>');
            window.markers.push(warningMarker);
          `;
        });
      }

      webViewRef.current.injectJavaScript(jsCode);
    }
  }, [fromPlace, toPlace, warnings]);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { 
          margin: 0; 
          padding: 0; 
          overflow: hidden;
        }
        #map { 
          width: 100vw; 
          height: 100vh; 
          background: #E5E3DF;
        }
        .custom-marker, .warning-marker { 
          background: transparent !important; 
          border: none !important; 
        }
        
        /* Custom marker animations */
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .pulse-marker {
          animation: pulse 2s infinite;
        }
        
        .bounce-marker {
          animation: bounce 1s ease-in-out;
        }
        
        /* Smooth route line */
        .route-line {
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', {
          zoomControl: false, // Disable zoom controls
          attributionControl: false,
          zoomAnimation: true,
          fadeAnimation: true,
          markerZoomAnimation: true
        }).setView([18.5204, 73.8567], 13);

        // Use CartoDB Voyager tiles for better aesthetics
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          attribution: ''
        }).addTo(map);

        window.markers = [];
        window.routeLayer = null;

        // Notify React Native that map is ready
        setTimeout(() => {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mapReady' }));
        }, 500);
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'mapReady' && onMapReady) {
              onMapReady();
            }
          } catch (e) {
            console.log('WebView message:', event.nativeEvent.data);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
