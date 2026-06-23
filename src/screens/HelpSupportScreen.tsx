import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export const HelpSupportScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'How do I add a new bank account?',
      answer: 'To add a new bank account, navigate to the Profile screen and select "Linked Accounts". From there, tap "Add Account" and follow the on-screen instructions.',
    },
    {
      question: 'What happens if I forget my PIN?',
      answer: 'If you forget your PIN, you can reset it by tapping "Forgot PIN" on the login screen. You will need to verify your identity using the email or phone number associated with your account.',
    },
    {
      question: 'How is my data secured?',
      answer: 'Your data is secured using bank-grade 256-bit encryption. We do not share your personal information with third parties without your explicit consent.',
    },
    {
      question: 'Are there any hidden fees?',
      answer: 'No, there are no hidden fees. All transaction costs and platform fees are clearly displayed before you confirm any transaction.',
    },
  ];

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.contactCard}>
          <View style={styles.contactIconBox}>
            <Icon name="headset" size={32} color={theme.colors.primary} />
          </View>
          <Text style={styles.contactTitle}>How can we help?</Text>
          <Text style={styles.contactDesc}>Our support team is available 24/7 to assist you.</Text>
          <TouchableOpacity style={styles.contactBtn}>
            <Text style={styles.contactBtnText}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Common Questions</Text>
        {faqs.map((faq, index) => (
          <TouchableOpacity key={index} style={styles.faqCard} onPress={() => toggleExpand(index)} activeOpacity={0.7}>
            <View style={styles.faqHeader}>
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Icon name={expandedIndex === index ? "chevron-down" : "chevron-forward"} size={20} color={theme.colors.textSecondary} />
            </View>
            {expandedIndex === index && (
              <View style={styles.faqAnswerContainer}>
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        <View style={styles.linksContainer}>
          <TouchableOpacity style={styles.linkBtn}>
            <Text style={styles.linkText}>Terms of Service</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkBtn}>
            <Text style={styles.linkText}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: { color: theme.colors.text, fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1, padding: theme.spacing.m },
  contactCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.l,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  contactIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  contactTitle: { color: theme.colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  contactDesc: { color: theme.colors.textSecondary, fontSize: 14, textAlign: 'center', marginBottom: theme.spacing.l },
  contactBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
  },
  contactBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  sectionTitle: { color: theme.colors.text, fontSize: 18, fontWeight: '600', marginBottom: theme.spacing.m },
  faqCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.s,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: { color: theme.colors.text, fontSize: 14, flex: 1, marginRight: theme.spacing.m, fontWeight: '500' },
  faqAnswerContainer: {
    marginTop: theme.spacing.m,
    paddingTop: theme.spacing.m,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  faqAnswer: { color: theme.colors.textSecondary, fontSize: 13, lineHeight: 20 },
  linksContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: theme.spacing.xl, marginBottom: theme.spacing.xl },
  linkBtn: { marginHorizontal: theme.spacing.m },
  linkText: { color: theme.colors.textSecondary, fontSize: 14, textDecorationLine: 'underline' },
});
