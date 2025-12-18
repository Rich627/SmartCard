# GitHub Actions 自動爬蟲設定指南

## 自動執行時間

- **每月 1 號 早上 8:00 UTC** (台灣時間下午 4:00)
- 也可以隨時手動觸發

## 設定步驟

### Step 1: 取得 Firebase Service Account

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 選擇專案 `smartcard-c6e92`
3. 點擊 ⚙️ **Project Settings** > **Service accounts**
4. 點擊 **Generate new private key**
5. 下載 JSON 檔案

### Step 2: 新增 GitHub Secret

1. 前往你的 GitHub Repo: https://github.com/YOUR_USERNAME/SmartCard
2. 點擊 **Settings** > **Secrets and variables** > **Actions**
3. 點擊 **New repository secret**
4. Name: `FIREBASE_SERVICE_ACCOUNT`
5. Value: 貼上整個 JSON 檔案內容
6. 點擊 **Add secret**

### Step 3: 推送程式碼

```bash
git add .github/workflows/monthly-scraper.yml
git commit -m "feat: add monthly auto scraper via GitHub Actions"
git push
```

### Step 4: 測試

1. 前往 GitHub Repo > **Actions**
2. 點擊 **Monthly Credit Card Scraper**
3. 點擊 **Run workflow** > **Run workflow**
4. 等待執行完成 (約 2-3 分鐘)

## 執行結果

每次執行後可以在 Actions 頁面看到：
- 爬取了多少張卡片
- 有多少張有圖片
- 上傳到 Firestore 的時間

## 修改執行頻率

編輯 `.github/workflows/monthly-scraper.yml`:

```yaml
on:
  schedule:
    # 每月 1 號
    - cron: '0 8 1 * *'

    # 或改成每週一
    # - cron: '0 8 * * 1'

    # 或改成每天
    # - cron: '0 8 * * *'
```

Cron 格式: `分 時 日 月 星期`

## 費用

- GitHub Actions 私有 Repo: 每月 2000 分鐘免費
- 每次爬蟲約 2-3 分鐘
- 每月 1 次 = 約 3 分鐘，完全在免費額度內

## 故障排除

### 執行失敗

1. 檢查 Actions 頁面的錯誤訊息
2. 確認 `FIREBASE_SERVICE_ACCOUNT` secret 設定正確
3. 確認 JSON 格式正確 (不要有多餘空格或換行)

### 手動觸發

如果自動執行沒有運作，可以隨時手動觸發：
1. 前往 Actions 頁面
2. 點擊 **Monthly Credit Card Scraper**
3. 點擊 **Run workflow**
