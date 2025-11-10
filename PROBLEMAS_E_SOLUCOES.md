# 🔧 4 Problemas Identificados e Soluções

## 🚨 PROBLEMA 1: Nome do Perfil Não Atualiza ao Salvar

### ❌ Sintoma
- Edita o nome em "Editar Perfil"
- Clica em "Salvar"
- Vê mensagem "Perfil atualizado com sucesso!"
- Volta para o perfil
- **O nome antigo continua aparecendo**

### 🔍 Root Cause
O `profile.tsx` carrega os dados **uma única vez** com `useEffect([])`. Quando você volta da tela de edição, a página não recarrega os dados do banco.

### ✅ SOLUÇÃO
Adicionar `useFocusEffect` do `@react-navigation/native` para recarregar dados quando a página ganha foco:

**Arquivo:** `app/(tabs)/profile.tsx`

```typescript
// Adicionar imports no topo
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

// Substituir useEffect por useFocusEffect
useFocusEffect(
  useCallback(() => {
    loadProfile();
  }, [authUser?.id])
);

// Remover o useEffect([])
```

---

## 🖼️ PROBLEMA 2: Avatar é Link, Não Upload de Galeria/Câmera

### ❌ Sintoma
- Em "Editar Perfil", o campo de avatar é apenas um link de URL
- Usuário não consegue tirar foto ou escolher da galeria
- Não há botão para capturar imagem

### ✅ SOLUÇÃO
Usar `expo-image-picker` para permitir:
1. ✅ Tirar foto com câmera
2. ✅ Escolher foto da galeria
3. ✅ Upload da imagem

**Passos:**

#### Passo 1: Verificar se expo-image-picker está instalado
```bash
npm list expo-image-picker
# Se não tiver:
npm install expo-image-picker
```

#### Passo 2: Criar hook customizado para upload

**Arquivo:** `hooks/useImagePicker.ts`

```typescript
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

export function useImagePicker() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImageFromGallery = async () => {
    try {
      setIsLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        return result.assets[0].uri;
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const takePhotoWithCamera = async () => {
    try {
      setIsLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        return result.assets[0].uri;
      }
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    selectedImage,
    isLoading,
    pickImageFromGallery,
    takePhotoWithCamera,
    setSelectedImage,
  };
}
```

#### Passo 3: Adicionar permissões no app.json

**Arquivo:** `app.json`

```json
{
  "expo": {
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "O BFpet precisa acessar suas fotos para usar como avatar",
          "cameraPermission": "O BFpet precisa da câmera para tirar uma foto de perfil"
        }
      ]
    ]
  }
}
```

#### Passo 4: Atualizar edit-profile.tsx

Adicione botões para câmera e galeria onde é o campo de URL de avatar.

---

## 🗺️ PROBLEMA 3: Tela Explore Vazia/Padrão

### ❌ Sintoma
- A tela "Explore" existe mas é apenas conteúdo de demonstração
- Não mostra posts de outros usuários
- Não tem funcionalidade real

### ✅ SOLUÇÃO
A tela `app/(tabs)/explore.tsx` precisa ser substituída por:
1. ✅ Lista de posts de TODOS os usuários
2. ✅ Permite dar like/comentar
3. ✅ Busca/filtro de posts

**Estrutura esperada:**
```typescript
// app/(tabs)/explore.tsx
// - Header com busca
// - Lista de posts (FlatList)
// - Cada post tem:
//   - Avatar do usuário
//   - Nome do usuário
//   - Imagem/descrição
//   - Botões: like, comentar, compartilhar
```

---

## ➕ PROBLEMA 4: Falta Botão para Adicionar Postagem

### ❌ Sintoma
- Não há forma de criar novo post
- Não existe aba ou botão "Criar Post"
- Usuário preso vendo apenas posts existentes

### ✅ SOLUÇÃO
Adicionar de uma das formas:

**Opção A: Aba "Criar" na barra de navegação**
- Adicionar 4ª aba no `app/(tabs)/_layout.tsx`
- Tela: `app/(tabs)/create.tsx`

**Opção B: Botão FAB (Floating Action Button)**
- Botão flutuante no canto da tela
- Disponível em todas as abas

**Opção C: Menu no header**
- Botão "+" no header de cada tela

**Recomendado:** Opção B (Botão FAB)
- Mais intuitivo
- Não tira espaço da aba

---

## 📋 Checklist de Implementação

### PROBLEMA 1: Perfil Não Atualiza
- [ ] Adicionar `useFocusEffect` em `app/(tabs)/profile.tsx`
- [ ] Testar: Editar nome → Salvar → Voltar → Verificar se atualizou

### PROBLEMA 2: Avatar Upload
- [ ] Verificar se `expo-image-picker` está instalado
- [ ] Criar hook `useImagePicker`
- [ ] Atualizar `app/edit-profile.tsx`
- [ ] Adicionar permissões em `app.json`
- [ ] Testar: Câmera e Galeria

### PROBLEMA 3: Explore
- [ ] Substituir conteúdo de `app/(tabs)/explore.tsx`
- [ ] Implementar lista de posts de todos os usuários
- [ ] Testar: Mostrar posts de outros usuários

### PROBLEMA 4: Botão Criar Post
- [ ] Criar arquivo `app/(tabs)/create.tsx` (ou `app/create-post.tsx`)
- [ ] Adicionar botão FAB ou nova aba
- [ ] Testar: Criar novo post

---

## 🚀 Ordem de Prioridade

1. **🔴 ALTA:** Problema 1 (Nome não atualiza) - Rápido de corrigir
2. **🟠 ALTA:** Problema 2 (Avatar upload) - Importante UX
3. **🟡 MÉDIA:** Problema 4 (Botão criar post) - Essencial funcionalidade
4. **🟡 MÉDIA:** Problema 3 (Explore) - Conteúdo de leitura

---

## 📊 Estimativa de Tempo

| Problema | Tempo | Dificuldade |
|----------|-------|------------|
| 1 | 5 min | Muito Fácil |
| 2 | 20 min | Fácil |
| 3 | 30 min | Médio |
| 4 | 25 min | Médio |
| **Total** | **80 min** | - |

---

## ✅ Próximos Passos

1. **Leia este arquivo até o final**
2. **Comece pelo Problema 1** (mais rápido)
3. **Depois Problema 2** (melhora UX)
4. **Depois Problema 4** (funcionalidade)
5. **Por fim Problema 3** (interface)

Quer que eu implemente cada um? Me avise em qual começar!
