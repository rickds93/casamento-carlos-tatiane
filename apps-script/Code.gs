// Code.gs — sends HTML email including phone, adults, kids
// Envie POST JSON com: { name, email, phone, adults, kids, message }
// Reply-To será o e-mail do convidado quando fornecido.
function doPost(e) {
  try {
    var raw = e.postData && e.postData.contents ? e.postData.contents : '{}';
    var data = JSON.parse(raw);

    var ua = '';
    try { ua = (e && e.parameter && e.parameter.ua) ? e.parameter.ua : ((e && e.headers && e.headers['User-Agent']) ? e.headers['User-Agent'] : ''); } catch(err) { ua = ''; }

    var timestamp = new Date();

    // Plain-text fallback
    var plainBody = 'Você recebeu uma nova confirmação de presença:\n\n'
      + 'Nome: ' + (data.name || '') + '\n'
      + 'E-mail: ' + (data.email || '') + '\n'
      + 'Telefone: ' + (data.phone || '') + '\n'
      + 'Adultos: ' + (data.adults || '') + '\n'
      + 'Crianças: ' + (data.kids || '') + '\n'
      + 'Mensagem: ' + (data.message || '') + '\n\n'
      + 'Timestamp: ' + timestamp + '\n'
      + 'User Agent: ' + ua + '\n';

    // HTML body
    var htmlBody = '<div style="font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif; color:#222; line-height:1.45;">'
      + '<h2 style="color:#C79282; margin:0 0 8px 0;">Nova confirmação de presença</h2>'
      + '<table cellpadding="6" cellspacing="0" style="border-collapse:collapse; font-size:14px; color:#333;">'
      + rowHtml('Nome', escapeHtml(data.name || ''))
      + rowHtml('E-mail', escapeHtml(data.email || ''))
      + rowHtml('Telefone', escapeHtml(data.phone || ''))
      + rowHtml('Adultos', escapeHtml(String(data.adults || '')))
      + rowHtml('Crianças', escapeHtml(String(data.kids || '')))
      + rowHtml('Mensagem', escapeHtml(data.message || ''))
      + rowHtml('Timestamp', String(timestamp))
      + rowHtml('User Agent', escapeHtml(ua))
      + '</table>'
      + '<p style="color:#666; font-size:13px; margin-top:12px;">Este é um e‑mail automático enviado pelo site de convite.</p>'
      + '</div>';

    // Send email
    try {
      var recipient = 'tatiengpro@gmail.com';
      var subject = 'Nova confirmação de presença — Carlos & Tatiane';
      var options = { htmlBody: htmlBody };
      if (data.email) options.replyTo = data.email;
      MailApp.sendEmail(recipient, subject, plainBody, options);
    } catch (mailErr) {
      Logger.log('Mail send error: ' + mailErr.message);
    }

    var output = ContentService.createTextOutput(JSON.stringify({ status: 'success' }));
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
  } catch (err) {
    var output = ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.message }));
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
  }
}

// Helpers
function rowHtml(label, value){
  return '<tr>'
    + '<td style="vertical-align:top; font-weight:600; padding-right:12px; color:#444;">' + label + '</td>'
    + '<td style="vertical-align:top; padding-bottom:6px;">' + value + '</td>'
    + '</tr>';
}
function escapeHtml(str){
  if (!str && str !== 0) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
