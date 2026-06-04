import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faCross,
  faGem,
  faFire,
  faDove,
} from '@fortawesome/free-solid-svg-icons';
import './Divider.scss';

/**
 * A small decorative section divider — a Font Awesome glyph centered on
 * a thin horizontal line. Use sparingly between sections to add cadence.
 *
 * variant: 'default' | 'cross' | 'dot' | 'flame' | 'dove'
 */
const GLYPHS = {
  default: faStar,
  cross:   faCross,
  dot:     faGem,
  flame:   faFire,
  dove:    faDove,
};

export default function Divider({ variant = 'default', className = '' }) {
  const icon = GLYPHS[variant] || GLYPHS.default;
  return (
    <div className={`divider ${className}`} aria-hidden="true">
      <span className="divider__line" />
      <span className="divider__glyph">
        <FontAwesomeIcon icon={icon} />
      </span>
      <span className="divider__line" />
    </div>
  );
}
