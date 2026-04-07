import React from 'react';
import { Document, Page, Text, View, StyleSheet, Svg, Circle, Path, Polygon } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { paddingTop: 34, paddingBottom: 36, paddingHorizontal: 34, fontSize: 11, color: '#172033', fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
  logoWrap: { width: 64, height: 64 },
  brandWrap: { flex: 1, marginLeft: 12 },
  brandTitle: { fontSize: 18, fontWeight: 700 },
  brandSub: { fontSize: 10, color: '#5b6477', marginTop: 4 },
  metaRight: { alignItems: 'flex-end' },
  levelPill: { border: '1 solid #8B1118', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 4, fontSize: 10, color: '#8B1118', fontWeight: 700 },
  section: { marginBottom: 16 },
  card: { border: '1 solid #dde3f0', borderRadius: 10, padding: 12, marginBottom: 12 },
  sectionTitle: { fontSize: 13, fontWeight: 700, marginBottom: 8 },
  small: { fontSize: 10, color: '#5b6477' },
  questionRow: { borderBottom: '1 solid #e8edf7', paddingBottom: 10, marginBottom: 10 },
  questionText: { fontSize: 11, marginBottom: 14, lineHeight: 1.5 },
  answerLine: { borderBottom: '1 solid #9aa6bd', height: 18, marginTop: 8 },
  coverTitle: { fontSize: 24, fontWeight: 700, marginBottom: 8 },
  coverSub: { fontSize: 12, lineHeight: 1.6, color: '#4d5668' },
  footer: { position: 'absolute', bottom: 18, left: 34, right: 34, fontSize: 9, color: '#7a8498', textAlign: 'center' },
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
      <Path d="M40 39L46 41M39 45L46 46M40 51L47 49M46 57L51 53M50 39L54 43M54 37L57 42M57 46L62 48M55 53L61 55" stroke="#000000" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
      <Circle cx="47" cy="47" r="2" fill="#FFFFFF" />
      <Circle cx="47" cy="47" r="1" fill="#000000" />
    </Svg>
  );
}

function makeQuestions(count: number, level: string) {
  return Array.from({ length: count }).map((_, index) => ({
    number: index + 1,
    prompt: `Practice question ${index + 1} for ${level}: solve the problem and show your work if needed.`,
    answer: `Sample answer ${index + 1}`,
  }));
}

export function PracticePdfDocument(input: {
  studentName: string;
  packageType: 'single' | 'weekly';
  wzLevel: string;
  strengths: string[];
  supportAreas: string[];
  recommendedNextPractice: string[];
}) {
  const questionCount = input.packageType === 'weekly' ? 50 : 30;
  const questions = makeQuestions(questionCount, input.wzLevel);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <LogoMark />
          <View style={styles.brandWrap}>
            <Text style={styles.brandTitle}>WiseZebra Personalized Practice Pack</Text>
            <Text style={styles.brandSub}>Student-ready printable math practice based on the diagnostic result.</Text>
          </View>
          <View style={styles.metaRight}>
            <Text style={styles.levelPill}>{input.wzLevel}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.coverTitle}>{input.studentName}</Text>
          <Text style={styles.coverSub}>This packet is personalized for the student’s current WiseZebra level. Use it as clean daily practice with no extra internal scoring details shown.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Practice overview</Text>
          <Text style={styles.small}>Package: {input.packageType === 'weekly' ? '5 practice sets, one weekday week' : '1 personalized practice set'}</Text>
          <Text style={styles.small}>Question count: {questionCount}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Recommended next step</Text>
          {input.recommendedNextPractice.map((item) => (
            <Text key={item} style={styles.answerItem}>• {item}</Text>
          ))}
        </View>

        <Text style={styles.footer}>WiseZebra Michigan Academy • Personalized Practice Packet</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <LogoMark />
          <View style={styles.brandWrap}>
            <Text style={styles.brandTitle}>Practice Questions</Text>
            <Text style={styles.brandSub}>Student name: {input.studentName}</Text>
          </View>
          <View style={styles.metaRight}>
            <Text style={styles.levelPill}>{input.wzLevel}</Text>
          </View>
        </View>

        {questions.slice(0, Math.ceil(questionCount / 2)).map((question) => (
          <View key={question.number} style={styles.questionRow}>
            <Text style={styles.questionText}>{question.number}. {question.prompt}</Text>
            <View style={styles.answerLine} />
          </View>
        ))}

        <Text style={styles.footer}>Student practice page 1</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <LogoMark />
          <View style={styles.brandWrap}>
            <Text style={styles.brandTitle}>Practice Questions</Text>
            <Text style={styles.brandSub}>Continue working carefully and neatly.</Text>
          </View>
          <View style={styles.metaRight}>
            <Text style={styles.levelPill}>{input.wzLevel}</Text>
          </View>
        </View>

        {questions.slice(Math.ceil(questionCount / 2)).map((question) => (
          <View key={question.number} style={styles.questionRow}>
            <Text style={styles.questionText}>{question.number}. {question.prompt}</Text>
            <View style={styles.answerLine} />
          </View>
        ))}

        <Text style={styles.footer}>Student practice page 2</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <LogoMark />
          <View style={styles.brandWrap}>
            <Text style={styles.brandTitle}>Answer Key</Text>
            <Text style={styles.brandSub}>Separate from the student practice pages.</Text>
          </View>
          <View style={styles.metaRight}>
            <Text style={styles.levelPill}>{input.wzLevel}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Strengths</Text>
          {input.strengths.map((item) => (
            <Text key={item} style={styles.answerItem}>• {item}</Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Support areas</Text>
          {input.supportAreas.map((item) => (
            <Text key={item} style={styles.answerItem}>• {item}</Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Answers</Text>
          {questions.map((question) => (
            <Text key={question.number} style={styles.answerItem}>{question.number}. {question.answer}</Text>
          ))}
        </View>

        <Text style={styles.footer}>Answer key • for parent or teacher use</Text>
      </Page>
    </Document>
  );
}
