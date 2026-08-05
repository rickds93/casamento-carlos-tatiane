// Code.gs — Google Apps Script to receive RSVP POSTs and save into a Google Sheet
// This version appends the response to the sheet AND sends a notification email to tatiengpro@gmail.com
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

    var ua = '';
    try{ ua = (e && e.parameter && e.parameter.ua) ? e.parameter.ua : ( (e && e.headers && e.headers['User-Agent']) ? e.headers['User-Agent'] : '' ); }catch(err){ ua = ''; }

    var timestamp = new Date();
    var row = [timestamp, data.name || '', data.email || '', data.qty || '', data.message || '', ua, ''];
    sheet.appendRow(row);

    // Send notification email to the event organizer
    try{
      var recipient = 'tatiengpro@gmail.com'; // <-- notification recipient
      var subject = 'Nova confirmação de presença — Carlos & Tatiane';
      var body = 'Você recebeu uma nova confirmação de presença:\n\n'
        + 'Nome: ' + (data.name || '') + '\n'
        + 'E-mail: ' + (data.email || '') + '\n'
        + 'Número de convidados: ' + (data.qty || '') + '\n'
        + 'Mensagem: ' + (data.message || '') + '\n\n'
        + 'Timestamp: ' + timestamp + '\n'
        + 'User Agent: ' + ua + '\n';

      // replyTo set to the guest email so organizer can reply directly
      var options = {};
      if(data.email) options.replyTo = data.email;
      MailApp.sendEmail(recipient, subject, body, options);
    }catch(mailErr){
      // Log but do not fail the request
      Logger.log('Mail send error: ' + mailErr.message);
    }

    var output = ContentService.createTextOutput(JSON.stringify({status:'success'}));
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
  } catch(err) {
    var output = ContentService.createTextOutput(JSON.stringify({status:'error', message: err.message}));
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
  }
}
