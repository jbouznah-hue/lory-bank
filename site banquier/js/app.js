/* ============================================================
   LORY Events & Catering — Site Banquier
   app.js — interactions + tweaks
   ============================================================ */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "institutionnel",
  "density": "default",
  "loanAmount": 850,
  "lang": "he"
}/*EDITMODE-END*/;

const state = {
  theme: TWEAK_DEFAULTS.theme,
  density: TWEAK_DEFAULTS.density,
  loanAmount: TWEAK_DEFAULTS.loanAmount,
  lang: TWEAK_DEFAULTS.lang,
  scenario: 'base'
};

const html = document.documentElement;
const bpData = JSON.parse(document.getElementById('bp-data').textContent);

/* ============================================================
   LANG TOGGLE
   ============================================================ */
function setLang(lang) {
  state.lang = lang;
  html.setAttribute('lang', lang);
  html.setAttribute('dir', lang === 'he' ? 'rtl' : 'ltr');
  document.querySelectorAll('.nav-lang button').forEach(b => {
    b.classList.toggle('on', b.dataset.lang === lang);
  });
}
document.querySelectorAll('.nav-lang button').forEach(btn => {
  btn.addEventListener('click', () => setLang(btn.dataset.lang));
});

/* ============================================================
   THEME + DENSITY TOGGLE
   ============================================================ */
function setTheme(theme) {
  state.theme = theme;
  html.setAttribute('data-theme', theme);
  document.querySelectorAll('.theme-radio button').forEach(b => {
    b.classList.toggle('on', b.dataset.theme === theme);
  });
  drawCashflow();
  persist();
}
function setDensity(density) {
  state.density = density;
  html.setAttribute('data-density', density);
  document.querySelectorAll('.density-radio button').forEach(b => {
    b.classList.toggle('on', b.dataset.density === density);
  });
  persist();
}
document.querySelectorAll('.theme-radio button').forEach(btn => {
  btn.addEventListener('click', () => setTheme(btn.dataset.theme));
});
document.querySelectorAll('.density-radio button').forEach(btn => {
  btn.addEventListener('click', () => setDensity(btn.dataset.density));
});

/* ============================================================
   LOAN SIMULATOR
   ============================================================ */
function fmtNum(n, dec = 0) {
  const lang = state.lang === 'he' ? 'fr-FR' : 'fr-FR';
  return n.toLocaleString(lang, { minimumFractionDigits: dec, maximumFractionDigits: dec });
}
function computeLoan(amount, years, rateAnnual) {
  const r = rateAnnual / 12 / 100;
  const n = years * 12;
  if (r === 0) return { monthly: amount / n, total: amount };
  const monthly = (amount * r) / (1 - Math.pow(1 + r, -n));
  return { monthly, total: monthly * n };
}
function updateLoanSim() {
  const amount = +document.getElementById('loan-slider').value * 1000;
  const years = +document.getElementById('years-slider').value;
  const rate = +document.getElementById('rate-slider').value / 10;
  document.getElementById('loan-amount').textContent = (amount / 1000).toFixed(0);
  document.getElementById('years-slider').nextElementSibling; // no-op
  document.getElementById('loan-years').textContent = years;
  document.getElementById('loan-rate').textContent = rate.toFixed(1).replace('.', ',');

  const { monthly, total } = computeLoan(amount, years, rate);
  document.getElementById('monthly-payment').innerHTML = `${fmtNum(monthly)}<span class="unit">₪</span>`;
  const interest = total - amount;
  document.getElementById('total-interest').innerHTML = `${fmtNum(interest / 1000, 1).replace('.', ',')}<span class="unit">k</span>`;
}
['loan-slider', 'years-slider', 'rate-slider'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', updateLoanSim);
});

/* ============================================================
   BREAK-EVEN SIMULATOR
   ============================================================ */
function updateBreakEven() {
  const panier = +document.getElementById('panier-slider').value;
  const matPct = +document.getElementById('material-slider').value;
  const fixed = +document.getElementById('fixed-slider').value;

  document.getElementById('panier-val').textContent = panier;
  document.getElementById('material-val').textContent = matPct;
  document.getElementById('fixed-val').textContent = fixed;

  const margin = (100 - matPct) / 100;
  const beCA = (fixed * 1000) / margin;
  const beCouverts = beCA / panier;
  const beShabbat = beCouverts / 4;

  document.getElementById('be-ca').innerHTML = `${fmtNum(beCA / 1000, 1).replace('.', ',')}<span class="unit">k ₪</span>`;
  document.getElementById('be-couverts').textContent = fmtNum(beCouverts);
  document.getElementById('be-shabbat').textContent = `~${fmtNum(beShabbat)}`;
}
['panier-slider', 'material-slider', 'fixed-slider'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', updateBreakEven);
});

