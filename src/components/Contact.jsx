import { useState } from 'react'
import Reveal from './Reveal'
import { profile } from '../data/portfolioData'
import { sendContactMessage } from '../lib/scriptApi'

const STATUS = {
  IDLE: 'idle',
  SENDING: 'sending',
  SUCCESS: 'success',
  VALIDATION_ERROR: 'validation_error',
  SEND_ERROR: 'send_error',
}

const EMPTY_FIELDS = { name: '', email: '', contact: '', message: '', company: '' }

export default function Contact() {
  const [fields, setFields] = useState(EMPTY_FIELDS)
  const [status, setStatus] = useState(STATUS.IDLE)
  const [copied, setCopied] = useState(false)
  const [errorDetail, setErrorDetail] = useState('')

  const update = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }))

  const handleEmailClick = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Clipboard API can fail (e.g. insecure context) — mailto link still works.
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Honeypot: real visitors never fill this hidden field.
    if (fields.company) {
      setStatus(STATUS.SUCCESS)
      setFields(EMPTY_FIELDS)
      return
    }

    // --- Validation errors: distinct from send errors ---
    if (!fields.name || !fields.email || !fields.message) {
      setStatus(STATUS.VALIDATION_ERROR)
      return
    }

    setStatus(STATUS.SENDING)
    setErrorDetail('')

    const result = await sendContactMessage({
      name: fields.name,
      email: fields.email,
      contact: fields.contact,
      message: fields.message,
    })

    if (result.ok) {
      setStatus(STATUS.SUCCESS)
      setFields(EMPTY_FIELDS)
    } else {
      setErrorDetail(result.message || '')
      setStatus(STATUS.SEND_ERROR)
    }
  }

  return (
    <section className="section contact-section" id="contact">
      <div className="wrap">
        <Reveal>
          <div className="bracket-panel contact-panel">
            <div>
              <span className="eyebrow">Get in touch</span>
              <h2>Have a build in mind?</h2>
              <p>
                I typically reply within a day. Send a brief description of scope and timeline,
                and I'll follow up with questions and a realistic estimate.
              </p>

              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="hp-field" aria-hidden="true">
                  <label htmlFor="company">Company</label>
                  <input
                    id="company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={fields.company}
                    onChange={update('company')}
                  />
                </div>

                <div className="form-row">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    value={fields.name}
                    onChange={update('name')}
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="form-row">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={fields.email}
                    onChange={update('email')}
                    placeholder="you@company.com"
                    required
                  />
                </div>

                <div className="form-row">
                  <label htmlFor="contact">Contact No</label>
                  <input
                    id="contact"
                    type="text"
                    value={fields.contact}
                    onChange={update('contact')}
                    placeholder="e.g. 123-456-7890"
                    required
                  />
                </div>

                <div className="form-row">
                  <label htmlFor="message">Project details</label>
                  <textarea
                    id="message"
                    rows={4}
                    value={fields.message}
                    onChange={update('message')}
                    placeholder="What do you need built?"
                    required
                  />
                </div>

                <button type="submit" className="btn btn-glow" disabled={status === STATUS.SENDING}>
                  {status === STATUS.SENDING ? 'Sending…' : 'Send message →'}
                </button>

                {status === STATUS.SUCCESS && (
                  <p className="form-status form-status-success">
                    Message sent — check your inbox for a confirmation, and I'll follow up personally
                    within a day.
                  </p>
                )}
                {status === STATUS.VALIDATION_ERROR && (
                  <p className="form-status form-status-error">
                    Please fill in your name, email, and project details before sending.
                  </p>
                )}
                {status === STATUS.SEND_ERROR && (
                  <p className="form-status form-status-error">
                    Couldn't send that{errorDetail ? ` — ${errorDetail}` : ''}. Please try again, or
                    email me directly below.
                  </p>
                )}
              </form>

              <div className="hero-actions" style={{ marginTop: 20 }}>
                <a
                  href={`mailto:${profile.email}`}
                  className="btn btn-ghost"
                  onClick={handleEmailClick}
                >
                  {copied ? '✓ Email copied to clipboard' : 'Email me directly →'}
                </a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn btn-ghost">
                  Message on LinkedIn
                </a>
              </div>
              {copied && (
                <p className="form-status form-status-success" style={{ maxWidth: 420 }}>
                  {profile.email} copied — paste it into any email app, or your mail client may
                  have opened separately.
                </p>
              )}
            </div>

            <ul className="contact-links">
              <li>
                <span>Email</span>
                <a href={`mailto:${profile.email}`} onClick={handleEmailClick}>
                  {profile.email}
                </a>
              </li>
              <li>
                <span>Phone</span>
                <a href={`tel:${profile.phone.replace(/\s/g, '')}`}>{profile.phone}</a>
              </li>
              <li>
                <span>GitHub</span>
                <a href={profile.github} target="_blank" rel="noreferrer">github.com/Kumaran69</a>
              </li>
              <li>
                <span>LinkedIn</span>
                <a href={profile.linkedin} target="_blank" rel="noreferrer">kumaran-m-077135411</a>
              </li>
              <li>
                <span>Location</span>
                <span>{profile.location}</span>
              </li>
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}