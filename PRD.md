# PRD: Clinical Trial Monitor (Search-Based)

## 1. Problem Statement  
Healthcare research centers (for this example we are going to take the user role of {{redacted}}) struggle with trial decision-making:  
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
- **Implication for {{redacted}}:** Space is saturated — duplicating this trial design in SoCal would not be differentiated or fundable.  

---

### Trial B – NCT04993222  
- **Sponsor:** Midwest Community Hospital Consortium  
- **Summary:** “HER2-negative breast cancer trial; only 60/150 patients recruited, trial closed early.”  
- **Recruitment Signal:** Community hospitals struggled to hit targets.  
- **Implication for {{redacted}}:** With {{redacted}}'s large and diverse patient pool, SoCal could succeed in HER2-negative recruitment where smaller centers failed — strong opportunity if endpoints are differentiated.  

---

### Trial C – NCT05022145  
- **Sponsor:** European Consortium (Spain & Italy)  
- **Summary:** “Biomarker-driven Phase II; currently recruiting only in Europe.”  
- **Recruitment Signal:** No U.S. or Latin America coverage.  
- **Implication for {{redacted}}:** White space opportunity. {{redacted}} could run the first biomarker-driven breast cancer trial in SoCal's Latino population — highly fundable and strategically unique.  


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
