// Copyright (c) 2026 Jordan Newell. Licensed under MIT.
// Source: https://github.com/JordanNewell/jordannewell-com
//
// PostShare — emoji-style like + share popup.
// Externalized so CSP (which blocks inline scripts) allows it to run.

(function () {
  'use strict';

  document.querySelectorAll('[data-share-root]').forEach((root) => {
    const btn = root.querySelector('[data-share-btn]');
    const popup = root.querySelector('[data-share-popup]');
    const closeBtn = root.querySelector('[data-share-close]');
    const copyBtn = root.querySelector('[data-share-copy]');
    const emailLink = root.querySelector('[data-platform="email"]');
    const countEl = root.querySelector('[data-share-count]');

    if (!btn || !popup) return;

    // ---- Like state (localStorage per post URL; backend deferred) ----
    const shareUrl = root.getAttribute('data-share-url') || window.location.pathname;
    const likeKey = `jn:like:${shareUrl}`;
    const readLike = () => {
      try {
        const stored = JSON.parse(localStorage.getItem(likeKey) || 'null');
        if (stored && typeof stored.count === 'number') return stored;
      } catch {}
      return { count: 0, liked: false };
    };
    const writeLike = (state) => {
      try { localStorage.setItem(likeKey, JSON.stringify(state)); } catch {}
    };
    const renderLike = () => {
      const state = readLike();
      if (countEl) countEl.textContent = String(state.count);
      btn.classList.toggle('liked', state.liked);
    };
    const bumpCount = () => {
      if (!countEl) return;
      countEl.classList.remove('bumped');
      void countEl.offsetWidth;
      countEl.classList.add('bumped');
    };
    const registerLike = () => {
      const state = readLike();
      if (state.liked) return;
      state.count += 1;
      state.liked = true;
      writeLike(state);
      if (countEl) countEl.textContent = String(state.count);
      bumpCount();
      btn.classList.add('liked');
    };
    renderLike();

    // ---- Popup open/close ----
    const toggle = (open) => {
      popup.hidden = !open;
      requestAnimationFrame(() => popup.classList.toggle('open', open));
      btn.setAttribute('aria-expanded', String(open));
    };

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const willOpen = popup.hidden || !popup.classList.contains('open');
      if (willOpen) {
        btn.classList.remove('bouncing');
        void btn.offsetWidth;
        btn.classList.add('bouncing');
        setTimeout(() => btn.classList.remove('bouncing'), 700);
        registerLike();
      }
      toggle(willOpen);
    });

    closeBtn?.addEventListener('click', () => toggle(false));

    document.addEventListener('click', (e) => {
      if (!root.contains(e.target)) toggle(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') toggle(false);
    });

    // ---- Email: build mailto at click time (dodge CF email obfuscation) ----
    emailLink?.addEventListener('click', (e) => {
      e.preventDefault();
      const subject = encodeURIComponent(root.getAttribute('data-email-subject') || '');
      const body = encodeURIComponent(root.getAttribute('data-email-body') || '');
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    });

    // ---- Copy URL ----
    copyBtn?.addEventListener('click', async () => {
      const url = copyBtn.getAttribute('data-copy-url') || '';
      const label = copyBtn.querySelector('[data-copy-label]');
      try {
        await navigator.clipboard.writeText(url);
        if (label) {
          const original = label.textContent;
          label.textContent = 'Copied';
          copyBtn.classList.add('copied');
          setTimeout(() => {
            label.textContent = original;
            copyBtn.classList.remove('copied');
          }, 1500);
        }
      } catch {
        if (label) label.textContent = 'Press ⌘C';
      }
    });
  });
})();
