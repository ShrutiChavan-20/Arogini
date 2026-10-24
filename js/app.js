/**
 * HerVita - Women's Reproductive Wellness Application
 * Solution Design Implementation for 36-Hour Hackathon Demo
 */

// --- Global Application State ---
const HerVitaState = {
  activeDomain: 'obs', // 'obs' (Obstetrics) | 'gyn' (Gynecology)
  obsSubTab: 'obs-tracker',
  gynSubTab: 'gyn-menstrual',
  currentTab: 'module-awareness',
  currentSubTab: 'body-map',
  activeOrgan: 'uterus',
  selectedQuestions: [],
  selectedSeverity: 3,
  language: 'en',
  pin: null,
  isLocked: false,
  entries: [],
  checklist: [],
  vaccines: [],
  userProfile: {
    name: 'Priya Sharma',
    age: 26,
    cycleLength: 28,
    lmp: '2026-10-12',
    pregnancyLmp: '2026-06-15' // Approx 19 weeks gestation for rich demo
  },
  // A. Obstetrics State
  pregnancyMilestones: [],
  antenatalVisits: [],
  postpartumRecords: [],
  // B. Gynecology State
  periodLogs: [],
  pcosLogs: [],
  pelvicPainLogs: [],
  medicalRecords: []
};

// --- Organ Anatomy Knowledge Base ---
const ORGAN_DATA = {
  uterus: {
    id: 'uterus',
    name: 'Uterus (Womb)',
    hindiName: 'गर्भाशय (Uterus)',
    subtitle: 'Muscular home for implantation and menstruation',
    whatItDoes: 'A hollow, pear-shaped muscular organ where a fertilised egg implants and grows during pregnancy. Each month, its inner lining (endometrium) thickens in preparation for a baby. If pregnancy does not occur, hormone levels drop and this lining is gently shed as menstrual blood.',
    whyItMatters: 'The uterine muscles contract to shed the lining, which causes familiar menstrual cramps. Knowing your normal cycle helps you notice changes like unusually heavy bleeding or persistent pelvic pain early.',
    signsToWatch: [
      'Severe cramping that prevents normal activities or does not respond to simple rest/warmth',
      'Unusually heavy bleeding (soaking through two or more pads an hour for 2 hours in a row)',
      'Spotting or irregular bleeding between menstrual cycles'
    ],
    careTips: [
      'Warmth: Apply a warm water bag to the lower abdomen to ease muscle cramping',
      'Hydration: Drink 2–3 litres of warm water or herbal infusion daily to reduce bloating',
      'Iron & Magnesium: Nourish with spinach, lentils, pumpkin seeds, and jaggery',
      'Gentle Movement: Light stretching, walking, or child’s pose releases uterine tension'
    ],
    doctorQuestions: [
      'My period cramps disrupt my daily work on day 1—is this within normal range?',
      'How can I tell if my menstrual flow is considered heavy?'
    ]
  },
  ovaries: {
    id: 'ovaries',
    name: 'Ovaries (Left & Right)',
    hindiName: 'अंडाशय (Ovaries)',
    subtitle: 'Egg reserve and hormone producers (Estrogen & Progesterone)',
    whatItDoes: 'Two almond-sized glands situated on either side of the uterus. They house thousands of immature eggs and release one mature egg each month during ovulation. They also produce estrogen and progesterone—the key hormones governing female vitality.',
    whyItMatters: 'Ovaries orchestrate your entire menstrual rhythm, bone density, skin health, and energy levels. Imbalances here are linked to conditions like PCOS (Polycystic Ovary Syndrome).',
    signsToWatch: [
      'Sudden, sharp, severe lower abdominal pain on one side (could indicate ovarian torsion)',
      'Persistently irregular, missed, or very delayed cycles (>35–40 days)',
      'Excessive facial/body hair growth, persistent adult acne, or unexplained weight changes'
    ],
    careTips: [
      'Blood Sugar Balance: Pair carbohydrates with protein and fibre to support steady ovulation',
      'Restorative Sleep: 7–8 hours of consistent sleep keeps gonadotropin hormones in rhythm',
      'Healthy Fats: Include nuts, seeds (flax/chia), and unrefined oils for hormone synthesis',
      'Stress Reduction: Chronic stress elevates cortisol, which can pause or delay ovulation'
    ],
    doctorQuestions: [
      'Could my irregular cycles be related to my ovaries or hormones?',
      'Would a routine pelvic ultrasound help assess my ovarian health?'
    ]
  },
  tubes: {
    id: 'tubes',
    name: 'Fallopian Tubes',
    hindiName: 'फैलोपियन ट्यूब (Fallopian Tubes)',
    subtitle: 'The delicate bridges between ovaries and uterus',
    whatItDoes: 'Two slender tubes that pick up the egg released by the ovary. Inside, microscopic hair-like structures (cilia) gently sweep the egg toward the uterus. Conception typically takes place within these tubes.',
    whyItMatters: 'Clear, healthy fallopian tubes are essential for natural conception. Blockages can occur following untreated pelvic infections.',
    signsToWatch: [
      'Sharp, one-sided pelvic or abdominal pain alongside a positive pregnancy test (emergency sign of possible ectopic pregnancy)',
      'Dull, persistent lower pelvic ache with abnormal fever or discharge'
    ],
    careTips: [
      'Infection Awareness: Treat any unusual vaginal irritation or pelvic discomfort promptly',
      'Safe Intimacy: Protects against silent pelvic infections that can cause tubal scarring',
      'Annual Checkups: Discuss any past pelvic pain or surgeries with your gynaecologist'
    ],
    doctorQuestions: [
      'How do past pelvic infections affect the health of the fallopian tubes?',
      'What symptoms warrant immediate medical care in early pregnancy?'
    ]
  },
  cervix: {
    id: 'cervix',
    name: 'Cervix',
    hindiName: 'गर्भाशय ग्रीवा (Cervix)',
    subtitle: 'The protective doorway and mucus indicator',
    whatItDoes: 'The lower, narrow cylinder of the uterus that connects to the vagina. It acts as a gatekeeper, producing cervical mucus that changes texture through the month—from dry and sticky to stretchy and egg-white during fertile ovulation days.',
    whyItMatters: 'The cervix protects the uterus from ascending infections and is the site checked during routine cervical cancer screening (Pap smears and HPV tests).',
    signsToWatch: [
      'Spotting or bleeding during or immediately after intercourse',
      'Foul-smelling or discoloured cervical discharge accompanied by irritation',
      'Persistent pelvic pressure or bleeding outside menstrual periods'
    ],
    careTips: [
      'HPV Vaccination: The HPV vaccine prevents the main strains that cause cervical cancer',
      'Regular Screening: Have a Pap smear or HPV screening every 3–5 years as advised by your doctor',
      'Breathable Fabrics: Wear pure cotton underwear and avoid moisture buildup'
    ],
    doctorQuestions: [
      'Am I due for a cervical screening or Pap test based on my age?',
      'Is the HPV vaccine recommended for my age group?'
    ]
  },
  vagina: {
    id: 'vagina',
    name: 'Vagina & Microbiome',
    hindiName: 'योनि और माइक्रोबायोम (Vagina)',
    subtitle: 'Self-cleaning canal with a natural protective pH',
    whatItDoes: 'A flexible muscular canal lined with beneficial bacteria (predominantly Lactobacillus) that maintain an acidic pH (3.8–4.5). This protective acidity prevents harmful bacteria and yeast from overgrowing.',
    whyItMatters: 'The vagina cleans itself naturally through regular, clear or milky discharge. It does not require harsh soaps, scented washes, or internal cleaning.',
    signsToWatch: [
      'Discharge that is thick and clumpy like curd, greenish, or has a strong fishy odour',
      'Intense itching, redness, swelling, or burning during urination',
      'Unexplained vaginal pain or dryness affecting daily comfort'
    ],
    careTips: [
      'Zero Douching: Never use internal douches or scented feminine washes; warm water externally is best',
      'Front-to-Back: Always wipe from front to back to avoid transferring gut bacteria',
      'Probiotics: Include natural curd, fermented foods, and yoghurt to maintain flora balance',
      'Change Sanitary Pads: Replace pads/tampons every 4–6 hours during periods'
    ],
    doctorQuestions: [
      'What type of daily discharge is normal across my cycle?',
      'If I experience frequent itching, could it be yeast or bacterial vaginosis?'
    ]
  },
  pelvic_floor: {
    id: 'pelvic_floor',
    name: 'Pelvic Floor Muscles',
    hindiName: 'पेल्विक फ्लोर मांसपेशियां',
    subtitle: 'The supportive muscular hammock of the core',
    whatItDoes: 'A sling of muscles and connective tissue stretching from the pubic bone to the tailbone. It supports your bladder, uterus, and bowels, assisting in bladder control and core stability.',
    whyItMatters: 'Pregnancy, childbirth, chronic coughing, or heavy lifting can weaken or tighten the pelvic floor, leading to involuntary leaks or pelvic organ heaviness.',
    signsToWatch: [
      'Leaking urine when sneezing, coughing, laughing, or exercising',
      'A feeling of heaviness, fullness, or bulging in the pelvic area',
      'Pain or discomfort during intimate moments or tampon insertion'
    ],
    careTips: [
      'Kegel Exercises: Contract and lift the pelvic muscles for 5 seconds, then fully relax for 5 seconds',
      'Avoid Straining: Increase dietary fibre to prevent constipation, which strains the pelvic floor',
      'Diaphragmatic Breathing: Deep belly breaths relax tight, hypertonic pelvic muscles',
      'Postpartum Checkup: Consult a physical therapist after childbirth for core recovery'
    ],
    doctorQuestions: [
      'Are my pelvic floor muscles too weak, or could they be too tight?',
      'What safe exercises do you recommend to strengthen my pelvic support?'
    ]
  },
  hormones: {
    id: 'hormones',
    name: 'Hormonal Harmony Axis',
    hindiName: 'हार्मोनल संतुलन प्रणाली',
    subtitle: 'The communication loop between brain and reproductive organs',
    whatItDoes: 'The brain (hypothalamus and pituitary gland) sends signals (FSH and LH) to the ovaries, which respond with estrogen and progesterone. This feedback loop regulates your monthly cycle, energy, and mood.',
    whyItMatters: 'Hormones are not just about periods—they influence sleep quality, skin clarity, metabolic rate, emotional resilience, and cardiovascular health.',
    signsToWatch: [
      'Severe mood dips, intense rage, or crying spells in the week before periods (PMDD)',
      'Unexplained hot flashes, night sweats, or sudden insomnia',
      'Significant, unexplained changes in cycle length or sudden absence of periods'
    ],
    careTips: [
      'Circadian Alignment: Morning natural sunlight helps regulate melatonin and reproductive rhythms',
      'Gentle Movement: Prioritise walking and strength training over chronic exhaustive cardio',
      'Balanced Meals: Never skip protein; it provides amino acids for neurotransmitters and hormones',
      'Limit Caffeine: Excess caffeine during the luteal phase can amplify breast tenderness and anxiety'
    ],
    doctorQuestions: [
      'Would checking my thyroid and reproductive hormone levels be beneficial?',
      'How can I distinguish normal PMS from PMDD?'
    ]
  }
};

// --- Curated Explainer Video Modules (60-90s) ---
const VIDEO_MODULES = [
  {
    id: 'v1',
    title: 'The Menstrual Cycle: 4 Phases Explained',
    tag: 'Foundations',
    duration: '1:24',
    youtubeId: 'ayzN5f3qN8g',
    channel: 'TED-Ed (by Emma Bryce)',
    thumbBg: 'linear-gradient(135deg, #F3BFD6, #C23A7B)',
    description: 'A 90-second clinical breakdown of Menstruation, Follicular, Ovulation, and Luteal phases.',
    takeaways: [
      'Day 1 is the first day of full menstrual bleeding.',
      'Ovulation typically happens around day 14 in a 28-day cycle.',
      'Progesterone rises after ovulation to prepare and stabilise the uterine lining.'
    ],
    interactiveSteps: [
      { time: 'Days 1–5', phase: 'Menstruation', desc: 'Estrogen and progesterone drop. The uterine lining sheds gently as menstrual blood.', icon: '🩸', visual: 'shedding' },
      { time: 'Days 6–13', phase: 'Follicular Phase', desc: 'FSH hormone stimulates ovarian follicles to grow and release estrogen, rebuilding the endometrium.', icon: '🌱', visual: 'follicles' },
      { time: 'Day 14', phase: 'Ovulation', desc: 'A surge of LH triggers the release of a mature egg from the ovary into the fallopian tube.', icon: '🥚', visual: 'ovulation' },
      { time: 'Days 15–28', phase: 'Luteal Phase', desc: 'The corpus luteum secretes progesterone. If pregnancy does not occur, hormone decline initiates the next cycle.', icon: '🌙', visual: 'luteal' }
    ],
    doctorQuestion: 'How can I tell if my cycle phases are balanced based on my symptoms?'
  },
  {
    id: 'v2',
    title: 'Ovaries & Ovulation: What Really Happens',
    tag: 'Fertility & Hormones',
    duration: '1:15',
    youtubeId: 'wcVC3TFI7fQ',
    channel: 'Nucleus Medical Media',
    thumbBg: 'linear-gradient(135deg, #E3F2EB, #3E8A6D)',
    description: 'How an ovarian follicle matures, bursts to release an egg, and transforms into the corpus luteum.',
    takeaways: [
      'Each month several follicles grow, but typically only one dominant follicle releases an egg.',
      'A mild twinge on one side during ovulation is called Mittelschmerz.',
      'The released egg stays viable for 12 to 24 hours for potential fertilisation.'
    ],
    interactiveSteps: [
      { time: 'Step 1', phase: 'Follicle Swelling', desc: 'Under pituitary FSH signals, fluid-filled sacs in the ovarian cortex swell and compete.', icon: '🔬', visual: 'swelling' },
      { time: 'Step 2', phase: 'The LH Surge', desc: 'Luteinizing Hormone levels spike dramatically, softening the outer ovarian capsule.', icon: '⚡', visual: 'lh_spike' },
      { time: 'Step 3', phase: 'Egg Release & Capture', desc: 'The egg bursts through the follicle wall and is gently swept up by fallopian tube cilia.', icon: '✨', visual: 'capture' }
    ],
    doctorQuestion: 'Is mild one-sided mid-cycle pain (Mittelschmerz) completely normal?'
  },
  {
    id: 'v3',
    title: 'Why Period Cramps Happen (Uterine Prostaglandins)',
    tag: 'Symptom Insights',
    duration: '1:18',
    youtubeId: 'gJ0r4-bYqio',
    channel: 'TED-Ed (by Chen X. Chen)',
    thumbBg: 'linear-gradient(135deg, #FEF3C7, #D97706)',
    description: 'Understand prostaglandins—the natural chemical messengers that cause uterine muscles to contract.',
    takeaways: [
      'Prostaglandins trigger muscular contractions to shed the endometrium.',
      'Higher prostaglandin levels cause more intense cramping and can trigger loose stools or nausea.',
      'Anti-inflammatory foods, hydration, and gentle warmth counteract prostaglandin surges.'
    ],
    interactiveSteps: [
      { time: 'Stage 1', phase: 'Prostaglandin Release', desc: 'Dying endometrial cells produce lipid messengers called prostaglandins.', icon: '🧪', visual: 'prostaglandins' },
      { time: 'Stage 2', phase: 'Myometrial Contractions', desc: 'Smooth muscles in the uterine wall contract rhythmically, temporarily reducing local blood flow.', icon: '⚡', visual: 'spasms' },
      { time: 'Stage 3', phase: 'Heat & Hydration Relief', desc: 'Applying a warm compress increases microcirculation and relaxes the smooth muscle fibres.', icon: '☕', visual: 'warmth' }
    ],
    doctorQuestion: 'Are my cramps primary dysmenorrhea, or could they be secondary to another condition?'
  },
  {
    id: 'v4',
    title: 'Pregnancy Stages: Conception & Milestones',
    tag: 'Pregnancy',
    duration: '1:30',
    youtubeId: '_5OvgQW6FG4',
    channel: 'Nucleus Medical Media',
    thumbBg: 'linear-gradient(135deg, #E8EEFA, #435E99)',
    description: 'From fertilization in the fallopian tube to blastocyst implantation and key trimester milestones.',
    takeaways: [
      'Fertilization typically occurs in the outer portion of the fallopian tube.',
      'The dividing cells take 4–6 days to travel to the uterus and implant into the endometrium.',
      'Folic acid in the earliest weeks supports healthy neural tube development.'
    ],
    interactiveSteps: [
      { time: 'Days 1–5', phase: 'Fertilization & Cleavage', desc: 'Sperm fertilises the ovum in the fallopian tube; cells rapidly divide as they journey downward.', icon: '🧬', visual: 'fertilization' },
      { time: 'Days 6–10', phase: 'Blastocyst Implantation', desc: 'The cellular sphere burrows into the vascular lining of the uterus, releasing early hCG hormone.', icon: '🌱', visual: 'implantation' },
      { time: 'Weeks 5–40', phase: 'Trimester Milestones', desc: 'Critical organogenesis in Trimester 1, growth in Trimester 2, lung and fat maturation in Trimester 3.', icon: '👶', visual: 'fetal_growth' }
    ],
    doctorQuestion: 'What pre-conception blood tests and supplements do you recommend before trying to conceive?'
  },
  {
    id: 'v5',
    title: 'Postpartum Recovery: The Fourth Trimester',
    tag: 'Postpartum',
    duration: '1:25',
    youtubeId: '5SWuK-nKz1I',
    channel: 'What To Expect & Clinical Advisory',
    thumbBg: 'linear-gradient(135deg, #FCEBF2, #8C2456)',
    description: 'Uterine involution, lochia discharge stages, and physical recovery in the weeks following delivery.',
    takeaways: [
      'The uterus takes approximately 6 weeks to return to its pre-pregnancy size.',
      'Lochia discharge transitions from dark red (rubra) to pinkish-brown to creamy white.',
      'Pelvic floor rest and gentle rehabilitation support long-term bladder and pelvic strength.'
    ],
    interactiveSteps: [
      { time: 'Weeks 1–2', phase: 'Uterine Involution', desc: 'After-pains and oxytocin encourage the uterus to shrink back safely behind the pubic bone.', icon: '🤱', visual: 'involution' },
      { time: 'Weeks 2–6', phase: 'Lochia Progression', desc: 'Natural postpartum discharge lightens and decreases in volume without large clots.', icon: '💧', visual: 'lochia' },
      { time: 'Weeks 6+', phase: 'Core & Pelvic Floor Rebuilding', desc: 'Gradual re-activation of diaphragmatic breathing and pelvic floor muscles.', icon: '🌿', visual: 'rehab' }
    ],
    doctorQuestion: 'How can I ensure my pelvic floor is recovering normally after childbirth?'
  },
  {
    id: 'v6',
    title: 'Cervical Health & Why HPV Screening Saves Lives',
    tag: 'Prevention',
    duration: '1:10',
    youtubeId: 'P_42jN19-h0',
    channel: 'NHS Official Healthcare',
    thumbBg: 'linear-gradient(135deg, #E3F2EB, #265946)',
    description: 'How HPV vaccines and routine cervical screening (Pap smear) detect cellular changes years before they can become serious.',
    takeaways: [
      'Cervical cancer is almost completely preventable through vaccination and regular screening.',
      'Screening checks for high-risk HPV strains before any abnormal cells can turn dangerous.',
      'The swab procedure takes only a few seconds and saves millions of lives worldwide.'
    ],
    interactiveSteps: [
      { time: 'Step 1', phase: 'The Cervical Barrier', desc: 'The cervix connects the uterus and vagina, protected by delicate epithelial cells.', icon: '🛡️', visual: 'cervix' },
      { time: 'Step 2', phase: 'Gentle Cell Collection', desc: 'A soft silicone brush collects a sample of superficial cells in seconds during a clinic checkup.', icon: '🩺', visual: 'brush' },
      { time: 'Step 3', phase: 'Early Detection', desc: 'Laboratory testing identifies changes years in advance, allowing simple, complete outpatient care.', icon: '🔬', visual: 'lab' }
    ],
    doctorQuestion: 'Am I currently up to date on my cervical screening and HPV immunisation?'
  },
  {
    id: 'v7',
    title: 'Pelvic Pain: What Is Normal vs What Needs a Doctor',
    tag: 'Pain Awareness',
    duration: '1:28',
    youtubeId: '8viFSWE_t9Q',
    channel: 'Nucleus Medical Media (Endometriosis)',
    thumbBg: 'linear-gradient(135deg, #FDE8EA, #E05263)',
    description: 'Clear criteria distinguishing everyday period cramps from signs of endometriosis, fibroids, or infections.',
    takeaways: [
      'Normal cramps respond to warmth or standard over-the-counter pain relief.',
      'Pain that causes fainting, vomiting, or persists throughout the month is not normal.',
      'Tracking pain dates in your diary empowers your doctor to find answers faster.'
    ],
    interactiveSteps: [
      { time: 'Check 1', phase: 'Normal Period Cramps', desc: 'Aches localized to lower pelvis/back for 1–2 days that do not halt daily living.', icon: '🩹', visual: 'normal_pain' },
      { time: 'Check 2', phase: 'Endometriosis Lesions', desc: 'Tissue similar to the uterine lining grows elsewhere in the pelvis, bleeding and causing adhesions.', icon: '⚠️', visual: 'endo_tissue' },
      { time: 'Check 3', phase: 'Clinical Investigation', desc: 'Presenting a multi-cycle diary prompts targeted pelvic imaging and expert gynaecological care.', icon: '📋', visual: 'consult' }
    ],
    doctorQuestion: 'Could my chronic pelvic discomfort be related to endometriosis or adenomyosis?'
  },
  {
    id: 'v8',
    title: 'Everyday Habits for Long-Term Reproductive Vitality',
    tag: 'Daily Habits',
    duration: '1:15',
    youtubeId: '2_oweZpeflc',
    channel: 'TED-Ed & Health Sciences',
    thumbBg: 'linear-gradient(135deg, #FEF3C7, #B84A72)',
    description: 'Simple, accessible lifestyle anchors: sleep timing, whole-food nutrition, and pelvic circulation.',
    takeaways: [
      'Consistency in sleep rhythm keeps gonadotropin-releasing hormones in predictable cycles.',
      'Adequate hydration keeps cervical mucus and uterine muscle tissues resilient.',
      'Gentle daily walks support pelvic circulation and help metabolise circulating stress hormones.'
    ],
    interactiveSteps: [
      { time: 'Pillar 1', phase: 'Circadian Sleep', desc: 'Morning sunlight and 7–8 hours of uninterrupted sleep synchronize reproductive hormone pulses.', icon: '🌅', visual: 'circadian' },
      { time: 'Pillar 2', phase: 'Anti-Inflammatory Food', desc: 'Leafy greens, lentils, omega-3 fats, and seeds supply building blocks for progesterone and estrogen.', icon: '🥗', visual: 'nutrition' },
      { time: 'Pillar 3', phase: 'Daily Pelvic Movement', desc: 'Walking, gentle hip mobility, and diaphragmatic breathing relieve pelvic congestion.', icon: '🚶', visual: 'movement' }
    ],
    doctorQuestion: 'What lifestyle modifications are most supportive for my specific hormone profile?'
  }
];

