/* V16.11 original schematic diagrams for the female & functional urology topics (not reproduced from any book; not to scale).
   Semi-transparent fills and currentColor text so they read in light and dark themes. Loaded after fistula-figures.js. */
Object.assign(DISEASE_FIGURES, {
 "Female Urinary Incontinence": [
  {title:"Continence mechanism: hypermobility vs ISD", caption:"Schematic. Left: normal support — raised abdominal pressure compresses the urethra against a firm 'hammock' of anterior vaginal wall and endopelvic fascia. Middle: hypermobility — weak support lets the urethra rotate down and open. Right: intrinsic sphincter deficiency — the urethra is well supported but cannot close (low closure pressure, low leak point pressure).",
   svg:`<svg viewBox="0 0 360 220" role="img" aria-label="Three panels comparing normal urethral support, hypermobility and intrinsic sphincter deficiency" font-family="system-ui,sans-serif" font-size="10">
   <g text-anchor="middle" font-weight="800" fill="currentColor"><text x="60" y="16">Normal</text><text x="180" y="16">Hypermobility</text><text x="300" y="16">ISD</text></g>
   <g stroke="#94a3b8" stroke-dasharray="3 3"><line x1="120" y1="24" x2="120" y2="200"/><line x1="240" y1="24" x2="240" y2="200"/></g>
   <g>
    <ellipse cx="60" cy="62" rx="40" ry="26" fill="#facc15" fill-opacity=".45" stroke="#ca8a04"/>
    <rect x="54" y="86" width="12" height="62" rx="5" fill="#ca8a04" fill-opacity=".8"/>
    <path d="M22 152 Q 60 132 98 152" fill="none" stroke="#db2777" stroke-width="6" stroke-linecap="round"/>
    <path d="M60 26 v14" stroke="#2563eb" stroke-width="2" marker-end="url(#fa)"/>
    <text x="60" y="176" text-anchor="middle" fill="currentColor">firm hammock</text><text x="60" y="190" text-anchor="middle" fill="currentColor">urethra closes</text>
   </g>
   <g>
    <ellipse cx="180" cy="62" rx="40" ry="26" fill="#facc15" fill-opacity=".45" stroke="#ca8a04"/>
    <rect x="174" y="86" width="12" height="62" rx="5" fill="#ca8a04" fill-opacity=".8" transform="rotate(38 180 88)"/>
    <path d="M142 150 Q 180 186 218 150" fill="none" stroke="#db2777" stroke-width="6" stroke-linecap="round" stroke-dasharray="7 4"/>
    <path d="M180 26 v14" stroke="#2563eb" stroke-width="2" marker-end="url(#fa)"/>
    <g fill="#2563eb"><circle cx="150" cy="150" r="2.5"/><circle cx="145" cy="158" r="2.5"/><circle cx="140" cy="166" r="2.5"/></g>
    <text x="180" y="196" text-anchor="middle" fill="currentColor">weak support → leak</text>
   </g>
   <g>
    <ellipse cx="300" cy="62" rx="40" ry="26" fill="#facc15" fill-opacity=".45" stroke="#ca8a04"/>
    <rect x="292" y="86" width="16" height="62" rx="5" fill="none" stroke="#ca8a04" stroke-width="3"/>
    <rect x="297" y="88" width="6" height="60" fill="#2563eb" fill-opacity=".55"/>
    <path d="M262 152 Q 300 132 338 152" fill="none" stroke="#db2777" stroke-width="6" stroke-linecap="round"/>
    <path d="M300 26 v14" stroke="#2563eb" stroke-width="2" marker-end="url(#fa)"/>
    <text x="300" y="176" text-anchor="middle" fill="currentColor">good support,</text><text x="300" y="190" text-anchor="middle" fill="currentColor">open, rigid urethra</text>
   </g>
   <text x="180" y="214" text-anchor="middle" fill="currentColor" font-size="9">Blue arrow = rise in abdominal pressure (cough, sneeze)</text>
   <defs><marker id="fa" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#2563eb"/></marker></defs>
   </svg>`},
  {title:"Where the SUI operations sit (coronal view)", caption:"Schematic, not to scale. Retropubic MUS passes behind the pubis to the suprapubic skin; transobturator MUS passes out through the obturator foramina to the groin; both lie loosely under the mid-urethra. Autologous fascial slings sit at the bladder neck. Burch colposuspension lifts the paravaginal tissue to Cooper's ligaments.",
   svg:`<svg viewBox="0 0 360 240" role="img" aria-label="Coronal schematic of retropubic and transobturator slings, fascial sling and colposuspension" font-family="system-ui,sans-serif" font-size="10">
   <path d="M40 40 Q 180 10 320 40" fill="none" stroke="#94a3b8" stroke-width="10" stroke-linecap="round"/>
   <text x="180" y="22" text-anchor="middle" fill="currentColor" font-weight="700">Pubic bone / symphysis</text>
   <ellipse cx="90" cy="120" rx="30" ry="40" fill="none" stroke="#94a3b8" stroke-width="4"/><ellipse cx="270" cy="120" rx="30" ry="40" fill="none" stroke="#94a3b8" stroke-width="4"/>
   <text x="90" y="124" text-anchor="middle" fill="currentColor" font-size="9">obturator</text><text x="270" y="124" text-anchor="middle" fill="currentColor" font-size="9">obturator</text>
   <ellipse cx="180" cy="78" rx="44" ry="30" fill="#facc15" fill-opacity=".45" stroke="#ca8a04"/><text x="180" y="82" text-anchor="middle" fill="currentColor" font-weight="700">Bladder</text>
   <rect x="173" y="106" width="14" height="90" rx="6" fill="#ca8a04" fill-opacity=".8"/>
   <text x="192" y="190" fill="currentColor">Urethra</text>
   <path d="M150 150 Q 180 162 210 150" fill="none" stroke="#2563eb" stroke-width="4"/>
   <path d="M150 150 C 140 110 140 70 150 36" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-dasharray="5 3"/>
   <path d="M210 150 C 220 110 220 70 210 36" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-dasharray="5 3"/>
   <path d="M152 156 Q 120 150 92 132" fill="none" stroke="#16a34a" stroke-width="3"/><path d="M208 156 Q 240 150 268 132" fill="none" stroke="#16a34a" stroke-width="3"/>
   <path d="M160 112 Q 180 120 200 112" fill="none" stroke="#9333ea" stroke-width="4"/>
   <path d="M150 104 L 118 46" stroke="#dc2626" stroke-width="2"/><path d="M210 104 L 242 46" stroke="#dc2626" stroke-width="2"/>
   <g font-size="9.5"><rect x="12" y="200" width="10" height="4" fill="#2563eb"/><text x="26" y="205" fill="currentColor">Retropubic MUS (TVT)</text>
   <rect x="12" y="214" width="10" height="4" fill="#16a34a"/><text x="26" y="219" fill="currentColor">Transobturator MUS (TOT)</text>
   <rect x="196" y="200" width="10" height="4" fill="#9333ea"/><text x="210" y="205" fill="currentColor">Fascial sling (bladder neck)</text>
   <rect x="196" y="214" width="10" height="4" fill="#dc2626"/><text x="210" y="219" fill="currentColor">Burch sutures → Cooper's lig.</text></g>
   </svg>`},
  {title:"SUI work-up: index or complicated?", caption:"Summary of the AUA/SUFU and EAU approach. Urodynamics is optional before primary surgery in the index patient with demonstrable SUI and normal emptying; complicated features push towards (video)urodynamics and cystoscopy before choosing an operation.",
   svg:`<svg viewBox="0 0 360 250" role="img" aria-label="Flowchart for index versus complicated stress urinary incontinence" font-family="system-ui,sans-serif" font-size="10">
   <rect x="80" y="8" width="200" height="30" rx="8" fill="#0ea5e9" fill-opacity=".25" stroke="#0284c7"/><text x="180" y="27" text-anchor="middle" fill="currentColor" font-weight="700">History · diary · exam · cough test · UA · PVR</text>
   <path d="M180 38 v14" stroke="currentColor"/>
   <rect x="80" y="52" width="200" height="30" rx="8" fill="#94a3b8" fill-opacity=".25" stroke="#64748b"/><text x="180" y="71" text-anchor="middle" fill="currentColor" font-weight="700">PFMT ≥ 3 months, lifestyle, oestrogen</text>
   <path d="M180 82 v14" stroke="currentColor"/>
   <rect x="110" y="96" width="140" height="28" rx="14" fill="#facc15" fill-opacity=".35" stroke="#ca8a04"/><text x="180" y="114" text-anchor="middle" fill="currentColor" font-weight="700">Complicating features?</text>
   <path d="M150 124 L 90 146" stroke="currentColor"/><path d="M210 124 L 270 146" stroke="currentColor"/>
   <text x="100" y="138" fill="currentColor" font-size="9">No</text><text x="252" y="138" fill="currentColor" font-size="9">Yes</text>
   <rect x="10" y="146" width="160" height="96" rx="8" fill="#22c55e" fill-opacity=".2" stroke="#16a34a"/>
   <g fill="currentColor"><text x="20" y="162" font-weight="800">Index patient</text><text x="20" y="178">UDS optional (ValUE)</text><text x="20" y="192">Shared decision:</text><text x="20" y="206">MUS · Burch · fascial sling</text><text x="20" y="220">· bulking agent</text><text x="20" y="234" font-size="9">Record mesh counselling</text></g>
   <rect x="190" y="146" width="160" height="96" rx="8" fill="#f97316" fill-opacity=".2" stroke="#ea580c"/>
   <g fill="currentColor" font-size="9.5"><text x="200" y="162" font-weight="800" font-size="10">Complicated</text><text x="200" y="177">prior SUI/pelvic surgery · POP 3–4</text><text x="200" y="190">urgency-predominant MUI</text><text x="200" y="203">raised PVR · neurogenic · radiation</text><text x="200" y="216">mesh complication · SUI not seen</text><text x="200" y="232" font-weight="700">→ (video)UDS ± cystoscopy</text></g>
   </svg>`}
 ],
 "Overactive Bladder & Nocturia": [
  {title:"OAB treatment pathway (AUA/SUFU 2024)", caption:"No longer a rigid ladder: behavioural therapy for all, drugs may start alongside it, and invasive options follow an adequate trial. Review benefit and side effects at each step; prefer β3 agonists when cognitive risk matters.",
   svg:`<svg viewBox="0 0 360 230" role="img" aria-label="OAB treatment pathway" font-family="system-ui,sans-serif" font-size="10">
   <g>
    <rect x="10" y="14" width="340" height="44" rx="10" fill="#22c55e" fill-opacity=".22" stroke="#16a34a"/>
    <text x="20" y="32" fill="currentColor" font-weight="800">Everyone: education + behavioural therapy</text>
    <text x="20" y="48" fill="currentColor">bladder training · urge suppression · fluids · PFMT · oestrogen</text>
    <rect x="10" y="68" width="340" height="44" rx="10" fill="#0ea5e9" fill-opacity=".22" stroke="#0284c7"/>
    <text x="20" y="86" fill="currentColor" font-weight="800">Pharmacotherapy (can start with behavioural)</text>
    <text x="20" y="102" fill="currentColor">β3 agonist or antimuscarinic · switch/combine · dementia risk</text>
    <rect x="10" y="122" width="340" height="44" rx="10" fill="#f97316" fill-opacity=".2" stroke="#ea580c"/>
    <text x="20" y="140" fill="currentColor" font-weight="800">Minimally invasive (refractory)</text>
    <text x="20" y="156" fill="currentColor">onabotulinumtoxinA 100 U (CISC-ready) · SNM · PTNS</text>
    <rect x="10" y="176" width="340" height="44" rx="10" fill="#dc2626" fill-opacity=".18" stroke="#dc2626"/>
    <text x="20" y="194" fill="currentColor" font-weight="800">Rarely: augmentation cystoplasty / diversion</text>
    <text x="20" y="210" fill="currentColor">small, refractory bladder in selected, counselled patients</text>
   </g>
   </svg>`},
  {title:"Reading the frequency-volume chart for nocturia", caption:"Nocturnal urine volume includes the first morning void. Nocturnal polyuria index (NPi) = NUV ÷ 24-h volume (> 33% in older adults, > 20% in the young). Global polyuria: > 40 mL/kg/24 h. Nocturia index Ni = NUV ÷ maximum voided volume; NBCi = actual night voids − (Ni − 1), and NBCi > 0 means reduced nocturnal bladder capacity.",
   svg:`<svg viewBox="0 0 360 220" role="img" aria-label="Nocturia phenotypes from a frequency-volume chart" font-family="system-ui,sans-serif" font-size="10">
   <rect x="120" y="8" width="120" height="30" rx="8" fill="#94a3b8" fill-opacity=".25" stroke="#64748b"/><text x="180" y="27" text-anchor="middle" fill="currentColor" font-weight="800">3-day FVC</text>
   <path d="M150 38 L 60 70" stroke="currentColor"/><path d="M180 38 L 180 70" stroke="currentColor"/><path d="M210 38 L 300 70" stroke="currentColor"/>
   <rect x="6" y="70" width="112" height="86" rx="8" fill="#0ea5e9" fill-opacity=".2" stroke="#0284c7"/>
   <g fill="currentColor"><text x="14" y="86" font-weight="800">Global polyuria</text><text x="14" y="102">&gt; 40 mL/kg/24 h</text><text x="14" y="120" font-size="9">diabetes, DI, high</text><text x="14" y="132" font-size="9">intake, diuretics</text></g>
   <rect x="124" y="70" width="112" height="86" rx="8" fill="#a855f7" fill-opacity=".2" stroke="#9333ea"/>
   <g fill="currentColor"><text x="132" y="86" font-weight="800">Nocturnal polyuria</text><text x="132" y="102">NPi &gt; 33%</text><text x="132" y="120" font-size="9">OSA, heart failure,</text><text x="132" y="132" font-size="9">oedema, evening fluids</text><text x="132" y="144" font-size="9">→ ± desmopressin</text></g>
   <rect x="242" y="70" width="112" height="86" rx="8" fill="#f97316" fill-opacity=".2" stroke="#ea580c"/>
   <g fill="currentColor"><text x="250" y="86" font-weight="800">Low capacity</text><text x="250" y="102">NBCi &gt; 0</text><text x="250" y="120" font-size="9">OAB, BOO, BPS,</text><text x="250" y="132" font-size="9">high PVR</text></g>
   <rect x="60" y="170" width="240" height="40" rx="8" fill="#facc15" fill-opacity=".25" stroke="#ca8a04"/>
   <text x="180" y="186" text-anchor="middle" fill="currentColor" font-weight="700">Mixed phenotypes are common —</text><text x="180" y="201" text-anchor="middle" fill="currentColor">also screen for primary sleep disorders</text>
   </svg>`}
 ],
 "Urodynamics": [
  {title:"Filling cystometry: what the four traces show", caption:"Schematic traces. Pdet is calculated (Pves − Pabd). A cough gives equal spikes in Pves and Pabd and almost none in Pdet — that is the quality check. A detrusor overactivity wave rises in Pves and Pdet but not in Pabd. Straining rises in Pves and Pabd together.",
   svg:`<svg viewBox="0 0 360 250" role="img" aria-label="Schematic urodynamic traces showing cough, detrusor overactivity and straining" font-family="system-ui,sans-serif" font-size="10">
   <g fill="currentColor" font-weight="700"><text x="6" y="40">Pves</text><text x="6" y="100">Pabd</text><text x="6" y="160">Pdet</text><text x="6" y="220">Flow</text></g>
   <g stroke="#94a3b8" stroke-width=".6"><line x1="44" y1="50" x2="352" y2="50"/><line x1="44" y1="110" x2="352" y2="110"/><line x1="44" y1="170" x2="352" y2="170"/><line x1="44" y1="230" x2="352" y2="230"/></g>
   <path d="M44 46 H96 L100 20 L104 46 H170 C 182 46 186 26 198 26 C 210 26 214 46 226 46 H262 L268 28 L292 28 L298 46 H352" fill="none" stroke="#2563eb" stroke-width="2"/>
   <path d="M44 106 H96 L100 80 L104 106 H262 L268 88 L292 88 L298 106 H352" fill="none" stroke="#16a34a" stroke-width="2"/>
   <path d="M44 166 H96 L100 163 L104 166 H170 C 182 166 186 146 198 146 C 210 146 214 166 226 166 H352" fill="none" stroke="#dc2626" stroke-width="2"/>
   <path d="M44 230 H352" fill="none" stroke="#0ea5e9" stroke-width="2"/>
   <g fill="currentColor" font-size="9" text-anchor="middle"><text x="100" y="12">cough</text><text x="198" y="12">DO wave</text><text x="280" y="12">straining</text></g>
   <g stroke="#94a3b8" stroke-dasharray="3 3"><line x1="100" y1="16" x2="100" y2="236"/><line x1="198" y1="16" x2="198" y2="236"/><line x1="280" y1="16" x2="280" y2="236"/></g>
   <text x="180" y="248" text-anchor="middle" fill="currentColor" font-size="9">Pdet = Pves − Pabd · filling Pdet &gt; 40 cmH2O = upper-tract risk</text>
   </svg>`},
  {title:"ICS nomogram for men: obstruction × contractility", caption:"Schematic of the ICS (Schäfer) pressure-flow nomogram. BOOI = PdetQmax − 2Qmax divides obstructed (> 40), equivocal (20–40) and unobstructed (< 20). BCI = PdetQmax + 5Qmax divides strong (> 150), normal (100–150) and weak (< 100) contractility. These male indices should not be applied to women.",
   svg:`<svg viewBox="0 0 360 260" role="img" aria-label="Nomogram plotting PdetQmax against Qmax with BOOI and BCI lines" font-family="system-ui,sans-serif" font-size="10">
   <g transform="translate(46 14)">
    <rect x="0" y="0" width="290" height="200" fill="none" stroke="currentColor" stroke-width=".8"/>
    <!-- x: Qmax 0-25 → 0-290 (11.6 px per mL/s); y: Pdet 0-150 → 200-0 (1.333 px per cmH2O) -->
    <polygon points="0,146.7 290,80 290,0 0,0" fill="#dc2626" fill-opacity=".16"/>
    <polygon points="0,173.3 290,106.7 290,80 0,146.7" fill="#facc15" fill-opacity=".25"/>
    <polygon points="0,200 290,200 290,106.7 0,173.3" fill="#22c55e" fill-opacity=".16"/>
    <line x1="0" y1="146.7" x2="290" y2="80" stroke="#dc2626" stroke-width="1.6"/>
    <line x1="0" y1="173.3" x2="290" y2="106.7" stroke="#ca8a04" stroke-width="1.6"/>
    <line x1="0" y1="0" x2="290" y2="166.7" stroke="#2563eb" stroke-width="1.6" stroke-dasharray="6 3"/>
    <line x1="0" y1="66.7" x2="232" y2="200" stroke="#2563eb" stroke-width="1.6" stroke-dasharray="2 3"/>
    <g fill="currentColor" font-size="9"><text x="110" y="16" font-weight="700">Obstructed (BOOI &gt; 40)</text><text x="140" y="133" font-weight="700">Equivocal</text><text x="30" y="192" font-weight="700">Unobstructed (&lt; 20)</text>
    <text x="252" y="136" fill="#2563eb" font-weight="700">BCI 150</text><text x="200" y="168" fill="#2563eb" font-weight="700">BCI 100</text></g>
    <g fill="currentColor" font-size="9" text-anchor="middle"><text x="0" y="214">0</text><text x="116" y="214">10</text><text x="232" y="214">20</text><text x="145" y="230" font-weight="700">Qmax (mL/s)</text></g>
    <g fill="currentColor" font-size="9" text-anchor="end"><text x="-4" y="203">0</text><text x="-4" y="136">50</text><text x="-4" y="70">100</text><text x="-4" y="6">150</text></g>
   </g>
   <text x="12" y="120" fill="currentColor" font-size="9" font-weight="700" transform="rotate(-90 12 120)" text-anchor="middle">PdetQmax (cmH2O)</text>
   </svg>`},
  {title:"Uroflow curve shapes", caption:"Schematic flow curves. A low flow cannot by itself distinguish obstruction from detrusor underactivity (DU) — that needs a pressure-flow study. DV = dysfunctional voiding; BPO = benign prostatic obstruction. Interpret only with a voided volume of at least 150 mL and a PVR.",
   svg:`<svg viewBox="0 0 360 230" role="img" aria-label="Five schematic uroflow curve shapes" font-family="system-ui,sans-serif" font-size="10">
   <g fill="none" stroke-width="2.2">
    <path d="M10 80 C 25 80 30 20 50 20 C 70 20 76 80 100 80" stroke="#16a34a"/>
    <path d="M130 80 C 135 50 140 50 150 50 H 210 C 220 50 222 60 228 80" stroke="#ea580c"/>
    <path d="M250 80 C 255 58 265 56 280 58 C 300 62 320 66 350 80" stroke="#dc2626"/>
    <path d="M20 200 C 25 170 30 170 38 190 C 44 160 52 160 60 195 C 66 170 74 168 82 196 C 88 178 96 178 110 200" stroke="#9333ea"/>
    <path d="M230 200 C 240 200 242 130 256 130 C 270 130 272 200 284 200" stroke="#0ea5e9"/>
   </g>
   <g stroke="#94a3b8" stroke-width=".6"><line x1="6" y1="80" x2="104" y2="80"/><line x1="126" y1="80" x2="232" y2="80"/><line x1="246" y1="80" x2="354" y2="80"/><line x1="16" y1="200" x2="114" y2="200"/><line x1="214" y1="200" x2="300" y2="200"/></g>
   <g fill="currentColor" font-size="9.5" text-anchor="middle">
    <text x="55" y="96" font-weight="700">Bell — normal</text>
    <text x="180" y="96" font-weight="700">Plateau</text><text x="180" y="108">stricture</text>
    <text x="300" y="96" font-weight="700">Low, prolonged</text><text x="300" y="108">BPO or DU</text>
    <text x="65" y="216" font-weight="700">Intermittent</text><text x="65" y="228">straining or DV</text>
    <text x="257" y="216" font-weight="700">Superflow</text><text x="257" y="228">low outlet resistance</text>
   </g>
   </svg>`}
 ],
 "Pelvic Organ Prolapse": [
  {title:"POP-Q points and the 3 × 3 grid", caption:"Schematic sagittal view (anterior on the left). Points are measured in cm from the hymen at maximal strain: proximal (inside) is negative, distal (outside) is positive. Aa and Ap are fixed 3 cm inside the hymen; Ba and Bp are the most dependent parts of the anterior and posterior walls; C is the cervix or vault and D the posterior fornix.",
   svg:`<svg viewBox="0 0 360 250" role="img" aria-label="POP-Q points on a sagittal vaginal schematic with the 3 by 3 recording grid" font-family="system-ui,sans-serif" font-size="10">
   <path d="M40 150 C 80 150 120 80 150 40" fill="none" stroke="#db2777" stroke-width="3"/>
   <path d="M40 186 C 100 186 160 120 186 64" fill="none" stroke="#db2777" stroke-width="3"/>
   <path d="M150 40 C 166 36 186 48 186 64" fill="none" stroke="#db2777" stroke-width="3"/>
   <line x1="40" y1="140" x2="40" y2="196" stroke="currentColor" stroke-width="2"/><text x="10" y="214" fill="currentColor" font-weight="700">Hymen (0)</text>
   <g font-weight="800" font-size="9.5" text-anchor="middle">
    <circle cx="72" cy="146" r="6" fill="#2563eb"/><text x="72" y="134" fill="currentColor">Aa</text>
    <circle cx="112" cy="104" r="6" fill="#2563eb"/><text x="104" y="92" fill="currentColor">Ba</text>
    <circle cx="160" cy="40" r="6" fill="#16a34a"/><text x="160" y="28" fill="currentColor">C</text>
    <circle cx="184" cy="72" r="6" fill="#16a34a"/><text x="200" y="76" fill="currentColor">D</text>
    <circle cx="140" cy="128" r="6" fill="#ea580c"/><text x="154" y="140" fill="currentColor">Bp</text>
    <circle cx="80" cy="180" r="6" fill="#ea580c"/><text x="84" y="200" fill="currentColor">Ap</text>
   </g>
   <g transform="translate(214 96)" font-size="9.5">
    <g fill="none" stroke="currentColor" stroke-width=".8"><rect x="0" y="0" width="138" height="108"/><line x1="46" y1="0" x2="46" y2="108"/><line x1="92" y1="0" x2="92" y2="108"/><line x1="0" y1="36" x2="138" y2="36"/><line x1="0" y1="72" x2="138" y2="72"/></g>
    <g fill="currentColor" text-anchor="middle"><text x="23" y="16" font-weight="700">Aa</text><text x="69" y="16" font-weight="700">Ba</text><text x="115" y="16" font-weight="700">C</text>
    <text x="23" y="30">ant. wall</text><text x="69" y="30">ant. wall</text><text x="115" y="30">vault</text>
    <text x="23" y="52" font-weight="700">gh</text><text x="69" y="52" font-weight="700">pb</text><text x="115" y="52" font-weight="700">tvl</text>
    <text x="23" y="66">hiatus</text><text x="69" y="66">perineum</text><text x="115" y="66">length</text>
    <text x="23" y="88" font-weight="700">Ap</text><text x="69" y="88" font-weight="700">Bp</text><text x="115" y="88" font-weight="700">D</text>
    <text x="23" y="102">post. wall</text><text x="69" y="102">post. wall</text><text x="115" y="102">fornix</text></g>
   </g>
   <text x="214" y="86" fill="currentColor" font-weight="800">Record as a 3 × 3 grid</text>
   <g font-size="9" fill="currentColor"><circle cx="20" cy="234" r="4" fill="#2563eb"/><text x="28" y="237">anterior</text><circle cx="90" cy="234" r="4" fill="#16a34a"/><text x="98" y="237">apical</text><circle cx="150" cy="234" r="4" fill="#ea580c"/><text x="158" y="237">posterior</text></g>
   </svg>`},
  {title:"POP-Q stage by the most distal point", caption:"Stage is set by the most distal (leading) point at maximal strain, relative to the hymen. tvl = total vaginal length. Stage 0 needs every point at its most proximal possible position.",
   svg:`<svg viewBox="0 0 360 190" role="img" aria-label="POP-Q staging ruler" font-family="system-ui,sans-serif" font-size="10">
   <line x1="20" y1="70" x2="340" y2="70" stroke="currentColor" stroke-width="2"/>
   <g stroke="currentColor"><line x1="60" y1="62" x2="60" y2="78"/><line x1="150" y1="62" x2="150" y2="78"/><line x1="180" y1="56" x2="180" y2="84" stroke-width="2.5"/><line x1="210" y1="62" x2="210" y2="78"/><line x1="300" y1="62" x2="300" y2="78"/></g>
   <g fill="currentColor" text-anchor="middle" font-size="9.5"><text x="60" y="96">−3</text><text x="150" y="96">−1</text><text x="180" y="100" font-weight="800">0 hymen</text><text x="210" y="96">+1</text><text x="300" y="96">tvl − 2</text></g>
   <g fill="currentColor" font-size="9"><text x="20" y="54">← inside (negative)</text><text x="262" y="54">outside (positive) →</text></g>
   <rect x="20" y="20" width="40" height="22" fill="#22c55e" fill-opacity=".25"/><rect x="60" y="20" width="90" height="22" fill="#84cc16" fill-opacity=".3"/><rect x="150" y="20" width="60" height="22" fill="#facc15" fill-opacity=".4"/><rect x="210" y="20" width="90" height="22" fill="#f97316" fill-opacity=".35"/><rect x="300" y="20" width="40" height="22" fill="#dc2626" fill-opacity=".35"/>
   <g text-anchor="middle" font-weight="800" fill="currentColor"><text x="40" y="35">0</text><text x="105" y="35">I</text><text x="180" y="35">II</text><text x="255" y="35">III</text><text x="320" y="35">IV</text></g>
   <g fill="currentColor" font-size="9.5"><text x="20" y="124">0: all points at −3 / apex at −tvl</text><text x="20" y="140">I: leading point &lt; −1 (more than 1 cm above hymen)</text><text x="20" y="156">II: leading point −1 to +1 (within 1 cm of hymen)</text><text x="20" y="172">III: &gt; +1 but &lt; tvl − 2</text><text x="20" y="188">IV: ≥ tvl − 2 (complete eversion / procidentia)</text></g>
   </svg>`}
 ],
 "Bladder Pain Syndrome / Interstitial Cystitis": [
  {title:"IC/BPS: phenotype-directed, multimodal care (AUA 2022)", caption:"Treatment is no longer tiered: start education, self-care, pain management and myofascial physiotherapy together, then add oral or intravesical therapy by phenotype. Cystoscopy matters because Hunner lesions respond to lesion-directed treatment.",
   svg:`<svg viewBox="0 0 360 240" role="img" aria-label="IC/BPS multimodal care diagram" font-family="system-ui,sans-serif" font-size="10">
   <circle cx="180" cy="118" r="44" fill="#dc2626" fill-opacity=".18" stroke="#dc2626"/>
   <text x="180" y="114" text-anchor="middle" fill="currentColor" font-weight="800">Patient with</text><text x="180" y="128" text-anchor="middle" fill="currentColor" font-weight="800">IC/BPS</text>
   <g fill="currentColor">
    <rect x="6" y="10" width="140" height="56" rx="8" fill="#22c55e" fill-opacity=".2" stroke="#16a34a"/><text x="14" y="26" font-weight="800">Self-care & education</text><text x="14" y="42">diet triggers, fluids,</text><text x="14" y="56">stress, flare plan</text>
    <rect x="214" y="10" width="140" height="56" rx="8" fill="#0ea5e9" fill-opacity=".2" stroke="#0284c7"/><text x="222" y="26" font-weight="800">Pain management</text><text x="222" y="42">multimodal, neuropathic;</text><text x="222" y="56">pain service early</text>
    <rect x="6" y="170" width="140" height="62" rx="8" fill="#a855f7" fill-opacity=".2" stroke="#9333ea"/><text x="14" y="186" font-weight="800">Pelvic floor PT</text><text x="14" y="202">myofascial release;</text><text x="14" y="216">avoid Kegel strengthening</text>
    <rect x="214" y="170" width="140" height="62" rx="8" fill="#f97316" fill-opacity=".2" stroke="#ea580c"/><text x="222" y="186" font-weight="800">By phenotype</text><g font-size="9"><text x="222" y="200">oral: amitriptyline, PPS*</text><text x="222" y="213">bladder: DMSO, heparin, lido.</text><text x="222" y="226">Hunner lesion: fulgurate</text></g>
   </g>
   <g stroke="currentColor" stroke-width="1"><line x1="146" y1="58" x2="148" y2="90"/><line x1="214" y1="58" x2="212" y2="90"/><line x1="146" y1="178" x2="148" y2="148"/><line x1="214" y1="178" x2="212" y2="148"/></g>
   <text x="180" y="168" text-anchor="middle" fill="currentColor" font-size="8.5">*PPS: retinal checks</text>
   </svg>`}
 ],
 "Female Voiding Dysfunction & Urethral Diverticulum": [
  {title:"Female urethral diverticulum: anatomy and layered repair", caption:"Schematic. Left: axial view of a 'saddlebag' diverticulum wrapping around the urethra from a posterolateral ostium. Right: the three non-overlapping closure layers after excision — urethra, periurethral fascia, vaginal flap — with a Martius flap if tissue is poor. Never place a synthetic sling at the same time.",
   svg:`<svg viewBox="0 0 360 220" role="img" aria-label="Axial schematic of a saddlebag urethral diverticulum and the layered closure" font-family="system-ui,sans-serif" font-size="10">
   <text x="80" y="16" text-anchor="middle" fill="currentColor" font-weight="800">Axial (anterior up)</text>
   <path d="M80 110 m -62 0 a 62 54 0 1 0 124 0 a 62 54 0 1 0 -124 0" fill="#f472b6" fill-opacity=".18" stroke="#db2777" stroke-dasharray="4 3"/>
   <path d="M30 118 C 30 160 130 160 130 118 C 130 136 110 146 80 146 C 50 146 30 136 30 118 Z" fill="#facc15" fill-opacity=".5" stroke="#ca8a04"/>
   <circle cx="80" cy="96" r="18" fill="#ca8a04" fill-opacity=".8"/><circle cx="80" cy="96" r="5" fill="#fff"/>
   <path d="M88 112 L 96 128" stroke="#dc2626" stroke-width="3"/>
   <g fill="currentColor" font-size="9"><text x="80" y="70" text-anchor="middle">urethra</text><text x="80" y="178" text-anchor="middle">diverticulum (saddlebag)</text><text x="100" y="124">ostium</text><text x="80" y="194" text-anchor="middle">vaginal wall below</text></g>
   <line x1="170" y1="20" x2="170" y2="206" stroke="#94a3b8" stroke-dasharray="3 3"/>
   <text x="266" y="16" text-anchor="middle" fill="currentColor" font-weight="800">Closure after excision</text>
   <g>
    <rect x="196" y="34" width="140" height="28" rx="6" fill="#ca8a04" fill-opacity=".5"/><text x="266" y="52" text-anchor="middle" fill="currentColor" font-weight="700">1 Urethra (watertight)</text>
    <rect x="196" y="72" width="140" height="28" rx="6" fill="#0ea5e9" fill-opacity=".3"/><text x="266" y="90" text-anchor="middle" fill="currentColor" font-weight="700">2 Periurethral fascia</text>
    <rect x="196" y="110" width="140" height="28" rx="6" fill="#a855f7" fill-opacity=".25" stroke="#9333ea" stroke-dasharray="4 3"/><text x="266" y="128" text-anchor="middle" fill="currentColor" font-weight="700">± Martius flap</text>
    <rect x="196" y="148" width="140" height="28" rx="6" fill="#db2777" fill-opacity=".3"/><text x="266" y="166" text-anchor="middle" fill="currentColor" font-weight="700">3 Vaginal flap (inverted U)</text>
   </g>
   <text x="266" y="196" text-anchor="middle" fill="currentColor" font-size="9">Catheter ~10–14 days · VCUG if complex</text>
   </svg>`},
  {title:"Raised PVR or poor flow in a woman: sorting the cause", caption:"Pressure-flow study, ideally with fluoroscopy, separates obstruction (high pressure, low flow) from detrusor underactivity (low pressure, low flow). Video images locate the level of obstruction; sphincter EMG supports Fowler's syndrome.",
   svg:`<svg viewBox="0 0 360 240" role="img" aria-label="Flowchart for female voiding dysfunction" font-family="system-ui,sans-serif" font-size="10">
   <rect x="70" y="8" width="220" height="30" rx="8" fill="#94a3b8" fill-opacity=".25" stroke="#64748b"/><text x="180" y="27" text-anchor="middle" fill="currentColor" font-weight="700">Low Qmax ± raised PVR → (video)UDS</text>
   <path d="M140 38 L 90 60" stroke="currentColor"/><path d="M220 38 L 270 60" stroke="currentColor"/>
   <rect x="6" y="60" width="168" height="172" rx="8" fill="#f97316" fill-opacity=".18" stroke="#ea580c"/>
   <g fill="currentColor"><text x="14" y="78" font-weight="800">High Pdet, low flow = BOO</text>
   <text x="14" y="96" font-weight="700">Anatomical</text><text x="14" y="110" font-size="9.5">post-sling (commonest)</text><text x="14" y="123" font-size="9.5">prolapse kinking · stricture</text><text x="14" y="136" font-size="9.5">diverticulum · mass</text>
   <text x="14" y="156" font-weight="700">Functional</text><text x="14" y="170" font-size="9.5">dysfunctional voiding</text><text x="14" y="183" font-size="9.5">primary bladder neck obstr.</text><text x="14" y="196" font-size="9.5">Fowler's (sphincter fails</text><text x="14" y="209" font-size="9.5">to relax; EMG; → SNM)</text></g>
   <rect x="186" y="60" width="168" height="120" rx="8" fill="#0ea5e9" fill-opacity=".18" stroke="#0284c7"/>
   <g fill="currentColor"><text x="194" y="78" font-weight="800">Low Pdet, low flow = DU</text><text x="194" y="96" font-size="9.5">ageing · diabetes · neuro</text><text x="194" y="109" font-size="9.5">overdistension · drugs</text><text x="194" y="130" font-weight="700">Manage</text><text x="194" y="144" font-size="9.5">timed/double voiding · CISC</text><text x="194" y="157" font-size="9.5">SNM (non-obstructive</text><text x="194" y="170" font-size="9.5">retention)</text></g>
   <rect x="186" y="190" width="168" height="42" rx="8" fill="#22c55e" fill-opacity=".2" stroke="#16a34a"/>
   <text x="270" y="207" text-anchor="middle" fill="currentColor" font-weight="700">Always: protect the bladder</text><text x="270" y="222" text-anchor="middle" fill="currentColor" font-size="9.5">CISC over indwelling catheter</text>
   </svg>`}
 ]
});
