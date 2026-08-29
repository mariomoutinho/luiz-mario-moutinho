# Luiz Mario Moutinho — Cuidado e movimento

Landing page profissional para divulgação dos atendimentos de Luiz Mario Moutinho: terapias
integrativas, acupuntura, massoterapia, técnicas corporais, personal trainer e consultoria de
treinamento físico.

## Tecnologias

- React + TypeScript
- Vite
- Tailwind CSS
- Lucide React
- ESLint e Prettier
- GitHub Actions + GitHub Pages

## Rodar localmente

```bash
npm install
npm run dev
```

Para validar a versão de produção:

```bash
npm run lint
npm run type-check
npm run build
npm run preview
```

## Publicação no GitHub Pages

O `vite.config.ts` detecta automaticamente o nome do repositório durante o GitHub Actions e
configura o `base` para páginas de usuário ou páginas de projeto.

1. Crie um repositório no GitHub e envie a branch `main`.
2. Acesse **Settings → Pages**.
3. Em **Build and deployment → Source**, selecione **GitHub Actions**.
4. O workflow `.github/workflows/deploy.yml` fará o lint, build e deploy automaticamente.

A URL prevista, caso o repositório se chame `luiz-mario-moutinho`, é:

`https://mariomoutinho.github.io/luiz-mario-moutinho/`

Se o nome do repositório ou domínio mudar, atualize a canonical, o Open Graph e os arquivos
`robots.txt` e `sitemap.xml`.

## Conteúdo a confirmar futuramente

- Biografia profissional completa e formações que possam ser divulgadas;
- Periodicidade e detalhes dos planos de treinamento;
- Área exata atendida a domicílio;
- Políticas de agendamento, cancelamento e validade dos pacotes;
- Domínio definitivo, caso seja utilizado.

O site não possui formulário, banco de dados ou backend. Todos os agendamentos são direcionados ao
WhatsApp `(81) 99257-9809` e o perfil profissional exibido é `@moutinho.lm`.
