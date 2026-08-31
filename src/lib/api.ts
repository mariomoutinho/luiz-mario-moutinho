import type {
  BoardColumn,
  BoardDetail,
  BoardMember,
  BoardSummary,
  Card,
  CardFormValues,
  ChecklistItem,
  Label,
  Profile,
} from '../types/kamba';
import { requireSupabase } from './supabase';

type QueryResult<T> = { data: T | null; error: { message: string } | null };

function unwrap<T>({ data, error }: QueryResult<T>): T {
  if (error) throw new Error(error.message);
  if (data === null) throw new Error('Conteúdo não encontrado.');
  return data;
}

export async function fetchProfile(userId: string) {
  const result = await requireSupabase()
    .from('profiles')
    .select('id,name,email,avatar_url')
    .eq('id', userId)
    .single();
  return unwrap(result as QueryResult<Profile>);
}

export async function updateProfile(userId: string, name: string) {
  const client = requireSupabase();
  const result = await client
    .from('profiles')
    .update({ name: name.trim(), updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select('id,name,email,avatar_url')
    .single();
  const profile = unwrap(result as QueryResult<Profile>);
  const { error } = await client.auth.updateUser({ data: { full_name: profile.name } });
  if (error) throw new Error(error.message);
  return profile;
}

export async function fetchBoards() {
  const result = await requireSupabase()
    .from('boards')
    .select('id,title,color,owner_id,created_at,updated_at')
    .order('updated_at', { ascending: false });
  return unwrap(result as QueryResult<BoardSummary[]>);
}

export async function createBoard(title: string, color: string) {
  const result = await requireSupabase()
    .from('boards')
    .insert({ title: title.trim(), color })
    .select('id,title,color,owner_id,created_at,updated_at')
    .single();
  return unwrap(result as QueryResult<BoardSummary>);
}

export async function renameBoard(boardId: string, title: string) {
  const result = await requireSupabase()
    .from('boards')
    .update({ title: title.trim(), updated_at: new Date().toISOString() })
    .eq('id', boardId)
    .select('id,title,color,owner_id,created_at,updated_at')
    .single();
  return unwrap(result as QueryResult<BoardSummary>);
}

export async function deleteBoard(boardId: string) {
  const { error } = await requireSupabase().from('boards').delete().eq('id', boardId);
  if (error) throw new Error(error.message);
}

type MemberRow = {
  user_id: string;
  role: 'owner' | 'member';
  profiles: Profile | Profile[];
};

type CardLabelRow = { card_id: string; label_id: string };

export async function fetchBoardDetail(boardId: string): Promise<BoardDetail> {
  const client = requireSupabase();
  const [
    boardResult,
    columnsResult,
    cardsResult,
    labelsResult,
    cardLabelsResult,
    checklistResult,
    membersResult,
  ] = await Promise.all([
    client
      .from('boards')
      .select('id,title,color,owner_id,created_at,updated_at')
      .eq('id', boardId)
      .single(),
    client
      .from('columns')
      .select('id,board_id,title,position')
      .eq('board_id', boardId)
      .order('position'),
    client
      .from('cards')
      .select(
        'id,board_id,column_id,title,description,position,due_date,assignee_id,completed,created_at,updated_at',
      )
      .eq('board_id', boardId)
      .order('position'),
    client.from('labels').select('id,board_id,name,color').eq('board_id', boardId).order('name'),
    client.from('card_labels').select('card_id,label_id').eq('board_id', boardId),
    client
      .from('checklist_items')
      .select('id,board_id,card_id,title,completed,position')
      .eq('board_id', boardId)
      .order('position'),
    client
      .from('board_members')
      .select('user_id,role,profiles!board_members_user_id_fkey(id,name,email,avatar_url)')
      .eq('board_id', boardId),
  ]);

  const board = unwrap(boardResult as QueryResult<BoardSummary>);
  const columns = unwrap(columnsResult as QueryResult<Omit<BoardColumn, 'cards'>[]>);
  const cards = unwrap(cardsResult as QueryResult<Omit<Card, 'labels' | 'checklist_items'>[]>);
  const labels = unwrap(labelsResult as QueryResult<Label[]>);
  const cardLabels = unwrap(cardLabelsResult as QueryResult<CardLabelRow[]>);
  const checklist = unwrap(checklistResult as QueryResult<ChecklistItem[]>);
  const memberRows = unwrap(membersResult as unknown as QueryResult<MemberRow[]>);

  const labelsById = new Map(labels.map((label) => [label.id, label]));
  const members: BoardMember[] = memberRows.map((member) => ({
    user_id: member.user_id,
    role: member.role,
    profile: Array.isArray(member.profiles) ? member.profiles[0] : member.profiles,
  }));
  const completeCards: Card[] = cards.map((card) => ({
    ...card,
    labels: cardLabels
      .filter((relation) => relation.card_id === card.id)
      .map((relation) => labelsById.get(relation.label_id))
      .filter((label): label is Label => Boolean(label)),
    checklist_items: checklist.filter((item) => item.card_id === card.id),
  }));

  return {
    board,
    labels,
    members,
    columns: columns.map((column) => ({
      ...column,
      cards: completeCards.filter((card) => card.column_id === column.id),
    })),
  };
}

export async function createColumn(boardId: string, title: string, position: number) {
  const result = await requireSupabase()
    .from('columns')
    .insert({ board_id: boardId, title: title.trim(), position })
    .select('id,board_id,title,position')
    .single();
  return unwrap(result as QueryResult<Omit<BoardColumn, 'cards'>>);
}

export async function renameColumn(columnId: string, title: string) {
  const { error } = await requireSupabase()
    .from('columns')
    .update({ title: title.trim(), updated_at: new Date().toISOString() })
    .eq('id', columnId);
  if (error) throw new Error(error.message);
}

export async function deleteColumn(columnId: string) {
  const { error } = await requireSupabase().from('columns').delete().eq('id', columnId);
  if (error) throw new Error(error.message);
}

export async function createCard(
  boardId: string,
  columnId: string,
  title: string,
  position: number,
) {
  const result = await requireSupabase()
    .from('cards')
    .insert({ board_id: boardId, column_id: columnId, title: title.trim(), position })
    .select(
      'id,board_id,column_id,title,description,position,due_date,assignee_id,completed,created_at,updated_at',
    )
    .single();
  const card = unwrap(result as QueryResult<Omit<Card, 'labels' | 'checklist_items'>>);
  return { ...card, labels: [], checklist_items: [] } satisfies Card;
}

export async function saveCard(card: Card, values: CardFormValues) {
  const client = requireSupabase();
  const { error } = await client.rpc('save_card_details', {
    p_card_id: card.id,
    p_title: values.title.trim(),
    p_description: values.description.trim(),
    p_due_date: values.dueDate || null,
    p_assignee_id: values.assigneeId || null,
    p_completed: values.completed,
    p_label_ids: values.labelIds,
    p_checklist_ids: values.checklist.map((item) => item.id ?? null),
    p_checklist_titles: values.checklist.map((item) => item.title.trim()),
    p_checklist_completed: values.checklist.map((item) => item.completed),
  });
  if (error) throw new Error(error.message);
}

export async function deleteCard(cardId: string) {
  const { error } = await requireSupabase().from('cards').delete().eq('id', cardId);
  if (error) throw new Error(error.message);
}

export async function reorderColumns(boardId: string, columnIds: string[]) {
  const { error } = await requireSupabase().rpc('reorder_columns', {
    p_board_id: boardId,
    p_column_ids: columnIds,
  });
  if (error) throw new Error(error.message);
}

export async function reorderCards(detail: BoardDetail) {
  const cardIds: string[] = [];
  const columnIds: string[] = [];
  detail.columns.forEach((column) => {
    column.cards.forEach((card) => {
      cardIds.push(card.id);
      columnIds.push(column.id);
    });
  });
  const { error } = await requireSupabase().rpc('reorder_cards', {
    p_board_id: detail.board.id,
    p_card_ids: cardIds,
    p_column_ids: columnIds,
  });
  if (error) throw new Error(error.message);
}

export async function addBoardMember(boardId: string, email: string) {
  const { error } = await requireSupabase().rpc('add_board_member_by_email', {
    p_board_id: boardId,
    p_email: email.trim().toLowerCase(),
  });
  if (error) throw new Error(error.message);
}

export function subscribeToBoard(boardId: string, onChange: () => void) {
  const client = requireSupabase();
  const tables = ['board_members', 'columns', 'cards', 'labels', 'card_labels', 'checklist_items'];
  const channel = client.channel(`board:${boardId}`);

  channel.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'boards', filter: `id=eq.${boardId}` },
    onChange,
  );

  tables.forEach((table) => {
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table, filter: `board_id=eq.${boardId}` },
      onChange,
    );
  });
  channel.subscribe();

  return () => {
    void client.removeChannel(channel);
  };
}
