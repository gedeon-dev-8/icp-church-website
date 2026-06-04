import { useEffect } from 'react';
import { useLang } from '../../../context/LanguageContext';
import { faCompass } from '@fortawesome/free-solid-svg-icons';
import EmptyState from '../../shared/EmptyState/EmptyState';
import './NotFound.scss';

// ────────────────────────────────────────────────────────────────────
// 404 page — uses the shared EmptyState styling so an unknown URL
// feels like a designed moment, not a stack trace. Two CTAs:
//   1. Back to home (primary).
//   2. Visit us (ghost — opens the map section).
// ────────────────────────────────────────────────────────────────────

export default function NotFound() {
  const { t } = useLang();

  useEffect(() => {
    const original = document.title;
    document.title = `${t('notFound.metaTitle') || 'Page Not Found'} — ICP`;
    return () => { document.title = original; };
  }, [t]);

  return (
    <main id="main" tabIndex="-1" className="not-found">
      <header className="not-found__hero">
        <p className="not-found__eyebrow">
          {t('notFound.eyebrow') || '404 · Page not found'}
        </p>
        <h1 className="not-found__title">
          {t('notFound.titleLine1') || 'This verse'} <em>{t('notFound.titleAccent') || 'isn’t in our book.'}</em>
        </h1>
        <p className="not-found__sub">
          {t('notFound.sub') ||
            'The page you were looking for has wandered off. Let’s get you back on the path.'}
        </p>
      </header>

      <div className="not-found__body">
        <EmptyState
          icon={faCompass}
          title={t('notFound.cardTitle') || 'Where would you like to go?'}
          description={
            t('notFound.cardDesc') ||
            'Start from the beginning, or come find us in person this Sunday.'
          }
          action={{
            label: t('notFound.ctaHome') || 'Back to Home',
            href: '/',
          }}
          secondary={{
            label: t('notFound.ctaVisit') || 'Plan a visit',
            href: '/#map',
          }}
        />
      </div>
    </main>
  );
}
