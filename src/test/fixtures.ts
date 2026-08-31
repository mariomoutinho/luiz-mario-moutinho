import type { BoardDetail, Card } from '../types/kamba';

export const label = { id: 'label-1', board_id: 'board-1', name: 'Prioridade', color: '#f97316' };
export const profile = {
  id: 'user-1',
  name: 'Ana Melo',
  email: 'ana@example.com',
  avatar_url: null,
};

export const card: Card = {
  id: 'card-1',
  board_id: 'board-1',
  column_id: 'column-1',
  title: 'Preparar apresentação',
  description: 'Reunir os resultados do trimestre',
  position: 1024,
  due_date: '2026-08-31',
  assignee_id: 'user-1',
  completed: false,
  created_at: '2026-08-30T12:00:00Z',
  updated_at: '2026-08-30T12:00:00Z',
  labels: [label],
  checklist_items: [
    {
      id: 'check-1',
      board_id: 'board-1',
      card_id: 'card-1',
      title: 'Revisar números',
      completed: true,
      position: 1024,
    },
  ],
};

export const boardDetail: BoardDetail = {
  board: {
    id: 'board-1',
    title: 'Lançamento',
    color: '#f97316',
    owner_id: 'user-1',
    created_at: '2026-08-30T12:00:00Z',
    updated_at: '2026-08-30T12:00:00Z',
  },
  labels: [label],
  members: [{ user_id: 'user-1', role: 'owner', profile }],
  columns: [
    { id: 'column-1', board_id: 'board-1', title: 'A fazer', position: 1024, cards: [card] },
    { id: 'column-2', board_id: 'board-1', title: 'Concluído', position: 2048, cards: [] },
  ],
};
