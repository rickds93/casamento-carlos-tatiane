# Google Apps Script — Deploy Guide (RSVP collection)

This file explains how to deploy the included Google Apps Script (apps-script/Code.gs) as a Web App that accepts POST requests and saves RSVPs into a Google Sheet.

1) Create a Google Spreadsheet to receive responses
- Go to Google Drive -> New -> Google Sheets
- Name it e.g. "RSVP Responses – Carlos & Tatiane"
- Note its Spreadsheet ID: in the URL https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit

2) Open Google Apps Script
- In the spreadsheet: Extensions -> Apps Script
- In the Apps Script editor, replace the default code with the contents of apps-script/Code.gs from this repo.

3) Edit the script: insert your spreadsheet ID
- In Code.gs, replace the placeholder string 'SPREADSHEET_ID' with the ID you copied (keep quotes)
  Example: var ss = SpreadsheetApp.openById('1AbcDeFGhIjKlmNoPqRstUVwxYZ');

4) Save and Deploy
- Save the script (Ctrl/Cmd+S)
- Click "Deploy" -> "New deployment"
- Select "Web app"
  - Description: "RSVP web app"
  - Execute as: Me
  - Who has access: Anyone (even anonymous)
- Click "Deploy" and authorize the script when prompted.
- Copy the Web App URL shown after deployment. This is the endpoint to use in your site.

5) Configure the site
- In the repository, create a file named `config.json` (based on config.sample.json) in the repository root and set:
  {
    "appsScriptEndpoint":"https://script.google.com/macros/s/XXXXX/exec",
    "notifyEmail":"seu-email@exemplo.com"
  }
- Commit (or keep locally if you prefer). The site will POST JSON to that endpoint.

6) CORS and anonymous access
- To allow browser requests from your site, the Web App must be deployed as "Anyone (even anonymous)". Otherwise the browser will be blocked by CORS/authentication.
- The script returns a JSON response; the client expects a JSON {status:'success'} on success.

7) Viewing responses
- Responses will be appended to the sheet in the tab "RSVP Responses" with columns:
  Timestamp | Nome | E-mail | Número de convidados | Mensagem | User Agent | IP

8) Notes
- The script stores User Agent when available. Retrieving client IP is not reliable via Apps Script without extra services.
- If you prefer secured submissions (authenticated users), change access to "Only users in your domain" or similar, but that requires users to sign in.
- Do not commit secrets into a public repo. If you prefer, keep `config.json` out of the repo and add the endpoint via the Pages host or environment.

If you want, I can also prepare an automated deploy guide or a short script to programmatically create the Apps Script project via the Google Drive API — tell me and I can add steps.