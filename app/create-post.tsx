import { showToast } from '@/components/ui/Toast';
import { PRIMARY_COLOR } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useImagePicker } from '@/hooks/useImagePicker';
import { postService } from '@/services/postService';
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

const POST_TYPES = [
  { id: 'adoption', label: '🐾 Adoção', color: PRIMARY_COLOR },
  { id: 'lost', label: '😢 Perdido', color: '#FF8C42' },
  { id: 'found', label: '🔍 Encontrado', color: '#4ECDC4' },
];

export default function CreatePostScreen() {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const { selectedImage, pickImageFromGallery, takePhotoWithCamera } = useImagePicker();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [postType, setPostType] = useState('adoption');
  const [location, setLocation] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedImage) {
      setImageUri(selectedImage);
    }
  }, [selectedImage]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      showToast({ message: 'Título obrigatório', type: 'error' });
      return;
    }
    if (!description.trim()) {
      showToast({ message: 'Descrição obrigatória', type: 'error' });
      return;
    }
    if (!imageUri.trim()) {
      showToast({ message: 'Foto obrigatória', type: 'error' });
      return;
    }
    if (!authUser) {
      showToast({ message: 'Você não está autenticado', type: 'error' });
      return;
    }

    try {
      setIsSubmitting(true);
      await postService.createPost(authUser.id, {
        title: title.trim(),
        description: description.trim(),
        type: postType as 'adoption' | 'lost' | 'found',
        imageUrl: imageUri.trim(),
        latitude: 0,
        longitude: 0,
        locationName: location.trim() || 'Sem localização',
      });
      showToast({ message: 'Post criado com sucesso!', type: 'success' });
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Erro:', error);
      showToast({ message: 'Erro ao criar post', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color={PRIMARY_COLOR} />
          </TouchableOpacity>
          <Text style={styles.title}>Criar Post</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Tipo */}
        <View style={styles.section}>
          <Text style={styles.label}>Tipo de Post</Text>
          <View style={styles.typeContainer}>
            {POST_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeButton,
                  postType === type.id && styles.typeButtonActive,
                  { backgroundColor: postType === type.id ? type.color : '#f0f0f0' },
                ]}
                onPress={() => setPostType(type.id)}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    postType === type.id && styles.typeButtonTextActive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Imagem */}
        <View style={styles.section}>
          <Text style={styles.label}>Foto</Text>
          {imageUri ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => setImageUri('')}
              >
                <Ionicons name="close-circle" size={32} color={PRIMARY_COLOR} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imagePicker}>
              <TouchableOpacity
                style={[styles.imageButton, { backgroundColor: PRIMARY_COLOR }]}
                onPress={takePhotoWithCamera}
              >
                <Ionicons name="camera" size={24} color="#fff" />
                <Text style={styles.imageButtonText}>Câmera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.imageButton, { backgroundColor: '#9B6FA8' }]}
                onPress={pickImageFromGallery}
              >
                <Ionicons name="image" size={24} color="#fff" />
                <Text style={styles.imageButtonText}>Galeria</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Título */}
        <View style={styles.section}>
          <Text style={styles.label}>Título</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Ex: Cachorro para adoção"
              placeholderTextColor="#ccc"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </View>
          <Text style={styles.counter}>{title.length}/100</Text>
        </View>

        {/* Descrição */}
        <View style={styles.section}>
          <Text style={styles.label}>Descrição</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descreva o pet..."
              placeholderTextColor="#ccc"
              value={description}
              onChangeText={setDescription}
              maxLength={500}
              multiline
              numberOfLines={4}
            />
          </View>
          <Text style={styles.counter}>{description.length}/500</Text>
        </View>

        {/* Local */}
        <View style={styles.section}>
          <Text style={styles.label}>Local (opcional)</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Ex: Parque Central"
              placeholderTextColor="#ccc"
              value={location}
              onChangeText={setLocation}
              maxLength={100}
            />
          </View>
        </View>

        {/* Botões */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => router.back()}
            disabled={isSubmitting}
          >
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="add-circle" size={20} color="#fff" />
                <Text style={styles.submitText}>Criar Post</Text>
              </>
            )}
          </TouchableOpacity>
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
    paddingBottom: 30,
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
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  typeButtonActive: {
    borderColor: PRIMARY_COLOR,
  },
  typeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 250,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  imagePicker: {
    flexDirection: 'row',
    gap: 12,
  },
  imageButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  inputBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  input: {
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
  },
  textArea: {
    textAlignVertical: 'top',
    paddingTop: 8,
  },
  counter: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    color: PRIMARY_COLOR,
    fontSize: 14,
    fontWeight: '600',
  },
  submitBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  submitText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
