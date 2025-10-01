import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EnvironmentService } from './environment.service';

@Injectable({ providedIn: 'root' })
export class HealthService {
  private baseUrl: string;

  constructor(private http: HttpClient, private env: EnvironmentService) {
    this.baseUrl = this.env.getApiBaseUrl().replace(/\/$/, '');
  }

  checkHealth(): Observable<'healthy' | 'unhealthy'> {
    return this.http.get(`${this.baseUrl}/health`, { responseType: 'text' }).pipe(
      map(() => 'healthy' as const),
      catchError(() => of('unhealthy' as const))
    );
  }
}

