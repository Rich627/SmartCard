"""
Base crawler class for credit card data scraping
"""
import requests
from bs4 import BeautifulSoup
from abc import ABC, abstractmethod
from dataclasses import dataclass, asdict
from typing import List, Optional, Dict
from datetime import datetime
import json
import re


@dataclass
class CategoryReward:
    category: str
    multiplier: float
    is_percentage: bool
    cap: Optional[float] = None
    cap_period: Optional[str] = None  # "monthly", "quarterly", "yearly"


@dataclass
class RotatingCategory:
    quarter: int
    year: int
    categories: List[str]
    multiplier: float
    is_percentage: bool
    cap: Optional[float] = None
    activation_required: bool = True


@dataclass
class CreditCardData:
    id: str
    name: str
    issuer: str
    network: str  # visa, mastercard, amex, discover
    annual_fee: float
    reward_type: str  # cashback, points, miles
    base_reward: float
    base_is_percentage: bool
    category_rewards: List[CategoryReward]
    rotating_categories: Optional[List[RotatingCategory]] = None
    selectable_config: Optional[Dict] = None
    image_color: str = "#333333"
    last_updated: str = ""

    def to_dict(self):
        data = asdict(self)
        data['last_updated'] = datetime.now().isoformat()
        return data

    def to_firestore_dict(self):
        """Convert to Firestore-compatible format"""
        return {
            'id': self.id,
            'name': self.name,
            'issuer': self.issuer,
            'network': self.network,
            'annualFee': self.annual_fee,
            'rewardType': self.reward_type,
            'baseReward': self.base_reward,
            'baseIsPercentage': self.base_is_percentage,
            'categoryRewards': [
                {
                    'category': r.category,
                    'multiplier': r.multiplier,
                    'isPercentage': r.is_percentage,
                    'cap': r.cap,
                    'capPeriod': r.cap_period
                }
                for r in self.category_rewards
            ],
            'rotatingCategories': [
                {
                    'quarter': r.quarter,
                    'year': r.year,
                    'categories': r.categories,
                    'multiplier': r.multiplier,
                    'isPercentage': r.is_percentage,
                    'cap': r.cap,
                    'activationRequired': r.activation_required
                }
                for r in (self.rotating_categories or [])
            ] if self.rotating_categories else None,
            'selectableConfig': self.selectable_config,
            'imageColor': self.image_color,
            'lastUpdated': datetime.now().isoformat()
        }


class BaseCrawler(ABC):
    """Base class for all credit card crawlers"""

    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })

    def fetch_page(self, url: str) -> BeautifulSoup:
        """Fetch and parse a webpage"""
        response = self.session.get(url, timeout=30)
        response.raise_for_status()
        return BeautifulSoup(response.text, 'html.parser')

    @abstractmethod
    def crawl(self) -> List[CreditCardData]:
        """Crawl and return credit card data"""
        pass

    @abstractmethod
    def get_issuer_name(self) -> str:
        """Return the issuer name"""
        pass

    def save_to_json(self, cards: List[CreditCardData], filename: str):
        """Save cards to JSON file"""
        data = [card.to_dict() for card in cards]
        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)

    @staticmethod
    def parse_percentage(text: str) -> Optional[float]:
        """Extract percentage from text like '5% cash back'"""
        match = re.search(r'(\d+(?:\.\d+)?)\s*%', text)
        if match:
            return float(match.group(1))
        return None

    @staticmethod
    def parse_multiplier(text: str) -> Optional[float]:
        """Extract multiplier from text like '3x points'"""
        match = re.search(r'(\d+(?:\.\d+)?)\s*[xX]', text)
        if match:
            return float(match.group(1))
        return None

    @staticmethod
    def parse_dollar_amount(text: str) -> Optional[float]:
        """Extract dollar amount from text like '$1,500 cap'"""
        match = re.search(r'\$?([\d,]+(?:\.\d+)?)', text.replace(',', ''))
        if match:
            return float(match.group(1).replace(',', ''))
        return None


def get_current_quarter() -> int:
    """Get current quarter (1-4)"""
    month = datetime.now().month
    return (month - 1) // 3 + 1


def get_current_year() -> int:
    """Get current year"""
    return datetime.now().year
