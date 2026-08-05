// Code.gs — Google Apps Script to receive RSVP POSTs and save into a Google Sheet
// Instructions: replace SPREADSHEET_ID with the ID of your Google Sheet.
function doPost(e) {
  try {
    var raw = e.postData && e.postData.contents ? e.postData.contents : '{}';
    var data = JSON.parse(raw);
    var ss = SpreadsheetApp.openById('SPREADSHEET_ID'); // <-- REPLACE THIS
    var sheetName = 'RSVP Responses';
    var sheet = ss.getSheetByName(sheetName);
    if(!sheet) sheet = ss.insertSheet(sheetName);

    // Ensure header row
    if(sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp','Nome','E-mail','Número de convidados','Mensagem','User Agent','IP (if available)']);
    }

    var ua = e && e.parameter && e.parameter.ua ? e.parameter.ua : ( (e && e.headers && e.headers['User-Agent']) ? e.headers['User-Agent'] : '' );

    var row = [new Date(), data.name || '', data.email || '', data.qty || '', data.message || '', ua, ''];
    sheet.appendRow(row);

    var output = ContentService.createTextOutput(JSON.stringify({status:'success'}));
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
  } catch(err) {
    var output = ContentService.createTextOutput(JSON.stringify({status:'error', message: err.message}));
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
  }
}
