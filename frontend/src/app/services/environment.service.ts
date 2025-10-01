import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private config: any = {};

  constructor() {
    this.loadEnvironment();
  }

  private loadEnvironment(): void {
    if ((window as any).env) {
      this.config = (window as any).env;
      return;
    }
    this.config = {
      ANGULAR_APP_DEV_MODE: 'false',
      ANGULAR_APP_API_BASE_URL: 'http://localhost:8080'
    };
  }

  get(key: string): string | undefined {
    return this.config[key];
  }

  getBoolean(key: string): boolean {
    const value = this.get(key);
    return value === 'true' || value === '1';
  }

  isDevMode(): boolean {
    return this.getBoolean('ANGULAR_APP_DEV_MODE');
  }

  getApiBaseUrl(): string {
    return this.get('ANGULAR_APP_API_BASE_URL') || 'http://localhost:8080';
  }
}
