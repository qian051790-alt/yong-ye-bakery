const todayBakeNotice = {
  dateLabel: "今日出爐",
  status: "每日更新",
  title: "今天可先詢問的品項",
  items: ["生吐司", "餐包（可混搭）", "蛋糕吐司", "戚風蛋糕"],
  note: "實際出爐品項會依當日訂單、發酵與備料狀況調整。若品項已滿或當天未製作，店家會再和你確認改日期或替代口味。",
};
const products = [
  {
    id: "chocolate-toast",
    name: "巧克力吐司",
    category: "生吐司",
    description: "柔軟生吐司加入巧克力香氣，適合早餐、下午茶或切片分享。",
    price: 150,
    unit: "條",
    stock: "供應中",
  },
  {
    id: "condensed-milk-toast",
    name: "煉乳牛奶生吐司",
    category: "生吐司",
    description: "煉乳與牛奶香氣溫和，口感柔軟細緻，適合每日早餐。",
    price: 130,
    unit: "條",
    stock: "供應中",
  },
  {
    id: "vegan-floss-rolls",
    name: "素肉鬆餐包",
    category: "餐包",
    description: "鹹香素肉鬆餐包，4 個一組，可與其他餐包口味混搭。",
    price: 100,
    unit: "組",
    stock: "4 個 100 元",
  },
  {
    id: "black-sesame-rolls",
    name: "黑芝麻餐包",
    category: "餐包",
    description: "黑芝麻香氣濃郁，4 個一組，可與其他餐包口味混搭。",
    price: 100,
    unit: "組",
    stock: "4 個 100 元",
  },
  {
    id: "cheese-rolls",
    name: "起司餐包",
    category: "餐包",
    description: "起司鹹香滑順，4 個一組，可與其他餐包口味混搭。",
    price: 100,
    unit: "組",
    stock: "4 個 100 元",
  },
  {
    id: "buttercream-rolls",
    name: "奶酥餐包",
    category: "餐包",
    description: "甜香奶酥內餡，4 個一組，可與其他餐包口味混搭。",
    price: 100,
    unit: "組",
    stock: "4 個 100 元",
  },
  {
    id: "vienna-rolls",
    name: "維也納餐包",
    category: "餐包",
    description: "經典維也納風味餐包，4 個一組，可與其他餐包口味混搭。",
    price: 100,
    unit: "組",
    stock: "4 個 100 元",
  },
  {
    id: "plain-rolls",
    name: "原味餐包",
    category: "餐包",
    description: "單純柔軟的原味餐包，4 個一組，可與其他餐包口味混搭。",
    price: 100,
    unit: "組",
    stock: "4 個 100 元",
  },
  {
    id: "coconut-rolls",
    name: "椰子餐包",
    category: "餐包",
    description: "椰香甜潤，4 個一組，可與其他餐包口味混搭。",
    price: 100,
    unit: "組",
    stock: "4 個 100 元",
  },
  {
    id: "plain-cake-toast",
    name: "原味蛋糕吐司",
    category: "蛋糕吐司",
    description: "原味蛋糕香氣搭配吐司口感，濕潤柔軟，適合直接享用。",
    price: 150,
    unit: "條",
    stock: "供應中",
  },
  {
    id: "black-sesame-cake-toast",
    name: "黑芝麻蛋糕吐司",
    category: "蛋糕吐司",
    description: "黑芝麻香氣濃郁，口感柔軟細緻。",
    price: 150,
    unit: "條",
    stock: "供應中",
  },
  {
    id: "chocolate-cake-toast",
    name: "巧克力蛋糕吐司",
    category: "蛋糕吐司",
    description: "巧克力香氣明顯，適合早餐與下午茶。",
    price: 150,
    unit: "條",
    stock: "供應中",
  },
  {
    id: "matcha-cake-toast",
    name: "抹茶蛋糕吐司",
    category: "蛋糕吐司",
    description: "抹茶清香搭配柔軟吐司口感，甜度溫和。",
    price: 150,
    unit: "條",
    stock: "供應中",
  },
  {
    id: "plain-chiffon-cake",
    name: "原味戚風蛋糕",
    category: "戚風蛋糕",
    description: "原味戚風蛋糕，口感輕盈柔軟。",
    price: 150,
    unit: "個",
    stock: "需預訂",
  },
  {
    id: "chocolate-chiffon-cake",
    name: "巧克力戚風蛋糕",
    category: "戚風蛋糕",
    description: "巧克力戚風蛋糕，香氣濃郁、口感蓬鬆。",
    price: 150,
    unit: "個",
    stock: "需預訂",
  },
];

