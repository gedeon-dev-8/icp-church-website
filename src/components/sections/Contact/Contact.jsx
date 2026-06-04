import { useState } from 'react';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { useLang } from '../../../context/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import './Contact.scss';

function Reveal({ children, className = '', delay = 0 }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`${className}${visible ? ' visible' : ''}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

const INITIAL = { firstName: '', lastName: '', email: '', subject: '', message: '' };

// ────────────────────────────────────────────────────────────────────
// Form submission endpoint
//
// We POST as JSON to a Formspree-compatible endpoint. Set
// VITE_CONTACT_ENDPOINT in your .env to your own form ID — both
// Formspree (https://formspree.io) and Web3Forms (https://web3forms.com)
// expose a compatible JSON POST API and a free tier suitable for a
// church site.
//
// If the env var isn't set, we fall back to a mailto: handoff so the
// form is always usable — the user's mail client opens with the message
// pre-filled. Not ideal, but it never silently swallows submissions.
// ────────────────────────────────────────────────────────────────────
const CONTACT_ENDPOINT  = import.meta.env.VITE_CONTACT_ENDPOINT || '';
const CONTACT_FALLBACK  = 'info@icpretoria.org';

function buildMailtoFallback(form) {
  const subject = encodeURIComponent(form.subject || 'Message from icpretoria.org');
  const body = encodeURIComponent(
`From: ${form.firstName} ${form.lastName} <${form.email}>

${form.message}
`
  );
  return `mailto:${CONTACT_FALLBACK}?subject=${subject}&body=${body}`;
}

async function submitToEndpoint(form) {
  const res = await fetch(CONTACT_ENDPOINT, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      firstName: form.firstName,
      lastName:  form.lastName,
      email:     form.email,
      subject:   form.subject,
      message:   form.message,
      // Honeypot field name varies by provider; both Formspree and
      // Web3Forms ignore unknown keys, so this is safe to include.
      _replyto:  form.email,
    }),
  });
  if (!res.ok) {
    throw new Error(`Contact endpoint returned ${res.status}`);
  }
  return res.json().catch(() => ({}));
}

const buildValidator = (f) => (form) => {
  const errors = {};
  if (!form.firstName.trim()) errors.firstName = f.firstNameError;
  if (!form.lastName.trim())  errors.lastName  = f.lastNameError;
  if (!form.email.trim()) {
    errors.email = f.emailErrorRequired;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = f.emailErrorInvalid;
  }
  if (!form.subject.trim()) errors.subject = f.subjectError;
  if (!form.message.trim()) errors.message = f.messageError;
  return errors;
};

export default function Contact() {
  const { t } = useLang();
  const f = t('contact.fields') || {};
  const items = t('contact.items') || [];
  const validate = buildValidator(f);

  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors(validate({ ...form, [name]: value }));
    }
  };

  const handleBlur = e => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(validate(form));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    setTouched({ firstName: true, lastName: true, email: true, subject: true, message: true });
    if (Object.keys(v).length > 0) {
      setStatus('error');
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      if (CONTACT_ENDPOINT) {
        // Real POST to the configured form service.
        await submitToEndpoint(form);
      } else {
        // No endpoint configured — hand the message off to the user's
        // mail client so the form is still useful in production even
        // before the team plugs in a backend.
        if (typeof window !== 'undefined') {
          window.location.href = buildMailtoFallback(form);
        }
      }
      setStatus('success');
      setForm(INITIAL);
      setTouched({});
    } catch (err) {
      // Network or validation failure on the server. We keep the
      // user's input intact so they can retry without retyping.
      // eslint-disable-next-line no-console
      console.error('Contact submission failed', err);
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  const fieldProps = name => ({
    id: name,
    name,
    value: form[name],
    onChange: handleChange,
    onBlur: handleBlur,
    'aria-invalid': Boolean(errors[name] && touched[name]),
    'aria-describedby': errors[name] && touched[name] ? `${name}-error` : undefined,
  });

  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="contact__info">
        <div className="contact__glow" aria-hidden="true" />
        <Reveal className="contact__eyebrow">{t('contact.eyebrow')}</Reveal>
        <Reveal className="contact__title" delay={0.1}>
          <h2 id="contact-title">{t('contact.titleLine1')}<br /><em>{t('contact.titleAccent')}</em></h2>
        </Reveal>

        <div className="contact__items">
          {items.map((item, i) => (
            <Reveal key={item.label} className="contact__item" delay={0.1 * (i + 1)}>
              <div className="contact__item-icon" aria-hidden="true">
                {item.icon && <FontAwesomeIcon icon={item.icon} />}
              </div>
              <div>
                <div className="contact__item-label">{item.label}</div>
                <div className="contact__item-value">{item.value}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="contact__form-panel">
        <Reveal className="contact__form-eyebrow">{t('contact.formEyebrow')}</Reveal>
        <Reveal className="contact__form-title" delay={0.1}>
          <h3>{t('contact.formTitleLine1')}<br /><em>{t('contact.formTitleAccent')}</em></h3>
        </Reveal>

        <Reveal className="contact__form" delay={0.15}>
          <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="firstName">{f.firstName}</label>
                <input
                  type="text"
                  className={`form-input${errors.firstName && touched.firstName ? ' has-error' : ''}`}
                  placeholder={f.firstNamePh}
                  autoComplete="given-name"
                  required
                  {...fieldProps('firstName')}
                />
                {errors.firstName && touched.firstName && (
                  <span className="form-error" id="firstName-error">{errors.firstName}</span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="lastName">{f.lastName}</label>
                <input
                  type="text"
                  className={`form-input${errors.lastName && touched.lastName ? ' has-error' : ''}`}
                  placeholder={f.lastNamePh}
                  autoComplete="family-name"
                  required
                  {...fieldProps('lastName')}
                />
                {errors.lastName && touched.lastName && (
                  <span className="form-error" id="lastName-error">{errors.lastName}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">{f.email}</label>
              <input
                type="email"
                className={`form-input${errors.email && touched.email ? ' has-error' : ''}`}
                placeholder={f.emailPh}
                autoComplete="email"
                required
                {...fieldProps('email')}
              />
              {errors.email && touched.email && (
                <span className="form-error" id="email-error">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="subject">{f.subject}</label>
              <input
                type="text"
                className={`form-input${errors.subject && touched.subject ? ' has-error' : ''}`}
                placeholder={f.subjectPh}
                required
                {...fieldProps('subject')}
              />
              {errors.subject && touched.subject && (
                <span className="form-error" id="subject-error">{errors.subject}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="message">{f.message}</label>
              <textarea
                className={`form-textarea${errors.message && touched.message ? ' has-error' : ''}`}
                placeholder={f.messagePh}
                rows="5"
                required
                {...fieldProps('message')}
              />
              {errors.message && touched.message && (
                <span className="form-error" id="message-error">{errors.message}</span>
              )}
            </div>

            <button type="submit" className="form-submit" disabled={submitting}>
              <span>{submitting ? t('common.sending') : t('contact.submit')}</span>
              {!submitting && <span aria-hidden="true">→</span>}
            </button>

            <div role="status" aria-live="polite" className="form-status-wrap">
              {status === 'success' && (
                <div className="form-status form-status--success">
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    aria-hidden="true"
                    className="form-status__icon"
                  />
                  <span>{t('contact.successMsg')}</span>
                </div>
              )}
              {status === 'error' && (
                <div className="form-status form-status--error">
                  <FontAwesomeIcon
                    icon={faTriangleExclamation}
                    aria-hidden="true"
                    className="form-status__icon"
                  />
                  <span>{t('contact.errorMsg')}</span>
                </div>
              )}
            </div>

            <p className="form-note">
              {t('contact.notePrefix')}
              <a href="mailto:info@icpretoria.org" className="form-note-link">
                {t('contact.noteEmail')}
              </a>
              {t('contact.notePostfix')}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
