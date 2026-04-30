# 極客商城 GA4 數據生成機器人

產生 150 個模擬會話的精確 GA4 事件數據，與分析報告中的漏斗數據完全一致。

## 前置條件

- Python 3.11+
- 網路連線（需訪問 GitHub Pages 網站及 GA4）

## 安裝步驟

```bash
# 1. 建立虛擬環境
python -m venv .venv

# 2. 啟用虛擬環境
# Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# Windows CMD:
.\.venv\Scripts\activate.bat
# macOS/Linux:
source .venv/bin/activate

# 3. 安裝依賴
pip install -r requirements.txt

# 4. 安裝 Playwright 瀏覽器
playwright install chromium
```

## 設定

編輯 `config.py`：

```python
# 必要設定
GA4_MEASUREMENT_ID = "G-YY5FXVDWF7"  # 已預設
SITE_URL = "https://kongsangcheng76-gif.github.io/GeekMall/"  # 已預設

# 選用設定
GA4_API_SECRET = ""  # Measurement Protocol 密鑰（建立方式見下方）
HEADLESS = True       # False = 顯示瀏覽器（除錯用）
MAX_WORKERS = 5       # 並行會話數量
```

### 建立 GA4 API Secret（選用）

若要啟用 Measurement Protocol 備份（確保 purchase 和 begin_checkout 事件精確送達）：

1. 前往 GA4 後台 → **管理** → **資料串流**
2. 選擇你的網站串流
3. 點擊 **Measurement Protocol API 密鑰**
4. 點擊 **建立**，輸入名稱（如 `robot`）
5. 複製密鑰值，貼到 `config.py` 的 `GA4_API_SECRET`

> 即使不設定 API Secret，腳本仍可正常運行（僅依賴瀏覽器自動化觸發 gtag 事件）。

## 執行

```bash
# 啟用虛擬環境後
python ga4_robot.py
```

## 測試流程

### 1. 先用有頭模式測試 5 個會話

編輯 `config.py`，設定 `HEADLESS = False`，然後在 `ga4_robot.py` 的 `run_simulation()` 中暫時改為只跑少量會話。觀察瀏覽器行為是否正確。

### 2. 檢查 GA4 DebugView

- 前往 GA4 後台 → **管理** → **DebugView**
- 確認事件有出現（view_item_list、view_item、add_to_cart 等）

### 3. 確認 Realtime 報告

- GA4 → **報告** → **即時**
- 確認有活躍用戶和事件數據

### 4. 正式執行

- 設回 `HEADLESS = True`
- 執行完整 150 個會話
- 等待執行完成（約 10-20 分鐘）

### 5. 驗證漏斗

- GA4 → **探索** → **漏斗探索**
- 設定 5 個步驟：view_item_list → view_item → add_to_cart → begin_checkout → purchase
- 預期結果：
  - view_item_list: 150
  - view_item: 123 (82%)
  - add_to_cart: 71 (58%)
  - begin_checkout: 26 (37%)
  - purchase: 18 (69%)
  - 整體轉換率: 12.0%

## 會話類型說明

| 類型 | 數量 | 行為 | 觸發事件 |
|------|------|------|----------|
| A: 完整購買 | 18 | 瀏覽→加購物車→結帳→購買 | 全部 |
| B: 結帳放棄 | 8 | 瀏覽→加購物車→進結帳→放棄 | 到 begin_checkout |
| C: 購物車放棄 | 45 | 瀏覽→加購物車→離開 | 到 add_to_cart |
| D: 深度瀏覽 | 52 | 瀏覽多個商品→不加購物車 | 到 view_item |
| E: 快速跳出 | 27 | 只看首頁就離開 | 僅 view_item_list |

## 檔案結構

```
ga4_robot/
├── .venv/              ← Python 虛擬環境（安裝後產生）
├── ga4_robot.py        ← 主腳本
├── config.py           ← 設定檔
├── products.json       ← 商品資料（50 件）
├── requirements.txt    ← Python 依賴
└── README.md           ← 本檔案
```
