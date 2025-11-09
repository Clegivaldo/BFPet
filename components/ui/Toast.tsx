import { Alert } from 'react-native';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

let toastTimeout: ReturnType<typeof setTimeout> | null = null;

export const showToast = (props: ToastProps) => {
  const { message, type = 'info', duration = 3000 } = props;

  if (toastTimeout) clearTimeout(toastTimeout);

  Alert.alert(
    type === 'error' ? '❌ Erro' : type === 'success' ? '✅ Sucesso' : '⚠️ Aviso',
    message,
    [{ text: 'OK', onPress: () => {} }],
    { cancelable: true }
  );

  toastTimeout = setTimeout(() => {
    toastTimeout = null;
  }, duration);
};
