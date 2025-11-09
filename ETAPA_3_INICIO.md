# 🚀 ETAPA 3 - TELA FEED (HOME)

**Status:** 🔄 Iniciando  
**Data de Início:** 9 de novembro de 2025  
**Tempo Estimado:** 4-5 horas  
**Objetivo:** Criar tela de feed com lista de posts, interações e scroll infinito

---

## 📋 O que será feito

### 1. Componente `PostCard.tsx`
Componente visual para exibir cada post na tela Feed.

**Responsabilidades:**
- Mostrar avatar e nome do usuário
- Mostrar tipo de post (🐾 Adoção / ✅ Encontrado / ❌ Perdido)
- Mostrar imagem do post
- Mostrar título e descrição truncados
- Mostrar localização
- Mostrar contadores: Curtidas, Comentários, Compartilhamentos
- Botões interativos: Curtir, Comentar, Compartilhar
- Feedback visual ao curtir (coração preenchido)

**Props:**
```typescript
interface PostCardProps {
  post: IPost;
  onLike: (postId: number) => void;
  onComment: (postId: number) => void;
  onShare: (postId: number) => void;
  isLiked: boolean;
}
```

### 2. Tela `Feed` (Home)
Tela principal dentro das abas (tabs).

**Responsabilidades:**
- Mostrar lista de posts usando FlatList
- Implementar pull-to-refresh
- Carregar posts do banco de dados
- Atualizar contadores de likes/comments em tempo real
- Navegar para detalhes do post ao clicar
- Feedback visual durante carregamento

**Features:**
- FlatList com renderização otimizada
- Pull-to-refresh para atualizar
- Sem posts → mensagem "Nenhum post encontrado"
- Loading state com spinner
- Error handling com retry

### 3. Tela de Detalhes do Post (Bonus)
Tela adicional para visualizar post completo.

---

## 📁 Estrutura de Arquivos

```
app/
  (tabs)/
    _layout.tsx      (existente - ajustar)
    index.tsx        (Feed Screen) ← NOVO
    explore.tsx      (existente)
  post-details.tsx   (novo - modal ou screen)

components/
  posts/
    PostCard.tsx     ← NOVO
```

---

## 🛠️ Ferramentas e Dependências

✅ Todas já instaladas:
- `@react-native-async-storage` - Carregamento rápido
- `react-native-maps` - Futura integração de localização
- `date-fns` - Formatação de datas
- Componentes já criados (Button, TextInput, Toast)

---

## ✅ Checklist de Implementação

- [ ] Criar componente `PostCard.tsx`
  - [ ] Layout do card
  - [ ] Renderização de imagem
  - [ ] Botões de ação
  - [ ] Estilos e responsividade
  - [ ] Feedback ao curtir

- [ ] Criar tela `Feed` (index.tsx nas tabs)
  - [ ] FlatList com posts
  - [ ] Pull-to-refresh
  - [ ] Carregamento inicial
  - [ ] Tratamento de erros
  - [ ] Estado vazio

- [ ] Integrar com banco de dados
  - [ ] Buscar posts via postService
  - [ ] Atualizar likes em tempo real
  - [ ] Persistência de dados

- [ ] Testes de funcionalidade
  - [ ] Posts carregam
  - [ ] Pull-to-refresh funciona
  - [ ] Like funciona
  - [ ] Comentários listam
  - [ ] Compartilhar funciona

---

## 🎨 Design Reference

### PostCard Layout
```
┌─────────────────────────────────┐
│ 🐾 João Silva  9:30 AM          │ ← User info + time
├─────────────────────────────────┤
│                                 │
│   [Imagem do Post]              │ ← Post image (16:9)
│   (com badge de tipo)           │
├─────────────────────────────────┤
│ 🐾 Adoção | Achado do Baco  │ ← Title
│                                 │
│ Encontramos esse dog no parque. │ ← Description (truncated)
│                                 │
│ 📍 Rua das Flores, 123, São P...│ ← Location
├─────────────────────────────────┤
│ ❤️ 42 Curtidas | 💬 8 Coment...│ ← Counters
├─────────────────────────────────┤
│ [❤️ Curtir] [💬 Comentar] [↗ Compart.]
└─────────────────────────────────┘
```

