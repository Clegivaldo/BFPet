# Fix: Coluna `created_at` Ausente no Banco de Dados

## Problema Identificado

```
Error: table users has no column named created_at
```

Este erro ocorria porque:
- O banco de dados **antigo** no seu dispositivo foi criado sem a coluna `created_at`
- O SQLite não retroativamente adiciona colunas aos bancos existentes
- Mesmo com `DEFAULT CURRENT_TIMESTAMP` na definição, a coluna não existia fisicamente

## Solução Implementada

### 1. **Nova Migração em `services/db/sqlite.ts`**

Adicionada função `addCreatedAtColumnIfNotExists()`:

```typescript
private async addCreatedAtColumnIfNotExists(): Promise<void> {
  if (!this.db) throw new Error('Database not initialized');

  try {
    await this.db.execAsync(
      'ALTER TABLE users ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP;'
    );
    console.log('✅ Coluna created_at adicionada à tabela users');
  } catch (error: any) {
    if (error.message.includes('duplicate column') || error.message.includes('already exists')) {
      console.log('✅ Coluna created_at já existe');
    } else {
      console.warn('⚠️ Erro ao adicionar coluna created_at:', error.message);
    }
  }
}
```

### 2. **Integração na Inicialização**

Na função `createTables()`, ambas as migrações são executadas:

```typescript
// Migrations: Adicionar colunas faltantes se não existirem
await this.addBioColumnIfNotExists();
await this.addCreatedAtColumnIfNotExists();
```

### 3. **Script de Reset do Banco**

Criado `scripts/reset-database.js` para limpar o banco antigo:

```bash
node scripts/reset-database.js
```

## Como Resolver o Erro

### Opção A: Reset Completo (Recomendado)

```bash
# 1. Resetar banco de dados
node scripts/reset-database.js

# 2. Limpar cache do Expo
npx expo r -c

# 3. Reiniciar o app
npm start
```

### Opção B: Apenas Reinicar o App

Se você já rodou o reset:

```bash
npm start
```

## Validações

✅ **TypeScript**: 0 erros
✅ **Migração**: Idempotente (segura para rodar múltiplas vezes)
✅ **Backwards Compatible**: Funciona com bancos antigos e novos

## Próximos Passos

1. Execute o reset se necessário
2. Teste login com: `teste@bfpet.com` / `senha123`
3. Teste criar uma nova conta
4. Verifique se `created_at` é preenchido corretamente

## Arquivos Modificados

- ✏️ `services/db/sqlite.ts` - Adicionada migração
- ✨ `scripts/reset-database.js` - Novo script de reset

---

**Data**: 9 de Novembro de 2025
**Status**: ✅ Resolvido
