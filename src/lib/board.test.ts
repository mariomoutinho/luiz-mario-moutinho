import { describe, expect, it } from 'vitest';
import { boardDetail, card } from '../test/fixtures';
import { emptyBoardFilters } from '../types/kamba';
import { filterCards, hasActiveFilters, moveCardLocally, nextPosition } from './board';

describe('filtros do quadro', () => {
  it('busca por título e descrição sem diferenciar maiúsculas', () => {
    expect(filterCards([card], { ...emptyBoardFilters, query: 'APRESENTAÇÃO' })).toHaveLength(1);
    expect(
      filterCards([card], { ...emptyBoardFilters, query: 'resultados do trimestre' }),
    ).toHaveLength(1);
    expect(filterCards([card], { ...emptyBoardFilters, query: 'inexistente' })).toHaveLength(0);
  });

  it('combina etiqueta, responsável, status e prazo', () => {
    const filters = {
      ...emptyBoardFilters,
      labelId: 'label-1',
      assigneeId: 'user-1',
      status: 'open' as const,
      due: 'today' as const,
    };
    expect(filterCards([card], filters, new Date('2026-08-31T09:00:00'))).toEqual([card]);
    expect(
      filterCards([{ ...card, completed: true }], filters, new Date('2026-08-31T09:00:00')),
    ).toHaveLength(0);
  });

  it('identifica filtros ativos e calcula a próxima posição', () => {
    expect(hasActiveFilters(emptyBoardFilters)).toBe(false);
    expect(hasActiveFilters({ ...emptyBoardFilters, status: 'completed' })).toBe(true);
    expect(nextPosition([])).toBe(1024);
    expect(nextPosition([{ position: 1024 }, { position: 4096 }])).toBe(5120);
  });
});

describe('ordenação local', () => {
  it('move um cartão entre colunas e recalcula posições sem mutar o original', () => {
    const next = moveCardLocally(boardDetail, 'card-1', 'column-2', 0);
    expect(boardDetail.columns[0].cards).toHaveLength(1);
    expect(next.columns[0].cards).toHaveLength(0);
    expect(next.columns[1].cards[0]).toMatchObject({
      id: 'card-1',
      column_id: 'column-2',
      position: 1024,
    });
  });

  it('preserva o quadro se o cartão não existir', () => {
    expect(moveCardLocally(boardDetail, 'missing', 'column-2', 0)).toBe(boardDetail);
  });
});
