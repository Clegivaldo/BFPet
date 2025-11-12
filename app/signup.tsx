import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { showToast } from '@/components/ui/Toast';
import { PRIMARY_COLOR } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { signupSchema } from '@/utils/validators';
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

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSignup = async () => {
    try {
      setErrors({});
      setLoading(true);

      // Validar inputs
      const formData = signupSchema.parse({
        name,
        email,
        password,
        confirmPassword,
      });

      console.log('[Signup] 📝 Enviando:', { name: formData.name, email: formData.email });

      // Fazer signup
      const success = await signup(
        formData.name,
        formData.email,
        formData.password
      );

      console.log('[Signup] Resultado:', success);

      if (success) {
        showToast({
          message: 'Conta criada com sucesso!',
          type: 'success',
        });
        // Navegar para feed
        router.replace('/(tabs)');
      } else {
        showToast({
          message: 'Erro ao criar conta. Email já pode estar em uso.',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('[Signup] Erro:', error);
      if (error instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as string;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      } else {
        showToast({
          message: 'Erro ao criar conta. Tente novamente.',
          type: 'error',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToLogin = () => {
    // Substitui a rota atual para evitar empilhar telas e garantir
    // comportamento consistente do botão "voltar".
    router.replace('/login');
  };

  const isFormValid =
    name.trim() !== '' &&
    email.trim() !== '' &&
    password !== '' &&
    confirmPassword !== '';

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
              <TouchableOpacity
                onPress={handleNavigateToLogin}
                style={styles.backButton}
              >
                <Text style={styles.backText}>← Voltar</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Criar Conta</Text>
              <Text style={styles.subtitle}>Junte-se à comunidade BFpet</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <TextInput
                label="Nome Completo"
                placeholder="Seu nome"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: '' }));
                  }
                }}
                editable={!loading}
                error={errors.name}
              />

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

              <TextInput
                label="Confirmar Senha"
                placeholder="••••••"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) {
                    setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                  }
                }}
                secureTextEntry
                editable={!loading}
                error={errors.confirmPassword}
              />

              <Button
                title="Criar Conta"
                onPress={handleSignup}
                loading={loading}
                size="large"
                style={styles.button}
                disabled={!isFormValid}
              />
            </View>

            {/* Info */}
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                ✅ Ao criar uma conta, você concorda com nossos Termos de
                Serviço
              </Text>
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
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: 32,
    marginTop: 16,
  },
  backButton: {
    marginBottom: 16,
  },
  backText: {
    fontSize: 14,
    color: PRIMARY_COLOR,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  form: {
    marginBottom: 24,
  },
  button: {
    marginTop: 16,
  },
  infoBox: {
    backgroundColor: '#e7f5ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  infoText: {
    fontSize: 12,
    color: '#1971c2',
    fontWeight: '500',
  },
});
