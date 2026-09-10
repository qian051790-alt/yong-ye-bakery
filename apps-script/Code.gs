const SPREADSHEET_ID = "請貼上你的 Google Sheet ID";
const SHEET_NAME = "訂單";

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

function doGet() {
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

function parseRequestBody(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error("沒有收到訂單資料");
  }

  return JSON.parse(e.postData.contents);
}

function getOrderSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
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