/* ============================================================
   CASHFLOW CHART
   ============================================================ */
function buildCashflowData(scenario) {
  const monthly = bpData.scenarios[scenario].monthlyRevenue.slice(); // in k₪
  const fixedCharges = bpData.fixedCharges; // 50k
  const materialPct = bpData.materialPct;   // 0.30
  const loanMonthly = bpData.loanMonthly;   // 8.38k
  const INVEST_TOTAL = 1043;                // k₪ (besoin)
  const APPORT = 193;                       // k₪
  const cashIn = state.loanAmount + APPORT; // ressources

  // Build month-by-month cashflow
  // Months 1-6 = setup phase: outflows from investment spread over M1-M6
  const investSchedule = [98, 196, 215, 215, 160, 98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  // Initial cash = apport + loan = 690k disponible au M1
  let cumulative = cashIn;
  const cashflowCumul = [];
  const monthlyNet = [];
  for (let i = 0; i < 36; i++) {
    const revenue = monthly[i] || 0;
    const cogs = revenue * materialPct;
    const grossMargin = revenue - cogs;
    const charges = revenue > 0 ? fixedCharges + loanMonthly : (i >= 6 ? loanMonthly : 0);
    const invest = investSchedule[i] || 0;
    const net = grossMargin - charges - invest;
    monthlyNet.push(net);
    cumulative += net;
    cashflowCumul.push(cumulative);
  }
  return { monthly, cashflowCumul, monthlyNet };
}

function drawCashflow() {
  const svg = document.getElementById('cashflow-chart');
  if (!svg) return;
  const data = buildCashflowData(state.scenario);

  const W = 800, H = 380;
  const M = { t: 30, r: 50, b: 50, l: 60 };
  const innerW = W - M.l - M.r;
  const innerH = H - M.t - M.b;

  // Y scale: combine cumulative + monthly revenue
  const allVals = [...data.cashflowCumul, ...data.monthly, 0];
  const yMin = Math.min(...allVals);
  const yMax = Math.max(...allVals);
  const yRange = yMax - yMin;
  const yPad = yRange * 0.1;
  const y0 = yMin - yPad;
  const y1 = yMax + yPad;

  const xScale = i => M.l + (i / 35) * innerW;
  const yScale = v => M.t + innerH - ((v - y0) / (y1 - y0)) * innerH;
  const yZero = yScale(0);

  // Build path strings
  const cumulPath = data.cashflowCumul.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(v)}`).join(' ');
  const revPath = data.monthly.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(v)}`).join(' ');

  // Y axis ticks
  const ticks = 5;
  let gridLines = '';
  let yLabels = '';
  for (let i = 0; i <= ticks; i++) {
    const v = y0 + (y1 - y0) * (i / ticks);
    const y = yScale(v);
    gridLines += `<line class="grid" x1="${M.l}" y1="${y}" x2="${W - M.r}" y2="${y}"/>`;
    yLabels += `<text class="axis-label" x="${M.l - 8}" y="${y + 3}" text-anchor="end">${Math.round(v)}k</text>`;
  }

  // X axis: months
  let xLabels = '';
  for (let i = 0; i < 36; i += 3) {
    const x = xScale(i);
    xLabels += `<text class="axis-label" x="${x}" y="${H - M.b + 18}" text-anchor="middle">M${i + 1}</text>`;
  }

  // BE line (point mort): charges fixes + loan
  const beValue = bpData.fixedCharges;
  const beY = yScale(beValue);
  const beLine = (beY >= M.t && beY <= H - M.b) ? `<line class="zero-line" x1="${M.l}" y1="${beY}" x2="${W - M.r}" y2="${beY}"/><text class="axis-label" x="${W - M.r - 4}" y="${beY - 4}" text-anchor="end" fill="var(--ink-soft)">point mort ${beValue}k</text>` : '';

  // Vertical line at M7 (opening)
  const xM7 = xScale(6);
  const openingLine = `<line stroke="var(--accent)" stroke-width="1" stroke-dasharray="3 3" opacity="0.6" x1="${xM7}" y1="${M.t}" x2="${xM7}" y2="${H - M.b}"/><text class="axis-label" x="${xM7 + 4}" y="${M.t + 12}" fill="var(--accent)" text-anchor="start">M7 · ouverture</text>`;

  // Points
  let cumulPoints = '';
  let revPoints = '';
  for (let i = 0; i < 36; i++) {
    if (i % 3 === 0) {
      cumulPoints += `<circle class="point" cx="${xScale(i)}" cy="${yScale(data.cashflowCumul[i])}" r="3.5" fill="var(--negative)"/>`;
      revPoints += `<circle class="point" cx="${xScale(i)}" cy="${yScale(data.monthly[i])}" r="3.5" fill="var(--positive)"/>`;
    }
  }

  // Zero baseline if 0 is in range
  const zeroLine = (yZero >= M.t && yZero <= H - M.b) ? `<line class="axis" x1="${M.l}" y1="${yZero}" x2="${W - M.r}" y2="${yZero}" opacity="0.4"/>` : '';

  svg.innerHTML = `
    ${gridLines}
    ${zeroLine}
    ${beLine}
    ${openingLine}
    <line class="axis" x1="${M.l}" y1="${M.t}" x2="${M.l}" y2="${H - M.b}"/>
    <line class="axis" x1="${M.l}" y1="${H - M.b}" x2="${W - M.r}" y2="${H - M.b}"/>
    ${yLabels}
    ${xLabels}
    <path class="line" d="${revPath}" stroke="var(--positive)"/>
    <path class="line" d="${cumulPath}" stroke="var(--negative)"/>
    ${revPoints}
    ${cumulPoints}
    <text class="axis-label" x="${W - M.r}" y="${M.t - 8}" text-anchor="end">en k ₪</text>
  `;
}

