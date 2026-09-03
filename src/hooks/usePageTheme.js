import { useEffect } from 'react';

/**
 * Sets data-page="<name>" on <body> while the component is mounted.
 * Cleaned up automatically on unmount.
 *
 * @param {string} page  e.g. 'gallery' | 'departments' | 'default'
 */
export function usePageTheme(page = 'default') {
  useEffect(() => {
    document.body.dataset.page = page;
    return () => { document.body.dataset.page = 'default'; };
  }, [page]);
}