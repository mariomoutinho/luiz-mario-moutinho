import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { DashboardPage } from './DashboardPage';

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  rename: vi.fn(),
  remove: vi.fn(),
}));

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({ configured: true, user: { id: 'user-1' } }),
}));

vi.mock('../hooks/useKambaData', () => ({
  useBoards: () => ({ data: [], isLoading: false, isError: false }),
  useBoardMutations: () => ({
    create: { mutateAsync: mocks.create, isPending: false },
    rename: { mutateAsync: mocks.rename },
    remove: { mutateAsync: mocks.remove },
  }),
}));

describe('DashboardPage', () => {
  it('cria um quadro e navega para sua URL própria', async () => {
    const user = userEvent.setup();
    mocks.create.mockResolvedValue({ id: 'board-new' });
    render(
      <MemoryRouter initialEntries={['/app']}>
        <Routes>
          <Route path="/app" element={<DashboardPage />} />
          <Route path="/app/quadros/:boardId" element={<h1>Quadro criado</h1>} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /Novo quadro/ }));
    await user.type(screen.getByLabelText('Nome do quadro'), 'Planejamento anual');
    await user.click(screen.getByRole('button', { name: 'Criar' }));

    expect(mocks.create).toHaveBeenCalledWith({ title: 'Planejamento anual', color: '#f97316' });
    expect(await screen.findByRole('heading', { name: 'Quadro criado' })).toBeInTheDocument();
  });
});
