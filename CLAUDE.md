# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SmartCard is an iOS app that helps users maximize credit card rewards by recommending the best card for each purchase. Features include:
- Credit card reward tracking (fixed, rotating, selectable categories)
- Smart card recommendations based on merchant/category
- Spending tracking and analytics
- Support for US credit card issuers

## Tech Stack

- **Platform**: iOS (iPhone only)
- **UI Framework**: SwiftUI
- **Architecture**: MVVM
- **Backend**: Firebase (planned, currently using UserDefaults)
- **Language**: Swift

## Build and Development

Open `SmartCard.xcodeproj` in Xcode (requires Xcode 15+).

To create the Xcode project:
1. Open Xcode → File → New → Project
2. Select iOS → App
3. Product Name: SmartCard
4. Interface: SwiftUI, Language: Swift
5. Add all files from `SmartCard/` directory to the project

## Architecture

```
SmartCard/
├── App/                    # App entry point
├── Models/                 # Data models
│   ├── CreditCard.swift    # Card, rewards, rotating/selectable configs
│   ├── Spending.swift      # Transaction records
│   ├── SpendingCategory.swift
│   ├── Merchant.swift      # Merchant → category mapping
│   └── MockData.swift      # Sample credit card data
├── Views/                  # SwiftUI views (MVVM View layer)
│   ├── Home/
│   ├── Cards/
│   ├── Spending/
│   ├── Recommend/
│   └── Settings/
├── ViewModels/             # State management
│   ├── CardViewModel.swift
│   └── SpendingViewModel.swift
├── Services/               # Business logic
│   └── RecommendationEngine.swift
└── Utils/
    └── Extensions.swift    # Color hex, Date helpers
```

## Key Components

### RecommendationEngine
Calculates best card for a category considering:
- Fixed category bonuses
- Rotating quarterly categories (activation status)
- User-selectable categories
- Spending caps

### Credit Card Types
- **Fixed categories**: Always earn bonus (e.g., Amex Gold 4x dining)
- **Rotating categories**: Quarterly bonuses requiring activation (e.g., Chase Freedom Flex)
- **Selectable categories**: User-chosen bonus category (e.g., BoA Customized Cash)

## Data Flow

1. User selects category or enters merchant name
2. `MerchantDatabase` maps merchant → category
3. `RecommendationEngine` evaluates all user cards
4. Results sorted by estimated reward value
