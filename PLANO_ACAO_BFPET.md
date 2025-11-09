# 🐾 Plano de Ação - BFpet (Best Friend Pet)

## 📋 Visão Geral
Aplicativo mobile de rede social para pets com funcionalidades de publicação, interação e localização.

### Plataforma
- **Framework**: React Native (Expo Router)
- **Linguagem**: TypeScript
- **Banco de Dados**: SQLite (local)
- **Arquitetura**: Navegação em abas (Tabs) + Stack para detalhes

---

## 🎯 Estrutura de Telas

### Fluxo de Autenticação
```
SplashScreen → Login → [Criar Conta] → Feed (Autenticado)
```

### Fluxo Principal (Após Login)
```
Feed → Ver Post → Comentar/Curtir/Compartilhar
                ↓
             Profile
                ↓
           Nova Postagem
```

---

## 📱 Telas Necessárias

### **FASE 1: AUTENTICAÇÃO** 
1. ✅ **Tela de Login** (`app/login.tsx`)
2. ✅ **Tela de Criar Conta** (`app/signup.tsx`)

### **FASE 2: FEED PRINCIPAL**
3. ✅ **Tela de Feed/Home** (`app/(tabs)/index.tsx`)
4. ✅ **Nova Postagem** (`app/(tabs)/create-post.tsx`)

### **FASE 3: INTERAÇÕES**
5. ✅ **Detalhes do Post** (`app/post-details.tsx`)
6. ✅ **Sistema de Likes** (integrado no Feed)
7. ✅ **Sistema de Comentários** (modal ou tela)
8. ✅ **Compartilhamento** (integrado ao post)

### **FASE 4: FEATURES ADICIONAIS**
9. ✅ **Perfil do Usuário** (`app/(tabs)/profile.tsx`)
10. ✅ **Notificações** (integradas ao sistema)

---

## 🛠️ Recursos Técnicos Necessários

### Dependências a Instalar
```json
{
  "expo-image-picker": "Camera e Galeria",
  "expo-location": "Localização GPS",
  "expo-notifications": "Notificações Push",
  "@react-native-async-storage/async-storage": "Armazenamento local",
  "expo-sqlite": "Banco de dados local",
  "react-native-maps": "Integração de mapa",
  "react-native-image-picker": "Alternativa ao expo-image-picker",
  "@react-native-camera-roll/camera-roll": "Acesso à galeria",
  "zod": "Validação de formulários"
}
```

### Permissões (app.json)
```json
{
  "permissions": [
    "CAMERA",
    "CAMERA_ROLL", 
    "LOCATION",
    "NOTIFICATIONS"
  ]
}
```

---

## 💾 Schema do Banco de Dados

### Tabelas SQLite

#### **users**
```sql
- id (INTEGER PRIMARY KEY)
- email (TEXT UNIQUE)
- password (TEXT - HASH)
- name (TEXT)
- avatar_url (TEXT)
- bio (TEXT)
- created_at (TIMESTAMP)
```

#### **posts**
```sql
- id (INTEGER PRIMARY KEY)
- user_id (INTEGER FOREIGN KEY)
- title (TEXT)
- description (TEXT)
- type (TEXT) - "adoption" | "found" | "lost"
- image_url (TEXT)
- latitude (REAL)
- longitude (REAL)
- location_name (TEXT)
- likes_count (INTEGER)
- comments_count (INTEGER)
- created_at (TIMESTAMP)
```

#### **likes**
```sql
- id (INTEGER PRIMARY KEY)
- post_id (INTEGER FOREIGN KEY)
- user_id (INTEGER FOREIGN KEY)
- created_at (TIMESTAMP)
- UNIQUE(post_id, user_id)
```

#### **comments**
```sql
- id (INTEGER PRIMARY KEY)
- post_id (INTEGER FOREIGN KEY)
- user_id (INTEGER FOREIGN KEY)
- text (TEXT)
- created_at (TIMESTAMP)
```

#### **shares**
```sql
- id (INTEGER PRIMARY KEY)
- post_id (INTEGER FOREIGN KEY)
- user_id (INTEGER FOREIGN KEY)
- created_at (TIMESTAMP)
```

---

## 📊 Plano de Execução Detalhado

### **ETAPA 1: CONFIGURAÇÃO INICIAL**
**Duração estimada**: 1-2 horas

#### Tarefas:
- [ ] Instalar todas as dependências necessárias
- [ ] Configurar permissões no `app.json`
- [ ] Criar pasta `services/` para lógica de BD e APIs
- [ ] Criar pasta `types/` para interfaces TypeScript
- [ ] Criar pasta `utils/` para funções auxiliares
- [ ] Inicializar SQLite e criar tabelas

