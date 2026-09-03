import { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { usePageTheme } from '../../../hooks/usePageTheme';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { useLang } from '../../../context/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import './GivingPage.scss';

function Reveal({ children, className = '', delay = 0, tag: Tag = 'div', id }) {
  const { ref, visible } = useScrollReveal();
  return (
    <Tag
      ref={ref}
      id={id}
      className={`${className}${visible ? ' visible' : ''}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </Tag>
  );
}

// ────────────────────────────────────────────────────────────────────
// Official ICP banking details. Update here if the account ever
// changes — the on-screen list, the "copy all" text, and the QR code
// are all derived from this one object, so nothing can drift out of
// sync with itself.
// ────────────────────────────────────────────────────────────────────
const BANK_DETAILS = {
  accountHolder: 'ICP CHURCH',
  bank: 'ABSA BANK',
  branchName: 'ALL BRANCHES',
  branchCode: '63200500',
  accountNumber: '9115851787', // shown grouped as "9115 8517 87"
};

// "9115851787" → "9115 8517 87" (groups of 4 from the left)
function formatAccountNumber(num) {
  return num.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

// Plain-text block used for both "Copy all" and the QR code. Scanning
// the QR with a phone camera or any generic QR reader surfaces this
// text — it's a convenient way to get the details onto a phone without
// mistyping them, not a scan-to-pay code (that needs a registered
// payment provider, which is a later, separate integration).
function buildDetailsText(labels) {
  return [
    `${labels.accountHolder}: ${BANK_DETAILS.accountHolder}`,
    `${labels.bank}: ${BANK_DETAILS.bank}`,
    `${labels.branchName}: ${BANK_DETAILS.branchName}`,
    `${labels.branchCode}: ${BANK_DETAILS.branchCode}`,
    `${labels.accountNumber}: ${formatAccountNumber(BANK_DETAILS.accountNumber)}`,
  ].join('\n');
}

// ── Copy-to-clipboard icon button with transient "copied" feedback ──
function CopyButton({ value, label, copiedLabel }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const handleCopy = async () => {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard permission denied or unavailable — the value is still
      // visible on screen, so the visitor can select and copy manually.
      return;
    }
    setCopied(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      className={`bank-row__copy${copied ? ' is-copied' : ''}`}
      onClick={handleCopy}
      aria-label={copied ? copiedLabel : label}
    >
      <FontAwesomeIcon icon={copied ? faCheck : faCopy} aria-hidden="true" />
    </button>
  );
}

function DetailRow({ label, value, display, copyLabel, copiedLabel }) {
  return (
    <div className="bank-row">
      <div className="bank-row__text">
        <span className="bank-row__label">{label}</span>
        <span className="bank-row__value">{display ?? value}</span>
      </div>
      <CopyButton value={value} label={copyLabel} copiedLabel={copiedLabel} />
    </div>
  );
}

export default function GivingPage() {
  const { t } = useLang();
  const [qrSrc, setQrSrc] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const copiedAllTimeout = useRef(null);

  usePageTheme('giving');

  useEffect(() => {
    const original = document.title;
    document.title = `${t('giving.metaTitle')} — ICP`;
    return () => { document.title = original; };
  }, [t]);

  const labels = t('giving.labels') || {};
  const detailsText = buildDetailsText(labels);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(detailsText, {
      width: 320,
      margin: 1,
      color: { dark: '#0b1515', light: '#ffffff' },
    })
      .then(url => { if (!cancelled) setQrSrc(url); })
      .catch(() => { if (!cancelled) setQrSrc(null); });
    return () => { cancelled = true; };
  }, [detailsText]);

  useEffect(() => () => clearTimeout(copiedAllTimeout.current), []);

  const handleCopyAll = async () => {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(detailsText);
    } catch {
      return;
    }
    setCopiedAll(true);
    clearTimeout(copiedAllTimeout.current);
    copiedAllTimeout.current = setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <main id="main" tabIndex="-1" className="giving-page">
      {/* ── Hero header ── */}
      <header className="giving-hero" aria-labelledby="giving-page-title">
        <div className="giving-hero__veil" aria-hidden="true" />
        <div className="giving-hero__inner">
          <Reveal className="giving-hero__eyebrow">{t('giving.eyebrow')}</Reveal>
          <Reveal tag="h1" className="giving-hero__title" delay={0.1} id="giving-page-title">
            {t('giving.titleLine1')} <em>{t('giving.titleAccent')}</em>
          </Reveal>
          <Reveal className="giving-hero__sub" delay={0.2}>
            {t('giving.sub')}
          </Reveal>
        </div>
      </header>

      {/* ── Bank details + QR ── */}
      <section className="giving-body" aria-label={t('giving.cardHeading')}>
        <div className="giving-body__grid">
          <Reveal className="bank-card" delay={0.05}>
            <h2 className="bank-card__heading">{t('giving.cardHeading')}</h2>

            <div className="bank-card__rows">
              <DetailRow
                label={labels.accountHolder}
                value={BANK_DETAILS.accountHolder}
                copyLabel={`${t('giving.copy')} ${labels.accountHolder}`}
                copiedLabel={t('giving.copied')}
              />
              <DetailRow
                label={labels.bank}
                value={BANK_DETAILS.bank}
                copyLabel={`${t('giving.copy')} ${labels.bank}`}
                copiedLabel={t('giving.copied')}
              />
              <DetailRow
                label={labels.branchName}
                value={BANK_DETAILS.branchName}
                copyLabel={`${t('giving.copy')} ${labels.branchName}`}
                copiedLabel={t('giving.copied')}
              />
              <DetailRow
                label={labels.branchCode}
                value={BANK_DETAILS.branchCode}
                copyLabel={`${t('giving.copy')} ${labels.branchCode}`}
                copiedLabel={t('giving.copied')}
              />
              <DetailRow
                label={labels.accountNumber}
                value={BANK_DETAILS.accountNumber}
                display={formatAccountNumber(BANK_DETAILS.accountNumber)}
                copyLabel={`${t('giving.copy')} ${labels.accountNumber}`}
                copiedLabel={t('giving.copied')}
              />
            </div>

            <button
              type="button"
              className={`bank-card__copy-all${copiedAll ? ' is-copied' : ''}`}
              onClick={handleCopyAll}
            >
              <FontAwesomeIcon icon={copiedAll ? faCheck : faCopy} aria-hidden="true" />
              <span>{copiedAll ? t('giving.copyAllCopied') : t('giving.copyAll')}</span>
            </button>
          </Reveal>

          <Reveal className="qr-card" delay={0.1}>
            <h2 className="qr-card__heading">{t('giving.qrHeading')}</h2>
            <div className="qr-card__frame">
              {qrSrc && (
                <img src={qrSrc} alt={t('giving.qrAlt')} className="qr-card__img" />
              )}
            </div>
            <p className="qr-card__hint">{t('giving.qrHint')}</p>
          </Reveal>
        </div>

        {/* <Reveal className="giving-note" delay={0.15}>
          <p>{t('giving.note')}</p>
        </Reveal> */}
      </section>
    </main>
  );
}
