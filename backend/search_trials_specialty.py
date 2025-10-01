import json
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)


def search_trials_by_specialty(exa, specialty: str):
    if not exa:
        raise ValueError("Exa client not configured")

    # Validate specialty
    valid_specialties = ['oncology', 'hematology', 'radiology', 'cardiology', 'neurology']
    spec = (specialty or '').lower()
    if spec not in valid_specialties:
        raise ValueError(f"Invalid specialty. Must be one of: {', '.join(valid_specialties)}")

    # Keep query simple and generic for better hit rate (avoid strict quoting)
    specialty_queries = {
        'oncology': 'oncology clinical trials phase II phase III enrollment outcomes biomarkers',
        'hematology': 'hematology clinical trials phase II phase III enrollment outcomes biomarkers',
        'radiology': 'radiology clinical trials phase II phase III enrollment outcomes imaging',
        'cardiology': 'cardiology clinical trials phase II phase III enrollment outcomes biomarkers',
        'neurology': 'neurology clinical trials phase II phase III enrollment outcomes biomarkers',
    }

    query = specialty_queries[spec]

    # Two-year window
    two_years = datetime.now() - timedelta(days=730)
    start_date = two_years.strftime("%Y-%m-%dT%H:%M:%S.000Z")

    # Simple schema to extract structured data
    trial_schema = {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "nct_id": {
                "type": "string",
                "description": "ClinicalTrials.gov identifier for the study (e.g., 'NCT01234567')."
            },
            "sponsor": {
                "type": "string",
                "description": "Primary organization or company sponsoring the trial."
            },
            "phase": {
                "type": "string",
                "description": "Trial phase as reported in the content (e.g., 'Phase I', 'Phase II', 'Phase III', 'Phase IV')."
            },
            "enrollment_target": {
                "type": "number",
                "description": "Planned number of participants to enroll in the trial."
            },
            "enrollment_achieved": {
                "type": "number",
                "description": "Number of participants actually enrolled (to date or final)."
            },
            "primary_endpoint": {
                "type": "string",
                "description": "Primary endpoint or outcome measure used to assess efficacy/safety."
            },
            "geography": {
                "type": "string",
                "description": "Geographic focus or location(s) of the trial (country/region/city)."
            },
            "investigator": {
                "type": "string",
                "description": "Name of the principal investigator or lead researcher, if available."
            },
            "site": {
                "type": "string",
                "description": "Trial site or institution conducting the study, if specified."
            },
            "recruitment_status": {
                "type": "string",
                "description": "Current recruitment status (e.g., 'Recruiting', 'Active, not recruiting', 'Completed', 'Terminated')."
            },
            "biomarkers": {
                "type": "string",
                "description": "Biomarkers evaluated or required for eligibility (comma-separated if multiple)."
            },
            "summary": {
                "type": "string",
                "description": "In one concise sentence, summarize the trial (phase, focus, status)."
            },
            "insight": {
                "type": "string",
                "description": "Answer in exactly one sentence: As a research center with substantial funding in Los Angeles (Kaiser Permanente SoCal), should we run or join this trial? If recruitment_status is not recruiting/enrolling or enrollment_achieved >= enrollment_target, answer 'No, because' and state it is completed/fully enrolled/not recruiting. Otherwise begin with 'Yes, because' or 'No, because' and justify using concrete signals (recruitment feasibility vs targets, geographic fit with SoCal, differentiation vs similar trials/endpoints, underserved populations). If evidence is insufficient, answer 'Insufficient evidence.' Keep under 25 words."
            },
            # "recruitment_signal": {
            #     "type": "string",
            #     "description": "Classify recruitment performance as one of: strong, moderate, weak, or failed."
            # }
        },
    }

    # Disable domain restriction to improve recall; can be re-enabled if needed
    include_domains = None

    # Execute search
    logger.info(
        "Exa search: spec=%s query=\"%s\" start_date=%s domains=%s",
        spec,
        query,
        start_date,
        include_domains if include_domains else "ALL",
    )
    # Build args without include_domains if not set to avoid accidental filtering
    exa_kwargs = {
        'type': 'neural',
        'num_results': 50,
        'start_published_date': start_date,
        'summary': {"schema": trial_schema},
        'livecrawl': 'preferred',
    }
    if include_domains:
        exa_kwargs['include_domains'] = include_domains

    results = exa.search_and_contents(
        query,
        **exa_kwargs,
    )
    try:
        count = len(getattr(results, 'results', []) or [])
        sample = [r.url for r in (getattr(results, 'results', []) or [])[:5]]
        logger.info("Exa returned %d results; sample URLs: %s", count, sample)
    except Exception as e:
        logger.warning("Could not log Exa results summary: %s", e)

    # Transform results to API response
    trials = []
    for result in results.results:
        item = {
            'id': f"trial_{hash(result.url) % 1000000}",
            'title': result.title,
            'url': result.url,
            'published_date': result.published_date,
            'author': result.author,
            'specialty': spec,
        }

        if result.summary:
            try:
                structured = json.loads(result.summary)
                item['nctId'] = structured.get('nct_id', '')
                item['sponsor'] = structured.get('sponsor', result.author or 'Unknown')
                item['phase'] = structured.get('phase', 'Unknown')

                tgt = structured.get('enrollment_target', 0)
                ach = structured.get('enrollment_achieved', 0)
                pct = 0
                if tgt and ach:
                    pct = round((ach / tgt) * 100, 1)
                item['enrollment'] = {'target': tgt, 'achieved': ach, 'percentage': pct}

                item['endpoints'] = {'primary': structured.get('primary_endpoint', '')}
                item['geography'] = structured.get('geography', '')
                item['investigator'] = structured.get('investigator', '')
                item['site'] = structured.get('site', '')
                item['recruitmentStatus'] = structured.get('recruitment_status', '')
                item['biomarkers'] = structured.get('biomarkers', '')
                # New fields informed by PRD / mocks
                item['summary'] = structured.get('summary', '')
                # Prefer 'insight'; fallback to 'implication' if model returns legacy field name
                item['insight'] = structured.get('insight') or structured.get('implication', '')

                # Normalize status and compute derived recruitment signal if needed
                rstatus_raw = structured.get('recruitment_status') or ''
                rstatus = rstatus_raw.strip().lower()
                rs = (structured.get('recruitment_signal') or '').strip().lower()

                # Derive recruitmentSignal if the model didn't provide it
                if rs in {'strong','moderate','weak','failed'}:
                    item['recruitmentSignal'] = rs
                else:
                    full_enrollment = bool(tgt) and bool(ach) and tgt > 0 and ach >= tgt
                    if rstatus in {'terminated','withdrawn','suspended'}:
                        item['recruitmentSignal'] = 'failed'
                    elif full_enrollment or pct >= 85:
                        item['recruitmentSignal'] = 'strong'
                    elif pct >= 50:
                        item['recruitmentSignal'] = 'moderate'
                    elif pct > 0:
                        item['recruitmentSignal'] = 'weak'

                # Guardrail: if trial is not recruiting or fully enrolled/completed, recommend 'No'
                non_recruiting = {
                    'completed', 'terminated', 'withdrawn', 'suspended', 'enrollment complete',
                    'enrolment complete', 'active, not recruiting', 'closed to accrual',
                    'closed to accrual and intervention', 'not recruiting', 'closed'
                }
                full_enrollment = bool(tgt) and bool(ach) and tgt > 0 and ach >= tgt
                if full_enrollment or rstatus in non_recruiting:
                    # Keep within 25 words per schema guidance
                    reason_parts = []
                    if rstatus:
                        reason_parts.append(rstatus_raw)
                    if full_enrollment:
                        reason_parts.append('fully enrolled')
                    reason = ' and '.join(reason_parts) if reason_parts else 'not recruiting'
                    item['insight'] = f"No, because the trial is {reason}."
            except Exception as e:
                logger.warning("Could not parse structured data: %s", e)

        trials.append(item)


    return {
        'specialty': spec,
        'query': query,
        'count': len(trials),
        'trials': trials,
    }