### Feed Screen Layout
```
┌──────────────────────────────┐
│         BFpet Feed           │ ← Header
├──────────────────────────────┤
│ Pull to refresh ↓            │
│                              │
│ ┌────────────────────────┐  │
│ │   Post Card 1          │  │
│ └────────────────────────┘  │
│                              │
│ ┌────────────────────────┐  │
│ │   Post Card 2          │  │
│ └────────────────────────┘  │
│                              │
│ ┌────────────────────────┐  │
│ │   Post Card 3          │  │
│ └────────────────────────┘  │
│                              │
│ [Carregando mais...]         │ ← Loading
└──────────────────────────────┘
```

---

## 🔄 Fluxo de Dados

```
Feed Screen
  ↓
useEffect → postService.getAllPosts()
  ↓
Database → getAllPosts query
  ↓
FlatList → renderItem → PostCard
  ↓
PostCard buttons → onLike/onComment/onShare
  ↓
postService.toggleLike() / addComment() / sharePost()
  ↓
Database updated → State re-renders
```

---

## 📝 Exemplos de Código (Estrutura)

### PostCard.tsx (Estrutura)
```typescript
import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { IPost } from '@/types/post.types';
import { formatDate, formatPostType } from '@/utils/formatters';

interface PostCardProps {
  post: IPost;
  onLike: (postId: number) => void;
  onComment: (postId: number) => void;
  onShare: (postId: number) => void;
  isLiked: boolean;
}

export function PostCard({ post, onLike, onComment, onShare, isLiked }: PostCardProps) {
  return (
    <View style={styles.container}>
      {/* User Info */}
      <View style={styles.header}>
        {/* Avatar + Name */}
      </View>

      {/* Post Image */}
      <Image source={{ uri: post.imageUrl }} style={styles.image} />

      {/* Post Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.description}>{post.description}</Text>
        <Text style={styles.location}>📍 {post.locationName}</Text>
      </View>

      {/* Counters */}
      <View style={styles.counters}>
        {/* Likes, Comments, Shares */}
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onLike(post.id)}>
          <Text>{isLiked ? '❤️' : '🤍'} Curtir</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onComment(post.id)}>
          <Text>💬 Comentar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onShare(post.id)}>
          <Text>↗️ Compartilhar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
```

### Feed Screen (Estrutura)
```typescript
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, ActivityIndicator, View, Text } from 'react-native';
import { IPost } from '@/types/post.types';
import { postService } from '@/services/postService';
import { PostCard } from '@/components/posts/PostCard';

export default function FeedScreen() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const allPosts = await postService.getAllPosts();
      setPosts(allPosts);
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  const handleLike = async (postId: number) => {
    try {
      await postService.toggleLike(postId);
      // Update state
    } catch (error) {
      // Handle error
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#FF6B9D" />;
  }

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => (
        <PostCard
          post={item}
          onLike={handleLike}
          onComment={() => {}}
          onShare={() => {}}
          isLiked={likedPosts.has(item.id)}
        />
      )}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={<Text>Nenhum post encontrado</Text>}
    />
  );
}
```

---

## 🎯 Ordem de Desenvolvimento

1. ✅ **ETAPA 2 Concluída** - Autenticação pronta
2. 🔄 **PostCard** - Começar com este componente
3. 🔄 **Feed Screen** - Integrar PostCard com FlatList
4. 🔄 **Pull-to-Refresh** - Adicionar função de atualizar
5. 🔄 **Testes** - Validar todas as funcionalidades

---

## 📊 Progresso

```
ETAPA 1 ✅ Configuração (100%)
  ├─ Dependências ✅
  ├─ Database ✅
  └─ Services ✅

ETAPA 2 ✅ Autenticação (100%)
  ├─ Login ✅
  ├─ Signup ✅
  └─ Context ✅

ETAPA 3 🔄 Feed (0% → Começando agora)
  ├─ PostCard ([ ])
  ├─ Feed Screen ([ ])
  ├─ Interações ([ ])
  └─ Testes ([ ])

ETAPA 4-11 ⏳ Futuro
```

---

**Próximo Passo:** Começar implementação do `PostCard.tsx`

Deseja que eu comece com o desenvolvimento do PostCard?

