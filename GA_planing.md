**✅ GA4 事件嵌入完整用例（直接給 Agent 使用）**

以下內容已針對你的 **50 種電腦硬件商品列表** 設計，結合之前規劃的 **Funnel Exploration 分析任務**（重點觀察 add_to_cart → begin_checkout 流失）。

我為你準備了：
- 所有需要嵌入的事件總覽
- 真實產品 ID / 名稱範例（可直接使用）
- **5 個完整模擬用戶旅程案例**（不同行為，涵蓋多種事件）
- 每個事件**精確的嵌入位置建議**（告訴 Agent 在哪個 HTML/JS 部分加什麼程式碼）

---

### **1. 事件總覽表（Agent 必須實作）**

| 事件名稱              | 類型          | 觸發時機                              | 必須帶的參數（重點）                          | 建議嵌入位置 |
|-----------------------|---------------|---------------------------------------|-----------------------------------------------|-------------|
| `view_item_list`     | Ecommerce    | 進入首頁或類別列表頁                  | `item_list_id`, `item_list_name`             | 頁面載入時 |
| `select_item`        | Ecommerce    | 點擊產品卡片                          | `items` 陣列（單一商品）                     | 產品卡片 `onclick` |
| `view_item`          | Ecommerce    | 進入產品詳情頁                        | `items` 陣列（完整資訊）                     | 產品詳情頁載入時 |
| `add_to_cart`        | Ecommerce    | 點擊「加入購物車」按鈕                | `items` 陣列 + `value`                       | 「加入購物車」按鈕 `onclick` |
| `begin_checkout`     | Ecommerce    | 點擊「開始結帳」或進入結帳頁          | `items` 陣列 + `value`                       | 結帳按鈕或購物車頁載入 |
| `purchase`           | Ecommerce    | 完成購買（模擬結帳成功）              | `transaction_id`, `value`, `currency: "HKD"`, `items` | 結帳成功頁面 |
| `search`             | Custom       | 使用搜尋欄                            | `search_term`                                | 搜尋按鈕或 input `onchange` |
| `filter_applied`     | Custom       | 套用任何篩選（類別、價格、品牌）      | `filter_type`, `filter_value`                | 篩選器 `onchange` |
| `sort_applied`       | Custom       | 改變排序方式                          | `sort_type`                                  | 排序下拉選單 `onchange` |

---

### **2. 產品 ID / 名稱範例（直接抄給 Agent）**

以下是從你列表中挑選的真實範例（可擴充到 50 種）：

- **筆記型電腦**：`LAP-ASUS-G14-2026` → "ASUS ROG Zephyrus G14"
- **手機**：`PHN-APPLE-IP16P` → "Apple iPhone 16 Pro"
- **顯示卡**：`GPU-ASUS-RTX4090` → "ASUS ROG Strix GeForce RTX 4090"
- **主機板**：`MB-MSI-Z790` → "MSI MPG Z790 Edge WiFi"
- **顯示器**：`MON-GIG-M32UC` → "GIGABYTE M32UC 32吋 4K"
- **耳機**：`AUD-APPLE-APM` → "Apple AirPods Max"
- **鍵鼠周邊**：`PER-ASUS-ROGSCOPE` → "ASUS ROG Strix Scope II 機械鍵盤"
- **平板**：`TAB-ASUS-ZEN9` → "ASUS Zenbook Duo (平板模式)"

**item_category 統一使用你提供的分類**：  
`"筆記型電腦"`、`"手機"`、`"平板電腦"`、`"顯示卡"`、`"主機板"`、`"顯示器"`、`"耳機/音頻"`、`"智慧手錶"`、`"鍵鼠周邊"`、`"網絡設備"`

---

### **3. 5 個模擬用戶旅程案例（Agent 產生數據時參考）**

#### **案例 1：高意向購買者（完整漏斗 + 購買）** ← 產生 purchase 數據
1. 進入首頁 → `view_item_list`
2. 搜尋「RTX 4090」 → `search` (`search_term: "RTX 4090"`)
3. 篩選「顯示卡」+ 價格 > HK$4000 → `filter_applied` (x2)
4. 點擊 ASUS ROG Strix RTX 4090 → `select_item` + `view_item`
5. 加入購物車 → `add_to_cart`
6. 點擊「開始結帳」 → `begin_checkout`
7. 完成購買（模擬） → `purchase`（transaction_id: "TX-20260429-001", value: 5899）

