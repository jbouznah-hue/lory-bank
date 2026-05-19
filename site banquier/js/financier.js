/* ============================================================
   LORY — financier.html
   Plan de financement + prévisionnel de trésorerie 24 mois
   ============================================================ */

/* ---------- DATA ---------- */
/* CA mensuel en k₪ HT par axe. M1-M6 = setup (CA = 0). M7 (août 26) = ouverture. */
const previs = {
  axes: {
    shabbat:   { he: 'שבת — חנות + בוקסים', fr: 'Shabbat — boutique + box', tier: 'recurrent',
      vals: [0,0,0,0,0,0,  28,45,55,52,62,82,  88,92,92,92,92,98,  100,100,104,104,104,108] },
    hatan:     { he: 'שבת חתן', fr: 'Shabbat Hatan', tier: 'recurrent',
      vals: [0,0,0,0,0,0,   8,12,14,12,16,22,  24,24,24,24,24,26,   26,26,28,28,28,30] },
    midi:      { he: 'תפריט צהריים — משרדים', fr: 'Midi — bureaux', tier: 'recurrent',
      vals: [0,0,0,0,0,0,   6,14,20,18,24,30,  34,34,34,34,34,38,   38,38,40,40,40,42] },
    fetes:     { he: 'חגים — תשרי / חנוכה / פסח', fr: 'Fêtes — Tishrei / Hanouka / Pessah', tier: 'saisonnier',
      vals: [0,0,0,0,0,0,   0,55,95,0, 0,60,    0,0,0,0,55,0,        0,90,0,0,65,0] },
    leftof:    { he: 'צה״ל · LeftOf', fr: 'TSAHAL · LeftOf', tier: 'recurrent',
      vals: [0,0,0,0,0,0,   0,18,18,0, 0,18,    0,18,0,0,18,0,       0,18,0,0,18,0] },
    evenements:{ he: 'אירועים · חתונות / ברית', fr: 'Événements · mariages / brit', tier: 'recurrent',
      vals: [0,0,0,0,0,0,   5,10,12,10,14,18,  22,22,22,22,22,24,   24,24,26,26,26,28] }
  },
  /* Décaissements en k₪ HT */
  charges: {
    matieres:   { he: 'חומרי גלם (30%)', fr: 'Matières premières (30% CA)', auto: true },
    salaires:   { he: 'שכר — טומי + 2 עובדים', fr: 'Salaires — Tommy + 2 employés', auto: false,
      vals: [0,0,0,0,0,8, 22,24,26,26,28,30,  32,32,32,32,32,34,   34,34,36,36,36,38] },
    loyer:      { he: 'שכר דירה (100 מ״ר)', fr: 'Loyer (100 m²)', auto: false,
      vals: Array(24).fill(15) },
    arnona:     { he: 'ארנונה + מים + חשמל', fr: 'Arnona + eau + électricité', auto: false,
      vals: Array(6).fill(1).concat(Array(18).fill(3.5)) },
    marketing:  { he: 'שיווק דיגיטלי · ORRTYL', fr: 'Marketing digital · ORRTYL', auto: false,
      vals: Array(12).fill(5).concat(Array(12).fill(2.5)) },
    comptable:  { he: 'רואת חשבון · Sarah Myriam', fr: 'Comptable · Sarah Myriam', auto: false,
      vals: Array(24).fill(1.5) },
    kashrout:   { he: 'כשרות (רבנות)', fr: 'Kashrout (Rabbanut)', auto: false,
      vals: Array(6).fill(0).concat(Array(18).fill(2)) },
    investissement: { he: 'השקעה (עבודות, ציוד, רכב)', fr: 'Investissement (travaux, équip., véhicule)', auto: false,
      vals: [98,196,215,215,160,98, 0,0,0,0,0,0, 0,0,0,0,0,0, 0,0,0,0,0,0] },
    pret:       { he: 'החזר הלוואה (850k @ 6,5% / 6 ans)', fr: 'Mensualité prêt (850k @ 6,5% / 6 ans)', auto: false,
      vals: Array(6).fill(0).concat(Array(18).fill(14.25)) }
  },
  /* TVA 18% Israël — appliquée sur CA HT */
  tva: 0.18,
  /* Ressources initiales (k₪) */
  loan: 850,
  apport: 190,
  /* Labels mois */
  months: [
    {n: 1, fr: 'Juin 26', he: 'יוני 26'},
    {n: 2, fr: 'Juil. 26', he: 'יולי 26'},
    {n: 3, fr: 'Août 26', he: 'אוגוסט 26'},   // travaux
    {n: 4, fr: 'Sept. 26', he: 'ספט׳ 26'},
    {n: 5, fr: 'Oct. 26', he: 'אוק׳ 26'},
    {n: 6, fr: 'Nov. 26', he: 'נוב׳ 26'},
    {n: 7, fr: 'Déc. 26', he: 'דצמ׳ 26', tag: 'opening'},  // ouverture
    {n: 8, fr: 'Janv. 27', he: 'ינו׳ 27'},
    {n: 9, fr: 'Fév. 27', he: 'פבר׳ 27'},
    {n:10, fr: 'Mars 27', he: 'מרץ 27'},
    {n:11, fr: 'Avril 27', he: 'אפר׳ 27', tag: 'pessah'},  // Pessah
    {n:12, fr: 'Mai 27', he: 'מאי 27'},
    {n:13, fr: 'Juin 27', he: 'יוני 27'},
    {n:14, fr: 'Juil. 27', he: 'יולי 27'},
    {n:15, fr: 'Août 27', he: 'אוגוסט 27'},
    {n:16, fr: 'Sept. 27', he: 'ספט׳ 27', tag: 'tishrei'}, // Tishrei
    {n:17, fr: 'Oct. 27', he: 'אוק׳ 27'},
    {n:18, fr: 'Nov. 27', he: 'נוב׳ 27'},
    {n:19, fr: 'Déc. 27', he: 'דצמ׳ 27', tag: 'hanouka'},  // Hanouka
    {n:20, fr: 'Janv. 28', he: 'ינו׳ 28'},
    {n:21, fr: 'Fév. 28', he: 'פבר׳ 28'},
    {n:22, fr: 'Mars 28', he: 'מרץ 28'},
    {n:23, fr: 'Avril 28', he: 'אפר׳ 28', tag: 'pessah'},  // Pessah
    {n:24, fr: 'Mai 28', he: 'מאי 28'}
  ]
};

