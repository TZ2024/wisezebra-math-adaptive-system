export type DomainName =
  | 'Number and Place Value'
  | 'Operations and Fluency'
  | 'Fractions, Decimals, Measurement, and Ratio'
  | 'Geometry, Data, and Word Problems'
  | 'Signed Numbers and Prealgebra Bridge';

export type QuestionRecord = {
  id: string;
  prompt: string;
  answer: string;
  wzLevel: string;
  domain: DomainName;
  skill: string;
  michiganStandard?: string;
  kumonReference?: string;
  difficulty: number;
  status: 'draft' | 'approved' | 'archived';
  commonErrors: string[];
  hints: string[];
  teacherExplanation: string;
};

export type SessionAnswer = {
  questionId: string;
  correct: boolean;
  domain: DomainName;
  skill: string;
  wzLevel: string;
  response?: string;
};

export type DomainConfidence = {
  domain: DomainName;
  confidence: number;
  correct: number;
  total: number;
  levelIndex: number;
};

export type SessionProfile = {
  overallLevel: string;
  strengths: string[];
  supportAreas: string[];
  recommendedNextPractice: string[];
  domainConfidence: DomainConfidence[];
  stoppedReason: 'confidence_reached' | 'max_questions';
};
