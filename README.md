# 🐾 BFpet - Best Friend Pet

Uma rede social dedicada aos amantes de pets, onde você pode compartilhar histórias, encontrar pets para adoção, reportar animais perdidos e conectar-se com outros apaixonados por animais.

## ✨ Funcionalidades

### 📱 Feed Principal
- **Timeline personalizada** com posts de outros usuários
- **Sistema de curtidas** interativo
- **Comentários** em tempo real
- **Refresh automático** para novos conteúdos

### 🔍 Explorar
- **Descubra novos posts** da comunidade
- **Busca por localização** de pets
- **Interação social** com likes e comentários
- **Filtros por tipo** de post (adoção, perdido, encontrado)

### 👤 Perfil do Usuário
- **Informações pessoais** customizáveis
- **Estatísticas** de posts, curtidas e compartilhamentos
- **Galeria de posts** do usuário
- **Edição de perfil** completa

### ➕ Criar Posts
- **Três tipos de posts**:
  - 🐾 **Adoção**: Compartilhe pets disponíveis para adoção
  - 😢 **Perdido**: Reporte animais desaparecidos
  - 🔍 **Encontrado**: Ajude a reunir famílias
- **Upload de fotos** via câmera ou galeria
- **Localização opcional** para maior alcance
- **Interface intuitiva** para criação rápida

### 💬 Sistema de Comentários
- **Comentários aninhados** em posts
- **Interação em tempo real**
- **Moderação da comunidade**

### 🔐 Autenticação Segura
- **Cadastro e login** com validação
- **Persistência de sessão**
- **Logout seguro**

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn
- Expo CLI
- Dispositivo físico ou emulador

### Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd my-app
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**
   ```bash
   npm start
   ```

4. **Execute no dispositivo**
   - **Expo Go**: Escaneie o QR code no terminal
   - **Emulador Android/iOS**: Use os comandos específicos
   - **Web**: Pressione `w` no terminal

## 🛠️ Tecnologias Utilizadas

- **React Native** com **Expo**
- **TypeScript** para tipagem forte
- **Expo Router** para navegação baseada em arquivos
- **SQLite** para armazenamento local
- **AsyncStorage** para persistência de dados
- **Expo Image Picker** para upload de fotos
- **Expo Location** para geolocalização
- **Zod** para validação de formulários

## 📱 Compatibilidade

- **iOS** 11.0+
- **Android** API 21+
- **Web** (através do Expo)

## 🎨 Design System

- **Tema azul francês** (#002654) para identidade visual consistente
- **Componentes reutilizáveis** e modulares
- **Interface responsiva** e acessível
- **Animações suaves** com React Native Reanimated

## 📋 Estrutura do Projeto

```
my-app/
├── app/                    # Telas e navegação (Expo Router)
│   ├── (tabs)/            # Navegação por abas
│   │   ├── index.tsx      # Feed principal
│   │   ├── explore.tsx    # Tela de exploração
│   │   └── profile.tsx    # Perfil do usuário
│   ├── login.tsx          # Tela de login
│   ├── signup.tsx         # Tela de cadastro
│   └── create-post.tsx    # Criar novo post
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes de interface
│   ├── posts/            # Componentes relacionados a posts
│   └── comments/         # Componentes de comentários
├── constants/            # Constantes da aplicação
├── contexts/             # Contextos React
├── hooks/                # Hooks customizados
├── services/             # Serviços e APIs
├── types/                # Definições TypeScript
└── utils/                # Utilitários
```

**🐕 Desenvolvido com ❤️ para a comunidade de amantes de pets**
