import React, { useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface MapViewProps {
  coordinates: Array<{ latitude: number; longitude: number }>;
  fromPlace?: { lat: number; lng: number; name: string } | null;
  toPlace?: { lat: number; lng: number; name: string } | null;
  warnings?: Array<{ latitude: number; longitude: number; message: string; severity: number }>;
  routeColor?: string;
  allRoutes?: Array<{
    coordinates: Array<{ latitude: number; longitude: number }>;
    color: string;
    isSelected: boolean;
    isSafest: boolean;
  }>;
  onMapReady?: () => void;
}

/**
 * Escape a string so it's safe to embed inside a JS single-quoted string literal.
 * Handles single quotes, backslashes, newlines, and other special chars.
 */
function escapeForJS(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}

export default function OpenStreetMapView({
  coordinates,
  fromPlace,
  toPlace,
  warnings,
  routeColor = '#4CAF50',
  allRoutes,
  onMapReady,
}: MapViewProps) {
  const webViewRef = useRef<WebView>(null);

  // ─────────────────────────────────────────────────────────
  // 1. DRAW ROUTES
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (webViewRef.current && allRoutes && allRoutes.length > 0) {
      let jsCode = `
        if (window.routeLayers) {
          window.routeLayers.forEach(function(layer) { map.removeLayer(layer); });
        }
        window.routeLayers = [];
        var allBounds = [];
      `;

      allRoutes.forEach((route, idx) => {
        const latlngs = JSON.stringify(route.coordinates.map(c => [c.latitude, c.longitude]));
        const opacity = route.isSelected ? 1 : 0.4;
        const weight = route.isSelected ? 8 : 5;

        jsCode += `
          var latlngs${idx} = ${latlngs};
          var routeBorder${idx} = L.polyline(latlngs${idx}, {
            color: '#000000',
            weight: ${weight + 3},
            opacity: ${opacity * 0.25},
            smoothFactor: 1,
            pane: 'overlayPane',
          }).addTo(map);
          window.routeLayers.push(routeBorder${idx});

          var routeLine${idx} = L.polyline(latlngs${idx}, {
            color: '${route.color}',
            weight: ${weight},
            opacity: ${opacity},
            smoothFactor: 1,
            lineCap: 'round',
            lineJoin: 'round',
            pane: 'overlayPane',
          }).addTo(map);
          window.routeLayers.push(routeLine${idx});

          allBounds = allBounds.concat(latlngs${idx});
        `;
      });

      jsCode += `
        if (allBounds.length > 0) {
          var bounds = L.latLngBounds(allBounds);
          map.flyToBounds(bounds, { padding: [80, 80], duration: 1.5, easeLinearity: 0.5 });
        }
      `;

      webViewRef.current.injectJavaScript(jsCode);
    } else if (webViewRef.current && coordinates.length > 0) {
      const jsCode = `
        if (window.routeLayer) { map.removeLayer(window.routeLayer); }
        if (window.routeBorder) { map.removeLayer(window.routeBorder); }

        var latlngs = ${JSON.stringify(coordinates.map(c => [c.latitude, c.longitude]))};

        window.routeBorder = L.polyline(latlngs, {
          color: '#000000', weight: 11, opacity: 0.25, smoothFactor: 1,
        }).addTo(map);

        window.routeLayer = L.polyline(latlngs, {
          color: '${routeColor}', weight: 8, opacity: 1, smoothFactor: 1,
          lineCap: 'round', lineJoin: 'round',
        }).addTo(map);

        map.flyToBounds(window.routeLayer.getBounds(), {
          padding: [80, 80], duration: 1.5, easeLinearity: 0.5,
        });
      `;
      webViewRef.current.injectJavaScript(jsCode);
    }
  }, [coordinates, routeColor, allRoutes]);

  // ─────────────────────────────────────────────────────────
  // 2. FROM / TO MARKERS  (separate array so warnings don't wipe them)
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!webViewRef.current) return;

    let jsCode = `
      if (window.ftMarkers) {
        window.ftMarkers.forEach(function(m) { map.removeLayer(m); });
      }
      window.ftMarkers = [];
    `;

    if (fromPlace) {
      const safeName = escapeForJS(fromPlace.name);
      jsCode += `
        var fromIcon = L.divIcon({
          html: '<div style="position:relative;width:24px;height:24px;">'
              + '<div style="position:absolute;top:-12px;left:-12px;width:48px;height:48px;border-radius:50%;background:rgba(76,175,80,0.25);"></div>'
              + '<div style="position:absolute;top:0;left:0;width:24px;height:24px;border-radius:50%;background:#4CAF50;border:4px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.4);"></div>'
              + '</div>',
          iconSize:   [24, 24],
          iconAnchor: [12, 12],
          className:  'custom-marker'
        });
        var fromM = L.marker([${fromPlace.lat}, ${fromPlace.lng}], { icon: fromIcon })
          .addTo(map)
          .bindPopup('<div style="text-align:center;padding:4px;"><b>${safeName}</b><br><small>Starting point</small></div>');
        window.ftMarkers.push(fromM);
      `;
    }

    if (toPlace) {
      const safeName = escapeForJS(toPlace.name);
      jsCode += `
        var toIcon = L.divIcon({
          html: '<div style="position:relative;width:40px;height:50px;">'
              + '<svg width="40" height="50" viewBox="0 0 40 50" style="filter:drop-shadow(0 4px 8px rgba(0,0,0,0.4));">'
              + '<path d="M20,0 C12,0 5,7 5,15 C5,25 20,50 20,50 C20,50 35,25 35,15 C35,7 28,0 20,0 Z" fill="#EA4335"/>'
              + '<circle cx="20" cy="15" r="6" fill="white"/>'
              + '</svg></div>',
          iconSize:   [40, 50],
          iconAnchor: [20, 50],
          className:  'custom-marker'
        });
        var toM = L.marker([${toPlace.lat}, ${toPlace.lng}], { icon: toIcon })
          .addTo(map)
          .bindPopup('<div style="text-align:center;padding:4px;"><b>${safeName}</b><br><small>Destination</small></div>');
        window.ftMarkers.push(toM);
      `;
    }

    webViewRef.current.injectJavaScript(jsCode);
  }, [fromPlace, toPlace]);

  // ─────────────────────────────────────────────────────────
  // 3. WARNING MARKERS  (own array – independent of from/to)
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!webViewRef.current) return;

    // Always clear old warning markers first
    let jsCode = `
      if (window.warnMarkers) {
        window.warnMarkers.forEach(function(m) { map.removeLayer(m); });
      }
      window.warnMarkers = [];
    `;

    if (!warnings || warnings.length === 0) {
      webViewRef.current.injectJavaScript(jsCode);
      return;
    }

    console.log('📍 ==== PLACING WARNING MARKERS ====');
    console.log('Total warnings from API:', warnings.length);

    // Validate & possibly fix coordinates
    const validWarnings: Array<{ latitude: number; longitude: number; message: string; severity: number }> = [];

    warnings.forEach((w, i) => {
      let lat = w.latitude;
      let lng = w.longitude;

      const latOK = lat >= 8 && lat <= 37;
      const lngOK = lng >= 68 && lng <= 97;

      if (!latOK && !lngOK) {
        // Both out of India range – try swapping
        const swapLatOK = lng >= 8 && lng <= 37;
        const swapLngOK = lat >= 68 && lat <= 97;
        if (swapLatOK && swapLngOK) {
          console.warn(`⚠️ Warning ${i}: coords swapped [${lat}, ${lng}] → [${lng}, ${lat}]`);
          [lat, lng] = [lng, lat];
        } else {
          console.error(`❌ Warning ${i}: INVALID coords [${lat}, ${lng}] – skipping`);
          return;
        }
      } else if (!latOK && lngOK) {
        const swapLatOK = lng >= 8 && lng <= 37;
        const swapLngOK = lat >= 68 && lat <= 97;
        if (swapLatOK && swapLngOK) {
          console.warn(`⚠️ Warning ${i}: coords swapped [${lat}, ${lng}] → [${lng}, ${lat}]`);
          [lat, lng] = [lng, lat];
        } else {
          console.error(`❌ Warning ${i}: lat invalid [${lat}, ${lng}] – skipping`);
          return;
        }
      }

      console.log(`✅ Warning ${i}: [${lat.toFixed(6)}, ${lng.toFixed(6)}] – "${w.message}" (sev ${w.severity})`);
      validWarnings.push({ ...w, latitude: lat, longitude: lng });
    });

    console.log(`Valid warnings: ${validWarnings.length}`);

    // Build JS for every single warning marker
    validWarnings.forEach((w, i) => {
      const color = w.severity >= 70 ? '#F44336' : w.severity >= 40 ? '#FF9800' : '#FFC107';
      const msg = escapeForJS(w.message);
      const lat = w.latitude;
      const lng = w.longitude;

      // The icon HTML: a circle with "!" — NO animation class on the Leaflet container
      // The animation is applied to an inner element so it doesn't shift the icon anchor.
      jsCode += `
        try {
          var wIcon${i} = L.divIcon({
            html: '<div style="width:32px;height:32px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 3px 10px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;cursor:pointer;">'
                + '<span style="color:white;font-weight:900;font-size:18px;line-height:1;font-family:-apple-system,sans-serif;">!</span>'
                + '</div>',
            iconSize:   [32, 32],
            iconAnchor: [16, 16],
            popupAnchor:[0, -18],
            className:  'custom-marker'
          });

          var wM${i} = L.marker([${lat}, ${lng}], {
            icon: wIcon${i},
            zIndexOffset: ${2000 + i}
          }).addTo(map);

          wM${i}.bindPopup(
            '<div style="padding:12px;min-width:200px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">'
            + '<div style="font-size:16px;font-weight:700;color:${color};margin-bottom:6px;">⚠️ Warning #${i + 1}</div>'
            + '<div style="font-size:14px;color:#333;font-weight:500;margin:8px 0;">${msg}</div>'
            + '<div style="font-size:12px;color:#666;">Severity: ${w.severity}/100</div>'
            + '<div style="font-size:11px;color:#999;margin-top:4px;">${lat.toFixed(6)}, ${lng.toFixed(6)}</div>'
            + '</div>',
            { closeButton: true, maxWidth: 300, className: 'warning-popup' }
          );

          window.warnMarkers.push(wM${i});

          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'markerCreated', index: ${i}, lat: ${lat}, lng: ${lng}, message: '${msg}'
          }));
        } catch(e) {
          console.error('Marker ${i} error:', e);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'markerError', index: ${i}, error: e.toString()
          }));
        }
      `;
    });

    jsCode += `
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'allMarkersCreated', count: window.warnMarkers.length
      }));
    `;

    console.log('📍 Injecting JS for', validWarnings.length, 'warning markers');
    webViewRef.current.injectJavaScript(jsCode);
  }, [warnings]);

  // ─────────────────────────────────────────────────────────
  // BASE HTML
  // ─────────────────────────────────────────────────────────
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; overflow: hidden; }
        #map { width: 100vw; height: 100vh; background: #E5E3DF; }

        /* Leaflet adds its own wrapper div with the className we set on divIcon.
           We must make that wrapper transparent so only our inner HTML is visible. */
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }

        /* Popup styling */
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.25);
        }
        .leaflet-popup-content { margin: 0; }
        .warning-popup .leaflet-popup-content-wrapper {
          background: white;
          border: 2px solid #f44336;
        }
        .warning-popup .leaflet-popup-tip {
          background: white;
          border: 2px solid #f44336;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', {
          zoomControl: false,
          attributionControl: false,
          zoomAnimation: true,
          fadeAnimation: true,
          markerZoomAnimation: true
        }).setView([18.5204, 73.8567], 13);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          maxZoom: 19, attribution: ''
        }).addTo(map);

        // Three separate arrays so clearing one kind doesn't wipe the others
        window.ftMarkers   = [];   // from / to
        window.warnMarkers = [];   // warnings
        window.routeLayer  = null;
        window.routeLayers = [];

        console.log('Map initialized');

        setTimeout(function() {
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
            } else if (data.type === 'markerCreated') {
              console.log(`✅ Marker ${data.index} at [${data.lat}, ${data.lng}]: "${data.message}"`);
            } else if (data.type === 'markerError') {
              console.error(`❌ Marker ${data.index} error:`, data.error);
            } else if (data.type === 'allMarkersCreated') {
              console.log(`✅ All ${data.count} warning markers created`);
            }
          } catch (e) {
            console.log('WebView:', event.nativeEvent.data);
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
