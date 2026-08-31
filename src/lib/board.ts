import type { BoardDetail, BoardFilters, Card } from '../types/kamba';

export function filterCards(cards: Card[], filters: BoardFilters, now = new Date()) {
  const query = filters.query.trim().toLocaleLowerCase('pt-BR');
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  return cards.filter((card) => {
    if (query && !`${card.title} ${card.description}`.toLocaleLowerCase('pt-BR').includes(query)) {
      return false;
    }

    if (filters.labelId && !card.labels.some((label) => label.id === filters.labelId)) {
      return false;
    }

    if (filters.assigneeId && card.assignee_id !== filters.assigneeId) {
      return false;
    }

    if (filters.status === 'open' && card.completed) return false;
    if (filters.status === 'completed' && !card.completed) return false;

    if (filters.due !== 'all') {
      if (!card.due_date) return filters.due === 'none';
      if (filters.due === 'none') return false;

      const due = new Date(`${card.due_date}T00:00:00`);
      if (filters.due === 'overdue' && !(due < today && !card.completed)) return false;
      if (filters.due === 'today' && due.getTime() !== today.getTime()) return false;
      if (filters.due === 'upcoming' && due < tomorrow) return false;
    }

    return true;
  });
}

export function moveCardLocally(
  detail: BoardDetail,
  cardId: string,
  targetColumnId: string,
  targetIndex: number,
): BoardDetail {
  const next = structuredClone(detail);
  let movingCard: Card | undefined;

  for (const column of next.columns) {
    const index = column.cards.findIndex((card) => card.id === cardId);
    if (index >= 0) {
      [movingCard] = column.cards.splice(index, 1);
      break;
    }
  }

  if (!movingCard) return detail;
  movingCard.column_id = targetColumnId;

  const target = next.columns.find((column) => column.id === targetColumnId);
  if (!target) return detail;
  target.cards.splice(Math.max(0, Math.min(targetIndex, target.cards.length)), 0, movingCard);

  next.columns.forEach((column) => {
    column.cards.forEach((card, index) => {
      card.position = (index + 1) * 1024;
    });
  });

  return next;
}

export function hasActiveFilters(filters: BoardFilters) {
  return Object.entries(filters).some(([key, value]) => {
    if (key === 'query') return value !== '';
    return value !== '' && value !== 'all';
  });
}

export function nextPosition(items: Array<{ position: number }>) {
  return items.length ? Math.max(...items.map((item) => item.position)) + 1024 : 1024;
}
