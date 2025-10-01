import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Trial, TrialAnalytics, TrialOpportunity } from '../models/trial.interface';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  private mockTrials: Trial[] = [
    {
      id: 'trial_1',
      nctId: 'NCT04837201',
      title: 'Phase II Immunotherapy Combination for Advanced Breast Cancer',
      sponsor: 'NIH + MD Anderson (Houston, TX)',
      phase: 'Phase II',
      status: 'completed',
      enrollment: {
        target: 400,
        achieved: 400,
        percentage: 100
      },
      endpoints: {
        primary: 'Progression-free survival',
        secondary: ['Overall survival', 'Safety profile', 'Quality of life']
      },
      geography: {
        locations: ['Houston, TX', 'New York, NY', 'Boston, MA'],
        regions: ['Southwest', 'Northeast']
      },
      investigator: {
        name: 'Dr. Maria Rodriguez',
        institution: 'MD Anderson Cancer Center'
      },
      recruitmentSignal: 'strong',
      implication: 'Space is saturated — duplicating this trial design in SoCal would not be differentiated or fundable.',
      summary: 'Phase II immunotherapy combo; 400 patients fully enrolled and completed in 2024.',
      specialty: 'oncology',
      lastUpdated: '2024-12-01T10:30:00Z',
      createdAt: '2023-01-15T09:00:00Z'
    },
    {
      id: 'trial_2',
      nctId: 'NCT04993222',
      title: 'HER2-Negative Breast Cancer Targeted Therapy Study',
      sponsor: 'Midwest Community Hospital Consortium',
      phase: 'Phase II',
      status: 'terminated',
      enrollment: {
        target: 150,
        achieved: 60,
        percentage: 40
      },
      endpoints: {
        primary: 'Overall response rate',
        secondary: ['Duration of response', 'Time to progression']
      },
      geography: {
        locations: ['Chicago, IL', 'Detroit, MI', 'Cleveland, OH'],
        regions: ['Midwest']
      },
      investigator: {
        name: 'Dr. James Thompson',
        institution: 'Midwest Cancer Research Network'
      },
      recruitmentSignal: 'failed',
      implication: 'With KP\'s large and diverse patient pool, SoCal could succeed in HER2-negative recruitment where smaller centers failed — strong opportunity if endpoints are differentiated.',
      summary: 'HER2-negative breast cancer trial; only 60/150 patients recruited, trial closed early.',
      specialty: 'oncology',
      lastUpdated: '2024-11-15T14:22:00Z',
      createdAt: '2023-03-10T11:30:00Z'
    },
    {
      id: 'trial_3',
      nctId: 'NCT05022145',
      title: 'Biomarker-Driven Precision Medicine for Triple-Negative Breast Cancer',
      sponsor: 'European Consortium (Spain & Italy)',
      phase: 'Phase II',
      status: 'recruiting',
      enrollment: {
        target: 200,
        achieved: 85,
        percentage: 42.5
      },
      endpoints: {
        primary: 'Biomarker-guided treatment response',
        secondary: ['Genomic analysis outcomes', 'Patient stratification efficacy']
      },
      geography: {
        locations: ['Madrid, Spain', 'Barcelona, Spain', 'Milan, Italy'],
        regions: ['Europe']
      },
      investigator: {
        name: 'Dr. Elena Vasquez',
        institution: 'European Cancer Research Institute'
      },
      recruitmentSignal: 'moderate',
      implication: 'White space opportunity. KP could run the first biomarker-driven breast cancer trial in SoCal\'s Latino population — highly fundable and strategically unique.',
      summary: 'Biomarker-driven Phase II; currently recruiting only in Europe.',
      specialty: 'oncology',
      lastUpdated: '2024-12-01T16:45:00Z',
      createdAt: '2023-06-20T13:15:00Z'
    },
    {
      id: 'trial_4',
      nctId: 'NCT05123456',
      title: 'CAR-T Cell Therapy for Relapsed/Refractory B-Cell Lymphoma',
      sponsor: 'National Cancer Institute',
      phase: 'Phase II',
      status: 'recruiting',
      enrollment: {
        target: 127,
        achieved: 113,
        percentage: 89
      },
      endpoints: {
        primary: 'Overall Response Rate',
        secondary: ['Complete response rate', 'Duration of remission', 'Safety profile']
      },
      geography: {
        locations: ['Seattle, WA', 'Portland, OR', 'San Francisco, CA'],
        regions: ['Pacific Northwest', 'Northern California']
      },
      investigator: {
        name: 'Dr. Sarah Chen',
        institution: 'Hematology Research Institute'
      },
      recruitmentSignal: 'strong',
      implication: 'Excellent recruitment performance in West Coast academic centers. KP could leverage this success model.',
      summary: 'Novel CAR-T Cell Therapy Shows 89% Response Rate in Phase II Lymphoma Trial',
      specialty: 'hematology',
      lastUpdated: '2024-12-01T11:20:00Z',
      createdAt: '2023-08-01T10:00:00Z'
    },
    {
      id: 'trial_5',
      nctId: 'NCT05234567',
      title: 'AI-Guided Radiotherapy Planning for Pediatric Solid Tumors',
      sponsor: 'Children\'s Hospital Research Network',
      phase: 'Phase III',
      status: 'active',
      enrollment: {
        target: 89,
        achieved: 67,
        percentage: 75.3
      },
      endpoints: {
        primary: 'Treatment Planning Accuracy',
        secondary: ['Radiation dose reduction', 'Treatment time efficiency', 'Patient outcomes']
      },
      geography: {
        locations: ['Boston, MA', 'Philadelphia, PA', 'Atlanta, GA'],
        regions: ['Northeast', 'Southeast']
      },
      investigator: {
        name: 'Dr. Michael Park',
        institution: 'Pediatric Radiology Consortium'
      },
      recruitmentSignal: 'strong',
      implication: 'AI-guided approaches showing strong adoption. West Coast implementation could fill geographic gap.',
      summary: 'AI-Guided Radiotherapy Planning Reduces Treatment Time by 40% in Pediatric Trials',
      specialty: 'radiology',
      lastUpdated: '2024-12-01T09:15:00Z',
      createdAt: '2023-09-12T14:30:00Z'
    },
    {
      id: 'trial_6',
      nctId: 'NCT06000123',
      title: 'Phase III Beta-Blocker vs ACE Inhibitor in Heart Failure',
      sponsor: 'American Heart Institute',
      phase: 'Phase III',
      status: 'active',
      enrollment: {
        target: 500,
        achieved: 260,
        percentage: 52
      },
      endpoints: {
        primary: 'Composite CV mortality and hospitalization'
      },
      geography: {
        locations: ['Los Angeles, CA', 'Denver, CO', 'Dallas, TX'],
        regions: ['West Coast', 'Mountain West', 'South']
      },
      investigator: {
        name: 'Dr. Karen Lee',
        institution: 'KP SoCal Cardiology'
      },
      recruitmentSignal: 'moderate',
      implication: 'Yes, because SoCal has large HF population and can accelerate enrollment.',
      summary: 'Comparative effectiveness Phase III HF trial with steady enrollment across US sites.',
      specialty: 'cardiology',
      lastUpdated: '2024-12-02T12:05:00Z',
      createdAt: '2023-10-11T10:00:00Z'
    },
    {
      id: 'trial_7',
      nctId: 'NCT06011234',
      title: 'Phase II Monoclonal Antibody in Relapsing MS',
      sponsor: 'NeuroHealth Consortium',
      phase: 'Phase II',
      status: 'recruiting',
      enrollment: {
        target: 180,
        achieved: 72,
        percentage: 40
      },
      endpoints: {
        primary: 'Annualized relapse rate'
      },
      geography: {
        locations: ['San Diego, CA', 'Phoenix, AZ'],
        regions: ['Southwest']
      },
      investigator: {
        name: 'Dr. Anita Patel',
        institution: 'Neurology Center of Excellence'
      },
      recruitmentSignal: 'moderate',
      implication: 'Yes, because KP can contribute MS cohorts and expand Southwest coverage.',
      summary: 'Relapsing MS antibody trial; active recruitment with room for additional sites.',
      specialty: 'neurology',
      lastUpdated: '2024-12-02T09:30:00Z',
      createdAt: '2023-07-21T12:00:00Z'
    }
  ];

  private mockAnalytics: TrialAnalytics = {
    totalTrials: 847,
    activeTrials: 312,
    completedTrials: 189,
    averageEnrollment: 78.5,
    topSponsors: [
      { name: 'National Cancer Institute', count: 45 },
      { name: 'MD Anderson Cancer Center', count: 32 },
      { name: 'Mayo Clinic', count: 28 },
      { name: 'Johns Hopkins', count: 24 },
      { name: 'Stanford Medicine', count: 19 }
    ],
    recruitmentTrends: [
      { date: '2024-08', enrollmentRate: 72.3 },
      { date: '2024-09', enrollmentRate: 75.1 },
      { date: '2024-10', enrollmentRate: 78.8 },
      { date: '2024-11', enrollmentRate: 81.2 },
      { date: '2024-12', enrollmentRate: 83.7 }
    ],
    geographyDistribution: [
      { region: 'Northeast', trialCount: 156, successRate: 78.2 },
      { region: 'Southeast', trialCount: 134, successRate: 71.6 },
      { region: 'West Coast', trialCount: 89, successRate: 85.4 },
      { region: 'Midwest', trialCount: 67, successRate: 62.3 },
      { region: 'Southwest', trialCount: 45, successRate: 73.8 }
    ]
  };

  private mockOpportunities: TrialOpportunity[] = [
    {
      id: 'opp_1',
      type: 'white_space',
      title: 'Latino Population Biomarker Study',
      description: 'First biomarker-driven breast cancer trial targeting SoCal Latino population',
      potentialValue: '$2.5M NIH funding opportunity',
      confidence: 'high',
      recommendedAction: 'Develop proposal for biomarker-driven trial focused on genetic variants prevalent in Latino populations',
      relatedTrials: ['NCT05022145']
    },
    {
      id: 'opp_2',
      type: 'improvement',
      title: 'HER2-Negative Recruitment Optimization',
      description: 'Leverage KP\'s patient diversity to succeed where community hospitals failed',
      potentialValue: '$1.8M in trial revenue',
      confidence: 'high',
      recommendedAction: 'Partner with community outreach programs to improve HER2-negative patient identification and enrollment',
      relatedTrials: ['NCT04993222']
    },
    {
      id: 'opp_3',
      type: 'differentiation',
      title: 'AI-Guided Pediatric Expansion',
      description: 'West Coast implementation of AI radiotherapy for pediatric patients',
      potentialValue: '$3.2M equipment and training investment',
      confidence: 'medium',
      recommendedAction: 'Establish AI radiotherapy program to serve underserved West Coast pediatric population',
      relatedTrials: ['NCT05234567']
    }
  ];

  getTrials(): Observable<Trial[]> {
    return of(this.mockTrials);
  }

  getTrialsBySpecialty(specialty: string): Observable<Trial[]> {
    const filtered = this.mockTrials.filter(trial =>
      specialty === 'all' || trial.specialty.toLowerCase() === specialty.toLowerCase()
    );
    return of(filtered);
  }

  getTrialById(id: string): Observable<Trial | undefined> {
    const trial = this.mockTrials.find(t => t.id === id);
    return of(trial);
  }

  getAnalytics(): Observable<TrialAnalytics> {
    return of(this.mockAnalytics);
  }

  getOpportunities(): Observable<TrialOpportunity[]> {
    return of(this.mockOpportunities);
  }
}
