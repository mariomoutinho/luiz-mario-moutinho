import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { boardDetail } from '../../test/fixtures';
import { emptyBoardFilters } from '../../types/kamba';
import { KanbanBoard } from './KanbanBoard';

function renderBoard(overrides: Partial<React.ComponentProps<typeof KanbanBoard>> = {}) {
  const props: React.ComponentProps<typeof KanbanBoard> = {
    detail: boardDetail,
    filters: emptyBoardFilters,
    dragDisabled: false,
    onOpenCard: vi.fn(),
    onCreateCard: vi.fn().mockResolvedValue(undefined),
    onRenameColumn: vi.fn().mockResolvedValue(undefined),
    onDeleteColumn: vi.fn().mockResolvedValue(undefined),
    onReorderColumns: vi.fn().mockResolvedValue(undefined),
    onReorderCards: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
  return { props, ...render(<KanbanBoard {...props} />) };
}

describe('KanbanBoard', () => {
  it('cria cartão dentro da coluna escolhida', async () => {
    const user = userEvent.setup();
    const { props } = renderBoard();
    await user.click(screen.getAllByRole('button', { name: /Adicionar cartão/ })[0]);
    await user.type(screen.getByLabelText('Título do novo cartão'), 'Validar protótipo');
    await user.click(screen.getByRole('button', { name: 'Adicionar' }));
    expect(props.onCreateCard).toHaveBeenCalledWith('column-1', 'Validar protótipo');
  });

  it('abre um cartão e oferece alças acessíveis de teclado', async () => {
    const user = userEvent.setup();
    const { props } = renderBoard();
    const cardButton = screen.getByText('Preparar apresentação').closest('button');
    expect(cardButton).not.toBeNull();
    await user.click(cardButton!);
    expect(props.onOpenCard).toHaveBeenCalledWith(boardDetail.columns[0].cards[0]);
    expect(
      screen.getByRole('button', { name: 'Arrastar cartão Preparar apresentação' }),
    ).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Arrastar coluna A fazer' })).toBeEnabled();
  });
});
