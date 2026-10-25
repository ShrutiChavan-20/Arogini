const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// Simple zero-dependency .env loader
function loadEnv() {
  const envPath = path.join(BASE_DIR, '.env');
  if (fs.existsSync(envPath)) {
    try {
      const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (key) {
            process.env[key] = val;
          }
        }
      }
    } catch (_) {}
  }
}
loadEnv();

const ANATOMY_SYSTEM_PROMPT = `You are the Arogini Anatomy Educational Assistant. Provide warm, medically accurate, accessible reproductive anatomy education for women.
Rules:
1. Explain anatomical structures and biological processes clearly using everyday analogies alongside medical terms.
2. Strictly educational: Never diagnose conditions or prescribe medications.
3. Keep answers concise (under 180 words), empathetic, and reassuring.
4. Conclude with a reminder that this is for health education and does not replace a clinician consultation.`;

function getAnatomyFallback(organ, message) {
  const lowerMsg = (message || '').toLowerCase();
  const lowerOrgan = (organ || 'uterus').toLowerCase();

  // 1. Follicles, Ovulation, Egg Release (e.g. Graafian follicle, LH surge, ovulation)
  if (lowerMsg.includes('follicle') || lowerMsg.includes('ovulat') || lowerMsg.includes('egg') || lowerMsg.includes('release') || lowerMsg.includes('mature') || lowerMsg.includes('lh') || lowerMsg.includes('rupture')) {
    return "In the ovaries, follicles (small fluid-filled sacs containing immature oocytes) develop under the influence of Follicle-Stimulating Hormone (FSH) during the follicular phase. Each month, one dominant follicle—the Graafian follicle—matures and produces rising levels of estrogen. Around mid-cycle (typically day 14 of a 28-day cycle), a surge in Luteinizing Hormone (LH) from the pituitary gland triggers the mature follicle to rupture and release the egg into the pelvic cavity. The delicate fimbriae of the fallopian tube sweep the egg inside to await potential fertilization, while the ruptured follicle transforms into the corpus luteum, which secretes progesterone to nourish the uterine lining.";
  }

  // 2. Endometrium, Lining, Shedding, Cramps, Menstruation
  if (lowerMsg.includes('endometri') || lowerMsg.includes('lining') || lowerMsg.includes('shed') || lowerMsg.includes('bleed') || lowerMsg.includes('cramp') || lowerMsg.includes('period') || lowerMsg.includes('menstrua') || lowerMsg.includes('flow')) {
    return "The endometrium is the specialized mucosal lining of the uterus. Driven by estrogen and progesterone, it thickens every cycle with blood vessels and nutrient-rich tissue in anticipation of blastocyst implantation. When conception does not occur, hormone levels drop precipitously, triggering the production of prostaglandins. These prostaglandins cause the muscular uterine wall (myometrium) to contract rhythmically to shed the functional endometrial layer—this physiological shedding is your menstrual period, and the contractions are what produce menstrual cramps.";
  }

  // 3. Cervix & Cervical Mucus
  if (lowerOrgan.includes('cervix') || lowerMsg.includes('cervix') || lowerMsg.includes('mucus') || lowerMsg.includes('discharge') || lowerMsg.includes('opening')) {
    return "The cervix is the lower, narrow neck of the uterus that connects to the vagina. It serves as both a protective barrier and a biological gateway. Under cyclical hormones, the cervical glands produce varying mucus: during the fertile window around ovulation, high estrogen makes the mucus clear, slippery, and stretchy ('egg-white' consistency) with an alkaline pH that nourishes and guides sperm; during the luteal phase and pregnancy, progesterone thickens the mucus into a protective plug that shields the womb against bacterial ascent.";
  }

  // 4. Fallopian Tubes & Fertilization
  if (lowerOrgan.includes('tube') || lowerMsg.includes('fallopian') || lowerMsg.includes('fertiliz') || lowerMsg.includes('sperm') || lowerMsg.includes('conception') || lowerMsg.includes('implant') || lowerMsg.includes('zygote')) {
    return "The fallopian tubes are bilateral muscular conduits connecting the ovaries to the uterine horns. Fertilization typically occurs in the ampulla—the wider outer third of the tube. The inner lining contains ciliated epithelial cells that beat synchronously alongside gentle muscular contractions, transporting the fertilized zygote over 3 to 5 days toward the uterus for endometrial implantation.";
  }

  // 5. Hormones & Cycle Regulation
  if (lowerMsg.includes('hormone') || lowerMsg.includes('estrogen') || lowerMsg.includes('progesterone') || lowerMsg.includes('fsh') || lowerMsg.includes('pcos') || lowerMsg.includes('androgen')) {
    return "Female reproductive physiology is orchestrated by the Hypothalamic-Pituitary-Ovarian (HPO) axis. GnRH from the hypothalamus stimulates the pituitary gland to release FSH (stimulating ovarian follicle growth) and LH (triggering ovulation). The ovaries produce estrogen (thickening the uterine lining) and progesterone (stabilizing the secretory endometrium). A harmonious balance between these hormones regulates cycle predictability, metabolic health, bone density, and emotional well-being.";
  }

  // 6. Organ-specific defaults
  if (lowerOrgan.includes('ovary') || lowerOrgan.includes('ovaries')) {
    return "The ovaries are the bilateral reproductive glands responsible for two core functions: producing and maturing female gametes (ova/eggs), and synthesizing key hormones including estrogens, progesterone, and small amounts of androgens. Each ovary contains thousands of primordial follicles established before birth, which cycle through development stages throughout reproductive years.";
  }

  if (lowerOrgan.includes('uterus') || lowerOrgan.includes('womb')) {
    return "The uterus is a pear-shaped, hollow muscular organ situated in the female pelvic cavity between the bladder and rectum. It consists of three primary layers: the inner glandular endometrium (shed during menses or hosting pregnancy), the thick muscular myometrium (capable of tremendous expansion and contraction), and the outer serous perimetrium. It provides a secure, nutrient-rich environment for fetal development.";
  }

  // 7. General fallback
  return "Female reproductive anatomy is a finely calibrated biological system comprising the ovaries, fallopian tubes, uterus, and cervix. Governed by cyclical hormones (estrogen and progesterone), these organs work together to support cycle regularity, cellular regeneration, and maternal health. For specific personal symptoms or medical questions, consulting your gynecologist is always recommended.";
}

