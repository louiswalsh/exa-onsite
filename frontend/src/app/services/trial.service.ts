import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Trial } from '../models/trial.interface';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class TrialService {
  private apiBaseUrl: string;

  constructor(
    private http: HttpClient,
    private env: EnvironmentService
  ) {
    const base = this.env.getApiBaseUrl();
    this.apiBaseUrl = `${base.replace(/\/$/, '')}/api`;
  }

  getTrialsBySpecialty(specialty: string): Observable<Trial[]> {
    const spec = (specialty || 'oncology').toLowerCase();
    return this.http.get<any>(`${this.apiBaseUrl}/trials/specialty/${spec}`).pipe(
      map((resp: any) => {
        const items = Array.isArray(resp?.trials) ? resp.trials : [];
        return items.map(this.mapBackendTrialToFrontEnd);
      })
    );
  }

  private mapBackendTrialToFrontEnd = (item: any): Trial => {
    const enrollmentTarget = Number(item?.enrollment?.target) || 0;
    const enrollmentAchieved = Number(item?.enrollment?.achieved) || 0;
    const enrollmentPct = typeof item?.enrollment?.percentage === 'number'
      ? item.enrollment.percentage
      : (enrollmentTarget > 0 ? Math.round((enrollmentAchieved / enrollmentTarget) * 1000) / 10 : 0);

    const recruitmentStatus: string = (item?.recruitmentStatus || '').toString().toLowerCase();
    const status: Trial['status'] = recruitmentStatus.includes('recruit')
      ? 'recruiting'
      : recruitmentStatus.includes('active')
        ? 'active'
        : recruitmentStatus.includes('complete')
          ? 'completed'
          : recruitmentStatus.includes('terminate')
            ? 'terminated'
            : 'active';

    const specialty: Trial['specialty'] = (item?.specialty || 'oncology').toLowerCase() as Trial['specialty'];

    const geographyStr = (item?.geography || '').toString().trim();
    const geography = {
      locations: geographyStr ? [geographyStr] : [],
      regions: [] as string[]
    };

    const investigatorName = (item?.investigator || '').toString();
    const siteInstitution = (item?.site || '').toString();

    return {
      id: item?.id || item?.nctId || Math.random().toString(36).slice(2),
      nctId: item?.nctId || '',
      title: item?.title || 'Untitled Trial',
      sponsor: item?.sponsor || item?.author || 'Unknown',
      phase: item?.phase || 'Unknown',
      status,
      enrollment: {
        target: enrollmentTarget,
        achieved: enrollmentAchieved,
        percentage: enrollmentPct
      },
      endpoints: {
        primary: item?.endpoints?.primary || ''
      },
      geography,
      investigator: {
        name: investigatorName,
        institution: siteInstitution
      },
      // Backend returns 'insight' per trial; map to UI's 'implication'
      implication: item?.insight || item?.implication || '',
      summary: item?.summary || '',
      specialty,
      lastUpdated: item?.published_date || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
  };
}
