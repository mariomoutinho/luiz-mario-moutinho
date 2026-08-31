# Instruções duráveis do Kamba

- Responda ao usuário em português do Brasil.
- Preserve a arquitetura React/Vite/TypeScript, a camada de acesso ao Supabase e as migrations versionadas.
- Mantenha a autorização nas políticas RLS; ocultar um controle na interface nunca substitui a validação no banco.
- Nunca exponha `service_role`, tokens, senhas ou conteúdo de arquivos `.env` no frontend ou no Git.
- Antes de concluir alterações, execute as verificações relevantes: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` e, quando aplicável, `npm run test:e2e`.
- Preserve acessibilidade por teclado, foco visível, contraste e comportamento responsivo a partir de 320 px.
- Não publique, faça push, crie repositórios remotos ou use credenciais sem autorização explícita do usuário.