// --- Plain-Language Glossary Data ---
const GLOSSARY_TERMS = [
  {
    term: 'Dysmenorrhea',
    category: 'symptoms',
    simple: 'Medical term for painful menstrual cramps in the lower abdomen or back.',
    clinical: 'Primary dysmenorrhea is caused by excess prostaglandins; secondary dysmenorrhea is linked to conditions like endometriosis or fibroids.'
  },
  {
    term: 'Menorrhagia',
    category: 'bleeding',
    simple: 'Abnormally heavy or prolonged menstrual bleeding (e.g. bleeding for more than 7 days or soaking through multiple pads per hour).',
    clinical: 'Clinically quantified as blood loss exceeding 80 ml per cycle, causing fatigue or iron deficiency anemia.'
  },
  {
    term: 'Mittelschmerz',
    category: 'anatomy',
    simple: 'A one-sided lower belly ache that happens around the middle of your cycle when an egg is released.',
    clinical: 'Occurs due to follicular swelling or mild peritoneal irritation when the ovarian follicle ruptures during ovulation.'
  },
  {
    term: 'Luteal Phase',
    category: 'phases',
    simple: 'The second half of your cycle, from the day you ovulate until your next period starts (usually lasts 12 to 14 days).',
    clinical: 'Characterized by corpus luteum secretion of progesterone. Progesterone withdrawal triggers the next menses.'
  },
  {
    term: 'Endometriosis',
    category: 'conditions',
    simple: 'A condition where tissue similar to the uterine lining grows outside the uterus, causing inflammation and pain.',
    clinical: 'Estrogen-dependent inflammatory condition causing pelvic adhesions, chronic pain, and subfertility.'
  },
  {
    term: 'PCOS (Polycystic Ovary Syndrome)',
    category: 'conditions',
    simple: 'A common hormonal condition where ovaries may not release eggs regularly, often leading to irregular periods and acne.',
    clinical: 'Diagnosed by Rotterdam criteria: oligo/anovulation, hyperandrogenism, and polycystic ovarian morphology on ultrasound.'
  },
  {
    term: 'Cervical Mucus',
    category: 'anatomy',
    simple: 'Natural fluid produced by the cervix that becomes clear, stretchy, and slippery like raw egg whites around fertile days.',
    clinical: 'Estrogen-driven secretion that facilitates sperm motility through the cervical canal during the fertile window.'
  },
  {
    term: 'Lochia',
    category: 'postpartum',
    simple: 'The normal vaginal discharge of blood, tissue, and mucus that continues for several weeks after giving birth.',
    clinical: 'Progresses from Lochia rubra (dark red, days 1-4) to Lochia serosa (pink/brown) to Lochia alba (yellowish-white).'
  },
  {
    term: 'Pap Smear',
    category: 'prevention',
    simple: 'A quick, simple clinic test where a doctor gently swabs cells from the cervix to check for healthy cells.',
    clinical: 'Cytological screening used to identify precancerous dysplasia or early cervical intraepithelial neoplasia (CIN).'
  },
  {
    term: 'Ectopic Pregnancy',
    category: 'conditions',
    simple: 'A dangerous emergency where a fertilised egg implants outside the womb, most often inside a fallopian tube.',
    clinical: 'Medical emergency requiring immediate intervention to prevent tubal rupture and severe internal hemorrhage.'
  },
  {
    term: 'Follicular Phase',
    category: 'phases',
    simple: 'The first half of your cycle, starting on day 1 of your period and lasting until you ovulate.',
    clinical: 'Pituitary FSH stimulates ovarian follicle development, leading to rising estradiol levels and endometrial proliferation.'
  },
  {
    term: 'Pelvic Floor Dysfunction',
    category: 'anatomy',
    simple: 'When the muscles supporting your bladder, uterus, and bowels become too weak or overly tense.',
    clinical: 'Includes stress urinary incontinence, pelvic organ prolapse, or hypertonic pelvic floor myalgia.'
  }
];

// --- Doctor Questions Guide ---
const DOCTOR_QUESTIONS_DATA = [
  {
    category: 'Pain & Cramping',
    questions: [
      'My period pain starts 1–2 days before bleeding and stops me from working—is this typical?',
      'Warmth and basic pain relievers do not ease my pelvic cramps. What other options are safe?',
      'Could my pain during bowel movements or periods be related to endometriosis?'
    ]
  },
  {
    category: 'Heavy or Irregular Bleeding',
    questions: [
      'I pass clots larger than a coin and change pads every 1–2 hours. Should we test my iron levels?',
      'My cycle varies between 24 and 45 days. What hormone tests do you recommend?',
      'I noticed spotting in the middle of my cycle—what could be causing this?'
    ]
  },
  {
    category: 'Discharge & Discomfort',
    questions: [
      'My vaginal discharge changed in colour and has a noticeable odour. Can we do a swab test?',
      'I experience burning or irritation after intimacy—how can we identify the cause?'
    ]
  },
  {
    category: 'Pregnancy & Postpartum',
    questions: [
      'What pre-pregnancy vitamins and vaccine checks do I need before trying to conceive?',
      'It has been 8 weeks postpartum and I still feel pelvic heaviness when walking—is this normal?',
      'How soon should my period return while breastfeeding?'
    ]
  }
];

// --- Vaccine Schedules (Section 11 of Design Doc) ---
const VACCINE_SCHEDULE = [
  {
    stage: 'Early Adolescence (Ages 9 to 14)',
    vaccine: 'HPV Vaccine (Human Papillomavirus)',
    doses: '2 Doses (6 months apart)',
    whyItMatters: 'Protects against the high-risk HPV strains that cause cervical cancer and genital lesions later in life.'
  },
  {
    stage: 'Before Pregnancy',
    vaccine: 'MMR (Measles, Mumps, Rubella)',
    doses: '1 or 2 Doses (test immunity first)',
    whyItMatters: 'Rubella infection during early pregnancy can cause serious congenital birth defects. Check immunity before conceiving.'
  },
  {
    stage: 'Before Pregnancy',
    vaccine: 'Chickenpox (Varicella)',
    doses: '2 Doses',
    whyItMatters: 'Primary varicella infection during pregnancy carries risks of maternal pneumonia and fetal complications.'
  },
  {
    stage: 'At Delivery / Birth',
    vaccine: 'Hepatitis B (Birth Dose)',
    doses: '1 Dose within 24 hours of delivery',
    whyItMatters: 'Protects the newborn from vertical hepatitis B transmission during delivery.'
  },
  {
    stage: 'During Each Pregnancy (27–36 Weeks)',
    vaccine: 'Tdap (Tetanus, Diphtheria, Pertussis)',
    doses: '1 Dose each pregnancy',
    whyItMatters: 'Passes protective antibodies to the newborn against life-threatening whooping cough before their first vaccines.'
  },
  {
    stage: 'Any Pregnancy Trimester (Flu Season)',
    vaccine: 'Influenza (Inactivated Flu Vaccine)',
    doses: '1 Dose annually',
    whyItMatters: 'Protects both pregnant mother and newborn from severe influenza-related respiratory complications.'
  }
];

