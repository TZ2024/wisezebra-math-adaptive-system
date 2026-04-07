export function teacherPacketTemplate(input: {
  studentName: string;
  sessionId: string;
  profileSummary: string;
  teacherEmail: string;
  assignedQuestions: Array<{ prompt: string; answer: string; explanation: string; commonErrors: string[]; hints: string[] }>;
  suggestedTeachingNotes: string[];
}) {
  return `
WiseZebra Teacher Packet
========================

Student name: ${input.studentName}
Session ID: ${input.sessionId}

Profile summary
---------------
${input.profileSummary}

Teacher delivery
----------------
${input.teacherEmail}

Assigned questions
------------------
${input.assignedQuestions
  .map(
    (question, index) => `${index + 1}. ${question.prompt}
   Correct answer: ${question.answer}
   Teacher explanation: ${question.explanation}
   Common errors: ${question.commonErrors.join('; ')}
   Hints: ${question.hints.join('; ')}`,
  )
  .join('\n\n')}

Suggested teaching notes
------------------------
${input.suggestedTeachingNotes.map((note) => `- ${note}`).join('\n')}
`;
}
