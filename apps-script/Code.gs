const SPREADSHEET_ID = "1tgRHwfonek22mTBHL7pFoOswuH_vWXFS7eLrabGgkD0";
const ORDER_SHEET_NAME = "訂單";
const TODAY_BAKE_SHEET_NAME = "今日出爐";

const HEADERS = [
  "時間",
  "訂單編號",
  "姓名",
  "電話",
  "Email",
  "取貨方式",
  "日期",
  "地址或取貨時段",
  "商品明細",
  "商品小計",
  "配送費",
  "總額",
  "備註",
  "狀態",
];

function doGet(e) {
  const action = e && e.parameter && e.parameter.action;

  if (action === "todayBake") {
    const payload = getTodayBakePayload();
    return jsonOrJsonpResponse(payload, e.parameter.callback);
  }

  return ContentService.createTextOutput("勇冶手作麵包訂單 API 已啟用");
}

function doPost(e) {
  try {
    const data = parseRequestBody(e);
    const sheet = getOrderSheet();
    ensureHeaderRow(sheet);

    sheet.appendRow([
      new Date(),
      data.orderId || "",
      data.customerName || "",
      data.phone || "",
      data.email || "",
      data.deliveryType || "",
      data.date || "",
      data.address || "",
      data.itemsText || "",
      Number(data.subtotal || 0),
      Number(data.deliveryFee || 0),
      Number(data.total || 0),
      data.notes || "",
      "新訂單",
    ]);

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message });
  }
}

function getTodayBakePayload() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(TODAY_BAKE_SHEET_NAME);

  const fallback = {
    ok: true,
    dateLabel: "今日出爐",
    status: "每日更新",
    title: "今天可先詢問的品項",
    items: ["生吐司"],
    note: "實際出爐品項會依當日訂單、發酵與備料狀況調整。若品項已滿或當天未製作，店家會再和你確認改日期或替代口味。",
  };

  if (!sheet || sheet.getLastRow() === 0) {
    return fallback;
  }

  const rows = sheet.getDataRange().getDisplayValues();
  const items = [];
  let note = fallback.note;
  let status = fallback.status;
  let title = fallback.title;

  rows.forEach((row, index) => {
    const first = String(row[0] || "").trim();
    const second = String(row[1] || "").trim();

    if (!first && !second) return;

    if (first === "標題" && second) {
      title = second;
      return;
    }

    if (first === "狀態" && second) {
      status = second;
      return;
    }

    if (first === "備註" && second) {
      note = second;
      return;
    }

    if (["今日出爐", "品項", "顯示"].includes(first) && index === 0) {
      return;
    }

    if (first.toUpperCase() === "TRUE" && second) {
      items.push(second);
      return;
    }

    if (first.toUpperCase() === "FALSE") {
      return;
    }

    if (second && !first) {
      items.push(second);
      return;
    }

    if (first) {
      items.push(first);
    }
  });

  return {
    ok: true,
    dateLabel: "今日出爐",
    status,
    title,
    items: items.length > 0 ? items : fallback.items,
    note,
  };
}

function parseRequestBody(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error("沒有收到訂單資料");
  }

  return JSON.parse(e.postData.contents);
}

function getOrderSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  return spreadsheet.getSheetByName(ORDER_SHEET_NAME) || spreadsheet.insertSheet(ORDER_SHEET_NAME);
}

function ensureHeaderRow(sheet) {
  if (sheet.getLastRow() > 0) {
    return;
  }

  sheet.appendRow(HEADERS);
  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  sheet.setFrozenRows(1);
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function jsonOrJsonpResponse(payload, callback) {
  const json = JSON.stringify(payload);

  if (callback) {
    const safeCallback = String(callback).replace(/[^a-zA-Z0-9_$\.]/g, "");
    return ContentService.createTextOutput(`${safeCallback}(${json});`).setMimeType(
      ContentService.MimeType.JAVASCRIPT,
    );
  }

  return jsonResponse(payload);
}
