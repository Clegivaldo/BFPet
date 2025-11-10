# 🧹 Limpar Dados do Expo (Resolver "App indo para Signup")

## Por que isso acontece?

Quando você logou antes, o token foi salvo na tabela `current_user`. Quando o app reinicia, ele detecta que há um usuário logado e vai direto para a tela de feed. Se o usuário foi deletado mas o token ainda existe, ocorre um erro.

## Soluções (do mais fácil ao mais completo)

### ✅ Solução 1: Limpar dados via Script (RECOMENDADO)

Crie e execute um script de reset:

```bash
# No terminal
npm run reset-project
```

Isso vai limpar todos os dados persistentes do banco de dados.

### ✅ Solução 2: Limpar via Code (Se Solução 1 não funcionar)

1. Abra o arquivo `services/db/sqlite.ts`
2. No método `initialize()`, adicione logo após `await db.initialize()`:

```typescript
// Adicione temporariamente
await databaseReset.resetDatabase();
```

3. Execute o app
4. Remova essa linha depois

### ✅ Solução 3: Deletar Banco Manualmente

Se usar Expo Go ou EAS:

**Android:**
```bash
adb shell
cd /data/data/host.exp.exponent/files/
rm -f bfpet.db*
```

**iOS:**
```bash
# Abra o simulador, depois no terminal:
xcrun simctl erase all
```

### ✅ Solução 4: Usar Script Reset Database

Existe um arquivo `services/db/databaseReset.ts` que você pode usar:

```typescript
// Em AuthContext.tsx, adicione no useEffect:
import { databaseReset } from '@/services/db/databaseReset';

// Temporariamente
await databaseReset.resetDatabase();
```

---

## 🔧 Verificar o Estado Atual

Para ver se o banco está corrompido:

```bash
# Terminal do Expo
Press 'w' para web
```

Então abra DevTools e veja os logs.

---

## ✨ Depois que Limpar

1. ✅ O app deve ir para a tela de **LOGIN** (não signup)
2. ✅ Use: `Email: teste@bfpet.com` | `Senha: senha123`
3. ✅ Não deve aparecer erro `created_at`
4. ✅ Botão voltar deve funcionar sem erro `GO_BACK`

---

## 📝 Resumo das Correções Aplicadas

- ✅ Alterado `createdAt` → `created_at` em toda SQL
- ✅ Botão voltar agora usa `router.replace('/login')` (não `router.back()`)
- ✅ SafeAreaView atualizado para `react-native-safe-area-context`
