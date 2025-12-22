# Bug / TODO List

## Completed Fixes (2025/12/19)

### Original Issues
- [x] Add Robinhood Gold Card (added to `Functions/scraper/scrapers/others.js`)
- [x] Walmart should not have bonus on Amex Gold (fixed: Walmart/Target now categorized as `.other` instead of `.grocery`)
- [x] Recommend page: Number keyboard doesn't dismiss after entering amount (fixed: added toolbar with Done button)
- [x] Add more stores to search list (added 80+ new merchants in `Merchant.swift`)
- [x] Change homepage to show "Credit Line Usage" instead of current display (renamed from "Credit Utilization")

---

## Card Data Fixes Applied

### Chase (`chase.js`) - FIXED
- [x] Sapphire Reserve: 年費 $550 → $795
- [x] Sapphire Reserve: 回饋結構改為 8x Chase Travel, 4x direct hotels/flights, 3x dining
- [x] Freedom Flex: 更新 2025 輪替類別
- [x] Marriott Bonvoy Boundless: 加入 $6,000/年 消費上限
- [x] Amazon Prime Rewards Visa: 加入 rideshare 2x

### Amex (`amex.js`) - FIXED
- [x] Platinum Card: 年費 $695 → $895
- [x] Gold Card: 餐廳消費上限已存在 ($50,000/年)

### Capital One (`capitalone.js`) - FIXED
- [x] Savor: 年費 $95 → $0, 回饋改為 3x
- [x] Venture: 加入 vacation rentals, activities, Capital One Entertainment 5x
- [x] VentureOne: 加入 rental cars 5x

### Citi (`citi.js`) - FIXED
- [x] Custom Cash: 加入 autoDetect 標記和說明
- [x] AAdvantage Platinum Select: 加入首年免年費說明

### Discover (`discover.js`) - FIXED
- [x] 更新 2025 輪替類別 (Q1-Q4)
- [x] Chrome: 加入合併消費上限說明

### Wells Fargo (`wellsfargo.js`) - FIXED
- [x] Autograph Journey: 移除 transit, 加入 hotels 5x, airlines 4x, other travel 3x

### Bank of America (`bofa.js`) - FIXED
- [x] Customized Cash Rewards: 固定 2% 改為 grocery + wholesale
- [x] Customized Cash Rewards: 加入首年 6% 說明
- [x] Unlimited Cash Rewards: 加入首年 2% 說明
- [x] Travel Rewards: 加入 BofA Travel Center 3x

### US Bank (`usbank.js`) - FIXED
- [x] Altitude Go: 餐廳加入 $2,000/季 上限
- [x] Altitude Connect: 年費 $95 → $0
- [x] Altitude Reserve: 加入行動錢包 $5,000/月 上限，更新 multiplier

---

## Summary

All card data issues have been fixed. To deploy:

```bash
cd Functions/scraper && npm run scrape && npm run upload
```

## Card Image Fixes

### Capital One - FIXED
- [x] 更新所有 Capital One 卡片使用可用的 open-graph 圖片 URL
- [x] Savor/SavorOne: `open-graph/savorone.png`
- [x] Venture X: `open-graph/venture-x.png`
- [x] Venture: `open-graph/venture.png` or `products/og/venture.png`
- [x] VentureOne: `products/og/ventureone.png`
- [x] Quicksilver: `open-graph/quicksilver.png`
- [x] Platinum: `open-graph/platinumog.png`
- [x] Spark Cash Plus: 已刪除（無可用圖片）

### Fintech Cards (`others.js`) - FIXED
- [x] Apple Card: 更新圖片 URL 為 `og__dtukeczp0ygm_overview.png`
- [x] Robinhood Gold Card: 更新圖片 URL 為 `shadow_card_desktop.png`

### 所有發卡行圖片狀態
- Chase: ✅ 可用
- Amex: ✅ 可用
- Capital One: ✅ 可用
- Citi: ✅ 可用
- Discover: ✅ 可用
- Wells Fargo: ✅ 可用
- Bank of America: ✅ 可用
- US Bank: ✅ 可用
- Fintech (Apple, Robinhood): ✅ 可用

---

## Notes

- 資料於 2025/12/19 審核並更新
- 部分卡片近期有重大改版（Sapphire Reserve 2025/6、US Bank Altitude Reserve 2025/12）
- 建議定期重新審核以確保資料正確性
- Capital One Spark Cash Plus 圖片無法取得，app 會使用 imageColor 顯示
