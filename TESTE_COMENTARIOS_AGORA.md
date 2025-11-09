# 🧪 TESTE COMENTÁRIOS - GUIA PRÁTICO

**Data:** 9 de novembro de 2025  
**Status:** Pronto para testar  
**Tempo:** 10 minutos

---

## ⚡ QUICK START

### 1. Executar App
```bash
npm start
```

### 2. Login
```
Email: teste@bfpet.com
Senha: senha123
```

### 3. Ir para Feed
- App abre automaticamente em Feed

---

## 🧪 5 TESTES PRINCIPAIS

### Teste 1: Abrir Tela de Comentários

```
1. Veja o Feed com posts
2. Clique em um post no botão "💬 Comentar"
3. Verificar:
   ✅ Abre tela de comentários
   ✅ Mostra "Comentários (X)"
   ✅ Mostra nome do post no header
   ✅ Lista de comentários (se houver)
   ✅ Form de novo comentário abaixo
```

---

### Teste 2: Adicionar Novo Comentário

```
1. Na tela de comentários
2. Clique no campo "Escreva seu comentário..."
3. Escreva: "Isso é um ótimo comentário! 👍"
4. Clique no botão enviar (→)
5. Verificar:
   ✅ Novo comentário aparece no topo da lista
   ✅ Toast: "Comentário enviado!"
   ✅ Campo limpa automaticamente
   ✅ Contador aumenta em 1
   ✅ Seu avatar aparece no comentário
```

---

### Teste 3: Validações

**Teste campo vazio:**
```
1. Tente enviar comentário vazio
2. Verificar:
   ✅ Botão enviar fica desabilitado
   ✅ Mostra erro se tentar mandar
```

**Teste limite 500 caracteres:**
```
1. Tente copiar texto grande
2. Verificar:
   ✅ Para de aceitar digitação no 500
   ✅ Contador mostra "500/500"
   ✅ Botão fica desabilitado
```

**Teste caracteres válidos:**
```
1. Escreva: "Comentário com emoji 😊 e números 123"
2. Clique enviar
3. Verificar:
   ✅ Envia sem problemas
   ✅ Mantém emoji e formatação
```

---

### Teste 4: Deletar Comentário

```
1. Procure um comentário SÃO SEU
2. Clique no botão "✕" (deletar)
3. Verificar:
   ✅ Loading spinner aparece
   ✅ Comentário desaparece
   ✅ Toast: "Comentário deletado"
   ✅ Contador diminui em 1
   ✅ Volta para Feed mostra contador atualizado
```

**Teste permissão:**
```
1. Procure comentário de OUTRO USUÁRIO
2. Verificar:
   ✅ Botão deletar NÃO aparece
   ✅ Não pode clicar em nada
```

---

### Teste 5: Pull-to-Refresh

```
1. Na tela de comentários
2. Puxe a lista para baixo
3. Verificar:
   ✅ Loading spinner aparece
   ✅ Lista recarrega
   ✅ Comentários mais recentes aparecem
   ✅ Funciona múltiplas vezes
```

---

## ✅ Checklist de Verificação

- [ ] App abre em LOGIN
- [ ] Login funciona
- [ ] Feed carrega posts
- [ ] Botão "Comentar" funciona
- [ ] Tela comentários abre
- [ ] Header mostra título e nome do post
- [ ] Contador de comentários correto
- [ ] Pode adicionar novo comentário
- [ ] Campo valida vazio
- [ ] Campo respeita 500 chars
- [ ] Pode deletar próprio comentário
- [ ] Não vê botão delete de outros
- [ ] Pull-to-refresh funciona
- [ ] Toast notifications aparecem
- [ ] Volta para Feed sem erro
- [ ] Contador atualiza em Feed

**Todos os testes passaram?** → ✅ ETAPA 3 comentários OK!

---

## 🐛 Se Algo Falhar

### ❌ Tela não abre
```
1. Verifique console por erro
2. Confirme rota /comments está em _layout.tsx
3. Execute: npm start -- --reset-cache
4. Teste novamente
```

### ❌ Comentário não salva
```
1. Abra Debug Screen (/debug)
2. Verifique estado de autenticação
3. Confirme user está logado
4. Verifique console por erro SQL
```

### ❌ Erro ao deletar
```
1. Confirme que é seu comentário
2. Verifique user ID
3. Veja erro exato no console
4. Teste com outro comentário
```

---

## 🎯 Cenários Avançados

### Scenario 1: Múltiplos Comentários
```
1. Adicione 5 comentários seguidos
2. Verificar:
   ✅ Todos aparecem na lista
   ✅ Ordem correta (mais novo primeiro)
   ✅ Contador correto
   ✅ Sem lag ao scroll
```

### Scenario 2: Mix de Ações
```
1. Adicione comentário
2. Puxe para refresh
3. Adicione outro
4. Delete um
5. Puxe para refresh novamente
6. Verificar:
   ✅ Tudo continua correto
   ✅ Sem erros
   ✅ Contador sempre certo
```

### Scenario 3: Teclado
```
1. Escreva longo comentário
2. Teclado deve subir
3. Verificar:
   ✅ Form fica visível
   ✅ Pode enviar sem fechar teclado
   ✅ Não sobrepõe nada
```

---

## 📊 Performance

Verificar no terminal:
```
✅ Renderização smooth (~60 FPS)
✅ Sem warnings
✅ Sem memory leaks
✅ Load rápido (< 2 segundos)
✅ Scroll smooth (sem travos)
```

---

## 🎓 O Que Fazer Depois

### Se Tudo OK ✅
```
Escolher próxima feature:
A) Compartilhamento → 1.5h
B) Polish Feed → 1h
C) Outra ETAPA
```

### Se Falhou ❌
```
1. Verificar erro exato
2. Procurar em ETAPA_3_COMENTARIOS_COMPLETO.md
3. Consulte troubleshooting acima
4. Se não conseguir, reporte erro
```

---

## 💡 Dicas

- Use Debug Screen se app ficar bugado
- Sempre teste com login válido
- Verifique console para logs
- Teste em device/emulador, não web
- Reload app entre testes se necessário

---

**Pronto para testar!** 🚀

Execute `npm start` e siga os 5 testes acima.

