# 🚀 COMEÇAR ETAPA 3 - Comentários

**Data:** 9 de novembro de 2025  
**Objetivo:** Implementar sistema completo de comentários nos posts  
**Tempo Estimado:** 2-3 horas  
**Prioridade:** ⭐⭐⭐ Crítica

---

## 📋 Pré-Requisitos

Antes de começar:

- [ ] Execute `npm start`
- [ ] Todos os 5 testes de navegação passaram ✅
- [ ] App abre em LOGIN ✅
- [ ] Botão voltar funciona ✅
- [ ] Sem erros de compilação ✅

**Se algum pré-requisito falhou:**
1. Abra Debug Screen (`/debug`)
2. Clique "🗑️ Limpar Banco de Dados"
3. Teste novamente

---

## 🎯 O Que Será Implementado

### 1. Backend - Comentários (Database + Services)
```
✅ Tabela: comments (já existe no DB)
✅ Repository: commentRepository
✅ Service: commentService
✅ Métodos:
   ├─ addComment(postId, userId, text)
   ├─ getCommentsByPostId(postId)
   ├─ deleteComment(commentId, userId)
   └─ updateComment(commentId, text, userId)
```

### 2. UI Components
```
✅ CommentCard.tsx (exibir comentário individual)
✅ CommentForm.tsx (formulário para novo comentário)
├─ Input de texto
├─ Validação
└─ Botão enviar
```

### 3. Tela/Modal de Comentários
```
✅ CommentsScreen ou CommentsModal
├─ List de comentários
├─ Form para novo comentário
├─ Pull-to-refresh (lista)
└─ Carregar mais (pagination)
```

### 4. Integração com Feed
```
✅ PostCard - Adicionar contador de comentários
✅ Botão "Comentar" → abre CommentsModal
✅ Atualizar contagem em tempo real
```

---

## 🗂️ Estrutura de Arquivos - Comentários

```
📁 components/
├─ posts/
│  └─ PostCard.tsx (✅ já existe - atualizar)
└─ comments/
   ├─ CommentCard.tsx         (🆕 novo)
   ├─ CommentForm.tsx         (🆕 novo)
   └─ CommentsList.tsx        (🆕 novo)

📁 services/
├─ commentService.ts          (🆕 novo - já deveria existir)

📁 repositories/
├─ commentRepository.ts       (✅ já existe - verificar)

📁 app/
├─ (tabs)/
│  ├─ index.tsx (✅ já existe - atualizar)
│  └─ comments.tsx            (🆕 novo - rota para modal)

📁 types/
└─ comment.types.ts          (✅ já existe - verificar)
```

---

## 📊 Fluxo de Uso

```
User vê Feed
    ↓
PostCard exibe:
  ├─ Imagem
  ├─ Título
  ├─ Like (❤️ 15)
  ├─ Comment (💬 3)  ← Novo
  └─ Share (📤 1)
    ↓
User clica 💬 "3"
    ↓
CommentsModal abre
    ↓
Ver comentários:
  - Comentário 1 (User A)
  - Comentário 2 (User B)
  - Comentário 3 (User C)
    ↓
Escrever novo comentário
    ↓
Submit → Atualizar lista
```

---

## ⚙️ Passo a Passo - Implementação

### PASSO 1: Verificar/Criar Services

**Arquivo:** `services/commentService.ts`

```typescript
// Verificar se existe, senão criar com:
export class CommentService {
  async addComment(postId: number, userId: number, text: string) {
    // Implementar: INSERT INTO comments
  }
  
  async getCommentsByPostId(postId: number) {
    // Implementar: SELECT * FROM comments WHERE post_id = ?
  }
  
  async deleteComment(commentId: number, userId: number) {
    // Implementar: DELETE FROM comments (com permissão)
  }
}
```

**Tempo:** 15 min

---

### PASSO 2: Criar Components

**Arquivo:** `components/comments/CommentCard.tsx`

```typescript
// Exibir um comentário individual
// Props: comment, onDelete, isOwner
// Renderizar:
//  ├─ Avatar do usuário
//  ├─ Nome + data
//  ├─ Texto do comentário
//  └─ Botão deletar (se proprietário)
```

**Tempo:** 15 min

**Arquivo:** `components/comments/CommentForm.tsx`

```typescript
// Formulário para novo comentário
// Props: onSubmit, loading
// Renderizar:
//  ├─ Avatar usuário logado
//  ├─ TextInput (validação)
//  ├─ Botão enviar
//  └─ Contador de caracteres
```

**Tempo:** 15 min

**Arquivo:** `components/comments/CommentsList.tsx`