const deliveryFees = {
  pickup: 0,
  local: 80,
  cold: 150,
};

const deliveryLabels = {
  pickup: "店面自取",
  local: "市區配送",
  cold: "宅配到府",
};

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwExU1WEwAFhygMKpcxF42O2oSdYA5i-0iG-41MnC3YsHFy0XERRxlsfaNpXm_xc0qIfg/exec";

const cart = new Map();

const productGrid = document.querySelector("#productGrid");
const cartItems = document.querySelector("#cartItems");
const subtotalEl = document.querySelector("#subtotal");
const deliveryFeeEl = document.querySelector("#deliveryFee");
const totalEl = document.querySelector("#total");
const orderForm = document.querySelector("#orderForm");
const orderResult = document.querySelector("#orderResult");

const currency = new Intl.NumberFormat("zh-TW", {
  style: "currency",
  currency: "TWD",
  maximumFractionDigits: 0,
});

function formatPrice(amount) {
  return currency.format(amount).replace("NT$", "NT$");
}

function renderTodayBakeNotice() {
  const noticeEl = document.querySelector("#todayBakeNotice");
  if (!noticeEl) return;

  noticeEl.innerHTML = `
    <div class="today-bake-topline">
      <span>${todayBakeNotice.dateLabel}</span>
      <strong>${todayBakeNotice.status}</strong>
    </div>
    <h3>${todayBakeNotice.title}</h3>
    <ul>
      ${todayBakeNotice.items.map((item) => `<li>${item}</li>`).join("")}
    </ul>
    <p>${todayBakeNotice.note}</p>
    <a href="#order">我要詢問或訂購</a>
  `;
}
function renderProducts() {
  productGrid.innerHTML = products
    .map(
      (product) => `
        <article class="product-card">
          <div>
            <div class="product-meta">
              <span class="category">${product.category}</span>
              <span class="stock">${product.stock}</span>
            </div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
          </div>
          <div>
            <div class="price-row">
              <span class="price">${formatPrice(product.price)}</span>
              <span>/${product.unit}</span>
            </div>
            <div class="quantity-row">
              <span>數量</span>
              <div class="stepper" aria-label="${product.name} 數量">
                <button type="button" data-action="decrease" data-id="${product.id}" aria-label="減少 ${product.name}">−</button>
                <output id="qty-${product.id}">0</output>
                <button type="button" data-action="increase" data-id="${product.id}" aria-label="增加 ${product.name}">＋</button>
              </div>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

function getDeliveryType() {
  return new FormData(orderForm).get("deliveryType") || "pickup";
}

function getSubtotal() {
  return [...cart.entries()].reduce((sum, [id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return sum + product.price * quantity;
  }, 0);
}

function getDeliveryFee(subtotal, deliveryType) {
  if (deliveryType === "local" && subtotal >= 600) {
    return 0;
  }
  return deliveryFees[deliveryType] ?? 0;
}

function renderCart() {
  const subtotal = getSubtotal();
  const deliveryType = getDeliveryType();
  const deliveryFee = subtotal > 0 ? getDeliveryFee(subtotal, deliveryType) : 0;
  const total = subtotal + deliveryFee;

  if (cart.size === 0) {
    cartItems.className = "cart-items empty";
    cartItems.textContent = "尚未選擇商品";
  } else {
    cartItems.className = "cart-items";
    cartItems.innerHTML = [...cart.entries()]
      .map(([id, quantity]) => {
        const product = products.find((item) => item.id === id);
        return `
          <div class="cart-line">
            <strong>${product.name}</strong>
            <strong>${formatPrice(product.price * quantity)}</strong>
            <small>${quantity} ${product.unit} × ${formatPrice(product.price)}</small>
            <small>${product.stock}</small>
          </div>
        `;
      })
      .join("");
  }

  subtotalEl.textContent = formatPrice(subtotal);
  deliveryFeeEl.textContent = formatPrice(deliveryFee);
  totalEl.textContent = formatPrice(total);
}

function updateQuantity(id, nextQuantity) {
  const quantity = Math.max(0, nextQuantity);
  const output = document.querySelector(`#qty-${id}`);

  if (quantity === 0) {
    cart.delete(id);
  } else {
    cart.set(id, quantity);
  }

  output.textContent = String(quantity);
  orderResult.hidden = true;
  renderCart();
}

function buildOrderSummary(formData) {
  const subtotal = getSubtotal();
  const deliveryType = formData.get("deliveryType");
  const deliveryFee = getDeliveryFee(subtotal, deliveryType);
  const total = subtotal + deliveryFee;
  const orderId = `YY-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${Math.floor(
    Math.random() * 9000 + 1000,
  )}`;

  const itemLines = [...cart.entries()].map(([id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return `- ${product.name} ${quantity}${product.unit}，${formatPrice(product.price * quantity)}`;
  });

  return {
    orderId,
    payload: {
      orderId,
      customerName: formData.get("customerName"),
      phone: formData.get("phone"),
      email: formData.get("email") || "",
      deliveryType: deliveryLabels[deliveryType],
      date: formData.get("date"),
      address: formData.get("address") || "",
      items: [...cart.entries()].map(([id, quantity]) => {
        const product = products.find((item) => item.id === id);
        return {
          id: product.id,
          name: product.name,
          quantity,
          unit: product.unit,
          unitPrice: product.price,
          lineTotal: product.price * quantity,
        };
      }),
      itemsText: itemLines.join("\n"),
      subtotal,
      deliveryFee,
      total,
      notes: formData.get("notes") || "",
    },
    text: [
      `訂單編號：${orderId}`,
      `姓名：${formData.get("customerName")}`,
      `電話：${formData.get("phone")}`,
      `Email：${formData.get("email") || "未填寫"}`,
      `取貨方式：${deliveryLabels[deliveryType]}`,
      `日期：${formData.get("date")}`,
      `地址或取貨時段：${formData.get("address") || "未填寫"}`,
      "",
      "商品：",
      ...itemLines,
      "",
      `商品小計：${formatPrice(subtotal)}`,
      `配送費：${formatPrice(deliveryFee)}`,
      `預估總額：${formatPrice(total)}`,
      "",
      `備註：${formData.get("notes") || "無"}`,
    ].join("\n"),
  };
}

async function sendOrderToGoogleSheet(order) {
  if (!GOOGLE_SCRIPT_URL) {
    throw new Error("Google Sheet 尚未串接。");
  }

  await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(order.payload),
  });
}

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = button.dataset.id;
  const currentQuantity = cart.get(id) || 0;
  const nextQuantity =
    button.dataset.action === "increase" ? currentQuantity + 1 : currentQuantity - 1;

  updateQuantity(id, nextQuantity);
});

