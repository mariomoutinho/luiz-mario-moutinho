begin;
select plan(10);

insert into auth.users (id, email, raw_user_meta_data)
values
  ('00000000-0000-0000-0000-000000000001', 'ana@kamba.test', '{"full_name":"Ana"}'::jsonb),
  ('00000000-0000-0000-0000-000000000002', 'bia@kamba.test', '{"full_name":"Bia"}'::jsonb);

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);
set local role authenticated;

select is((select count(*) from public.boards), 1::bigint, 'usuário enxerga somente o próprio quadro');
select is((select count(*) from public.profiles), 1::bigint, 'usuário não enxerga perfil sem quadro compartilhado');
select is((select count(*) from public.columns), 3::bigint, 'usuário acessa colunas do próprio quadro');

select lives_ok(
  $$select public.add_board_member_by_email((select id from public.boards limit 1), 'bia@kamba.test')$$,
  'proprietário pode adicionar membro existente'
);

reset role;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000002', true);
set local role authenticated;

select is((select count(*) from public.boards), 2::bigint, 'membro enxerga quadro próprio e compartilhado');
select is(
  (select count(*) from public.boards where owner_id = '00000000-0000-0000-0000-000000000001'),
  1::bigint,
  'membro não proprietário continua sem alterar o isolamento de leitura'
);

select is(
  (with changed as (
    update public.boards
    set title = 'Alteração indevida'
    where owner_id = '00000000-0000-0000-0000-000000000001'
    returning 1
  ) select count(*) from changed),
  0::bigint,
  'membro não proprietário não renomeia o quadro'
);

select is(
  (with removed as (
    delete from public.boards
    where owner_id = '00000000-0000-0000-0000-000000000001'
    returning 1
  ) select count(*) from removed),
  0::bigint,
  'membro não proprietário não exclui o quadro'
);

select throws_ok(
  $$select public.save_card_details(
    (select c.id from public.cards c join public.boards b on b.id = c.board_id where b.owner_id = '00000000-0000-0000-0000-000000000001' limit 1),
    'Título que não deve persistir',
    '',
    null,
    null,
    false,
    array['99999999-9999-9999-9999-999999999999'::uuid],
    array[]::uuid[],
    array[]::text[],
    array[]::boolean[]
  )$$,
  '22023',
  'A lista de etiquetas é inválida.',
  'salvamento transacional rejeita etiqueta de outro quadro'
);

select is(
  (
    select c.title
    from public.cards c
    join public.boards b on b.id = c.board_id
    where b.owner_id = '00000000-0000-0000-0000-000000000001'
    limit 1
  ),
  'Conheça seu quadro Kamba',
  'falha transacional preserva o título original'
);

select * from finish();
rollback;
