#!/usr/bin/env node
/* eslint-env node */

/**
 * 🔥 NUCLEAR RESET - Deleta tudo e força recriação
 * Use quando nada mais funciona!
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n🔥 INICIANDO NUCLEAR RESET...\n');

// 1. Limpar Metro cache
console.log('1️⃣ Limpando Metro cache...');
try {
  execSync('npx expo r -c', { stdio: 'inherit' });
  console.log('✅ Metro cache limpo\n');
} catch (err) {
  console.log('⚠️ Erro ao limpar Metro (ignoring)\n');
}

// 2. Apagar banco de dados
console.log('2️⃣ Deletando banco de dados antigo...');
const dbPaths = [
  path.join(process.cwd(), 'bfpet.db'),
  path.join(process.env.HOME || process.env.USERPROFILE, '.android/bfpet.db'),
  path.join(process.env.HOME || process.env.USERPROFILE, 'Documents/bfpet.db'),
];

dbPaths.forEach(p => {
  try {
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
      console.log(`✅ Deletado: ${p}`);
    }
  } catch (err) {
    // Ignora
  }
});

console.log('\n3️⃣ Instrução: Executar no emulador/dispositivo:');
console.log('   adb shell pm clear com.seu_app');
console.log('\n4️⃣ Depois: npm start\n');

console.log('✅ NUCLEAR RESET COMPLETO!\n');
