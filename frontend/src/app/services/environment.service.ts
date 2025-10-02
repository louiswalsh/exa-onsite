import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  getApiBaseUrl(): string {
    return 'http://localhost:8080';
  }
}
