import { WZ_LEVELS, DOMAINS } from '@/lib/wz-config';
import type { DomainConfidence, QuestionRecord, SessionAnswer, SessionProfile } from '@/types';

const START_LEVEL_INDEX = 7;
const MAX_QUESTIONS = 18;
const TARGET_CONFIDENCE = 0.82;
const SUCCESS_STREAK_UP = 2;
const STRUGGLE_STREAK_DOWN = 2;

export function initializeDomainConfidence(): DomainConfidence[] {
  return DOMAINS.map((domain) => ({
    domain,
    confidence: 0.5,
    correct: 0,
    total: 0,
    levelIndex: START_LEVEL_INDEX,
  }));
}

export function updateDomainState(state: DomainConfidence, answer: SessionAnswer, recentAnswers: SessionAnswer[]): DomainConfidence {
  const domainAnswers = [...recentAnswers.filter((item) => item.domain === state.domain), answer];
  const correct = domainAnswers.filter((item) => item.correct).length;
  const total = domainAnswers.length;
  const confidence = Math.min(0.98, Math.max(0.1, 0.35 + correct / Math.max(total, 1) * 0.55));

  const streak = domainAnswers.slice(-2);
  const allCorrect = streak.length === 2 && streak.every((item) => item.correct);
  const allWrong = streak.length === 2 && streak.every((item) => !item.correct);

  let levelIndex = state.levelIndex;
  if (allCorrect) levelIndex = Math.min(WZ_LEVELS.length - 1, levelIndex + SUCCESS_STREAK_UP);
  if (allWrong) levelIndex = Math.max(0, levelIndex - STRUGGLE_STREAK_DOWN);

  return { ...state, correct, total, confidence, levelIndex };
}

export function shouldStopAssessment(states: DomainConfidence[], answerCount: number) {
  const enoughConfidence = states.every((state) => state.total >= 2 && state.confidence >= TARGET_CONFIDENCE);
  if (enoughConfidence) return 'confidence_reached' as const;
  if (answerCount >= MAX_QUESTIONS) return 'max_questions' as const;
  return null;
}

export function pickNextQuestion(questions: QuestionRecord[], states: DomainConfidence[], answers: SessionAnswer[]): QuestionRecord | null {
  const targetDomain = [...states].sort((a, b) => a.confidence - b.confidence || a.total - b.total)[0];
  if (!targetDomain) return null;

  const targetLevel = WZ_LEVELS[targetDomain.levelIndex]?.code ?? WZ_LEVELS[START_LEVEL_INDEX].code;
  const answeredIds = new Set(answers.map((item) => item.questionId));

  return (
    questions.find((question) => question.domain === targetDomain.domain && question.wzLevel === targetLevel && !answeredIds.has(question.id)) ??
    questions.find((question) => question.domain === targetDomain.domain && !answeredIds.has(question.id)) ??
    questions.find((question) => !answeredIds.has(question.id)) ??
    null
  );
}

export function buildSessionProfile(states: DomainConfidence[]): SessionProfile {
  const averageIndex = Math.round(states.reduce((sum, item) => sum + item.levelIndex, 0) / states.length);
  const overallLevel = WZ_LEVELS[averageIndex]?.label ?? 'WZ 8';
  const sorted = [...states].sort((a, b) => b.confidence - a.confidence);

  return {
    overallLevel,
    strengths: sorted.slice(0, 2).map((item) => `${item.domain} at ${WZ_LEVELS[item.levelIndex]?.label}`),
    supportAreas: [...sorted].reverse().slice(0, 2).map((item) => `${item.domain} needs support before ${WZ_LEVELS[item.levelIndex + 1]?.label ?? WZ_LEVELS[item.levelIndex]?.label}`),
    recommendedNextPractice: [
      `60% practice at ${overallLevel}`,
      `25% spiral review from ${WZ_LEVELS[Math.max(0, averageIndex - 1)]?.label}`,
      `15% challenge from ${WZ_LEVELS[Math.min(WZ_LEVELS.length - 1, averageIndex + 1)]?.label}`,
    ],
    domainConfidence: states,
    stoppedReason: states.every((state) => state.total >= 2 && state.confidence >= TARGET_CONFIDENCE) ? 'confidence_reached' : 'max_questions',
  };
}

export function generatePracticeMix(profile: SessionProfile, questions: QuestionRecord[]) {
  const current = questions.filter((q) => q.wzLevel === profile.overallLevel.replace(' ', ''));
  const review = questions.filter((q) => profile.supportAreas.some((area) => area.includes(q.domain)));
  const challenge = questions.filter((q) => profile.strengths.some((area) => area.includes(q.domain)));

  return [
    ...current.slice(0, 6),
    ...review.slice(0, 3),
    ...challenge.slice(0, 2),
  ];
}
