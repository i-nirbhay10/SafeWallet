import React from 'react';
import { View, Text, StyleSheet, ScrollView, DimensionValue, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { BarChart } from 'react-native-chart-kit';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Dimensions } from 'react-native';
import { EmptyState } from '../components/EmptyState';

export const InsightsScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { totalExpense, transactions } = useSelector((state: RootState) => state.transactions);
  const screenWidth = Dimensions.get('window').width;

  const calculateChartData = () => {
    const data = [0, 0, 0, 0, 0, 0, 0]; // Sun, Mon, Tue, Wed, Thu, Fri, Sat
    
    transactions.forEach(t => {
      if (t.type === 'expense') {
        const date = t.timestamp ? new Date(t.timestamp) : new Date();
        const day = date.getDay(); // 0 is Sunday, 1 is Monday
        // Re-align so Monday is 0 and Sunday is 6 to match labels
        const adjustedDay = day === 0 ? 6 : day - 1;
        data[adjustedDay] += t.amount;
      }
    });
    
    // Ensure all values are greater than 0 if empty to avoid chart errors, but real 0s are fine
    return data;
  };

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: calculateChartData(),
      },
    ],
  };

  const calculateCategoryData = () => {
    const categoryMap: { [key: string]: { amount: number; icon: string } } = {};
    let localTotal = 0;

    transactions.forEach(t => {
      if (t.type === 'expense') {
        localTotal += t.amount;
        if (categoryMap[t.category]) {
          categoryMap[t.category].amount += t.amount;
        } else {
          categoryMap[t.category] = { amount: t.amount, icon: t.icon || 'cart' };
        }
      }
    });

    const colors = ['#F59E0B', '#3B82F6', '#8B5CF6', '#10B981', '#EF4444', '#F472B6', '#14B8A6'];

    return Object.keys(categoryMap)
      .map((cat, index) => {
        const item = categoryMap[cat];
        const percent = localTotal > 0 ? (item.amount / localTotal) * 100 : 0;
        return {
          id: cat,
          name: cat,
          amount: item.amount,
          percent: `${percent}%`,
          color: colors[index % colors.length],
          icon: item.icon,
        };
      })
      .sort((a, b) => b.amount - a.amount);
  };

  const categoryData = calculateCategoryData();

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Insights</Text>
        <TouchableOpacity 
          style={styles.calendarBtn}
          onPress={() => Alert.alert('Calendar', 'Date range filtering will be available in the next update.')}
        >
          <Text style={styles.calendarBtnText}>This Month</Text>
          <Icon name="calendar-outline" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Monthly Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Spent This Month</Text>
          <Text style={styles.summaryAmount}>₹{totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
          <View style={styles.summaryTrend}>
            <Icon name="remove-circle-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.trendText, { color: theme.colors.textSecondary }]}> No data for last month</Text>
          </View>
        </View>

        {/* Dummy Chart Area */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Spending Overview</Text>
          {totalExpense > 0 ? (
            <BarChart
              data={chartData}
              width={screenWidth - 64}
              height={220}
              yAxisLabel="₹"
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: theme.colors.surface,
                backgroundGradientFrom: theme.colors.surface,
                backgroundGradientTo: theme.colors.surface,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
                labelColor: (opacity = 1) => theme.colors.textSecondary,
                style: {
                  borderRadius: 16,
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          ) : (
            <EmptyState 
              icon="bar-chart-outline" 
              title="No Chart Data" 
              message="Add some expenses to generate your weekly spending chart." 
            />
          )}
        </View>

        {/* Categories Breakdown */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Top Categories</Text>
          {categoryData.length > 0 ? (
            categoryData.map(cat => (
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
                <Text style={styles.categoryAmount}>₹{cat.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
              </View>
            ))
          ) : (
            <EmptyState 
              icon="pie-chart-outline" 
              title="No Spending Data" 
              message="Track your expenses to see your spending categorized here." 
            />
          )}
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
  calendarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: 20,
  },
  calendarBtnText: {
    color: theme.colors.text,
    fontSize: 14,
    marginRight: theme.spacing.s,
    fontWeight: '500',
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
    alignItems: 'center',
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
