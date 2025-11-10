import * as SQLite from 'expo-sqlite';

/**
 * Limpar o banco de dados completamente
 * Força a recreação com schema correto
 */
export async function cleanDatabase(): Promise<void> {
  try {
    const database = await SQLite.openDatabaseAsync('bfpet.db');
    
    // Dropar todas as tabelas
    const tables = [
      'current_user',
      'shares',
      'comments',
      'likes',
      'posts',
      'users'
    ];

    for (const table of tables) {
      try {
        await database.execAsync(`DROP TABLE IF EXISTS ${table};`);
        console.log(`✅ Tabela ${table} removida`);
      } catch (e) {
        console.warn(`⚠️ Erro ao remover ${table}:`, e);
      }
    }

    await database.closeAsync();
    console.log('✅ Banco de dados completamente resetado. Reinicie o app!');
  } catch (error) {
    console.error('❌ Erro ao resetar banco de dados:', error);
  }
}

/**
 * Chamar no primeiro boot do app se necessário
 * DESCOMENTAR APENAS QUANDO NECESSÁRIO RESETAR O BANCO
 */
export async function resetDatabaseIfNeeded(): Promise<void> {
  // DESCOMENTE para limpar o banco:
  // await cleanDatabase();
}

/**
 * Limpar apenas a sessão do usuário (sem deletar todos os dados)
 */
export async function clearCurrentUser(): Promise<void> {
  try {
    const database = await SQLite.openDatabaseAsync('bfpet.db');
    await database.execAsync('DELETE FROM current_user WHERE id = 1;');
    console.log('✅ Sessão do usuário limpa');
    await database.closeAsync();
  } catch (error) {
    console.error('❌ Erro ao limpar sessão:', error);
  }
}

export const databaseReset = {
  cleanDatabase,
  clearCurrentUser,
  resetDatabaseIfNeeded,
};
