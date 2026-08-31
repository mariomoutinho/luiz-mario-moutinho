import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { ProtectedRoute } from './ProtectedRoute';

const authState = vi.hoisted(() => ({ user: null as { id: string } | null, loading: false }));

vi.mock('../hooks/useAuth', () => ({ useAuth: () => authState }));

describe('ProtectedRoute', () => {
  it('redireciona visitantes para o login', () => {
    authState.user = null;
    render(
      <MemoryRouter initialEntries={['/app']}>
        <Routes>
          <Route path="/entrar" element={<h1>Entrar</h1>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<h1>Área privada</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: 'Entrar' })).toBeInTheDocument();
  });

  it('libera a rota quando há sessão', () => {
    authState.user = { id: 'user-1' };
    render(
      <MemoryRouter initialEntries={['/app']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<h1>Área privada</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: 'Área privada' })).toBeInTheDocument();
  });
});
