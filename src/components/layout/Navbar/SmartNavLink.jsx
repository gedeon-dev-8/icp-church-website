import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Navigation link that handles three patterns:
 *  - Plain hash (#about)        → smooth scroll on home, navigate to '/' + hash from other routes.
 *  - Route + hash (/#about)     → same behaviour as above.
 *  - Plain route (/departments) → react-router navigate.
 */
export default function SmartNavLink({
  href,
  className = '',
  activeClassName = '',
  isActive = false,
  onClick,
  children,
  ...rest
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const isHashHref = href.startsWith('#') || href.startsWith('/#');

  const handleClick = (e) => {
    onClick?.(e);
    if (e.defaultPrevented) return;

    if (isHashHref) {
      e.preventDefault();
      const hashIndex = href.indexOf('#');
      const targetHash = href.slice(hashIndex);
      const targetPath = href.startsWith('/') ? href.slice(0, hashIndex) || '/' : '/';

      if (location.pathname === targetPath) {
        // Already on the right page — smooth scroll directly.
        const el = document.querySelector(targetHash);
        if (el) {
          const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
        }
        // Update URL without causing a navigation
        if (window.history.replaceState) {
          window.history.replaceState(null, '', targetHash);
        }
      } else {
        // Different route → React Router navigate, RouteScrollManager handles scroll
        navigate(targetPath + targetHash);
      }
      return;
    }

    // Plain route navigation
    if (href.startsWith('/')) {
      e.preventDefault();
      navigate(href);
    }
  };

  const finalClassName = [className, isActive ? activeClassName : '']
    .filter(Boolean)
    .join(' ');

  return (
    <a
      href={href}
      className={finalClassName}
      onClick={handleClick}
      aria-current={isActive ? 'page' : undefined}
      {...rest}
    >
      {children}
    </a>
  );
}
