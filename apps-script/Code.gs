/**
 * Kumaran M — Portfolio Backend (Google Apps Script)
 * ---------------------------------------------------
 * Powers three things for the portfolio site:
 *   1. GET  ?action=read   → public read of live projects / experience / profile overrides
 *   2. POST { type:'contact', ... }  → stores a contact-form message as a Sheet row + sends
 *      the visitor a professional thank-you auto-reply email
 *   3. POST { type:'admin', adminKey, resource, action, item, id }  → authenticated CRUD
 *      for projects, experience, profile fields, and reading stored messages — this is what
 *      the /admin page on the site calls.
 *
 * SETUP — see ADMIN_SETUP.md in the repo for the full walkthrough. Short version:
 *   1. Create a Google Sheet. Copy its ID from the URL.
 *   2. Extensions → Apps Script. Paste this whole file in as Code.gs.
 *   3. Project Settings → Script Properties → add:
 *        SHEET_ID    = <your spreadsheet ID>
 *        ADMIN_KEY   = <a long random password you invent — this guards /admin>
 *        OWNER_EMAIL = <where you want new-message notifications sent> (optional)
 *   4. Deploy → New deployment → Web app.
 *        Execute as: Me
 *        Who has access: Anyone
 *   5. Copy the deployment URL into `scriptEndpoint` in src/data/portfolioData.js.
 *   6. First run: open the deployed URL once with ?action=read in a browser and grant
 *      the permissions Google asks for (Sheet + Mail access). This also auto-creates
 *      the required sheet tabs (Projects, Experience, Profile, Messages) with headers.
 */

const SHEETS = {
  PROJECTS: 'Projects',
  EXPERIENCE: 'Experience',
  PROFILE: 'Profile',
  MESSAGES: 'Messages',
};

function doGet(e) {
  const action = e && e.parameter ? e.parameter.action : null;
  if (action === 'read') {
    return jsonOutput({
      ok: true,
      data: {
        projects: readProjects(),
        experience: readExperience(),
        profile: readProfile(),
      },
    });
  }
  return jsonOutput({ ok: false, message: 'Unknown or missing action.' });
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonOutput({ ok: false, message: 'Malformed request body.' });
  }

  if (body.type === 'contact') return handleContact(body);
  if (body.type === 'admin') return handleAdmin(body);
  return jsonOutput({ ok: false, message: 'Unknown request type.' });
}

function handleContact(body) {
  const name = (body.name || '').toString().trim();
  const email = (body.email || '').toString().trim();
  const message = (body.message || '').toString().trim();
  const budget = (body.budget || '').toString().trim();

  if (!name || !email || !message) {
    return jsonOutput({ ok: false, message: 'Name, email, and message are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonOutput({ ok: false, message: 'That email address looks invalid.' });
  }

  const sheet = ensureSheet(SHEETS.MESSAGES, ['Timestamp', 'Name', 'Email', 'Budget / Timeline', 'Message']);
  sheet.appendRow([new Date(), name, email, budget, message]);

  try {
    sendThankYouEmail(name, email, message);
  } catch (err) {
    // The message is already saved — don't fail the whole request just because
    // the auto-reply email couldn't be sent (e.g. quota, bad address).
  }

  try {
    notifyOwner(name, email, budget, message);
  } catch (err) {
    // Non-fatal — owner can still see it in the sheet.
  }

  return jsonOutput({ ok: true, message: 'Message received.' });
}

function sendThankYouEmail(name, email, message) {
  const profile = readProfile();
  const displayName = profile.senderName || 'Kumaran M';
  const firstName = name.split(' ')[0];
  const subject = 'Thanks for reaching out, ' + firstName + '!';

  const plainBody =
    'Hi ' + firstName + ',\n\n' +
    "Thank you for choosing to reach out — I've received your message and really appreciate you taking the time to share the details of your project.\n\n" +
    "Here's a quick copy of what you sent, for your records:\n\"" + message + '"\n\n' +
    'I personally review every inquiry and will get back to you within one business day with next steps or any clarifying questions.\n\n' +
    'In the meantime, feel free to explore more of my work or connect on LinkedIn.\n\n' +
    'Best regards,\n' + displayName;

  const htmlBody =
    '<div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;color:#1a1a1a;line-height:1.6;">' +
    '<h2 style="margin-bottom:4px;">Thank you for choosing to reach out, ' + escapeHtml(firstName) + '!</h2>' +
    "<p>I've received your message and really appreciate you taking the time to share the details of your project.</p>" +
    '<blockquote style="border-left:3px solid #0284C7;padding:10px 16px;color:#444;background:#f6f8fa;margin:16px 0;">' + escapeHtml(message) + '</blockquote>' +
    '<p>I personally review every inquiry and will get back to you within <strong>one business day</strong> with next steps or any clarifying questions.</p>' +
    '<p style="margin-top:28px;">Best regards,<br><strong>' + escapeHtml(displayName) + '</strong></p>' +
    '</div>';

  MailApp.sendEmail({
    to: email,
    subject: subject,
    body: plainBody,
    htmlBody: htmlBody,
  });
}

function notifyOwner(name, email, budget, message) {
  const ownerEmail = getProperty('OWNER_EMAIL') || Session.getEffectiveUser().getEmail();
  if (!ownerEmail) return;
  const subject = 'New portfolio inquiry from ' + name;
  const body =
    'New message via your portfolio contact form:\n\n' +
    'Name: ' + name + '\nEmail: ' + email + '\nBudget/timeline: ' + (budget || '—') + '\n\nMessage:\n' + message;
  MailApp.sendEmail(ownerEmail, subject, body);
}

function handleAdmin(body) {
  const adminKey = getProperty('ADMIN_KEY');
  if (!adminKey || body.adminKey !== adminKey) {
    return jsonOutput({ ok: false, message: 'Invalid admin key.' });
  }

  const resource = body.resource;
  const action = body.action;
  const item = body.item;
  const id = body.id;

  if (resource === 'auth' && action === 'verify') {
    return jsonOutput({ ok: true, message: 'Verified.' });
  }

  if (resource === 'messages' && action === 'list') {
    return jsonOutput({ ok: true, data: readMessages() });
  }

  if (resource === 'project') return handleCrud(SHEETS.PROJECTS, action, item, id, readProjects);
  if (resource === 'experience') return handleCrud(SHEETS.EXPERIENCE, action, item, id, readExperience);

  if (resource === 'profile' && action === 'update') {
    updateProfile(item || {});
    return jsonOutput({ ok: true, message: 'Profile updated.', data: readProfile() });
  }

  return jsonOutput({ ok: false, message: 'Unknown admin resource/action.' });
}

function handleCrud(sheetName, action, item, id, readerFn) {
  const sheet = ensureSheet(sheetName, ['id', 'json']);

  if (action === 'create') {
    if (!item || !item.id) return jsonOutput({ ok: false, message: 'Missing item id.' });
    if (findRowById(sheet, item.id) !== -1) {
      return jsonOutput({ ok: false, message: 'An item with id "' + item.id + '" already exists.' });
    }
    sheet.appendRow([item.id, JSON.stringify(item)]);
    return jsonOutput({ ok: true, message: 'Created.', data: readerFn() });
  }

  if (action === 'update') {
    if (!id) return jsonOutput({ ok: false, message: 'Missing id to update.' });
    const row = findRowById(sheet, id);
    if (row === -1) return jsonOutput({ ok: false, message: 'No item found with id "' + id + '".' });
    const finalItem = Object.assign({}, item, { id: id });
    sheet.getRange(row, 2).setValue(JSON.stringify(finalItem));
    return jsonOutput({ ok: true, message: 'Updated.', data: readerFn() });
  }

  if (action === 'delete') {
    if (!id) return jsonOutput({ ok: false, message: 'Missing id to delete.' });
    const row = findRowById(sheet, id);
    if (row === -1) return jsonOutput({ ok: false, message: 'No item found with id "' + id + '".' });
    sheet.deleteRow(row);
    return jsonOutput({ ok: true, message: 'Deleted.', data: readerFn() });
  }

  return jsonOutput({ ok: false, message: 'Unknown action.' });
}

function findRowById(sheet, id) {
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(id)) return i + 1; // 1-indexed sheet row
  }
  return -1;
}

