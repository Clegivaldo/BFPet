# 🧪 GUIA PRÁTICO DE TESTES - BFpet App

**Data:** 9 de novembro de 2025  
**Objetivo:** Diagnosticar e resolver problemas de navegação  
**Status:** Em desenvolvimento

---

## 🚀 Quick Start - Testar Agora

### Passo 1: Limpar Dados (Se app ficar preso)

```bash
# Opção A: Usar Debug Screen (Recomendado)
npm start
# Acesse: http://localhost:19000 ou abra no Expo Go
# Procure por botão "Debug" ou "/debug"
# Clique "Limpar Banco de Dados"

# Opção B: Deletar banco manualmente
rm ~/Library/Preferences/expo-simulator-*  # macOS
del %APPDATA%\Expo\simulator-* # Windows
del ~/.expo/simulator-* # Linux
```

### Passo 2: Executar App

```bash
npm start
```

### Passo 3: Observar Logs

No terminal, procure por:
```
[AuthContext] 🚀 Inicializando app...
[AuthContext] 👤 User atual: null
[AuthContext] ✅ App inicializado. Autenticado: false
[RootLayout] 📊 Estado: { isLoading: false, isAuthenticated: false, route: 'LOGIN' }
```

**Se ver `isAuthenticated: true` mas está em SIGNUP** → Há um bug no redirect!

---

## ✅ Checklist de Testes - Teste Manualmente

### 1️⃣ Teste Initial State

- [ ] App inicia com LOADING por 1-2 segundos
- [ ] Depois muda para tela de LOGIN
- [ ] Console mostra logs de inicialização
- [ ] **NÃO abre em SIGNUP**

```bash
# Esperado no console:
[AuthContext] 🚀 Inicializando app...
[AuthContext] ✅ App inicializado. Autenticado: false
```

---

### 2️⃣ Teste Login → Signup

- [ ] Clique em "Criar conta" na tela de LOGIN
- [ ] Navega para tela de SIGNUP sem erro
- [ ] Console mostra: `router.push(/signup)`
- [ ] Tela renderiza com campos vazios

```bash
# Esperado no console:
[Navigation] Navegando para /signup
[RootLayout] Signup screen renderizada
```

---

### 3️⃣ Teste Signup → Login (BOTÃO VOLTAR)

- [ ] Clique em botão "← Voltar" na tela de SIGNUP
- [ ] Volta para tela de LOGIN **sem erro**
- [ ] Console limpo (sem "GO_BACK not handled")
- [ ] Botão voltar está **acima do relógio** (não sobreposto)

```bash
# ❌ NÃO deve ver:
GO_BACK not handled by any navigator
Navigation failed

# ✅ Deve ver:
[Navigation] Navegando para /login
[RootLayout] Login screen renderizada
```

---

### 4️⃣ Teste Fill Form & Signup

- [ ] Preencha formulário com dados válidos
- [ ] Clique "Criar Conta"
- [ ] Após sucesso, vai para FEED
- [ ] Pode volta para HOME/TABS

```bash
# Email: newemail@bfpet.com
# Senha: Senha@123
# Nome: Test User

# Esperado:
Toast: "Conta criada com sucesso!"
router.replace('/(tabs)')
[RootLayout] Feed renderizada
```

---

### 5️⃣ Teste Navigation Stack

- [ ] Clique "Criar conta" (LOGIN → SIGNUP)
- [ ] Clique "← Voltar" (SIGNUP → LOGIN)
- [ ] Pode repetir sem erros
- [ ] Stack não fica preso

```bash
# Teste 5x seguidas:
LOGIN → "Criar conta" → SIGNUP → "Voltar" → LOGIN → OK? ✓
```

---

## 🔍 Se Falhar - Troubleshooting

### ❌ Problema 1: App Abre em SIGNUP

**Sintoma:**
```
npm start
→ App renderiza SIGNUP (não LOGIN)
```

**Causa:** Usuário ainda está no banco de dados

**Solução:**

