
/**
 * HƯỚNG DẪN:
 * 1. Mở Google Sheet của bạn.
 * 2. Vào Tiện ích mở rộng (Extensions) -> Apps Script.
 * 3. Xóa hết mã cũ và dán mã này vào.
 * 4. Nhấn nút Triển khai (Deploy) -> Tạm triển khai mới (New deployment).
 * 5. Chọn loại là "Ứng dụng web" (Web App).
 * 6. "Người có quyền truy cập" chọn "Bất kỳ ai" (Anyone).
 * 7. Copy link Web App dán vào phần Cài đặt trong ứng dụng Quiz.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Nếu sheet trống, tạo header
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["timestamp", "studentId", "studentName", "score", "correctCount", "aiFeedback"]);
    }
    
    sheet.appendRow([
      data.timestamp,
      data.studentId,
      data.studentName,
      data.score,
      data.correctCount,
      data.aiFeedback
    ]);
    
    return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput("Error: " + err.message).setMimeType(ContentService.MimeType.TEXT);
  }
}

function doGet() {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var rows = sheet.getDataRange().getValues();
    var headers = rows.shift();
    
    var jsonData = rows.map(function(row) {
      var obj = {};
      headers.forEach(function(header, i) {
        obj[header] = row[i];
      });
      return obj;
    });
    
    // Sắp xếp điểm cao lên đầu
    jsonData.sort(function(a, b) {
      return b.score - a.score;
    });
    
    return ContentService.createTextOutput(JSON.stringify(jsonData))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({error: err.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
