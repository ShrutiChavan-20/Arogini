# HerVita: Final Solution Design

**Track:** Women's Healthcare  |  **Format:** 36-hour online hackathon  |  **Team:** 3

## 1. Problem

Many Indian women feel uncomfortable talking about reproductive health or menstrual cycles, often lack the words to describe symptoms to a doctor, and tend to ignore changes that deserve attention. Information is scattered, and conversations about these topics at home are rarely easy.

## 2. Solution

HerVita is a simple, private web app with two modules:

1. **Awareness:** short, easy videos and plain-language notes on the reproductive system, what each part does, and everyday habits that support it.
2. **Symptom Awareness:** a symptom diary that helps users notice patterns and turns their notes into a short summary they can take to a doctor.

HerVita informs and organises. It does not diagnose and does not replace a doctor.

## 3. Target Users

- Women aged 15 to 45 in India. Content starts in English and Hindi, with regional languages later.
- Women who want to learn before they talk to family or a doctor.
- Women managing periods, pregnancy, postpartum recovery, or ongoing pelvic or hormonal concerns.

## 4. Module 1: Reproductive Health Awareness

| Feature | What it does | Boundary |
| --- | --- | --- |
| Explainer videos | 60 to 90 second videos on organs and processes such as the menstrual cycle, ovaries, uterus, pregnancy stages and postpartum care | Reviewed, general knowledge only, no personal advice |
| Body Map | Tap a body part to see what it does and why it matters | Static text and simple visuals |
| Organ Care Tips | Easily available foods, sleep, movement and hygiene habits linked to each organ | Framed as supportive, never as a cure |
| Words to Know | Plain-language glossary, for example cycle length, irregular, pelvic pain | Fixed list, no AI |
| Ask Better Questions | Suggested questions to bring to a doctor, grouped by topic | Fixed list |

**MVP content:** curate 8 to 10 videos from reputable, clinician-reviewed sources and link or embed them. We will not produce our own videos during the hackathon.

## 5. Module 2: Symptom Awareness

| Feature | What it does |
| --- | --- |
| Symptom Diary | Daily entry with symptom, severity (1 to 5), duration, time of day, and what it affected (work, sleep, daily activities) |
| Pattern View | Simple timeline showing when symptoms occur and whether they repeat or change |
| Doctor Visit Summary | One-page summary with symptom history, dates, impact and suggested questions, written with correct medical terms |
| Care Checklist | Follow-ups the doctor recommended, with reminders and done or not done status |

Pattern detection is rule-based, for example 'pain on days 1 to 3 in each of the last 4 cycles'. No machine learning is needed.

## 6. Handling Serious Symptoms

The goal is to guide users calmly, not to frighten them.

A short **symptom check** asks a few yes or no questions about symptoms that should never be ignored, such as heavy bleeding, severe pain, fever with pain, bleeding during pregnancy, or chest pain and breathlessness.

If a warning sign appears, the screen responds in this order:

1. A calm acknowledgement: 'Thank you for checking. Based on what you shared, please speak with a doctor soon.'
2. A clear next step: contact your doctor today, or go to the nearest hospital or call 112 if you feel very unwell.
3. A one-tap option to save the summary so the user can show it to the doctor.

Design rules: no diagnosis, no alarming words or colours, no pop-ups that induce panic, and a supportive tone throughout. Pregnancy warnings follow clinician-reviewed guidance such as ACOG and appear as 'contact your care team' prompts. The app is never the gatekeeper for emergency care.

## 7. Privacy by Default

- Data stays on the user's device in the MVP. No account is needed to try the app.
- Optional PIN lock.
- One-tap delete of all data.
- No selling, advertising or third-party sharing of health data.
- A summary is shared only when the user chooses to share it.

## 8. Boundaries: What We Will Not Build in 36 Hours

