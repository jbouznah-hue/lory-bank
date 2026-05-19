# SPEC RECONSTRUCTION — Site Banquier LORY

## ARCHITECTURE : Multi-pages avec onglets

### Pages (fichiers HTML separes)
1. **index.html** — SYNTHESE / Dashboard
   - Hero avec logo LORY en filigrane (watermark grande opacity ~8%)
   - 4 KPIs dynamiques (invest total, pret, apport, point mort)
   - Resume executif
   - Cards vers les autres pages (porteurs, concept, financement...)
   - Effets au scroll (fade-in IntersectionObserver)

2. **porteurs.html** — LES PORTEURS DE PROJET
   - Tommy Boutboul (chef, 4e generation)
   - Adina Boutboul (architecte, structure juridique)
   - Heritage familial (Mamie Laurie, Nathan Tunis)
   - 3 KPIs (4 generations, 3 ans activite, ~120 couverts/sem)

3. **concept.html** — CONCEPT & CARTE
   - 6 axes de revenus (Shabbat Hatan, Boutique, Midi, Fetes, LeftOf, Events)
   - Carte complete (80+ recettes, 3 formats)
   - Tableau signature dishes
   - Modele economique (3 niveaux prix, mix revenus)

4. **marche.html** — MARCHE & POSITIONNEMENT
   - Cibles (5 personas)
   - Concurrence (Goldis, traiteurs generiques)
   - Avantage concurrentiel
   - Pourquoi Givat Shaul (parking, bureaux, zero concurrence)

5. **financement.html** — PLAN DE FINANCEMENT (interactif)
   - Tableau emplois/ressources (dynamique depuis expenses)
   - Registre depenses detaille (editable)
   - Sliders: apport, taux, duree → tout se recalcule
   - Simulateur de pret
   - Simulateur point mort
   - Capacite de remboursement (taux endettement, reste a vivre)
   - Cautions/garanties (editables)

6. **previsionnel.html** — PREVISIONNEL 24 MOIS
   - Tableau tresorerie 24 mois (genere par JS)
   - Graphique SVG cashflow (3 scenarios)
   - KPIs (point mort, tresorerie min, tresorerie fin, CA Y1)

7. **calendrier.html** — CALENDRIER DE LANCEMENT
   - Gantt 12 mois (clickable avec details)
   - Milestones: Rishion Esek, Travaux, Equipment, Kashrut, Ouverture, Fetes

8. **annexes.html** — ANNEXES
   - Photos du local (6 images)
   - References devis (Gastroline PQ26-3517, Lyor Zerbib #1018)
   - Documents placeholder (comptabilite, contrat ORRTYL)

## CHARTE GRAPHIQUE LORY (stricte)

### Couleurs
- Primary: #3B6C9E (Bleu Mediterraneen) — boutons CTA, liens actifs
- Accent: #B08A3E (Or Sable) — details premium, highlights
- Background: #EFE7DA (Beige Pierre) — fond principal
- Background card: #FAF8F3 — cartes, elements
- Text: #2D3B4F (Bleu Nuit) — texte principal
- Text soft: #5B6B7F — texte secondaire
- Positive: #6F7742 (Vert Olive) — indicateurs positifs
- Negative: #8B3F3F — indicateurs negatifs

### Typographies
- Titres: Playfair Display (serif elegant)
- Body: Montserrat (sans-serif moderne)
- Hebreu: Heebo (sans-serif) / Frank Ruhl Libre (display)
- Mono: JetBrains Mono (tableaux chiffres)

### Logo
- Nav: logo-nav.png (42px rond) + texte "LORY"
- Hero: logo.png en filigrane (opacity 8%, 600px+, centre)
- Favicon: favicon.png

### Design guidelines
- Espace blanc genereux, navigation minimaliste
- CTA: boutons bleu mediterraneen #3B6C9E + texte blanc
- Cartes: fond blanc, ombre subtile, radius 8px
- Effets scroll: fade-in + slide-up au scroll (IntersectionObserver)

## DONNEES FINANCIERES (reactives)

### Depenses (devis reels)
Travaux Lyor Zerbib #1018 (17/05/2026):
- Plomberie: 60,550
- Electricite: 45,000
- Etancheite: 21,500
- Cloisons placo: 109,200
- Surelevation sol: 60,000
- Carrelage pose: 191,940
- Materiaux carrelage (457m²×400): 182,800

Equipement Gastroline PQ26-3517 (18/05/2026):
- Vitrine refrigeree: 15,900
- Table nirosta+evier 180: 3,300
- Blast chiller: 8,900
- Four convection: 18,900
- Stand combi: 2,500
- Grill gaz: 7,000
- Plaque cuisson: 5,900
- Friteuse gaz: 5,000
- Table nirosta+evier 260: 4,400
- 4x Refrigerateur 685L: 22,000
- Poste evier double: 5,400
- Lave-vaisselle capot: 12,900
- Tables lave-vaisselle: 5,800
- 3x Table nirosta+evier 160: 10,200

Autres:
- Vehicule frigorifique: 150,000
- Ingenieur Rishion Esek: 25,000
- ORRTYL Marketing 12 mois: 60,000
- Decoration boutique: 5,000

TOTAL HT: ~1,042,490

### Financement
- Apport: 193,000 (configurable slider)
- Pret: ~850,000 (= total - apport)
- Taux: 6.5% (configurable)
- Duree: 6 ans (configurable)
- Mensualite: ~14,250

### Menage (taux endettement)
- Revenus couple: 18,000/mois
- Charges existantes: 8,000/mois
- Enfants: 5

### Cautions
- Caution perso solidaire (Tommy+Adina): 0 (editable)
- Caution familiale (grand-pere medecin): 300,000
- Nantissement equipement: 131,500
- Nantissement vehicule: 150,000

### Revenus previsionnels (par axe, 24 mois)
- Shabbat boutique+box: 0→108k/mois
- Shabbat Hatan: 0→30k/mois
- Midi bureaux: 0→42k/mois
- Fetes (saisonnier): pics Tishrei/Hanouka/Pessah
- LeftOf TSAHAL: 18k par fete
- Evenements: 0→28k/mois

### Charges
- Matieres premieres: 30% du CA
- Salaires: 0→38k/mois
- Loyer: 15k/mois
- Arnona+eau+elec: 1→3.5k/mois
- Marketing ORRTYL: 5→2.5k/mois
- Comptable: 1.5k/mois
- Kashrut: 0→2k/mois
- Pret: 0→14.25k/mois

## BILINGUE HE/FR
- Systeme de toggle HE/FR dans nav
- TOUT texte doit avoir <span class="he"> et <span class="fr">
- CSS: [lang="he"] .fr { display: none } et inversement
- Direction: RTL pour hebreu, LTR pour francais
- JAMAIS de texte francais visible en mode hebreu

## FICHIERS PARTAGES
- css/base.css — Layout, composants, print
- css/themes.css — Palette LORY
- js/shared.js — Lang toggle, theme, helpers
- js/data.js — NOUVEAU: modele de donnees central (window.LORY)
- js/engine.js — NOUVEAU: recalculate(), computed values
- img/ — Logos, photos local, logo-mamie
