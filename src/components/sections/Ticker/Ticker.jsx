import { useLang } from '../../../context/LanguageContext';
import './Ticker.scss';

export default function Ticker() {
  const { t } = useLang();
  const items = t('ticker') || [];
  // Duplicate for seamless loop
  const loop = [...items, ...items];

  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__inner">
        {loop.map((item, i) => (
          <span key={i} className="ticker__item">{item}</span>
        ))}
      </div>
    </div>
  );
}