/* ---------- COMPUTE ---------- */
function buildPrevis() {
  const N = 24;
  // CA HT par mois
  const caHT = Array(N).fill(0);
  Object.values(previs.axes).forEach(axe => {
    axe.vals.forEach((v, i) => caHT[i] += v);
  });
  // Matières premières auto = 30% CA HT
  previs.charges.matieres.vals = caHT.map(c => +(c * 0.30).toFixed(2));
  // TVA collectée sur CA, TVA déductible sur matières + marketing + loyer + arnona + invest
  const tvaCol = caHT.map(c => +(c * previs.tva).toFixed(2));
  const baseDed = Array(N).fill(0);
  ['matieres','loyer','arnona','marketing','investissement'].forEach(k => {
    previs.charges[k].vals.forEach((v, i) => baseDed[i] += v);
  });
  const tvaDed = baseDed.map(b => +(b * previs.tva).toFixed(2));
  const tvaNet = tvaCol.map((c, i) => +(c - tvaDed[i]).toFixed(2)); // à reverser (si >0) ou crédit

  // Totaux
  const totalEnc = caHT.map((c, i) => +(c + tvaCol[i]).toFixed(2)); // TTC
  const totalDec = Array(N).fill(0);
  Object.values(previs.charges).forEach(ch => {
    ch.vals.forEach((v, i) => totalDec[i] += v);
  });
  // Décaissements TTC = charges HT + TVA déductible + TVA à reverser (si >0)
  const decTTC = totalDec.map((d, i) => +(d + tvaDed[i] + Math.max(0, tvaNet[i])).toFixed(2));

  // Solde mensuel
  const solde = totalEnc.map((e, i) => +(e - decTTC[i]).toFixed(2));
  // Cumul (départ = apport 190 + prêt 500 = 690k)
  const cumul = [];
  let c = previs.apport + previs.loan;
  solde.forEach(s => { c += s; cumul.push(+c.toFixed(2)); });

  return { caHT, tvaCol, tvaDed, tvaNet, totalEnc, decTTC, solde, cumul };
}

