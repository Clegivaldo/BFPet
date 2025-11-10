# 🧪 Teste Rápido - Verificar Se Todas as Correções Funcionam

## ⚡ Executar em Ordem

### 1️⃣ LIMPAR DADOS DO EXPO (Obrigatório)

```bash
npm run reset-project
```

Aguarde até ver: `✅ Banco resetado com sucesso`

---

### 2️⃣ INICIAR O APP

```bash
npm start
# ou
expo start
```

---

### 3️⃣ VERIFICAR O CONSOLE

**Procure por estas mensagens (significa que as correções funcionaram):**

```
✅ Coluna created_at adicionada à tabela users
✅ Coluna created_at já existe em users
✅ Initial data seeded successfully
[RootLayout] 📊 Estado: {isLoading: false, isAuthenticated: false, route: 'LOGIN'}
```

**❌ Se aparecer algum desses erros, ainda há problema:**

```
Error: no such column: created_at
ERROR The action 'GO_BACK' was not handled by any navigator
WARN SafeAreaView has been deprecated
```

---

### 4️⃣ TESTAR O FLUXO DE LOGIN

1. **Você deve estar na tela de LOGIN** (não signup)
   - Logo: 🐾 BFpet
   - Subtítulo: Best Friend Pet
   - Inputs: Email e Senha

2. **Insira as credenciais de teste:**
   ```
   Email: teste@bfpet.com
   Senha: senha123
   ```

3. **Clique em "Entrar"**
   - Deve aparecer toast: "Login realizado com sucesso!"
   - Deve navegar para a tela de Feed (com abas)
   - Não deve mostrar erro de `created_at`

---

### 5️⃣ TESTAR NAVEGAÇÃO

1. **Voltar para Login** (pelo menu)
2. **Clicar em "Criar conta"**
   - Deve abrir tela de Signup
   - Deve mostrar: "Criar Conta" + "Junte-se à comunidade BFpet"

3. **Clicar em "← Voltar"**
   - Deve voltar para Login **sem erro**
   - Console não deve mostrar: `GO_BACK not handled`

---

### 6️⃣ TESTAR SIGNUP (Opcional)

1. **Criar nova conta:**
   ```
   Nome: Teste User
   Email: newuser@test.com
   Senha: senha123
   Confirmar: senha123
   ```

2. **Clicar "Criar Conta"**
   - Deve mostrar toast: "Conta criada com sucesso!"
   - Deve ir para Feed
   - Não deve mostrar erro de `created_at`

---

## ✅ Checklist de Sucesso

- [ ] Banco foi resetado (`npm run reset-project` executado)
- [ ] App abre na tela de LOGIN (não signup)
- [ ] Console mostra: `created_at adicionada` (ou já existe)
- [ ] Login com `teste@bfpet.com / senha123` funciona
- [ ] Botão "Voltar" em signup funciona sem erros
- [ ] Sem erro: `created_at`
- [ ] Sem erro: `GO_BACK not handled`
- [ ] Sem aviso: `SafeAreaView has been deprecated`

---

## 🐛 Se Algo Ainda Não Funcionar

**Compartilhe:**
1. O erro exato do console
2. Em qual passo ocorreu
3. Se foi após fazer login ou durante teste de navegação

**Possíveis causas:**
- Banco não foi resetado (execute `npm run reset-project` novamente)
- Cache do node_modules (tente: `npm install`)
- Expo cache (tente: `expo start --clear`)

---

## 📱 Testar em Diferentes Plataformas

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

### Web (desenvolvimento)
```bash
npm run web
```

---

## 💡 Dicas Úteis

- Sempre que trocar banco, execute `npm run reset-project`
- Se o app ficar lento, limpe: `rm -rf node_modules && npm install`
- Use `expo start --clear` para resetar cache do Expo
- Procure por "ERROR" (em maiúsculas) no console para erros reais
- Procure por "WARN" para avisos (como SafeAreaView)
