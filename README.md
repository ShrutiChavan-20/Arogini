# Arogini

Arogini is a private, client-side women's reproductive health and clinical awareness platform designed to track health milestones, recognize symptom patterns, and prepare structured summaries for doctor appointments.

## Core Clinical Sections

1. **Obstetrics**: Pregnancy journey tracker, gestation milestones, antenatal care planner, warning-sign guidance, postpartum recovery support, reproductive vaccines, and anatomical explainer videos.
2. **Gynaecology**: Menstrual cycle tracker, PCOS & hormonal health journal, pelvic pain symptom diary, reproductive health education, and anatomical explainer videos.
3. **Symptoms Tracker & Summary**: 
   - **Log**: Quick daily symptom, severity, and life impact diary entries.
   - **Patterns**: Rule-based 28-day cycle timeline heatmap and recurring symptom alerts.
   - **Summary**: One-page clinically phrased summary ready to download as PDF or print for physician consultations.

## Anatomy & Explainer Videos with AI Chat

- **Interactive Body Map**: Plain-language clinical exploration of female reproductive organs (uterus, ovaries, fallopian tubes, cervix, vagina, pelvic floor, and hormonal axis).
- **Clinician-Curated Explainer Videos**: 60- to 90-second educational videos tailored by domain (pregnancy and uterine insights in Obstetrics; ovulation and cycle phases in Gynaecology).
- **Anatomy AI Chat**: Educational assistant powered by Claude Haiku for questions regarding female reproductive anatomy (ovaries, fallopian tubes, uterus, cervix, vagina, vulva, breasts, placenta). Provides educational explanations within strict non-diagnostic clinical boundaries.

## Privacy & Security

Health data, cycle dates, symptoms, and diary entries are kept in private client-side browser storage on your device. Zero cloud profiling and zero trackers. Anatomy questions are sent to an AI service and not stored by Arogini.

## Setup & Running Locally

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and configure your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_key_here
   ```
3. Start the application:
   ```bash
   npm start
   ```
4. Open your browser at:
   ```
   http://localhost:3000
   ```

## Project Team

- **Shruti Chavan** — Lead Developer & Project Architect
- **Team Member 2** — Clinical Guidelines & Medical Review
- **Team Member 3** — Frontend Engineering & Accessibility
