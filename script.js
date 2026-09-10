const products = [
  {
    id: "milk-toast",
    name: "鮮奶吐司",
    category: "吐司",
    description: "柔軟濕潤，適合早餐與三明治。",
    price: 120,
    unit: "條",
    stock: "供應中",
  },
  {
    id: "salt-roll",
    name: "海鹽奶油捲",
    category: "麵包",
    description: "外層微脆，奶油香氣清楚。",
    price: 45,
    unit: "個",
    stock: "供應中",
  },
  {
    id: "croissant",
    name: "法式可頌",
    category: "酥皮",
    description: "層次酥鬆，建議當日享用。",
    price: 65,
    unit: "個",
    stock: "限量",
  },
  {
    id: "sourdough",
    name: "天然酵母鄉村麵包",
    category: "歐式",
    description: "麥香厚實，適合搭配湯品與起司。",
    price: 180,
    unit: "顆",
    stock: "供應中",
  },
  {
    id: "berry-danish",
    name: "莓果丹麥",
    category: "甜點",
    description: "酥皮搭配酸甜莓果餡。",
    price: 75,
    unit: "個",
    stock: "限量",
  },
  {
    id: "walnut-bread",
    name: "核桃葡萄乾麵包",
    category: "麵包",
    description: "堅果香與果乾甜味平衡。",
    price: 95,
    unit: "個",
    stock: "供應中",
  },
  {
    id: "cake-roll",
    name: "蜂蜜蛋糕捲",
    category: "甜點",
    description: "清爽奶餡，適合下午茶。",
    price: 260,
    unit: "條",
    stock: "需預訂",
  },
  {
    id: "gift-box",
    name: "人氣麵包禮盒",
    category: "禮盒",
    description: "六入綜合麵包，可客製祝福卡。",
    price: 520,
    unit: "盒",
    stock: "需預訂",
  },
];

const deliveryFees = {
  pickup: 0,
  local: 80,
  cold: 160,
};

const deliveryLabels = {
  pickup: "店面自取",
  local: "市區配送",
  cold: "冷藏宅配",
};

const GOOGLE_SCRIPT_URL = "";

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

renderProducts();
renderCart();
