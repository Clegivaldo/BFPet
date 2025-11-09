import { showToast } from '@/components/ui/Toast';
import { useThemeColor } from '@/hooks/use-theme-color';
import { shareService } from '@/services/shareService';
import { IPost } from '@/types/post.types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface ShareModalProps {
  visible: boolean;
  post: IPost;
  userId: number;
  onClose: () => void;
  onShareSuccess?: () => void;
}

export function ShareModal({
  visible,
  post,
  userId,
  onClose,
  onShareSuccess,
}: ShareModalProps) {
  const [loading, setLoading] = useState(false);
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const handleShareNative = async () => {
    try {
      setLoading(true);
      const success = await shareService.sharePostNative(post, userId);
      
      if (success) {
        showToast({ message: 'Post compartilhado com sucesso! 🎉', type: 'success' });
        onShareSuccess?.();
        onClose();
      } else {
        showToast({ message: 'Compartilhamento cancelado', type: 'info' });
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      showToast({ message: 'Erro ao compartilhar. Tente novamente.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      setLoading(true);
      const link = await shareService.copyShareLink(post, userId);
      showToast({ message: `Link copiado: ${link.substring(0, 20)}...`, type: 'success' });
      onShareSuccess?.();
      onClose();
    } catch (error) {
      console.error('Erro ao copiar link:', error);
      showToast({ message: 'Erro ao copiar link. Tente novamente.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        {/* Background para fechar ao tocar */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Sheet */}
        <View style={[styles.sheet, { backgroundColor }]}>
          {/* Handle bar */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: textColor }]}>
              Compartilhar Post
            </Text>
            <TouchableOpacity onPress={onClose} disabled={loading}>
              <Ionicons
                name="close"
                size={24}
                color={textColor}
                style={{ opacity: loading ? 0.5 : 1 }}
              />
            </TouchableOpacity>
          </View>

          {/* Options */}
          <View style={styles.content}>
            {/* Share Native */}
            <TouchableOpacity
              style={[styles.option, { backgroundColor: `${tintColor}15` }]}
              onPress={handleShareNative}
              disabled={loading}
              activeOpacity={0.7}
            >
              {loading ? (
                <ActivityIndicator color={tintColor} size="small" />
              ) : (
                <Ionicons
                  name="share-social"
                  size={24}
                  color={tintColor}
                />
              )}
              <View style={styles.optionText}>
                <Text style={[styles.optionTitle, { color: textColor }]}>
                  Compartilhar
                </Text>
                <Text style={[styles.optionSubtitle, { color: `${textColor}99` }]}>
                  WhatsApp, SMS, Email...
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={`${textColor}66`}
              />
            </TouchableOpacity>

            {/* Copy Link */}
            <TouchableOpacity
              style={[styles.option, { backgroundColor: `${tintColor}15` }]}
              onPress={handleCopyLink}
              disabled={loading}
              activeOpacity={0.7}
            >
              {loading ? (
                <ActivityIndicator color={tintColor} size="small" />
              ) : (
                <Ionicons
                  name="link"
                  size={24}
                  color={tintColor}
                />
              )}
              <View style={styles.optionText}>
                <Text style={[styles.optionTitle, { color: textColor }]}>
                  Copiar Link
                </Text>
                <Text style={[styles.optionSubtitle, { color: `${textColor}99` }]}>
                  Colar em qualquer lugar
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={`${textColor}66`}
              />
            </TouchableOpacity>

            {/* Post Info */}
            <View style={[styles.infoBox, { backgroundColor: `${tintColor}10` }]}>
              <Ionicons
                name="information-circle"
                size={16}
                color={tintColor}
              />
              <Text style={[styles.infoText, { color: `${textColor}99` }]}>
                Cada compartilhamento ajuda mais pessoas a encontrarem {post.type === 'adoption' ? 'animais para adotar' : 'animais perdidos ou encontrados'}.
              </Text>
            </View>
          </View>

          {/* Cancel Button */}
          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: `${tintColor}10` }]}
            onPress={onClose}
            disabled={loading}
          >
            <Text style={[styles.cancelText, { color: tintColor }]}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  optionText: {
    flex: 1,
    marginLeft: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 13,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  infoText: {
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  cancelButton: {
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
