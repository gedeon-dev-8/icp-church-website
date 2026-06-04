import { useEffect, useState } from 'react';

// ────────────────────────────────────────────────────────────────────
// useYouTubeMeta — fetch live title + thumbnail for a YouTube video
// without needing the YouTube Data API key.
//
// We could call https://www.youtube.com/oembed?url=…&format=json
// directly, but YouTube's oEmbed endpoint doesn't send CORS headers,
// so browsers refuse to read the response. https://noembed.com/embed
// proxies the same data with permissive CORS — perfect for a static
// front-end like this one.
//
// What oEmbed gives us:
//   title, author_name, author_url, thumbnail_url, html, width, height
//
// What it does NOT give us:
//   duration. (To auto-pull duration you'd need the YouTube Data API
//   v3 with a server-side key. Keep `duration` in translations.js for
//   now and update it manually when a new sermon goes up.)
//
// Results are memoised across the page lifetime so revisiting a route
// doesn't re-hit the proxy.
// ────────────────────────────────────────────────────────────────────

const CACHE = new Map(); // videoId → { title, thumbnail, author, fetchedAt }

async function fetchMeta(videoId) {
  const youtubeUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
  const endpoint   = `https://noembed.com/embed?url=${encodeURIComponent(youtubeUrl)}`;

  const res = await fetch(endpoint, { method: 'GET' });
  if (!res.ok) throw new Error(`oEmbed proxy returned ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);

  return {
    title:     data.title || '',
    thumbnail: data.thumbnail_url || '',
    author:    data.author_name || '',
    fetchedAt: Date.now(),
  };
}

export function useYouTubeMeta(videoId) {
  const [state, setState] = useState(() => {
    if (!videoId) return { meta: null, loading: false, error: null };
    const cached = CACHE.get(videoId);
    if (cached) return { meta: cached, loading: false, error: null };
    return { meta: null, loading: true, error: null };
  });

  useEffect(() => {
    if (!videoId) return undefined;
    if (CACHE.has(videoId)) {
      setState({ meta: CACHE.get(videoId), loading: false, error: null });
      return undefined;
    }

    let cancelled = false;
    setState({ meta: null, loading: true, error: null });

    fetchMeta(videoId)
      .then(meta => {
        if (cancelled) return;
        CACHE.set(videoId, meta);
        setState({ meta, loading: false, error: null });
      })
      .catch(err => {
        if (cancelled) return;
        // Surface failure but don't blow up the caller — they'll fall
        // back to the translation-provided title/thumbnail.
        setState({ meta: null, loading: false, error: err });
      });

    return () => { cancelled = true; };
  }, [videoId]);

  return state;
}
