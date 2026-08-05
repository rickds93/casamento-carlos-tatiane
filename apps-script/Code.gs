// Code.gs — Google Apps Script to receive RSVP POSTs and send a notification email
// This version does NOT save responses to a Spreadsheet; it only sends an email to the organizer.
// Recipient is set to tatiengpro@gmail.com (change in the code if needed).
function doPost(e) {
  try {
    var raw = e.postData && e.postData.contents ? e.postData.contents : '{}';
    var data = JSON.parse(raw);

    var ua = '';
    try{ ua = (e && e.parameter && e.parameter.ua) ? e.parameter.ua : ( (e && e.headers && e.headers['User-Agent']) ? e.headers['User-Agent'] : '' ); }catch(err){ ua = ''; }

    var timestamp = new Date();

    // Send notification email to the event organizer
    try{
      var recipient = 'tatiengpro@gmail.com'; // notification recipient
      var subject = 'Nova confirmação de presença — Carlos & Tatiane';
      var body = 'Você recebeu uma nova confirmação de presença:\n\n'
        + 'Nome: ' + (data.name || '') + '\n'
        + 'E-mail: ' + (data.email || '') + '\n'
        + 'Número de convidados: ' + (data.qty || '') + '\n'
        + 'Mensagem: ' + (data.message || '') + '\n\n'
        + 'Timestamp: ' + timestamp + '\n'
        + 'User Agent: ' + ua + '\n';

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