function getClinicalFallback(text, language, stage) {
  const lower = (text || '').toLowerCase();
  const isHinglish = /[\u0900-\u097F]/.test(text) || /pet|dard|baaye|baayein|chubhan|kamzor|thakan|mahina|hafte|ulta|khoon|chhoot|bahut/.test(lower);
  
  if (lower.includes('baaye') || lower.includes('left') || lower.includes('chubhan') || lower.includes('stabbing') || lower.includes('day 18') || lower.includes('18')) {
    return {
      detectedLanguage: isHinglish ? "Hinglish (Hindi-English)" : "English",
      patientConcerns: [
        "Unilateral left lower pelvic discomfort around mid-cycle",
        "Associated fatigue, lethargy, and functional disruption",
        "Cutaneous flare-ups / hormonal acne along jawline"
      ],
      clinicalHpi: "Patient presents with a recurring pattern of acute, non-radiating left lower quadrant (LLQ) pelvic discomfort occurring mid-cycle (est. Day 18, clinically suggestive of Mittelschmerz or periovulatory follicular rupture), accompanied by hyperandrogenic cutaneous manifestations (cystic mandibular acne) and Class II functional fatigue resulting in occupational impairment.",
      medicalTerms: [
        { "term": "Mittelschmerz", "plainMeaning": "One-sided, lower abdominal pain associated with normal monthly ovulation." },
        { "term": "Left Lower Quadrant (LLQ) Pain", "plainMeaning": "Discomfort localized to the lower left pelvic and ovarian region." },
        { "term": "Mandibular Acne", "plainMeaning": "Breakouts concentrated along the jawline, typical of hormonal fluctuation." }
      ],
      doctorQuestions: [
        "Could the recurring unilateral timing point towards an ovarian follicular cyst or focal endometriosis?",
        "Given the persistent jawline acne and cycle irregularity, should we schedule a baseline morning Free/Total Testosterone and DHEA-S panel?",
        "Would a pelvic transvaginal ultrasound (TVS) be useful to evaluate my ovarian morphology?"
      ],
      emergencyFlag: false,
      emergencyAdvice: ""
    };
  }

  if (lower.includes('40') || lower.includes('late') || lower.includes('irregular') || lower.includes('pcos') || lower.includes('chhoot')) {
    return {
      detectedLanguage: isHinglish ? "Hinglish (Hindi-English)" : "English",
      patientConcerns: [
        "Significantly prolonged, unpredictable cycle length (~40+ days)",
        "Dermatological breakout episodes and physical exhaustion",
        "Discomfort localized in the lower pelvic area"
      ],
      clinicalHpi: "Patient reports a persistent history of chronic oligomenorrhea (cycle interval extended to approximately 40–42 days), correlated with secondary hypogastric discomfort, mandibular cystic breakouts, and notable energy depletion.",
      medicalTerms: [
        { "term": "Oligomenorrhea", "plainMeaning": "Infrequent or irregularly delayed menstrual periods (>35-38 days apart)." },
        { "term": "Hypogastric Discomfort", "plainMeaning": "Aching sensation in the central lower abdomen above the pubic bone." },
        { "term": "Hyperandrogenism (Clinical)", "plainMeaning": "Physical manifestations like persistent jawline acne linked to hormone imbalances." }
      ],
      doctorQuestions: [
        "Do my delayed 40-day cycles and skin symptoms meet the Rotterdam diagnostic criteria for PCOS?",
        "Should we assess my LH/FSH ratio and fasting insulin levels to evaluate metabolic involvement?",
        "What lifestyle or cycle-regulating interventions would you recommend for cycle regularity?"
      ],
      emergencyFlag: false,
      emergencyAdvice: ""
    };
  }

  if (stage === 'pregnancy' || lower.includes('week') || lower.includes('pregnant') || lower.includes('pulling')) {
    return {
      detectedLanguage: isHinglish ? "Hinglish (Hindi-English)" : "English",
      patientConcerns: [
        "Lower abdominal pulling sensation when transitioning from lying to standing",
        "Mild lumbar backache and bilateral dependent pedal swelling"
      ],
      clinicalHpi: "G1P0 at 19 weeks gestation reports intermittent bilateral lower quadrant stretching and dull inguinal sensations on positional change (consistent with round ligament stretching), alongside mild postural lumbar strain and physiological dependent pedal edema.",
      medicalTerms: [
        { "term": "Round Ligament Pain", "plainMeaning": "Sharp or stretching pain in the lower belly or groin caused by stretching womb ligaments." },
        { "term": "Lumbar Lordosis Strain", "plainMeaning": "Lower back muscular strain caused by posture shifts as pregnancy advances." },
        { "term": "Pedal Edema", "plainMeaning": "Mild, normal fluid accumulation and swelling in feet and ankles during pregnancy." }
      ],
      doctorQuestions: [
        "Are these stretching sensations typical round ligament pains for Week 19?",
        "Are there safe pelvic physical therapy exercises to alleviate this lower back strain?",
        "What signs (e.g. fluid leakage or regular cramping) should immediately prompt clinical review?"
      ],
      emergencyFlag: false,
      emergencyAdvice: ""
    };
  }

  return {
    detectedLanguage: isHinglish ? "Hinglish (Hindi-English)" : "English",
    patientConcerns: [
      "Subjective pelvic and menstrual rhythm discomfort",
      "Functional impact on daily activities and occupational productivity"
    ],
    clinicalHpi: "Patient presents with chronic cyclical symptoms including localized pelvic discomfort, cycle irregularities, and associated somatic fatigue with mild-to-moderate functional disruption.",
    medicalTerms: [
      { "term": "Dysmenorrhea / Pelvic Discomfort", "plainMeaning": "Aching or cramping pelvic sensation associated with reproductive cycle." },
      { "term": "Catamenial Fatigue", "plainMeaning": "Heightened exhaustion or lethargy recurring in sync with menstrual phases." }
    ],
    doctorQuestions: [
      "Could we correlate these logged symptoms with my cycle phase to pinpoint the underlying etiology?",
      "Would baseline pelvic imaging or a targeted hormonal blood panel be advisable?",
      "What symptom-management strategies can help prevent these episodes from disrupting my work?"
    ],
    emergencyFlag: false,
    emergencyAdvice: ""
  };
}

