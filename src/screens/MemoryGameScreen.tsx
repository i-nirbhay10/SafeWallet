import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const ICONS = ['airplane', 'car', 'bicycle', 'boat', 'bus', 'rocket', 'train', 'walk'];

interface CardData {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryGameScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const styles = getStyles(theme);

  const [cards, setCards] = useState<CardData[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);

  const initializeGame = () => {
    const deck = [...ICONS, ...ICONS]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({
        id: index,
        icon,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
    setMatches(0);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      if (cards[firstIndex].icon === cards[secondIndex].icon) {
        // Match found
        setCards(prev => {
          const newCards = [...prev];
          newCards[firstIndex].isMatched = true;
          newCards[secondIndex].isMatched = true;
          return newCards;
        });
        setMatches(m => m + 1);
        setFlippedIndices([]);
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          setCards(prev => {
            const newCards = [...prev];
            newCards[firstIndex].isFlipped = false;
            newCards[secondIndex].isFlipped = false;
            return newCards;
          });
          setFlippedIndices([]);
        }, 1000);
      }
      setMoves(m => m + 1);
    }
  }, [flippedIndices]);

  useEffect(() => {
    if (matches === ICONS.length) {
      Alert.alert('Congratulations!', `You won in ${moves} moves!`, [
        { text: 'Play Again', onPress: initializeGame }
      ]);
    }
  }, [matches, moves]);

  const handleCardPress = (index: number) => {
    if (
      flippedIndices.length === 2 || 
      cards[index].isFlipped || 
      cards[index].isMatched
    ) return;

    setCards(prev => {
      const newCards = [...prev];
      newCards[index].isFlipped = true;
      return newCards;
    });

    setFlippedIndices(prev => [...prev, index]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Memory Match</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>Moves: {moves}</Text>
        <Text style={styles.statsText}>Matches: {matches} / {ICONS.length}</Text>
      </View>

      <View style={styles.board}>
        {cards.map((card, index) => (
          <TouchableOpacity 
            key={card.id} 
            style={[
              styles.card, 
              (card.isFlipped || card.isMatched) ? styles.cardFlipped : null,
              card.isMatched ? styles.cardMatched : null
            ]}
            onPress={() => handleCardPress(index)}
            activeOpacity={0.8}
          >
            {(card.isFlipped || card.isMatched) ? (
              <Icon name={card.icon} size={32} color={card.isMatched ? '#FFF' : theme.colors.primary} />
            ) : (
              <Icon name="help-outline" size={32} color={theme.colors.textSecondary} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={initializeGame}>
        <Text style={styles.resetButtonText}>Restart Game</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    width: '100%',
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  statsText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  board: {
    width: '90%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '23%',
    aspectRatio: 1,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: theme.borderRadius.m,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  cardFlipped: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.primary,
  },
  cardMatched: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  resetButton: {
    marginTop: theme.spacing.xl,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.l,
  },
  resetButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
