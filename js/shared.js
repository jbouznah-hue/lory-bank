/* ============================================================
   LORY EVENTS & CATERING — Shared utilities
   Helpers, scroll reveal, PDF export
   ============================================================ */

(function () {
  'use strict';

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

  /** getElementById shorthand */
  function el(id) {
    return document.getElementById(id);
  }

  /** Safe innerHTML set — only writes if element exists */
  function safeSet(id, html) {
    var node = document.getElementById(id);
    if (node) node.innerHTML = html;
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
    el: el,
    safeSet: safeSet,
    exportPDF: exportPDF
  };

  // Also expose at top level for convenience
  window.fmtNum = fmtNum;
  window.el = el;
  window.safeSet = safeSet;
  window.exportPDF = exportPDF;

})();