```bash
# 1. Ir para Debug Screen
http://localhost:19000/debug (ou botão na app)

# 2. Clique "Limpar Banco de Dados"

# 3. App restarta em LOGIN
```

---

### ❌ Problema 2: Botão Voltar Não Funciona

**Sintoma:**
```
Clique em "← Voltar" na SIGNUP
→ Nada acontece ou erro no console
```

**Causa:** `router.push()` não foi implementado corretamente

**Solução:**

Verifique `app/signup.tsx` linha ~78:

```tsx
// ✅ CORRETO
const handleNavigateToLogin = () => {
  router.push('/login');
};

// ❌ ERRADO
const handleNavigateToLogin = () => {
  router.back();
};
```

Se ainda não funciona:
1. Abra Debug Screen
2. Clique botão "→ Ir para LOGIN"
3. Se funciona → problema é no signup.tsx
4. Se não funciona → problema é no router

---

### ❌ Problema 3: Botão Coberto por Status Bar

**Sintoma:**
```
Botão "← Voltar" fica parcialmente coberto pelo relógio
```

**Solução:**

Verifique `app/signup.tsx` linha ~185:

```tsx
// ✅ CORRETO (com marginTop)
header: {
  marginBottom: 32,
  marginTop: 16,  // ← Afasta do status bar
}

// ❌ ERRADO (sem marginTop)
header: {
  marginBottom: 32,
}
```

---

## 📊 Testes de Estado

### Verificar AuthContext Estado

1. Abra o app
2. Acesse Debug Screen (`/debug`)
3. Verifique seção "Estado de Autenticação"

```
📊 Estado de Autenticação
Is Authenticated: false ✅
Is Loading: false ✅
User: Null ✅
```

### Se Algo Está Errado

| Estado | Valor | Esperado | Ação |
|--------|-------|----------|------|
| Is Authenticated | true | false | Limpar banco |
| Is Loading | true | false | Aguardar |
| User | {data} | null | Fazer logout |

---

## 🧭 Testes de Navegação Avançados

### Teste Deep Linking

```bash
# Ir direto para Signup
# npx expo://deeplink.url/signup

# Ir direto para Debug
# npx expo://deeplink.url/debug
```

### Teste Com Dados Reais

```bash
# 1. Login com teste@bfpet.com / senha123
# 2. Vir para FEED
# 3. Clique em post
# 4. Volte para FEED
# 5. Logout → volta para LOGIN
```

---

## ✅ Testes Passaram?

Se todos os testes passarem ✅:

1. **Remova ou comente** a Debug Screen
2. **Limpe** os console.logs de produção
3. **Commit** as mudanças:
   ```bash
   git add -A
   git commit -m "fix: navigation redirect and back button"
   ```

4. **Próximo passo:** Continuar ETAPA 3 (Comentários, Compartilhamento)

---

## 📋 Checklist Final

```
✅ App inicia em LOGIN
✅ Botão "Criar conta" funciona
✅ Tela SIGNUP renderiza
✅ Botão "← Voltar" volta para LOGIN
✅ Sem erros de navegação
✅ Botão não sobrepõe status bar
✅ Form de signup funciona
✅ Pode fazer login/signup/logout

TUDO OK? → Passar para ETAPA 3 ✨
```

---

## 🎯 Script Automático

Se quiser rodar testes automáticos (futura implementação):

```bash
# Instalar jest + react native testing library
npm install --save-dev @testing-library/react-native @testing-library/jest-native jest @types/jest

# Rodar testes
npm test -- navigation.test.ts
```

---

## 📞 Precisa de Ajuda?

1. **Console com erro?** → Compartilhe o erro exato
2. **Debug Screen não aparece?** → `http://localhost:19000/debug`
3. **Banco não limpa?** → Reinstale o app: `npm start -- --reset-cache`

---

**Criado em:** 9 de novembro de 2025  
**Status:** Pronto para testes  
**Próximo:** ETAPA 3 - Comentários & Compartilhamento