- AI diagnosis, symptom-based condition labels, or medicine dosing
- Doctor booking, teleconsultation or payments
- Integration with hospital or government health records
- Open-ended AI chat about personal symptoms
- A native mobile app (we will build a responsive web app)
- Original video production

## 9. 36-Hour Build Plan

| Hours | Focus |
| --- | --- |
| 0 to 4 | Lock scope, content list, data model and wireframes |
| 4 to 14 | Symptom Diary, Pattern View, Doctor Visit Summary |
| 14 to 22 | Video library, Body Map, Organ Care Tips, glossary |
| 22 to 28 | Symptom check, calm messaging, privacy controls, vaccine section |
| 28 to 32 | Test with 5 people, fix issues |
| 32 to 36 | Demo video, pitch slides, submission |

**Roles:** one person on the symptom module and summary, one on content, videos and UI, and one on UX copy, testing and the demo.

**Suggested stack:** React with Tailwind CSS, browser local storage for the MVP, and print-to-PDF for the summary. Firebase can be added later for sync.

## 10. Demo Flow (3 Minutes)

1. Open with a relatable scenario, such as a user who is unsure how to describe her pain to her doctor.
2. Show the Body Map and one explainer video.
3. Log two symptoms and show the pattern view.
4. Generate and show the Doctor Visit Summary.
5. Show the symptom check with its calm, supportive response.
6. Show the vaccine timeline and record.
7. Close with the privacy controls.

## 11. Vaccines and Records

Vaccines protect reproductive health best when given at the right stage. Confirm timing with a doctor and the national immunisation schedule, as schedules vary and change over time.

| Stage | Vaccine | Why it matters |
| --- | --- | --- |
| Early adolescence (around 9 to 14 years) | HPV, 2 doses | Helps prevent cervical and other HPV-related cancers later in life |
| Before pregnancy | MMR (measles, mumps, rubella) | Rubella in early pregnancy can harm the baby; check immunity first |
| Before pregnancy | Chickenpox (varicella) | Infection during pregnancy can be serious for mother and baby |
| At birth | Hepatitis B birth dose | Protects the baby from infection at delivery |
| Each pregnancy, 27 to 36 weeks | Tdap (whooping cough) | Passes protection to the newborn |
| Any pregnancy trimester, during flu season | Influenza | Protects mother and baby during flu season |

Vaccines do not replace regular screening, such as cervical screening.

**Vaccine record:** users log each vaccine with its name, date, dose number and next due date. The Care Checklist sends reminders for upcoming doses, and the record can be added to the Doctor Visit Summary.

## 12. Risks and Tough Parts

These are the hardest parts of the project. We tackle them early, in the order listed.

| Risk | Why it is hard | Mitigation | Start by |
| --- | --- | --- | --- |
| Medical accuracy | Every video, tip and vaccine entry needs checking | Shortlist reviewed sources; get a doctor reviewer; label all content 'for awareness' | Hour 4 |
| Red-flag wording | Must warn without panic or false reassurance | Agree the warning list and exact wording; test with 2 to 3 women outside the team | Hour 4 |
| Pattern view data | Patterns need several cycles of entries to show | Prepare realistic sample data before the demo | Hour 6 |
| Doctor Visit Summary | Correct medical terms without slipping into diagnosis | Fixed wording templates; test the printed layout | Hour 8 |
| Privacy claims | Local-only data is lost if the browser is cleared | Make pitch claims match what is built; show a clear export or warning | Hour 4 |
| Video embedding | Embeds can be blocked; licensing is unclear | Link out to videos as the fallback | Hour 6 |
| Language scope | Hindi medical translation takes real time | English only for the demo; Hindi as a stretch goal | Hour 0 |
| Team coordination | Three people will conflict on the data model | Agree the data model in the first 2 hours | Hour 2 |
| Vaccine timing | Schedules differ by country and change | Check against the current national schedule before submission | Hour 20 |
| Scope creep | Features multiply during a hackathon | Freeze features at hour 14 | Hour 14 |
