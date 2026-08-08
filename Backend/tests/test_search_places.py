import asyncio
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.services.spatial_service import search_places


class SearchPlacesTests(unittest.TestCase):
    def test_search_places_returns_a_list(self):
        results = asyncio.run(search_places("Pune Station"))
        self.assertIsInstance(results, list)


if __name__ == "__main__":
    unittest.main()