document.querySelectorAll('[data-scenario]').forEach(btn => {
  btn.addEventListener('click', () => {
    state.scenario = btn.dataset.scenario;
    document.querySelectorAll('[data-scenario]').forEach(b => {
      b.style.background = b.dataset.scenario === state.scenario ? 'var(--ink)' : '';
      b.style.color = b.dataset.scenario === state.scenario ? 'var(--bg)' : '';
    });
    drawCashflow();
  });
});

/* ============================================================
   GANTT DETAIL TOGGLES
   ============================================================ */
document.querySelectorAll('.gantt-row').forEach(row => {
  row.addEventListener('click', () => {
    const id = row.dataset.detail;
    if (!id) return;
    const detail = document.getElementById(id);
    if (!detail) return;
    const wasOpen = detail.classList.contains('on');
    document.querySelectorAll('.gantt-detail').forEach(d => d.classList.remove('on'));
    if (!wasOpen) detail.classList.add('on');
  });
});

/* ============================================================
   TWEAK LOAN AMOUNT (changes KPI + breakeven)
   ============================================================ */
function setLoanAmount(amount) {
  state.loanAmount = amount;
  document.getElementById('tweak-loan-display').textContent = `${amount}k ₪`;
  document.getElementById('kpi-loan').innerHTML = `${amount}<span class="unit">k ₪</span>`;
  const APPORT = 193;
  document.getElementById('kpi-total').innerHTML = `${amount + APPORT}<span class="unit">k ₪</span>`;
  document.getElementById('loan-amount-display').textContent = fmtNum(amount * 1000);
  const pct = (amount / (amount + APPORT) * 100).toFixed(1).replace('.', ',');
  document.getElementById('loan-pct-display').textContent = `${pct}%`;

  // Update simulator default
  const slider = document.getElementById('loan-slider');
  if (slider) {
    slider.value = amount;
    updateLoanSim();
  }
  drawCashflow();
  persist();
}
document.getElementById('tweak-loan').addEventListener('input', e => {
  setLoanAmount(+e.target.value);
});

/* ============================================================
   TWEAKS PANEL — EDIT MODE PROTOCOL
   ============================================================ */
const tweaks = document.getElementById('tweaks');
function openTweaks() { tweaks.classList.add('on'); }
function closeTweaks() {
  tweaks.classList.remove('on');
  window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
}
window.addEventListener('message', e => {
  if (!e.data || typeof e.data !== 'object') return;
  if (e.data.type === '__activate_edit_mode') openTweaks();
  if (e.data.type === '__deactivate_edit_mode') closeTweaks();
});
document.getElementById('tweaks-close').addEventListener('click', closeTweaks);
window.parent.postMessage({ type: '__edit_mode_available' }, '*');

function persist() {
  window.parent.postMessage({
    type: '__edit_mode_set_keys',
    edits: {
      theme: state.theme,
      density: state.density,
      loanAmount: state.loanAmount,
      lang: state.lang
    }
  }, '*');
}

/* ============================================================
   INIT
   ============================================================ */
function init() {
  setLang(TWEAK_DEFAULTS.lang);
  setTheme(TWEAK_DEFAULTS.theme);
  setDensity(TWEAK_DEFAULTS.density);
  setLoanAmount(TWEAK_DEFAULTS.loanAmount);
  updateLoanSim();
  updateBreakEven();
  drawCashflow();
}
init();

// Redraw on resize for SVG sizing
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(drawCashflow, 200);
});
