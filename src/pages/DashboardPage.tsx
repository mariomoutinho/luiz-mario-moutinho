import { ArrowRight, FolderKanban, MoreHorizontal, Plus, RefreshCw, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ConfigurationNotice } from '../components/ConfigurationNotice';
import { Button } from '../components/ui/Button';
import { InputField } from '../components/ui/Field';
import { Notice } from '../components/ui/Notice';
import { useAuth } from '../hooks/useAuth';
import { useBoardMutations, useBoards } from '../hooks/useKambaData';
import { friendlyError } from '../lib/errors';

const boardColors = ['#f97316', '#0ea5e9', '#8b5cf6', '#10b981', '#eab308', '#ec4899'];

export function DashboardPage() {
  const { configured, user } = useAuth();
  const boardsQuery = useBoards();
  const mutations = useBoardMutations();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [color, setColor] = useState(boardColors[0]);
  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);

  const boards = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('pt-BR');
    return (boardsQuery.data ?? []).filter((board) =>
      board.title.toLocaleLowerCase('pt-BR').includes(normalized),
    );
  }, [boardsQuery.data, query]);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    if (title.trim().length < 2) {
      setMessage({ tone: 'error', text: 'Dê ao quadro um nome com pelo menos 2 caracteres.' });
      return;
    }
    try {
      const board = await mutations.create.mutateAsync({ title, color });
      setCreating(false);
      setTitle('');
      navigate(`/app/quadros/${board.id}`);
    } catch (error) {
      setMessage({ tone: 'error', text: friendlyError(error) });
    }
  }

  async function handleRename(boardId: string, currentTitle: string) {
    const nextTitle = window.prompt('Novo nome do quadro:', currentTitle)?.trim();
    if (!nextTitle || nextTitle === currentTitle) return;
    try {
      await mutations.rename.mutateAsync({ boardId, title: nextTitle });
      setMessage({ tone: 'success', text: 'Quadro renomeado.' });
    } catch (error) {
      setMessage({ tone: 'error', text: friendlyError(error) });
    }
  }

  async function handleDelete(boardId: string, boardTitle: string) {
    if (
      !window.confirm(
        `Excluir “${boardTitle}”? Colunas, cartões e checklists serão removidos. Esta ação não pode ser desfeita.`,
      )
    )
      return;
    try {
      await mutations.remove.mutateAsync(boardId);
      setMessage({ tone: 'success', text: 'Quadro excluído.' });
    } catch (error) {
      setMessage({ tone: 'error', text: friendlyError(error) });
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Seu espaço</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Meus quadros</h1>
          <p className="mt-2 text-slate-600">
            Organize projetos, rotinas e tudo o que precisa avançar.
          </p>
        </div>
        <Button type="button" onClick={() => setCreating(true)} disabled={!configured}>
          <Plus className="size-4" aria-hidden="true" /> Novo quadro
        </Button>
      </div>

      <div className="mt-8 space-y-4">
        {!configured && <ConfigurationNotice />}
        {message && <Notice tone={message.tone}>{message.text}</Notice>}
      </div>

      {creating && (
        <form
          className="mt-8 rounded-2xl border border-orange-200 bg-orange-50 p-5"
          onSubmit={handleCreate}
        >
          <h2 className="text-lg font-extrabold">Crie um novo quadro</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <InputField
              id="board-title"
              label="Nome do quadro"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              autoFocus
              maxLength={80}
            />
            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={() => setCreating(false)}>
                Cancelar
              </Button>
              <Button type="submit" loading={mutations.create.isPending}>
                Criar
              </Button>
            </div>
          </div>
          <fieldset className="mt-4">
            <legend className="text-sm font-bold text-slate-800">Cor de identificação</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {boardColors.map((value) => (
                <label key={value} className="relative cursor-pointer">
                  <input
                    className="peer sr-only"
                    type="radio"
                    name="board-color"
                    value={value}
                    checked={color === value}
                    onChange={() => setColor(value)}
                  />
                  <span
                    className="block size-9 rounded-full border-4 border-white shadow-sm ring-2 ring-transparent peer-checked:ring-slate-900"
                    style={{ backgroundColor: value }}
                  />
                  <span className="sr-only">Cor {value}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </form>
      )}

      <div className="relative mt-8 max-w-md">
        <Search
          className="pointer-events-none absolute top-3.5 left-3.5 size-4 text-slate-400"
          aria-hidden="true"
        />
        <label htmlFor="board-search" className="sr-only">
          Buscar quadros
        </label>
        <input
          id="board-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="min-h-11 w-full rounded-xl border border-slate-300 bg-white pr-4 pl-10 outline-none focus:border-orange-500 focus:ring-3 focus:ring-orange-100"
          placeholder="Buscar por nome…"
        />
      </div>

      {boardsQuery.isLoading && (
        <div
          className="mt-12 flex items-center gap-3 text-sm font-semibold text-slate-600"
          role="status"
        >
          <RefreshCw className="size-5 animate-spin motion-reduce:animate-none" /> Carregando seus
          quadros…
        </div>
      )}
      {boardsQuery.isError && (
        <div className="mt-8">
          <Notice tone="error" title="Não foi possível carregar seus quadros">
            <p>{friendlyError(boardsQuery.error)}</p>
            <Button
              type="button"
              variant="secondary"
              className="mt-3"
              onClick={() => void boardsQuery.refetch()}
            >
              Tentar novamente
            </Button>
          </Notice>
        </div>
      )}

      {!boardsQuery.isLoading && !boardsQuery.isError && boards.length === 0 && (
        <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-orange-100 text-orange-700">
            <FolderKanban className="size-7" aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-xl font-extrabold">
            {query ? 'Nenhum quadro encontrado' : 'Seu primeiro quadro está a um clique'}
          </h2>
          <p className="mx-auto mt-2 max-w-md leading-7 text-slate-600">
            {query
              ? 'Tente outro termo ou limpe a busca.'
              : 'Ao criar sua conta, o Kamba prepara um quadro de exemplo só para você. Crie outros quando quiser.'}
          </p>
          {query ? (
            <Button type="button" variant="secondary" className="mt-5" onClick={() => setQuery('')}>
              Limpar busca
            </Button>
          ) : (
            <Button
              type="button"
              className="mt-5"
              onClick={() => setCreating(true)}
              disabled={!configured}
            >
              <Plus className="size-4" /> Criar quadro
            </Button>
          )}
        </div>
      )}

      {boards.length > 0 && (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board) => (
            <li
              key={board.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Link
                to={`/app/quadros/${board.id}`}
                className="block min-h-44 p-5 focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-orange-500"
              >
                <span
                  className="block h-2 w-16 rounded-full"
                  style={{ backgroundColor: board.color }}
                />
                <h2 className="mt-8 pr-8 text-xl font-extrabold tracking-tight">{board.title}</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Atualizado{' '}
                  {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(
                    new Date(board.updated_at),
                  )}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-orange-700">
                  Abrir quadro <ArrowRight className="size-4" />
                </span>
              </Link>
              <details className="absolute top-3 right-3">
                <summary
                  className="grid size-11 cursor-pointer list-none place-items-center rounded-xl text-slate-500 hover:bg-slate-100 focus-visible:outline-3 focus-visible:outline-orange-500"
                  aria-label={`Ações do quadro ${board.title}`}
                >
                  <MoreHorizontal className="size-5" aria-hidden="true" />
                </summary>
                <div className="absolute top-11 right-0 z-10 w-36 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                  <button
                    className="menu-button"
                    type="button"
                    onClick={() => void handleRename(board.id, board.title)}
                  >
                    Renomear
                  </button>
                  {board.owner_id === user?.id && (
                    <button
                      className="menu-button text-red-700"
                      type="button"
                      onClick={() => void handleDelete(board.id, board.title)}
                    >
                      Excluir
                    </button>
                  )}
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