**Testes**:
- Verificar se app inicia sem erros
- Validar permissões no emulador/dispositivo

---

### **ETAPA 2: TELA DE LOGIN**
**Duração estimada**: 2-3 horas
**Dependência**: Etapa 1

#### Atividades:
1. Criar interface `IUser` em `types/user.types.ts`
2. Criar serviço `services/authService.ts` com:
   - `login(email, password)`
   - Validação de credenciais contra banco
   - Persistência de token/sessão
3. Criar tela `app/login.tsx` com:
   - Input de Email
   - Input de Senha
   - Botão "Entrar"
   - Link "Criar Conta"
   - Validações em tempo real
4. Integrar com banco de dados local

#### Testes:
- [ ] Login com email/senha corretos → Redirecionar para Feed
- [ ] Login com credenciais incorretas → Mostrar erro
- [ ] Campos vazios → Desabilitar botão
- [ ] Sessão persiste após fechar app
- [ ] Email validado (formato correto)

**Status**: ⏳ Aguardando início

---

### **ETAPA 3: TELA DE CRIAR CONTA**
**Duração estimada**: 2-3 horas
**Dependência**: Etapa 2

#### Atividades:
1. Estender `authService.ts` com:
   - `createAccount(name, email, password)`
   - Validação de email único
   - Hash de senha
   - Inserção no banco
2. Criar tela `app/signup.tsx` com:
   - Input Nome
   - Input Email
   - Input Senha
   - Input Confirmar Senha
   - Botão "Criar Conta"
   - Link "Já tem conta? Entrar"
   - Validações

#### Validações:
- Todos campos preenchidos
- Email formato válido e único
- Senha mínimo 6 caracteres
- Senhas conferem
- Feedback visual de erro/sucesso

#### Testes:
- [ ] Criar conta com dados válidos → Salvar no BD e redirecionar
- [ ] Email já existe → Erro
- [ ] Senhas não conferem → Erro
- [ ] Campos vazios → Desabilitar botão
- [ ] Poder fazer login após criar conta

**Status**: ⏳ Aguardando Etapa 2

---

### **ETAPA 4: TELA DE FEED/HOME**
**Duração estimada**: 3-4 horas
**Dependência**: Etapa 3

#### Atividades:
1. Criar `services/postService.ts` com:
   - `getAllPosts()`
   - `getPostsByUser(userId)`
   - Paginação ou scroll infinito
2. Criar tipo `IPost` em `types/`
3. Criar componente `components/PostCard.tsx`:
   - Imagem do pet
   - Nome do usuário
   - Tipo (Adoção/Achado/Perdido)
   - Descrição
   - Localização
   - Botões: Curtir, Comentar, Compartilhar
4. Criar tela `app/(tabs)/index.tsx` com:
   - FlatList de posts
   - Header com logo/titulo
   - Pull to refresh
   - Bottom navigation

#### Funcionalidades:
- Exibir lista de posts ordenada por data (recente)
- Cada post mostra avatar do user, nome, tipo, imagem, descrição
- Botões de interação visíveis
- Carregamento suave

#### Testes:
- [ ] Posts carregam corretamente
- [ ] Scroll funciona (se muitos posts)
- [ ] Pull to refresh atualiza lista
- [ ] Imagens carregam corretamente
- [ ] Sem posts → Mensagem vazia
- [ ] Clique em post abre detalhes (próxima etapa)

**Status**: ⏳ Aguardando Etapa 3

---

### **ETAPA 5: TELA DE NOVA POSTAGEM**
**Duração estimada**: 4-5 horas
**Dependência**: Etapa 4

#### Atividades:
1. Estender `postService.ts` com:
   - `createPost(post: IPost)`
   - `saveImageLocally(uri)`
2. Criar tipo `ICreatePost` com campos necessários
3. Integrar `expo-image-picker` para câmera/galeria
4. Integrar `expo-location` para capturar localização
5. Criar tela `app/(tabs)/create-post.tsx` com:
   - Picker para tipo (Adoção/Achado/Perdido)
   - Button Tirar Foto / Escolher Galeria
   - Preview da imagem
   - Input Título
   - Input Descrição
   - Button Localização (mostrar coordenadas)
   - Botão Publicar

#### Funcionalidades:
- Capturar foto com câmera
- Selecionar foto da galeria
- Mostrar preview
- Pegar localização atual (GPS)
- Validar campos obrigatórios
- Salvar no BD com timestamp
- Sucesso → Voltar ao Feed

#### Testes:
- [ ] Tirar foto com câmera → Pré-visualizar
- [ ] Escolher foto da galeria → Pré-visualizar
- [ ] Localização capturada corretamente
- [ ] Campos vazios → Desabilitar publicar
- [ ] Publicar → Aparecer no Feed
- [ ] Toast/Alert de sucesso
- [ ] Imagem salva no sistema de arquivos

