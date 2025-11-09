# ⚡ TESTE RÁPIDO - COPY & PASTE

## 🚀 Passo 1: Terminal
```bash
cd c:\Users\Clegivaldo\Desktop\my-app
npm start
```

## 📱 Passo 2: Selecione Plataforma
- Pressione `a` (Android) ou `i` (iOS) ou `w` (Web)
- Aguarde carregar (1-2 minutos)

## ✅ Você Deve Ver
```
🐾 BFpet
Best Friend Pet

Encontre e compartilhe informações sobre seus pets favoritos

[Email: teste@bfpet.com]
[Senha: senha123]

[Entrar]

Não tem conta? Criar conta

📋 Dados de Teste:
Email: teste@bfpet.com
Senha: senha123
```

---

## 🧪 TESTE 1: Login Funciona
```
1. Clique "Entrar"
2. Aguarde (vai ficar em loading)
3. Deve aparecer "✅ Sucesso"
4. Deve ir para próxima tela
```

### ✅ Passou? Vá para TESTE 2

---

## 🧪 TESTE 2: Validação de Email
```
1. Limpe o campo Email
2. Digite: "email-invalido"
3. Clique "Entrar"
4. Deve aparecer erro: "Email inválido"
```

### ✅ Passou? Vá para TESTE 3

---

## 🧪 TESTE 3: Criar Conta
```
1. Clique "Criar conta"
2. Vá para tela de Signup
3. Preencha:
   - Nome: João Silva
   - Email: joao@novo.com
   - Senha: senha123
   - Confirmar: senha123
4. Clique "Criar Conta"
5. Deve aparecer "✅ Sucesso"
```

### ✅ Passou? Vá para TESTE 4

---

## 🧪 TESTE 4: Sessão Persiste
```
1. Feche a app completamente
2. Abra a app novamente
3. Deve ir direto para próxima tela
4. NÃO deve voltar para Login
```

### ✅ Passou? Todos os testes funcionam! 🎉

---

## ❌ Problemas Comuns

### "Database not initialized"
```
Solução:
1. npm run lint
2. npm start
3. Tente novamente
```

### "Cannot read property"
```
Solução:
1. Feche tudo
2. npm install
3. npm start
```

### Botão de Login fica em loading
```
Solução:
1. Verifique console
2. Pode ser erro no banco
3. Reinicie
```

---

## ✨ Tudo Funcionando?

```
[ ] TESTE 1: Login ✅
[ ] TESTE 2: Validação ✅
[ ] TESTE 3: Criar Conta ✅
[ ] TESTE 4: Sessão Persiste ✅

Se todos marcados = Sucesso! 🎉
```

---

## 🎬 Próximo

Confirme que tudo passou e avise para começar **ETAPA 3 - Feed**!

---

**Tempo esperado**: 10-15 minutos
**Dificuldade**: Fácil
**Risco**: Nenhum