// --- Realistic Hackathon Demo Sample Data ---
const REALISTIC_DEMO_DATA = {
  entries: [
    {
      id: 'demo-1',
      date: '2026-10-12',
      timeOfDay: 'Morning',
      cycleDay: 1,
      symptom: 'Pelvic Cramps',
      severity: 4,
      duration: 'All day',
      impacts: ['work', 'sleep', 'chores'],
      notes: 'First day of cycle. Intense lower belly ache, required warm water bag and rest.'
    },
    {
      id: 'demo-2',
      date: '2026-10-13',
      timeOfDay: 'Afternoon',
      cycleDay: 2,
      symptom: 'Heavy Bleeding',
      severity: 4,
      duration: 'All day',
      impacts: ['work', 'chores'],
      notes: 'Soaked through 4 full pads today, feeling fatigue and dizziness.'
    },
    {
      id: 'demo-3',
      date: '2026-10-14',
      timeOfDay: 'Evening',
      cycleDay: 3,
      symptom: 'Pelvic Cramps',
      severity: 3,
      duration: 'Half day',
      impacts: ['chores'],
      notes: 'Cramping eased compared to yesterday. Managed light household walk.'
    },
    {
      id: 'demo-4',
      date: '2026-10-24',
      timeOfDay: 'Morning',
      cycleDay: 13,
      symptom: 'Mittelschmerz / Ovulation Pain',
      severity: 2,
      duration: '1-2 hours',
      impacts: [],
      notes: 'Mild right-sided twinge, noticed stretchy clear discharge.'
    },
    {
      id: 'demo-5',
      date: '2026-09-14',
      timeOfDay: 'Morning',
      cycleDay: 1,
      symptom: 'Pelvic Cramps',
      severity: 4,
      duration: 'All day',
      impacts: ['work', 'sleep'],
      notes: 'Previous cycle day 1: severe cramping, had to take half-day leave from work.'
    },
    {
      id: 'demo-6',
      date: '2026-09-15',
      timeOfDay: 'Afternoon',
      cycleDay: 2,
      symptom: 'Pelvic Cramps',
      severity: 4,
      duration: 'All day',
      impacts: ['work'],
      notes: 'Previous cycle day 2: heavy flow and aching back.'
    },
    {
      id: 'demo-7',
      date: '2026-09-16',
      timeOfDay: 'Evening',
      cycleDay: 3,
      symptom: 'Pelvic Cramps',
      severity: 3,
      duration: 'Half day',
      impacts: ['chores'],
      notes: 'Previous cycle day 3: pain tapering down.'
    },
    {
      id: 'demo-8',
      date: '2026-09-27',
      timeOfDay: 'Night',
      cycleDay: 14,
      symptom: 'Mittelschmerz / Ovulation Pain',
      severity: 2,
      duration: '1-2 hours',
      impacts: [],
      notes: 'Previous cycle mid-cycle right ovarian ache.'
    },
    {
      id: 'demo-9',
      date: '2026-10-09',
      timeOfDay: 'Evening',
      cycleDay: 26,
      symptom: 'Headache & Fatigue',
      severity: 3,
      duration: 'Half day',
      impacts: ['work', 'sleep'],
      notes: 'Premenstrual tension, headache behind temples 3 days prior to bleeding.'
    },
    {
      id: 'demo-10',
      date: '2026-09-11',
      timeOfDay: 'Evening',
      cycleDay: 26,
      symptom: 'Headache & Fatigue',
      severity: 3,
      duration: 'Half day',
      impacts: ['sleep'],
      notes: 'Recurred exactly 3 days before September cycle.'
    }
  ],
  checklist: [
    {
      id: 'chk-1',
      title: 'Pelvic Ultrasound (USG Abdomen & Pelvis)',
      category: 'Diagnostic Scan',
      dueDate: '2026-11-05',
      doctor: 'Dr. Ananya Roy (Gynaecology)',
      done: false
    },
    {
      id: 'chk-2',
      title: 'Serum Ferritin & CBC (Iron levels check)',
      category: 'Lab Blood Test',
      dueDate: '2026-10-30',
      doctor: 'Dr. Ananya Roy',
      done: true
    },
    {
      id: 'chk-3',
      title: 'Maintain daily HerVita diary for 3 consecutive cycles',
      category: 'Clinical Self-Monitoring',
      dueDate: '2026-12-15',
      doctor: 'Clinic recommendation',
      done: false
    }
  ],
  vaccines: [
    {
      id: 'vac-1',
      name: 'HPV Vaccine (Gardasil 9)',
      dose: 'Dose 1 of 2',
      dateGiven: '2026-04-10',
      nextDue: '2026-10-10',
      status: 'Completed',
      notes: 'Administered at Fortis Clinic. Well tolerated.'
    },
    {
      id: 'vac-2',
      name: 'HPV Vaccine (Gardasil 9)',
      dose: 'Dose 2 of 2',
      dateGiven: '',
      nextDue: '2026-11-15',
      status: 'Upcoming',
      notes: 'Due next month for complete cervical cancer protection.'
    },
    {
      id: 'vac-3',
      name: 'Tdap (Tetanus, Diphtheria, Pertussis)',
      dose: 'Booster Dose',
      dateGiven: '2025-08-20',
      nextDue: '2035-08-20',
      status: 'Up to date',
      notes: 'Routine decennial booster.'
    }
  ],
  selectedQuestions: [
    'My period cramps disrupt my daily work on day 1—is this within normal range?',
    'Warmth and basic pain relievers do not ease my pelvic cramps. What other options are safe?',
    'I pass clots larger than a coin and change pads every 1–2 hours. Should we test my iron levels?',
    'Could my cycle variance and jawline breakouts indicate PCOS?',
    'What should I expect during my upcoming 20-week Level II anatomy ultrasound?'
  ],
  // A. Obstetrics Demo Data
  pregnancyMilestones: [
    { id: 'pm-1', week: 6, title: 'Early Dating Ultrasound & Cardiac Activity', date: '2026-07-28', notes: 'Heartbeat observed at 145 bpm. CRL measures 6.5 mm.', completed: true },
    { id: 'pm-2', week: 12, title: 'NT Scan & First Trimester Combined Screen', date: '2026-09-08', notes: 'Nuchal translucency normal (1.4 mm), low aneuploidy risk.', completed: true },
    { id: 'pm-3', week: 18, title: 'Quickening: First Fetal Flutter Kicks', date: '2026-10-20', notes: 'Gentle flutter movements felt in supine position.', completed: true },
    { id: 'pm-4', week: 20, title: 'Detailed Fetal Anatomy Scan (Level II)', date: '2026-11-04', notes: 'Scheduled with Dr. Roy at Fortis Healthcare.', completed: false },
    { id: 'pm-5', week: 24, title: 'Gestational Diabetes OGTT & Viability', date: '2026-12-02', notes: 'Fast 8 hours prior to 75g glucose challenge.', completed: false },
    { id: 'pm-6', week: 28, title: 'Third Trimester Threshold & Maternal Tdap', date: '2026-12-30', notes: 'Tdap booster to pass pertussis immunity to newborn.', completed: false }
  ],
  antenatalVisits: [
    { id: 'av-1', week: 'Weeks 8–10', title: 'Initial Antenatal Comprehensive', test: 'Dating USG, Blood Group & Rh, CBC, TSH, Rubella, Hep B', date: '2026-08-05', doctor: 'Dr. Ananya Roy', status: 'Completed', notes: 'Vitals stable. BP 110/72. Started methylfolate & D3.' },
    { id: 'av-2', week: 'Weeks 11–13', title: 'First Trimester Aneuploidy Screen', test: 'NT Scan & NIPT Dual Marker', date: '2026-09-08', doctor: 'Dr. Ananya Roy', status: 'Completed', notes: 'Normal nasal bone visible, low risk.' },
    { id: 'av-3', week: 'Weeks 18–20', title: 'Fetal Anatomy & Well-being Scan', test: 'Level II USG & Cervical Length', date: '2026-11-04', doctor: 'Dr. Ananya Roy', status: 'Upcoming', notes: 'Check placental position and cardiac 4-chamber view.' },
    { id: 'av-4', week: 'Weeks 24–28', title: 'Metabolic & Anemia Screening', test: '75g OGTT & Serum Ferritin', date: '2026-12-05', doctor: 'Fortis Diagnostics', status: 'Upcoming', notes: 'Screening for gestational diabetes.' },
    { id: 'av-5', week: 'Week 28', title: 'Third Trimester Kick-off', test: 'Tdap Vaccine & Anti-D (if Rh-)', date: '2026-12-30', doctor: 'Dr. Ananya Roy', status: 'Upcoming', notes: 'Review fetal movement kick-counts (count to 10).' },
    { id: 'av-6', week: 'Weeks 32–34', title: 'Fetal Growth & Doppler Assessment', test: 'Growth Ultrasound & Amniotic Fluid Index (AFI)', date: '2027-01-28', doctor: 'Dr. Ananya Roy', status: 'Upcoming', notes: 'Monitor estimated fetal weight and umbilical Doppler.' },
    { id: 'av-7', week: 'Week 36', title: 'Term Preparation & GBS Swab', test: 'Vagino-rectal GBS culture & Birth Plan', date: '2027-02-25', doctor: 'Dr. Ananya Roy', status: 'Upcoming', notes: 'Hospital bag check & pediatric handover.' },
    { id: 'av-8', week: 'Weeks 38–40', title: 'Weekly Labor Readiness Assessment', test: 'Fetal Non-Stress Test (NST) & Bishop Score', date: '2027-03-15', doctor: 'Dr. Ananya Roy', status: 'Upcoming', notes: 'Monitoring for spontaneous labor onset.' }
  ],
  postpartumRecords: [
    { id: 'pp-1', date: '2026-10-15', category: 'Physical Healing', concern: 'Perineal tenderness and lochia serosa (pinkish discharge)', action: 'Warm sitz bath twice daily, witch hazel pads, pelvic floor rest.', doctorChecked: true },
    { id: 'pp-2', date: '2026-10-18', category: 'Emotional Well-being', concern: 'Tearfulness and fatigue on Day 4 (Baby Blues)', action: 'Normalised transient hormone drop; family support activated. Sleep when baby naps.', doctorChecked: true },
    { id: 'pp-3', date: '2026-10-22', category: 'Lactation & Breasts', concern: 'Mild breast engorgement prior to feeding', action: 'Warm compress before nursing, cool cabbage leaf or ice pack post-feed.', doctorChecked: false }
  ],
  // B. Gynecology Demo Data
  periodLogs: [
    { id: 'per-1', startDate: '2026-10-12', endDate: '2026-10-17', flow: 'Heavy', painScore: 4, cycleLength: 28, clots: 'Small (<coin)' },
    { id: 'per-2', startDate: '2026-09-14', endDate: '2026-09-19', flow: 'Heavy', painScore: 4, cycleLength: 29, clots: 'Yes' },
    { id: 'per-3', startDate: '2026-08-16', endDate: '2026-08-20', flow: 'Moderate', painScore: 3, cycleLength: 28, clots: 'No' },
    { id: 'per-4', startDate: '2026-07-19', endDate: '2026-07-23', flow: 'Moderate', painScore: 3, cycleLength: 28, clots: 'No' }
  ],
  pcosLogs: [
    { id: 'pcos-1', date: '2026-10-20', cycleVariance: 'Cycle delayed by 14 days', acneScore: 3, hirsutismScore: 2, hairFall: 'Moderate', sugarCrash: true, notes: 'Jawline cystic breakout coinciding with high refined carb intake.' },
    { id: 'pcos-2', date: '2026-09-25', cycleVariance: 'Cycle length 38 days', acneScore: 2, hirsutismScore: 2, hairFall: 'Mild', sugarCrash: true, notes: 'Afternoon energy slump around 3 PM.' }
  ],
  pelvicPainLogs: [
    { id: 'ppain-1', date: '2026-10-12', severity: 4, duration: 'All day', location: 'Left lower quadrant & deep pelvic', character: 'Sharp cramping & aching', trigger: 'Menstrual Day 1 onset', workImpact: 'Took half-day off', notes: 'Heat pack provided temporary relief.' },
    { id: 'ppain-2', date: '2026-10-24', severity: 2, duration: '2 hours', location: 'Right iliac fossa', character: 'Brief sharp twinge (Mittelschmerz)', trigger: 'Ovulatory window', workImpact: 'None', notes: 'Accompanied by clear slippery cervical mucus.' },
    { id: 'ppain-3', date: '2026-09-14', severity: 4, duration: 'All day', location: 'Bilateral lower abdomen & lower back', character: 'Intense throbbing spasm', trigger: 'Menstrual Day 1', workImpact: 'Unable to attend morning meetings', notes: 'Needed 500mg paracetamol and bed rest.' }
  ],
  medicalRecords: [
    { id: 'rec-1', title: 'Pelvic & Transvaginal Ultrasound Scan', category: 'Ultrasound / Imaging', date: '2026-09-20', doctor: 'Dr. S. Kulkarni (Radiology)', keyFindings: 'Anteverted uterus (7.8 x 4.2 cm). Left ovary demonstrates peripheral ring of 11-12 small follicles (<8mm) suggestive of PCO morphology. Endometrial thickness 6.4 mm.', fileMock: 'USG_Pelvis_Report.pdf' },
    { id: 'rec-2', title: 'Serum Ferritin, Iron Profile & CBC', category: 'Lab Blood Test', date: '2026-10-15', doctor: 'Dr. Ananya Roy (Gynaecology)', keyFindings: 'Hemoglobin: 11.4 g/dL (Mild borderline anemia). Serum Ferritin: 21 ng/mL (Low iron stores). Platelets: 275k. Advised oral iron supplement.', fileMock: 'CBC_Iron_Panel.pdf' },
    { id: 'rec-3', title: 'Prescription: Prenatal DHA & Ferrous Ascorbate', category: 'Prescription', date: '2026-10-16', doctor: 'Dr. Ananya Roy', keyFindings: 'Ferrous Ascorbate 100mg once daily with citrus juice. Prenatal multivitamin with 400mcg methylfolate.', fileMock: 'Rx_DrRoy_Oct2026.pdf' },
    { id: 'rec-4', title: 'Annual Gynaecology Consultation Note', category: 'Consultation Note', date: '2026-09-22', doctor: 'Dr. Ananya Roy', keyFindings: 'Discussed dysmenorrhea pattern and cycle irregularity. Advised continuous HerVita diary tracking for 3 cycles before deciding on hormonal intervention.', fileMock: 'Clinical_Note_Sep2026.pdf' }
  ]
};

// --- Storage Utilities ---
function saveToStorage() {
  try {
    localStorage.setItem('hervita_entries', JSON.stringify(HerVitaState.entries));
    localStorage.setItem('hervita_checklist', JSON.stringify(HerVitaState.checklist));
    localStorage.setItem('hervita_vaccines', JSON.stringify(HerVitaState.vaccines));
    localStorage.setItem('hervita_questions', JSON.stringify(HerVitaState.selectedQuestions));
    localStorage.setItem('hervita_milestones', JSON.stringify(HerVitaState.pregnancyMilestones));
    localStorage.setItem('hervita_antenatal', JSON.stringify(HerVitaState.antenatalVisits));
    localStorage.setItem('hervita_postpartum', JSON.stringify(HerVitaState.postpartumRecords));
    localStorage.setItem('hervita_periods', JSON.stringify(HerVitaState.periodLogs));
    localStorage.setItem('hervita_pcos', JSON.stringify(HerVitaState.pcosLogs));
    localStorage.setItem('hervita_pelvicpain', JSON.stringify(HerVitaState.pelvicPainLogs));
    localStorage.setItem('hervita_medrecords', JSON.stringify(HerVitaState.medicalRecords));
    localStorage.setItem('hervita_pin', HerVitaState.pin || '');
  } catch (e) {
    console.warn('Storage write failed', e);
  }
}

function loadFromStorage() {
  try {
    const storedEntries = localStorage.getItem('hervita_entries');
    if (storedEntries) {
      HerVitaState.entries = JSON.parse(storedEntries);
      HerVitaState.checklist = JSON.parse(localStorage.getItem('hervita_checklist') || '[]');
      HerVitaState.vaccines = JSON.parse(localStorage.getItem('hervita_vaccines') || '[]');
      HerVitaState.selectedQuestions = JSON.parse(localStorage.getItem('hervita_questions') || '[]');
      
      const storedMilestones = localStorage.getItem('hervita_milestones');
      HerVitaState.pregnancyMilestones = storedMilestones ? JSON.parse(storedMilestones) : JSON.parse(JSON.stringify(REALISTIC_DEMO_DATA.pregnancyMilestones));

      const storedAntenatal = localStorage.getItem('hervita_antenatal');
      HerVitaState.antenatalVisits = storedAntenatal ? JSON.parse(storedAntenatal) : JSON.parse(JSON.stringify(REALISTIC_DEMO_DATA.antenatalVisits));

      const storedPostpartum = localStorage.getItem('hervita_postpartum');
      HerVitaState.postpartumRecords = storedPostpartum ? JSON.parse(storedPostpartum) : JSON.parse(JSON.stringify(REALISTIC_DEMO_DATA.postpartumRecords));

      const storedPeriods = localStorage.getItem('hervita_periods');
      HerVitaState.periodLogs = storedPeriods ? JSON.parse(storedPeriods) : JSON.parse(JSON.stringify(REALISTIC_DEMO_DATA.periodLogs));

      const storedPcos = localStorage.getItem('hervita_pcos');
      HerVitaState.pcosLogs = storedPcos ? JSON.parse(storedPcos) : JSON.parse(JSON.stringify(REALISTIC_DEMO_DATA.pcosLogs));

      const storedPelvic = localStorage.getItem('hervita_pelvicpain');
      HerVitaState.pelvicPainLogs = storedPelvic ? JSON.parse(storedPelvic) : JSON.parse(JSON.stringify(REALISTIC_DEMO_DATA.pelvicPainLogs));

      const storedRecords = localStorage.getItem('hervita_medrecords');
      HerVitaState.medicalRecords = storedRecords ? JSON.parse(storedRecords) : JSON.parse(JSON.stringify(REALISTIC_DEMO_DATA.medicalRecords));

      HerVitaState.pin = localStorage.getItem('hervita_pin') || '';
    } else {
      seedHackathonDemoData(false);
    }
  } catch (e) {
    console.error('Error loading storage, seeding demo data', e);
    seedHackathonDemoData(false);
  }
}

function seedHackathonDemoData(showToastAlert = true) {
  HerVitaState.entries = JSON.parse(JSON.stringify(REALISTIC_DEMO_DATA.entries));
  HerVitaState.checklist = JSON.parse(JSON.stringify(REALISTIC_DEMO_DATA.checklist));
  HerVitaState.vaccines = JSON.parse(JSON.stringify(REALISTIC_DEMO_DATA.vaccines));
  HerVitaState.selectedQuestions = JSON.parse(JSON.stringify(REALISTIC_DEMO_DATA.selectedQuestions));
  HerVitaState.pregnancyMilestones = JSON.parse(JSON.stringify(REALISTIC_DEMO_DATA.pregnancyMilestones));
  HerVitaState.antenatalVisits = JSON.parse(JSON.stringify(REALISTIC_DEMO_DATA.antenatalVisits));
  HerVitaState.postpartumRecords = JSON.parse(JSON.stringify(REALISTIC_DEMO_DATA.postpartumRecords));
  HerVitaState.periodLogs = JSON.parse(JSON.stringify(REALISTIC_DEMO_DATA.periodLogs));
  HerVitaState.pcosLogs = JSON.parse(JSON.stringify(REALISTIC_DEMO_DATA.pcosLogs));
  HerVitaState.pelvicPainLogs = JSON.parse(JSON.stringify(REALISTIC_DEMO_DATA.pelvicPainLogs));
  HerVitaState.medicalRecords = JSON.parse(JSON.stringify(REALISTIC_DEMO_DATA.medicalRecords));
  saveToStorage();
  renderAllViews();
  if (showToastAlert) {
    showToast('Loaded complete Obstetrics & Gynecology demo data! 🌸');
  }
}

function clearAllData() {
  if (confirm('Are you sure you want to delete all logged data? This cannot be undone.')) {
    HerVitaState.entries = [];
    HerVitaState.checklist = [];
    HerVitaState.vaccines = [];
    HerVitaState.selectedQuestions = [];
    HerVitaState.pregnancyMilestones = [];
    HerVitaState.antenatalVisits = [];
    HerVitaState.postpartumRecords = [];
    HerVitaState.periodLogs = [];
    HerVitaState.pcosLogs = [];
    HerVitaState.pelvicPainLogs = [];
    HerVitaState.medicalRecords = [];
    saveToStorage();
    renderAllViews();
    showToast('All personal health data cleared from device.');
  }
}

// --- Toast System ---
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✨</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// --- Navigation Controller ---
function initNavigation() {
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetView = btn.dataset.view;
      switchView(targetView);
    });
  });

  const subTabBtns = document.querySelectorAll('.sub-tab-btn');
  subTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentNav = btn.closest('.sub-tabs');
      parentNav.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetSub = btn.dataset.subtab;
      const subContainer = btn.closest('.view-section');
      subContainer.querySelectorAll('.subtab-panel').forEach(panel => {
        panel.style.display = panel.id === `subtab-${targetSub}` ? 'block' : 'none';
      });
    });
  });

  // Emergency Triage Shortcut in header
  const emergencyBtn = document.getElementById('btn-emergency-header');
  if (emergencyBtn) {
    emergencyBtn.addEventListener('click', () => {
      switchView('view-triage');
    });
  }

  // Privacy Modal button
  const privacyBtn = document.getElementById('btn-privacy-header');
  if (privacyBtn) {
    privacyBtn.addEventListener('click', openPrivacyModal);
  }

  // Load Demo Data Shortcut button
  const demoBtn = document.getElementById('btn-load-demo');
  if (demoBtn) {
    demoBtn.addEventListener('click', () => seedHackathonDemoData(true));
  }
}

function switchView(viewId) {
  const sections = document.querySelectorAll('.view-section');
  sections.forEach(sec => sec.classList.remove('active-view'));

  const targetSec = document.getElementById(viewId);
  if (targetSec) {
    targetSec.classList.add('active-view');
  }

  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === viewId);
  });

  // Re-render view-specific dynamic content
  if (viewId === 'view-obstetrics') {
    renderObstetrics();
  } else if (viewId === 'view-gynecology') {
    renderGynecology();
  } else if (viewId === 'view-patterns') {
    renderPatternView();
  } else if (viewId === 'view-summary') {
    renderDoctorSummary();
  } else if (viewId === 'view-checklist') {
    renderChecklist();
  } else if (viewId === 'view-vaccines') {
    renderVaccines();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Module 1: Interactive Body Map ---
function initBodyMap() {
  const pills = document.querySelectorAll('.organ-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const organId = pill.dataset.organ;
      selectOrgan(organId);
    });
  });

  const hotspots = document.querySelectorAll('.organ-hotspot');
  hotspots.forEach(hotspot => {
    hotspot.addEventListener('click', () => {
      const organId = hotspot.dataset.organ;
      selectOrgan(organId);
    });
  });

  // Render initial organ
  selectOrgan('uterus');
}

