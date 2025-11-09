# 🧪 TESTE RÁPIDO - ETAPA 3 Feed

**Tempo:** 10 minutos  
**Objetivo:** Validar PostCard e Feed Screen

---

## 🚀 Como Iniciar

```bash
npm start
# Pressione 'a' para Android ou 'i' para iOS
# Faça login com: teste@bfpet.com / senha123
```

---

## ✅ Testes (Na Ordem)

### 1. Feed Screen Renderiza ✅
```
Deve ver:
□ Header com título "🐾 BFpet Feed"
□ Posts carregando com spinner
□ Posts aparecem em lista
```

**Resultado esperado:** Feed com posts visíveis em segundos

---

### 2. PostCard Visual ✅
```
Para o primeiro post, verifique:
□ Avatar com iniciais do usuário
□ Nome do usuário
□ Data/hora
□ Badge de tipo (🐾 Adoção / ✅ Achado / ❌ Perdido)
□ Imagem do post (16:9)
□ Título do post
□ Descrição truncada
□ Localização com emoji 📍
□ Contadores (❤️ 42 | 💬 8 | ↗ 3)
□ Botões: Curtir, Comentar, Compartilhar
```

**Resultado esperado:** Todos os elementos visíveis e bem posicionados

---

### 3. Pull-to-Refresh ✅
```
Ação:
1. Deslize o dedo de cima para baixo
2. Aguarde o spinner

Esperado:
□ Spinner rosa (#FF6B9D) aparece
□ Posts recarregam
□ Lista atualiza
□ Spinner desaparece
```

**Resultado esperado:** Atualizar com sucesso

---

### 4. Curtir Post ✅
```
Ação:
1. Clique em "Curtir" (ou ❤️) de um post
2. Observe a mudança

Esperado ANTES de curtir:
□ Ícone: 🤍 (branco)
□ Texto: "Curtir"
□ Cor: cinza (#666)

Esperado DURANTE curtir:
□ Spinner rosa pequeno aparece
□ Botão desativado

Esperado DEPOIS de curtir:
□ Ícone: ❤️ (vermelho)
□ Texto: "Curtido"
□ Cor: rosa (#FF6B9D)
□ Background rosa claro
□ Contador atualiza (+1)

Toast deve aparecer:
□ "✅ Sucesso - Post curtido!"
```

**Resultado esperado:** Like funciona, visual atualiza, toast aparece

---

### 5. Descurtir Post ✅
```
Ação:
1. Clique em "Curtido" (ou ❤️) novamente
2. Observe a mudança

Esperado:
□ Ícone volta para 🤍
□ Texto volta para "Curtir"
□ Cor volta para cinza
□ Contador volta (-1)
□ Toast: "✅ Sucesso - Curtida removida"
```

**Resultado esperado:** Descurtir funciona

---

### 6. Comentar (Placeholder) ✅
```
Ação:
1. Clique em "Comentar"

Esperado:
□ Toast de alerta: "ℹ️ Em breve - Comentários em desenvolvimento"
```

**Resultado esperado:** Placeholder funciona

---

### 7. Compartilhar (Placeholder) ✅
```
Ação:
1. Clique em "Compartilhar"

Esperado:
□ Toast de alerta: "ℹ️ Em breve - Compartilhamento em desenvolvimento"
```

**Resultado esperado:** Placeholder funciona

---

### 8. Scroll Suave ✅
```
Ação:
1. Deslize a lista para cima/baixo várias vezes

Esperado:
□ Scroll fluido (sem travadas)
□ Imagens carregam enquanto scrolla
□ Sem memory leaks
```

**Resultado esperado:** Scroll smooth, sem lag

---

### 9. Empty State ✅
```
Se não houver posts (improvável), deve ver:
□ Emoji 🐾
□ Texto: "Nenhum post encontrado"
□ Subtítulo: "Seja o primeiro a postar!"
```

**Resultado esperado:** Mensagem amigável se vazio

---

### 10. Reload do App ✅
```
Ação:
1. Faça reload da tela (menu dev > reload)
2. Observe

Esperado:
□ Posts carregam novamente
□ Estado de likes preservado (se foi a mesma sessão)
□ Sem erros
```

**Resultado esperado:** App inicia sem erros

---

## 📊 Checklist de Sucesso

- [ ] Feed renderiza com posts
- [ ] PostCard visual correto
- [ ] Pull-to-refresh atualiza
- [ ] Like funciona (ativa/desativa)
- [ ] Contadores atualizam
- [ ] Toasts aparecem
- [ ] Scroll sem lag
- [ ] Sem erros no console

---

## 🐛 Se Algo Não Funcionar

### Posts não carregam
```
Verificar:
□ npm start já está rodando?
□ Banco de dados inicializou? (ver logs)
□ Está autenticado? (fez login?)
□ Dados de teste existem? (check SQLite)
```

### Like não funciona
```
Verificar:
□ Console tem erros?
□ postService.toggleLike() retorna erro?
□ Banco tem table de likes?
□ Usuário logado (user.id válido)?
```

### Imagens não carregam
```
Normal em desenvolvimento!
□ URLs das imagens são válidas?
□ Conexão com internet ok?
□ ImageError handling está funcionando
```

### App trava no scroll
```
Verificar:
□ Muitos posts (<100)?
□ Imagens muito pesadas?
□ FlatList keyExtractor correto?
□ Sem re-renders infinitos?
```

---

## 📝 Registro de Testes

Teste realizado em: _______________  
Ambiente: Android [ ] iOS [ ] Web [ ]  
Resultado: ✅ Passou [ ] ❌ Falhou [ ]

Observações:
```
________________________________________
________________________________________
________________________________________
```

---

## ✅ Tudo OK?

Se todos os 10 testes passaram:

**Status: ✅ ETAPA 3 - PostCard PRONTO**

Próximo passo: Melhorias ou ETAPA 4

---

**Tempo gasto:** _____ minutos  
**Problemas encontrados:** _____

