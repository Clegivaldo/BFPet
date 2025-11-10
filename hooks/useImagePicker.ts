import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

export function useImagePicker() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImageFromGallery = async (): Promise<string | null> => {
    try {
      setIsLoading(true);
      
      // Solicitar permissão
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permissão de galeria negada');
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setSelectedImage(uri);
        return uri;
      }
      return null;
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const takePhotoWithCamera = async (): Promise<string | null> => {
    try {
      setIsLoading(true);
      
      // Solicitar permissão
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permissão de câmera negada');
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setSelectedImage(uri);
        return uri;
      }
      return null;
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
  };

  return {
    selectedImage,
    isLoading,
    pickImageFromGallery,
    takePhotoWithCamera,
    setSelectedImage,
    clearImage,
  };
}
