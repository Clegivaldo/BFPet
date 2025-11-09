# 📋 GUIA RÁPIDO DE TESTES - ETAPA 2

## 🚀 Iniciar a Aplicação

```bash
npm start
```

Depois pressione:
- `a` para Android
- `i` para iOS  
- `w` para Web

---

## ✅ TESTES OBRIGATÓRIOS

### 1️⃣ Tela de Login Aparece
**O que testar:**
- [ ] App inicia sem erro
- [ ] Vê a tela com logo "🐾 BFpet"
- [ ] Dois inputs: Email e Senha
- [ ] Botão "Entrar"
- [ ] Link "Criar conta"
- [ ] Dados de teste visíveis

**Esperado:** Tela bem formatada, legível, sem erros

---

### 2️⃣ Login com Dados Corretos
**Passos:**
1. Email: `teste@bfpet.com` (já preenchido)
2. Senha: `senha123` (já preenchida)
3. Clique "Entrar"

**Esperado:**
- [ ] Botão fica em loading (spinner)
- [ ] Aparece toast "✅ Sucesso"
- [ ] Navega para tela de Feed
- [ ] Sem erros no console

---

### 3️⃣ Validação de Email Vazio
**Passos:**
1. Apague o campo de email
2. Clique em "Entrar"

**Esperado:**
- [ ] Aparece erro abaixo do input
- [ ] Botão fica desabilitado
- [ ] Ao digitar email, erro some

---

### 4️⃣ Validação de Email Inválido
**Passos:**
1. Email: `email-invalido`
2. Clique "Entrar"

**Esperado:**
- [ ] Erro: "Email inválido"
- [ ] Botão desabilitado
- [ ] Quando digitar email válido, erro some

---

### 5️⃣ Senha Incorreta
**Passos:**
1. Email: `teste@bfpet.com`
2. Senha: `errada123`
3. Clique "Entrar"

**Esperado:**
- [ ] Toast: "❌ Email ou senha incorretos"
- [ ] Continua na tela de Login
- [ ] Campos mantêm valores

---

### 6️⃣ Navegar para Criar Conta
**Passos:**
1. Clique em "Criar conta"

**Esperado:**
- [ ] Navega para tela de Signup
- [ ] Vê "Criar Conta" como título
- [ ] Botão "← Voltar" funciona

---

### 7️⃣ Criar Conta com Dados Válidos
**Passos:**
1. Nome: `João Silva`
2. Email: `joao@teste.com` (novo email)
3. Senha: `senha123`
4. Confirmar: `senha123`
5. Clique "Criar Conta"

**Esperado:**
- [ ] Toast: "✅ Sucesso"
- [ ] Auto-login funciona
- [ ] Navega para Feed

---

### 8️⃣ Email Já Existe
**Passos:**
1. Tente criar com email: `teste@bfpet.com`
2. Clique "Criar Conta"

**Esperado:**
- [ ] Toast: "❌ Email já cadastrado"
- [ ] Fica na tela de Signup

---

### 9️⃣ Senhas Não Conferem
**Passos:**
1. Senha: `senha123`
2. Confirmar: `diferente`
3. Clique "Criar Conta"

**Esperado:**
- [ ] Erro: "Senhas não conferem"
- [ ] Abaixo do campo "Confirmar Senha"

---

### 🔟 Sessão Persiste
**Passos:**
1. Faça login com sucesso
2. Feche a app completamente
3. Abra a app novamente

**Esperado:**
- [ ] App vai direto ao Feed
- [ ] NÃO volta para Login
- [ ] Sessão mantém
- [ ] Dados do usuário mostram

---

## 🔴 Problemas Comuns e Soluções

### ❌ "Database not initialized"
**Solução:**
- Verifique console para erro de SQLite
- Limpe cache: `npm run reset-project`
- Reinstale dependências: `npm install`

### ❌ "Cannot read property 'email' of null"
**Solução:**
- Seed data pode não ter sido inserido
- Verifique: `services/db/sqlite.ts`
- Rode seed novamente

### ❌ Botão de Login fica preso em loading
**Solução:**
- Verifique console para erro
- Pode ser erro no banco
- Tente fazer logout e login novamente

### ❌ Validação não aparece
**Solução:**
- Zod pode não estar instalado: `npm install zod`
- Verifique imports no arquivo `.tsx`

---

## 📸 Screenshots para Validar

### ✅ Esperado Ver:
1. **Tela Login**
   - Logo grande "🐾 BFpet"
   - "Best Friend Pet" em rosa
   - Dois inputs com bordas
   - Botão rosa "Entrar"
   - Link azul "Criar conta"

2. **Tela Signup**
   - Título "Criar Conta"
   - Subtítulo "Junte-se à comunidade BFpet"
   - Botão voltar no topo
   - 4 inputs: Nome, Email, Senha, Confirmar
   - Botão "Criar Conta"

3. **Após Login**
   - Desaparece tela de Login
   - Aparece tela de Feed (tabs)

---

## 🎬 Teste Completo (Passo a Passo)

### Cenário 1: Novo Usuário
```
1. Abra app
2. Vê tela de Login ✅
3. Clique "Criar conta" ✅
4. Preencha: João, joao@test.com, senha123, senha123 ✅
5. Clique "Criar Conta" ✅
6. Vê toast de sucesso ✅
7. Auto-login funciona ✅
8. Navega para Feed ✅
9. Feche app ✅
10. Abra app novamente ✅
11. Vai direto ao Feed (sessão persiste) ✅
```

### Cenário 2: Usuário Existente
```
1. Faça logout (próxima etapa terá essa funcionalidade)
2. Abra app
3. Email: teste@bfpet.com ✅
4. Senha: senha123 ✅
5. Clique "Entrar" ✅
6. Toast sucesso ✅
7. Navega para Feed ✅
```

---

## ✨ Tudo Funcionando?

Se todos os testes passarem, você está **100% pronto** para a **ETAPA 3**! 🚀

---

**Última atualização**: 09/11/2025
