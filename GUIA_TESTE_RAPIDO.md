# 🎯 COMANDOS PARA TESTAR

## 📝 Copie e Cole Os Comandos Abaixo

### 1️⃣ Limpar e Resetar (OPCIONAL - Só se der erro)

```bash
node scripts/reset-database.js
```

---

### 2️⃣ Iniciar o App

```bash
npm start
```

**Aguarde até ver:**
```
✅ Database initialized successfully
✅ All tables created successfully
✅ Coluna bio já existe
✅ Coluna created_at já existe
✅ Initial data seeded successfully
```

---

### 3️⃣ Teste de Login

No emulador/dispositivo:

**Preencha:**
- Email: `teste@bfpet.com`
- Senha: `senha123`

**Clique:** "Entrar"

**Resultado Esperado:**
```
✅ Nenhuma mensagem de erro
✅ Entra na tela Home
✅ Vê lista de posts
```

---

### 4️⃣ Teste de Criar Conta

No emulador:

1. Clique em "Criar Conta"
2. Preencha com:
   - Email: `novo@email.com`
   - Senha: `123456`
   - Confirmar: `123456`
   - Nome: `Novo Usuário`

3. Clique: "Criar Conta"

**Resultado Esperado:**
```
✅ Nenhuma mensagem de erro
✅ Faz login automaticamente
✅ Entra na Home
```

---

### 5️⃣ Teste de Perfil

No emulador:

1. Na Home, clique na aba "Perfil" (ou Aba 4 se tiver nome diferente)
2. Observe a tela

**Resultado Esperado:**
```
✅ Mostra nome do usuário
✅ Mostra email
✅ Mostra "Membro desde: [data formatada]"
✅ Data não está vazia
✅ Não há erros na tela
```

---

### 6️⃣ Teste de Logout

No emulador:

1. Na tela Perfil, procure por botão "Sair" ou "Logout"
2. Clique

**Resultado Esperado:**
```
✅ Volta para tela de Login
```

---

### 7️⃣ Re-teste de Login

Repita o **Teste 3** para garantir que funciona novamente.

---

## ✅ Checklist Rápido

Coloque ✅ em cada item conforme testar:

- [ ] Login com teste@bfpet.com funciona
- [ ] Criar conta novo@email.com funciona
- [ ] Perfil mostra data de criação
- [ ] Data não está vazia/null
- [ ] Sem erros de "constraint failed"
- [ ] Sem erros de "no column named created_at"
- [ ] Logout funciona
- [ ] Re-login funciona

---

## 🚨 Se Tiver Erro

### Erro: "NOT NULL constraint failed"
```bash
npm start
# Aguarde 30 segundos
# Se persistir:
node scripts/reset-database.js
npm start
```

### Erro: "table users has no column"
```bash
# Banco corrompido, fazer reset:
node scripts/reset-database.js
npm start
```

### App Não Inicia
```bash
# Limpar cache:
npx expo r -c
npm start
```

---

## 🎯 Se TUDO Passar ✅

Execute:

```bash
git add .
git commit -m "fix: Corrigido erro NOT NULL constraint em created_at"
git push
```

---

## 📱 Teste em Diferentes Cenários

### Cenário A: Primeiro Login (Com Conta Teste)
1. Abrir app
2. Login: `teste@bfpet.com` / `senha123`
3. ✅ Deve funcionar

### Cenário B: Criar Nova Conta
1. Clique "Criar Conta"
2. Preencha dados
3. ✅ Deve criar e logar

### Cenário C: Logout e Relogin
1. Logout
2. Login novamente
3. ✅ Deve funcionar

### Cenário D: Verificar Dados
1. Na Home, ir para Perfil
2. Verificar se data mostra
3. ✅ Deve estar preenchida

---

## 📊 Resultado

| Teste | Status |
|-------|--------|
| Login Teste | ✅ ou ❌ |
| Criar Conta | ✅ ou ❌ |
| Perfil Data | ✅ ou ❌ |
| Logout | ✅ ou ❌ |
| Re-login | ✅ ou ❌ |

**Se todos forem ✅**: Fazer commit e push!

---

**Tempo Estimado**: 5-10 minutos

**Dificuldade**: Muito Fácil (só clicar)

**Crítico**: SIM (Bloqueia o app)

---

**Última Atualização**: 9 de Novembro de 2025
