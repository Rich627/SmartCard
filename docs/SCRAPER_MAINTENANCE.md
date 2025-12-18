# 信用卡資料爬蟲維護指南

## 目前架構

```
┌─────────────────────────────────────────────────────────────────┐
│  GITHUB ACTIONS (全自動)                                         │
│  檔案: /.github/workflows/monthly-scraper.yml                    │
│                                                                  │
│  📅 每月 1 號 早上 8:00 UTC 自動執行                               │
│  ├── 1. 執行 Puppeteer 爬蟲                                      │
│  ├── 2. 直接上傳到 Firestore                                     │
│  └── 3. 完全自動，不需要人工介入                                  │
│                                                                  │
│  ✅ 完全免費 (GitHub 每月 2000 分鐘)                               │
│  ✅ 支援 Puppeteer                                                │
│  ✅ 可隨時手動觸發                                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                         自動上傳
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  FIRESTORE (資料庫)                                              │
│  Collection: cards                                               │
│  └── 儲存 136 張信用卡的福利資料                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 自動化說明

GitHub Actions 會在每月 1 號自動：
1. 啟動 Ubuntu 環境
2. 安裝 Node.js 和 Puppeteer
3. 執行爬蟲抓取最新資料
4. 上傳到 Firestore

## 什麼時候需要更新資料？

信用卡福利通常不會經常變動，以下情況需要更新：

| 情況 | 頻率 | 範例 |
|------|------|------|
| 季度輪轉類別 | 每季度 | Chase Freedom Flex 5% 類別變更 |
| 年費調整 | 很少 | Amex Gold $250 → $325 |
| 新卡發行 | 不定期 | 新的聯名卡上市 |
| 福利變更 | 很少 | 倍率調整、類別新增/移除 |

**建議更新頻率**: 每季度檢查一次 (1月、4月、7月、10月初)

## 手動觸發更新

如果需要立即更新（不等每月自動執行）：

1. 前往 GitHub Repo → **Actions**
2. 點擊 **Monthly Credit Card Scraper**
3. 點擊 **Run workflow** → **Run workflow**
4. 等待執行完成 (約 2-3 分鐘)

## 本地測試

如果要在本地測試爬蟲：

```bash
cd Functions/scraper
npm install
node index.js
node upload-to-firestore.js
```

## 手動修改特定卡片

如果只需要修改特定卡片的資料，直接編輯對應的爬蟲檔案:

| 發卡機構 | 檔案路徑 |
|---------|---------|
| Chase | `/Functions/scraper/scrapers/chase.js` |
| American Express | `/Functions/scraper/scrapers/amex.js` |
| Citi | `/Functions/scraper/scrapers/citi.js` |
| Capital One | `/Functions/scraper/scrapers/capitalone.js` |
| Discover | `/Functions/scraper/scrapers/discover.js` |
| Bank of America | `/Functions/scraper/scrapers/bofa.js` |
| Wells Fargo | `/Functions/scraper/scrapers/wellsfargo.js` |
| US Bank | `/Functions/scraper/scrapers/usbank.js` |
| 其他 (Barclays, 信用合作社等) | `/Functions/scraper/scrapers/others.js` |

## 季度輪轉類別更新

Chase Freedom Flex 和 Discover it 有季度輪轉類別，需要每季更新:

### Chase Freedom Flex
檔案: `/Functions/scraper/scrapers/chase.js`

```javascript
// 找到這段程式碼並更新
const CHASE_ROTATING = {
  1: ['grocery', 'fitness', 'hairSalon'],        // Q1: 1-3月
  2: ['amazon', 'streaming'],                     // Q2: 4-6月
  3: ['instacart', 'entertainment', 'gas'],       // Q3: 7-9月
  4: ['chaseTravel', 'departmentStores', 'paypal'] // Q4: 10-12月
};
```

### Discover it
檔案: `/Functions/scraper/scrapers/discover.js`

```javascript
const DISCOVER_ROTATING = {
  Q1: ['grocery', 'fitness'],
  Q2: ['gas', 'homeImprovement', 'evCharging'],
  Q3: ['dining', 'drugstore'],
  Q4: ['amazon', 'walmart', 'target', 'onlineShopping']
};
```

## 相關資源

- [Chase Freedom 5% Calendar](https://www.chase.com/personal/credit-cards/freedom/calendar)
- [Discover 5% Calendar](https://www.discover.com/credit-cards/cashback-bonus/cashback-calendar.html)
- [NerdWallet Credit Cards](https://www.nerdwallet.com/best/credit-cards)
- [The Points Guy](https://thepointsguy.com/credit-cards/)

---

最後更新: 2025-12-18
