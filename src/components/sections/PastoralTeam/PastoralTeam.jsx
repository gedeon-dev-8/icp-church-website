import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { useLang } from '../../../context/LanguageContext';
import './PastoralTeam.scss';

// ──────────────────────────────────────────────────────────────────
// Pastoral team photos
// ──────────────────────────────────────────────────────────────────
// Curated set lives in /assets/images/Pastoral-Team. The filename is
// the title, shown in Title Case regardless of source casing, with an
// optional leading "N. " used purely to control display order:
//   "2. PAST. JULES MUPENDA.png"  →  "Past. Jules Mupenda" (order 2)
// Drop a new file with the desired filename in that folder and the
// card appears automatically — no code changes required. Files with
// no numeric prefix sort alphabetically after the numbered ones.
// ──────────────────────────────────────────────────────────────────
const teamModules = import.meta.glob(
  '../../../assets/images/Pastoral-Team/*.{jpg,jpeg,JPG,JPEG,png,PNG}',
  { eager: true, import: 'default' }
);

// "/.../2. PAST. JULES MUPENDA.png" → { order: 2, title: "Past. Jules Mupenda" }
function parsePath(path) {
  const filename = path.split('/').pop().replace(/\.[^.]+$/, '');
  const match = filename.match(/^(\d+)\.\s*(.+)$/);
  const order = match ? Number(match[1]) : Infinity;
  const rawTitle = match ? match[2] : filename;
  const title = rawTitle
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
  return { order, title };
}

const TEAM_MEMBERS = Object.entries(teamModules)
  .map(([path, src]) => ({ src, ...parsePath(path) }))
  .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

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

export default function PastoralTeam() {
  const { t } = useLang();

  if (TEAM_MEMBERS.length === 0) return null;

  return (
    <section id="pastoral-team" className="team" aria-labelledby="team-title">
      <Reveal className="team__eyebrow">{t('team.eyebrow')}</Reveal>
      <Reveal className="team__title" delay={0.1}>
        <h2 id="team-title">{t('team.titleLine1')} <em>{t('team.titleAccent')}</em></h2>
      </Reveal>

      <div className="team__grid">
        {TEAM_MEMBERS.map((member, i) => (
          <Reveal key={member.title} className="team__card" delay={0.08 * (i + 1)}>
            <div className="team__photo">
              <img
                src={member.src}
                alt={member.title}
                className="team__photo-img"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="team__name">{member.title}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
