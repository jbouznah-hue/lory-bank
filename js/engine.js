/* ============================================================
   LORY — engine.js — Interactive UI engine for financement.html
   Reads window.LORY (from data.js), renders interactive controls,
   listens to slider changes, editable cells, and updates DOM.
   ============================================================ */

(function () {
  'use strict';

  /* ---------- HELPERS ---------- */
  function tx(he, fr) {
    var lang = (typeof lorState !== 'undefined' && lorState) ? lorState.lang : 'he';
    return lang === 'he' ? he : fr;
  }

  function el(id) { return document.getElementById(id); }

  function safeSet(id, html) {
    var e = document.getElementById(id);
    if (e) e.innerHTML = html;
  }

  var CAT_ORDER = ['travaux', 'equipement', 'vehicule', 'services'];
  var CAT_LABELS = {
    travaux:    { fr: 'Travaux',     he: 'עבודות' },
    equipement: { fr: 'Equipement',  he: 'ציוד' },
    vehicule:   { fr: 'Vehicule',    he: 'רכב' },
    services:   { fr: 'Services',    he: 'שירותים' }
  };

  /* ============================================================
     UPDATE DOM — refreshes all KPIs and computed values
     ============================================================ */
  function updateDOM() {
    var L = window.LORY;
    var c = L.computed;
    var fin = L.financing;
    var hh = L.household;

    // --- Besoins table ---
    renderBesoinsTable();

    // --- Resources ---
    safeSet('apport-amount-display', fmtNum(fin.apport));
    var apportPct = c.totalInvestHT > 0 ? (fin.apport / c.totalInvestHT * 100) : 0;
    safeSet('apport-pct-display', apportPct.toFixed(1).replace('.', ',') + '%');
    safeSet('loan-amount-display', fmtNum(Math.round(c.pret)));
    var pretPct = c.totalInvestHT > 0 ? (c.pret / c.totalInvestHT * 100) : 0;
    safeSet('loan-pct-display', pretPct.toFixed(1).replace('.', ',') + '%');
    safeSet('total-resources-display', fmtNum(Math.round(c.totalInvestHT)));

    // --- Slider values ---
    safeSet('apport-slider-val', Math.round(fin.apport / 1000) + 'k \u20AA');
    safeSet('loan-rate', fin.taux.toFixed(1).replace('.', ','));
    safeSet('loan-years', fin.duree);

    // --- Loan results ---
    safeSet('monthly-payment', fmtNum(Math.round(c.mensualite)) + '<span class="unit">\u20AA</span>');
    safeSet('total-interest', fmtNum(c.coutCredit / 1000, 1).replace('.', ',') + '<span class="unit">k</span>');

    // --- Debt ratio ---
    safeSet('debt-revenus', fmtNum(hh.revenus));
    safeSet('debt-charges', fmtNum(hh.charges));
    safeSet('debt-mensualite', fmtNum(Math.round(c.mensualite)));
    var totalChargesApres = hh.charges + c.mensualite;
    safeSet('debt-total-charges', fmtNum(Math.round(totalChargesApres)));
    safeSet('debt-reste', fmtNum(Math.round(c.resteAVivre)));
    safeSet('debt-reste-pp', fmtNum(Math.round(c.resteAVivreParPersonne)));

    var ratioEl = el('debt-ratio');
    if (ratioEl) {
      var pct = c.tauxEndettement;
      ratioEl.textContent = pct.toFixed(1).replace('.', ',') + '%';
      ratioEl.className = 'debt-ratio-value';
      if (pct < 25) ratioEl.classList.add('ratio-green');
      else if (pct <= 33) ratioEl.classList.add('ratio-orange');
      else ratioEl.classList.add('ratio-red');
    }

    // --- Guarantees ---
    renderGuarantees();
    safeSet('total-cautions', fmtNum(Math.round(c.totalCautions)));
    safeSet('ratio-garanties', c.ratioGaranties.toFixed(0) + '%');

    // --- Expense table ---
    renderExpenseTable();

    // --- Sync sliders ---
    var apportSlider = el('apport-slider');
    if (apportSlider && document.activeElement !== apportSlider) {
      apportSlider.value = fin.apport / 1000;
    }
    var yearsSlider = el('years-slider');
    if (yearsSlider && document.activeElement !== yearsSlider) {
      yearsSlider.value = fin.duree;
    }
    var rateSlider = el('rate-slider');
    if (rateSlider && document.activeElement !== rateSlider) {
      rateSlider.value = Math.round(fin.taux * 10);
    }
  }

  /* ============================================================
     RENDER BESOINS TABLE
     ============================================================ */
  function renderBesoinsTable() {
    var root = el('besoins-tbody');
    if (!root) return;
    var c = window.LORY.computed;
    var rows = [
      { fr: 'Travaux d\'amenagement (Lyor Zerbib)', he: 'עבודות התאמה (Lyor Zerbib)', val: c.byCategory.travaux || 0 },
      { fr: 'Equipement cuisine (Gastroline PQ26-3517)', he: 'ציוד מטבח (Gastroline PQ26-3517)', val: c.byCategory.equipement || 0 },
      { fr: 'Vehicule frigorifique + isothermes', he: 'רכב מקורר + מכלים איזותרמיים', val: c.byCategory.vehicule || 0 },
      { fr: 'Services (ingenieur, marketing, deco)', he: 'שירותים (מהנדס, שיווק, עיצוב)', val: c.byCategory.services || 0 }
    ];
    var h = '';
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      h += '<tr><td><span class="he">' + r.he + '</span><span class="fr">' + r.fr + '</span></td><td class="num">' + fmtNum(r.val) + '</td></tr>';
    }
    root.innerHTML = h;
    safeSet('besoins-total', fmtNum(c.totalInvestHT));
  }

  /* ============================================================
     RENDER EXPENSE TABLE
     ============================================================ */
  function renderExpenseTable() {
    var root = el('expense-table');
    if (!root) return;

    var L = window.LORY;
    var exp = L.expenses;
    var h = '';

    h += '<table class="tbl expense-tbl">';
    h += '<thead><tr>';
    h += '<th style="width:40px">#</th>';
    h += '<th>' + tx('תיאור', 'Description') + '</th>';
    h += '<th>' + tx('ספק', 'Fournisseur') + '</th>';
    h += '<th class="num">' + tx('סכום (\u20AA)', 'Montant (\u20AA)') + '</th>';
    h += '<th style="width:60px"></th>';
    h += '</tr></thead><tbody>';

    for (var ci = 0; ci < CAT_ORDER.length; ci++) {
      var cat = CAT_ORDER[ci];
      var items = [];
      var catTotal = 0;
      for (var i = 0; i < exp.length; i++) {
        if (exp[i].cat === cat) {
          items.push(exp[i]);
          catTotal += exp[i].ht;
        }
      }
      if (items.length === 0) continue;
      var catLabel = CAT_LABELS[cat];

      h += '<tr class="section-row"><td colspan="4">' + tx(catLabel.he, catLabel.fr) + '</td><td class="num">' + fmtNum(catTotal) + '</td></tr>';

      for (var j = 0; j < items.length; j++) {
        var item = items[j];
        h += '<tr data-expense-id="' + item.id + '">';
        h += '<td class="muted" style="font-size:0.75rem">' + item.id + '</td>';
        h += '<td>' + tx(item.label_he, item.label_fr) + '</td>';
        h += '<td class="muted">' + (item.devis || '\u2014') + '</td>';
        h += '<td class="num editable-cell" data-field="ht" data-id="' + item.id + '">' + fmtNum(item.ht) + '</td>';
        h += '<td><button class="btn-remove" data-remove-id="' + item.id + '" aria-label="remove" title="' + tx('מחק', 'Supprimer') + '">\u00D7</button></td>';
        h += '</tr>';
      }
    }

    h += '<tr class="total-row"><td></td><td colspan="2"><strong>' + tx('סה״כ השקעה (ללא מע״מ)', 'Total investissement HT') + '</strong></td>';
    h += '<td class="num"><strong>' + fmtNum(L.computed.totalInvestHT) + '</strong></td><td></td></tr>';
    h += '</tbody></table>';

    h += '<div style="margin-top:1rem;"><button class="btn btn-ghost" id="btn-add-expense" style="font-size:0.82rem; padding:0.5rem 1rem;">+ ' + tx('הוסף שורה', 'Ajouter une ligne') + '</button></div>';

    root.innerHTML = h;
  }

  /* ============================================================
     RENDER GUARANTEES
     ============================================================ */
  function renderGuarantees() {
    var root = el('guarantees-grid');
    if (!root) return;
    var L = window.LORY;
    var h = '';
    for (var i = 0; i < L.guarantees.length; i++) {
      var g = L.guarantees[i];
      var num = String(i + 1).padStart(2, '0');
      h += '<div>';
      h += '<div class="eyebrow">' + num + '</div>';
      h += '<p style="font-family: var(--font-display); font-size: 1.1rem; margin: 0.3rem 0;"><span class="he">' + g.label_he + '</span><span class="fr">' + g.label_fr + '</span></p>';
      h += '<p style="font-family: var(--font-display); font-size: 1.3rem; margin: 0.5rem 0 0;" class="editable-guarantee" data-guarantee-idx="' + i + '">' + fmtNum(g.montant) + ' <span class="unit">\u20AA</span></p>';
      h += '</div>';
    }
    root.innerHTML = h;
  }

  /* ============================================================
     BREAK-EVEN CALCULATOR
     ============================================================ */
  function updateBreakEven() {
    var panierEl = el('panier-slider');
    var matEl = el('material-slider');
    var fixedEl = el('fixed-slider');
    if (!panierEl || !matEl || !fixedEl) return;

    var panier = +panierEl.value;
    var matPct = +matEl.value;
    var fixed = +fixedEl.value;

    safeSet('panier-val', panier);
    safeSet('material-val', matPct);
    safeSet('fixed-val', fixed);

    var margin = (100 - matPct) / 100;
    var beCA = (fixed * 1000) / margin;
    var beCouverts = beCA / panier;
    var beShabbat = beCouverts / 4;

    safeSet('be-ca', fmtNum(beCA / 1000, 1).replace('.', ',') + '<span class="unit">k \u20AA</span>');
    safeSet('be-couverts', fmtNum(Math.round(beCouverts)));
    safeSet('be-shabbat', '~' + fmtNum(Math.round(beShabbat)));
  }

  /* ============================================================
     EVENT DELEGATION
     ============================================================ */
  function setupEventDelegation() {
    document.addEventListener('click', function (e) {
      // Editable expense cell
      var editCell = e.target.closest('.editable-cell');
      if (editCell && !editCell.querySelector('input')) {
        startEditing(editCell);
        return;
      }

      // Remove expense
      var removeBtn = e.target.closest('.btn-remove');
      if (removeBtn) {
        var id = parseInt(removeBtn.dataset.removeId, 10);
        window.LORY.expenses = window.LORY.expenses.filter(function (exp) { return exp.id !== id; });
        triggerRecalc();
        return;
      }

      // Editable guarantee
      var gCell = e.target.closest('.editable-guarantee');
      if (gCell && !gCell.querySelector('input')) {
        startEditingGuarantee(gCell);
        return;
      }

      // Editable household
      var hCell = e.target.closest('.editable-household');
      if (hCell && !hCell.querySelector('input')) {
        startEditingHousehold(hCell);
        return;
      }

      // Add expense
      if (e.target.closest('#btn-add-expense')) {
        addNewExpense();
      }
    });
  }

  function startEditing(cell) {
    var currentVal = parseInt(cell.textContent.replace(/\s/g, '').replace(/,/g, ''), 10) || 0;
    var id = parseInt(cell.dataset.id, 10);
    var input = document.createElement('input');
    input.type = 'number';
    input.className = 'inline-edit';
    input.value = currentVal;
    input.min = 0;
    cell.textContent = '';
    cell.appendChild(input);
    input.focus();
    input.select();

    function commit() {
      var newVal = Math.max(0, parseInt(input.value, 10) || 0);
      var exp = window.LORY.expenses.find(function (e) { return e.id === id; });
      if (exp) {
        exp.ht = newVal;
        triggerRecalc();
      }
    }

    input.addEventListener('blur', commit);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
      if (e.key === 'Escape') {
        var exp = window.LORY.expenses.find(function (ex) { return ex.id === id; });
        cell.textContent = exp ? fmtNum(exp.ht) : fmtNum(currentVal);
      }
    });
  }

  function startEditingGuarantee(cell) {
    var idx = parseInt(cell.dataset.guaranteeIdx, 10);
    var g = window.LORY.guarantees[idx];
    if (!g) return;
    var input = document.createElement('input');
    input.type = 'number';
    input.className = 'inline-edit';
    input.value = g.montant;
    input.min = 0;
    cell.textContent = '';
    cell.appendChild(input);
    input.focus();
    input.select();

    function commit() {
      g.montant = Math.max(0, parseInt(input.value, 10) || 0);
      triggerRecalc();
    }
    input.addEventListener('blur', commit);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
    });
  }

  function startEditingHousehold(cell) {
    var field = cell.dataset.field;
    var currentVal = window.LORY.household[field] || 0;
    var input = document.createElement('input');
    input.type = 'number';
    input.className = 'inline-edit';
    input.value = currentVal;
    input.min = 0;
    cell.textContent = '';
    cell.appendChild(input);
    input.focus();
    input.select();

    function commit() {
      window.LORY.household[field] = Math.max(0, parseInt(input.value, 10) || 0);
      triggerRecalc();
    }
    input.addEventListener('blur', commit);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
    });
  }

  function addNewExpense() {
    var maxId = 0;
    for (var i = 0; i < window.LORY.expenses.length; i++) {
      if (window.LORY.expenses[i].id > maxId) maxId = window.LORY.expenses[i].id;
    }
    window.LORY.expenses.push({
      id: maxId + 1,
      cat: 'services',
      label_fr: 'Nouveau poste',
      label_he: 'סעיף חדש',
      ht: 0,
      month: 5,
      devis: ''
    });
    triggerRecalc();
  }

  /* ============================================================
     SLIDER BINDINGS
     ============================================================ */
  function setupSliders() {
    var apportSlider = el('apport-slider');
    if (apportSlider) {
      apportSlider.addEventListener('input', function () {
        window.LORY.financing.apport = +this.value * 1000;
        triggerRecalc();
      });
    }

    var yearsSlider = el('years-slider');
    if (yearsSlider) {
      yearsSlider.addEventListener('input', function () {
        window.LORY.financing.duree = +this.value;
        triggerRecalc();
      });
    }

    var rateSlider = el('rate-slider');
    if (rateSlider) {
      rateSlider.addEventListener('input', function () {
        window.LORY.financing.taux = +this.value / 10;
        triggerRecalc();
      });
    }

    ['panier-slider', 'material-slider', 'fixed-slider'].forEach(function (id) {
      var slider = el(id);
      if (slider) slider.addEventListener('input', updateBreakEven);
    });
  }

  /* ============================================================
     TRIGGER RECALC — debounced via rAF
     ============================================================ */
  var rafPending = false;
  function triggerRecalc() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(function () {
      window.LORY.recalculate();
      updateDOM();
      rafPending = false;
    });
  }

  /* ============================================================
     PDF EXPORT
     ============================================================ */
  function exportPDF() {
    document.body.classList.add('printing');
    var header = document.createElement('div');
    header.id = 'print-header';
    header.innerHTML = '<div style="display:flex; justify-content:space-between; align-items:center; padding: 1rem 2rem; border-bottom: 2px solid #333;">' +
      '<div style="display:flex; align-items:center; gap:0.75rem;">' +
      '<img src="img/logo-nav.png" alt="LORY" style="width:32px; height:32px; border-radius:50%;">' +
      '<span style="font-weight:600; letter-spacing:0.08em;">LORY Events & Catering</span>' +
      '</div>' +
      '<div style="text-align:right; font-size:0.78rem; color:#666;">' +
      '<div>' + tx('מסמך סודי', 'Document confidentiel') + '</div>' +
      '</div></div>';
    document.body.insertBefore(header, document.body.firstChild);
    setTimeout(function () {
      window.print();
      setTimeout(function () {
        document.body.classList.remove('printing');
        var ph = document.getElementById('print-header');
        if (ph) ph.remove();
      }, 500);
    }, 100);
  }
  window.exportPDF = exportPDF;

  /* ============================================================
     INIT
     ============================================================ */
  document.addEventListener('DOMContentLoaded', function () {
    // data.js already runs recalculate() on DOMContentLoaded,
    // so LORY.computed should be populated. Run update.
    setupEventDelegation();
    setupSliders();
    updateDOM();
    updateBreakEven();
  });

  // Re-render on language change
  document.addEventListener('lorylang', function () {
    window.LORY.recalculate();
    updateDOM();
    updateBreakEven();
  });

  // Re-render on lory-update (from other pages/scripts)
  document.addEventListener('lory-update', function () {
    updateDOM();
  });

  // Re-render on language change
  document.addEventListener('lory-lang', function () {
    updateDOM();
  });

})();
