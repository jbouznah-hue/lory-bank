/* ============================================================
   LORY EVENTS & CATERING — Shared utilities
   Language toggle, helpers, scroll reveal, PDF export
   ============================================================ */

(function () {
  'use strict';

  /* ---------- STATE ---------- */
  var savedLang = null;
  try { savedLang = localStorage.getItem('lory_lang'); } catch(e) {}
  const state = { lang: savedLang || 'he' };
  const html = document.documentElement;

  /* ---------- LANGUAGE TOGGLE ---------- */
  function setLang(lang) {
    state.lang = lang;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'he' ? 'rtl' : 'ltr');
    try { localStorage.setItem('lory_lang', lang); } catch(e) {}
    document.querySelectorAll('.nav-lang button').forEach(function (b) {
      b.classList.toggle('on', b.dataset.lang === lang);
    });
    document.dispatchEvent(new CustomEvent('lory-lang', { detail: { lang: lang } }));
  }

  function bindLang() {
    document.querySelectorAll('.nav-lang button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setLang(btn.dataset.lang);
      });
    });
  }

  /* ---------- HELPERS ---------- */

  /** Format number with locale separators */
  function fmtNum(n, dec) {
    if (dec === undefined) dec = 0;
    if (n == null || isNaN(n)) return '—';
    return Number(n).toLocaleString('fr-FR', {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec
    });
  }

  /** Translation helper — returns HE or FR string based on current lang */
  function tx(he, fr) {
    var lang = document.documentElement.getAttribute('lang') || state.lang;
    return lang === 'he' ? he : fr;
  }

  /** getElementById shorthand */
  function el(id) {
    return document.getElementById(id);
  }

  /** Safe innerHTML set — only writes if element exists */
  function safeSet(id, html) {
    var node = document.getElementById(id);
    if (node) node.innerHTML = html;
  }

  /** Get current language */
  function getLang() {
    return state.lang;
  }

  /* ---------- SCROLL REVEAL ---------- */
  function initReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything
      reveals.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- ACTIVE NAV LINK ---------- */
  function highlightNav() {
    var path = window.location.pathname;
    var page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href === page || (page === 'index.html' && (href === '.' || href === './' || href === 'index.html'))) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }

  /* ---------- PDF EXPORT ---------- */
  function exportPDF() {
    document.body.classList.add('printing');
    // Small delay to let CSS apply
    setTimeout(function () {
      window.print();
      document.body.classList.remove('printing');
    }, 100);
  }

  /* ---------- INIT ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    bindLang();
    setLang(state.lang);
    initReveal();
    highlightNav();

    // Bind PDF buttons
    document.querySelectorAll('.btn-pdf, [data-action="pdf"]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        exportPDF();
      });
    });
  });

  /* ---------- PUBLIC API ---------- */
  window.LORY_UTILS = {
    fmtNum: fmtNum,
    tx: tx,
    el: el,
    safeSet: safeSet,
    getLang: getLang,
    setLang: setLang,
    exportPDF: exportPDF
  };

  // Also expose at top level for convenience
  window.fmtNum = fmtNum;
  window.tx = tx;
  window.el = el;
  window.safeSet = safeSet;
  window.exportPDF = exportPDF;

})();
