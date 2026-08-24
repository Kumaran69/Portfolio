import { scriptEndpoint } from '../data/portfolioData'

/**
 * Reads live portfolio data (profile overrides, projects, experience) from
 * the Apps Script Web App. Returns null on any failure so callers can fall
 * back to the static seed data instead of breaking the page.
 */
export async function fetchLiveData() {
  if (!isConfigured()) return null
  try {
    const res = await fetch(`${scriptEndpoint}?action=read`, { method: 'GET' })
    if (!res.ok) return null
    const json = await res.json()
    if (!json || json.ok === false) return null
    return json.data || null
  } catch {
    return null
  }
}

/**
 * Sends a contact form submission. Returns { ok, message }.
 */
export async function sendContactMessage(payload) {
  return postToScript({ type: 'contact', ...payload })
}

/**
 * Sends an authenticated admin write (create/update/delete a project,
 * experience entry, or profile field). Returns { ok, message, data }.
 */
export async function sendAdminAction({ adminKey, resource, action, item, id }) {
  return postToScript({ type: 'admin', adminKey, resource, action, item, id })
}

// A real deployed Apps Script URL always looks like:
//   https://script.google.com/macros/s/<id>/exec
// This just checks the endpoint is a non-empty script.google.com URL —
// it does NOT compare against any specific deployment ID, so it keeps
// working correctly no matter what your real ID is.
function isConfigured() {
  return typeof scriptEndpoint === 'string' && /^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(scriptEndpoint)
}

async function postToScript(body) {
  if (!isConfigured()) {
    return { ok: false, message: 'Backend not configured yet — set scriptEndpoint in portfolioData.js.' }
  }
  try {
    const res = await fetch(scriptEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // avoids a CORS preflight against Apps Script
      body: JSON.stringify(body),
    })
    const json = await res.json().catch(() => null)
    if (!res.ok || !json || json.ok === false) {
      return { ok: false, message: json?.message || `Request failed (${res.status}).` }
    }
    return { ok: true, message: json.message || 'Success.', data: json.data }
  } catch (err) {
    return { ok: false, message: err?.message || 'Network request failed.' }
  }
}