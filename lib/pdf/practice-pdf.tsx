import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 12, color: '#172033' },
  title: { fontSize: 22, marginBottom: 8, fontWeight: 700 },
  subtitle: { fontSize: 11, color: '#5b6477', marginBottom: 16 },
  card: { border: '1 solid #dde3f0', borderRadius: 10, padding: 12, marginBottom: 12 },
  heading: { fontSize: 14, marginBottom: 8, fontWeight: 700 },
  item: { marginBottom: 4 },
});

export function PracticePdfDocument(input: {
  studentName: string;
  packageType: 'single' | 'weekly';
  wzLevel: string;
  strengths: string[];
  supportAreas: string[];
  recommendedNextPractice: string[];
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>WiseZebra Personalized Practice</Text>
        <Text style={styles.subtitle}>
          Student: {input.studentName} | Package: {input.packageType} | Level: {input.wzLevel}
        </Text>

        <View style={styles.card}>
          <Text style={styles.heading}>Strengths</Text>
          {input.strengths.map((item) => (
            <Text key={item} style={styles.item}>• {item}</Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>Support Areas</Text>
          {input.supportAreas.map((item) => (
            <Text key={item} style={styles.item}>• {item}</Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>Recommended Next Practice</Text>
          {input.recommendedNextPractice.map((item) => (
            <Text key={item} style={styles.item}>• {item}</Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>Practice Section</Text>
          <Text style={styles.item}>Printable personalized questions will be generated into this packet after purchase.</Text>
        </View>
      </Page>
    </Document>
  );
}
