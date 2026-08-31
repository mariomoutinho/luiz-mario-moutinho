# Kamba

Kamba é um aplicativo web Kanban para pessoas e equipes organizarem projetos em quadros, colunas e cartões. A interface está em português do Brasil, é responsiva, prioriza navegação por teclado e usa o Supabase para autenticação, PostgreSQL, autorização por Row Level Security (RLS) e sincronização em tempo próximo do real.

Esta versão é gratuita e não possui planos pagos.

## Funcionalidades

- Landing page pública, termos e política de privacidade;
- cadastro, login, logout, recuperação de senha e sessão persistente pelo Supabase Auth;
- rotas protegidas e tela de perfil;
- criação, renomeação, exclusão e busca de quadros;
- colunas e cartões com ordenação por mouse, toque ou teclado usando dnd-kit;
- descrição, prazo, responsável, status, etiquetas e checklist em modal acessível;
- busca e filtros combináveis por etiqueta, responsável, prazo e status;
- feedback de carregamento, sucesso, erro, vazio, conteúdo removido e falta de permissão;
- atualização otimista da ordenação com rollback em falha;
- atualização por Supabase Realtime e revalidação ao voltar para a aba;
- migrations versionadas, integridade relacional e políticas RLS;
- build estático pronto para Cloudflare Pages com fallback de SPA e cabeçalhos de segurança.

## Stack e arquitetura

- React 19, TypeScript e Vite;
- Tailwind CSS 4;
- React Router;
- TanStack Query para cache, invalidação e atualização otimista;
- React Hook Form e Zod para formulários;
- Supabase Auth, PostgreSQL e Realtime;
- dnd-kit para arrastar e soltar acessível;
- Lucide React para ícones;
- Vitest e Testing Library;
- Playwright para testes ponta a ponta;
- ESLint e Prettier.

A aplicação é uma SPA. `AuthProvider` mantém a sessão, `ProtectedRoute` protege `/app`, `src/lib/api.ts` concentra o acesso ao Supabase e os hooks em `src/hooks/useKambaData.ts` controlam cache e subscriptions. O banco é a fonte de verdade; filtros são aplicados no cliente sobre o quadro autorizado já carregado.

```text
React UI → TanStack Query → API Supabase → PostgreSQL + RLS
    ↑                              ↓
    └──────── invalidação por Realtime ────────┘
```

## Modelo de dados

| Tabela            | Responsabilidade                               | Exclusão principal                        |
| ----------------- | ---------------------------------------------- | ----------------------------------------- |
| `profiles`        | Nome e identidade pública da conta             | acompanha `auth.users`                    |
| `boards`          | Quadro e proprietário                          | remove todo o conteúdo do quadro          |
| `board_members`   | Associação e papel (`owner`/`member`)          | acompanha quadro ou perfil                |
| `columns`         | Etapas ordenadas do quadro                     | remove seus cartões                       |
| `cards`           | Tarefa, descrição, prazo, status e responsável | remove etiquetas e checklist relacionados |
| `labels`          | Etiquetas próprias de cada quadro              | remove relações com cartões               |
| `card_labels`     | Relação N:N entre cartão e etiqueta            | acompanha cartão/etiqueta                 |
| `checklist_items` | Itens ordenados do cartão                      | acompanha cartão                          |

As chaves compostas impedem relacionar coluna, cartão, etiqueta ou checklist a quadros diferentes. Um responsável precisa ser membro do quadro. As funções `reorder_columns`, `reorder_cards` e `save_card_details` validam todos os IDs e persistem cada operação em uma transação.

## Segurança e RLS

Todas as tabelas expostas têm RLS habilitada. Em resumo:

- apenas membros podem ler quadros e conteúdo associado;
- membros podem editar o conteúdo operacional do quadro;
- apenas o proprietário renomeia/exclui o quadro e adiciona membros;
- cada usuário atualiza somente o próprio perfil;
- e-mail e ID do perfil são imutáveis por atualizações do cliente;
- a chave `service_role` nunca é usada no frontend;
- a migration cria um quadro de demonstração separado para cada nova conta.

Os testes pgTAP de isolamento ficam em `supabase/tests/database/rls.test.sql`.

## Requisitos locais

- Node.js 22 (veja `.nvmrc`);
- npm 10 ou superior;
- um projeto Supabase para fluxos reais de autenticação e persistência;
- opcionalmente, Supabase CLI e Docker para testar o banco localmente;
- navegador Chromium para os testes Playwright.

## Instalação

```bash
npm install
cp .env.example .env.local
npm run dev
```

Preencha em `.env.local`:

