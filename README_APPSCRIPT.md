# Google Apps Script — Deploy Guide (RSVP collection, email-only)

This repository contains a Google Apps Script that accepts POST requests and sends RSVP notifications by e‑mail. It no longer writes responses to a Google Sheet — all submissions trigger an e‑mail to the organizer (tatiengpro@gmail.com).

Steps to deploy the Web App

1) Open Google Apps Script
- Go to https://script.google.com or, from any Google Drive item: New -> More -> Google Apps Script
- Create a new project and replace the default code with the contents of apps-script/Code.gs from this repo.

2) (Optional) Edit recipient
- By default the script sends notifications to: tatiengpro@gmail.com
- If you want to change it, edit the `recipient` variable in Code.gs.

3) Save and Deploy
- Save the script (Ctrl/Cmd+S)
- Click "Deploy" -> "New deployment"
- Select "Web app"
  - Description: "RSVP web app"
  - Execute as: Me
  - Who has access: Anyone (even anonymous)
- Click "Deploy" and authorize the script when prompted.
- Copy the Web App URL shown after deployment. This is the endpoint to use in your site.

4) Configure the site
- In the repository, create a file named `config.json` (based on config.sample.json) in the repository root and set:
  {
    "appsScriptEndpoint":"https://script.google.com/macros/s/XXXXX/exec",
    "notifyEmail":"tatiengpro@gmail.com"
  }
- The site will POST JSON to that endpoint. If config.json is missing, confirmar-presenca.html falls back to mailto behavior.

5) Test
- Visit confirmar-presenca.html (or click Confirmar Presença on the site), submit the form and verify that an email is received at tatiengpro@gmail.com. The Reply-To header will be set to the guest email when provided.

Notes
- MailApp requires authorization to send email; on first deploy you'll be prompted to grant permissions.
- MailApp has daily quotas per Google account — for normal RSVP volumes this is usually fine. If you expect many automated submissions, consider rate limits.
- The Web App must allow "Anyone (even anonymous)" if you want browser clients to POST without authentication.

If you later want to store the responses in a Sheet as well, I can add the appendRow code back (or write to Drive/Cloud storage).
