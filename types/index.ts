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

export type StudentSessionRecord = {
  id: string;
  session_code: string;
  student_name: string;
  parent_email: string | null;
  status: 'in_progress' | 'completed';
  started_at: string;
  completed_at: string | null;
  max_question_count: number;
};

export type SessionProfileRecord = {
  id: string;
  session_id: string;
  overall_wz_level: string;
  strengths: string[];
  support_areas: string[];
  recommended_next_practice: string[];
  domain_confidence: DomainConfidence[];
  stopped_reason: 'confidence_reached' | 'max_questions';
  created_at: string;
};

export type PracticePackageType = 'single' | 'weekly';

export type PracticeSetItem = {
  id: string;
  practice_set_id: string;
  question_id: string;
  bucket: string;
  sort_order: number;
};
