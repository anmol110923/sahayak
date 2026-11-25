# Yojana Setu (योजना सेतु): Project Guide and Q&A

A briefing for mentors and investors: what the project is, how it works, what has been built, and answers to the questions you are likely to get.

**Live site:** https://yojana-setu-three.vercel.app
**Code:** pull request on GitHub, `sehajmakkar/sahayak` #1 (branch `yojana-setu`)

---

## 1. The 30-second pitch

Millions of people in rural India qualify for government schemes (pensions, housing, free rations, scholarships, health cover) but never claim them. They don't know the schemes exist, the information is spread over dozens of government websites, and it is written in complex language.

**Yojana Setu ("Scheme Bridge")** asks a few simple questions in the person's own language, by tapping, by voice, or by scanning a document. It then shows the **top 10 schemes they may be eligible for**, explains **why** each one fits, lists the **documents** they need, and links **only to the official government site** to apply.

It works on a cheap phone, on weak internet, in 5 languages, and costs **₹0** to run.

---

## 2. The problem

- **Awareness gap:** people don't know which schemes exist or which apply to them.
- **Scattered information:** central and state schemes sit on separate portals, each with its own rules.
- **Language and literacy:** rules are written in formal English or Hindi, and many users read little or not at all.
- **Middlemen and scams:** people pay agents to "apply" for free schemes, or share Aadhaar and OTPs with fraudsters.
- **Helpers are overloaded:** CSC operators, ASHA and Anganwadi workers help many people but have no simple tool.

## 3. The solution in one picture

```
 Person (or a CSC/ASHA helper)
        │  answers ~10–20 simple questions: tap, speak, or scan a document
        ▼
 Profile (stored only on the phone, never on a server)
        │
        ▼
 Rule engine (runs in the browser, works offline)
   checks every scheme's official rules → pass / fail / unknown for each rule
        │
        ▼
 Ranked top 10 + reasons + documents + official apply link
        │
        ├── optional AI: re-orders the shortlist and writes a 1-line "why" in simple language
        └── helper tools: compare, print with QR codes, share link, find nearest CSC
```

---

## 4. What we built (feature list)

| Area | What it does |
|---|---|
| **Eligibility form** | 2 short steps, about 20 questions. Every question is optional: blank means "don't know", which never hides a scheme. |
| **Rule engine** | 56 schemes (49 central + 7 state: UP, Bihar, Maharashtra, MP, Odisha, Tamil Nadu, Karnataka) in 13 categories. Each rule is checked as **pass, fail or unknown**. |
| **Explainable results** | Top 10 schemes, each with "Why you may qualify", "To confirm", the documents needed, where to apply, the helpline and the official link. |
| **"Why not eligible?"** | Shows schemes missed because of **one** answer the person can act on or may have got wrong, e.g. "Needs a bank account" or "Income up to ₹1 lakh". |
| **Document tracker** | Tick the documents you have; every scheme shows "All documents ready" or "Missing: income certificate…". |
| **Document scan (OCR)** | Photograph a ration card or an income, caste or disability certificate and the form fills itself. It runs **on the phone** and the photo is never uploaded. Aadhaar-style numbers are deleted before reading. |
| **Answer by voice** | Every question is read aloud and the person answers by speaking ("पचास हज़ार", "kisan", "हाँ"). Built for people who can't read. |
| **5 languages** | English, Hindi, Bengali, Marathi and Tamil, switched from a menu in the header. |
| **Compare** | Up to 3 schemes side by side. |
| **Print summary** | One page for a helper to hand over, with QR codes to the official apply link and to the results. |
| **Share link** | Results as a link (answers are inside the link; nothing is stored on a server). |
| **Find nearest** | Opens maps for the nearest CSC, bank, post office or panchayat ("near me"). We never read the person's location. |
| **WhatsApp bot** | The same flow as a tap-to-answer chat in Hindi or English; results, documents and links. |
| **AI (optional)** | Google Gemini free tier re-orders the shortlist and writes simple explanations. It cannot add schemes or links. |
| **Works offline** | Installable as an app (PWA). Matching runs on the phone. |
| **Sample profiles** | 4 demo personas (farmer, widow, student, expecting mother) for instant demos. |
| **Design** | Formal public-service portal look (navy, saffron, India green; Noto Sans in all scripts), light mode, text-size controls (A- A A+), skip link, built phone-first. Clearly marked as *not a government website*. |

---

## 5. How it works (technical)

