"""
Main crawler orchestrator
Runs all crawlers and uploads to Firestore
"""
import os
import json
from datetime import datetime
from typing import List, Dict

# Firebase Admin SDK
import firebase_admin
from firebase_admin import credentials, firestore

from base_crawler import CreditCardData, CategoryReward, RotatingCategory
from rotating_categories import RotatingCategoryCrawler


def init_firebase():
    """Initialize Firebase Admin SDK"""
    # In Cloud Functions, this is automatic
    # For local testing, use service account
    if not firebase_admin._apps:
        # Check for service account file
        cred_path = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
        if cred_path and os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        else:
            # Use default credentials (for Cloud Functions)
            firebase_admin.initialize_app()

    return firestore.client()


def get_static_card_data() -> List[CreditCardData]:
    """
    Returns static card data for cards that don't need frequent updates
    This is the baseline data - rotating categories are updated separately
    """
    return [
        CreditCardData(
            id='chase-sapphire-preferred',
            name='Chase Sapphire Preferred',
            issuer='Chase',
            network='visa',
            annual_fee=95,
            reward_type='points',
            base_reward=1,
            base_is_percentage=False,
            category_rewards=[
                CategoryReward('dining', 3, False),
                CategoryReward('streaming', 3, False),
                CategoryReward('onlineShopping', 3, False),
                CategoryReward('travel', 5, False),
            ],
            image_color='#1A1F71'
        ),
        CreditCardData(
            id='chase-freedom-flex',
            name='Chase Freedom Flex',
            issuer='Chase',
            network='mastercard',
            annual_fee=0,
            reward_type='points',
            base_reward=1,
            base_is_percentage=False,
            category_rewards=[
                CategoryReward('dining', 3, False),
                CategoryReward('drugstore', 3, False),
                CategoryReward('travel', 5, False),
            ],
            rotating_categories=[],  # Will be populated by rotating crawler
            image_color='#0066B2'
        ),
        CreditCardData(
            id='amex-gold',
            name='American Express Gold',
            issuer='American Express',
            network='amex',
            annual_fee=250,
            reward_type='points',
            base_reward=1,
            base_is_percentage=False,
            category_rewards=[
                CategoryReward('dining', 4, False),
                CategoryReward('grocery', 4, False, cap=25000, cap_period='yearly'),
            ],
            image_color='#B4975A'
        ),
        CreditCardData(
            id='amex-blue-cash-preferred',
            name='Blue Cash Preferred',
            issuer='American Express',
            network='amex',
            annual_fee=95,
            reward_type='cashback',
            base_reward=1,
            base_is_percentage=True,
            category_rewards=[
                CategoryReward('grocery', 6, True, cap=6000, cap_period='yearly'),
                CategoryReward('streaming', 6, True),
                CategoryReward('transit', 3, True),
                CategoryReward('gas', 3, True),
            ],
            image_color='#006FCF'
        ),
        CreditCardData(
            id='citi-double-cash',
            name='Citi Double Cash',
            issuer='Citi',
            network='mastercard',
            annual_fee=0,
            reward_type='cashback',
            base_reward=2,
            base_is_percentage=True,
            category_rewards=[],
            image_color='#003B70'
        ),
        CreditCardData(
            id='capital-one-savor',
            name='Capital One Savor',
            issuer='Capital One',
            network='mastercard',
            annual_fee=95,
            reward_type='cashback',
            base_reward=1,
            base_is_percentage=True,
            category_rewards=[
                CategoryReward('dining', 4, True),
                CategoryReward('entertainment', 4, True),
                CategoryReward('streaming', 4, True),
                CategoryReward('grocery', 3, True),
            ],
            image_color='#D03027'
        ),
        CreditCardData(
            id='discover-it',
            name='Discover it Cash Back',
            issuer='Discover',
            network='discover',
            annual_fee=0,
            reward_type='cashback',
            base_reward=1,
            base_is_percentage=True,
            category_rewards=[],
            rotating_categories=[],  # Will be populated by rotating crawler
            image_color='#FF6600'
        ),
        CreditCardData(
            id='boa-customized-cash',
            name='Bank of America Customized Cash',
            issuer='Bank of America',
            network='visa',
            annual_fee=0,
            reward_type='cashback',
            base_reward=1,
            base_is_percentage=True,
            category_rewards=[
                CategoryReward('grocery', 2, True),
                CategoryReward('wholesale', 2, True),
            ],
            selectable_config={
                'maxSelections': 1,
                'availableCategories': ['gas', 'onlineShopping', 'dining', 'travel', 'drugstore', 'homeImprovement'],
                'multiplier': 3,
                'isPercentage': True,
                'cap': 2500,
                'capPeriod': 'quarterly'
            },
            image_color='#E31837'
        ),
        CreditCardData(
            id='us-bank-cash-plus',
            name='US Bank Cash+',
            issuer='US Bank',
            network='visa',
            annual_fee=0,
            reward_type='cashback',
            base_reward=1,
            base_is_percentage=True,
            category_rewards=[],
            selectable_config={
                'maxSelections': 2,
                'availableCategories': ['gas', 'grocery', 'dining', 'utilities', 'streaming', 'transit', 'homeImprovement'],
                'multiplier': 5,
                'isPercentage': True,
                'cap': 2000,
                'capPeriod': 'quarterly'
            },
            image_color='#0C2340'
        ),
        CreditCardData(
            id='wells-fargo-active-cash',
            name='Wells Fargo Active Cash',
            issuer='Wells Fargo',
            network='visa',
            annual_fee=0,
            reward_type='cashback',
            base_reward=2,
            base_is_percentage=True,
            category_rewards=[],
            image_color='#D71E28'
        ),
    ]


