import { IUser } from '@/types/user.types';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface CommentFormProps {
  user: IUser | null;
  onSubmit: (text: string) => Promise<void>;
  isLoading?: boolean;
  placeholder?: string;
}

const MAX_CHARS = 500;

export const CommentForm: React.FC<CommentFormProps> = ({
  user,
  onSubmit,
  isLoading = false,
  placeholder = 'Escreva seu comentário...',
}) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleChangeText = (newText: string) => {
    if (newText.length <= MAX_CHARS) {
      setText(newText);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError('Comentário não pode estar vazio');
      return;
    }

    try {
      await onSubmit(text);
      setText('');
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar comentário');
    }
  };

  const isDisabled = isLoading || !text.trim();

  return (
    <View style={styles.container}>
      {/* User Avatar */}
      <View style={styles.avatarContainer}>
        {user?.avatarUrl ? (
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.placeholderAvatar]}>
            <Text style={styles.avatarPlaceholder}>
              {user?.name?.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
        )}
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        {/* Input Area */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#bbb"
            value={text}
            onChangeText={handleChangeText}
            multiline
            maxLength={MAX_CHARS}
            editable={!isLoading}
            numberOfLines={3}
          />

          {/* Enviar Button */}
          <TouchableOpacity
            style={[
              styles.sendButton,
              isDisabled ? styles.sendButtonDisabled : styles.sendButtonEnabled,
            ]}
            onPress={handleSubmit}
            disabled={isDisabled}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.sendButtonText}>→</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Char Counter */}
        <View style={styles.footer}>
          <Text style={styles.charCounter}>
            {text.length}/{MAX_CHARS}
          </Text>

          {/* Error Message */}
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    marginRight: 8,
    marginTop: 4,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  placeholderAvatar: {
    backgroundColor: '#FFE0EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B9D',
  },
  formContainer: {
    flex: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 6,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonEnabled: {
    backgroundColor: '#FF6B9D',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charCounter: {
    fontSize: 11,
    color: '#999',
  },
  errorText: {
    fontSize: 11,
    color: '#dc3545',
    fontWeight: '500',
  },
});
