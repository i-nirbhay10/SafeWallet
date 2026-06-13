import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { PaymentCardItem, PaymentCard } from '../components/PaymentCardItem';
import { ManageCardModal } from '../components/ManageCardModal';

export const ManageCardsScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const [cards, setCards] = useState<PaymentCard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'lastAdded' | 'bank' | 'type'>('lastAdded');
  
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingCard, setEditingCard] = useState<PaymentCard | null>(null);
  
  const [visibleCards, setVisibleCards] = useState<Record<string, boolean>>({});

  // Initial load
  React.useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const stored = await AsyncStorage.getItem('@payment_cards');
      if (stored) setCards(JSON.parse(stored));
    } catch (e) {
      console.log('Failed to load cards');
    }
  };

  const saveCards = async (newCards: PaymentCard[]) => {
    setCards(newCards);
    try {
      await AsyncStorage.setItem('@payment_cards', JSON.stringify(newCards));
    } catch (e) {
      console.log('Failed to save cards');
    }
  };

  const handleSave = (form: Partial<PaymentCard>, editingId: string | null) => {
    if (editingId) {
      const updated = cards.map(c => c.id === editingId ? { ...c, ...form } as PaymentCard : c);
      saveCards(updated);
      Alert.alert('Success', 'Card updated successfully.');
    } else {
      const newCard: PaymentCard = {
        id: Date.now().toString(),
        cardholderName: form.cardholderName || '',
        cardNumber: form.cardNumber || '',
        expiryDate: form.expiryDate || '',
        cvv: form.cvv || '',
        cardType: (form.cardType as any) || 'Debit',
        bankName: form.bankName || '',
        network: form.network || 'Visa',
        notes: form.notes || '',
        createdAt: Date.now(),
      };
      saveCards([...cards, newCard]);
      Alert.alert('Success', 'Card added successfully.');
    }
    setModalVisible(false);
  };

  const openModal = (card?: PaymentCard) => {
    if (card) {
      setEditingCard(card);
    } else {
      setEditingCard(null);
    }
    setModalVisible(true);
  };

  const deleteCard = (id: string) => {
    Alert.alert('Delete Card', 'Are you sure you want to remove this card?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
          saveCards(cards.filter(c => c.id !== id));
      }}
    ]);
  };

  const toggleVisibility = (id: string) => {
    setVisibleCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (text: string) => {
    Alert.alert('Copied', 'Card details copied to clipboard.');
  };

  // Filter & Sort
  const displayedCards = useMemo(() => {
    let result = cards.filter(c => 
      c.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.cardholderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.network.toLowerCase().includes(searchQuery.toLowerCase())
    );

    result.sort((a, b) => {
      if (sortOption === 'bank') return a.bankName.localeCompare(b.bankName);
      if (sortOption === 'type') return a.cardType.localeCompare(b.cardType);
      return b.createdAt - a.createdAt; // lastAdded
    });

    return result;
  }, [cards, searchQuery, sortOption]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Cards</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchSortContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search cards..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortOptions} contentContainerStyle={{ paddingRight: 16 }}>
          {['lastAdded', 'bank', 'type'].map(opt => (
            <TouchableOpacity 
              key={opt}
              style={[styles.sortBtn, sortOption === opt && styles.sortBtnActive]}
              onPress={() => setSortOption(opt as any)}
            >
              <Text style={[styles.sortBtnText, sortOption === opt && styles.sortBtnTextActive]}>
                {opt === 'lastAdded' ? 'Recent' : opt === 'bank' ? 'Bank' : 'Card Type'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        {displayedCards.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="card-outline" size={64} color={theme.colors.border} />
            <Text style={styles.emptyTitle}>No Cards Found</Text>
            <Text style={styles.emptyDesc}>Add your credit or debit cards to manage them securely.</Text>
          </View>
        ) : (
          displayedCards.map((card, index) => (
            <PaymentCardItem 
              key={`${card.id}-${index}`}
              card={card}
              isVisible={!!visibleCards[card.id]}
              onToggleVisibility={toggleVisibility}
              onEdit={openModal}
              onDelete={deleteCard}
            />
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => openModal()}>
        <Icon name="add" size={28} color="#FFF" />
      </TouchableOpacity>

      {/* Manage Card Modal */}
      <ManageCardModal 
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        initialCard={editingCard}
      />
    </SafeAreaView>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: theme.spacing.m, paddingVertical: theme.spacing.m, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  headerTitle: { color: theme.colors.text, fontSize: 18, fontWeight: 'bold' },
  searchSortContainer: { padding: theme.spacing.m, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.m, paddingHorizontal: theme.spacing.m, paddingVertical: 8, marginBottom: theme.spacing.m },
  searchInput: { flex: 1, marginLeft: 8, color: theme.colors.text, fontSize: 16 },
  sortOptions: { flexDirection: 'row' },
  sortBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, backgroundColor: theme.colors.surface, marginRight: 8, borderWidth: 1, borderColor: theme.colors.border },
  sortBtnActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  sortBtnText: { color: theme.colors.textSecondary, fontSize: 14, fontWeight: '500' },
  sortBtnTextActive: { color: '#FFF' },
  listContent: { padding: theme.spacing.m, paddingBottom: 100 },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyTitle: { color: theme.colors.text, fontSize: 20, fontWeight: 'bold', marginTop: 16 },
  emptyDesc: { color: theme.colors.textSecondary, fontSize: 14, textAlign: 'center', marginTop: 8, marginHorizontal: 32 },
  
  fab: { position: 'absolute', bottom: 24, right: 24, width: 60, height: 60, borderRadius: 30, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center', shadowColor: theme.colors.primary, shadowOffset: {width:0, height:4}, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6 },
});
