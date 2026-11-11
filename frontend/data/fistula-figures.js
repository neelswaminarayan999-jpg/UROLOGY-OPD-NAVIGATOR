/* V16.11 original schematic diagrams for Urinary Tract Fistulae (not reproduced from any book; not to scale).
   Colours use semi-transparent fills and currentColor text so they read in light and dark themes. */
const DISEASE_FIGURES = {
 "Urinary Tract Fistulae": [
  {title:"Where urinary fistulae occur (female pelvis, sagittal)", caption:"Schematic, not to scale. Anterior is on the left. Numbered red markers show the commonest urinary fistula sites; 6 (grey) is a rectovaginal fistula, which often coexists with obstetric VVF.",
   svg:`<svg viewBox="0 0 360 300" role="img" aria-label="Sagittal female pelvis schematic with fistula sites" font-family="system-ui,sans-serif" font-size="10">
   <rect x="34" y="140" width="24" height="62" rx="10" fill="#94a3b8" fill-opacity=".55"/><text x="8" y="134" fill="currentColor">Pubis</text>
   <path d="M210 22 C 190 70, 170 120, 152 160" fill="none" stroke="#0ea5e9" stroke-width="3" stroke-dasharray="5 3"/><text x="214" y="26" fill="currentColor">Ureter</text>
   <path d="M245 70 C 215 40, 150 45, 128 88" fill="none" stroke="#a16207" stroke-opacity=".75" stroke-width="16" stroke-linecap="round"/><text x="250" y="66" fill="currentColor">Sigmoid colon</text>
   <ellipse cx="108" cy="140" rx="46" ry="34" fill="#facc15" fill-opacity=".45" stroke="#ca8a04"/><text x="88" y="140" fill="currentColor" font-weight="700">Bladder</text>
   <path d="M92 172 L 78 236" stroke="#ca8a04" stroke-width="7" stroke-linecap="round"/><text x="40" y="252" fill="currentColor">Urethra</text>
   <ellipse cx="178" cy="108" rx="27" ry="44" transform="rotate(28 178 108)" fill="#f472b6" fill-opacity=".4" stroke="#db2777"/><text x="178" y="96" fill="currentColor" font-weight="700">Uterus</text>
   <path d="M160 156 C 150 190, 130 220, 112 244" fill="none" stroke="#db2777" stroke-opacity=".7" stroke-width="13" stroke-linecap="round"/><text x="96" y="268" fill="currentColor">Vagina</text>
   <path d="M245 80 C 240 150, 215 210, 178 256" fill="none" stroke="#a16207" stroke-opacity=".75" stroke-width="16" stroke-linecap="round"/><text x="232" y="250" fill="currentColor">Rectum</text>
   <g font-weight="800" font-size="10" text-anchor="middle">
    <circle cx="140" cy="178" r="8" fill="#dc2626"/><text x="140" y="182" fill="#fff">1</text>
    <circle cx="101" cy="210" r="8" fill="#dc2626"/><text x="101" y="214" fill="#fff">2</text>
    <circle cx="152" cy="116" r="8" fill="#dc2626"/><text x="152" y="120" fill="#fff">3</text>
    <circle cx="166" cy="150" r="8" fill="#dc2626"/><text x="166" y="154" fill="#fff">4</text>
    <circle cx="124" cy="100" r="8" fill="#dc2626"/><text x="124" y="104" fill="#fff">5</text>
    <circle cx="170" cy="214" r="8" fill="#64748b"/><text x="170" y="218" fill="#fff">6</text>
   </g>
   <g font-size="9.5" fill="currentColor"><text x="262" y="120">1 Vesicovaginal</text><text x="262" y="134">2 Urethrovaginal</text><text x="262" y="148">3 Vesicouterine</text><text x="262" y="162">4 Ureterovaginal</text><text x="262" y="176">5 Colovesical</text><text x="262" y="190">6 Rectovaginal</text></g>
   </svg>`},
  {title:"Goh classification of obstetric VVF", caption:"Type is set by the distance of the fistula's distal edge from the external urethral meatus; size (a–c) and scarring (i–iii) are added, e.g. 'Goh 2b ii'. Types 3–4 involve the urethral closure mechanism and carry more risk of residual incontinence.",
   svg:`<svg viewBox="0 0 360 230" role="img" aria-label="Goh classification diagram" font-family="system-ui,sans-serif" font-size="10">
   <text x="10" y="18" fill="currentColor" font-weight="800">Distal edge of fistula → external urethral meatus</text>
   <g><rect x="20" y="34" width="70" height="34" fill="#dc2626" fill-opacity=".55"/><rect x="90" y="34" width="70" height="34" fill="#f97316" fill-opacity=".5"/><rect x="160" y="34" width="70" height="34" fill="#facc15" fill-opacity=".5"/><rect x="230" y="34" width="110" height="34" fill="#22c55e" fill-opacity=".45"/></g>
   <g text-anchor="middle" font-weight="800" fill="currentColor"><text x="55" y="56">Type 4</text><text x="125" y="56">Type 3</text><text x="195" y="56">Type 2</text><text x="285" y="56">Type 1</text></g>
   <g text-anchor="middle" fill="currentColor" font-size="9"><text x="20" y="82">0</text><text x="90" y="82">1.5 cm</text><text x="160" y="82">2.5 cm</text><text x="230" y="82">3.5 cm</text><text x="320" y="82">bladder →</text></g>
   <text x="20" y="96" fill="currentColor" font-size="9">meatus</text>
   <text x="10" y="124" fill="currentColor" font-weight="800">Size</text>
   <g fill="currentColor"><rect x="60" y="112" width="12" height="12" rx="6" fill="#0ea5e9" fill-opacity=".6"/><text x="78" y="122">a &lt; 1.5 cm</text><rect x="150" y="109" width="18" height="18" rx="9" fill="#0ea5e9" fill-opacity=".6"/><text x="174" y="122">b 1.5–3 cm</text><rect x="250" y="106" width="24" height="24" rx="12" fill="#0ea5e9" fill-opacity=".6"/><text x="280" y="122">c &gt; 3 cm</text></g>
   <text x="10" y="160" fill="currentColor" font-weight="800">Scarring</text>
   <g fill="currentColor"><text x="20" y="180">i  none or mild fibrosis</text><text x="20" y="196">ii moderate or severe fibrosis (incl. reduced vaginal length/capacity)</text><text x="20" y="212">iii special: post-radiation, ureteric involvement, circumferential,</text><text x="36" y="226">previous repair</text></g>
   </svg>`},
  {title:"Dye tests: which structure is leaking?", caption:"Methylene blue in the bladder with swabs or a tampon in the vagina. Oral phenazopyridine (orange) marks urine coming straight from the kidneys. Always confirm with cystoscopy and CT urography.",
   svg:`<svg viewBox="0 0 360 230" role="img" aria-label="Dye test interpretation" font-family="system-ui,sans-serif" font-size="10">
   <text x="10" y="18" fill="currentColor" font-weight="800">Swab / tampon result → interpretation</text>
   <g><rect x="16" y="32" width="54" height="26" rx="13" fill="#2563eb"/><text x="82" y="42" fill="currentColor" font-weight="700">Blue (methylene blue)</text><text x="82" y="55" fill="currentColor">Vesicovaginal or urethrovaginal fistula</text></g>
   <g><rect x="16" y="72" width="54" height="26" rx="13" fill="#f97316"/><text x="82" y="82" fill="currentColor" font-weight="700">Orange, not blue (phenazopyridine)</text><text x="82" y="95" fill="currentColor">Ureterovaginal fistula</text></g>
   <g><rect x="16" y="112" width="54" height="26" rx="13" fill="#2563eb"/><rect x="16" y="112" width="27" height="26" rx="13" fill="#f97316"/><text x="82" y="122" fill="currentColor" font-weight="700">Blue and orange</text><text x="82" y="135" fill="currentColor">Combined vesico- and ureterovaginal fistula</text></g>
   <g><rect x="16" y="152" width="54" height="26" rx="13" fill="none" stroke="#94a3b8" stroke-width="2"/><text x="82" y="162" fill="currentColor" font-weight="700">Wet but unstained / dry</text><text x="82" y="175" fill="currentColor">Consider stress or overflow incontinence; repeat test</text></g>
   <text x="10" y="204" fill="currentColor" font-size="9.5">Three-swab test: the level of the stained swab (top / middle / bottom)</text>
   <text x="10" y="218" fill="currentColor" font-size="9.5">suggests vault, mid-vaginal or urethral (distal) leak.</text>
   </svg>`},
  {title:"Management pathway", caption:"Summary of the ICI/WHO approach adapted for this app. The interactive fistula decision engine (Show treatment plan) applies it to a specific patient.",
   svg:`<svg viewBox="0 0 360 400" role="img" aria-label="Fistula management flowchart" font-family="system-ui,sans-serif" font-size="9.5">
   <defs><marker id="fa" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#64748b"/></marker></defs>
   <g fill="#0ea5e9" fill-opacity=".18" stroke="#0ea5e9"><rect x="50" y="8" width="260" height="38" rx="9"/></g>
   <text x="180" y="23" text-anchor="middle" fill="currentColor" font-weight="800">Suspected urinary fistula</text><text x="180" y="38" text-anchor="middle" fill="currentColor">Exam + dye test + cystoscopy + CT urography</text>
   <path d="M180 46 V 64" stroke="#64748b" marker-end="url(#fa)"/>
   <g fill="#dc2626" fill-opacity=".14" stroke="#dc2626"><rect x="60" y="66" width="240" height="34" rx="9"/></g>
   <text x="180" y="80" text-anchor="middle" fill="currentColor" font-weight="800">Sepsis / urinoma / obstruction?</text><text x="180" y="94" text-anchor="middle" fill="currentColor">Drain first: nephrostomy or stent, antibiotics</text>
   <path d="M180 100 V 116" stroke="#64748b" marker-end="url(#fa)"/>
   <g fill="#64748b" fill-opacity=".1" stroke="#64748b">
    <rect x="4" y="120" width="112" height="78" rx="9"/><rect x="124" y="120" width="112" height="78" rx="9"/><rect x="244" y="120" width="112" height="78" rx="9"/></g>
   <g fill="currentColor"><text x="60" y="135" text-anchor="middle" font-weight="800">Ureteric</text><text x="10" y="150">Stent (6–8 wk)</text><text x="10" y="163">Fails → nephrostomy</text><text x="10" y="176">→ reimplant (psoas</text><text x="10" y="189">hitch / Boari)</text>
   <text x="180" y="135" text-anchor="middle" font-weight="800">Fresh, small, simple</text><text x="130" y="150">Catheter 4–6 wk,</text><text x="130" y="163">review weekly</text><text x="130" y="176">Healed → follow up</text><text x="130" y="189">Leaking → repair</text>
   <text x="300" y="135" text-anchor="middle" font-weight="800">Established / complex</text><text x="250" y="150">Repair when tissue</text><text x="250" y="163">healthy (no benefit</text><text x="250" y="176">to routine delay)</text><text x="250" y="189">Expert surgeon</text></g>
   <path d="M300 198 V 216" stroke="#64748b" marker-end="url(#fa)"/><path d="M180 198 C 180 210, 240 210, 270 216" fill="none" stroke="#64748b" marker-end="url(#fa)"/>
   <g fill="#22c55e" fill-opacity=".14" stroke="#16a34a"><rect x="124" y="220" width="232" height="70" rx="9"/></g>
   <g fill="currentColor"><text x="240" y="235" text-anchor="middle" font-weight="800">Choose route</text><text x="132" y="250">Vaginal: most VVF, vault (Latzko), urethrovaginal</text><text x="132" y="263">Abdominal/robotic: high, near orifices, needs</text><text x="132" y="276">reimplant or augmentation, narrow vagina</text></g>
   <path d="M240 290 V 306" stroke="#64748b" marker-end="url(#fa)"/>
   <g fill="#a855f7" fill-opacity=".14" stroke="#9333ea"><rect x="124" y="310" width="232" height="44" rx="9"/></g>
   <g fill="currentColor"><text x="240" y="325" text-anchor="middle" font-weight="800">Interpose vascularised tissue if needed</text><text x="132" y="340">Martius · peritoneum · omentum · gracilis · rectus</text></g>
   <g fill="#f59e0b" fill-opacity=".14" stroke="#d97706"><rect x="4" y="220" width="112" height="134" rx="9"/></g>
   <g fill="currentColor"><text x="60" y="235" text-anchor="middle" font-weight="800">Radiation</text><text x="10" y="250">Biopsy edge</text><text x="10" y="263">Wait 6–12 months</text><text x="10" y="276">Always interpose</text><text x="10" y="289">a flap</text><text x="60" y="312" text-anchor="middle" font-weight="800">Irreparable</text><text x="10" y="327">Urinary diversion</text><text x="10" y="340">(conduit/continent)</text></g>
   <g fill="#0ea5e9" fill-opacity=".14" stroke="#0ea5e9"><rect x="2" y="360" width="356" height="36" rx="9"/></g>
   <text x="180" y="375" text-anchor="middle" fill="currentColor" font-weight="800" font-size="9">After repair: free catheter drainage 10–14 days (longer if radiated)</text><text x="180" y="389" text-anchor="middle" fill="currentColor" font-size="8.6">No intercourse 3 months · caesarean for later deliveries (obstetric fistula)</text>
   </svg>`},
  {title:"Layered repair and interposition (cross-section)", caption:"Left: vaginal layered repair; the bladder is closed, a Martius fibrofatty flap is tunnelled from the labium to cover it, and the vaginal wall is closed with an offset suture line. Right: O'Connor transvesical repair; the bladder is bivalved down to the fistula, bladder and vagina are closed separately, and omentum is placed between them.",
   svg:`<svg viewBox="0 0 360 210" role="img" aria-label="Layered fistula repair schematic" font-family="system-ui,sans-serif" font-size="9.5">
   <text x="90" y="16" text-anchor="middle" fill="currentColor" font-weight="800">Vaginal + Martius flap</text>
   <rect x="20" y="30" width="140" height="34" rx="6" fill="#facc15" fill-opacity=".45" stroke="#ca8a04"/><text x="90" y="51" text-anchor="middle" fill="currentColor">Bladder wall (closed)</text>
   <path d="M80 64 l10 -6 l10 6" fill="none" stroke="#dc2626" stroke-width="2"/>
   <rect x="20" y="72" width="140" height="30" rx="6" fill="#fb923c" fill-opacity=".45" stroke="#ea580c"/><text x="90" y="91" text-anchor="middle" fill="currentColor">Martius flap</text>
   <rect x="20" y="110" width="140" height="34" rx="6" fill="#f472b6" fill-opacity=".4" stroke="#db2777"/><text x="90" y="131" text-anchor="middle" fill="currentColor">Vaginal wall (closed)</text>
   <path d="M120 144 l10 6 l10 -6" fill="none" stroke="#dc2626" stroke-width="2"/>
   <text x="90" y="170" text-anchor="middle" fill="currentColor">Suture lines offset, not overlapping</text>
   <text x="270" y="16" text-anchor="middle" fill="currentColor" font-weight="800">O'Connor (abdominal)</text>
   <rect x="200" y="30" width="140" height="34" rx="6" fill="#facc15" fill-opacity=".45" stroke="#ca8a04"/><text x="270" y="51" text-anchor="middle" fill="currentColor">Bladder (bivalved, closed)</text>
   <rect x="200" y="72" width="140" height="30" rx="6" fill="#22c55e" fill-opacity=".35" stroke="#16a34a"/><text x="270" y="91" text-anchor="middle" fill="currentColor">Omental interposition</text>
   <rect x="200" y="110" width="140" height="34" rx="6" fill="#f472b6" fill-opacity=".4" stroke="#db2777"/><text x="270" y="131" text-anchor="middle" fill="currentColor">Vaginal cuff (closed)</text>
   <text x="270" y="170" text-anchor="middle" fill="currentColor">Ureters catheterised if near the fistula</text>
   <text x="180" y="198" text-anchor="middle" fill="currentColor" font-size="9">Principles: wide mobilisation · tension-free watertight layers · well-vascularised tissue · free bladder drainage</text>
   </svg>`}
 ]
};
