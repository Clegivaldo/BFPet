import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
};

export const formatTime = (date: string | Date): string => {
  return format(new Date(date), 'HH:mm', { locale: ptBR });
};

export const formatDateTime = (date: string | Date): string => {
  return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
};

export const formatRelativeTime = (date: string | Date): string => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: ptBR,
  });
};

export const formatPostType = (type: 'adoption' | 'found' | 'lost'): string => {
  const types: Record<string, string> = {
    adoption: '🐾 Para Adoção',
    found: '✅ Encontrado',
    lost: '❌ Perdido',
  };
  return types[type] || type;
};

export const formatLocation = (latitude: number, longitude: number): string => {
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
};

export const truncateText = (text: string, maxLength: number = 100): string => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export const maskEmail = (email: string): string => {
  const [name, domain] = email.split('@');
  const maskedName = name.substring(0, 2) + '*'.repeat(Math.max(0, name.length - 4)) + name.substring(name.length - 2);
  return `${maskedName}@${domain}`;
};