#### **案例 2：加購物車後放棄（主要問題點）** ← 重點產生 add_to_cart 但無 begin_checkout
1. 進入「顯示卡」類別頁 → `view_item_list`
2. 點擊 3 個不同顯示卡查看詳情 → `view_item` x3
3. 加入 2 個商品到購物車 → `add_to_cart` x2
4. 進入購物車頁面但離開 → **不觸發 begin_checkout**（模擬流失）

#### **案例 3：重度篩選 + 比較型用戶**
1. 進入首頁 → `view_item_list`
2. 篩選「筆記型電腦」→ `filter_applied`
3. 排序「價格低到高」 → `sort_applied`
4. 再篩選品牌「ASUS」→ `filter_applied`
5. 點擊 2 個筆電查看 → `view_item` x2
6. 只加入其中 1 個 → `add_to_cart`

#### **案例 4：移動端快速瀏覽者（低轉換）**
1. 進入首頁（模擬 mobile） → `view_item_list`
2. 快速點擊 8 個不同類別產品 → `view_item` x8
3. 沒有任何 add_to_cart

#### **案例 5：多品項購物車購買者**
1. 加入 1 個筆電 + 1 個顯示器 + 1 個鍵盤 → `add_to_cart` x3
2. 進入結帳 → `begin_checkout`
3. 完成購買（value 累加） → `purchase`

---

### **4. 程式碼嵌入位置建議（直接給 Agent）**

**A. 全域 JS 函數（建議放在 `<head>` 或獨立 `ga4-events.js`）**
```js
function trackGA4(eventName, params) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, params);
  }
}
```

**B. 具體嵌入位置：**

1. **首頁 / 類別列表頁**（產品卡片）
```html
<div class="product-card" 
     onclick="trackGA4('select_item', { items: [{ item_id: 'GPU-ASUS-RTX4090', item_name: 'ASUS ROG Strix GeForce RTX 4090', item_brand: 'ASUS', item_category: '顯示卡', price: 5899 }] }); window.location='product.html?id=GPU-ASUS-RTX4090';">
```

2. **產品詳情頁載入時**
```html
<script>
  window.onload = function() {
    trackGA4('view_item', {
      items: [{ item_id: 'LAP-ASUS-G14-2026', item_name: 'ASUS ROG Zephyrus G14', item_brand: 'ASUS', item_category: '筆記型電腦', price: 12499 }]
    });
  }
</script>
```

3. **「加入購物車」按鈕**
```html
<button onclick="trackGA4('add_to_cart', { 
  items: [{ item_id: 'GPU-ASUS-RTX4090', ... }], 
  value: 5899 
}); addToCart('GPU-ASUS-RTX4090');">
  加入購物車
</button>
```

4. **搜尋欄**
```html
<input type="text" onkeyup="if (event.key === 'Enter') trackGA4('search', { search_term: this.value });">
```

5. **篩選器 / 排序**
```html
<select onchange="trackGA4('filter_applied', { filter_type: 'category', filter_value: this.value });">
  <option value="顯示卡">顯示卡</option>
</select>
```

6. **開始結帳按鈕**
```html
<button onclick="trackGA4('begin_checkout', { items: [...], value: 16888 }); goToCheckout();">
  開始結帳
</button>
```

7. **購買成功頁（模擬結帳完成）**
```html
<script>
  trackGA4('purchase', {
    transaction_id: 'TX-' + Date.now(),
    value: 16888,
    currency: 'HKD',
    items: [ /* 多個商品 */ ]
  });
</script>
```

---

**下一步：**

請你把以上 **全部內容** 直接複製貼給你的 Agent，並告訴他：

> 「請根據這個 GA4 用例文件，在網站所有相關位置嵌入追蹤程式碼。事件名稱與參數必須完全一致。產品 ID 請使用我提供的範例，並可自行擴充到 50 種商品。」

---