function readProjects() {
  return readJsonSheet(SHEETS.PROJECTS);
}

function readExperience() {
  return readJsonSheet(SHEETS.EXPERIENCE);
}

function readJsonSheet(name) {
  const sheet = ensureSheet(name, ['id', 'json']);
  const values = sheet.getDataRange().getValues();
  const out = [];
  for (let i = 1; i < values.length; i++) {
    const raw = values[i][1];
    if (!raw) continue;
    try {
      out.push(JSON.parse(raw));
    } catch (err) {
      // skip malformed row rather than failing the whole read
    }
  }
  return out;
}

function readProfile() {
  const sheet = ensureSheet(SHEETS.PROFILE, ['key', 'value']);
  const values = sheet.getDataRange().getValues();
  const out = {};
  for (let i = 1; i < values.length; i++) {
    const key = values[i][0];
    const value = values[i][1];
    if (key) out[key] = value;
  }
  return out;
}

function updateProfile(item) {
  const sheet = ensureSheet(SHEETS.PROFILE, ['key', 'value']);
  Object.keys(item).forEach(function (key) {
    const values = sheet.getDataRange().getValues();
    let found = -1;
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === key) { found = i + 1; break; }
    }
    if (found === -1) {
      sheet.appendRow([key, item[key]]);
    } else {
      sheet.getRange(found, 2).setValue(item[key]);
    }
  });
}

function readMessages() {
  const sheet = ensureSheet(SHEETS.MESSAGES, ['Timestamp', 'Name', 'Email', 'Budget / Timeline', 'Message']);
  const values = sheet.getDataRange().getValues();
  const out = [];
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const timestamp = row[0];
    const name = row[1];
    const email = row[2];
    const budget = row[3];
    const message = row[4];
    if (!name && !email && !message) continue;
    out.push({
      timestamp: timestamp instanceof Date ? timestamp.toLocaleString() : String(timestamp),
      name: name,
      email: email,
      budget: budget,
      message: message,
    });
  }
  return out.reverse(); // newest first
}


function getSpreadsheet() {
  const id = getProperty('SHEET_ID');
  if (!id) throw new Error('Missing SHEET_ID script property.');
  return SpreadsheetApp.openById(id);
}

function ensureSheet(name, headers) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getProperty(key) {
  return PropertiesService.getScriptProperties().getProperty(key);
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}


function checkProps() {
  Logger.log('SHEET_ID = [' + PropertiesService.getScriptProperties().getProperty('SHEET_ID') + ']');
  Logger.log('ADMIN_KEY = [' + PropertiesService.getScriptProperties().getProperty('ADMIN_KEY') + ']');
  Logger.log('OWNER_EMAIL = [' + PropertiesService.getScriptProperties().getProperty('OWNER_EMAIL') + ']');
}