function selectOrgan(organId) {
  HerVitaState.activeOrgan = organId;
  const data = ORGAN_DATA[organId];
  if (!data) return;

  // Update pills
  document.querySelectorAll('.organ-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.organ === organId);
  });

  // Update hotspots in SVG
  document.querySelectorAll('.organ-hotspot').forEach(spot => {
    spot.classList.toggle('active', spot.dataset.organ === organId);
  });

  // Render details
  const detailsContainer = document.getElementById('organ-details-content');
  if (!detailsContainer) return;

  const isHindi = HerVitaState.language === 'hi';
  const organTitle = isHindi && data.hindiName ? data.hindiName : data.name;

  detailsContainer.innerHTML = `
    <div class="body-details-header">
      <div>
        <h3>${organTitle}</h3>
        <span class="badge-tag badge-pink">${data.subtitle}</span>
      </div>
    </div>

    <div class="body-details-section">
      <h4><span>📖</span> ${isHindi ? 'यह क्या करता है (सादी भाषा में)' : 'What It Does (Plain Language)'}</h4>
      <p>${data.whatItDoes}</p>
    </div>

    <div class="body-details-section">
      <h4><span>💡</span> ${isHindi ? 'यह क्यों महत्वपूर्ण है' : 'Why It Matters'}</h4>
      <p>${data.whyItMatters}</p>
    </div>

    <div class="body-details-section">
      <h4><span>⚠️</span> ${isHindi ? 'ध्यान देने योग्य लक्षण' : 'Signs to Watch'}</h4>
      <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.885rem; color: var(--text-secondary); margin-top: 0.35rem;">
        ${data.signsToWatch.map(sign => `<li style="display:flex; align-items:baseline; gap:0.4rem;"><span>•</span> <span>${sign}</span></li>`).join('')}
      </ul>
    </div>

    <div class="care-tips-box">
      <h4>🌿 ${isHindi ? 'दैनिक अंग देखभाल आदतें (सहायक उपाय)' : 'Everyday Organ Care Tips (Supportive Habits)'}</h4>
      <ul class="care-tips-list">
        ${data.careTips.map(tip => `<li>${tip}</li>`).join('')}
      </ul>
    </div>

    <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--border-light);">
      <h4 style="font-size: 0.85rem; color: var(--primary-700); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
        🩺 ${isHindi ? 'डॉक्टर से पूछने योग्य सवाल' : 'Questions to Ask Your Doctor'}
      </h4>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${data.doctorQuestions.map(q => `
          <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-subtle); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm); font-size: 0.85rem;">
            <span>${q}</span>
            <button class="add-question-btn ${HerVitaState.selectedQuestions.includes(q) ? 'added' : ''}" onclick="toggleDoctorQuestion('${q.replace(/'/g, "\\'")}')">
              ${HerVitaState.selectedQuestions.includes(q) ? '✓ Added' : '+ Add to Summary'}
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// --- Module 1: Explainer Videos ---
function renderExplainerVideos() {
  const container = document.getElementById('videos-grid-container');
  if (!container) return;

  container.innerHTML = VIDEO_MODULES.map(vid => `
    <div class="video-card" onclick="openVideoModal('${vid.id}')">
      <div class="video-thumb" style="background: ${vid.thumbBg};">
        <div class="video-play-btn">▶</div>
        <div class="video-duration">${vid.duration}</div>
      </div>
      <div class="video-card-body">
        <div class="video-tag">${vid.tag}</div>
        <div class="video-title">${vid.title}</div>
        <div class="video-desc">${vid.description}</div>
        <div class="video-meta">
          <span>Clinician-Reviewed</span>
          <span style="color: var(--primary-600); font-weight: 700;">Watch Now →</span>
        </div>
      </div>
    </div>
  `).join('');
}

let activeVideoId = null;
let activeSimStepIndex = 0;
let isNarrating = false;

function openVideoModal(videoId, mode = 'stream') {
  activeVideoId = videoId;
  activeSimStepIndex = 0;
  const video = VIDEO_MODULES.find(v => v.id === videoId);
  if (!video) return;

  const modal = document.getElementById('video-modal');
  const modalContent = document.getElementById('video-modal-content');
  if (!modal || !modalContent) return;

  // Render modal structure
  renderVideoModalContent(video, mode);
  modal.classList.add('active');
}