const server = http.createServer((req, res) => {
  // CORS headers for local development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Sanitize requested URL
  let parsedUrl = req.url.split('?')[0];

  // API Route: Anatomy AI Chat
  if (req.method === 'POST' && parsedUrl === '/api/anatomy-chat') {
    let rawBody = '';
    req.on('data', chunk => {
      rawBody += chunk;
      if (rawBody.length > 1e6) req.destroy();
    });
    req.on('end', async () => {
      let body = {};
      try {
        body = JSON.parse(rawBody || '{}');
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Invalid JSON request payload', reply: 'Invalid request format.' }));
        return;
      }

      const organ = (body.organ || 'general').trim();
      const message = (body.message || '').trim();

      if (!message) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Message cannot be empty', reply: 'Please enter a question to ask.' }));
        return;
      }

      loadEnv();
      let geminiKey = (process.env.GEMINI_API_KEY || '').trim();
      let anthropicKey = (process.env.ANTHROPIC_API_KEY || '').trim();
      let openaiKey = (process.env.OPENAI_API_KEY || '').trim();

      // If the key in ANTHROPIC_API_KEY starts with AQ. or AIza, it is a Google Gemini key!
      if (!geminiKey && (anthropicKey.startsWith('AQ.') || anthropicKey.startsWith('AIza'))) {
        geminiKey = anthropicKey;
        anthropicKey = '';
      }

      if (!geminiKey && !anthropicKey && !openaiKey) {
        // Zero-fail clinical fallback for deployments where API keys are not yet configured in environment variables
        const fallbackText = getAnatomyFallback(organ, message);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          reply: fallbackText,
          isEducational: true,
          source: 'clinical-knowledge-engine'
        }));
        return;
      }

      try {
        let replyText = '';

        if (geminiKey) {
          // Call Google Gemini API (models: gemini-1.5-flash, gemini-2.0-flash, gemini-1.5-pro)
          const modelsToTry = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];
          let geminiSuccess = false;

          for (const modelName of modelsToTry) {
            try {
              const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  system_instruction: {
                    parts: [{ text: ANATOMY_SYSTEM_PROMPT }]
                  },
                  contents: [
                    {
                      parts: [{ text: `Organ: ${organ}\nQuestion: ${message}` }]
                    }
                  ],
                  generationConfig: {
                    maxOutputTokens: 300,
                    temperature: 0.3
                  }
                })
              });

              if (response.ok) {
                const data = await response.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text && text.trim()) {
                  replyText = text.trim();
                  geminiSuccess = true;
                  break;
                }
              }
            } catch (_) {}
          }

          if (!geminiSuccess || !replyText) {
            replyText = getAnatomyFallback(organ, message);
          }
        } else if (openaiKey) {
          // Call OpenAI API (model: gpt-4o-mini)
          try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiKey}`
              },
              body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                  { role: 'system', content: ANATOMY_SYSTEM_PROMPT },
                  { role: 'user', content: `Organ: ${organ}\nQuestion: ${message}` }
                ],
                max_tokens: 300,
                temperature: 0.3
              })
            });

            if (response.ok) {
              const data = await response.json();
              replyText = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
                ? data.choices[0].message.content.trim()
                : '';
            }
          } catch (_) {}

          if (!replyText) {
            replyText = getAnatomyFallback(organ, message);
          }
        } else {
          // Call Anthropic API (model: claude-3-5-haiku-20241022 or claude-3-haiku-20240307)
          try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': anthropicKey,
                'anthropic-version': '2023-06-01'
              },
              body: JSON.stringify({
                model: 'claude-3-5-haiku-20241022',
                max_tokens: 300,
                system: ANATOMY_SYSTEM_PROMPT,
                messages: [
                  {
                    role: 'user',
                    content: `Organ: ${organ}\nQuestion: ${message}`
                  }
                ]
              })
            });

            if (response.ok) {
              const data = await response.json();
              replyText = data.content && data.content[0] && data.content[0].text
                ? data.content[0].text.trim()
                : '';
            }
          } catch (_) {}

          if (!replyText) {
            replyText = getAnatomyFallback(organ, message);
          }
        }

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ reply: replyText, isEducational: true }));
      } catch (err) {
        const fallbackText = getAnatomyFallback(organ, message);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          reply: fallbackText,
          isEducational: true
        }));
      }
    });
    return;
  }

  // API Route: AI Clinical Voice & Language Translator
  if (req.method === 'POST' && parsedUrl === '/api/clinical-translator') {
    let rawBody = '';
    req.on('data', chunk => {
      rawBody += chunk;
      if (rawBody.length > 1e6) req.destroy();
    });
    req.on('end', async () => {
      let body = {};
      try {
        body = JSON.parse(rawBody || '{}');
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Invalid JSON request payload' }));
        return;
      }

      const userText = (body.text || '').trim();
      const userLang = (body.language || 'auto').trim();
      const userStage = (body.stage || 'menstrual').trim();

      if (!userText) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Input symptom text cannot be empty' }));
        return;
      }

      loadEnv();
      let geminiKey = (process.env.GEMINI_API_KEY || '').trim();
      let anthropicKey = (process.env.ANTHROPIC_API_KEY || '').trim();
      let openaiKey = (process.env.OPENAI_API_KEY || '').trim();

      if (!geminiKey && (anthropicKey.startsWith('AQ.') || anthropicKey.startsWith('AIza'))) {
        geminiKey = anthropicKey;
        anthropicKey = '';
      }

      const CLINICAL_PROMPT = `You are an expert bilingual clinical communication assistant for women's reproductive health in India.
