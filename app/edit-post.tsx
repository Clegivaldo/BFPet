import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { useAuth } from '@/contexts/AuthContext';
import { postService } from '@/services/postService';
import { showToast } from '@/utils/helpers';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditPostScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const postId = params.postId ? Number(params.postId) : null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [locationName, setLocationName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!postId) return;
      try {
        const post = await postService.getPostById(postId);
        if (!post) {
          showToast('error', 'Erro', 'Publicação não encontrada');
          router.replace('/(tabs)');
          return;
        }
        // Se não for dono, bloquear
        if (!user || post.userId !== user.id) {
          showToast('error', 'Erro', 'Você não tem permissão para editar esta publicação');
          router.replace('/(tabs)');
          return;
        }

        setTitle(post.title || '');
        setDescription(post.description || '');
        setImageUrl(post.imageUrl || '');
        setLocationName(post.locationName || '');
      } catch (error) {
        console.error('Erro ao carregar post para edição:', error);
        showToast('error', 'Erro', 'Não foi possível carregar a publicação');
        router.replace('/(tabs)');
      }
    };

    load();
  }, [postId, router, user]);

  const handleSave = async () => {
    if (!postId || !user) return;
    setLoading(true);
    try {
      await postService.updatePost(postId, user.id, {
        title,
        description,
        imageUrl,
        locationName,
      } as any);

      showToast('success', 'Sucesso', 'Publicação atualizada');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Erro ao salvar edição:', error);
      showToast('error', 'Erro', 'Não foi possível atualizar a publicação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoid}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Editar Publicação</Text>
              <Text style={styles.subtitle}>Atualize as informações da sua publicação</Text>
            </View>

            <View style={styles.form}>
              <TextInput label="Título" value={title} onChangeText={setTitle} editable={!loading} />
              <TextInput label="Descrição" value={description} onChangeText={setDescription} multiline editable={!loading} />
              <TextInput label="Imagem (URL)" value={imageUrl} onChangeText={setImageUrl} editable={!loading} />
              <TextInput label="Local" value={locationName} onChangeText={setLocationName} editable={!loading} />

              <Button title="Salvar" onPress={handleSave} loading={loading} size="large" style={styles.button} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f9fa' },
  keyboardAvoid: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  container: { flex: 1, paddingHorizontal: 20, paddingVertical: 20 },
  header: { marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', color: '#333' },
  subtitle: { fontSize: 13, color: '#666' },
  form: { marginTop: 12 },
  button: { marginTop: 16 },
});
