import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface RenameQrModalProps {
  visible: boolean;
  value: string;
  onChangeText: (text: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

export const RenameQrModal: React.FC<RenameQrModalProps> = ({
  visible,
  value,
  onChangeText,
  onCancel,
  onSave,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.renameContainer}>
          <Text style={styles.renameTitle}>Rename QR Code</Text>
          <TextInput
            style={styles.renameInput}
            value={value}
            onChangeText={onChangeText}
            placeholder="e.g., Personal UPI"
            placeholderTextColor={theme.colors.textSecondary}
            autoFocus
          />
          <View style={styles.renameButtons}>
            <TouchableOpacity style={styles.renameCancelBtn} onPress={onCancel}>
              <Text style={styles.renameCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.renameSaveBtn} onPress={onSave}>
              <Text style={styles.renameSaveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  renameContainer: {
    backgroundColor: theme.colors.surface,
    width: '80%',
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.l,
  },
  renameTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: theme.spacing.m,
  },
  renameInput: {
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.l,
  },
  renameButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  renameCancelBtn: {
    padding: theme.spacing.m,
    marginRight: theme.spacing.s,
  },
  renameCancelText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
  renameSaveBtn: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.m,
  },
  renameSaveText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
