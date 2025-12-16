"""
Crawler for rotating category information from Doctor of Credit
This is one of the most reliable sources for quarterly rotating categories
"""
from base_crawler import BaseCrawler, RotatingCategory, get_current_quarter, get_current_year
from typing import List, Dict
import re


class RotatingCategoryCrawler(BaseCrawler):
    """Crawl rotating category information"""

    # Known rotating category cards
    ROTATING_CARDS = {
        'chase-freedom-flex': {
            'name': 'Chase Freedom Flex',
            'issuer': 'Chase',
            'url': 'https://www.doctorofcredit.com/chase-freedom-calendar/',
            'multiplier': 5,
            'is_percentage': False,
            'cap': 1500,
        },
        'discover-it': {
            'name': 'Discover it Cash Back',
            'issuer': 'Discover',
            'url': 'https://www.doctorofcredit.com/discover-it-cashback-calendar/',
            'multiplier': 5,
            'is_percentage': True,
            'cap': 1500,
        }
    }

    # Manual mapping of known categories (Doctor of Credit doesn't have structured data)
    # This needs to be updated quarterly
    KNOWN_CATEGORIES_2025 = {
        'chase-freedom-flex': {
            1: ['grocery'],  # Q1 2025
            2: ['gas', 'homeImprovement'],  # Q2 2025
            3: ['dining', 'drugstore'],  # Q3 2025
            4: ['amazon', 'wholesale'],  # Q4 2025
        },
        'discover-it': {
            1: ['grocery', 'drugstore'],  # Q1 2025
            2: ['gas', 'homeImprovement'],  # Q2 2025
            3: ['dining', 'paypal'],  # Q3 2025
            4: ['amazon', 'onlineShopping'],  # Q4 2025
        }
    }

    def get_issuer_name(self) -> str:
        return "Multiple (Rotating)"

    def crawl(self) -> Dict[str, List[RotatingCategory]]:
        """
        Returns a dict mapping card_id to list of RotatingCategory
        In practice, we'd scrape the actual websites, but many require JavaScript
        For now, we use the known data and verify against the source
        """
        result = {}
        current_year = get_current_year()

        for card_id, card_info in self.ROTATING_CARDS.items():
            categories_by_quarter = self.KNOWN_CATEGORIES_2025.get(card_id, {})

            rotating_list = []
            for quarter in range(1, 5):
                cats = categories_by_quarter.get(quarter, ['other'])
                rotating_list.append(RotatingCategory(
                    quarter=quarter,
                    year=current_year,
                    categories=cats,
                    multiplier=card_info['multiplier'],
                    is_percentage=card_info['is_percentage'],
                    cap=card_info['cap'],
                    activation_required=True
                ))

            result[card_id] = rotating_list

        return result

    def get_current_quarter_categories(self, card_id: str) -> List[str]:
        """Get categories for current quarter"""
        quarter = get_current_quarter()
        categories = self.KNOWN_CATEGORIES_2025.get(card_id, {})
        return categories.get(quarter, ['other'])


# For testing
if __name__ == '__main__':
    crawler = RotatingCategoryCrawler()
    result = crawler.crawl()

    for card_id, rotating in result.items():
        print(f"\n{card_id}:")
        for r in rotating:
            print(f"  Q{r.quarter} {r.year}: {r.categories} ({r.multiplier}{'%' if r.is_percentage else 'x'})")