**Status**: ⏳ Aguardando Etapa 4

---

### **ETAPA 6: SISTEMA DE LIKES**
**Duração estimada**: 1-2 horas
**Dependência**: Etapa 5

#### Atividades:
1. Estender `postService.ts` com:
   - `toggleLike(postId, userId)`
   - `getLikesCount(postId)`
   - `isPostLikedByUser(postId, userId)`
2. Integrar com tabela `likes` no BD
3. Atualizar `PostCard.tsx`:
   - Botão curtir com ícone ❤️/🤍
   - Mostrar contagem de likes
   - Mudar de cor ao curtir
   - Click → Chamar `toggleLike`
   - Desabilitar múltiplos cliques rápidos

#### Funcionalidades:
- Curtir/Descurtir post
- Atualizar contagem em tempo real
- Visual feedback (mudança de cor)
- Persistência no BD
- Debounce para evitar spam

#### Testes:
- [ ] Curtir post → Ícone muda de cor
- [ ] Contagem aumenta quando curte
- [ ] Descurtir → Volta ao estado anterior
- [ ] Contagem persiste ao recarregar app
- [ ] Só pode curtir uma vez por usuário
- [ ] Clique rápido não causa erro

**Status**: ⏳ Aguardando Etapa 5

---

### **ETAPA 7: SISTEMA DE COMENTÁRIOS**
**Duração estimada**: 3-4 horas
**Dependência**: Etapa 6

#### Atividades:
1. Estender `postService.ts` com:
   - `addComment(postId, userId, text)`
   - `getComments(postId)`
   - `deleteComment(commentId, userId)`
2. Criar componente `components/CommentSheet.tsx`:
   - Lista de comentários
   - Input de novo comentário
   - Botão enviar
3. Integrar Modal ou Bottom Sheet no `PostCard.tsx`
4. Botão comentar abre modal

#### Funcionalidades:
- Abrir lista de comentários ao clicar
- Adicionar novo comentário
- Listar comentários com nome do usuário
- Deletar próprio comentário
- Atualizar contagem

#### Testes:
- [ ] Clicar botão comentar → Abre modal
- [ ] Adicionar comentário → Aparece na lista
- [ ] Novo comentário mostra nome do user
- [ ] Pode deletar só próprios comentários
- [ ] Contagem de comentários atualiza
- [ ] Fechar modal → Volta ao feed

**Status**: ⏳ Aguardando Etapa 6

---

### **ETAPA 8: SISTEMA DE COMPARTILHAMENTO**
**Duração estimada**: 1-2 horas
**Dependência**: Etapa 7

#### Atividades:
1. Estender `postService.ts` com:
   - `sharePost(postId, platform?)`
   - Registrar share no BD (tabela `shares`)
2. Integrar `Share` API nativa do React Native
3. Atualizar `PostCard.tsx` com botão compartilhar

#### Funcionalidades:
- Compartilhar via native share (WhatsApp, SMS, etc)
- Copiar link do post
- Registrar compartilhamento no BD
- Mensagem customizada com info do pet

#### Testes:
- [ ] Clicar botão compartilhar → Menu nativo aparece
- [ ] Compartilhar para WhatsApp → Mensagem formada corretamente
- [ ] Compartilhar para SMS
- [ ] Dados de share salvos no BD
- [ ] Copiar link funciona

**Status**: ⏳ Aguardando Etapa 7

---

### **ETAPA 9: DETALHES DO POST**
**Duração estimada**: 2-3 horas
**Dependência**: Etapa 8

#### Atividades:
1. Criar `app/post-details.tsx` (tela modal/stack)
2. Integrar mapa com `react-native-maps`
3. Mostrar:
   - Imagem grande do pet
   - Todas as informações do post
   - Localização no mapa
   - Contato do dono (botões WhatsApp/Telefone)
   - Comentários
   - Opções de interação

#### Funcionalidades:
- Deep linking para abrir post direto
- Mapa interativo
- Botões de contato funcionais
- Voltar ao feed

#### Testes:
- [ ] Clicar em post no feed → Abre detalhes
- [ ] Imagem aparece grande
- [ ] Mapa carrega com localização
- [ ] Botões de contato funcionam
- [ ] Comentários aparecem
- [ ] Botão voltar funciona

**Status**: ⏳ Aguardando Etapa 8

---

### **ETAPA 10: NOTIFICAÇÕES PUSH**
**Duração estimada**: 2-3 horas
**Dependência**: Etapa 9