```typescript
// Lista de comentários
// Props: comments, onDelete, loading, onRefresh
// Renderizar:
//  ├─ FlatList de comentários
//  ├─ Pull-to-refresh
//  ├─ Empty state
//  └─ Loading state
```

**Tempo:** 20 min

---

### PASSO 3: Criar Tela de Comentários

**Arquivo:** `app/(tabs)/comments.tsx` (ou modal)

```typescript
// Tela/Modal para exibir e gerenciar comentários
// Para post específico (via route params)
// Renderizar:
//  ├─ Header: "Comentários (15)"
//  ├─ CommentsList (lista)
//  ├─ CommentForm (novo)
//  └─ Botão voltar
```

**Tempo:** 20 min

---

### PASSO 4: Atualizar PostCard

**Arquivo:** `components/posts/PostCard.tsx`

```typescript
// Adicionar:
//  ├─ Contador de comentários
//  ├─ Botão "Comentar" (ao lado de Like/Share)
//  └─ onComment callback
```

**Tempo:** 10 min

---

### PASSO 5: Testar

**Testes Manuais:**

- [ ] Abrir feed
- [ ] Ver contador de comentários em cada post
- [ ] Clique no botão de comentários
- [ ] Modal/Tela abre com comentários
- [ ] Escrever novo comentário
- [ ] Novo comentário aparece na lista
- [ ] Contador atualiza em tempo real
- [ ] Deletar comentário (se for seu)
- [ ] Voltar para feed
- [ ] Contador atualizado

**Tempo:** 30 min

---

## 🎨 Design/UI Reference

```
CommentCard Layout:
┌─────────────────────────────────┐
│ [Avatar] Nome • 2 horas atrás   │
├─────────────────────────────────┤
│ Isso é um comentário super      │
│ legal do usuário                │
├─────────────────────────────────┤
│                        [Deletar]│
└─────────────────────────────────┘

CommentForm Layout:
┌─────────────────────────────────┐
│ [Avatar] Seu Comentário...  [→]│
│                   Caracteres: 0 │
└─────────────────────────────────┘

CommentsModal Layout:
┌─────────────────────────────────┐
│ ← Comentários (15)         [×]  │
├─────────────────────────────────┤
│ [CommentCard 1]                 │
│ [CommentCard 2]                 │
│ [CommentCard 3]                 │
│ [Load More]                     │
├─────────────────────────────────┤
│ [CommentForm]                   │
└─────────────────────────────────┘
```

---

## 📈 Fase de Implementação

### Fase 1: Backend (30 min)
- [ ] Verificar commentService
- [ ] Verificar commentRepository
- [ ] Adicionar tipos se necessário
- [ ] Testar métodos no console

### Fase 2: Components (50 min)
- [ ] Criar CommentCard
- [ ] Criar CommentForm
- [ ] Criar CommentsList

### Fase 3: Integração (40 min)
- [ ] Criar CommentsScreen/Modal
- [ ] Atualizar PostCard
- [ ] Conectar navegação

### Fase 4: Testes (30 min)
- [ ] Testes manuais
- [ ] Verificar persistência
- [ ] Polir UI

**Total:** 2.5 horas

---

## ✅ Checklist Final - ETAPA 3 Comentários

- [ ] CommentCard renderiza
- [ ] CommentForm valida input
- [ ] Novo comentário salva no banco
- [ ] Lista atualiza após novo comentário
- [ ] Deletar comentário funciona
- [ ] Contador de comentários atualiza
- [ ] Modal/Tela abre corretamente
- [ ] Voltar funciona sem erros
- [ ] Compilação: npm run lint → 0 erros
- [ ] TypeScript: 0 erros

**Todos os itens ✅?** → ETAPA 3 Comentários COMPLETO

---

## 🚀 Começar Agora

1. **Confirme pré-requisitos** (testes passaram)
2. **Execute `npm start`**
3. **Comece pelo PASSO 1**
4. **Teste após cada passo**
5. **Se erro → Debug Screen**

---

## 📞 Referências

- `GUIA_TESTES_NAVEGACAO.md` - Para testes
- `services/authService.ts` - Padrão de services
- `components/posts/PostCard.tsx` - Padrão de components
- `app/(tabs)/index.tsx` - Padrão de tela

---

## 💡 Dicas

1. Use Debug Screen para verificar estado
2. Adicione logging em cada função
3. Teste no console antes de usar
4. Commit após cada passo completar
5. Sempre testar ANTES de passar para o próximo

---

**Status:** Pronto para iniciar ✅

**Próximo comando:**
```bash
npm start
# E depois escolha:
# → Testar navegação (se ainda não testou)
# → Começar ETAPA 3 Comentários
```

