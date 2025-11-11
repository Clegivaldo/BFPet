// Usando console.warn como um placeholder para a funcionalidade de Toast
// para evitar que a aplicação quebre devido à importação ausente.

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
}

export const showToast = ({ message, type = 'info' }: ToastProps) => {
  console.warn(`[Toast:${type}] ${message}`);
};