### 5.1 Stack (all free)
- **Next.js 16 + React 19 + TypeScript**: one web app with no database. Hosted on **Vercel** (free tier).
- **Scheme data:** `data/schemes.json`, hand-compiled from official sources and checked by a validation script (`npm run validate:data`).
- **AI:** Google **Gemini** free tier (Groq as a backup), called with plain `fetch`. Optional.
- **Voice:** the browser's built-in Web Speech API (free, no key).
- **OCR:** **Tesseract.js**, running inside the browser.
- **WhatsApp:** Meta **WhatsApp Cloud API** (free for conversations the user starts).
- **QR codes:** generated offline in the browser.

### 5.2 The matching engine
Each scheme stores its eligibility as **structured rules**, for example:
```json
{ "all": [
  { "field": "occupation", "op": "in", "value": ["farmer"] },
  { "field": "land", "op": "gte", "value": 0.01 },
  { "field": "taxPayer", "op": "eq", "value": false }
]}
```
- Operators: `eq, in, notIn, gte, lte, between`, combined with `all` (AND) and `any` (OR).
- Each rule returns **pass, fail or unknown**. Unknown (a blank answer) never hides a scheme; it shows as "To confirm".
- Schemes that fail are dropped. The rest are **scored**: fully passing beats partly unknown, specific matches beat generic ones, a bigger benefit gets a small boost, matching the person's stated need gets a big boost, and state schemes get a small boost.
- Every reason shown to the user is generated **from the rules that actually passed**, so explanations are always true to the data.

### 5.3 Where AI is used, and where it is not
- **Not used for eligibility.** Eligibility is decided by the deterministic rule engine, the same every time.
- **Used for:** (1) re-ordering the shortlist for this person, (2) writing a one-line plain-language "why", and (3) turning free text like "बेटी की पढ़ाई" into categories.
- **Guardrails:** the AI only sees the shortlist IDs and answers that don't identify anyone. Any scheme ID it returns that wasn't sent is thrown away. If AI is down or no key is set, the site silently falls back to the rule-based results.

> **Is this RAG?** Not in the classic sense. There is no vector database or retrieval over documents. It is a **rule engine with an LLM layer on top**: the "retrieval" is deterministic rule matching over a curated scheme database, and the LLM only re-ranks and explains. This is deliberate, because for eligibility, **correctness and explainability matter more than fluency**, and an LLM must not invent schemes.

