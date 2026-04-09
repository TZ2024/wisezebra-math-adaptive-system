import React from 'react';
import { Document, Page, Text, View, StyleSheet, Svg, Circle, Path } from '@react-pdf/renderer';
import type { QuestionRecord } from '@/types';

const styles = StyleSheet.create({
  page: { paddingTop: 30, paddingBottom: 34, paddingHorizontal: 32, fontSize: 11, color: '#172033', fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  logoWrap: { width: 58, height: 58 },
  brandWrap: { flex: 1, marginLeft: 12 },
  brandTitle: { fontSize: 18, fontWeight: 700 },
  brandSub: { fontSize: 10, color: '#5b6477', marginTop: 4 },
  levelPill: { border: '1 solid #8B1118', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 4, fontSize: 10, color: '#8B1118', fontWeight: 700 },
  section: { marginBottom: 14 },
  card: { border: '1 solid #dde3f0', borderRadius: 10, padding: 12, marginBottom: 12 },
  sectionTitle: { fontSize: 13, fontWeight: 700, marginBottom: 8 },
  small: { fontSize: 10, color: '#5b6477', lineHeight: 1.5 },
  questionRow: { borderBottom: '1 solid #e8edf7', paddingBottom: 12, marginBottom: 12 },
  questionMeta: { fontSize: 9, color: '#5b6477', marginBottom: 6 },
  questionText: { fontSize: 11, marginBottom: 14, lineHeight: 1.5 },
  answerLine: { borderBottom: '1 solid #9aa6bd', height: 18, marginTop: 8 },
  footer: { position: 'absolute', bottom: 18, left: 32, right: 32, fontSize: 9, color: '#7a8498', textAlign: 'center' },
  answerItem: { marginBottom: 8, lineHeight: 1.45 },
});

function LogoMark() {
  return (
    <Svg viewBox="0 0 100 100" style={styles.logoWrap}>
      <Circle cx="50" cy="50" r="46" stroke="#8B1118" strokeWidth="4" fill="none" />
      <Circle cx="50" cy="50" r="34" stroke="#8B1118" strokeWidth="4" fill="none" />
      <Path d="M42 29C50 26 58 30 62 37C66 43 66 50 62 57C60 61 59 67 60 73C55 69 51 67 47 65C40 61 36 55 35 48C34 41 36 33 42 29Z" fill="#4B4B4F" />
      <Path d="M60 73C66 69 71 63 73 56C75 49 74 41 69 35C74 39 77 44 79 50C81 58 79 66 72 73C69 76 66 78 60 73Z" fill="#8B1118" />
      <Path d="M53 74C55 74 57 76 58 79C55 81 52 82 49 83C46 82 44 80 43 78C45 75 48 74 53 74Z" fill="#1F4D8F" />
    </Svg>
  );
}

function chunkQuestions(items: QuestionRecord[], size: number) {
  const chunks: QuestionRecord[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

export function PracticePdfDocument(input: {
  studentName: string;
  packageType: 'single' | 'weekly';
  wzLevel: string;
  strengths: string[];
  supportAreas: string[];
  recommendedNextPractice: string[];
  questions: QuestionRecord[];
}) {
  const studentPages = chunkQuestions(input.questions, 8);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <LogoMark />
          <View style={styles.brandWrap}>
            <Text style={styles.brandTitle}>WiseZebra Personalized Practice</Text>
            <Text style={styles.brandSub}>Real imported WZ-tagged questions selected from the completed diagnostic.</Text>
          </View>
          <Text style={styles.levelPill}>{input.wzLevel}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{input.studentName}</Text>
          <Text style={styles.small}>Package: {input.packageType === 'weekly' ? '5 personalized practice sets' : '1 personalized practice set'}</Text>
          <Text style={styles.small}>This student packet contains only the printable questions. Teacher notes and answers are kept separate.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Recommended next step</Text>
          {input.recommendedNextPractice.map((item) => (
            <Text key={item} style={styles.answerItem}>• {item}</Text>
          ))}
        </View>

        <Text style={styles.footer}>WiseZebra • Student cover page</Text>
      </Page>

      {studentPages.map((pageQuestions, pageIndex) => (
        <Page key={`student-${pageIndex}`} size="A4" style={styles.page}>
          <View style={styles.header}>
            <LogoMark />
            <View style={styles.brandWrap}>
              <Text style={styles.brandTitle}>Student Practice</Text>
              <Text style={styles.brandSub}>Page {pageIndex + 1} of {studentPages.length}</Text>
            </View>
            <Text style={styles.levelPill}>{input.wzLevel}</Text>
          </View>

          {pageQuestions.map((question, index) => (
            <View key={question.id} style={styles.questionRow}>
              <Text style={styles.questionMeta}>{pageIndex * 8 + index + 1}. {question.wzLevel} • {question.domain} • {question.skill}</Text>
              <Text style={styles.questionText}>{question.prompt}</Text>
              <View style={styles.answerLine} />
              <View style={styles.answerLine} />
            </View>
          ))}

          <Text style={styles.footer}>WiseZebra • Student practice page</Text>
        </Page>
      ))}

      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <LogoMark />
          <View style={styles.brandWrap}>
            <Text style={styles.brandTitle}>Teacher and Answer Pages</Text>
            <Text style={styles.brandSub}>Separate from the student pages.</Text>
          </View>
          <Text style={styles.levelPill}>{input.wzLevel}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Strengths</Text>
          {input.strengths.map((item) => <Text key={item} style={styles.answerItem}>• {item}</Text>)}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Support areas</Text>
          {input.supportAreas.map((item) => <Text key={item} style={styles.answerItem}>• {item}</Text>)}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Answer key and teacher notes</Text>
          {input.questions.map((question, index) => (
            <View key={question.id} style={{ marginBottom: 10 }}>
              <Text style={styles.answerItem}>{index + 1}. Answer: {question.answer}</Text>
              <Text style={styles.small}>Teacher explanation: {question.teacherExplanation}</Text>
              {question.hints?.length ? <Text style={styles.small}>Hints: {question.hints.join(' • ')}</Text> : null}
            </View>
          ))}
        </View>

        <Text style={styles.footer}>WiseZebra • Teacher / answer page</Text>
      </Page>
    </Document>
  );
}
