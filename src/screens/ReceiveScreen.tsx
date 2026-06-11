import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import Share from 'react-native-share';
import { FullScreenQrModal } from '../components/FullScreenQrModal';
import { RenameQrModal } from '../components/RenameQrModal';

interface QRCodeData {
  id: string;
  uri: string;
  label: string;
}

const STORAGE_KEY = '@safe_wallet_qr_codes';

export const ReceiveScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const itemWidth = (width - 48) / 2;

  const styles = getStyles(theme, itemWidth);

  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([]);
  const [selectedQr, setSelectedQr] = useState<QRCodeData | null>(null);
  const [isRenameModalVisible, setRenameModalVisible] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [qrToRename, setQrToRename] = useState<string | null>(null);

  useEffect(() => {
    loadQrCodes();
  }, []);

  const loadQrCodes = async () => {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData) {
        setQrCodes(JSON.parse(storedData));
      }
    } catch (e) {
      console.log('Error loading QR codes:', e);
    }
  };

  const saveQrCodes = async (codes: QRCodeData[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(codes));
      setQrCodes(codes);
    } catch (e) {
      console.log('Error saving QR codes:', e);
    }
  };

  const handleAddQrCode = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 1 });
    if (result.didCancel || result.errorCode || !result.assets || result.assets.length === 0) {
      return;
    }
    const asset = result.assets[0];
    if (asset.uri) {
      const newQr: QRCodeData = {
        id: Date.now().toString(),
        uri: asset.uri,
        label: 'New QR Code',
      };
      saveQrCodes([...qrCodes, newQr]);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete QR Code', 'Are you sure you want to remove this QR code?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const newCodes = qrCodes.filter(qr => qr.id !== id);
          saveQrCodes(newCodes);
          setSelectedQr(null);
        }
      }
    ]);
  };

  const handleShare = async (uri: string, label: string) => {
    try {
      await Share.open({
        message: `Here is my QR Code for: ${label}`,
        url: uri,
        type: 'image/jpeg',
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const openRenameModal = (id: string, currentLabel: string) => {
    setQrToRename(id);
    setNewLabel(currentLabel);
    setRenameModalVisible(true);
  };

  const handleRenameSave = () => {
    if (qrToRename && newLabel.trim() !== '') {
      const newCodes = qrCodes.map(qr =>
        qr.id === qrToRename ? { ...qr, label: newLabel } : qr
      );
      saveQrCodes(newCodes);

      if (selectedQr?.id === qrToRename) {
        setSelectedQr({ ...selectedQr, label: newLabel });
      }

      setRenameModalVisible(false);
      setQrToRename(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Receive Money</Text>
        <TouchableOpacity onPress={handleAddQrCode}>
          <Icon name="add-circle" size={28} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {qrCodes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="qr-code-outline" size={64} color={theme.colors.border} />
            <Text style={styles.emptyTitle}>No QR Codes Saved</Text>
            <Text style={styles.emptyDesc}>Add your personal, business, or UPI QR codes from your gallery to quickly receive payments.</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAddQrCode}>
              <Text style={styles.addButtonText}>Add QR Code</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.grid}>
            {qrCodes.map(qr => (
              <TouchableOpacity
                key={qr.id}
                style={styles.gridItem}
                onPress={() => setSelectedQr(qr)}
                onLongPress={() => openRenameModal(qr.id, qr.label)}
              >
                <Image source={{ uri: qr.uri }} style={styles.qrThumbnail} resizeMode="cover" />
                <View style={styles.qrLabelContainer}>
                  <Text style={styles.qrLabelText} numberOfLines={1}>{qr.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Full Screen View Modal */}
      <FullScreenQrModal
        visible={!!selectedQr}
        selectedQr={selectedQr}
        onClose={() => setSelectedQr(null)}
        onShare={handleShare}
        onEdit={(id, label) => {
          setSelectedQr(null);
          openRenameModal(id, label);
        }}
        onDelete={handleDelete}
      />

      {/* Rename Modal */}
      <RenameQrModal
        visible={isRenameModalVisible}
        value={newLabel}
        onChangeText={setNewLabel}
        onCancel={() => setRenameModalVisible(false)}
        onSave={handleRenameSave}
      />
    </SafeAreaView>
  );
};

const getStyles = (theme: any, itemWidth: number) => StyleSheet.create({
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
  headerTitle: { color: theme.colors.text, fontSize: 18, fontWeight: 'bold' },
  content: {
    padding: theme.spacing.m,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.s,
  },
  emptyDesc: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.l,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: itemWidth,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.m,
    overflow: 'hidden',
    marginBottom: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  qrThumbnail: {
    width: '100%',
    height: itemWidth,
  },
  qrLabelContainer: {
    padding: theme.spacing.s,
    backgroundColor: theme.colors.surface,
  },
  qrLabelText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
