import { Component, OnInit } from '@angular/core';
import { TrialService } from './services/trial.service';
import { EnvironmentService } from './services/environment.service';
import { Trial } from './models/trial.interface';
import { HealthService } from './services/health.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Clinical Trial Advisory';
  activeTab = 'Hematology';
  tabs = ['Hematology', 'Oncology', 'Radiology', 'Cardiology', 'Neurology'];
  trials: Trial[] = [];
  filteredTrials: Trial[] = [];
  loading = false;
  healthStatus: 'checking' | 'healthy' | 'unhealthy' = 'checking';
  private cache: Record<string, Trial[]> = {};

  constructor(
    private trialService: TrialService,
    private environmentService: EnvironmentService,
    private healthService: HealthService
  ) {}

  ngOnInit() {
    this.activeTab = 'Hematology';
    this.loadTrialsForActiveTab();
    this.checkHealth();
  }

  private checkHealth() {
    this.healthStatus = 'checking';
    this.healthService.checkHealth().subscribe(status => {
      this.healthStatus = status;
    });
  }

  private loadTrialsForActiveTab() {
    const specialty = this.activeTab.toLowerCase();
    const cached = this.cache[specialty];
    if (cached && cached.length) {
      this.trials = cached;
      this.filteredTrials = cached;
      this.loading = false;
      return;
    }
    this.loading = true;
    this.trials = [];
    this.filteredTrials = [];
    this.trialService.getTrialsBySpecialty(specialty).subscribe({
      next: (trials) => {
        this.cache[specialty] = trials;
        this.trials = trials;
        this.filteredTrials = trials;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  selectTab(tab: string) {
    this.activeTab = tab;
    this.loadTrialsForActiveTab();
  }

  refreshAll() {
    this.cache = {};
    this.loadTrialsForActiveTab();
  }

  getTimeAgo(date: string): string {
    if (!date) return 'Recently';

    const now = new Date();
    const trialDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - trialDate.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Less than an hour ago';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 30) {
        return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
      } else {
        const diffInMonths = Math.floor(diffInDays / 30);
        return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
      }
    }
  }

  getSpecialtyText(specialty: string): string {
    switch (specialty.toLowerCase()) {
      case 'oncology': return 'Oncology';
      case 'hematology': return 'Hematology';
      case 'radiology': return 'Radiology';
      case 'cardiology': return 'Cardiology';
      case 'neurology': return 'Neurology';
      default: return 'Clinical';
    }
  }
}