/* ---------- RENDER TABLE ---------- */
function renderPrevis() {
  const root = document.getElementById('previs-table');
  if (!root) return;
  const data = buildPrevis();
  const lang = lorState.lang || 'he';
  const tx = (he, fr) => lang === 'he' ? he : fr;

  // Build colgroups: header months
  let html = '<div class="previs-scroll"><table class="previs">';
  // THEAD
  html += '<thead><tr>';
  html += `<th class="sticky-col">${tx('שורה','Ligne')}</th>`;
  previs.months.forEach(m => {
    const tagClass = m.tag ? ` tag-${m.tag}` : '';
    html += `<th class="col-month${tagClass}"><div class="mlbl">M${m.n}</div><div class="mdate">${tx(m.he, m.fr)}</div></th>`;
  });
  html += `<th class="col-total">${tx('סה״כ','Total')}</th>`;
  html += '</tr></thead><tbody>';

  // SECTION ENCAISSEMENTS
  html += `<tr class="section-row"><td colspan="${26}">${tx('הכנסות (לפי ציר)','Encaissements (par axe)')}</td></tr>`;
  Object.entries(previs.axes).forEach(([k, axe]) => {
    html += `<tr><td class="sticky-col">${tx(axe.he, axe.fr)}</td>`;
    let tot = 0;
    axe.vals.forEach(v => { tot += v; html += `<td class="num${v===0?' zero':''}">${v ? fmtNum(v,0) : '—'}</td>`; });
    html += `<td class="num strong">${fmtNum(tot,0)}</td></tr>`;
  });
  // CA HT
  html += `<tr class="sub-total"><td class="sticky-col">${tx('סה״כ הכנסות (לא כולל מע״מ)','CA HT')}</td>`;
  let totHT = 0;
  data.caHT.forEach(v => { totHT += v; html += `<td class="num">${v ? fmtNum(v,0) : '—'}</td>`; });
  html += `<td class="num strong">${fmtNum(totHT,0)}</td></tr>`;
  // TVA collectée
  html += `<tr><td class="sticky-col">${tx('מע״מ שנגבה (18%)','TVA collectée (18%)')}</td>`;
  let totTvaC = 0;
  data.tvaCol.forEach(v => { totTvaC += v; html += `<td class="num${v===0?' zero':''}">${v ? fmtNum(v,1).replace('.',',') : '—'}</td>`; });
  html += `<td class="num strong">${fmtNum(totTvaC,0)}</td></tr>`;
  // Total encaissements TTC
  html += `<tr class="total-row"><td class="sticky-col">${tx('סה״כ תקבולים (כולל מע״מ)','Total encaissements TTC')}</td>`;
  let totEnc = 0;
  data.totalEnc.forEach(v => { totEnc += v; html += `<td class="num">${v ? fmtNum(v,0) : '—'}</td>`; });
  html += `<td class="num strong">${fmtNum(totEnc,0)}</td></tr>`;

  // SECTION DÉCAISSEMENTS
  html += `<tr class="section-row neg"><td colspan="${26}">${tx('הוצאות (לפי סעיף)','Décaissements (par poste)')}</td></tr>`;
  Object.entries(previs.charges).forEach(([k, ch]) => {
    html += `<tr><td class="sticky-col">${tx(ch.he, ch.fr)}</td>`;
    let tot = 0;
    ch.vals.forEach(v => { tot += v; html += `<td class="num${v===0?' zero':''}">${v ? fmtNum(v,0) : '—'}</td>`; });
    html += `<td class="num strong">${fmtNum(tot,0)}</td></tr>`;
  });
  // TVA déductible
  html += `<tr><td class="sticky-col">${tx('מע״מ ניכוי תשומות','TVA déductible')}</td>`;
  let totTvaD = 0;
  data.tvaDed.forEach(v => { totTvaD += v; html += `<td class="num${v===0?' zero':''}">${v ? fmtNum(v,1).replace('.',',') : '—'}</td>`; });
  html += `<td class="num strong">${fmtNum(totTvaD,0)}</td></tr>`;
  // TVA à reverser
  html += `<tr><td class="sticky-col">${tx('מע״מ להעברה (נטו)','TVA à reverser (net)')}</td>`;
  let totTvaN = 0;
  data.tvaNet.forEach(v => {
    const reverser = Math.max(0, v);
    totTvaN += reverser;
    html += `<td class="num${reverser===0?' zero':''}">${reverser ? fmtNum(reverser,1).replace('.',',') : '—'}</td>`;
  });
  html += `<td class="num strong">${fmtNum(totTvaN,0)}</td></tr>`;
  // Total décaissements TTC
  html += `<tr class="total-row neg"><td class="sticky-col">${tx('סה״כ תשלומים (כולל מע״מ)','Total décaissements TTC')}</td>`;
  let totDec = 0;
  data.decTTC.forEach(v => { totDec += v; html += `<td class="num">${fmtNum(v,0)}</td>`; });
  html += `<td class="num strong">${fmtNum(totDec,0)}</td></tr>`;

  // SOLDE
  html += `<tr class="solde-row"><td class="sticky-col">${tx('יתרה חודשית','Solde mensuel')}</td>`;
  data.solde.forEach(v => {
    const cls = v < 0 ? 'num neg' : 'num pos';
    html += `<td class="${cls}">${v >= 0 ? fmtNum(v,0) : '−'+fmtNum(-v,0)}</td>`;
  });
  const totSolde = data.solde.reduce((a,b) => a+b, 0);
  html += `<td class="num strong ${totSolde<0?'neg':'pos'}">${totSolde>=0 ? fmtNum(totSolde,0) : '−'+fmtNum(-totSolde,0)}</td></tr>`;
  // CUMUL
  html += `<tr class="cumul-row"><td class="sticky-col">${tx('תזרים מצטבר','Trésorerie cumulée')}</td>`;
  data.cumul.forEach(v => {
    const cls = v < 0 ? 'num neg strong' : 'num strong';
    html += `<td class="${cls}">${v >= 0 ? fmtNum(v,0) : '−'+fmtNum(-v,0)}</td>`;
  });
  html += `<td class="num strong">—</td></tr>`;

  html += '</tbody></table></div>';
  root.innerHTML = html;

  // Bottom KPIs
  document.getElementById('previs-kpi-pointmort').textContent = (() => {
    const idx = data.cumul.findIndex((v,i) => i>6 && data.solde[i] > 0);
    return idx > -1 ? 'M'+(idx+1) : '—';
  })();
  const minCum = Math.min(...data.cumul);
  document.getElementById('previs-kpi-min').innerHTML = `${fmtNum(minCum,0)}<span class="unit">k ₪</span>`;
  const finCum = data.cumul[23];
  document.getElementById('previs-kpi-fin').innerHTML = `${fmtNum(finCum,0)}<span class="unit">k ₪</span>`;
  const caY1 = data.caHT.slice(6,18).reduce((a,b)=>a+b,0);
  const caY2 = data.caHT.slice(18,24).reduce((a,b)=>a+b,0) * 2; // extrapolation prudente
  document.getElementById('previs-kpi-cay1').innerHTML = `${fmtNum(caY1,0)}<span class="unit">k ₪</span>`;
}

