import { PRIMARY_COLOR } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/services/db/sqlite';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

/**
 * 🧪 Debug Screen - Para diagnosticar problemas de navegação e autenticação
 * 
 * USE APENAS DURANTE DESENVOLVIMENTO
 * Remova ou comente quando for para produção
 */
export default function DebugScreen() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  // Debug info is read directly from useAuth() in the render below.

  const handleClearDatabase = async () => {
    Alert.alert(
      'Limpar Banco de Dados',
      'Isso vai apagar todos os dados. Deseja continuar?',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Limpar',
          onPress: async () => {
            try {
              // Apagar tabela current_user
              // @ts-ignore
              await db.db?.execAsync('DELETE FROM current_user');
              
              Alert.alert(
                'Sucesso',
                'Banco de dados limpo. O app vai reiniciar em LOGIN.'
              );
              
              // Fazer logout e voltar para login
              await logout();
              router.replace('/login');
            } catch (error) {
              console.error('Error clearing database:', error);
              Alert.alert('Erro', 'Erro ao limpar banco de dados');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNavigateToLogin = () => {
    router.push('/login');
  };

  const handleNavigateToSignup = () => {
    router.push('/signup');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🧪 Debug Screen</Text>

        {/* Estado de Autenticação */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Estado de Autenticação</Text>
          <View style={styles.box}>
            <Text style={styles.label}>Is Authenticated:</Text>
            <Text style={[styles.value, { color: isAuthenticated ? '#28a745' : '#dc3545' }]}>
              {String(isAuthenticated)}
            </Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.label}>Is Loading:</Text>
            <Text style={[styles.value, { color: isLoading ? '#ffc107' : '#6c757d' }]}>
              {String(isLoading)}
            </Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.label}>User:</Text>
            {user ? (
              <View>
                <Text style={styles.value}>ID: {user.id}</Text>
                <Text style={styles.value}>Email: {user.email}</Text>
                <Text style={styles.value}>Name: {user.name}</Text>
              </View>
            ) : (
              <Text style={[styles.value, { color: '#dc3545' }]}>Null</Text>
            )}
          </View>
        </View>

        {/* Testes de Navegação */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧭 Testes de Navegação</Text>

          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={handleNavigateToLogin}
          >
            <Text style={styles.buttonText}>→ Ir para LOGIN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={handleNavigateToSignup}
          >
            <Text style={styles.buttonText}>→ Ir para SIGNUP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.buttonText}>→ Ir para FEED</Text>
          </TouchableOpacity>
        </View>

        {/* Ações de Banco de Dados */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💾 Banco de Dados</Text>

          <TouchableOpacity
            style={[styles.button, styles.buttonWarning]}
            onPress={handleClearDatabase}
          >
            <Text style={styles.buttonText}>🗑️ Limpar Banco de Dados</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonDanger]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>🚪 Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Instruções */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Instruções</Text>
          <View style={styles.instructionBox}>
            <Text style={styles.instructionText}>
              1. Se Is Authenticated = true mas você vê Signup, há um bug no redirect
            </Text>
            <Text style={styles.instructionText}>
              2. Clique em Limpar Banco de Dados para fazer reset
            </Text>
            <Text style={styles.instructionText}>
              3. Use os botões de navegação para testar rotas
            </Text>
            <Text style={styles.instructionText}>
              4. Verifique o console para logs de erro
            </Text>
          </View>
        </View>

        <View style={styles.spacing} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: PRIMARY_COLOR,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: PRIMARY_COLOR,
    paddingBottom: 8,
  },
  box: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY_COLOR,
  },
  label: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  button: {
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: PRIMARY_COLOR,
  },
  buttonWarning: {
    backgroundColor: '#ffc107',
  },
  buttonDanger: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  instructionBox: {
    backgroundColor: '#e7f5ff',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#1971c2',
  },
  instructionText: {
    fontSize: 12,
    color: '#1971c2',
    marginBottom: 8,
    lineHeight: 18,
  },
  spacing: {
    height: 40,
  },
});
