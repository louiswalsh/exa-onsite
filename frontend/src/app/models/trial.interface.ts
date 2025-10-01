export interface Trial {
  id: string;
  nctId: string;
  title: string;
  sponsor: string;
  phase: string;
  status: 'recruiting' | 'active' | 'completed' | 'terminated' | 'suspended';
  enrollment: {
    target: number;
    achieved: number;
    percentage: number;
  };
  endpoints: {
    primary: string;
    secondary?: string[];
  };
  geography: {
    locations: string[];
    regions: string[];
  };
  investigator: {
    name: string;
    institution: string;
  };
  recruitmentSignal: 'strong' | 'moderate' | 'weak' | 'failed';
  implication: string;
  summary: string;
  specialty: 'oncology' | 'hematology' | 'radiology' | 'cardiology' | 'neurology';
  lastUpdated: string;
  createdAt: string;
}

export interface TrialAnalytics {
  totalTrials: number;
  activeTrials: number;
  completedTrials: number;
  averageEnrollment: number;
  topSponsors: { name: string; count: number }[];
  recruitmentTrends: {
    date: string;
    enrollmentRate: number;
  }[];
  geographyDistribution: {
    region: string;
    trialCount: number;
    successRate: number;
  }[];
}

export interface TrialOpportunity {
  id: string;
  type: 'white_space' | 'improvement' | 'differentiation';
  title: string;
  description: string;
  potentialValue: string;
  confidence: 'high' | 'medium' | 'low';
  recommendedAction: string;
  relatedTrials: string[];
}