def merge_rotating_categories(cards: List[CreditCardData], rotating_data: Dict):
    """Merge rotating category data into card data"""
    for card in cards:
        if card.id in rotating_data:
            card.rotating_categories = rotating_data[card.id]


def upload_to_firestore(db, cards: List[CreditCardData]):
    """Upload card data to Firestore"""
    batch = db.batch()
    cards_ref = db.collection('cards')

    for card in cards:
        doc_ref = cards_ref.document(card.id)
        batch.set(doc_ref, card.to_firestore_dict())

    batch.commit()
    print(f"Uploaded {len(cards)} cards to Firestore")


def save_to_json(cards: List[CreditCardData], filename: str = 'cards.json'):
    """Save cards to JSON file (for local testing)"""
    data = [card.to_firestore_dict() for card in cards]
    with open(filename, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"Saved {len(cards)} cards to {filename}")


def run_crawler(upload: bool = False):
    """Main crawler function"""
    print(f"Starting crawler at {datetime.now()}")

    # Get static card data
    cards = get_static_card_data()
    print(f"Loaded {len(cards)} static cards")

    # Get rotating categories
    rotating_crawler = RotatingCategoryCrawler()
    rotating_data = rotating_crawler.crawl()
    print(f"Got rotating data for {len(rotating_data)} cards")

    # Merge data
    merge_rotating_categories(cards, rotating_data)

    # Upload or save
    if upload:
        db = init_firebase()
        upload_to_firestore(db, cards)
    else:
        save_to_json(cards)

    print(f"Crawler completed at {datetime.now()}")
    return cards


# Cloud Function entry point
def update_cards(request):
    """HTTP Cloud Function entry point"""
    try:
        run_crawler(upload=True)
        return 'Cards updated successfully', 200
    except Exception as e:
        print(f"Error: {e}")
        return f'Error: {str(e)}', 500


# Scheduled function entry point
def scheduled_update(event, context):
    """Pub/Sub triggered function for scheduled updates"""
    try:
        run_crawler(upload=True)
        print('Scheduled update completed')
    except Exception as e:
        print(f"Scheduled update error: {e}")
        raise


if __name__ == '__main__':
    # Local testing - save to JSON
    run_crawler(upload=False)