#### Atividades:
1. Integrar `expo-notifications`
2. Configurar listeners para:
   - Post curtido
   - Comentário adicionado
   - Post respondido
3. Criar função `sendNotification(title, body, data)`
4. Integrar ao `likeService` e `commentService`

#### Funcionalidades:
- Notificação ao receber like
- Notificação ao receber comentário
- Deep link ao tocar notificação
- Local ou push notifications

#### Testes:
- [ ] Curtir post de outro usuário → Receber notificação
- [ ] Comentar post de outro usuário → Receber notificação
- [ ] Tocar notificação → Abre post
- [ ] Notificações persistem se app fechado (local)

**Status**: ⏳ Aguardando Etapa 9

---

### **ETAPA 11: PERFIL DO USUÁRIO** (BÔNUS)
**Duração estimada**: 2-3 horas
**Dependência**: Etapa 10

#### Atividades:
1. Criar `app/(tabs)/profile.tsx`
2. Integrar avatar upload
3. Mostrar:
   - Avatar e nome do usuário
   - Bio
   - Posts criados
   - Estatísticas (total likes, comentários)
   - Botão Editar Perfil
   - Botão Logout

#### Funcionalidades:
- Editar nome e bio
- Trocar avatar
- Ver histórico de posts
- Logout → Voltar a Login

#### Testes:
- [ ] Perfil carrega dados corretamente
- [ ] Editar perfil → Dados atualizam
- [ ] Avatar troca
- [ ] Posts do usuário listados
- [ ] Logout funciona

**Status**: ⏳ Aguardando Etapa 10

---

## 🔍 Estrutura de Pastas Final

```
app/
├── _layout.tsx                 # Root layout
├── login.tsx                   # Tela de login
├── signup.tsx                  # Tela de criar conta
├── post-details.tsx            # Detalhes do post (modal)
└── (tabs)/
    ├── _layout.tsx             # Tabs layout
    ├── index.tsx               # Feed/Home
    ├── create-post.tsx         # Nova postagem
    └── profile.tsx             # Perfil

components/
├── PostCard.tsx                # Card do post com botões
├── CommentSheet.tsx            # Modal de comentários
└── ui/                         # Componentes reutilizáveis
    ├── Button.tsx
    ├── Input.tsx
    ├── Loading.tsx
    └── Toast.tsx

services/
├── db/
│   └── sqlite.ts               # Inicialização do SQLite
├── authService.ts              # Login, criar conta
├── postService.ts              # CRUD de posts
├── likeService.ts              # Sistema de likes
├── commentService.ts           # Sistema de comentários
├── notificationService.ts      # Notificações
└── locationService.ts          # Localização GPS

types/
├── user.types.ts
├── post.types.ts
├── comment.types.ts
└── like.types.ts

utils/
├── validators.ts               # Validações
├── formatters.ts               # Formatação de dados
└── helpers.ts                  # Funções auxiliares

constants/
└── theme.ts                    # Cores e estilos
```

---

## 📋 Checklist Geral

### Pré-requisitos
- [ ] Node.js instalado
- [ ] Expo CLI instalado
- [ ] Emulador Android/iOS ou dispositivo físico
- [ ] Conta Expo (opcional)

### Dependências
- [ ] `expo-image-picker` instalado
- [ ] `expo-location` instalado
- [ ] `expo-notifications` instalado
- [ ] `expo-sqlite` instalado
- [ ] `react-native-maps` instalado
- [ ] `async-storage` instalado
- [ ] `zod` (validação) instalado

### Banco de Dados
- [ ] SQLite inicializado
- [ ] Todas as tabelas criadas
- [ ] Migrations funcionando
- [ ] Dados de teste inseridos (seed)

### Funcionalidades Críticas
- [ ] Autenticação funcionando
- [ ] Feed carregando posts
- [ ] Publicação de novo post
- [ ] Likes funcionando
- [ ] Comentários funcionando
- [ ] Compartilhamento funcionando
- [ ] Notificações disparando
- [ ] Perfil exibindo dados

---

## 🚀 Próximos Passos

1. **Iniciar com ETAPA 1** → Configuração inicial
2. **Validar** cada etapa antes de prosseguir
3. **Testes** em ambos iOS e Android
4. **Deploy** no Google Play / App Store (futuro)

---

## 📝 Notas Importantes

- **Segurança**: Não armazenar senhas em texto plano, usar hash (bcrypt)
- **Performance**: Implementar paginação no Feed
- **UX**: Feedback visual para todas as ações
- **Testes**: Testar cada funcionalidade 100% antes de próxima etapa
- **Versionamento**: Commitar após cada etapa concluída

---

**Última atualização**: 09/11/2025
**Status**: 🔄 Pronto para começar a ETAPA 1
