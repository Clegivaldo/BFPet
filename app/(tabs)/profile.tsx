import { FadeInCard } from '@/components/ui/FadeInCard';
import { ScaleButton } from '@/components/ui/ScaleButton';
import { useAuth } from '@/contexts/AuthContext';
import { profileService } from '@/services/profileService';
import { IUser } from '@/types/user.types';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const router = useRouter();
  const { user: authUser, logout } = useAuth();
  const [user, setUser] = useState<IUser | null>(null);
  const [stats, setStats] = useState({ postsCount: 0, likesCount: 0, sharesCount: 0 });
  const [loading, setLoading] = useState(true);

  // Recarregar dados quando a página ganha foco
  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [authUser?.id])
  );

  const loadProfile = async () => {
    try {
      setLoading(true);
      if (!authUser) return;

      const profile = await profileService.getUserProfile(authUser.id);
      const profileStats = await profileService.getUserStats(authUser.id);

      setUser(profile);
      setStats(profileStats);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    router.push('../edit-profile');
  };

  const handleViewPosts = () => {
    router.push('../user-posts');
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B9D" />
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#FF6B9D" />
          <Text style={styles.errorText}>Erro ao carregar perfil</Text>
          <ScaleButton
            style={styles.retryButton}
            onPress={loadProfile}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </ScaleButton>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        scrollEnabled={true}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header com opções */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Meu Perfil</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#FF6B9D" />
          </TouchableOpacity>
        </View>

        {/* Avatar e Info Básica */}
        <FadeInCard delay={50} duration={400}>
          <View style={styles.profileHeader}>
            {user.avatarUrl ? (
              <Image
                source={{ uri: user.avatarUrl }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarText}>
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}

            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              {user.bio && (
                <Text style={styles.userBio} numberOfLines={2}>
                  {user.bio}
                </Text>
              )}
            </View>
          </View>
        </FadeInCard>

        {/* Estatísticas */}
        <FadeInCard delay={100} duration={400}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.postsCount}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.likesCount}</Text>
              <Text style={styles.statLabel}>Curtidas</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.sharesCount}</Text>
              <Text style={styles.statLabel}>Compartilhamentos</Text>
            </View>
          </View>
        </FadeInCard>

        {/* Botões de Ação */}
        <FadeInCard delay={150} duration={400}>
          <View style={styles.actionsContainer}>
            <ScaleButton
              style={styles.actionButton}
              onPress={handleEditProfile}
              scaleValue={0.95}
            >
              <Ionicons name="pencil" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Editar Perfil</Text>
            </ScaleButton>

            <ScaleButton
              style={[styles.actionButton, styles.actionButtonSecondary]}
              onPress={handleViewPosts}
              scaleValue={0.95}
            >
              <Ionicons name="document-text" size={20} color="#FF6B9D" />
              <Text style={styles.actionButtonTextSecondary}>Meus Posts</Text>
            </ScaleButton>
          </View>
        </FadeInCard>

        {/* Info Adicional */}
        <FadeInCard delay={200} duration={400}>
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Informações da Conta</Text>
            
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={20} color="#FF6B9D" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Membro desde</Text>
                <Text style={styles.infoValue}>
                  {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={20} color="#FF6B9D" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
            </View>
          </View>
        </FadeInCard>
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

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },

  logoutButton: {
    padding: 8,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  errorText: {
    fontSize: 16,
    color: '#333',
    marginTop: 12,
    marginBottom: 20,
  },

  retryButton: {
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },

  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  profileHeader: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomWidth: 8,
    borderBottomColor: '#f5f5f5',
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },

  avatarPlaceholder: {
    backgroundColor: '#FF6B9D',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },

  userInfo: {
    alignItems: 'center',
  },

  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },

  userEmail: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },

  userBio: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
    lineHeight: 20,
  },

  statsContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 12,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF6B9D',
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    color: '#666',
  },

  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#f0f0f0',
  },

  actionsContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },

  actionButton: {
    backgroundColor: '#FF6B9D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },

  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  actionButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FF6B9D',
  },

  actionButtonTextSecondary: {
    color: '#FF6B9D',
    fontSize: 14,
    fontWeight: '600',
  },

  infoSection: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  infoContent: {
    marginLeft: 12,
    flex: 1,
  },

  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },

  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});
