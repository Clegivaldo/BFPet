import { ScaleButton } from '@/components/ui/ScaleButton';
import { showToast } from '@/components/ui/Toast';
import { PRIMARY_COLOR } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useImagePicker } from '@/hooks/useImagePicker';
import { profileService } from '@/services/profileService';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const { selectedImage, isLoading: imageLoading, pickImageFromGallery, takePhotoWithCamera } = useImagePicker();
  
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authUser) {
      setName(authUser.name || '');
      setBio(authUser.bio || '');
      setAvatarUrl(authUser.avatarUrl || '');
    }
  }, [authUser]);

  // Atualizar avatarUrl quando uma imagem é selecionada
  useEffect(() => {
    if (selectedImage) {
      setAvatarUrl(selectedImage);
    }
  }, [selectedImage]);

  const handleSave = async () => {
    try {
      if (!name.trim() || name.trim().length < 2) {
        showToast({ message: 'Nome deve ter pelo menos 2 caracteres', type: 'error' });
        return;
      }

      if (bio.length > 500) {
        showToast({ message: 'Bio não pode ter mais de 500 caracteres', type: 'error' });
        return;
      }

      setSaving(true);

      if (authUser) {
        await profileService.updateUserProfile(authUser.id, {
          name: name.trim(),
          bio: bio.trim(),
          avatarUrl: avatarUrl.trim() || undefined,
        });

        showToast({ message: 'Perfil atualizado com sucesso!', type: 'success' });
        router.back();
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      showToast({ message: 'Erro ao atualizar perfil', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        scrollEnabled={true}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={PRIMARY_COLOR} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar Perfil</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Avatar Preview */}
        <View style={styles.avatarSection}>
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={styles.avatarPreview}
            />
          ) : (
            <View style={[styles.avatarPreview, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>
                {name.charAt(0).toUpperCase() || '?'}
              </Text>
            </View>
          )}
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Name Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Nome</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={20}
                color={PRIMARY_COLOR}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Seu nome"
                placeholderTextColor="#ccc"
                value={name}
                onChangeText={setName}
                maxLength={50}
              />
              <Text style={styles.characterCount}>{name.length}/50</Text>
            </View>
          </View>

          {/* Bio Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Biografia</Text>
            <View style={[styles.inputWrapper, styles.bioInputWrapper]}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color={PRIMARY_COLOR}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, styles.bioInput]}
                placeholder="Conte sobre você"
                placeholderTextColor="#ccc"
                value={bio}
                onChangeText={setBio}
                maxLength={500}
                multiline
                numberOfLines={4}
              />
            </View>
            <Text style={styles.bioCharacterCount}>{bio.length}/500</Text>
          </View>

          {/* Avatar Upload Buttons */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Alterar Avatar</Text>
            <View style={styles.avatarButtonsContainer}>
              <TouchableOpacity
                style={[styles.avatarButton, { backgroundColor: PRIMARY_COLOR }]}
                onPress={takePhotoWithCamera}
                disabled={imageLoading}
              >
                {imageLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Ionicons name="camera" size={20} color="#fff" />
                    <Text style={styles.avatarButtonText}>Câmera</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.avatarButton, { backgroundColor: '#9B6FA8' }]}
                onPress={pickImageFromGallery}
                disabled={imageLoading}
              >
                {imageLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Ionicons name="image" size={20} color="#fff" />
                    <Text style={styles.avatarButtonText}>Galeria</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Avatar URL Field (Optional) */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>URL do Avatar (Opcional)</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="link-outline"
                size={20}
                color={PRIMARY_COLOR}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="https://... (ignorar se usar câmera/galeria)"
                placeholderTextColor="#ccc"
                value={avatarUrl}
                onChangeText={setAvatarUrl}
              />
            </View>
          </View>

          {/* Dicas */}
          <View style={styles.tipsContainer}>
            <Ionicons name="information-circle" size={16} color={PRIMARY_COLOR} />
            <Text style={styles.tipText}>
              Clique em Câmera para tirar uma foto ou use a Galeria para escolher uma imagem. Deixe em branco para usar a inicial do seu nome.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
              disabled={saving}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <ScaleButton
              style={styles.saveButton}
              onPress={handleSave}
              disabled={saving}
              scaleValue={0.95}
            >
              {saving ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={20} color="#fff" />
                  <Text style={styles.saveButtonText}>Salvar</Text>
                </>
              )}
            </ScaleButton>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },

  scrollContent: {
    paddingBottom: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  backButton: {
    padding: 8,
    marginLeft: -8,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },

  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },

  avatarPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  avatarPlaceholder: {
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
  },

  formContainer: {
    paddingHorizontal: 16,
  },

  fieldContainer: {
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 12,
  },

  bioInputWrapper: {
    alignItems: 'flex-start',
    paddingVertical: 8,
  },

  inputIcon: {
    marginRight: 8,
  },

  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
  },

  bioInput: {
    paddingTop: 8,
    textAlignVertical: 'top',
  },

  characterCount: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },

  bioCharacterCount: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
  },

  tipsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFE4E9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
    alignItems: 'flex-start',
  },

  tipText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },

  avatarButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },

  avatarButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },

  avatarButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },

  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    alignItems: 'center',
  },

  cancelButtonText: {
    color: PRIMARY_COLOR,
    fontSize: 14,
    fontWeight: '600',
  },

  saveButton: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
