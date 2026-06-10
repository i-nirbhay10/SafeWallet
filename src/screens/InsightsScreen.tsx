import React from 'react';
import { View, Text, StyleSheet, ScrollView, DimensionValue } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

export const InsightsScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Insights</Text>
        <Icon name="calendar-outline" size={24} color={theme.colors.text} />
      </View>

      <ScrollView style={styles.content}>
        {/* Monthly Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>This Month</Text>
          <Text style={styles.summaryAmount}>-₹480.50</Text>
          <View style={styles.summaryTrend}>
            <Icon name="trending-down" size={16} color={theme.colors.danger} />
            <Text style={styles.trendText}> 12% more than last month</Text>
          </View>
        </View>

        {/* Dummy Chart Area */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Expense Overview</Text>
          <View style={styles.chartPlaceholder}>
            {/* Fake bar chart */}
            <View style={[styles.bar, { height: 60, backgroundColor: theme.colors.primary }]} />
            <View style={[styles.bar, { height: 100, backgroundColor: theme.colors.primary }]} />
            <View style={[styles.bar, { height: 40, backgroundColor: theme.colors.primary }]} />
            <View style={[styles.bar, { height: 80, backgroundColor: theme.colors.primary }]} />
            <View style={[styles.bar, { height: 120, backgroundColor: theme.colors.danger }]} />
            <View style={[styles.bar, { height: 50, backgroundColor: theme.colors.primary }]} />
            <View style={[styles.bar, { height: 90, backgroundColor: theme.colors.primary }]} />
          </View>
          <View style={styles.chartLabels}>
            <Text style={styles.chartLabelText}>Mon</Text>
            <Text style={styles.chartLabelText}>Tue</Text>
            <Text style={styles.chartLabelText}>Wed</Text>
            <Text style={styles.chartLabelText}>Thu</Text>
            <Text style={styles.chartLabelText}>Fri</Text>
            <Text style={styles.chartLabelText}>Sat</Text>
            <Text style={styles.chartLabelText}>Sun</Text>
          </View>
        </View>

        {/* Categories Breakdown */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Top Categories</Text>
          {[
            { id: 1, name: 'Food & Dining', amount: '₹240.00', percent: '50%', color: '#F59E0B', icon: 'restaurant' },
            { id: 2, name: 'Transport', amount: '₹120.00', percent: '25%', color: '#3B82F6', icon: 'car' },
            { id: 3, name: 'Entertainment', amount: '₹80.50', percent: '15%', color: '#8B5CF6', icon: 'game-controller' },
          ].map(cat => (
            <View key={cat.id} style={styles.categoryRow}>
              <View style={[styles.categoryIcon, { backgroundColor: cat.color + '20' }]}>
                <Icon name={cat.icon} size={20} color={cat.color} />
              </View>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{cat.name}</Text>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: cat.percent as DimensionValue, backgroundColor: cat.color }]} />
                </View>
              </View>
              <Text style={styles.categoryAmount}>{cat.amount}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: theme.spacing.m,
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.l,
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  summaryTitle: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginBottom: theme.spacing.xs,
  },
  summaryAmount: {
    color: theme.colors.text,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: theme.spacing.s,
  },
  summaryTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    color: theme.colors.danger,
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: theme.spacing.m,
  },
  chartContainer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.l,
    marginBottom: theme.spacing.l,
  },
  chartPlaceholder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    paddingTop: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  bar: {
    width: 30,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.s,
  },
  chartLabelText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    width: 30,
    textAlign: 'center',
  },
  categoriesContainer: {
    marginBottom: theme.spacing.xl,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.s,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  categoryInfo: {
    flex: 1,
    marginRight: theme.spacing.m,
  },
  categoryName: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: theme.spacing.xs,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: theme.colors.background,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  categoryAmount: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