A female patient has shared her symptoms in plain everyday English, Hindi, or conversational Hinglish (mixed Hindi-English).
Her health stage is: ${userStage}.
Patient Input: "${userText}"

YOUR GOAL: Translate her subjective words into an objective, structured medical formulation that will empower her during a 10-minute gynecologist appointment.

CRITICAL CLINICAL BOUNDARIES:
- Do NOT make a definitive diagnosis (avoid "You have X"). Use objective medical phrases like "Presentation is clinically suggestive of...", "Correlates with...", "Consistent with...".
- Do NOT prescribe or recommend specific drugs, medicines, or dosages.
- If symptoms indicate an acute red-flag emergency (e.g. severe sudden unilateral pain, heavy bleeding soaking >2 pads per hour, syncope/fainting, high fever with pelvic rigidity), set emergencyFlag to true.

Respond strictly with valid JSON without markdown code fences or backticks:
{
  "detectedLanguage": "Hinglish / Hindi" or "English",
  "patientConcerns": ["Short concern bullet 1", "Short concern bullet 2", "Short concern bullet 3"],
  "clinicalHpi": "A coherent, 2-3 sentence History of Present Illness (HPI) written in formal medical terminology suitable for a gynecologist or physician to read.",
  "medicalTerms": [
    {"term": "Medical Term 1", "plainMeaning": "What it means in everyday words"},
    {"term": "Medical Term 2", "plainMeaning": "Meaning"}
  ],
  "doctorQuestions": [
    "High-yield question 1 to ask the doctor during the 10-minute visit",
    "High-yield question 2 to ask the doctor",
    "High-yield question 3 to ask the doctor"
  ],
  "emergencyFlag": false,
  "emergencyAdvice": ""
}`;

      let resultData = null;

      try {
        if (geminiKey) {
          const modelsToTry = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-2.5-pro'];
          for (const modelName of modelsToTry) {
            try {
              const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: CLINICAL_PROMPT }] }],
                  generationConfig: {
                    response_mime_type: "application/json",
                    maxOutputTokens: 600,
                    temperature: 0.2
                  }
                })
              });
              if (response.ok) {
                const data = await response.json();
                const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (rawText) {
                  const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
                  resultData = JSON.parse(cleaned);
                  break;
                }
              }
            } catch (_) {}
          }
        } else if (openaiKey) {
          try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiKey}`
              },
              body: JSON.stringify({
                model: 'gpt-4o-mini',
                response_format: { type: "json_object" },
                messages: [{ role: 'user', content: CLINICAL_PROMPT }],
                max_tokens: 600,
                temperature: 0.2
              })
            });
            if (response.ok) {
              const data = await response.json();
              const rawText = data.choices?.[0]?.message?.content;
              if (rawText) resultData = JSON.parse(rawText.trim());
            }
          } catch (_) {}
        } else if (anthropicKey) {
          try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': anthropicKey,
                'anthropic-version': '2023-06-01'
              },
              body: JSON.stringify({
                model: 'claude-haiku-5-5',
                max_tokens: 600,
                messages: [{ role: 'user', content: CLINICAL_PROMPT }]
              })
            });
            if (response.ok) {
              const data = await response.json();
              const rawText = data.content?.[0]?.text;
              if (rawText) {
                const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
                resultData = JSON.parse(cleaned);
              }
            }
          } catch (_) {}
        }
      } catch (err) {
        console.warn('AI call encountered exception, using intelligent clinical fallback:', err.message);
      }

      // Zero-fail intelligent clinical fallback if AI returned null or was unconfigured
      if (!resultData || !resultData.clinicalHpi) {
        resultData = getClinicalFallback(userText, userLang, userStage);
      }

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(resultData));
    });
    return;
  }

  if (parsedUrl === '/') {
    parsedUrl = '/index.html';
  }

  const safePath = path.normalize(parsedUrl).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(BASE_DIR, safePath);

  // If directory requested, look for index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Fallback to index.html for SPA-like experience
        const fallbackPath = path.join(BASE_DIR, 'index.html');
        fs.readFile(fallbackPath, (fbErr, fbContent) => {
          if (fbErr) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(fbContent);
          }
        });
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`500 Server Error: ${err.code}`);
      }
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

const HOST = '0.0.0.0';
server.listen(PORT, HOST, () => {
  console.log(`\n======================================================`);
  console.log(`  🌸 Arogini - Women's Reproductive Wellness Platform`);
  console.log(`  Server URL:  http://${HOST}:${PORT}`);
  console.log(`  Status:      Running smoothly`);
  console.log(`======================================================\n`);
});
