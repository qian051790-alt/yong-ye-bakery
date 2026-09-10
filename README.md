# yong-ye-bakery

這是「勇冶手作麵包」的靜態網站，適合放在 GitHub Pages。網站包含商品展示、價格、送貨服務說明，以及一個可讓顧客建立訂單摘要的前端訂購流程。

## 功能

- 商品分類、價格、單位與庫存狀態
- 店面自取、市區配送、冷藏宅配費用計算
- 顧客資料與取貨資訊表單
- 自動產生訂單編號、訂單明細與預估總額
- 一鍵複製訂單內容，方便貼到 Email、LINE 或店家後台

## Repo 結構

```text
.
├── index.html
├── styles.css
├── script.js
├── assets/
│   └── bakery-counter.png
└── README.md
```

## GitHub Pages 上線方式

1. 在 GitHub 建立一個新的 public repository，建議名稱為 `yong-ye-bakery`。
2. 將這個資料夾的內容推送到 `qian051790-alt/yong-ye-bakery`。
3. 到 repo 的 `Settings` > `Pages`。
4. Source 選擇 `Deploy from a branch`。
5. Branch 選擇 `main`，資料夾選擇 `/root`。

完成後，網站會出現在：

```text
https://yong-ye-bakery.com/
```

GitHub Pages 的預設網址仍會是：

```text
https://qian051790-alt.github.io/yong-ye-bakery/
```

這個 repo 已包含 `CNAME` 檔案，內容為 `yong-ye-bakery.com`，用來讓 GitHub Pages 綁定自訂網域。

## 調整商品

商品資料在 `script.js` 的 `products` 陣列中。可以修改：

- `name`：商品名稱
- `category`：商品分類
- `description`：商品介紹
- `price`：價格
- `unit`：單位
- `stock`：庫存狀態

## 正式接單建議

目前這個版本適合 GitHub Pages，訂單只會在顧客瀏覽器中產生摘要，不會自動存進資料庫。若要正式營運，建議下一步串接：

- Email 表單服務，例如 Formspree、Basin
- LINE 官方帳號或 LINE Notify 替代流程
- 後端 API 與資料庫，例如 Supabase、Firebase、Cloudflare Workers + D1
- 金流服務，例如綠界、藍新、Stripe

顧客姓名、電話、Email、地址等個資不應該提交到公開 repository。
