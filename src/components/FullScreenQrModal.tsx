import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeContext';

interface QRCodeData {
  id: string;
  uri: string;
  label: string;
}

interface FullScreenQrModalProps {
  visible: boolean;
  selectedQr: QRCodeData | null;
  onClose: () => void;
  onShare: (uri: string, label: string) => void;
  onEdit: (id: string, label: string) => void;
  onDelete: (id: string) => void;
}

export const FullScreenQrModal: React.FC<FullScreenQrModalProps> = ({
  visible,
  selectedQr,
  onClose,
  onShare,
  onEdit,
  onDelete,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  if (!selectedQr) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.fullScreenContainer}>
          <View style={styles.fullScreenHeader}>
            <Text style={styles.fullScreenTitle}>{selectedQr.label}</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={28} color="#FFF" />
            </TouchableOpacity>
          </View>
          
          <Image source={{ uri: selectedQr.uri }} style={styles.fullScreenImage} resizeMode="contain" />

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton} onPress={() => onShare(selectedQr.uri, selectedQr.label)}>
              <Icon name="share-outline" size={24} color="#FFF" />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => onEdit(selectedQr.id, selectedQr.label)}>
              <Icon name="pencil-outline" size={24} color="#FFF" />
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.danger + '80' }]} onPress={() => onDelete(selectedQr.id)}>
              <Icon name="trash-outline" size={24} color="#FFF" />
              <Text style={styles.actionText}>Delete</Text>
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
  fullScreenContainer: {
    flex: 1,
    width: '100%',
    padding: theme.spacing.l,
    justifyContent: 'center',
  },
  fullScreenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  fullScreenTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  fullScreenImage: {
    width: '100%',
    height: '60%',
    backgroundColor: '#FFF',
    borderRadius: theme.borderRadius.m,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xl,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    marginHorizontal: 5,
  },
  actionText: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 4,
  },
});
