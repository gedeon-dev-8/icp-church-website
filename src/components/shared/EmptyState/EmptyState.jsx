import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import './EmptyState.scss';

// ────────────────────────────────────────────────────────────────────
// EmptyState — the same dignified energy as the Map offline fallback,
// distilled into a reusable component for every "nothing here yet" /
// "couldn't load" moment across the site.
//
// Usage:
//   <EmptyState
//     icon={faVideo}
//     title="No sermons just yet"
//     description="Our team is curating this archive. Check back soon."
//     action={{ label: 'Try again', onClick: handleRetry }}
//   />
// ────────────────────────────────────────────────────────────────────

export default function EmptyState({
  icon = faCircleQuestion,
  title,
  description,
  action,        // { label, onClick }  or  { label, href }
  secondary,     // optional second action
  tone = 'default', // 'default' | 'error'
  className = '',
}) {
  return (
    <div
      className={`empty-state empty-state--${tone} ${className}`.trim()}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      <div className="empty-state__grid" aria-hidden="true" />

      <div className="empty-state__card">
        <span className="empty-state__icon" aria-hidden="true">
          <FontAwesomeIcon icon={icon} />
        </span>

        {title && <h3 className="empty-state__title">{title}</h3>}
        {description && <p className="empty-state__desc">{description}</p>}

        {(action || secondary) && (
          <div className="empty-state__actions">
            {action && (action.href ? (
              <a
                href={action.href}
                className="empty-state__btn empty-state__btn--primary"
                target={action.external ? '_blank' : undefined}
                rel={action.external ? 'noopener noreferrer' : undefined}
              >
                <span>{action.label}</span>
                <span aria-hidden="true">→</span>
              </a>
            ) : (
              <button
                type="button"
                className="empty-state__btn empty-state__btn--primary"
                onClick={action.onClick}
              >
                <span>{action.label}</span>
                <span aria-hidden="true">→</span>
              </button>
            ))}

            {secondary && (secondary.href ? (
              <a
                href={secondary.href}
                className="empty-state__btn empty-state__btn--ghost"
                target={secondary.external ? '_blank' : undefined}
                rel={secondary.external ? 'noopener noreferrer' : undefined}
              >
                {secondary.label}
              </a>
            ) : (
              <button
                type="button"
                className="empty-state__btn empty-state__btn--ghost"
                onClick={secondary.onClick}
              >
                {secondary.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