orderForm.addEventListener("change", renderCart);

orderForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (cart.size === 0) {
    orderResult.hidden = false;
    orderResult.innerHTML = "<h4>還沒有商品</h4><p>請先選擇至少一項麵包或甜點。</p>";
    return;
  }

  const formData = new FormData(orderForm);
  const order = buildOrderSummary(formData);

  orderResult.hidden = false;
  orderResult.innerHTML = `
    <h4>正在送出訂單</h4>
    <p>請稍候，系統正在把訂單送到店家後台。</p>
    <pre>${order.text}</pre>
  `;

  try {
    await sendOrderToGoogleSheet(order);
    orderResult.innerHTML = `
      <h4>訂單已送出</h4>
      <p>我們已收到你的訂單，店家會依照資料確認品項與取貨安排。</p>
      <pre>${order.text}</pre>
      <button class="copy-button" type="button">複製訂單內容</button>
    `;
  } catch (error) {
    orderResult.innerHTML = `
      <h4>訂單已產生，但尚未送到後台</h4>
      <p>${error.message} 請先複製訂單內容給店家，或稍後再試一次。</p>
      <pre>${order.text}</pre>
      <button class="copy-button" type="button">複製訂單內容</button>
    `;
  }

  orderResult.querySelector(".copy-button").addEventListener("click", async () => {
    await navigator.clipboard.writeText(order.text);
    orderResult.querySelector(".copy-button").textContent = "已複製";
  });
});

renderTodayBakeNotice();
renderProducts();
renderCart();

