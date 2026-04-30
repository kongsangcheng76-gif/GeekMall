# config.py — 極客商城 GA4 機器人設定

# GA4 Measurement ID
GA4_MEASUREMENT_ID = "G-YY5FXVDWF7"

# GA4 Measurement Protocol API Secret
# 建立方式：GA4 後台 → 管理 → 資料串流 → 選擇串流 → Measurement Protocol API 密鑰 → 建立
# 若未設定，腳本仍可運行（僅依賴瀏覽器自動化觸發 gtag 事件）
GA4_API_SECRET = "HF7n3bDbS6OF5-JariCuJA"

# 網站 URL（尾部需包含 /）
SITE_URL = "https://kongsangcheng76-gif.github.io/GeekMall/"

# 執行設定
HEADLESS = True           # True = 無頭模式（背景執行），False = 顯示瀏覽器（除錯用）
MAX_WORKERS = 5           # 並行會話數量（建議 3-8）
SESSION_DELAY_MIN = 0.5   # 每個會話之間的最小延遲（秒）
SESSION_DELAY_MAX = 2.0   # 每個會話之間的最大延遲（秒）
