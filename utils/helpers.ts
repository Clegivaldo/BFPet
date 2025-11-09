export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getColorByPostType = (type: 'adoption' | 'found' | 'lost'): string => {
  const colors: Record<string, string> = {
    adoption: '#FF6B6B',
    found: '#51CF66',
    lost: '#FFD43B',
  };
  return colors[type] || '#868E96';
};

export const getEmojiByPostType = (type: 'adoption' | 'found' | 'lost'): string => {
  const emojis: Record<string, string> = {
    adoption: '🐾',
    found: '✅',
    lost: '❌',
  };
  return emojis[type] || '🐾';
};

export const showToast = (
  type: 'success' | 'error' | 'info' | 'warning',
  title: string,
  message: string
): void => {
  // Implementar com Alert nativo do React Native
  import('react-native').then(({ Alert }) => {
    const icons: Record<string, string> = {
      success: '✅',
      error: '❌',
      info: 'ℹ️',
      warning: '⚠️',
    };
    Alert.alert(`${icons[type]} ${title}`, message);
  });
};
