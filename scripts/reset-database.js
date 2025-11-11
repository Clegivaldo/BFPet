#!/usr/bin/env node
/* eslint-env node */

/**
 * Script para resetar o banco de dados SQLite
 * Use: node scripts/reset-database.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Possíveis locais do banco de dados
const possiblePaths = [
  // Caminho padrão do bfpet.db na raiz do projeto
  path.join(process.cwd(), 'bfpet.db'),
  
  // Caminho no node_modules
  path.join(process.cwd(), 'node_modules/expo-sqlite/build/NativeDatabase.db'),
  
  // Caminho no home do usuário (Android emulator)
  path.join(os.homedir(), '.android/bfpet.db'),
  
  // Caminho no cache do expo
  path.join(os.homedir(), '.expo/cache/bfpet.db'),
  
  // Documentos do Android
  path.join(os.homedir(), 'Documents/bfpet.db'),
];

console.log('🗑️  Procurando e deletando banco de dados antigo...\n');

let deletedCount = 0;

possiblePaths.forEach(p => {
  try {
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
      console.log(`✅ Deletado: ${p}`);
      deletedCount++;
    }
  } catch (error) {
    // Silenciosamente ignora erros
  }
});

if (deletedCount === 0) {
  console.log('ℹ️  Nenhum banco de dados antigo encontrado (pode ser primeira execução)');
}

console.log('\n✅ Database reset concluído!');
console.log('📝 Próximas ações:');
console.log('   1. npx expo r -c  (limpar cache)');
console.log('   2. npm start       (iniciar app)\n');