/* ---------- LOAN SIMULATOR ---------- */
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
  document.getElementById('loan-years').textContent = years;
  document.getElementById('loan-rate').textContent = rate.toFixed(1).replace('.', ',');
  const { monthly, total } = computeLoan(amount, years, rate);
  document.getElementById('monthly-payment').innerHTML = `${fmtNum(monthly)}<span class="unit">₪</span>`;
  document.getElementById('total-interest').innerHTML = `${fmtNum((total-amount)/1000, 1).replace('.', ',')}<span class="unit">k</span>`;
}

/* ---------- BREAK-EVEN ---------- */
function updateBE() {
  const panier = +document.getElementById('panier-slider').value;
  const mat = +document.getElementById('material-slider').value;
  const fixed = +document.getElementById('fixed-slider').value;
  document.getElementById('panier-val').textContent = panier;
  document.getElementById('material-val').textContent = mat;
  document.getElementById('fixed-val').textContent = fixed;
  const margin = (100 - mat) / 100;
  const beCA = (fixed * 1000) / margin;
  document.getElementById('be-ca').innerHTML = `${fmtNum(beCA/1000,1).replace('.',',')}<span class="unit">k ₪</span>`;
  document.getElementById('be-couverts').textContent = fmtNum(beCA / panier);
  document.getElementById('be-shabbat').textContent = `~${fmtNum(beCA / panier / 4)}`;
}

/* ---------- GANTT TOGGLES ---------- */
function bindGantt() {
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
}

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  ['loan-slider','years-slider','rate-slider'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateLoanSim);
  });
  ['panier-slider','material-slider','fixed-slider'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateBE);
  });
  updateLoanSim();
  updateBE();
  bindGantt();
  renderPrevis();
  document.addEventListener('lorylang', renderPrevis);
});
