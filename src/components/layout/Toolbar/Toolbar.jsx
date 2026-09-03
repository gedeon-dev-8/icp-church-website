import './Toolbar.scss';
import { useLang } from '../../../context/LanguageContext';

export default function Toolbar() {
  const { t } = useLang();

  return (
    <div className="social-toolbar" id="socialToolbar">
      <div className="tb-left">
        <span className="tb-tagline">{t('toolbar.tagline')}</span>
        <span className="tb-divider"></span>
        <div className="tb-socials">
          {/* Facebook */}
          <a
            href="https://facebook.com/groups/263029040408370"
            target="_blank"
            rel="noopener"
            className="tb-social"
            aria-label="Facebook"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
          {/* Instagram */}
          <a
            href="https://instagram.com/icp.content"
            target="_blank"
            rel="noopener"
            className="tb-social"
            aria-label="Instagram"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle
                cx="17.5"
                cy="6.5"
                r="1"
                fill="currentColor"
                stroke="none"
              />
            </svg>
          </a>
          {/* YouTube */}
          <a
            href="https://youtube.com/channel/UCO5cyDDRu-jZA7oMKGqRIMg"
            target="_blank"
            rel="noopener"
            className="tb-social"
            aria-label="YouTube"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
              <polygon
                points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02"
                fill="var(--heading)"
              />
            </svg>
          </a>
          {/* TikTok */}
          <a
            href="https://tiktok.com/@icp.content"
            target="_blank"
            rel="noopener"
            className="tb-social"
            aria-label="TikTok"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.79 1.52V6.76a4.85 4.85 0 0 1-1.02-.07z" />
            </svg>
          </a>
        </div>
      </div>

      <div className="tb-right">
        <div className="tb-service">
          <span className="tb-service-dot"></span>
          {t('toolbar.tbService')}
        </div>
        {/* <div className="tb-service">
          <span
            className="tb-service-dot"
            style={{ background: 'rgba(0,249,249,.35)', animationDelay: '.7s' }}
          ></span>
          Wednesday Service · 18:00 PM
        </div> */}
      </div>
    </div>
  );
}