# Luiz Mario Moutinho — Cuidado e movimento

Landing page profissional para divulgação dos atendimentos de Luiz Mario Moutinho: terapias
integrativas, acupuntura, técnicas corporais, personal trainer e consultoria de treinamento físico.

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

## Informações já confirmadas

- O portfólio divulga terapias integrativas, acupuntura, técnicas corporais, personal trainer e
  consultoria de treinamento físico.
- O site não possui formulário, banco de dados ou backend.
- Todos os agendamentos são direcionados ao WhatsApp `(81) 99257-9809`.
- O perfil profissional exibido é `@moutinho.lm`.

## Pendências por categoria

Os itens abaixo continuam a confirmar. As listas indicam decisões e verificações necessárias;
não representam informações aprovadas para publicação.

### Conteúdo essencial do portfólio

- [ ] Confirmar a biografia profissional completa.
- [ ] Confirmar quais formações podem ser divulgadas e como devem ser apresentadas.

### Decisões comerciais

- [ ] Confirmar a área exata atendida a domicílio.
- [ ] Definir a periodicidade e os detalhes dos planos de treinamento.
- [ ] Definir as políticas de agendamento.
- [ ] Definir as políticas de cancelamento.
- [ ] Definir a validade dos pacotes.

### Ajustes técnicos

- [ ] Confirmar o endereço definitivo de publicação e se será utilizado um domínio próprio.
  A URL do GitHub Pages indicada acima permanece uma previsão.
- [ ] Após confirmar esse endereço, revisar a canonical e o Open Graph.
- [ ] Revisar `robots.txt` e `sitemap.xml` para refletir o endereço de publicação confirmado.

Se o nome do repositório ou domínio mudar, atualizar a canonical, o Open Graph e os arquivos
`robots.txt` e `sitemap.xml`.

## Ordem recomendada para resolver as pendências

1. **Biografia e formações divulgáveis:** confirmar a apresentação profissional que sustentará
   o conteúdo do portfólio.
2. **Área de atendimento e planos de treinamento:** esclarecer onde o atendimento acontece e
   quais condições compõem a oferta.
3. **Agendamento, cancelamento e validade dos pacotes:** definir as regras comerciais com base
   na oferta confirmada.
4. **Endereço de publicação e ajustes técnicos:** confirmar o endereço e então revisar
   canonical, Open Graph, `robots.txt` e `sitemap.xml`.

À medida que cada decisão for confirmada, atualizar o conteúdo correspondente do site e marcar
o item como concluído. Manter em aberto o que ainda depender de confirmação.
