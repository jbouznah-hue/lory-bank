/* ============================================================
   LORY — script partagé : langue + densité + thème + tweaks panel
   ============================================================ */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "institutionnel",
  "density": "default",
  "lang": "he"
}/*EDITMODE-END*/;

const lorState = {
  theme: TWEAK_DEFAULTS.theme,
  density: TWEAK_DEFAULTS.density,
  lang: TWEAK_DEFAULTS.lang
};

const html = document.documentElement;

/* ---------- LANG ---------- */
function setLang(lang) {
  lorState.lang = lang;
  html.setAttribute('lang', lang);
  html.setAttribute('dir', lang === 'he' ? 'rtl' : 'ltr');
  document.querySelectorAll('.nav-lang button').forEach(b => {
    b.classList.toggle('on', b.dataset.lang === lang);
  });
  document.dispatchEvent(new CustomEvent('lorylang', { detail: { lang } }));
  persist();
}
function bindLang() {
  document.querySelectorAll('.nav-lang button').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });
}

/* ---------- THEME / DENSITY ---------- */
function setTheme(theme) {
  lorState.theme = theme;
  html.setAttribute('data-theme', theme);
  document.querySelectorAll('.theme-radio button').forEach(b => {
    b.classList.toggle('on', b.dataset.theme === theme);
  });
  document.dispatchEvent(new CustomEvent('lorytheme'));
  persist();
}
function setDensity(density) {
  lorState.density = density;
  html.setAttribute('data-density', density);
  document.querySelectorAll('.density-radio button').forEach(b => {
    b.classList.toggle('on', b.dataset.density === density);
  });
  persist();
}

/* ---------- TWEAKS PANEL ---------- */
function mountTweaks() {
  const tweaks = document.getElementById('tweaks');
  if (!tweaks) return;
  const close = document.getElementById('tweaks-close');
  function open() { tweaks.classList.add('on'); }
  function shut() {
    tweaks.classList.remove('on');
    window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
  }
  window.addEventListener('message', e => {
    if (!e.data || typeof e.data !== 'object') return;
    if (e.data.type === '__activate_edit_mode') open();
    if (e.data.type === '__deactivate_edit_mode') shut();
  });
  close && close.addEventListener('click', shut);
  document.querySelectorAll('.theme-radio button').forEach(btn => {
    btn.addEventListener('click', () => setTheme(btn.dataset.theme));
  });
  document.querySelectorAll('.density-radio button').forEach(btn => {
    btn.addEventListener('click', () => setDensity(btn.dataset.density));
  });
  window.parent.postMessage({ type: '__edit_mode_available' }, '*');
}

function persist() {
  window.parent.postMessage({
    type: '__edit_mode_set_keys',
    edits: {
      theme: lorState.theme,
      density: lorState.density,
      lang: lorState.lang
    }
  }, '*');
}

/* ---------- HELPERS ---------- */
function fmtNum(n, dec = 0) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  bindLang();
  setLang(TWEAK_DEFAULTS.lang);
  setTheme(TWEAK_DEFAULTS.theme);
  setDensity(TWEAK_DEFAULTS.density);
  mountTweaks();
});
