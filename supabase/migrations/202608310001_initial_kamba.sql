-- Kamba: schema inicial, dados por usuário e políticas RLS.
-- Estratégia de exclusão:
--   * usuário -> perfil -> quadros próprios (CASCADE);
--   * quadro -> membros, colunas, cartões, etiquetas e checklists (CASCADE);
--   * coluna -> cartões (CASCADE);
--   * cartão -> relações de etiquetas e checklist (CASCADE);
--   * perfil removido como responsável -> card.assignee_id = NULL.

create extension if not exists pgcrypto;
create extension if not exists citext;

create type public.board_role as enum ('owner', 'member');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 80),
  email citext not null unique,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.boards (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade default auth.uid(),
  title text not null check (char_length(title) between 2 and 80),
  color text not null default '#f97316' check (color ~ '^#[0-9A-Fa-f]{6}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.board_members (
  board_id uuid not null references public.boards(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.board_role not null default 'member',
  created_at timestamptz not null default now(),
  primary key (board_id, user_id)
);

create table public.columns (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 80),
  position numeric(16, 4) not null check (position >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, board_id)
);

create table public.cards (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  column_id uuid not null,
  title text not null check (char_length(title) between 1 and 160),
  description text not null default '' check (char_length(description) <= 5000),
  position numeric(16, 4) not null check (position >= 0),
  due_date date,
  assignee_id uuid references public.profiles(id) on delete set null,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, board_id),
  constraint cards_column_board_fkey
    foreign key (column_id, board_id) references public.columns(id, board_id) on delete cascade
);

create table public.labels (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 40),
  color text not null check (color ~ '^#[0-9A-Fa-f]{6}$'),
  created_at timestamptz not null default now(),
  unique (id, board_id),
  unique (board_id, name)
);

create table public.card_labels (
  board_id uuid not null references public.boards(id) on delete cascade,
  card_id uuid not null,
  label_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (card_id, label_id),
  constraint card_labels_card_board_fkey
    foreign key (card_id, board_id) references public.cards(id, board_id) on delete cascade,
  constraint card_labels_label_board_fkey
    foreign key (label_id, board_id) references public.labels(id, board_id) on delete cascade
);

