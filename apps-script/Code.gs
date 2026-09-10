function doPost(e) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName("訂單") || spreadsheet.insertSheet("訂單");
  const data = JSON.parse(e.postData.contents);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
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
    ]);
  }

  sheet.appendRow([
    new Date(),
    data.orderId,
    data.customerName,
    data.phone,
    data.email || "",
    data.deliveryType,
    data.date,
    data.address || "",
    data.itemsText,
    data.subtotal,
    data.deliveryFee,
    data.total,
    data.notes || "",
    "新訂單",
  ]);

  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
    ContentService.MimeType.JSON,
  );
}
