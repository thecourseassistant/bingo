export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * Google Apps Script for Classroom Bingo
 * 
 * OPTION 1 (Recommended): Open your Google Sheet, click Extensions -> Apps Script.
 *   Leave SPREADSHEET_URL empty ("") because it automatically connects to your sheet!
 * 
 * OPTION 2: If using a standalone script (script.google.com), paste your Google Sheet URL below.
 */
var SPREADSHEET_URL = ""; // e.g. "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit"

function getSheet() {
  if (SPREADSHEET_URL && SPREADSHEET_URL.trim() !== "") {
    try {
      if (SPREADSHEET_URL.indexOf("http") === 0) {
        return SpreadsheetApp.openByUrl(SPREADSHEET_URL.trim()).getActiveSheet();
      } else {
        return SpreadsheetApp.openById(SPREADSHEET_URL.trim()).getActiveSheet();
      }
    } catch (e) {
      // Fallback
    }
  }
  return SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
}

function doPost(e) {
  try {
    var sheet = getSheet();
    
    // Auto-create headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Student Name",
        "Student ID / Class",
        "Win Pattern",
        "Winning Numbers",
        "Proof Code",
        "Card Seed",
        "Grid Size"
      ]);
      // Format header row
      var headerRange = sheet.getRange(1, 1, 1, 8);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#4f46e5");
      headerRange.setFontColor("#ffffff");
    }

    var data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }

    var timestamp = new Date().toLocaleString();
    var studentName = data.studentName || "Anonymous Student";
    var studentId = data.studentId || "N/A";
    var winPattern = data.winPattern || "Bingo";
    var winningNumbers = data.winningNumbers || "";
    var proofCode = data.proofCode || "";
    var cardSeed = data.cardSeed || "";
    var gridSize = data.gridSize ? data.gridSize + "x" + data.gridSize : "4x4";

    sheet.appendRow([
      timestamp,
      studentName,
      studentId,
      winPattern,
      winningNumbers,
      proofCode,
      cardSeed,
      gridSize
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "message": "Bingo recorded successfully!" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  if (e && e.parameter && e.parameter.studentName) {
    return doPost(e);
  }
  return ContentService
    .createTextOutput(JSON.stringify({ "status": "Classroom Bingo Apps Script is Live!", "timestamp": new Date().toISOString() }))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