```dotenv
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_PUBLICA
```

Use apenas a chave pública/publishable (`anon`). Arquivos `.env*` são ignorados, com exceção de `.env.example`.

Sem essas variáveis, a landing e as páginas públicas funcionam, mas os formulários de conta ficam desativados com uma orientação clara. Isso evita simular persistência ou autenticação insegura.

## Configuração do Supabase

1. Crie ou escolha um projeto Supabase.
2. Instale/autentique a Supabase CLI, se for usar o fluxo por terminal.
3. Na raiz do projeto, vincule e aplique as migrations:

   ```bash
   supabase login
   supabase link --project-ref SEU_PROJECT_REF
   supabase db push
   ```

4. Em **Authentication → URL Configuration**, configure a URL pública do Kamba como Site URL e adicione como redirects:

   ```text
   http://localhost:5173/atualizar-senha
   https://SEU-DOMINIO/atualizar-senha
   ```

5. Confirme que o Realtime está habilitado. A migration inclui as tabelas do Kamba na publication `supabase_realtime`.
6. Copie a URL e a chave pública do projeto para o ambiente local e para o Cloudflare Pages.

Para um banco local descartável:

```bash
supabase start
supabase db reset
supabase test db
```

`supabase db reset` é destrutivo para o banco local da CLI; não execute contra dados que deseja preservar.

## Comandos

```bash
npm run dev           # servidor local
npm run lint          # lint do projeto
npm run typecheck     # checagem TypeScript
npm run test          # testes unitários e de componentes
npm run test:coverage # cobertura em texto e HTML
npm run test:e2e      # Playwright
npm run build         # build de produção em dist/
npm run preview       # prévia do build
npm run format:check  # valida a formatação
```

Na primeira execução do Playwright, pode ser necessário instalar o navegador:

```bash
npx playwright install chromium
```

## Publicação no Cloudflare Pages

O projeto usa `wrangler.jsonc`, `public/_redirects` e `public/_headers`. Nas configurações do Pages use:

| Configuração           | Valor                                         |
| ---------------------- | --------------------------------------------- |
| Framework preset       | Vite                                          |
| Build command          | `npm run build`                               |
| Build output directory | `dist`                                        |
| Node.js                | `22`                                          |
| Variáveis              | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |

Fluxo recomendado:

1. Em Cloudflare, abra **Workers & Pages → Create → Pages → Connect to Git**.
2. Escolha o repositório e informe os valores da tabela acima.
3. Cadastre as duas variáveis públicas nos ambientes Production e Preview.
4. Publique e teste uma rota interna diretamente, por exemplo `/entrar`, para validar o fallback da SPA.
5. Atualize no Supabase as URLs autorizadas do domínio `pages.dev` e do domínio próprio.

Também é possível fazer upload direto, quando houver autorização para publicar:

```bash
npx wrangler pages deploy ./dist --project-name=kamba
```

## Testes e critérios de aceite

A suíte cobre:

- proteção de rotas;
- filtros e busca;
- movimentação local/reordenação com preservação do estado original;
- modal por teclado, foco inicial e contenção de foco;
- landing nos viewports 320×568, 360×800, 390×844, 412×915, 768×1024, 1366×768 e 1920×1080;
- páginas públicas, fallback de rota e estado sem credenciais;
- isolamento RLS entre duas contas, compartilhamento autorizado e bloqueio de escrita por membro não proprietário (pgTAP).

Os fluxos remotos de cadastro, CRUD, persistência após reload e isolamento real dependem de aplicar a migration em um projeto Supabase. Não devem ser declarados como executados até essa vinculação existir.

## Limitações conhecidas

- não há projeto Supabase nem Cloudflare Pages vinculado por padrão;
- avatar usa iniciais; upload aguarda um bucket privado com políticas específicas;
- convite adiciona somente contas já cadastradas, sem envio de e-mail;
- criação/edição de novas etiquetas ainda não possui interface; o quadro inicial inclui etiquetas utilizáveis;
- Realtime invalida e recarrega o quadro, em vez de reconciliar eventos campo a campo;
- termos e política precisam de revisão jurídica e dados de contato antes de um lançamento comercial.

## Próximos passos recomendados

1. Aplicar e executar os testes da migration em um projeto Supabase escolhido.
2. Rodar os E2E autenticados contra um ambiente de teste isolado.
3. Adicionar gestão de etiquetas e convites por e-mail.
4. Configurar upload de avatar no Supabase Storage com bucket privado e RLS.
5. Publicar no Cloudflare Pages e validar a URL final em desktop e mobile reais.
