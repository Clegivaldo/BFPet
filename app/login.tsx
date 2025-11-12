import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { showToast } from '@/components/ui/Toast';
import { PRIMARY_COLOR } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { loginSchema } from '@/utils/validators';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ZodError } from 'zod';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('teste@bfpet.com');
  const [password, setPassword] = useState('senha123');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogin = async () => {
    try {
      setErrors({});
      setLoading(true);

      // Validar inputs
      const formData = loginSchema.parse({
        email,
        password,
      });

      // Fazer login
      const success = await login(formData.email, formData.password);

      if (success) {
        showToast({
          message: 'Login realizado com sucesso!',
          type: 'success',
        });
        // Navegar para feed
        router.replace('/(tabs)');
      } else {
        showToast({
          message: 'Email ou senha incorretos',
          type: 'error',
        });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as string;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      } else {
        showToast({
          message: 'Erro ao fazer login. Tente novamente.',
          type: 'error',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToSignup = () => {
    // @ts-ignore - route exists at runtime
    router.push('/signup');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.logo}>🐾 BFpet</Text>
              <Text style={styles.subtitle}>Best Friend Pet</Text>
              <Text style={styles.description}>
                Encontre e compartilhe informações sobre seus pets favoritos
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <TextInput
                label="Email"
                placeholder="seu@email.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: '' }));
                  }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
                error={errors.email}
              />

              <TextInput
                label="Senha"
                placeholder="••••••"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: '' }));
                  }
                }}
                secureTextEntry
                editable={!loading}
                error={errors.password}
              />

              <Button
                title="Entrar"
                onPress={handleLogin}
                loading={loading}
                size="large"
                style={styles.button}
              />
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Não tem conta? </Text>
              <TouchableOpacity onPress={handleNavigateToSignup} disabled={loading}>
                <Text style={styles.linkText}>Criar conta</Text>
              </TouchableOpacity>
            </View>

            {/* Teste Info */}
            <View style={styles.testInfo}>
              <Text style={styles.testLabel}>📋 Dados de Teste:</Text>
              <Text style={styles.testValue}>Email: teste@bfpet.com</Text>
              <Text style={styles.testValue}>Senha: senha123</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: PRIMARY_COLOR,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  form: {
    marginBottom: 24,
  },
  button: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  linkText: {
    fontSize: 14,
    color: PRIMARY_COLOR,
    fontWeight: '600',
  },
  testInfo: {
    backgroundColor: '#e7f5ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  testLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1971c2',
    marginBottom: 6,
  },
  testValue: {
    fontSize: 12,
    color: '#1971c2',
    marginBottom: 2,
  },
});