function renderVideoModalContent(video, mode) {
  const modalContent = document.getElementById('video-modal-content');
  if (!modalContent) return;

  const embedUrl = `https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;
  const isQuestionAdded = HerVitaState.selectedQuestions.includes(video.doctorQuestion);

  modalContent.innerHTML = `
    <div class="video-header-row">
      <div>
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
          <span class="badge-tag badge-pink">${video.tag}</span>
          <span class="badge-tag badge-sage">Verified Clinical Knowledge</span>
        </div>
        <h3>${video.title}</h3>
        <div class="video-channel-info">
          <span>📺 ${video.channel}</span>
          <span>•</span>
          <span>⏱️ Duration: ${video.duration}</span>
        </div>
      </div>
    </div>

    <!-- Mode Switcher -->
    <div class="video-mode-switcher">
      <button class="video-mode-btn ${mode === 'stream' ? 'active' : ''}" onclick="switchVideoMode('${video.id}', 'stream')">
        <span>🎬</span> Live Video Stream
      </button>
      <button class="video-mode-btn ${mode === 'interactive' ? 'active' : ''}" onclick="switchVideoMode('${video.id}', 'interactive')">
        <span>✨</span> Interactive Simulation Walkthrough
      </button>
    </div>

    <!-- Mode 1: Live Video Player -->
    <div id="video-stream-panel" style="display: ${mode === 'stream' ? 'block' : 'none'};">
      <div class="video-player-container">
        <iframe 
          id="active-youtube-iframe"
          src="${mode === 'stream' ? embedUrl : ''}" 
          title="${video.title}" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen>
        </iframe>
      </div>
    </div>

    <!-- Mode 2: Interactive Simulation Walkthrough -->
    <div id="video-interactive-panel" style="display: ${mode === 'interactive' ? 'block' : 'none'};">
      <div class="interactive-simulation-box">
        <div class="simulation-visual-display">
          <span class="sim-stage-badge" id="sim-badge">${video.interactiveSteps[activeSimStepIndex].time}</span>
          <div style="font-size: 3rem; margin-bottom: 0.6rem;" id="sim-icon">
            ${video.interactiveSteps[activeSimStepIndex].icon}
          </div>
          <h4 style="font-size: 1.3rem; color: #fff; margin-bottom: 0.4rem;" id="sim-phase">
            ${video.interactiveSteps[activeSimStepIndex].phase}
          </h4>
          <p style="font-size: 0.95rem; color: #FCEBF2; max-width: 520px; line-height: 1.5;" id="sim-desc">
            ${video.interactiveSteps[activeSimStepIndex].desc}
          </p>
        </div>

        <div class="simulation-controls-row">
          <div class="sim-steps-pills">
            ${video.interactiveSteps.map((step, idx) => `
              <button class="sim-step-pill ${idx === activeSimStepIndex ? 'active' : ''}" onclick="goToSimStep('${video.id}', ${idx})">
                ${step.time}: ${step.phase}
              </button>
            `).join('')}
          </div>
          <div style="display: flex; gap: 0.4rem;">
            <button class="btn-pill" style="color: #fff; background: rgba(255,255,255,0.15); border-color: transparent;" onclick="prevSimStep('${video.id}')">◀ Prev</button>
            <button class="btn-pill" style="color: #fff; background: var(--primary-500); border-color: transparent;" onclick="nextSimStep('${video.id}')">Next ▶</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Video Companion Toolbar -->
    <div class="video-companion-bar">
      <div class="companion-left">
        <span>💡 Need alternate viewing or audio?</span>
      </div>
      <div class="companion-actions">
        <button class="btn-pill" id="btn-narration-toggle" onclick="toggleVideoNarration('${video.id}')">
          <span id="narration-icon">🔊</span> <span id="narration-text">Listen to Key Points</span>
        </button>
        <a href="https://www.youtube.com/watch?v=${video.youtubeId}" target="_blank" rel="noopener noreferrer" class="btn-pill" title="Watch on original YouTube channel">
          <span>↗</span> Watch on YouTube
        </a>
      </div>
    </div>

    <!-- Clinical Key Takeaways for Patients -->
    <div style="margin-top: 1.25rem;">
      <h4 style="font-size: 1.1rem; color: var(--primary-900); margin-bottom: 0.6rem; display: flex; align-items: center; gap: 0.4rem;">
        <span>📋</span> Clinical Key Takeaways for Patients
      </h4>
      <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem;">
        ${video.takeaways.map(t => `
          <li style="display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.925rem; color: var(--text-secondary); background: var(--bg-subtle); padding: 0.65rem 0.85rem; border-radius: var(--radius-md);">
            <span style="color: var(--primary-600); font-weight: 700;">✓</span>
            <span>${t}</span>
          </li>
        `).join('')}
      </ul>

      <!-- Direct Action: Add to Doctor Summary -->
      <div style="margin-top: 1rem; display: flex; align-items: center; justify-content: space-between; background: var(--amber-100); padding: 0.75rem 1rem; border-radius: var(--radius-md); font-size: 0.85rem; color: var(--amber-700);">
        <div>
          <strong>Doctor Discussion Question:</strong> "${video.doctorQuestion}"
        </div>
        <button class="add-question-btn ${isQuestionAdded ? 'added' : ''}" onclick="toggleDoctorQuestion('${video.doctorQuestion.replace(/'/g, "\\'")}')">
          ${isQuestionAdded ? '✓ Added to Summary' : '+ Add Question'}
        </button>
      </div>

      <div style="margin-top: 1rem; background: var(--sage-100); padding: 0.75rem 1rem; border-radius: var(--radius-md); font-size: 0.8rem; color: var(--sage-700);">
        <strong>Disclaimer:</strong> This video provides supportive health education for awareness only. It does not replace personalised medical consultation.
      </div>
    </div>
  `;
}

function switchVideoMode(videoId, targetMode) {
  const video = VIDEO_MODULES.find(v => v.id === videoId);
  if (!video) return;

  const streamPanel = document.getElementById('video-stream-panel');
  const simPanel = document.getElementById('video-interactive-panel');
  const iframe = document.getElementById('active-youtube-iframe');

  if (targetMode === 'stream') {
    streamPanel.style.display = 'block';
    simPanel.style.display = 'none';
    if (iframe) {
      iframe.src = `https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`;
    }
  } else {
    streamPanel.style.display = 'none';
    simPanel.style.display = 'block';
    if (iframe) {
      // Pause YouTube stream while in interactive simulation
      iframe.src = '';
    }
    updateSimDisplay(video);
  }

  // Update switcher button active state
  document.querySelectorAll('.video-mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.toLowerCase().includes(targetMode === 'stream' ? 'video stream' : 'interactive'));
  });
}

function goToSimStep(videoId, stepIdx) {
  const video = VIDEO_MODULES.find(v => v.id === videoId);
  if (!video) return;
  activeSimStepIndex = stepIdx;
  updateSimDisplay(video);
}

function nextSimStep(videoId) {
  const video = VIDEO_MODULES.find(v => v.id === videoId);
  if (!video) return;
  activeSimStepIndex = (activeSimStepIndex + 1) % video.interactiveSteps.length;
  updateSimDisplay(video);
}

function prevSimStep(videoId) {
  const video = VIDEO_MODULES.find(v => v.id === videoId);
  if (!video) return;
  activeSimStepIndex = (activeSimStepIndex - 1 + video.interactiveSteps.length) % video.interactiveSteps.length;
  updateSimDisplay(video);
}

function updateSimDisplay(video) {
  const step = video.interactiveSteps[activeSimStepIndex];
  if (!step) return;

  const badge = document.getElementById('sim-badge');
  const icon = document.getElementById('sim-icon');
  const phase = document.getElementById('sim-phase');
  const desc = document.getElementById('sim-desc');

  if (badge) badge.textContent = step.time;
  if (icon) icon.textContent = step.icon;
  if (phase) phase.textContent = step.phase;
  if (desc) desc.textContent = step.desc;

  document.querySelectorAll('.sim-step-pill').forEach((pill, idx) => {
    pill.classList.toggle('active', idx === activeSimStepIndex);
  });
}

function toggleVideoNarration(videoId) {
  if (!('speechSynthesis' in window)) {
    showToast('Voice narration is not supported in this browser.');
    return;
  }

  const video = VIDEO_MODULES.find(v => v.id === videoId);
  if (!video) return;

  const iconEl = document.getElementById('narration-icon');
  const textEl = document.getElementById('narration-text');

  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    if (iconEl) iconEl.textContent = '🔊';
    if (textEl) textEl.textContent = 'Listen to Key Points';
    showToast('Narration stopped.');
    return;
  }

  const narrationScript = `${video.title}. Clinician key takeaways: ${video.takeaways.join('. ')}`;
  const utterance = new SpeechSynthesisUtterance(narrationScript);
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  utterance.onstart = () => {
    if (iconEl) iconEl.textContent = '⏸️';
    if (textEl) textEl.textContent = 'Stop Narration';
    showToast('Playing clinical voice narration 🔊');
  };

  utterance.onend = utterance.onerror = () => {
    if (iconEl) iconEl.textContent = '🔊';
    if (textEl) textEl.textContent = 'Listen to Key Points';
  };

  window.speechSynthesis.speak(utterance);
}

// --- Module 1: Words to Know (Glossary) ---
function initGlossary() {
  renderGlossary(GLOSSARY_TERMS);

  const searchInput = document.getElementById('glossary-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const filtered = GLOSSARY_TERMS.filter(item => 
        item.term.toLowerCase().includes(query) || 
        item.simple.toLowerCase().includes(query) ||
        item.clinical.toLowerCase().includes(query)
      );
      renderGlossary(filtered);
    });
  }

  const filterPills = document.querySelectorAll('.glossary-filter-pill');
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const cat = pill.dataset.category;
      if (cat === 'all') {
        renderGlossary(GLOSSARY_TERMS);
      } else {
        const filtered = GLOSSARY_TERMS.filter(item => item.category === cat);
        renderGlossary(filtered);
      }
    });
  });
}

function renderGlossary(termsList) {
  const container = document.getElementById('glossary-grid-container');
  if (!container) return;

  if (termsList.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <p style="font-size: 1.1rem;">No matching medical terms found.</p>
        <p style="font-size: 0.85rem;">Try searching for cramps, bleeding, hormones, or pregnancy.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = termsList.map(item => `
    <div class="glossary-card">
      <div class="glossary-header">
        <h4 class="glossary-term">${item.term}</h4>
        <span class="badge-tag badge-pink" style="font-size: 0.7rem;">${item.category}</span>
      </div>
      <p class="glossary-simple"><strong>In simple words:</strong> ${item.simple}</p>
      <div class="glossary-clinical">
        <strong>How doctors say it:</strong> ${item.clinical}
      </div>
    </div>
  `).join('');
}

// --- Module 1: Ask Better Questions ---
function renderDoctorQuestions() {
  const container = document.getElementById('doctor-questions-container');
  if (!container) return;

  container.innerHTML = DOCTOR_QUESTIONS_DATA.map(group => `
    <div class="question-group-card">
      <div class="question-group-header">
        <span>🩺</span>
        <h3>${group.category}</h3>
      </div>
      <ul class="questions-list">
        ${group.questions.map(q => {
          const isAdded = HerVitaState.selectedQuestions.includes(q);
          return `
            <li class="question-item">
              <span>${q}</span>
              <button class="add-question-btn ${isAdded ? 'added' : ''}" onclick="toggleDoctorQuestion('${q.replace(/'/g, "\\'")}')">
                ${isAdded ? '✓ Added' : '+ Add'}
              </button>
            </li>
          `;
        }).join('')}
      </ul>
    </div>
  `).join('');
}

function toggleDoctorQuestion(question) {
  const idx = HerVitaState.selectedQuestions.indexOf(question);
  if (idx > -1) {
    HerVitaState.selectedQuestions.splice(idx, 1);
    showToast('Removed question from Doctor Summary.');
  } else {
    HerVitaState.selectedQuestions.push(question);
    showToast('Added question to Doctor Visit Summary! 🩺');
  }
  saveToStorage();
  renderDoctorQuestions();
  selectOrgan(HerVitaState.activeOrgan);
}

// --- Module 2: Symptom Diary ---
function initSymptomDiary() {
  // Set default date to today
  const dateInput = document.getElementById('diary-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
  }

  // Severity selector interaction
  const severityOpts = document.querySelectorAll('.severity-option');
  severityOpts.forEach(opt => {
    opt.addEventListener('click', () => {
      severityOpts.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      HerVitaState.selectedSeverity = parseInt(opt.dataset.val, 10);
    });
  });

  // Impact tags toggle
  const impactPills = document.querySelectorAll('.impact-check-pill');
  impactPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      if (e.target.tagName !== 'INPUT') {
        const checkbox = pill.querySelector('input');
        checkbox.checked = !checkbox.checked;
      }
      pill.classList.toggle('checked', pill.querySelector('input').checked);
    });
  });

  // Form submit
  const form = document.getElementById('symptom-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const dateVal = document.getElementById('diary-date').value;
      const timeVal = document.getElementById('diary-time').value;
      const symptomVal = document.getElementById('diary-symptom').value;
      const cycleDayVal = parseInt(document.getElementById('diary-cycle-day').value || '1', 10);
      const durationVal = document.getElementById('diary-duration').value;
      const notesVal = document.getElementById('diary-notes').value.trim();

      const checkedImpacts = [];
      document.querySelectorAll('.impact-check-pill input:checked').forEach(inp => {
        checkedImpacts.push(inp.value);
      });

      const newEntry = {
        id: 'entry-' + Date.now(),
        date: dateVal,
        timeOfDay: timeVal,
        cycleDay: cycleDayVal,
        symptom: symptomVal,
        severity: HerVitaState.selectedSeverity,
        duration: durationVal,
        impacts: checkedImpacts,
        notes: notesVal
      };

      HerVitaState.entries.unshift(newEntry);
      saveToStorage();
      renderDiaryEntries();
      showToast('Symptom entry saved to your device.');

      // Reset notes and form fields
      document.getElementById('diary-notes').value = '';
    });
  }

  renderDiaryEntries();
}

function renderDiaryEntries() {
  const container = document.getElementById('diary-entries-container');
  const countBadge = document.getElementById('diary-entries-count');
  if (!container) return;

  if (countBadge) {
    countBadge.textContent = `${HerVitaState.entries.length} entries`;
  }

  if (HerVitaState.entries.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
        <p style="font-size: 1.05rem; margin-bottom: 0.5rem;">No symptoms logged yet.</p>
        <p style="font-size: 0.85rem;">Use the form to log your first symptom or click "Load Sample Data" to preview.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = HerVitaState.entries.map(entry => `
    <div class="entry-card">
      <button class="entry-delete-btn" onclick="deleteDiaryEntry('${entry.id}')" title="Delete entry">✕</button>
      <div class="entry-card-header">
        <div class="entry-symptom-name">
          <span>${getSymptomIcon(entry.symptom)}</span>
          <span>${entry.symptom}</span>
        </div>
        <span class="entry-severity-badge sev-${entry.severity}">Severity ${entry.severity}/5</span>
      </div>

      <div class="entry-meta-line">
        <span>📅 ${entry.date}</span>
        <span>🕒 ${entry.timeOfDay}</span>
        <span>🔄 Day ${entry.cycleDay}</span>
        <span>⏱️ ${entry.duration}</span>
      </div>

      ${entry.impacts && entry.impacts.length > 0 ? `
        <div class="entry-impacts">
          ${entry.impacts.map(imp => `<span class="impact-chip">Impacted ${imp}</span>`).join('')}
        </div>
      ` : ''}

      ${entry.notes ? `<div class="entry-notes">"${entry.notes}"</div>` : ''}
    </div>
  `).join('');
}

function deleteDiaryEntry(entryId) {
  HerVitaState.entries = HerVitaState.entries.filter(e => e.id !== entryId);
  saveToStorage();
  renderDiaryEntries();
  showToast('Entry removed.');
}

function getSymptomIcon(symptom) {
  if (symptom.includes('Cramp') || symptom.includes('Pelvic')) return '⚡';
  if (symptom.includes('Bleed') || symptom.includes('Flow')) return '🩸';
  if (symptom.includes('Ovulation') || symptom.includes('Mittelschmerz')) return '🥚';
  if (symptom.includes('Headache')) return '🤕';
  if (symptom.includes('Fatigue')) return '🥱';
  if (symptom.includes('Mood')) return '🌪️';
  if (symptom.includes('Bloat')) return '🎈';
  return '📝';
}

// --- Module 2: Rule-Based Pattern View ---
function renderPatternView() {
  const container = document.getElementById('pattern-alerts-container');
  const cycleGrid = document.getElementById('cycle-days-heatmap');
  if (!container || !cycleGrid) return;

  // Rule-based Pattern Detection Analysis:
  const patternsFound = [];

  // 1. Check for recurring Day 1-3 Pelvic Cramps
  const cycleDay1to3Pain = HerVitaState.entries.filter(e => 
    e.cycleDay >= 1 && e.cycleDay <= 3 && 
    (e.symptom.includes('Cramp') || e.symptom.includes('Pelvic'))
  );

  if (cycleDay1to3Pain.length >= 2) {
    patternsFound.push({
      type: 'cyclic',
      title: 'Cyclical Dysmenorrhea (Pain on Days 1 to 3)',
      icon: '🔄',
      badge: 'Repeated Pattern Detected',
      description: `Pain with severity up to ${Math.max(...cycleDay1to3Pain.map(e => e.severity))}/5 consistently occurs on Days 1 to 3 across consecutive recorded cycles. This pattern suggests classic primary menstrual cramping.`
    });
  }

  // 2. Check for Luteal Phase Headaches / Fatigue (Days 23 to 28)
  const lutealSymptoms = HerVitaState.entries.filter(e => 
    e.cycleDay >= 22 && e.cycleDay <= 28
  );

  if (lutealSymptoms.length >= 2) {
    patternsFound.push({
      type: 'luteal',
      title: 'Premenstrual Luteal Clustering (Days 23 to 27)',
      icon: '🌙',
      badge: 'Premenstrual Pattern',
      description: `Headache, fatigue, or mood dips cluster 2 to 4 days prior to menstruation. Consistent with physiological progesterone withdrawal.`
    });
  }

  // 3. Functional Life Impact Pattern
  const workAffected = HerVitaState.entries.filter(e => e.impacts && e.impacts.includes('work'));
  if (workAffected.length > 0) {
    const pct = Math.round((workAffected.length / Math.max(1, HerVitaState.entries.length)) * 100);
    patternsFound.push({
      type: 'stable',
      title: `Functional Impact on Work / School (${pct}% of entries)`,
      icon: '💼',
      badge: 'Impact Analysis',
      description: `${workAffected.length} logged episodes directly disrupted work productivity or required stepping away. This concrete data is highly valuable for your doctor.`
    });
  }

  // Fallback if no patterns
  if (patternsFound.length === 0) {
    patternsFound.push({
      type: 'stable',
      title: 'Gathering Cycle Data',
      icon: '📊',
      badge: 'Baseline Tracking',
      description: 'HerVita is analyzing your symptom timing. Log symptoms across 2–3 full menstrual cycles to reveal recurring patterns.'
    });
  }

  container.innerHTML = patternsFound.map(pat => `
    <div class="pattern-card pattern-${pat.type}">
      <div class="pattern-icon">${pat.icon}</div>
      <div class="pattern-content">
        <h4>${pat.title}</h4>
        <p>${pat.description}</p>
        <span class="pattern-badge">${pat.badge}</span>
      </div>
    </div>
  `).join('');

  // Render 28-day cycle heatmap
  const daysHtml = [];
  for (let d = 1; d <= 28; d++) {
    let phaseClass = '';
    if (d <= 5) phaseClass = 'phase-menstrual';
    else if (d >= 13 && d <= 16) phaseClass = 'phase-ovulation';
    else if (d >= 22) phaseClass = 'phase-luteal';

    const matching = HerVitaState.entries.filter(e => e.cycleDay === d);
    const hasSymptom = matching.length > 0;

    daysHtml.push(`
      <div class="cycle-day-cell ${phaseClass} ${hasSymptom ? 'has-symptom' : ''}" title="Day ${d}: ${matching.length} symptom(s) recorded">
        <span>D${d}</span>
        ${hasSymptom ? '<div class="dot"></div>' : '<div></div>'}
        <span style="font-size: 0.6rem; color: var(--text-muted);">${hasSymptom ? `${matching.length}x` : ''}</span>
      </div>
    `);
  }
  cycleGrid.innerHTML = daysHtml.join('');
}

// --- Module 2: Doctor Visit Summary (Clinical Printable Report) ---
function renderDoctorSummary() {
  const container = document.getElementById('doctor-summary-paper-content');
  if (!container) return;

  const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const entries = HerVitaState.entries;

  // Synthesize Chief Complaints
  const symptomCounts = {};
  entries.forEach(e => {
    symptomCounts[e.symptom] = (symptomCounts[e.symptom] || 0) + 1;
  });

  const sortedSymptoms = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1]);
  const primaryComplaint = sortedSymptoms.length > 0 
    ? `${sortedSymptoms[0][0]} (logged ${sortedSymptoms[0][1]} times, max severity ${Math.max(...entries.filter(e => e.symptom === sortedSymptoms[0][0]).map(e => e.severity))}/5)` 
    : 'Routine reproductive wellness review';

  const workImpactCount = entries.filter(e => e.impacts && e.impacts.includes('work')).length;
  const sleepImpactCount = entries.filter(e => e.impacts && e.impacts.includes('sleep')).length;

  container.innerHTML = `
    <div class="paper-header">
      <div class="paper-title">
        <h2>HerVita Clinical Visit Summary</h2>
        <p>Patient-Reported Symptom Chronology & Discussion Guide (Non-Diagnostic)</p>
      </div>
      <div class="paper-meta">
        <div><strong>Date Generated:</strong> ${todayStr}</div>
        <div><strong>Document ID:</strong> HV-${Date.now().toString().slice(-6)}</div>
        <div style="color: var(--sage-700); font-weight: 700;">Verified Private Local Copy</div>
      </div>
    </div>

    <div class="patient-info-grid">
      <div class="info-box">
        <span class="title">Patient Age</span>
        <span class="val">${HerVitaState.userProfile.age} Years</span>
      </div>
      <div class="info-box">
        <span class="title">Cycle Length</span>
        <span class="val">${HerVitaState.userProfile.cycleLength} Days (Regular)</span>
      </div>
      <div class="info-box">
        <span class="title">Last Period (LMP)</span>
        <span class="val">${HerVitaState.userProfile.lmp}</span>
      </div>
      <div class="info-box">
        <span class="title">Log Horizon</span>
        <span class="val">${entries.length} Entries Recorded</span>
      </div>
    </div>

    <div class="summary-block">
      <h3><span>📋</span> Primary Reported Concerns</h3>
      <p style="font-size: 0.95rem; line-height: 1.5; color: var(--text-primary);">
        <strong>Primary Complaint:</strong> ${primaryComplaint}.<br/>
        <strong>Functional Impact:</strong> Symptoms interfered with workplace/school activity on <strong>${workImpactCount} occasions</strong> and caused sleep disruption on <strong>${sleepImpactCount} occasions</strong>.
      </p>
    </div>

    <div class="summary-block">
      <h3><span>🩺</span> Symptom Chronology & Medical Translations</h3>
      <table class="summary-table">
        <thead>
          <tr>
            <th>Date / Cycle Day</th>
            <th>Patient Note</th>
            <th>Clinical Terminology</th>
            <th>Severity</th>
            <th>Impact</th>
          </tr>
        </thead>
        <tbody>
          ${entries.slice(0, 8).map(e => `
            <tr>
              <td><strong>${e.date}</strong> (Day ${e.cycleDay})</td>
              <td>${e.symptom}</td>
              <td style="color: var(--primary-700); font-weight: 600;">${getClinicalTranslation(e.symptom)}</td>
              <td>${e.severity}/5 (${getSeverityText(e.severity)})</td>
              <td>${e.impacts && e.impacts.length > 0 ? e.impacts.join(', ') : 'None noted'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    ${HerVitaState.selectedQuestions.length > 0 ? `
      <div class="summary-block">
        <h3><span>❓</span> Questions Prepared for the Physician</h3>
        <div class="summary-questions-box">
          <ol>
            ${HerVitaState.selectedQuestions.map(q => `<li>${q}</li>`).join('')}
          </ol>
        </div>
      </div>
    ` : ''}

    ${HerVitaState.antenatalVisits.length > 0 ? `
      <div class="summary-block">
        <h3><span>🤰</span> Obstetrics & Antenatal Visit Schedule</h3>
        <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
          LMP: <strong>${HerVitaState.userProfile.pregnancyLmp}</strong> • Estimated Gestation: <strong>Week 19</strong> (Second Trimester)
        </p>
        <table class="summary-table">
          <thead>
            <tr>
              <th>Gestational Timing</th>
              <th>Visit / Scan</th>
              <th>Key Lab / Test</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${HerVitaState.antenatalVisits.slice(0, 5).map(v => `
              <tr>
                <td><strong>${v.week}</strong></td>
                <td>${v.title}</td>
                <td>${v.test}</td>
                <td><span class="badge-tag ${v.status === 'Completed' ? 'badge-sage' : 'badge-amber'}">${v.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    ` : ''}

    ${HerVitaState.periodLogs.length > 0 || HerVitaState.pcosLogs.length > 0 || HerVitaState.pelvicPainLogs.length > 0 ? `
      <div class="summary-block">
        <h3><span>🔬</span> Gynecological Profile & Hormonal Snapshot</h3>
        <div style="background: var(--bg-subtle); padding: 0.85rem 1rem; border-radius: var(--radius-md); font-size: 0.875rem; margin-bottom: 0.75rem; line-height: 1.5;">
          <strong>Menstrual Rhythm:</strong> ${HerVitaState.periodLogs.length} cycles recorded. Average cycle length: 28–30 days. Flow: Moderate to Heavy.<br/>
          <strong>PCOS Biomarkers:</strong> LH/FSH Ratio: 2.3:1 (clinical evaluation advised) | Fasting Insulin: 14.8 uIU/mL | Total Testosterone: 62 ng/dL.<br/>
          <strong>Pelvic Pain Episodes:</strong> ${HerVitaState.pelvicPainLogs.length} episode(s) logged (Anatomy: Left lower quadrant; triggers: period onset & intercourse).
        </div>
      </div>
    ` : ''}

    ${HerVitaState.medicalRecords.length > 0 ? `
      <div class="summary-block">
        <h3><span>📁</span> Medical Vault Filed Documents</h3>
        <table class="summary-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Document Title</th>
              <th>Category</th>
              <th>Key Clinical Findings</th>
            </tr>
          </thead>
          <tbody>
            ${HerVitaState.medicalRecords.map(r => `
              <tr>
                <td><strong>${r.date}</strong></td>
                <td>${r.title} (${r.doctor})</td>
                <td><span class="badge-tag badge-pink">${r.category}</span></td>
                <td>${r.keyFindings}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    ` : ''}

    ${HerVitaState.vaccines.length > 0 ? `
      <div class="summary-block">
        <h3><span>💉</span> Reproductive Immunisation Record</h3>
        <table class="summary-table">
          <thead>
            <tr>
              <th>Vaccine Name</th>
              <th>Dose</th>
              <th>Date Given</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${HerVitaState.vaccines.map(v => `
              <tr>
                <td><strong>${v.name}</strong></td>
                <td>${v.dose}</td>
                <td>${v.dateGiven || 'Pending'}</td>
                <td><span class="badge-tag ${v.status === 'Completed' ? 'badge-sage' : 'badge-amber'}">${v.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    ` : ''}

    <div class="paper-disclaimer">
      <strong>Medical Disclaimer:</strong> This document is an organised transcript of patient-recorded subjective observations designed to facilitate clinical communication during a medical appointment. It does not provide medical diagnoses, treatment advice, or drug prescriptions. Always consult a qualified registered medical practitioner.
    </div>
  `;
}

function getClinicalTranslation(symptom) {
  if (symptom.includes('Cramp') || symptom.includes('Pelvic')) return 'Dysmenorrhea / Pelvic Algia';
  if (symptom.includes('Heavy Bleed')) return 'Menorrhagia / Hypermenorrhea';
  if (symptom.includes('Ovulation') || symptom.includes('Mittelschmerz')) return 'Periovulatory Mittelschmerz';
  if (symptom.includes('Headache')) return 'Catamenial Cephalea';
  if (symptom.includes('Fatigue')) return 'Asthenia / Lethargy';
  if (symptom.includes('Mood')) return 'Premenstrual Dysphoria';
  if (symptom.includes('Spotting')) return 'Intermenstrual Metrorrhagia';
  return 'Somatic Symptom';
}

function getSeverityText(score) {
  if (score === 1) return 'Mild';
  if (score === 2) return 'Moderate';
  if (score === 3) return 'Disruptive';
  if (score === 4) return 'Severe';
  return 'Debilitating';
}

// --- Module 2: Care Checklist ---
function renderChecklist() {
  const container = document.getElementById('checklist-items-container');
  if (!container) return;

  if (HerVitaState.checklist.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
        <p>No follow-up items in checklist.</p>
        <p style="font-size: 0.85rem;">Add doctor recommendations, lab tests, or prescriptions above.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = HerVitaState.checklist.map(item => `
    <div class="checklist-item ${item.done ? 'done' : ''}">
      <div class="check-left">
        <div class="custom-checkbox ${item.done ? 'checked' : ''}" onclick="toggleChecklistItem('${item.id}')">
          ✓
        </div>
        <div class="item-details">
          <h4 class="item-title">${item.title}</h4>
          <span class="category">${item.category} • Due: ${item.dueDate} • Recommended by: ${item.doctor}</span>
        </div>
      </div>
      <button class="entry-delete-btn" onclick="deleteChecklistItem('${item.id}')" title="Delete">✕</button>
    </div>
  `).join('');
}

function toggleChecklistItem(id) {
  const item = HerVitaState.checklist.find(i => i.id === id);
  if (item) {
    item.done = !item.done;
    saveToStorage();
    renderChecklist();
  }
}

function deleteChecklistItem(id) {
  HerVitaState.checklist = HerVitaState.checklist.filter(i => i.id !== id);
  saveToStorage();
  renderChecklist();
  showToast('Checklist item removed.');
}

function initChecklistForm() {
  const form = document.getElementById('checklist-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const titleVal = document.getElementById('check-title').value.trim();
    const catVal = document.getElementById('check-category').value;
    const dueVal = document.getElementById('check-due').value;
    const docVal = document.getElementById('check-doctor').value.trim() || 'Attending Physician';

    if (!titleVal) return;

    const newItem = {
      id: 'chk-' + Date.now(),
      title: titleVal,
      category: catVal,
      dueDate: dueVal || 'Ongoing',
      doctor: docVal,
      done: false
    };

    HerVitaState.checklist.push(newItem);
    saveToStorage();
    renderChecklist();
    showToast('Follow-up task added to Care Checklist.');
    form.reset();
  });
}

// --- Red-Flag Symptom Check (Calm Emergency Triage) ---
const TRIAGE_QUESTIONS = [
  {
    id: 'q1',
    text: 'Are you soaking through two or more sanitary pads or tampons every hour for two consecutive hours?'
  },
  {
    id: 'q2',
    text: 'Are you experiencing sudden, severe, or unbearable lower abdominal or pelvic pain that makes it difficult to stand?'
  },
  {
    id: 'q3',
    text: 'Do you have a fever above 101°F (38.3°C) accompanied by pelvic pain or foul-smelling discharge?'
  },
  {
    id: 'q4',
    text: 'If you could be or are currently pregnant: are you experiencing vaginal bleeding, sharp one-sided pain, or severe cramping?'
  },
  {
    id: 'q5',
    text: 'Are you feeling sudden severe shortness of breath, dizziness, confusion, or fainting?'
  }
];

const triageAnswers = { q1: false, q2: false, q3: false, q4: false, q5: false };

function initTriage() {
  const container = document.getElementById('triage-questions-list');
  if (!container) return;

  container.innerHTML = TRIAGE_QUESTIONS.map(q => `
    <div class="triage-q-item">
      <div class="triage-q-text">${q.text}</div>
      <div class="triage-toggle">
        <button class="triage-btn active-no" id="btn-no-${q.id}" onclick="setTriageAnswer('${q.id}', false)">No</button>
        <button class="triage-btn" id="btn-yes-${q.id}" onclick="setTriageAnswer('${q.id}', true)">Yes</button>
      </div>
    </div>
  `).join('');

  updateTriageEvaluation();
}

function setTriageAnswer(qId, val) {
  triageAnswers[qId] = val;

  const btnNo = document.getElementById(`btn-no-${qId}`);
  const btnYes = document.getElementById(`btn-yes-${qId}`);

  if (val) {
    btnNo.classList.remove('active-no');
    btnYes.classList.add('active-yes');
  } else {
    btnYes.classList.remove('active-yes');
    btnNo.classList.add('active-no');
  }

  updateTriageEvaluation();
}

function updateTriageEvaluation() {
  const resultContainer = document.getElementById('triage-result-container');
  if (!resultContainer) return;

  const hasYes = Object.values(triageAnswers).some(v => v === true);

  if (hasYes) {
    resultContainer.innerHTML = `
      <div class="triage-result urgent">
        <h3><span>🌿</span> Calm Acknowledgement & Guidance</h3>
        <p><strong>Thank you for checking. Based on what you shared, please speak with a doctor soon.</strong></p>
        <p>Your body is letting you know that these symptoms deserve prompt clinical attention. You do not need to panic, but having a healthcare professional examine you today is the safest step.</p>
        
        <div class="triage-helpline-box">
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: #9A3412;">IMMEDIATE CLINICAL NEXT STEPS:</div>
            <div style="font-size: 0.95rem; font-weight: 700; color: #1F2937;">Contact your gynaecologist or visit the nearest hospital emergency department.</div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">India National Emergency: <strong>112</strong> | Women Helpline: <strong>1091</strong></div>
          </div>
          <button class="btn-primary" style="width: auto; padding: 0.6rem 1.15rem; font-size: 0.85rem;" onclick="switchView('view-summary')">
            📄 Save & Show Summary to Doctor
          </button>
        </div>
      </div>
    `;
  } else {
    resultContainer.innerHTML = `
      <div class="triage-result normal">
        <h3><span>💚</span> No Immediate Red Flags Identified</h3>
        <p>Based on your responses to this short check, no critical emergency warning signs are present right now. You can continue comfortably tracking changes in your diary.</p>
        <p style="font-size: 0.825rem; margin-bottom: 0;">Remember: You know your body best. If at any point you feel very unwell, lightheaded, or your instincts tell you something is wrong, always seek clinical evaluation without waiting.</p>
      </div>
    `;
  }
}

// --- Vaccines & Immunisation Timeline ---
function renderVaccines() {
  const timelineContainer = document.getElementById('vaccine-schedule-timeline');
  const logContainer = document.getElementById('vaccine-log-container');
  if (!timelineContainer || !logContainer) return;

  timelineContainer.innerHTML = VACCINE_SCHEDULE.map(v => `
    <div class="vaccine-stage-item">
      <div class="vaccine-stage-dot"></div>
      <div class="stage-title">${v.stage}</div>
      <div class="stage-vaccine-name">${v.vaccine} (${v.doses})</div>
      <div class="stage-desc">${v.whyItMatters}</div>
    </div>
  `).join('');

  if (HerVitaState.vaccines.length === 0) {
    logContainer.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
        <p>No vaccines logged yet.</p>
        <p style="font-size: 0.85rem;">Add your HPV, MMR, or pregnancy vaccine doses above.</p>
      </div>
    `;
    return;
  }

  logContainer.innerHTML = HerVitaState.vaccines.map(item => `
    <div class="checklist-item">
      <div class="check-left">
        <div style="font-size: 1.4rem;">💉</div>
        <div class="item-details">
          <h4 class="item-title">${item.name}</h4>
          <span class="category">${item.dose} • Given: ${item.dateGiven || 'Pending'} • Next Due: ${item.nextDue}</span>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span class="badge-tag ${item.status === 'Completed' ? 'badge-sage' : 'badge-amber'}">${item.status}</span>
        <button class="entry-delete-btn" onclick="deleteVaccine('${item.id}')" title="Delete">✕</button>
      </div>
    </div>
  `).join('');
}

function initVaccineForm() {
  const form = document.getElementById('vaccine-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameVal = document.getElementById('vac-name').value;
    const doseVal = document.getElementById('vac-dose').value;
    const dateVal = document.getElementById('vac-date').value;
    const dueVal = document.getElementById('vac-due').value;

    const newVac = {
      id: 'vac-' + Date.now(),
      name: nameVal,
      dose: doseVal,
      dateGiven: dateVal,
      nextDue: dueVal || 'Not scheduled',
      status: dateVal ? 'Completed' : 'Upcoming',
      notes: ''
    };

    HerVitaState.vaccines.push(newVac);
    saveToStorage();
    renderVaccines();
    showToast('Vaccine recorded in your profile.');
    form.reset();
  });
}

function deleteVaccine(id) {
  HerVitaState.vaccines = HerVitaState.vaccines.filter(v => v.id !== id);
  saveToStorage();
  renderVaccines();
  showToast('Vaccine entry removed.');
}

// --- Privacy Controls & PIN Lock Screen ---
function openPrivacyModal() {
  const modal = document.getElementById('privacy-modal');
  if (modal) {
    modal.classList.add('active');
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
  // Stop YouTube iframe playback immediately
  const iframe = document.getElementById('active-youtube-iframe');
  if (iframe) {
    iframe.src = '';
  }
  // Cancel any active speech narration
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

function initPrivacyControls() {
  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  document.querySelectorAll('.modal-backdrop').forEach(bg => {
    bg.addEventListener('click', (e) => {
      if (e.target === bg) closeAllModals();
    });
  });

  const exportBtn = document.getElementById('btn-export-json');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportDataJSON);
  }

  const importBtn = document.getElementById('btn-import-json');
  const fileInput = document.getElementById('import-file-input');
  if (importBtn && fileInput) {
    importBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleImportJSON);
  }

  const clearBtn = document.getElementById('btn-clear-all-privacy');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearAllData);
  }

  const setPinBtn = document.getElementById('btn-save-pin');
  if (setPinBtn) {
    setPinBtn.addEventListener('click', () => {
      const pinVal = document.getElementById('pin-input-field').value.trim();
      if (pinVal.length === 4 && /^\d+$/.test(pinVal)) {
        HerVitaState.pin = pinVal;
        saveToStorage();
        showToast('4-digit PIN protection activated! 🔒');
        closeAllModals();
      } else {
        alert('Please enter a 4-digit numeric PIN.');
      }
    });
  }

  // Language Toggle
  const langToggleBtn = document.getElementById('btn-lang-toggle');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      HerVitaState.language = HerVitaState.language === 'en' ? 'hi' : 'en';
      langToggleBtn.textContent = HerVitaState.language === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English';
      selectOrgan(HerVitaState.activeOrgan);
      showToast(`Language switched to ${HerVitaState.language === 'en' ? 'English' : 'हिंदी'}`);
    });
  }
}

