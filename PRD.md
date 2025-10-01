# PRD: Clinical Trial Monitor (Search-Based)

## 1. Problem Statement  
Healthcare research centers (for this example we are going to take the user role of Kaiser Permanente) struggle with trial decision-making:  
- **Trial Choice:** ClinicalTrials.gov lists trials but doesn’t show trends, gaps, or performance.  
- **Recruitment Feasibility:** Many trials fail due to poor site selection and low enrollment.  
- **Trial Design:** Protocols often miss fundable endpoints or differentiation opportunities.  

---

## 2. Goal  
Deliver a search-based, specialty-focused dashboard that provides a real-time, structured view of:  
- Which trials are running, failing, or succeeding.  
- Which regions / specific things recruit effectively.  
- What design trends (endpoints, biomarkers, geographies) are emerging.  

---

## 3. Target Users  
- Research Coordinators → need landscape insights.  
- Principal Investigators → need recruitment feasibility.  
- Strategy/Operations Teams → need portfolio visibility.  
- Executives → need differentiation for funding proposals.  

---

## 4. Search Configuration & Defaults

- Specialties: `oncology`, `hematology`, `radiology` (extensible)
- Default specialty on load: `oncology`
- Default time window: last 24 months
- Default domains: `clinicaltrials.gov, pubmed.ncbi.nlm.nih.gov, nejm.org, nature.com, thelancet.com, bmj.com`
- Structured fields extracted: `nct_id, sponsor, phase, enrollment_target, enrollment_achieved, primary_endpoint, geography, investigator, site, recruitment_status, biomarkers`

---

## 5. Data / Output Example


---

### Trial A – NCT04837201  
- **Sponsor:** NIH + MD Anderson (Houston, TX)  
- **Summary:** “Phase II immunotherapy combo; 400 patients fully enrolled and completed in 2024.”  
- **Recruitment Signal:** Very strong performance at large academic centers in TX and NY.  
- **Implication for KP SoCal:** Space is saturated — duplicating this trial design in SoCal would not be differentiated or fundable.  

---

### Trial B – NCT04993222  
- **Sponsor:** Midwest Community Hospital Consortium  
- **Summary:** “HER2-negative breast cancer trial; only 60/150 patients recruited, trial closed early.”  
- **Recruitment Signal:** Community hospitals struggled to hit targets.  
- **Implication for KP SoCal:** With KP’s large and diverse patient pool, SoCal could succeed in HER2-negative recruitment where smaller centers failed — strong opportunity if endpoints are differentiated.  

---

### Trial C – NCT05022145  
- **Sponsor:** European Consortium (Spain & Italy)  
- **Summary:** “Biomarker-driven Phase II; currently recruiting only in Europe.”  
- **Recruitment Signal:** No U.S. or Latin America coverage.  
- **Implication for KP SoCal:** White space opportunity. KP could run the first biomarker-driven breast cancer trial in SoCal’s Latino population — highly fundable and strategically unique.  


---

## 6. Business Value  
- **Avoid Waste:** Don’t replicate redundant trials → save $Ms.  
- **Improve Success:** Match sites to strong recruiters → reduce failed trials.  
- **Accelerate Funding:** Differentiate designs with real-world data → win NIH/pharma grants.  
- **Portfolio Visibility:** Leadership sees live trial landscape by specialty.  

---

## 7. Non-Goals  
- Not replacing regulatory databases.  
- Not guaranteeing trial outcomes (decision support only).  
- Not providing direct patient-level data.  

---

## 8. Success Metrics  
- 50% reduction in time to identify viable trial opportunities.  
- 25% improvement in recruitment forecast accuracy.  
- Weekly engagement >70% among research coordinators.  
- At least 3 trial proposals per year cite insights from the tool in funding applications.  

---

## 9. Demo Narrative  
*"Here’s a specialty-focused trial monitor for Kaiser Permanente. On load, it pulls Oncology and shows a green API health indicator. Switching tabs instantly swaps cached results; Refresh clears and refetches. With Exa-powered search, they see which trials are running, where recruitment is strong or weak, and how to differentiate designs. This turns 40+ hours of manual searching into a daily live signal that saves money and drives better science."*  

---

## 10. Product Scope & API Surface

- UI
  - Tabs: `Oncology`, `Hematology`, `Radiology`
  - Initial load: auto-fetch Oncology
  - In-memory cache per specialty; global Refresh clears cache and refetches current tab
  - Health indicator (top-right) calls `/health` on load

- Backend API
  - `GET /health` → `200 OK` with `"healthy"`
  - `GET /api/trials/specialty/<specialty>?num_results=&phase=` → JSON
    - Response: `{ specialty, query, count, trials: [ { id, title, url, published_date, author, nctId, sponsor, phase, enrollment:{target, achieved, percentage}, endpoints:{primary}, geography, investigator, site, recruitmentStatus, biomarkers } ] }`
    - Errors:
      - `400` invalid specialty or EXA error
      - `500` if Exa API not configured (missing `EXA_API_KEY`)

- Configuration
  - `EXA_API_KEY` required for backend search
  - Frontend `ANGULAR_APP_API_BASE_URL` defaults to `http://localhost:8080`
