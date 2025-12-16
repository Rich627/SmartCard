# SmartCard 💳

> Maximize your credit card rewards with smart recommendations.

An iOS app that helps you choose the best credit card for every purchase, so you never miss out on rewards.

[![Swift](https://img.shields.io/badge/Swift-5.9-orange.svg)](https://swift.org/)
[![Platform](https://img.shields.io/badge/Platform-iOS%2017+-blue.svg)](https://developer.apple.com/ios/)
[![License](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](LICENSE)
[![Commercial](https://img.shields.io/badge/Commercial-License%20Available-green.svg)](COMMERCIAL_LICENSE.md)

[English](#features) | [繁體中文](#功能特色)

---

## Screenshots

<p align="center">
  <img src="Screenshots/home.png" width="200" alt="Home Screen">
  <img src="Screenshots/recommend.png" width="200" alt="Recommendations">
  <img src="Screenshots/cards.png" width="200" alt="Card Management">
  <img src="Screenshots/spending.png" width="200" alt="Spending Analytics">
</p>

> 📸 Add your screenshots to the `Screenshots/` folder

---

## Features

| Feature | Description |
|---------|-------------|
| 🎯 **Smart Recommendations** | Get the best card suggestion based on merchant or category |
| 💳 **60+ Credit Cards** | Comprehensive database of major US credit cards with accurate reward data |
| 💰 **Reward Tracking** | Track fixed, rotating, and selectable category bonuses |
| 📊 **Spending Analytics** | Visualize spending patterns with interactive charts |
| 📷 **Receipt Scanning** | OCR-powered receipt scanning for quick expense logging |
| 🎁 **Sign-Up Bonus Tracker** | Never miss a sign-up bonus deadline |
| 📱 **Home Screen Widget** | Quick access to recommendations without opening the app |
| 🔒 **Privacy First** | All data stored locally on your device |

### Supported Cards

**60+ cards from major US issuers:**
- **Chase** - Sapphire Preferred/Reserve, Freedom Flex/Unlimited, Ink Business, Amazon Prime, United, Southwest, Marriott
- **American Express** - Gold, Platinum, Blue Cash Preferred/Everyday, Delta SkyMiles, Hilton Honors
- **Citi** - Double Cash, Custom Cash, Premier, Strata Premier, Costco Anywhere, AAdvantage
- **Capital One** - Savor/SavorOne, Venture X/Venture, Quicksilver
- **Discover** - it Cash Back, Chrome, Miles, Student
- **Bank of America** - Customized Cash, Premium Rewards, Travel Rewards, Alaska Airlines
- **US Bank** - Cash+, Altitude Go/Connect/Reserve
- **Wells Fargo** - Active Cash, Autograph/Journey
- **Others** - Apple Card, Bilt, PayPal, Venmo, Target RedCard, Walmart

### Supported Card Types

| Type | Example | How It Works |
|------|---------|--------------|
| **Fixed Categories** | Amex Gold 4x Dining | Always earns bonus rate |
| **Rotating Categories** | Chase Freedom Flex 5% | Quarterly bonuses, activation required |
| **Selectable Categories** | BoA Customized Cash 3% | Choose your own bonus category |

---

## Demo

🚀 **Try it out:** [Join TestFlight Beta](#) *(coming soon)*

<!--
Add a GIF demo here:
![Demo](Screenshots/demo.gif)
-->

---

## Quick Start

### Requirements

- iOS 17.0+
- Xcode 15+
- Swift 5.9+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/SmartCard.git

# Open in Xcode
cd SmartCard
open SmartCard.xcodeproj

# Build and run (⌘ + R)
```

---

## How It Works

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Enter Merchant │ ──▶ │ Category Mapping │ ──▶ │  Recommendation │
│  or Category    │     │    Database      │     │     Engine      │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                          │
                                                          ▼
                                                 ┌─────────────────┐
                                                 │   Best Card +   │
                                                 │  Reward Amount  │
                                                 └─────────────────┘
```

The **RecommendationEngine** evaluates all your cards considering:
- ✅ Fixed category bonus multipliers
- ✅ Current quarter's rotating categories (activation status)
- ✅ User-selected bonus categories
- ✅ Spending caps and remaining limits
- ✅ Point/mile valuations

---

## Architecture

```
SmartCard/
├── App/                    # App entry point
├── Models/                 # Data models
│   ├── CreditCard.swift    # Card definitions & reward configs
│   ├── Spending.swift      # Transaction records
│   ├── Merchant.swift      # Merchant → category mapping
│   └── MockData.swift      # Sample credit card database
├── Views/                  # SwiftUI views (MVVM)
│   ├── Home/               # Dashboard
│   ├── Cards/              # Card management
│   ├── Spending/           # Expense tracking & charts
│   ├── Recommend/          # Card recommendations
│   └── Settings/           # App settings
├── ViewModels/             # State management
├── Services/               # Business logic
│   ├── RecommendationEngine.swift
│   ├── OCRService.swift
│   └── NotificationService.swift
└── Utils/                  # Extensions & helpers
```

---

## Tech Stack

| Category | Technology |
|----------|------------|
| UI | SwiftUI |
| Architecture | MVVM |
| Reactive | Combine |
| Widget | WidgetKit |
| OCR | Vision Framework |
| Storage | UserDefaults (Firebase planned) |

---

## Testing

```bash
# Run all tests
⌘ + U

# Or via command line
xcodebuild test -scheme SmartCard -destination 'platform=iOS Simulator,name=iPhone 15'
```

**Test Coverage:**
- `RecommendationEngineTests` - Card recommendation logic
- `MerchantDatabaseTests` - Merchant to category mapping
- `ModelTests` - Data model encoding/decoding
- `SearchHistoryManagerTests` - Search history functionality

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Contribution Guide

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is dual-licensed:

- **Open Source License:** [AGPL-3.0](LICENSE) - Free for personal and non-commercial use
- **Commercial License:** [Available for purchase](COMMERCIAL_LICENSE.md) - For commercial/proprietary use

If you want to use SmartCard in a commercial product without open-sourcing your code, please [contact us](mailto:your@email.com) for commercial licensing options.

---

## Support

- 🐛 [Report Bug](https://github.com/yourusername/SmartCard/issues)
- 💡 [Request Feature](https://github.com/yourusername/SmartCard/issues)
- ⭐ Star this repo if you find it useful!

---

## Acknowledgments

- Credit card data sourced from public issuer information
- Icons from SF Symbols

---

<p align="center">
  Made with ❤️ for credit card enthusiasts
</p>

---

# 繁體中文

## 功能特色

| 功能 | 說明 |
|------|------|
| 🎯 **智慧推薦** | 根據商家或消費類別推薦最佳信用卡 |
| 💳 **60+ 信用卡** | 完整美國主流信用卡資料庫，含準確回饋資訊 |
| 💰 **回饋追蹤** | 追蹤固定、輪轉、自選類別回饋 |
| 📊 **消費分析** | 互動式圖表呈現消費模式 |
| 📷 **收據掃描** | OCR 快速記錄消費 |
| 🎁 **開卡禮追蹤** | 追蹤開卡禮進度，不錯過期限 |
| 📱 **主畫面小工具** | 不用開 App 就能查看推薦 |
| 🔒 **隱私優先** | 所有資料儲存在本機 |

### 支援卡片

**60+ 張美國主流信用卡：**
- **Chase** - Sapphire Preferred/Reserve, Freedom Flex/Unlimited, Ink Business, Amazon Prime, United, Southwest, Marriott
- **American Express** - Gold, Platinum, Blue Cash Preferred/Everyday, Delta SkyMiles, Hilton Honors
- **Citi** - Double Cash, Custom Cash, Premier, Strata Premier, Costco Anywhere, AAdvantage
- **Capital One** - Savor/SavorOne, Venture X/Venture, Quicksilver
- **Discover** - it Cash Back, Chrome, Miles, Student
- **Bank of America** - Customized Cash, Premium Rewards, Travel Rewards, Alaska Airlines
- **US Bank** - Cash+, Altitude Go/Connect/Reserve
- **Wells Fargo** - Active Cash, Autograph/Journey
- **其他** - Apple Card, Bilt, PayPal, Venmo, Target RedCard, Walmart

### 支援卡片類型

| 類型 | 範例 | 運作方式 |
|------|------|----------|
| **固定類別** | Amex Gold 餐飲 4x | 永遠享有加碼回饋 |
| **輪轉類別** | Chase Freedom Flex 5% | 每季輪替，需啟用 |
| **自選類別** | BoA Customized Cash 3% | 自選一個加碼類別 |

---

## 快速開始

### 系統需求

- iOS 17.0+
- Xcode 15+
- Swift 5.9+

### 安裝

```bash
# Clone 儲存庫
git clone https://github.com/yourusername/SmartCard.git

# 用 Xcode 開啟
cd SmartCard
open SmartCard.xcodeproj

# 建置並執行 (⌘ + R)
```

---

## 授權

本專案採用雙重授權：

- **開源授權：** [AGPL-3.0](LICENSE) - 個人與非商業使用免費
- **商業授權：** [付費授權](COMMERCIAL_LICENSE.md) - 商業/專有軟體使用

如需在商業產品中使用 SmartCard 且不開源，請[聯絡我們](mailto:your@email.com)取得商業授權。