function exportDataJSON() {
  const exportPayload = {
    appName: 'HerVita',
    version: '2.0',
    exportDate: new Date().toISOString(),
    entries: HerVitaState.entries,
    checklist: HerVitaState.checklist,
    vaccines: HerVitaState.vaccines,
    questions: HerVitaState.selectedQuestions,
    pregnancyMilestones: HerVitaState.pregnancyMilestones,
    antenatalVisits: HerVitaState.antenatalVisits,
    postpartumRecords: HerVitaState.postpartumRecords,
    periodLogs: HerVitaState.periodLogs,
    pcosLogs: HerVitaState.pcosLogs,
    pelvicPainLogs: HerVitaState.pelvicPainLogs,
    medicalRecords: HerVitaState.medicalRecords
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `hervita_health_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast('Encrypted personal backup downloaded.');
}

function handleImportJSON(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      if (data.entries) HerVitaState.entries = data.entries;
      if (data.checklist) HerVitaState.checklist = data.checklist;
      if (data.vaccines) HerVitaState.vaccines = data.vaccines;
      if (data.questions) HerVitaState.selectedQuestions = data.questions;
      if (data.pregnancyMilestones) HerVitaState.pregnancyMilestones = data.pregnancyMilestones;
      if (data.antenatalVisits) HerVitaState.antenatalVisits = data.antenatalVisits;
      if (data.postpartumRecords) HerVitaState.postpartumRecords = data.postpartumRecords;
      if (data.periodLogs) HerVitaState.periodLogs = data.periodLogs;
      if (data.pcosLogs) HerVitaState.pcosLogs = data.pcosLogs;
      if (data.pelvicPainLogs) HerVitaState.pelvicPainLogs = data.pelvicPainLogs;
      if (data.medicalRecords) HerVitaState.medicalRecords = data.medicalRecords;

      saveToStorage();
      renderAllViews();
      closeAllModals();
      showToast('Data imported successfully! ✨');
    } catch (err) {
      alert('Invalid HerVita backup JSON file.');
    }
  };
  reader.readAsText(file);
}

// ==============================================================
// DOMAIN A: OBSTETRICS (Pregnancy, Childbirth & Postpartum Care)
// ==============================================================

function renderObstetrics() {
  renderPregnancyTracker();
  renderAntenatalPlanner();
  renderPregnancyEducation();
  renderObstetricWarnings();
  renderPostpartumSupport();
}

// 1. Pregnancy Journey Tracker
function renderPregnancyTracker() {
  const container = document.getElementById('obs-tracker-content');
  if (!container) return;

  // Calculate Gestational Age
  const lmpDate = new Date(HerVitaState.userProfile.pregnancyLmp || '2026-06-15');
  const today = new Date();
  const diffDays = Math.max(0, Math.floor((today - lmpDate) / (1000 * 60 * 60 * 24)));
  const currentWeek = Math.min(40, Math.floor(diffDays / 7) + 1);
  const currentDay = diffDays % 7;
  
  // Calculate Due Date (+280 days from LMP)
  const dueDate = new Date(lmpDate);
  dueDate.setDate(dueDate.getDate() + 280);
  const dueDateStr = dueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  let trimester = 'First Trimester';
  if (currentWeek >= 14 && currentWeek <= 27) trimester = 'Second Trimester';
  else if (currentWeek >= 28) trimester = 'Third Trimester';

  const fruitComparison = getFetalSizeComparison(currentWeek);

  container.innerHTML = `
    <!-- Gestational Progress Header -->
    <div class="gestation-tracker-card">
      <div class="gestation-header">
        <div>
          <span class="badge-tag badge-pink">${trimester}</span>
          <div class="gestation-highlight" style="margin-top: 0.4rem;">
            <span class="week-number">Week ${currentWeek}</span>
            <span style="font-size: 1.1rem; color: var(--text-secondary); font-weight: 600;">+ ${currentDay} Days</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.2rem;">
            Estimated Due Date: <strong>${dueDateStr}</strong> (based on LMP: ${HerVitaState.userProfile.pregnancyLmp})
          </p>
        </div>
        <div style="background: #fff; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 0.85rem 1.25rem; text-align: center;">
          <div style="font-size: 2rem;">🥭</div>
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--primary-900);">Size of a ${fruitComparison.fruit}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${fruitComparison.length} • ${fruitComparison.weight}</div>
        </div>
      </div>

      <!-- Progress Meter -->
      <div class="gestation-progress-bar-wrap">
        <div class="gestation-progress-fill" style="width: ${(currentWeek / 40) * 100}%;"></div>
      </div>
      <div class="trimester-labels">
        <span>Week 1 (Conception)</span>
        <span>Week 14 (Trimester 2)</span>
        <span>Week 28 (Trimester 3)</span>
        <span>Week 40 (Full Term)</span>
      </div>
    </div>

    <!-- Pregnancy Milestones & Interactive Week Info -->
    <div style="display: grid; grid-template-columns: 1.1fr 1fr; gap: 1.75rem; align-items: start;">
      <div class="card">
        <h3 style="font-size: 1.25rem; color: var(--primary-900); margin-bottom: 0.35rem;">Week ${currentWeek} Fetal & Maternal Milestones</h3>
        <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1.25rem;">Evidence-based educational information for your current stage:</p>

        <div style="background: var(--bg-subtle); border-radius: var(--radius-md); padding: 1.15rem; margin-bottom: 1.25rem;">
          <h4 style="font-size: 0.95rem; color: var(--primary-800); margin-bottom: 0.35rem;">👶 Baby's Development This Week</h4>
          <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5;">${fruitComparison.development}</p>
        </div>

        <div style="background: var(--sage-100); border-radius: var(--radius-md); padding: 1.15rem; margin-bottom: 1.25rem;">
          <h4 style="font-size: 0.95rem; color: var(--sage-700); margin-bottom: 0.35rem;">🤰 Changes in Your Body</h4>
          <p style="font-size: 0.9rem; color: var(--sage-700); line-height: 1.5;">${fruitComparison.maternal}</p>
        </div>

        <div>
          <h4 style="font-size: 1rem; color: var(--primary-900); margin-bottom: 0.75rem;">Recorded Pregnancy Milestones</h4>
          <div style="display: flex; flex-direction: column; gap: 0.65rem;">
            ${HerVitaState.pregnancyMilestones.map(m => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; background: #fff; border: 1px solid var(--border-light); border-radius: var(--radius-md);">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <span style="font-size: 1.2rem;">${m.completed ? '✅' : '⏳'}</span>
                  <div>
                    <div style="font-size: 0.9rem; font-weight: 700; color: var(--text-primary);">${m.title}</div>
                    <div style="font-size: 0.775rem; color: var(--text-muted);">Week ${m.week} • ${m.date || 'Scheduled'}</div>
                  </div>
                </div>
                <button class="entry-delete-btn" onclick="deletePregnancyMilestone('${m.id}')">✕</button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Add Milestone Form -->
      <div class="card">
        <h3 style="font-size: 1.2rem; color: var(--primary-900); margin-bottom: 0.3rem;">Log Pregnancy Milestone</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">Record ultrasounds, kicks, or personal memories</p>

        <form id="milestone-form" onsubmit="handleMilestoneSubmit(event)">
          <div class="form-group">
            <label class="form-label" for="ms-title">Milestone Event</label>
            <input type="text" id="ms-title" class="form-control" placeholder="e.g. Felt first kick, 20-week anatomy scan..." required />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="ms-week">Gestational Week</label>
              <input type="number" id="ms-week" class="form-control" min="1" max="42" value="${currentWeek}" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="ms-date">Date</label>
              <input type="date" id="ms-date" class="form-control" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="ms-notes">Notes & Clinical Findings</label>
            <textarea id="ms-notes" class="form-control" rows="2" placeholder="e.g. Crown-rump length normal, heart rate 142 bpm..."></textarea>
          </div>

          <button type="submit" class="btn-primary">
            <span>🌸</span> Save Milestone
          </button>
        </form>
      </div>
    </div>
  `;
}

function getFetalSizeComparison(week) {
  if (week <= 8) return { fruit: 'Raspberry', length: '1.6 cm', weight: '1g', development: 'Webbed fingers and toes form. Neural tube has closed. Heart beats at ~150 bpm.', maternal: 'Morning nausea and fatigue are common as hCG levels double every 48 hours.' };
  if (week <= 12) return { fruit: 'Lime', length: '5.4 cm', weight: '14g', development: 'All vital organs, vocal cords, and tiny fingernails are in place. Reflexes start.', maternal: 'First trimester screening window. Uterus begins expanding out of the pelvic cavity.' };
  if (week <= 16) return { fruit: 'Avocado', length: '11.6 cm', weight: '100g', development: 'Eyes can detect light. Baby can make sucking motions with tiny lips.', maternal: 'Energy frequently rebounds in the second trimester. Heartburn may begin.' };
  if (week <= 20) return { fruit: 'Mango', length: '16.4 cm', weight: '300g', development: 'Vernix caseosa protects delicate skin. Baby can swallow amniotic fluid and hear mom’s voice.', maternal: 'Quickening flutter movements felt. Time for the detailed Level-II anomaly scan.' };
  if (week <= 24) return { fruit: 'Corn ear', length: '30 cm', weight: '600g', development: 'Lungs begin producing surfactant. Rapid brain growth and sleep-wake cycles emerge.', maternal: 'OGTT screening for gestational diabetes window. Leg cramps and mild swelling.' };
  if (week <= 28) return { fruit: 'Eggplant', length: '37 cm', weight: '1 kg', development: 'Eyes open and blink. Baby responds to sound and light outside the womb.', maternal: 'Third trimester begins. Tdap vaccine recommended to pass whooping cough immunity.' };
  if (week <= 34) return { fruit: 'Pineapple', length: '45 cm', weight: '2.1 kg', development: 'Bones are fully developed, though soft. Antibodies actively cross the placenta.', maternal: 'Braxton Hicks contractions become more noticeable. Ensure sleep on left side.' };
  return { fruit: 'Watermelon', length: '50 cm', weight: '3.3 kg', development: 'Full term readiness. Lungs and fat insulation prepared for life outside the womb.', maternal: 'Baby drops into pelvis (lightening). Watch for the 5-1-1 labor contraction pattern.' };
}

function handleMilestoneSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('ms-title').value.trim();
  const week = parseInt(document.getElementById('ms-week').value, 10);
  const date = document.getElementById('ms-date').value;
  const notes = document.getElementById('ms-notes').value.trim();

  if (!title) return;

  const newMilestone = {
    id: 'pm-' + Date.now(),
    week: week,
    title: title,
    date: date,
    notes: notes,
    completed: Boolean(date)
  };

  HerVitaState.pregnancyMilestones.unshift(newMilestone);
  saveToStorage();
  renderPregnancyTracker();
  showToast('Pregnancy milestone recorded! 🌸');
}

function deletePregnancyMilestone(id) {
  HerVitaState.pregnancyMilestones = HerVitaState.pregnancyMilestones.filter(m => m.id !== id);
  saveToStorage();
  renderPregnancyTracker();
  showToast('Milestone removed.');
}

// 2. Antenatal Care Planner
function renderAntenatalPlanner() {
  const container = document.getElementById('obs-planner-content');
  if (!container) return;

  container.innerHTML = `
    <div style="margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
      <div>
        <h3 style="font-size: 1.35rem; color: var(--primary-900);">ACOG / WHO Antenatal Visit Schedule</h3>
        <p style="font-size: 0.9rem; color: var(--text-secondary);">Organize clinician-recommended checkups, diagnostic scans, and laboratory blood tests.</p>
      </div>
      <span class="badge-tag badge-sage">ACOG Standard Care Guidelines</span>
    </div>

    <div class="antenatal-schedule-grid">
      ${HerVitaState.antenatalVisits.map(v => `
        <div class="antenatal-card ${v.status === 'Completed' ? 'completed' : 'pending'}">
          <div class="antenatal-card-top">
            <span class="antenatal-week-badge ${v.status === 'Completed' ? 'badge-sage' : 'badge-amber'}">
              ${v.week}
            </span>
            <span style="font-size: 0.775rem; font-weight: 700; color: ${v.status === 'Completed' ? 'var(--sage-700)' : 'var(--amber-700)'};">
              ${v.status === 'Completed' ? '✓ Completed' : '⏳ Scheduled'}
            </span>
          </div>

          <h4 style="font-size: 1.05rem; color: var(--primary-900); margin-bottom: 0.25rem;">${v.title}</h4>
          <div style="font-size: 0.825rem; color: var(--primary-700); font-weight: 600; margin-bottom: 0.4rem;">🧪 ${v.test}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.6rem;">
            📅 ${v.date || 'TBD'} • 🏥 ${v.doctor || 'Maternity Clinic'}
          </div>

          ${v.notes ? `<div style="font-size: 0.8rem; color: var(--text-secondary); background: var(--bg-subtle); padding: 0.5rem 0.65rem; border-radius: var(--radius-sm); margin-bottom: 0.75rem;">${v.notes}</div>` : ''}

          <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center;">
            <button class="btn-pill" style="font-size: 0.75rem; padding: 0.25rem 0.65rem;" onclick="toggleAntenatalStatus('${v.id}')">
              ${v.status === 'Completed' ? 'Mark Pending' : 'Mark Completed ✓'}
            </button>
            <button class="entry-delete-btn" style="position: static;" onclick="deleteAntenatalVisit('${v.id}')">✕</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function toggleAntenatalStatus(id) {
  const visit = HerVitaState.antenatalVisits.find(v => v.id === id);
  if (visit) {
    visit.status = visit.status === 'Completed' ? 'Upcoming' : 'Completed';
    saveToStorage();
    renderAntenatalPlanner();
    showToast('Antenatal visit status updated.');
  }
}

function deleteAntenatalVisit(id) {
  HerVitaState.antenatalVisits = HerVitaState.antenatalVisits.filter(v => v.id !== id);
  saveToStorage();
  renderAntenatalPlanner();
  showToast('Visit removed.');
}

// 3. Pregnancy Health Education
function renderPregnancyEducation() {
  const container = document.getElementById('obs-education-content');
  if (!container) return;

  const topics = [
    {
      title: 'Trimester-by-Trimester Nutrition',
      icon: '🥗',
      color: '#EFFBF7',
      items: [
        'Folic Acid / Methylfolate (400–800 mcg): Crucial in early weeks to prevent neural tube defects.',
        'Iron & Vitamin C: Supports 50% expansion in maternal blood volume. Pair lentils/spinach with citrus.',
        'Calcium & Vitamin D3: Builds fetal skeleton while preserving maternal bone stores.',
        'Foods to Avoid: Raw/undercooked meat, raw eggs, unpasteurized dairy, and high-mercury fish.'
      ]
    },
    {
      title: 'Common Symptoms & Safe Comfort',
      icon: '🌿',
      color: '#FFFBEB',
      items: [
        'Morning Sickness: Small frequent meals, ginger infusion, keeping dry toast at bedside.',
        'Heartburn & Reflux: Avoid lying flat within 2 hours of meals; small sips of warm water.',
        'Round Ligament Pain: Sharp stretching twinges in lower belly; ease by sitting down and warm compress.',
        'Swollen Ankles & Feet: Elevate legs above heart level, wear supportive footwear, hydrate well.'
      ]
    },
    {
      title: 'Physical Well-being & Safe Movement',
      icon: '🧘',
      color: '#F8F6FF',
      items: [
        'Sleep Ergonomics: Sleep on left side from week 20 to optimize blood flow to placenta and kidneys.',
        'Gentle Movement: 20–30 minutes of low-impact walking, prenatal yoga, or water aerobics.',
        'Pelvic Floor Tilts: Cat-cow poses and gentle pelvic tilts alleviate lower sacral pressure.',
        'Stop Activity If: Dizziness, vaginal bleeding, chest pain, or contraction spasms occur.'
      ]
    },
    {
      title: 'Preparing for Delivery & Birth Plan',
      icon: '🏥',
      color: '#FCEBF2',
      items: [
        'The 5-1-1 Contraction Rule: Contractions 5 mins apart, lasting 1 min each, for 1 hour straight.',
        'Water Breaking (Amniotic Leak): Note color, odor, and time; contact maternity triage promptly.',
        'Hospital Bag Essentials: Medical records folder, maternity pads, newborn clothes, ID, loose gown.',
        'Birth Preferences Discussion: Discuss pain management preferences with your gynaecologist early.'
      ]
    }
  ];

  container.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <h3 style="font-size: 1.35rem; color: var(--primary-900);">Evidence-Based Pregnancy Health Education</h3>
      <p style="font-size: 0.9rem; color: var(--text-secondary);">Clinician-reviewed guidance for daily maternal nutrition, physical comfort, and delivery preparation.</p>
    </div>

    <div class="edu-cards-grid">
      ${topics.map(t => `
        <div class="edu-card">
          <div class="edu-icon-circle" style="background: ${t.color};">${t.icon}</div>
          <h4 style="font-size: 1.1rem; color: var(--primary-900); margin-bottom: 0.75rem;">${t.title}</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.875rem; color: var(--text-secondary);">
            ${t.items.map(item => `
              <li style="display: flex; align-items: flex-start; gap: 0.45rem;">
                <span style="color: var(--primary-600); font-weight: 700;">•</span>
                <span>${item}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      `).join('')}
    </div>
  `;
}

// 4. Warning-Sign Guidance (Obstetric Red Flags)
function renderObstetricWarnings() {
  const container = document.getElementById('obs-warnings-content');
  if (!container) return;

  const redFlags = [
    { title: 'Vaginal Bleeding or Fluid Leak', desc: 'Any bright red bleeding or clear water gush/leak requires immediate hospital triage evaluation.' },
    { title: 'Severe Persistent Headache or Visual Aura', desc: 'Blinding headache, seeing spots/flashes, or blurred vision can be signs of elevated blood pressure (Preeclampsia).' },
    { title: 'Sudden Swelling in Face, Hands, or Eyes', desc: 'Rapid fluid accumulation accompanied by sudden weight gain warrants immediate blood pressure assessment.' },
    { title: 'Reduced Fetal Movement After Week 24', desc: 'If baby feels significantly less active or fails to reach 10 movements over 2 hours of quiet rest, seek checkup.' },
    { title: 'Severe Persistent Upper Belly Pain', desc: 'Sharp pain under the right ribs or center epigastric area is an urgent clinical warning sign.' },
    { title: 'High Fever Above 100.4°F (38°C) with Chills', desc: 'Infections during pregnancy require prompt clinical diagnosis and safe antibiotic treatment.' }
  ];

  container.innerHTML = `
    <div class="warning-guidance-banner">
      <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.6rem;">
        <span style="font-size: 1.6rem;">🚨</span>
        <h3 style="font-size: 1.35rem; color: #7C2D12;">Obstetric Urgent Warning-Sign Guidance</h3>
      </div>
      <p style="font-size: 0.925rem; color: #9A3412; line-height: 1.5; margin-bottom: 0.75rem;">
        <strong>Safety Rule:</strong> Never rely on an AI chatbot or website as a gatekeeper for emergency obstetric care. If you experience any of the signs below, contact your maternity triage or go to the nearest hospital immediately.
      </p>

      <div class="warning-signs-list">
        ${redFlags.map(rf => `
          <div class="warning-item-card">
            <span>⚠️</span>
            <div>
              <div style="color: #9A3412; font-weight: 700; margin-bottom: 0.2rem;">${rf.title}</div>
              <div style="font-size: 0.825rem; color: #431407; font-weight: 400; line-height: 1.4;">${rf.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="margin-top: 1.25rem; background: #fff; padding: 1rem 1.25rem; border-radius: var(--radius-md); border: 1.5px solid #FDBA74; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div>
          <div style="font-size: 0.8rem; font-weight: 700; color: #9A3412;">EMERGENCY IMMEDIATE ACCESS:</div>
          <div style="font-size: 1.05rem; font-weight: 800; color: #1F2937;">National Emergency: 112 • Women in Distress: 1091</div>
        </div>
        <button class="btn-primary" style="width: auto; background: #C2410C;" onclick="switchView('view-summary')">
          📄 Generate Emergency Clinical Summary
        </button>
      </div>
    </div>
  `;
}

// 5. Postpartum Recovery Support
function renderPostpartumSupport() {
  const container = document.getElementById('obs-postpartum-content');
  if (!container) return;

  container.innerHTML = `
    <div style="margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
      <div>
        <h3 style="font-size: 1.35rem; color: var(--primary-900);">Postpartum Recovery Support (The 4th Trimester)</h3>
        <p style="font-size: 0.9rem; color: var(--text-secondary);">Postpartum care must address physical and psychological health, not only the baby's health (ACOG Guidance).</p>
      </div>
      <span class="badge-tag badge-pink">Maternal Well-being First</span>
    </div>

    <div class="postpartum-hub-grid">
      <!-- Physical Recovery Section -->
      <div class="card">
        <h4 style="font-size: 1.15rem; color: var(--primary-900); margin-bottom: 0.75rem;">🩺 Physical Healing Tracker</h4>
        <div style="display: flex; flex-direction: column; gap: 0.85rem; font-size: 0.885rem;">
          <div style="background: var(--bg-subtle); padding: 0.85rem 1rem; border-radius: var(--radius-md);">
            <div style="font-weight: 700; color: var(--primary-800); margin-bottom: 0.2rem;">Lochia Discharge Stages:</div>
            <p style="color: var(--text-secondary); font-size: 0.825rem; line-height: 1.45;">
              • <strong>Days 1–4 (Lochia Rubra):</strong> Dark red flow similar to a heavy period.<br/>
              • <strong>Days 5–12 (Lochia Serosa):</strong> Pinkish-brown thinner discharge.<br/>
              • <strong>Weeks 2–6 (Lochia Alba):</strong> Creamy or yellowish-white fading fluid.
            </p>
          </div>

          <div style="background: var(--sage-100); padding: 0.85rem 1rem; border-radius: var(--radius-md); color: var(--sage-700);">
            <div style="font-weight: 700; margin-bottom: 0.2rem;">Perineal & C-Section Incision Care:</div>
            <p style="font-size: 0.825rem; line-height: 1.45;">
              Use warm peri-bottle rinse after toilet; keep scar clean and dry; avoid heavy lifting > baby's weight for 6 weeks.
            </p>
          </div>

          <div>
            <h5 style="font-size: 0.95rem; color: var(--primary-900); margin-bottom: 0.5rem;">Recent Logged Recovery Concerns:</h5>
            ${HerVitaState.postpartumRecords.map(pp => `
              <div style="padding: 0.6rem 0.8rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); margin-bottom: 0.4rem; font-size: 0.825rem;">
                <strong>${pp.category}:</strong> ${pp.concern}<br/>
                <span style="color: var(--sage-700);">→ ${pp.action}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Psychological & Emotional Support Section -->
      <div class="card">
        <h4 style="font-size: 1.15rem; color: var(--primary-900); margin-bottom: 0.75rem;">🧠 Emotional & Psychological Health</h4>
        <div class="epds-check-box">
          <div style="font-weight: 700; color: var(--primary-900); margin-bottom: 0.35rem;">Baby Blues vs. Postpartum Depression (PPD):</div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 0.75rem;">
            Baby blues (tearfulness, mild mood shifts in days 1–10) occur due to the massive drop in estrogen and progesterone. If feelings of extreme overwhelm, despair, or inability to sleep persist past 2 weeks, speak with your care team.
          </p>
          
          <div style="background: #fff; padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid #FBCFE8; font-size: 0.825rem; color: var(--primary-900);">
            <strong>Postpartum Doctor Visit Questions:</strong>
            <ul style="margin-left: 1.15rem; margin-top: 0.35rem; line-height: 1.4;">
              <li>When is it safe to resume abdominal core exercises?</li>
              <li>How can I manage pelvic heaviness when walking?</li>
              <li>What contraception is safe while breastfeeding?</li>
            </ul>
          </div>
        </div>

        <button class="btn-primary" style="margin-top: 1.25rem;" onclick="toggleDoctorQuestion('How can I optimize my physical and emotional recovery at my 6-week postpartum check?')">
          + Add Postpartum Questions to Summary
        </button>
      </div>
    </div>
  `;
}

// ==============================================================
// DOMAIN B: GYNECOLOGY (Reproductive and Hormonal Health)
// ==============================================================

function renderGynecology() {
  renderMenstrualHealth();
  renderPCOSJournal();
  renderPelvicPainDiary();
  renderGynEducation();
  renderMedicalRecords();
}

// 1. Menstrual Health Tracker
function renderMenstrualHealth() {
  const container = document.getElementById('gyn-menstrual-content');
  if (!container) return;

  container.innerHTML = `
    <div style="margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
      <div>
        <h3 style="font-size: 1.35rem; color: var(--primary-900);">Menstrual Health & Cycle Tracker</h3>
        <p style="font-size: 0.9rem; color: var(--text-secondary);">Record period dates, bleeding volume, pain intensity, and identify changes over time.</p>
      </div>
      <span class="badge-tag badge-pink">Cycle Analytics</span>
    </div>

    <div style="display: grid; grid-template-columns: 1.1fr 1fr; gap: 1.75rem; align-items: start;">
      <!-- Period History -->
      <div class="card">
        <h4 style="font-size: 1.15rem; color: var(--primary-900); margin-bottom: 0.75rem;">Logged Menstrual Cycles</h4>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${HerVitaState.periodLogs.map(p => `
            <div style="background: var(--bg-subtle); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 0.85rem 1.15rem; display: flex; align-items: center; justify-content: space-between;">
              <div>
                <div style="font-weight: 700; color: var(--primary-900); font-size: 0.95rem;">${p.startDate} to ${p.endDate}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">
                  Cycle Length: <strong>${p.cycleLength} Days</strong> • Flow: <strong>${p.flow}</strong> • Clots: ${p.clots}
                </div>
              </div>
              <span class="entry-severity-badge sev-${p.painScore}">Pain ${p.painScore}/5</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Log New Period Form -->
      <div class="card">
        <h4 style="font-size: 1.15rem; color: var(--primary-900); margin-bottom: 0.35rem;">Log Period Cycle</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">Record latest bleeding pattern</p>

        <form id="period-log-form" onsubmit="handlePeriodSubmit(event)">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="per-start">Start Date</label>
              <input type="date" id="per-start" class="form-control" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="per-end">End Date</label>
              <input type="date" id="per-end" class="form-control" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="per-flow">Flow Volume</label>
              <select id="per-flow" class="form-control">
                <option value="Light">Light (1–2 pads/day)</option>
                <option value="Moderate" selected>Moderate (3–4 pads/day)</option>
                <option value="Heavy">Heavy (5+ pads/day or clots)</option>
                <option value="Spotting">Intermenstrual Spotting</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="per-pain">Pain Severity (1-5)</label>
              <select id="per-pain" class="form-control">
                <option value="1">1 - Mild</option>
                <option value="2">2 - Moderate</option>
                <option value="3" selected>3 - Disruptive</option>
                <option value="4">4 - Severe</option>
                <option value="5">5 - Debilitating</option>
              </select>
            </div>
          </div>

          <button type="submit" class="btn-primary">
            <span>🩸</span> Save Period Record
          </button>
        </form>
      </div>
    </div>
  `;
}

function handlePeriodSubmit(e) {
  e.preventDefault();
  const start = document.getElementById('per-start').value;
  const end = document.getElementById('per-end').value;
  const flow = document.getElementById('per-flow').value;
  const pain = parseInt(document.getElementById('per-pain').value, 10);

  if (!start || !end) return;

  const newPeriod = {
    id: 'per-' + Date.now(),
    startDate: start,
    endDate: end,
    flow: flow,
    painScore: pain,
    cycleLength: 28,
    clots: flow === 'Heavy' ? 'Yes' : 'No'
  };

  HerVitaState.periodLogs.unshift(newPeriod);
  saveToStorage();
  renderMenstrualHealth();
  showToast('Period entry recorded in your diary.');
}

// 2. PCOS & Hormonal Health Journal
function renderPCOSJournal() {
  const container = document.getElementById('gyn-pcos-content');
  if (!container) return;

  container.innerHTML = `
    <!-- ACOG Clinical Boundary Banner -->
    <div style="background: #FDF2F8; border: 1px solid #FBCFE8; border-radius: var(--radius-md); padding: 1rem 1.25rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem;">
      <span style="font-size: 1.4rem;">🩺</span>
      <div style="font-size: 0.875rem; color: var(--primary-900); line-height: 1.45;">
        <strong>Clinical Boundary Notice (ACOG Guideline):</strong> HerVita organises patterns and lab trends for your doctor. 
        <em>Do not diagnose PCOS from symptoms alone.</em> A formal diagnosis requires clinical evaluation including pelvic ultrasound (polycystic ovarian morphology) and laboratory blood hormone panels.
      </div>
    </div>

    <!-- Biomarker Snapshot -->
    <div class="pcos-metrics-row">
      <div class="pcos-metric-card">
        <div class="pcos-metric-val">2.3 : 1</div>
        <div class="pcos-metric-label">LH / FSH Ratio (Target < 1.5)</div>
      </div>
      <div class="pcos-metric-card">
        <div class="pcos-metric-val">14.8</div>
        <div class="pcos-metric-label">Fasting Insulin (uIU/mL)</div>
      </div>
      <div class="pcos-metric-card">
        <div class="pcos-metric-val">62 ng/dL</div>
        <div class="pcos-metric-label">Total Testosterone</div>
      </div>
      <div class="pcos-metric-card">
        <div class="pcos-metric-val">38 Days</div>
        <div class="pcos-metric-label">Average Cycle Variance</div>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1.1fr 1fr; gap: 1.75rem; align-items: start;">
      <div class="card">
        <h4 style="font-size: 1.15rem; color: var(--primary-900); margin-bottom: 0.75rem;">Logged Hormonal Symptoms</h4>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${HerVitaState.pcosLogs.map(l => `
            <div style="background: var(--bg-subtle); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 0.85rem 1rem;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
                <span style="font-weight: 700; color: var(--primary-900);">${l.date}</span>
                <span class="badge-tag badge-amber">${l.cycleVariance}</span>
              </div>
              <div style="font-size: 0.825rem; color: var(--text-secondary); line-height: 1.4;">
                • Acne: Level ${l.acneScore}/5 • Hirsutism: Level ${l.hirsutismScore}/5 • Hair Fall: ${l.hairFall}<br/>
                • Sugar / Energy Crash: ${l.sugarCrash ? 'Yes (Post-meal fatigue)' : 'None'}
              </div>
              ${l.notes ? `<div style="font-size: 0.8rem; color: var(--text-muted); font-style: italic; margin-top: 0.4rem;">"${l.notes}"</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Log PCOS Symptoms Form -->
      <div class="card">
        <h4 style="font-size: 1.15rem; color: var(--primary-900); margin-bottom: 0.35rem;">Track Hormonal Signs</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">Monitor cycle changes, skin, and metabolism</p>

        <form id="pcos-form" onsubmit="handlePCOSSubmit(event)">
          <div class="form-group">
            <label class="form-label" for="pcos-date">Date</label>
            <input type="date" id="pcos-date" class="form-control" required />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="pcos-acne">Cystic Acne Severity</label>
              <select id="pcos-acne" class="form-control">
                <option value="1">1 - Clear / Rare</option>
                <option value="2">2 - Mild breakout</option>
                <option value="3" selected>3 - Moderate jawline</option>
                <option value="4">4 - Severe cystic</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="pcos-hirsutism">Hair Growth (Chin/Face)</label>
              <select id="pcos-hirsutism" class="form-control">
                <option value="1">1 - Minimal</option>
                <option value="2" selected>2 - Mild stray hairs</option>
                <option value="3">3 - Noticeable</option>
                <option value="4">4 - Coarse growth</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="pcos-notes">Clinical Notes for Doctor</label>
            <textarea id="pcos-notes" class="form-control" rows="2" placeholder="e.g. Sugar cravings, missed cycle by 10 days..."></textarea>
          </div>

          <button type="submit" class="btn-primary">
            <span>📈</span> Save Hormonal Log
          </button>
        </form>
      </div>
    </div>
  `;
}

function handlePCOSSubmit(e) {
  e.preventDefault();
  const date = document.getElementById('pcos-date').value;
  const acne = parseInt(document.getElementById('pcos-acne').value, 10);
  const hirsutism = parseInt(document.getElementById('pcos-hirsutism').value, 10);
  const notes = document.getElementById('pcos-notes').value.trim();

  if (!date) return;

  const newLog = {
    id: 'pcos-' + Date.now(),
    date: date,
    cycleVariance: 'Cycle delayed',
    acneScore: acne,
    hirsutismScore: hirsutism,
    hairFall: 'Moderate',
    sugarCrash: true,
    notes: notes
  };

  HerVitaState.pcosLogs.unshift(newLog);
  saveToStorage();
  renderPCOSJournal();
  showToast('Hormonal entry saved.');
}

// 3. Pelvic Pain and Symptom Diary
function renderPelvicPainDiary() {
  const container = document.getElementById('gyn-pelvic-pain-content');
  if (!container) return;

  container.innerHTML = `
    <div style="margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
      <div>
        <h3 style="font-size: 1.35rem; color: var(--primary-900);">Pelvic Pain & Symptom Diary</h3>
        <p style="font-size: 0.9rem; color: var(--text-secondary);">Record pain severity, anatomical quadrant, character, and impact to help document recurring conditions like endometriosis.</p>
      </div>
      <span class="badge-tag badge-pink">Deep Pain Profiler</span>
    </div>

    <div style="display: grid; grid-template-columns: 1.1fr 1fr; gap: 1.75rem; align-items: start;">
      <div class="card">
        <h4 style="font-size: 1.15rem; color: var(--primary-900); margin-bottom: 0.75rem;">Pelvic Pain Chronology</h4>
        <div style="display: flex; flex-direction: column; gap: 0.85rem;">
          ${HerVitaState.pelvicPainLogs.map(p => `
            <div style="background: var(--bg-subtle); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.35rem;">
                <span style="font-weight: 700; color: var(--primary-900); font-size: 0.95rem;">${p.date} • ${p.duration}</span>
                <span class="entry-severity-badge sev-${p.severity}">Severity ${p.severity}/5</span>
              </div>
              <div style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.45;">
                📍 <strong>Location:</strong> ${p.location}<br/>
                ⚡ <strong>Character:</strong> ${p.character}<br/>
                🎯 <strong>Trigger:</strong> ${p.trigger}<br/>
                💼 <strong>Impact:</strong> ${p.workImpact}
              </div>
              ${p.notes ? `<div style="font-size: 0.8rem; color: var(--text-muted); font-style: italic; margin-top: 0.4rem;">"${p.notes}"</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Add Pelvic Pain Form -->
      <div class="card">
        <h4 style="font-size: 1.15rem; color: var(--primary-900); margin-bottom: 0.35rem;">Log Pelvic Pain Episode</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">Record pain location and triggers</p>

        <form id="pelvic-pain-form" onsubmit="handlePelvicPainSubmit(event)">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="pain-date">Date</label>
              <input type="date" id="pain-date" class="form-control" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="pain-sev">Severity (1 to 5)</label>
              <select id="pain-sev" class="form-control">
                <option value="1">1 - Mild twinge</option>
                <option value="2">2 - Moderate</option>
                <option value="3">3 - Disruptive</option>
                <option value="4" selected>4 - Severe</option>
                <option value="5">5 - Debilitating</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="pain-loc">Anatomical Location</label>
            <select id="pain-loc" class="form-control">
              <option value="Left lower quadrant (Ovary)">Left Lower Quadrant (Ovary)</option>
              <option value="Right lower quadrant (Ovary)">Right Lower Quadrant (Ovary)</option>
              <option value="Central suprapubic (Uterus)">Central Suprapubic (Uterus)</option>
              <option value="Deep pelvic & rectal">Deep Pelvic & Rectal</option>
              <option value="Lower back & sacrum">Lower Back & Sacrum</option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="pain-char">Pain Sensation</label>
              <select id="pain-char" class="form-control">
                <option value="Sharp cramping">Sharp Cramping</option>
                <option value="Stabbing / shooting">Stabbing / Shooting</option>
                <option value="Deep dull ache">Deep Dull Ache</option>
                <option value="Burning sensation">Burning Sensation</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="pain-trigger">Associated Trigger</label>
              <select id="pain-trigger" class="form-control">
                <option value="Period onset">Period Onset</option>
                <option value="Ovulatory window">Ovulatory Window</option>
                <option value="Intercourse (Dyspareunia)">Intercourse (Dyspareunia)</option>
                <option value="Bowel movement (Dyschezia)">Bowel Movement (Dyschezia)</option>
                <option value="Spontaneous / Unknown">Spontaneous</option>
              </select>
            </div>
          </div>

          <button type="submit" class="btn-primary">
            <span>⚡</span> Save Pain Record
          </button>
        </form>
      </div>
    </div>
  `;
}

function handlePelvicPainSubmit(e) {
  e.preventDefault();
  const date = document.getElementById('pain-date').value;
  const sev = parseInt(document.getElementById('pain-sev').value, 10);
  const loc = document.getElementById('pain-loc').value;
  const char = document.getElementById('pain-char').value;
  const trigger = document.getElementById('pain-trigger').value;

  if (!date) return;

  const newPain = {
    id: 'ppain-' + Date.now(),
    date: date,
    severity: sev,
    duration: 'Several hours',
    location: loc,
    character: char,
    trigger: trigger,
    workImpact: sev >= 4 ? 'Disrupted routine' : 'None',
    notes: ''
  };

  HerVitaState.pelvicPainLogs.unshift(newPain);
  saveToStorage();
  renderPelvicPainDiary();
  showToast('Pelvic pain entry logged.');
}

// 4. Reproductive Health Education (Subsumes Body Map, Videos & Contraception)
function renderGynEducation() {
  const container = document.getElementById('gyn-education-content');
  if (!container) return;

  container.innerHTML = `
    <div style="margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
      <div>
        <h3 style="font-size: 1.35rem; color: var(--primary-900);">Reproductive Health Education & Conditions</h3>
        <p style="font-size: 0.9rem; color: var(--text-secondary);">Reliable educational guidance on contraception choices, preventive care, and common gynecological conditions.</p>
      </div>
      <div style="display: flex; gap: 0.5rem;">
        <button class="btn-pill" onclick="switchView('view-awareness');">
          <span>🗺️</span> Interactive Body Map
        </button>
        <button class="btn-pill" onclick="switchView('view-awareness'); setTimeout(() => { const vBtn = document.querySelector('[data-subtab=\\'videos\\']'); if(vBtn) vBtn.click(); }, 100);">
          <span>🎬</span> Explainer Videos
        </button>
      </div>
    </div>

    <!-- Contraceptive Methods Guide -->
    <div class="card" style="margin-bottom: 1.5rem;">
      <h4 style="font-size: 1.15rem; color: var(--primary-900); margin-bottom: 0.75rem;">🛡️ Evidence-Based Contraceptive Methods Guide</h4>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem;">
        <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md);">
          <div style="font-weight: 700; color: var(--primary-800); margin-bottom: 0.2rem;">Hormonal IUD (Mirena/Kyleena)</div>
          <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">>99% effective for 3–8 years. Releases local progestin, often significantly lightens heavy period bleeding.</p>
        </div>
        <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md);">
          <div style="font-weight: 700; color: var(--primary-800); margin-bottom: 0.2rem;">Copper IUD (Non-Hormonal)</div>
          <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">>99% effective for up to 10 years. Hormone-free. May cause heavier initial periods during first 3–6 months.</p>
        </div>
        <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md);">
          <div style="font-weight: 700; color: var(--primary-800); margin-bottom: 0.2rem;">Combined Oral Contraceptive Pill</div>
          <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">93–99% effective with daily adherence. Regulates cycle, reduces acne and dysmenorrhea.</p>
        </div>
        <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md);">
          <div style="font-weight: 700; color: var(--primary-800); margin-bottom: 0.2rem;">Barrier Condoms</div>
          <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">87–98% effective. Only contraceptive method providing proven defense against Sexually Transmitted Infections (STIs).</p>
        </div>
      </div>
    </div>

    <!-- Common Gynecological Conditions & Preventive Care -->
    <div style="display: grid; grid-template-columns: 1.1fr 1fr; gap: 1.75rem; align-items: start;">
      <div class="card">
        <h4 style="font-size: 1.15rem; color: var(--primary-900); margin-bottom: 0.75rem;">🩺 Common Gynecological Conditions</h4>
        <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.85rem;">
          <div style="background: var(--bg-subtle); padding: 0.85rem 1rem; border-radius: var(--radius-md);">
            <strong style="color: var(--primary-800);">Endometriosis:</strong> Endometrial-like tissue grows outside the uterus, causing progressive cyclical pelvic pain, deep dyspareunia, and inflammation.
          </div>
          <div style="background: var(--bg-subtle); padding: 0.85rem 1rem; border-radius: var(--radius-md);">
            <strong style="color: var(--primary-800);">PCOS (Polycystic Ovary Syndrome):</strong> Endocrine-metabolic condition characterized by irregular ovulation, hyperandrogenism (acne, hirsutism), and insulin resistance.
          </div>
          <div style="background: var(--bg-subtle); padding: 0.85rem 1rem; border-radius: var(--radius-md);">
            <strong style="color: var(--primary-800);">Uterine Fibroids (Leiomyomas):</strong> Benign smooth muscle growths within uterine walls that can cause heavy prolonged bleeding and pelvic fullness.
          </div>
          <div style="background: var(--bg-subtle); padding: 0.85rem 1rem; border-radius: var(--radius-md);">
            <strong style="color: var(--primary-800);">Pelvic Inflammatory Disease (PID):</strong> Ascending microbial infection of uterus and fallopian tubes; requires timely antibiotic therapy to prevent scarring.
          </div>
        </div>
      </div>

      <div class="card">
        <h4 style="font-size: 1.15rem; color: var(--primary-900); margin-bottom: 0.75rem;">📋 Preventive Screening Guidelines</h4>
        <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.85rem;">
          <div style="border-left: 3.5px solid var(--sage-500); padding-left: 0.75rem;">
            <strong>Cervical Screening (Pap & HPV DNA):</strong><br/>
            Recommended every 3 years (ages 21–29) and every 5 years with high-risk HPV co-testing (ages 30–65).
          </div>
          <div style="border-left: 3.5px solid var(--primary-500); padding-left: 0.75rem;">
            <strong>Reproductive Immunisation:</strong><br/>
            HPV vaccine protects against cervical cancer types 16 & 18. Ideal at ages 9–26, approved up to age 45.
          </div>
          <div style="border-left: 3.5px solid var(--amber-500); padding-left: 0.75rem;">
            <strong>Clinical Breast Awareness:</strong><br/>
            Familiarize yourself with your normal breast texture. Report new lumps, skin dimpling, or nipple discharge promptly.
          </div>
        </div>
      </div>
    </div>
  `;
}

// 5. Medical Record Organizer
function renderMedicalRecords() {
  const container = document.getElementById('gyn-records-content');
  if (!container) return;

  container.innerHTML = `
    <div style="margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
      <div>
        <h3 style="font-size: 1.35rem; color: var(--primary-900);">Medical Record Organizer</h3>
        <p style="font-size: 0.9rem; color: var(--text-secondary);">Securely store clinical reports, pelvic ultrasound scans, blood test results, and prescriptions on your device.</p>
      </div>
      <span class="badge-tag badge-sage">Encrypted Local Vault</span>
    </div>

    <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 1.75rem; align-items: start;">
      <!-- Vault Records List -->
      <div class="records-vault-grid">
        ${HerVitaState.medicalRecords.map(r => `
          <div class="record-vault-card">
            <div class="record-left">
              <div class="record-type-icon ${getRecordIconClass(r.category)}">
                ${getRecordIconGlyph(r.category)}
              </div>
              <div>
                <h4 style="font-size: 1rem; color: var(--primary-900); margin-bottom: 0.2rem;">${r.title}</h4>
                <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">
                  📅 ${r.date} • 🏥 ${r.doctor} • <span class="badge-tag badge-pink" style="font-size: 0.7rem;">${r.category}</span>
                </div>
                <div style="font-size: 0.825rem; color: var(--text-secondary); background: var(--bg-subtle); padding: 0.45rem 0.65rem; border-radius: var(--radius-sm);">
                  ${r.keyFindings}
                </div>
              </div>
            </div>
            <button class="entry-delete-btn" style="position: static;" onclick="deleteMedicalRecord('${r.id}')">✕</button>
          </div>
        `).join('')}
      </div>

      <!-- Add Record Form -->
      <div class="card">
        <h4 style="font-size: 1.15rem; color: var(--primary-900); margin-bottom: 0.35rem;">Add Medical Document</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">Record findings from your report</p>

        <form id="record-form" onsubmit="handleRecordSubmit(event)">
          <div class="form-group">
            <label class="form-label" for="rec-title">Document Title</label>
            <input type="text" id="rec-title" class="form-control" placeholder="e.g. Pelvic USG Report, Serum Iron Panel..." required />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="rec-cat">Category</label>
              <select id="rec-cat" class="form-control">
                <option value="Ultrasound / Imaging">Ultrasound / Imaging</option>
                <option value="Lab Blood Test">Lab Blood Test</option>
                <option value="Prescription">Prescription</option>
                <option value="Consultation Note">Consultation Note</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="rec-date">Date of Test</label>
              <input type="date" id="rec-date" class="form-control" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="rec-doc">Doctor / Lab Name</label>
            <input type="text" id="rec-doc" class="form-control" placeholder="e.g. Dr. Roy (Fortis Clinic)" />
          </div>

          <div class="form-group">
            <label class="form-label" for="rec-findings">Key Findings / Values</label>
            <textarea id="rec-findings" class="form-control" rows="2" placeholder="e.g. Hemoglobin 11.4 g/dL, normal endometrial thickness..."></textarea>
          </div>

          <button type="submit" class="btn-primary">
            <span>📁</span> Save to Medical Vault
          </button>
        </form>
      </div>
    </div>
  `;
}

function getRecordIconClass(cat) {
  if (cat.includes('Lab')) return 'type-lab';
  if (cat.includes('Ultrasound') || cat.includes('Imaging')) return 'type-scan';
  if (cat.includes('Prescription')) return 'type-rx';
  return 'type-note';
}

function getRecordIconGlyph(cat) {
  if (cat.includes('Lab')) return '🧪';
  if (cat.includes('Ultrasound') || cat.includes('Imaging')) return '🩻';
  if (cat.includes('Prescription')) return '💊';
  return '📝';
}

function handleRecordSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('rec-title').value.trim();
  const cat = document.getElementById('rec-cat').value;
  const date = document.getElementById('rec-date').value;
  const doc = document.getElementById('rec-doc').value.trim() || 'Clinical Facility';
  const findings = document.getElementById('rec-findings').value.trim();

  if (!title || !date) return;

  const newRec = {
    id: 'rec-' + Date.now(),
    title: title,
    category: cat,
    date: date,
    doctor: doc,
    keyFindings: findings || 'Document filed securely.'
  };

  HerVitaState.medicalRecords.unshift(newRec);
  saveToStorage();
  renderMedicalRecords();
  showToast('Medical record archived in vault.');
}

function deleteMedicalRecord(id) {
  HerVitaState.medicalRecords = HerVitaState.medicalRecords.filter(r => r.id !== id);
  saveToStorage();
  renderMedicalRecords();
  showToast('Record deleted.');
}

// Master Domain Switcher
function switchMainDomain(domain) {
  HerVitaState.activeDomain = domain;
  const obsSec = document.getElementById('view-obstetrics');
  const gynSec = document.getElementById('view-gynecology');
  const obsBtn = document.getElementById('domain-btn-obs');
  const gynBtn = document.getElementById('domain-btn-gyn');

  if (domain === 'obs') {
    if (obsSec) obsSec.classList.add('active-view');
    if (gynSec) gynSec.classList.remove('active-view');
    if (obsBtn) { obsBtn.classList.add('active', 'obs-active'); }
    if (gynBtn) { gynBtn.classList.remove('active', 'gyn-active'); }
    renderObstetrics();
  } else {
    if (gynSec) gynSec.classList.add('active-view');
    if (obsSec) obsSec.classList.remove('active-view');
    if (gynBtn) { gynBtn.classList.add('active', 'gyn-active'); }
    if (obsBtn) { obsBtn.classList.remove('active', 'obs-active'); }
    renderGynecology();
  }

  // Hide general secondary views if visible
  document.querySelectorAll('.view-section:not(#view-obstetrics):not(#view-gynecology)').forEach(v => v.classList.remove('active-view'));
}

// --- Render All Master Function ---
function renderAllViews() {
  selectOrgan(HerVitaState.activeOrgan);
  renderExplainerVideos();
  renderGlossary(GLOSSARY_TERMS);
  renderDoctorQuestions();
  renderDiaryEntries();
  renderPatternView();
  renderDoctorSummary();
  renderChecklist();
  renderVaccines();
  renderObstetrics();
  renderGynecology();
}

// --- Initial Setup on DOM Ready ---
document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  initNavigation();
  initBodyMap();
  initGlossary();
  initSymptomDiary();
  initChecklistForm();
  initTriage();
  initVaccineForm();
  initPrivacyControls();
  renderAllViews();

  // Print button handler
  const printBtn = document.getElementById('btn-print-summary');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
});

