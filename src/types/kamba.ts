export type BoardRole = 'owner' | 'member';

export type Profile = {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
};

export type BoardSummary = {
  id: string;
  title: string;
  color: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
};

export type BoardMember = {
  user_id: string;
  role: BoardRole;
  profile: Profile;
};

export type Label = {
  id: string;
  board_id: string;
  name: string;
  color: string;
};

export type ChecklistItem = {
  id: string;
  board_id: string;
  card_id: string;
  title: string;
  completed: boolean;
  position: number;
};

export type Card = {
  id: string;
  board_id: string;
  column_id: string;
  title: string;
  description: string;
  position: number;
  due_date: string | null;
  assignee_id: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
  labels: Label[];
  checklist_items: ChecklistItem[];
};

export type BoardColumn = {
  id: string;
  board_id: string;
  title: string;
  position: number;
  cards: Card[];
};

export type BoardDetail = {
  board: BoardSummary;
  columns: BoardColumn[];
  labels: Label[];
  members: BoardMember[];
};

export type CardFormValues = {
  title: string;
  description: string;
  dueDate: string;
  assigneeId: string;
  completed: boolean;
  labelIds: string[];
  checklist: Array<{ id?: string; title: string; completed: boolean }>;
};

export type BoardFilters = {
  query: string;
  labelId: string;
  assigneeId: string;
  due: 'all' | 'overdue' | 'today' | 'upcoming' | 'none';
  status: 'all' | 'open' | 'completed';
};

export const emptyBoardFilters: BoardFilters = {
  query: '',
  labelId: '',
  assigneeId: '',
  due: 'all',
  status: 'all',
};