### 5.4 OCR (document scan)
Photo → shrunk on the phone → Tesseract reads the text (English + Hindi + the user's language) → our parser (`ocr-extract.ts`) finds date of birth, gender, caste category, ration card type, income, disability %, state, and village or town → the user ticks which ones to keep. Any 12-digit (Aadhaar-like) or long account-style number is deleted **before** parsing. Nothing is uploaded.

### 5.5 Voice answering
Each question is spoken aloud → the browser's speech recognition hears the answer → our matcher (`voice-answer.ts`) understands numbers ("35", "thirty five"), amounts ("50 हज़ार", "1.5 lakh", "8000 a month" ×12), yes/no in 5 languages, and synonyms ("kisan" = farmer, "गाँव" = village). If it isn't sure, it asks again; tap buttons are always there.

### 5.6 WhatsApp bot
- A webhook at `/api/whatsapp` (Meta Cloud API).
- **No database:** the answers so far are packed into each button's hidden ID, so WhatsApp itself carries the conversation state. We store nothing about the user.
- Age is asked as a range. A scheme only counts as a pass if it passes for the whole range; otherwise it shows as "to confirm".
- Webhook calls are verified with Meta's signature.

### 5.7 Privacy by design
- No login, no database, no names, no phone numbers, **never Aadhaar, bank or OTP**.
- Answers live only in the phone's browser storage, and there's a "Delete my data" button.
- Apply buttons only appear for **official government domains** (`*.gov.in`, `*.nic.in` plus a small checked list).
- The site always says **"may be eligible"**, never "you are eligible"; the final decision is the department's.

---

## 6. Demo script (3 minutes)

1. **Home:** switch the language (English → हिंदी → தமிழ்) to show it's multilingual.
2. **Sample profile "Widow, farm labourer, UP":** show 19 matches. Widow Pension is first, with reasons, the document checklist and the official Apply button.
3. **Document tracker:** tick Aadhaar and Ration card; the cards switch to "Missing: death certificate".
4. **Compare** 2 schemes, then **Print summary** to show the QR codes.
5. **Form → "Answer by voice"**: answer 2–3 questions by speaking.
6. **Form → "Scan a document"**: photograph a sample certificate and the fields fill in.
7. **Privacy page:** nothing is stored on a server; show the delete button.

---

## 7. Impact and business angle (for investors)

- **Users:** rural and low-income families; **helpers** (CSC operators, ASHA and Anganwadi workers, NGO field staff) are the force multiplier, since one helper serves hundreds of people.
- **Why now:** cheap smartphones, WhatsApp everywhere, free AI and speech tools, and money paid straight to bank accounts (DBT) mean a scheme found today is money in the bank tomorrow.
- **Cost to serve:** about ₹0 per user. The matching runs on the user's phone; the server only does optional AI and WhatsApp.
- **Possible paths to sustainability:**
  - **B2G / CSR:** state departments or companies' CSR programmes fund deployment, local languages and state schemes.
  - **NGO / helper licensing:** a dashboard for CSC and ASHA networks to manage many profiles and print summaries.
  - **Outcome-based grants:** funding tied to schemes actually claimed (measured through opt-in follow-up).
- **Moat:** a curated, structured, explainable scheme rules database, plus a trust-first design (no data, official links only) and a voice-first, multilingual experience for low literacy.

> Check any market-size figures (number of schemes, unclaimed benefits, CSC count) against official sources before putting them on a slide.

---

## 8. Honest limitations (say these yourself)

- **Data freshness:** the 56 schemes were compiled by hand; amounts and rules change. Every card links to the official site, and each scheme has a "last reviewed" date.
- **Coverage:** 56 schemes and 7 states so far; India has hundreds of central schemes and many more state schemes.
- **Government lists we can't check:** some schemes depend on lists like SECC 2011 (PM-JAY, PMAY-G), so these show as "to confirm".
- **Translations:** Bengali, Marathi and Tamil were machine-assisted and need native-speaker review; long scheme descriptions in those languages still show in Hindi or English.
- **Voice:** works best in Chrome on Android; some phones lack voices for some languages.
- **OCR:** needs a clear photo; the first scan needs internet to download the reading engine.
- **WhatsApp:** the code is built and tested with a simulator, but not yet connected to a live Meta number.

## 9. Roadmap

1. Partly automate adding schemes from myScheme.gov.in (the AI drafts, a human approves).
2. Native review of translations; add Telugu, Gujarati, Punjabi; use **Bhashini** (free government API) for speech.
3. Take the WhatsApp bot live; add voice notes.
4. A helper dashboard for CSC and ASHA workers.
5. Automatic dead-link checks and "last reviewed" alerts.
6. A feedback loop: "Did you apply? Did you get it?" to measure real impact.

---

## 10. Questions you may be asked, with answers

### Product and users
**Q: Who exactly is this for?**
Low-income and rural families, and the frontline helpers (CSC operators, ASHA and Anganwadi workers, NGO volunteers) who help them apply.

**Q: How is this different from myScheme.gov.in or Google?**
myScheme is a great government catalogue but expects users to search and read. Google gives links, not eligibility. We **ask simple questions, decide eligibility with reasons, list the documents, and give next steps**, by voice, in local languages, offline, with helper tools like print and share.

**Q: What if the person can't read?**
They can use voice mode (questions read aloud, answers spoken), "Listen" on results, or a helper can fill it in and print a summary.

**Q: What if they don't know an answer, such as their income?**
They leave it blank. Blank means "unknown", and the scheme still appears, marked "to confirm".

**Q: Why only the top 10?**
Too many options overwhelm people. The top 10 are ranked by fit and need; "Show more" reveals the rest.

### Accuracy and trust
**Q: How do you make sure the eligibility is correct?**
Rules are structured data checked by a validator; every reason shown comes from rules that actually passed; we say "may be eligible", and the official department makes the final decision.

**Q: Can the AI hallucinate a scheme or a fake link?**
No. The AI only re-orders IDs we give it; unknown IDs are thrown away. Links come only from our database and must pass the government-domain allowlist.

**Q: What happens when a scheme changes?**
We update `schemes.json`; each entry has a "last reviewed" date. The roadmap adds automatic link checks and AI-assisted updates with human approval.

**Q: Why should people trust you?**
We never ask for Aadhaar, bank details or OTPs, we never store data, and we only send people to official government sites. The site also warns "never pay anyone to apply".

### Privacy and security
**Q: Where is user data stored?**
Only in the user's own browser (localStorage). There is no database and no login.

**Q: What is sent to the AI?**
Only eligibility answers like age bracket, state and occupation, with nothing that identifies the person, and only if AI is switched on.

**Q: Isn't OCR on documents risky?**
It runs entirely on the phone; the photo is never uploaded; Aadhaar-like numbers are deleted before reading; the user confirms each detected field.

**Q: The share link contains answers; is that safe?**
It contains only eligibility answers (no name, no ID numbers). The app warns that anyone with the link can see them. When a link is opened, anything unexpected, like a "name" field, is dropped.

**Q: Does "Find nearest" track location?**
No. It opens a maps "near me" search; the maps app uses its own location permission.

### Technology
**Q: What's the tech stack?**
Next.js 16, React 19 and TypeScript on Vercel; Gemini or Groq free tier (optional); Web Speech API; Tesseract.js; WhatsApp Cloud API. No paid services.

**Q: Why no database?**
Privacy, zero cost and offline use. Matching runs on the phone, and the WhatsApp bot keeps its conversation state inside the message buttons.

**Q: Is it RAG?**
No (see 5.3). It's a deterministic rule engine plus an LLM for ranking and explanations. We chose this because eligibility must be correct and explainable.

**Q: Does it work offline?**
Yes, after the first visit. It's an installable app; matching, results and the document checklist work offline. AI, OCR's first download, and maps need internet.

**Q: How does voice understand Hindi numbers like "पचास हज़ार"?**
Our matcher understands lakh and thousand words, monthly vs yearly amounts, and digits in Devanagari, Bengali and Tamil scripts, then maps the amount to the right income bracket.

**Q: How does the WhatsApp bot remember answers without a database?**
Each reply button's hidden ID carries the answers so far (e.g. `0|en~st=UP~ar=rural`). When the user taps, WhatsApp sends that ID back, and the bot reads it to ask the next question.

**Q: How do you add a new scheme?**
Add an entry to `data/schemes.json` (both languages, rules, documents, official link) and run `npm run validate:data`.

**Q: How do you add a language?**
Add a `strings.<lang>.ts` file (TypeScript checks no text is missing), a `content.<lang>.ts` file for the form and labels, and a `schemes.<lang>.json` file. Missing text falls back to Hindi or English automatically.

**Q: How was it tested?**
Typecheck, the data validator and production builds; scripted checks of the OCR parser on sample documents, of the voice matcher on 55 phrases in 5 languages, of full WhatsApp conversations in 2 languages, and of the share-link encoding round trip; plus browser checks of every page, including Tamil and Bengali.

**Q: What does it cost to run?**
Hosting on the Vercel free tier, Gemini's free tier for AI, WhatsApp free for user-started chats, and voice and OCR in the browser. About ₹0 at our scale.

**Q: Can it scale?**
Yes. Most work happens on the user's phone, and the server is stateless. Scaling the **data** (more schemes and states) is the real work, which is why the roadmap focuses on assisted data entry.

### Business and future
**Q: How will this make money or sustain itself?**
CSR and government partnerships, licensing a helper dashboard to NGO and CSC networks, and outcome-linked grants. The core tool stays free for citizens.

**Q: How will you measure impact?**
Schemes shown → apply clicks → (opt-in) "Did you apply? Did you get it?" follow-ups. Rupee value unlocked per user is the key metric.

**Q: What's the biggest risk?**
Data going out of date. Mitigations: "last reviewed" dates, official-site confirmation on every card, and the planned link checker and assisted updates.

**Q: Why will people use it and not an agent?**
It's free, instant and private, works in their language and by voice, and tells them what documents to carry, which reduces trips to the office and dependence on middlemen.

**Q: What would you build with funding?**
Full coverage of central and state schemes, verified translations in 10+ languages, the live WhatsApp bot with voice notes, the helper dashboard, and field pilots with CSC and ASHA networks to measure benefits claimed.

---

## 11. Key numbers (accurate as of this build)

| | |
|---|---|
| Schemes | 56 (49 central, 7 state) |
| States with state schemes | 7 |
| Categories | 13 |
| Profile questions | 20 (all optional) |
| Languages | 5 (web); 2 (WhatsApp) |
| Results shown | Top 10 (+ show more), up to 6 "just missed" |
| Running cost | ₹0 (free tiers) |
| User data stored on servers | None |

## 12. Where things are in the code

| Path | What |
|---|---|
| `data/schemes.json` | The scheme database |
| `src/lib/core/rules.ts`, `match.ts` | Rule engine, scoring, near misses |
| `src/lib/core/describe.ts`, `src/lib/explain.ts` | Turn rules into plain-language reasons |
| `src/lib/core/ocr-extract.ts` | Document text → answers |
| `src/lib/core/voice-answer.ts` | Speech → answers |
| `src/lib/whatsapp/` | WhatsApp bot (pure logic + Cloud API) |
| `src/app/api/enhance`, `api/need` | Optional AI endpoints |
| `src/lib/i18n/` | Translations (5 languages) |
| `src/app/` | Pages: home, form, results, scheme, compare, print, privacy |
