import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

type Player = 'X' | 'O' | null;
type GameMode = '1P' | '2P';

export const MiniGameScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const styles = getStyles(theme);

  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('1P');

  const checkWinner = (squares: Player[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (!squares.includes(null)) return 'Draw';
    return null;
  };

  const makeMove = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      if (newWinner === 'Draw') {
        Alert.alert('Game Over', "It's a draw!");
      } else {
        Alert.alert('Congratulations!', `Player ${newWinner} wins!`);
      }
    }
  };

  // AI Logic for 1 Player mode
  useEffect(() => {
    if (gameMode === '1P' && !isXNext && !winner) {
      const timer = setTimeout(() => {
        const availableSpots = board.map((val, index) => val === null ? index : null).filter(val => val !== null) as number[];
        if (availableSpots.length > 0) {
          // Very basic AI: Just pick a random spot
          const randomSpot = availableSpots[Math.floor(Math.random() * availableSpots.length)];
          
          // Helper to check if a move wins or blocks
          const findWinningMove = (player: Player) => {
            for (let i of availableSpots) {
              const testBoard = [...board];
              testBoard[i] = player;
              if (checkWinner(testBoard) === player) return i;
            }
            return null;
          };

          // Try to win first, then try to block X, otherwise random
          let bestMove = findWinningMove('O');
          if (bestMove === null) bestMove = findWinningMove('X');
          if (bestMove === null) bestMove = randomSpot;

          makeMove(bestMove);
        }
      }, 500); // Add a small delay so it feels like the computer is "thinking"
      return () => clearTimeout(timer);
    }
  }, [isXNext, gameMode, board, winner]);

  const handlePress = (index: number) => {
    // In 1P mode, don't allow clicks during O's turn
    if (gameMode === '1P' && !isXNext) return;
    makeMove(index);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const toggleMode = (mode: GameMode) => {
    if (mode !== gameMode) {
      setGameMode(mode);
      resetGame();
    }
  };

  const renderSquare = (index: number) => {
    return (
      <TouchableOpacity 
        style={styles.square} 
        onPress={() => handlePress(index)}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.squareText, 
          board[index] === 'X' ? { color: theme.colors.primary } : { color: theme.colors.secondary }
        ]}>
          {board[index]}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tic Tac Toe</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.modeToggleContainer}>
        <TouchableOpacity 
          style={[styles.modeButton, gameMode === '1P' && styles.modeButtonActive]}
          onPress={() => toggleMode('1P')}
        >
          <Text style={[styles.modeButtonText, gameMode === '1P' && styles.modeButtonTextActive]}>1 Player vs AI</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.modeButton, gameMode === '2P' && styles.modeButtonActive]}
          onPress={() => toggleMode('2P')}
        >
          <Text style={[styles.modeButtonText, gameMode === '2P' && styles.modeButtonTextActive]}>2 Players</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.turnText}>
          {winner 
            ? (winner === 'Draw' ? "It's a Draw!" : `Winner: ${winner}`) 
            : (gameMode === '1P' && !isXNext ? "AI is thinking..." : `Next Player: ${isXNext ? 'X' : 'O'}`)
          }
        </Text>

        <View style={styles.board}>
          <View style={styles.row}>
            {renderSquare(0)}
            {renderSquare(1)}
            {renderSquare(2)}
          </View>
          <View style={styles.row}>
            {renderSquare(3)}
            {renderSquare(4)}
            {renderSquare(5)}
          </View>
          <View style={styles.row}>
            {renderSquare(6)}
            {renderSquare(7)}
            {renderSquare(8)}
          </View>
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
          <Text style={styles.resetButtonText}>Restart Game</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modeToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: theme.spacing.l,
    marginHorizontal: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.m,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: theme.borderRadius.s,
  },
  modeButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  modeButtonText: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  modeButtonTextActive: {
    color: '#FFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  turnText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
  },
  board: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: theme.colors.border,
    padding: 5,
    borderRadius: theme.borderRadius.m,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  square: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.s,
  },
  squareText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  resetButton: {
    marginTop: theme.spacing.xl * 2,
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
