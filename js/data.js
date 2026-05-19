/* ============================================================
   LORY EVENTS & CATERING — Central Reactive Data Model
   js/data.js

   Everything lives in window.LORY
   recalculate() computes derived values into LORY.computed
   Fires CustomEvent 'lory-update' on document after each recalc
   ============================================================ */

(function () {
  'use strict';

  /* ==========================================================
     RAW DATA
     ========================================================== */

  var LORY = window.LORY = {};

  /* ---------- EXPENSES (27 items, devis reels) ---------- */
  LORY.expenses = [
    // --- Travaux Lyor Zerbib #1018 (17/05/2026) ---
    { id: 1,  cat: 'travaux',    label_fr: 'Plomberie',                   label_he: 'אינסטלציה',                    ht: 60550,  month: 1, devis: 'Lyor Zerbib #1018' },
    { id: 2,  cat: 'travaux',    label_fr: 'Electricite',                  label_he: 'חשמל',                         ht: 45000,  month: 1, devis: 'Lyor Zerbib #1018' },
    { id: 3,  cat: 'travaux',    label_fr: 'Etancheite',                   label_he: 'איטום',                        ht: 21500,  month: 1, devis: 'Lyor Zerbib #1018' },
    { id: 4,  cat: 'travaux',    label_fr: 'Cloisons placo',              label_he: 'מחיצות גבס',                   ht: 109200, month: 1, devis: 'Lyor Zerbib #1018' },
    { id: 5,  cat: 'travaux',    label_fr: 'Surelevation sol',            label_he: 'הגבהת רצפה',                   ht: 60000,  month: 2, devis: 'Lyor Zerbib #1018' },
    { id: 6,  cat: 'travaux',    label_fr: 'Carrelage pose',              label_he: 'ריצוף והנחה',                  ht: 191940, month: 2, devis: 'Lyor Zerbib #1018' },
    { id: 7,  cat: 'travaux',    label_fr: 'Materiaux carrelage (457m2)', label_he: 'חומרי ריצוף (457 מ״ר)',        ht: 182800, month: 2, devis: 'Lyor Zerbib #1018' },

    // --- Equipement Gastroline PQ26-3517 (18/05/2026) ---
    { id: 8,  cat: 'equipement', label_fr: 'Vitrine refrigeree',          label_he: 'ויטרינה מקוררת',               ht: 15900,  month: 3, devis: 'Gastroline PQ26-3517' },
    { id: 9,  cat: 'equipement', label_fr: 'Table nirosta+evier 180',     label_he: 'שולחן נירוסטה+כיור 180',       ht: 3300,   month: 3, devis: 'Gastroline PQ26-3517' },
    { id: 10, cat: 'equipement', label_fr: 'Blast chiller',               label_he: 'בלאסט צ׳ילר',                  ht: 8900,   month: 3, devis: 'Gastroline PQ26-3517' },
    { id: 11, cat: 'equipement', label_fr: 'Four convection',             label_he: 'תנור קונבקציה',                ht: 18900,  month: 3, devis: 'Gastroline PQ26-3517' },
    { id: 12, cat: 'equipement', label_fr: 'Stand combi',                 label_he: 'סטנד קומבי',                   ht: 2500,   month: 3, devis: 'Gastroline PQ26-3517' },
    { id: 13, cat: 'equipement', label_fr: 'Grill gaz',                   label_he: 'גריל גז',                      ht: 7000,   month: 3, devis: 'Gastroline PQ26-3517' },
    { id: 14, cat: 'equipement', label_fr: 'Plaque cuisson',              label_he: 'כיריים',                       ht: 5900,   month: 3, devis: 'Gastroline PQ26-3517' },
    { id: 15, cat: 'equipement', label_fr: 'Friteuse gaz',                label_he: 'מטגנת גז',                     ht: 5000,   month: 3, devis: 'Gastroline PQ26-3517' },
    { id: 16, cat: 'equipement', label_fr: 'Table nirosta+evier 260',     label_he: 'שולחן נירוסטה+כיור 260',       ht: 4400,   month: 3, devis: 'Gastroline PQ26-3517' },
    { id: 17, cat: 'equipement', label_fr: '4x Refrigerateur 685L',       label_he: '4 מקררים 685 ליטר',            ht: 22000,  month: 3, devis: 'Gastroline PQ26-3517' },
    { id: 18, cat: 'equipement', label_fr: 'Poste evier double',          label_he: 'עמדת כיור כפולה',              ht: 5400,   month: 3, devis: 'Gastroline PQ26-3517' },
    { id: 19, cat: 'equipement', label_fr: 'Lave-vaisselle capot',        label_he: 'מדיח כלים תעשייתי',            ht: 12900,  month: 3, devis: 'Gastroline PQ26-3517' },
    { id: 20, cat: 'equipement', label_fr: 'Tables lave-vaisselle',       label_he: 'שולחנות מדיח',                 ht: 5800,   month: 3, devis: 'Gastroline PQ26-3517' },
    { id: 21, cat: 'equipement', label_fr: '3x Table nirosta+evier 160',  label_he: '3 שולחנות נירוסטה+כיור 160',   ht: 10200,  month: 3, devis: 'Gastroline PQ26-3517' },

    // --- Vehicule ---
    { id: 22, cat: 'vehicule',   label_fr: 'Vehicule frigorifique',       label_he: 'רכב קירור',                    ht: 150000, month: 4, devis: '' },

    // --- Services ---
    { id: 23, cat: 'services',   label_fr: 'Ingenieur Rishion Esek',      label_he: 'מהנדס רישיון עסק',             ht: 25000,  month: 0, devis: '' },
    { id: 24, cat: 'services',   label_fr: 'ORRTYL Marketing 12 mois',    label_he: 'שיווק ORRTYL 12 חודשים',       ht: 60000,  month: 1, devis: '' },
    { id: 25, cat: 'services',   label_fr: 'Decoration boutique',         label_he: 'עיצוב חנות',                   ht: 5000,   month: 4, devis: '' },

    // --- Imprevu / margin ---
    { id: 26, cat: 'services',   label_fr: 'Frais divers / imprevu 3%',   label_he: 'הוצאות שונות / בלתי צפוי 3%', ht: 0,      month: 0, devis: '' },
    { id: 27, cat: 'services',   label_fr: 'Fond de roulement',           label_he: 'הון חוזר',                     ht: 30000,  month: 0, devis: '' }
  ];

  /* ---------- FINANCING ---------- */
  LORY.financing = {
    apport: 193000,
    taux: 6.5,
    duree: 6       // years
  };

  /* ---------- HOUSEHOLD (taux endettement) ---------- */
  LORY.household = {
    revenus: 18000,
    charges: 8000,
    enfants: 5
  };

  /* ---------- GUARANTEES ---------- */
  LORY.guarantees = [
    { label_fr: 'Caution personnelle solidaire (Tommy+Adina)', label_he: 'ערבות אישית הדדית (טומי+אדינה)', montant: 0 },
    { label_fr: 'Caution familiale (grand-pere medecin)',       label_he: 'ערבות משפחתית (סבא רופא)',        montant: 300000 },
    { label_fr: 'Nantissement equipement',                      label_he: 'שעבוד ציוד',                      montant: 131500 },
    { label_fr: 'Nantissement vehicule',                        label_he: 'שעבוד רכב',                       montant: 150000 }
  ];

  /* ---------- REVENUE AXES (24 months each, values in ILS) ---------- */
  LORY.revenueAxes = {
    shabbatBoutique: {
      label_fr: 'Shabbat boutique+box', label_he: 'שבת בוטיק+קופסאות',
      monthly: [
        0, 0, 0, 0, 18000, 25000,
        32000, 40000, 48000, 55000, 62000, 72000,
        78000, 82000, 85000, 88000, 90000, 95000,
        98000, 100000, 102000, 105000, 106000, 108000
      ]
    },
    shabbatHatan: {
      label_fr: 'Shabbat Hatan', label_he: 'שבת חתן',
      monthly: [
        0, 0, 0, 0, 0, 8000,
        10000, 12000, 15000, 18000, 20000, 22000,
        22000, 24000, 25000, 25000, 26000, 27000,
        27000, 28000, 28000, 29000, 30000, 30000
      ]
    },
    midiBureaux: {
      label_fr: 'Midi bureaux', label_he: 'ארוחות צהריים משרדים',
      monthly: [
        0, 0, 0, 0, 10000, 15000,
        18000, 22000, 25000, 28000, 30000, 32000,
        33000, 34000, 35000, 36000, 37000, 38000,
        38000, 39000, 40000, 41000, 41000, 42000
      ]
    },
    fetes: {
      label_fr: 'Fetes (saisonnier)', label_he: 'חגים (עונתי)',
      monthly: [
        0, 0, 0, 0, 0, 0,
        0, 0, 0, 85000, 0, 0,
        45000, 0, 0, 30000, 0, 0,
        0, 0, 0, 90000, 0, 0
      ]
    },
    leftof: {
      label_fr: 'LeftOf TSAHAL', label_he: 'לפטוף צה״ל',
      monthly: [
        0, 0, 0, 0, 0, 0,
        0, 0, 0, 18000, 0, 0,
        0, 0, 0, 0, 18000, 0,
        0, 0, 0, 18000, 0, 0
      ]
    },
    evenements: {
      label_fr: 'Evenements', label_he: 'אירועים',
      monthly: [
        0, 0, 0, 0, 0, 5000,
        8000, 10000, 12000, 15000, 18000, 20000,
        20000, 22000, 22000, 24000, 24000, 25000,
        25000, 26000, 26000, 27000, 28000, 28000
      ]
    }
  };

  /* ---------- CHARGES (24 months each) ---------- */
  LORY.charges = {
    matieresAutoPercent: 0.30,  // 30% du CA
    salaires: {
      label_fr: 'Salaires', label_he: 'משכורות',
      monthly: [
        0, 0, 0, 8000, 15000, 18000,
        22000, 25000, 28000, 30000, 32000, 33000,
        33000, 34000, 34000, 35000, 35000, 36000,
        36000, 36000, 37000, 37000, 38000, 38000
      ]
    },
    loyer: {
      label_fr: 'Loyer', label_he: 'שכירות',
      monthly: [
        15000, 15000, 15000, 15000, 15000, 15000,
        15000, 15000, 15000, 15000, 15000, 15000,
        15000, 15000, 15000, 15000, 15000, 15000,
        15000, 15000, 15000, 15000, 15000, 15000
      ]
    },
    arnona: {
      label_fr: 'Arnona+eau+elec', label_he: 'ארנונה+מים+חשמל',
      monthly: [
        1000, 1000, 1000, 1500, 2000, 2000,
        2500, 2500, 2500, 3000, 3000, 3000,
        3000, 3000, 3000, 3000, 3500, 3500,
        3500, 3500, 3500, 3500, 3500, 3500
      ]
    },
    marketing: {
      label_fr: 'Marketing ORRTYL', label_he: 'שיווק ORRTYL',
      monthly: [
        5000, 5000, 5000, 5000, 5000, 5000,
        4000, 4000, 4000, 3500, 3500, 3500,
        3000, 3000, 3000, 3000, 2500, 2500,
        2500, 2500, 2500, 2500, 2500, 2500
      ]
    },
    comptable: {
      label_fr: 'Comptable', label_he: 'רואה חשבון',
      monthly: [
        1500, 1500, 1500, 1500, 1500, 1500,
        1500, 1500, 1500, 1500, 1500, 1500,
        1500, 1500, 1500, 1500, 1500, 1500,
        1500, 1500, 1500, 1500, 1500, 1500
      ]
    },
    kashrut: {
      label_fr: 'Kashrut', label_he: 'כשרות',
      monthly: [
        0, 0, 0, 0, 1500, 1500,
        1500, 1500, 2000, 2000, 2000, 2000,
        2000, 2000, 2000, 2000, 2000, 2000,
        2000, 2000, 2000, 2000, 2000, 2000
      ]
    }
  };

  /* ---------- MONTHS (24, with calendar tags) ---------- */
  LORY.months = [
    { idx: 0,  fr: 'Juin 2026',     he: 'יוני 2026',     tags: [] },
    { idx: 1,  fr: 'Juil 2026',     he: 'יולי 2026',     tags: [] },
    { idx: 2,  fr: 'Aout 2026',     he: 'אוגוסט 2026',   tags: [] },
    { idx: 3,  fr: 'Sep 2026',      he: 'ספטמבר 2026',   tags: ['opening'] },
    { idx: 4,  fr: 'Oct 2026',      he: 'אוקטובר 2026',  tags: [] },
    { idx: 5,  fr: 'Nov 2026',      he: 'נובמבר 2026',   tags: [] },
    { idx: 6,  fr: 'Dec 2026',      he: 'דצמבר 2026',    tags: [] },
    { idx: 7,  fr: 'Jan 2027',      he: 'ינואר 2027',    tags: [] },
    { idx: 8,  fr: 'Fev 2027',      he: 'פברואר 2027',   tags: [] },
    { idx: 9,  fr: 'Mar 2027',      he: 'מרץ 2027',      tags: ['tishrei'] },
    { idx: 10, fr: 'Avr 2027',      he: 'אפריל 2027',    tags: [] },
    { idx: 11, fr: 'Mai 2027',      he: 'מאי 2027',      tags: [] },
    { idx: 12, fr: 'Juin 2027',     he: 'יוני 2027',     tags: [] },
    { idx: 13, fr: 'Juil 2027',     he: 'יולי 2027',     tags: [] },
    { idx: 14, fr: 'Aout 2027',     he: 'אוגוסט 2027',   tags: [] },
    { idx: 15, fr: 'Sep 2027',      he: 'ספטמבר 2027',   tags: ['hanouka'] },
    { idx: 16, fr: 'Oct 2027',      he: 'אוקטובר 2027',  tags: [] },
    { idx: 17, fr: 'Nov 2027',      he: 'נובמבר 2027',   tags: [] },
    { idx: 18, fr: 'Dec 2027',      he: 'דצמבר 2027',    tags: [] },
    { idx: 19, fr: 'Jan 2028',      he: 'ינואר 2028',    tags: [] },
    { idx: 20, fr: 'Fev 2028',      he: 'פברואר 2028',   tags: [] },
    { idx: 21, fr: 'Mar 2028',      he: 'מרץ 2028',      tags: ['pessah'] },
    { idx: 22, fr: 'Avr 2028',      he: 'אפריל 2028',    tags: [] },
    { idx: 23, fr: 'Mai 2028',      he: 'מאי 2028',      tags: [] }
  ];

  /* ---------- TVA ---------- */
  LORY.tva = 0.18;

  /* ---------- COMPUTED (filled by recalculate) ---------- */
  LORY.computed = {};


  /* ==========================================================
     RECALCULATE
     ========================================================== */

  function recalculate() {
    var c = LORY.computed = {};
    var exp = LORY.expenses;
    var fin = LORY.financing;
    var hh = LORY.household;

    /* --- Update imprevu (id 26) = 3% of all other expenses --- */
    var imprevuItem = null;
    var sumWithoutImprevu = 0;
    for (var i = 0; i < exp.length; i++) {
      if (exp[i].id === 26) { imprevuItem = exp[i]; }
      else { sumWithoutImprevu += exp[i].ht; }
    }
    if (imprevuItem) {
      imprevuItem.ht = Math.round(sumWithoutImprevu * 0.03);
    }

    /* --- Investment totals --- */
    c.totalInvestHT = 0;
    c.byCategory = {};
    for (var i = 0; i < exp.length; i++) {
      c.totalInvestHT += exp[i].ht;
      var cat = exp[i].cat;
      if (!c.byCategory[cat]) c.byCategory[cat] = 0;
      c.byCategory[cat] += exp[i].ht;
    }

    c.totalInvestTTC = Math.round(c.totalInvestHT * (1 + LORY.tva));

    /* --- Loan --- */
    c.pret = Math.max(0, c.totalInvestHT - fin.apport);
    c.mensualite = pmt(fin.taux / 100 / 12, fin.duree * 12, c.pret);
    c.totalRembourse = Math.round(c.mensualite * fin.duree * 12);
    c.coutCredit = c.totalRembourse - c.pret;

    /* --- Debt ratio --- */
    c.tauxEndettement = hh.revenus > 0
      ? ((hh.charges + c.mensualite) / hh.revenus * 100)
      : 0;
    c.resteAVivre = hh.revenus - hh.charges - c.mensualite;
    c.resteAVivreParPersonne = (hh.enfants + 2) > 0
      ? c.resteAVivre / (hh.enfants + 2)
      : c.resteAVivre;

    /* --- Guarantees --- */
    c.totalCautions = 0;
    for (var i = 0; i < LORY.guarantees.length; i++) {
      c.totalCautions += LORY.guarantees[i].montant;
    }
    c.ratioGaranties = c.pret > 0 ? (c.totalCautions / c.pret * 100) : 0;

    /* --- Investment schedule (spread expenses over months) --- */
    c.investSchedule = new Array(24);
    for (var m = 0; m < 24; m++) c.investSchedule[m] = 0;
    for (var i = 0; i < exp.length; i++) {
      var mi = exp[i].month;
      if (mi >= 0 && mi < 24) {
        c.investSchedule[mi] += exp[i].ht;
      }
    }

    /* --- Monthly revenue --- */
    c.monthlyRevenue = new Array(24);
    c.revenueByAxe = {};
    var axes = LORY.revenueAxes;
    for (var key in axes) {
      if (axes.hasOwnProperty(key)) {
        c.revenueByAxe[key] = axes[key].monthly.slice();
      }
    }
    for (var m = 0; m < 24; m++) {
      c.monthlyRevenue[m] = 0;
      for (var key in axes) {
        if (axes.hasOwnProperty(key)) {
          c.monthlyRevenue[m] += (axes[key].monthly[m] || 0);
        }
      }
    }

    /* --- Monthly charges (fixed + matieres) --- */
    c.monthlyChargesFixed = new Array(24);
    c.monthlyMatieres = new Array(24);
    c.monthlyChargesTotal = new Array(24);
    c.monthlyPret = new Array(24);

    // Loan payments start month 4 (after travaux/equip)
    var loanStartMonth = 4;

    for (var m = 0; m < 24; m++) {
      var fixed = 0;
      var ch = LORY.charges;
      fixed += (ch.salaires.monthly[m] || 0);
      fixed += (ch.loyer.monthly[m] || 0);
      fixed += (ch.arnona.monthly[m] || 0);
      fixed += (ch.marketing.monthly[m] || 0);
      fixed += (ch.comptable.monthly[m] || 0);
      fixed += (ch.kashrut.monthly[m] || 0);
      c.monthlyChargesFixed[m] = fixed;

      c.monthlyMatieres[m] = Math.round(c.monthlyRevenue[m] * ch.matieresAutoPercent);

      c.monthlyPret[m] = (m >= loanStartMonth) ? c.mensualite : 0;

      c.monthlyChargesTotal[m] = fixed + c.monthlyMatieres[m] + c.monthlyPret[m];
    }

    /* --- Monthly treasury --- */
    c.monthlySolde = new Array(24);
    c.cumulTreasury = new Array(24);

    // Initial cash = apport + loan disbursement
    var cumul = fin.apport + c.pret;

    for (var m = 0; m < 24; m++) {
      var enc = c.monthlyRevenue[m];
      var dec = c.monthlyChargesTotal[m] + c.investSchedule[m];
      c.monthlySolde[m] = enc - dec;
      cumul += c.monthlySolde[m];
      c.cumulTreasury[m] = Math.round(cumul);
    }

    /* --- Key metrics --- */
    // Point mort: first month after opening (m>3) where monthly solde > 0
    c.pointMort = -1;
    for (var m = 0; m < 24; m++) {
      if (m > 3 && c.monthlySolde[m] > 0) {
        c.pointMort = m;
        break;
      }
    }

    c.tresorerieMin = c.cumulTreasury[0];
    for (var m = 1; m < 24; m++) {
      if (c.cumulTreasury[m] < c.tresorerieMin) {
        c.tresorerieMin = c.cumulTreasury[m];
      }
    }

    c.tresorerieFin = c.cumulTreasury[23];

    c.caYear1 = 0;
    c.caYear2 = 0;
    for (var m = 0; m < 12; m++) c.caYear1 += c.monthlyRevenue[m];
    for (var m = 12; m < 24; m++) c.caYear2 += c.monthlyRevenue[m];

    c.chargesYear1 = 0;
    c.chargesYear2 = 0;
    for (var m = 0; m < 12; m++) c.chargesYear1 += c.monthlyChargesTotal[m];
    for (var m = 12; m < 24; m++) c.chargesYear2 += c.monthlyChargesTotal[m];

    /* --- Fire event --- */
    document.dispatchEvent(new CustomEvent('lory-update', { detail: c }));
  }


  /* ==========================================================
     PMT (monthly payment formula)
     ========================================================== */

  function pmt(monthlyRate, nMonths, principal) {
    if (principal <= 0 || nMonths <= 0) return 0;
    if (monthlyRate === 0) return Math.round(principal / nMonths);
    var x = Math.pow(1 + monthlyRate, nMonths);
    return Math.round(principal * (monthlyRate * x) / (x - 1));
  }


  /* ==========================================================
     PUBLIC API
     ========================================================== */

  LORY.recalculate = recalculate;
  LORY.pmt = pmt;

  /* Initial calculation on load */
  document.addEventListener('DOMContentLoaded', function () {
    recalculate();
  });

})();
