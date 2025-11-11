```markdown
## Resumo rápido

Erro atual: "invalid Unicode escape" ao compilar o bundle JS com Metro/Expo. Isso bloqueia o app. O bundler reporta um offset/posição, mas não temos o arquivo:linha exato — a informação que mais ajuda é o stack trace original do Metro (copie as primeiras linhas do erro).

O que já fiz:
- Rodei um parser TypeScript em todos os arquivos (.ts/.tsx/.js/.jsx) usando `scripts/ts_parse_check.js` — resultado: OK (nenhum erro de parse detectado).
- Procurei por ocorrências de `\\u` no workspace — aparecem em documentos e caches (markdown, .expo), mas não em código fonte (.ts/.tsx/.js/.jsx).

Hipótese técnica:
- Erros "invalid Unicode escape" tipicamente vêm de literais de string contendo sequências do tipo "\\u" seguidas por caracteres inválidos (ex.: paths Windows não escapados dentro de strings). Pode também vir de arquivos JS gerados/transpilados ou de imports incomuns. O parser TypeScript não indicou erro sintático, então o problema pode estar em código transformado pelo Babel/Metro ou em um arquivo não-TS/JS que o bundler acaba incluindo.

Plano de ação imediato:
- [ ] Obter o stack trace do Metro (você): as primeiras linhas do erro que apontem arquivo:linha:col ou trecho problemático.
- [ ] Se você não puder fornecer o stack trace, executar uma varredura avançada que:
  - procura literais com barras invertidas (\\) em todos os arquivos (já parcial),
  - tenta gerar um bundle local e mapear o offset informado pelo Metro ao arquivo de origem (opção mais intrusiva/mais lenta).
- [ ] Corrigir o arquivo identificado (escapar ou remover a sequência inválida) e validar com `expo start`.

Checklist atual:
- [x] Criei e rodei scripts/ts_parse_check.js (TS parser sweep)
- [x] Busquei por "\\u" em todo o workspace (achados apenas em docs/caches)
- [ ] Receber Metro stack trace (aguardando)
- [ ] Localizar e corrigir arquivo responsável
- [ ] Validar bundler + npx tsc --noEmit + testes rápidos de fluxo

Como você pode ajudar agora:
1) Cole aqui as primeiras linhas do erro Metro/Expo (terminal) — principalmente se houver um caminho de arquivo e linha. Exemplo esperado:
   Error: Compiling JS failed
   C:\\Users\\Clegivaldo\\Desktop\\my-app\\src\\components\\X.tsx:123:45: Error: invalid Unicode escape

OU

2) Responda: "Varredura automática avançada" e eu gero um bundle local e tento mapear o offset do erro para o arquivo fonte (este passo é mais pesado; leva mais tempo).

Próxima ação minha (após sua escolha):
- Se você colar o stack: eu abro o arquivo indicado, corrijo a sequência inválida e testo.
- Se autorizar a varredura: eu gero o bundle local e faço um mapeamento para localizar o trecho inválido.

---
_Aguardando sua decisão: cole o stack do Metro ou autorize "Varredura automática avançada"._

```
## Resumo rápido

Identifiquei que há um erro de parse JS (Metro/Babel) que impede o bundle de iniciar: mensagens relacionadas a "';' or 'in' expected inside 'for'" e "Expected at end of object literal '{...'". Precisamos do stack trace do Metro (arquivo + linha) para corrigir exatamente o ponto. Como alternativa posso rodar uma varredura sintática automática no código para localizar arquivos com chaves/colchetes/parênteses desequilibrados.

## Plano de ação

- [ ] Receber o erro completo do Metro (linha/coluna) — mais rápido e preciso.
- [ ] (opcional) Executar varredura automática no workspace procurando arquivos .ts/.tsx com desbalanceamento de chaves/colchetes/parênteses.
- [ ] Abrir o arquivo apontado pelo Metro e corrigir a sintaxe (fechar tag JSX, remover token sobrando, etc.).
- [ ] Rodar `expo start` localmente para confirmar que o bundler compila.
- [ ] Rodar checagem rápida do TypeScript (npx tsc --noEmit) e ajustar erros menores detectados.
- [ ] Validar fluxo crítico (abrir app, navegar para feed, criar/editar/deletar post).

## Checklist atual

- [ ] Obter Metro stack trace (aguardando)
- [ ] Realizar varredura automática (aguardando autorização)

## O que eu preciso de você agora

1. Cole aqui o primeiro erro completo que o Metro exibe ao tentar compilar (ex.: path/to/file.tsx:LINE:COL: message). Isso me permite editar exatamente o local.
2. Se preferir que eu tente detectar automaticamente os arquivos com possível sintaxe quebrada, responda apenas: "Varredura automática".

---
_Vou aguardar sua escolha (colar stack do Metro ou autorizar a varredura)._ 
# Plano Rápido — Análise e Correções BFpet

Resumo do entendimento:
- Objetivos: mover botão de adicionar postagem para o centro da barra de navegação, trocar nome do perfil por ícone, sugerir ícones melhores para Home e Explore, explicar diferença entre Home e Explore, e corrigir erros de navegação relacionados ao DB (NativeDatabase.prepareAsync NPE).
- Principais causas do erro: muitos repositórios/serviços usam `db.getDb()` (sincrono) assumindo handle válido. Se o DB não foi inicializado ou o handle estiver inválido, chamadas nativas como prepareAsync podem falhar com NullPointerException.

Ação / Plano:
- [ ] Atualizar repositórios/serviços para usar `await db.getDbAsync()` onde necessário (evita handle inválido).
- [ ] Corrigir `shareRepository` e outros pontos detectados (feito nesta iteração).
- [ ] Verificar se Database.initialize é chamado no boot do app (sugerir adição se não estiver).
- [ ] Implementar mudanças na barra de navegação: botão central de adicionar + ícone do perfil.
- [ ] Revisar ícones Home e Explore e propor alternativas (Ionicons/Feather/MaterialIcons) + pequena amostra.
- [ ] Responder: diferença entre Home e Explore e recomendar abordagem UX.
- [ ] Executar testes manuais (ação rápida: abrir app no emulador, testar compartilhar, navegar). Registrar resultados.

Notas/Assunções:
- Assumo que o projeto usa expo + react-native e que o wrapper assíncrono do sqlite expõe `openDatabaseAsync`, `runAsync`, `getFirstAsync` etc., como visto em `services/db/sqlite.ts`.
- Mudanças de ícones/UX exigirão edição de componentes de navegação (provavelmente usando `react-navigation` + custom tab bar). Vou localizar esses arquivos antes de editar.

Próximos passos imediatos:
1) Rodar uma busca por `db.getDb()` e substituir pelos `getDbAsync()` (já parcial aplicado).
2) Localizar arquivos de navegação (`navigation`, `BottomTab`, `TabBar`, `MainNavigator`) e editar para centralizar botão de adicionar e trocar label por ícone.
3) Propor 2 opções de ícones para Home/Explore.

---
Atualização: comecei aplicando correções nos repositórios que usavam `db.getDb()` (shareRepository, userRepository, profileService, authRepository). Próximo: localizar arquivo de navegação para editar layout da tab bar e adicionar ícones.
