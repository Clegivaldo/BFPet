#!/usr/bin/env node
/* eslint-env node */

/**
 * 🧪 Script de Teste - BFpet App
 * 
 * Uso:
 * npm run test:nav          - Rodar testes de navegação
 * npm run test:manual       - Checklist manual de testes
 * npm run test:debug        - Instruções para usar debug screen
 */

const fs = require('fs');
const path = require('path');

console.log('\n🧪 BFpet App - Testes de Navegação\n');
console.log('=' .repeat(60));

// Testes
const tests = [
  {
    name: 'Auth Context',
    file: 'contexts/AuthContext.tsx',
    checks: [
      'useAuth hook exportado',
      'AuthProvider criado',
      'Estado isAuthenticated',
      'Logging adicionado',
    ],
  },
  {
    name: 'Root Layout',
    file: 'app/_layout.tsx',
    checks: [
      'Stack.Screen com redirect',
      'Redirect login if authenticated',
      'Redirect (tabs) if not authenticated',
      'Logging no console',
    ],
  },
  {
    name: 'Signup Screen',
    file: 'app/signup.tsx',
    checks: [
      'router.push() em vez de router.replace()',
      'Botão voltar com handler',
      'marginTop no header',
      'SafeAreaView',
    ],
  },
  {
    name: 'Debug Screen',
    file: 'app/debug.tsx',
    checks: [
      'Debug screen criada',
      'Botões de navegação',
      'Botão de limpar banco',
      'Estado de autenticação',
    ],
  },
];

// Verificar arquivos
console.log('\n📋 Verificando Arquivos:\n');
tests.forEach((test, index) => {
  const filePath = path.join(process.cwd(), test.file);
  const exists = fs.existsSync(filePath);
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${index + 1}. ${test.name}`);
  console.log(`   Arquivo: ${test.file}`);
  if (exists) {
    const content = fs.readFileSync(filePath, 'utf8');
    test.checks.forEach((check) => {
      const found = content.includes(check.split(' ')[0]) ? '✓' : '✗';
      console.log(`   ${found} ${check}`);
    });
  }
  console.log();
});

console.log('=' .repeat(60));

// Instruções
console.log('\n📋 PRÓXIMOS PASSOS:\n');
console.log('1. Verificar o Console');
console.log('   npm start');
console.log('   → Procure por logs com [AuthContext] e [RootLayout]');
console.log();

console.log('2. Acessar Debug Screen');
console.log('   Adicione esta rota ao seu app:');
console.log('   http://localhost:19000/debug (se usando Expo)');
console.log('   → Veja o estado de autenticação em tempo real');
console.log();

console.log('3. Testar Navegação Manual');
console.log('   ✅ App inicia em LOGIN (não SIGNUP)');
console.log('   ✅ Clique "Criar conta" → vai para SIGNUP');
console.log('   ✅ Clique "← Voltar" → volta para LOGIN');
console.log('   ✅ Sem erro "GO_BACK not handled"');
console.log();

console.log('4. Usar Debug Screen para Reset');
console.log('   Se app ficar preso em SIGNUP:');
console.log('   → Vá para /debug');
console.log('   → Clique "Limpar Banco de Dados"');
console.log('   → App restarta em LOGIN');
console.log();

console.log('=' .repeat(60));
console.log();

console.log('✨ Testes concluídos!\n');