create table public.checklist_items (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  card_id uuid not null,
  title text not null check (char_length(title) between 1 and 240),
  completed boolean not null default false,
  position numeric(16, 4) not null check (position >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint checklist_card_board_fkey
    foreign key (card_id, board_id) references public.cards(id, board_id) on delete cascade
);

create index boards_owner_id_idx on public.boards(owner_id);
create index board_members_user_id_idx on public.board_members(user_id, board_id);
create index columns_board_position_idx on public.columns(board_id, position);
create index cards_board_column_position_idx on public.cards(board_id, column_id, position);
create index cards_assignee_id_idx on public.cards(assignee_id) where assignee_id is not null;
create index cards_due_date_idx on public.cards(board_id, due_date) where due_date is not null;
create index labels_board_id_idx on public.labels(board_id);
create index card_labels_board_id_idx on public.card_labels(board_id);
create index checklist_card_position_idx on public.checklist_items(card_id, position);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger boards_set_updated_at before update on public.boards
for each row execute function public.set_updated_at();
create trigger columns_set_updated_at before update on public.columns
for each row execute function public.set_updated_at();
create trigger cards_set_updated_at before update on public.cards
for each row execute function public.set_updated_at();
create trigger checklist_set_updated_at before update on public.checklist_items
for each row execute function public.set_updated_at();

create or replace function public.touch_parent_board()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_board_id uuid;
begin
  target_board_id := case when tg_op = 'DELETE' then old.board_id else new.board_id end;
  update public.boards
  set updated_at = now()
  where id = target_board_id;
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger columns_touch_board after insert or update or delete on public.columns
for each row execute function public.touch_parent_board();
create trigger cards_touch_board after insert or update or delete on public.cards
for each row execute function public.touch_parent_board();
create trigger labels_touch_board after insert or update or delete on public.labels
for each row execute function public.touch_parent_board();
create trigger card_labels_touch_board after insert or delete on public.card_labels
for each row execute function public.touch_parent_board();
create trigger checklist_touch_board after insert or update or delete on public.checklist_items
for each row execute function public.touch_parent_board();

create or replace function public.protect_profile_identity()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.id = old.id;
  new.email = old.email;
  new.created_at = old.created_at;
  return new;
end;
$$;

create trigger profiles_protect_identity
before update on public.profiles
for each row execute function public.protect_profile_identity();

create or replace function public.is_board_member(target_board_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.board_members
    where board_id = target_board_id and user_id = (select auth.uid())
  );
$$;

create or replace function public.is_board_owner(target_board_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.boards
    where id = target_board_id and owner_id = (select auth.uid())
  );
$$;

create or replace function public.shares_board_with(target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select target_user_id = (select auth.uid()) or exists (
    select 1
    from public.board_members mine
    join public.board_members theirs on theirs.board_id = mine.board_id
    where mine.user_id = (select auth.uid()) and theirs.user_id = target_user_id
  );
$$;

revoke all on function public.is_board_member(uuid) from public;
revoke all on function public.is_board_owner(uuid) from public;
revoke all on function public.shares_board_with(uuid) from public;
grant execute on function public.is_board_member(uuid) to authenticated;
grant execute on function public.is_board_owner(uuid) to authenticated;
grant execute on function public.shares_board_with(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.boards enable row level security;
alter table public.board_members enable row level security;
alter table public.columns enable row level security;
alter table public.cards enable row level security;
alter table public.labels enable row level security;
alter table public.card_labels enable row level security;
alter table public.checklist_items enable row level security;

create policy "profiles_select_shared_boards"
on public.profiles for select to authenticated
using ((select public.shares_board_with(id)));

create policy "profiles_update_self"
on public.profiles for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy "boards_select_members"
on public.boards for select to authenticated
using ((select public.is_board_member(id)));

create policy "boards_insert_owner"
on public.boards for insert to authenticated
with check (owner_id = (select auth.uid()));

create policy "boards_update_owner"
on public.boards for update to authenticated
using ((select public.is_board_owner(id)))
with check (owner_id = (select auth.uid()));

create policy "boards_delete_owner"
on public.boards for delete to authenticated
using ((select public.is_board_owner(id)));

create policy "board_members_select_members"
on public.board_members for select to authenticated
using ((select public.is_board_member(board_id)));

create policy "board_members_insert_owner"
on public.board_members for insert to authenticated
with check ((select public.is_board_owner(board_id)) and role = 'member');

create policy "board_members_delete_owner"
on public.board_members for delete to authenticated
using ((select public.is_board_owner(board_id)) and role <> 'owner');

create policy "columns_select_members"
on public.columns for select to authenticated
using ((select public.is_board_member(board_id)));
create policy "columns_insert_members"
on public.columns for insert to authenticated
with check ((select public.is_board_member(board_id)));
create policy "columns_update_members"
on public.columns for update to authenticated
using ((select public.is_board_member(board_id)))
with check ((select public.is_board_member(board_id)));
create policy "columns_delete_members"
on public.columns for delete to authenticated
using ((select public.is_board_member(board_id)));

create policy "cards_select_members"
on public.cards for select to authenticated
using ((select public.is_board_member(board_id)));
create policy "cards_insert_members"
on public.cards for insert to authenticated
with check ((select public.is_board_member(board_id)));
create policy "cards_update_members"
on public.cards for update to authenticated
using ((select public.is_board_member(board_id)))
with check ((select public.is_board_member(board_id)));
create policy "cards_delete_members"
on public.cards for delete to authenticated
using ((select public.is_board_member(board_id)));

create policy "labels_select_members"
on public.labels for select to authenticated
using ((select public.is_board_member(board_id)));
create policy "labels_insert_members"
on public.labels for insert to authenticated
with check ((select public.is_board_member(board_id)));
create policy "labels_update_members"
on public.labels for update to authenticated
using ((select public.is_board_member(board_id)))
with check ((select public.is_board_member(board_id)));
create policy "labels_delete_members"
on public.labels for delete to authenticated
using ((select public.is_board_member(board_id)));

create policy "card_labels_select_members"
on public.card_labels for select to authenticated
using ((select public.is_board_member(board_id)));
create policy "card_labels_insert_members"
on public.card_labels for insert to authenticated
with check ((select public.is_board_member(board_id)));
create policy "card_labels_delete_members"
on public.card_labels for delete to authenticated
using ((select public.is_board_member(board_id)));

create policy "checklist_select_members"
on public.checklist_items for select to authenticated
using ((select public.is_board_member(board_id)));
create policy "checklist_insert_members"
on public.checklist_items for insert to authenticated
with check ((select public.is_board_member(board_id)));
create policy "checklist_update_members"
on public.checklist_items for update to authenticated
using ((select public.is_board_member(board_id)))
with check ((select public.is_board_member(board_id)));
create policy "checklist_delete_members"
on public.checklist_items for delete to authenticated
using ((select public.is_board_member(board_id)));

create or replace function public.validate_card_assignee()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.assignee_id is not null and not exists (
    select 1 from public.board_members
    where board_id = new.board_id and user_id = new.assignee_id
  ) then
    raise exception 'O responsável precisa ser membro do quadro.' using errcode = '23514';
  end if;
  return new;
end;
$$;

create trigger cards_validate_assignee
before insert or update of assignee_id, board_id on public.cards
for each row execute function public.validate_card_assignee();

create or replace function public.add_owner_membership()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.board_members (board_id, user_id, role)
  values (new.id, new.owner_id, 'owner')
  on conflict (board_id, user_id) do update set role = 'owner';
  return new;
end;
$$;

create trigger boards_add_owner_membership
after insert on public.boards
for each row execute function public.add_owner_membership();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  demo_board_id uuid;
  ideas_column_id uuid;
  doing_column_id uuid;
  done_column_id uuid;
  first_card_id uuid;
  priority_label_id uuid;
  display_name text;
begin
  display_name := left(
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
      split_part(new.email, '@', 1),
      'Pessoa Kamba'
    ),
    80
  );
  if char_length(display_name) < 2 then
    display_name := 'Pessoa Kamba';
  end if;

  insert into public.profiles (id, name, email)
  values (new.id, display_name, new.email);

  insert into public.boards (owner_id, title, color)
  values (new.id, 'Meu primeiro projeto', '#f97316')
  returning id into demo_board_id;

  insert into public.columns (board_id, title, position)
  values (demo_board_id, 'Ideias', 1024) returning id into ideas_column_id;
  insert into public.columns (board_id, title, position)
  values (demo_board_id, 'Em andamento', 2048) returning id into doing_column_id;
  insert into public.columns (board_id, title, position)
  values (demo_board_id, 'Concluído', 3072) returning id into done_column_id;

  insert into public.labels (board_id, name, color)
  values (demo_board_id, 'Prioridade', '#f97316') returning id into priority_label_id;
  insert into public.labels (board_id, name, color)
  values
    (demo_board_id, 'Pesquisa', '#0ea5e9'),
    (demo_board_id, 'Acessibilidade', '#10b981');

  insert into public.cards (board_id, column_id, title, description, position, assignee_id)
  values (
    demo_board_id,
    ideas_column_id,
    'Conheça seu quadro Kamba',
    'Abra este cartão para adicionar descrição, prazo, etiquetas, responsável e checklist.',
    1024,
    new.id
  )
  returning id into first_card_id;

  insert into public.card_labels (board_id, card_id, label_id)
  values (demo_board_id, first_card_id, priority_label_id);

  insert into public.checklist_items (board_id, card_id, title, completed, position)
  values
    (demo_board_id, first_card_id, 'Editar os detalhes deste cartão', false, 1024),
    (demo_board_id, first_card_id, 'Criar um novo cartão', false, 2048),
    (demo_board_id, first_card_id, 'Mover o cartão entre colunas', false, 3072);

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.add_board_member_by_email(p_board_id uuid, p_email citext)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_user_id uuid;
begin
  if not public.is_board_owner(p_board_id) then
    raise exception 'Somente o proprietário pode adicionar membros.' using errcode = '42501';
  end if;

  select id into target_user_id from public.profiles where email = p_email;
  if target_user_id is null then
    raise exception 'Nenhuma conta encontrada para este e-mail.' using errcode = 'P0002';
  end if;

  insert into public.board_members (board_id, user_id, role)
  values (p_board_id, target_user_id, 'member')
  on conflict (board_id, user_id) do nothing;
end;
$$;

create or replace function public.reorder_columns(p_board_id uuid, p_column_ids uuid[])
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_board_member(p_board_id) then
    raise exception 'Sem permissão para este quadro.' using errcode = '42501';
  end if;
  if cardinality(p_column_ids) <> (select count(*) from public.columns where board_id = p_board_id)
     or cardinality(p_column_ids) <> (select count(distinct id) from unnest(p_column_ids) as ids(id))
     or exists (select 1 from unnest(p_column_ids) as ids(id) left join public.columns c on c.id = ids.id and c.board_id = p_board_id where c.id is null) then
    raise exception 'A lista de colunas é inválida.' using errcode = '22023';
  end if;

  update public.columns c
  set position = ordered.ordinality * 1024, updated_at = now()
  from unnest(p_column_ids) with ordinality as ordered(id, ordinality)
  where c.id = ordered.id and c.board_id = p_board_id;
end;
$$;

create or replace function public.save_card_details(
  p_card_id uuid,
  p_title text,
  p_description text,
  p_due_date date,
  p_assignee_id uuid,
  p_completed boolean,
  p_label_ids uuid[],
  p_checklist_ids uuid[],
  p_checklist_titles text[],
  p_checklist_completed boolean[]
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_board_id uuid;
  target_index integer;
begin
  select board_id into target_board_id
  from public.cards
  where id = p_card_id;

  if target_board_id is null or not public.is_board_member(target_board_id) then
    raise exception 'Cartão inexistente ou sem permissão.' using errcode = '42501';
  end if;

  if cardinality(p_label_ids) <> (
    select count(distinct label_id) from unnest(p_label_ids) as values_list(label_id)
  ) or exists (
    select 1
    from unnest(p_label_ids) as values_list(label_id)
    left join public.labels l on l.id = values_list.label_id and l.board_id = target_board_id
    where l.id is null
  ) then
    raise exception 'A lista de etiquetas é inválida.' using errcode = '22023';
  end if;

  if cardinality(p_checklist_ids) <> cardinality(p_checklist_titles)
     or cardinality(p_checklist_ids) <> cardinality(p_checklist_completed)
     or cardinality(array_remove(p_checklist_ids, null)) <> (
       select count(distinct item_id)
       from unnest(array_remove(p_checklist_ids, null)) as values_list(item_id)
     )
     or exists (
       select 1
       from unnest(array_remove(p_checklist_ids, null)) as values_list(item_id)
       left join public.checklist_items item
         on item.id = values_list.item_id and item.card_id = p_card_id and item.board_id = target_board_id
       where item.id is null
     ) then
    raise exception 'A lista do checklist é inválida.' using errcode = '22023';
  end if;

  update public.cards
  set
    title = trim(p_title),
    description = trim(p_description),
    due_date = p_due_date,
    assignee_id = p_assignee_id,
    completed = p_completed,
    updated_at = now()
  where id = p_card_id and board_id = target_board_id;

  delete from public.card_labels
  where card_id = p_card_id
    and not (label_id = any(p_label_ids));

  insert into public.card_labels (board_id, card_id, label_id)
  select target_board_id, p_card_id, label_id
  from unnest(p_label_ids) as values_list(label_id)
  on conflict (card_id, label_id) do nothing;

  delete from public.checklist_items
  where card_id = p_card_id
    and not (id = any(array_remove(p_checklist_ids, null)));

  for target_index in 1..cardinality(p_checklist_titles) loop
    if nullif(trim(p_checklist_titles[target_index]), '') is null then
      raise exception 'Itens do checklist precisam de título.' using errcode = '22023';
    end if;

    if p_checklist_ids[target_index] is null then
      insert into public.checklist_items (
        board_id,
        card_id,
        title,
        completed,
        position
      ) values (
        target_board_id,
        p_card_id,
        trim(p_checklist_titles[target_index]),
        p_checklist_completed[target_index],
        target_index * 1024
      );
    else
      update public.checklist_items
      set
        title = trim(p_checklist_titles[target_index]),
        completed = p_checklist_completed[target_index],
        position = target_index * 1024,
        updated_at = now()
      where id = p_checklist_ids[target_index]
        and card_id = p_card_id
        and board_id = target_board_id;
    end if;
  end loop;
end;
$$;

create or replace function public.reorder_cards(p_board_id uuid, p_card_ids uuid[], p_column_ids uuid[])
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_board_member(p_board_id) then
    raise exception 'Sem permissão para este quadro.' using errcode = '42501';
  end if;
  if cardinality(p_card_ids) <> cardinality(p_column_ids)
     or cardinality(p_card_ids) <> (select count(*) from public.cards where board_id = p_board_id)
     or cardinality(p_card_ids) <> (select count(distinct id) from unnest(p_card_ids) as ids(id))
     or exists (select 1 from unnest(p_card_ids) as ids(id) left join public.cards c on c.id = ids.id and c.board_id = p_board_id where c.id is null)
     or exists (select 1 from unnest(p_column_ids) as ids(id) left join public.columns c on c.id = ids.id and c.board_id = p_board_id where c.id is null) then
    raise exception 'A ordem de cartões é inválida.' using errcode = '22023';
  end if;

  with requested as (
    select card_id, column_id, ordinality
    from unnest(p_card_ids, p_column_ids) with ordinality as moved(card_id, column_id, ordinality)
  ), ordered as (
    select card_id, column_id, row_number() over (partition by column_id order by ordinality) * 1024 as position
    from requested
  )
  update public.cards c
  set column_id = ordered.column_id, position = ordered.position, updated_at = now()
  from ordered
  where c.id = ordered.card_id and c.board_id = p_board_id;
end;
$$;

revoke all on function public.add_board_member_by_email(uuid, citext) from public;
revoke all on function public.save_card_details(uuid, text, text, date, uuid, boolean, uuid[], uuid[], text[], boolean[]) from public;
revoke all on function public.reorder_columns(uuid, uuid[]) from public;
revoke all on function public.reorder_cards(uuid, uuid[], uuid[]) from public;
grant execute on function public.add_board_member_by_email(uuid, citext) to authenticated;
grant execute on function public.save_card_details(uuid, text, text, date, uuid, boolean, uuid[], uuid[], text[], boolean[]) to authenticated;
grant execute on function public.reorder_columns(uuid, uuid[]) to authenticated;
grant execute on function public.reorder_cards(uuid, uuid[], uuid[]) to authenticated;

grant usage on schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;

alter publication supabase_realtime add table
  public.boards,
  public.board_members,
  public.columns,
  public.cards,
  public.labels,
  public.card_labels,
  public.checklist_items;

alter table public.board_members replica identity full;
alter table public.columns replica identity full;
alter table public.cards replica identity full;
alter table public.labels replica identity full;
alter table public.card_labels replica identity full;
alter table public.checklist_items replica identity full;
