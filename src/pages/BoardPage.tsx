import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Edit3, Plus, RefreshCw, UserPlus, UsersRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { InputField } from '../components/ui/Field';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { Notice } from '../components/ui/Notice';
import { BoardFilters } from '../features/board/BoardFilters';
import { CardModal } from '../features/board/CardModal';
import { KanbanBoard } from '../features/board/KanbanBoard';
import { useAuth } from '../hooks/useAuth';
import { queryKeys, useBoard } from '../hooks/useKambaData';
import {
  addBoardMember,
  createCard,
  createColumn,
  deleteCard,
  deleteColumn,
  renameBoard,
  renameColumn,
  reorderCards,
  reorderColumns,
  saveCard,
} from '../lib/api';
import { hasActiveFilters, nextPosition } from '../lib/board';
import { friendlyError } from '../lib/errors';
import type { BoardColumn, BoardDetail, Card, CardFormValues } from '../types/kamba';
import { emptyBoardFilters } from '../types/kamba';

export function BoardPage() {
  const { boardId = '' } = useParams();
  const { user } = useAuth();
  const boardQuery = useBoard(boardId);
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState(emptyBoardFilters);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [addingColumn, setAddingColumn] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [savingCard, setSavingCard] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    tone: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  const detail = boardQuery.data;
  const isOwner = detail?.board.owner_id === user?.id;
  const filtered = hasActiveFilters(filters);

  function refresh() {
    return queryClient.invalidateQueries({ queryKey: queryKeys.board(boardId) });
  }

  async function action(work: () => Promise<unknown>, success: string) {
    setMessage(null);
    try {
      await work();
      await refresh();
      setMessage({ tone: 'success', text: success });
      return true;
    } catch (error) {
      setMessage({ tone: 'error', text: friendlyError(error) });
      return false;
    }
  }

  async function handleCreateColumn(event: React.FormEvent) {
    event.preventDefault();
    if (!detail || newColumnTitle.trim().length < 2) return;
    const created = await action(
      () => createColumn(boardId, newColumnTitle, nextPosition(detail.columns)),
      'Coluna criada.',
    );
    if (created) {
      setNewColumnTitle('');
      setAddingColumn(false);
    }
  }

  async function handleRenameColumn(column: BoardColumn) {
    const title = window.prompt('Novo título da coluna:', column.title)?.trim();
    if (!title || title === column.title) return;
    await action(() => renameColumn(column.id, title), 'Coluna renomeada.');
  }

  async function handleDeleteColumn(column: BoardColumn) {
    if (
      !window.confirm(
        `Excluir “${column.title}” e seus ${column.cards.length} cartão(ões)? Esta ação não pode ser desfeita.`,
      )
    )
      return;
    await action(() => deleteColumn(column.id), 'Coluna excluída.');
  }

  async function handleCreateCard(columnId: string, title: string) {
    if (!detail) return;
    const column = detail.columns.find((item) => item.id === columnId);
    try {
      const card = await createCard(boardId, columnId, title, nextPosition(column?.cards ?? []));
      await refresh();
      setModalError(null);
      setSelectedCard(card);
      setMessage({ tone: 'success', text: 'Cartão criado. Complete os detalhes quando quiser.' });
    } catch (error) {
      setMessage({ tone: 'error', text: friendlyError(error) });
      throw error;
    }
  }

  async function optimisticReorder(next: BoardDetail, persist: () => Promise<void>) {
    const previous = queryClient.getQueryData<BoardDetail>(queryKeys.board(boardId));
    queryClient.setQueryData(queryKeys.board(boardId), next);
    setMessage(null);
    try {
      await persist();
      setMessage({ tone: 'success', text: 'Nova ordem salva.' });
    } catch (error) {
      queryClient.setQueryData(queryKeys.board(boardId), previous);
      setMessage({
        tone: 'error',
        text: `${friendlyError(error)} A ordem anterior foi restaurada.`,
      });
    }
  }

  if (boardQuery.isLoading) return <LoadingScreen label="Abrindo o quadro…" />;

  if (boardQuery.isError || !detail) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <Notice tone="error" title="Quadro indisponível">
          <p>{friendlyError(boardQuery.error)}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button type="button" variant="secondary" onClick={() => void boardQuery.refetch()}>
              <RefreshCw className="size-4" /> Tentar novamente
            </Button>
            <Link className="button-link button-link--secondary" to="/app">
              Voltar aos quadros
            </Link>
          </div>
        </Notice>
      </div>
    );
  }

  return (
    <div className="min-w-0 px-3 py-5 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-[1800px]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <Link
              to="/app"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-950 focus-visible:outline-3 focus-visible:outline-orange-500"
            >
              <ArrowLeft className="size-4" /> Todos os quadros
            </Link>
            <div className="mt-2 flex items-center gap-3">
              <span
                className="block h-10 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: detail.board.color }}
                aria-hidden="true"
              />
              <h1 className="min-w-0 truncate text-2xl font-black tracking-tight sm:text-3xl">
                {detail.board.title}
              </h1>
              {isOwner && (
                <button
                  type="button"
                  className="grid size-10 shrink-0 place-items-center rounded-xl text-slate-500 hover:bg-white hover:text-slate-950 focus-visible:outline-3 focus-visible:outline-orange-500"
                  aria-label="Renomear quadro"
                  onClick={() => {
                    const title = window.prompt('Novo nome do quadro:', detail.board.title)?.trim();
                    if (title && title !== detail.board.title)
                      void action(() => renameBoard(boardId, title), 'Quadro renomeado.');
                  }}
                >
                  <Edit3 className="size-4" />
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2"
              aria-label={`${detail.members.length} membros no quadro`}
            >
              <UsersRound className="size-4 text-slate-500" />
              <div className="flex -space-x-2">
                {detail.members.slice(0, 4).map((member) => (
                  <span
                    key={member.user_id}
                    className="grid size-8 place-items-center rounded-full border-2 border-white bg-orange-100 text-[10px] font-black text-orange-800"
                    title={member.profile.name}
                  >
                    {member.profile.name.slice(0, 2).toUpperCase()}
                  </span>
                ))}
              </div>
              <span className="text-xs font-bold text-slate-600">{detail.members.length}</span>
            </div>
            {isOwner && (
              <details className="relative">
                <summary className="button-link button-link--secondary cursor-pointer list-none">
                  <UserPlus className="size-4" /> Convidar
                </summary>
                <form
                  className="absolute top-13 right-0 z-30 w-[min(90vw,340px)] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl"
                  onSubmit={async (event) => {
                    event.preventDefault();
                    if (!inviteEmail.trim()) return;
                    setInviting(true);
                    try {
                      const added = await action(
                        () => addBoardMember(boardId, inviteEmail),
                        'Membro adicionado ao quadro.',
                      );
                      if (added) setInviteEmail('');
                    } finally {
                      setInviting(false);
                    }
                  }}
                >
                  <h2 className="text-sm font-extrabold">Adicionar membro</h2>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    A pessoa precisa já ter uma conta Kamba.
                  </p>
                  <div className="mt-3">
                    <InputField
                      id="member-email"
                      label="E-mail"
                      type="email"
                      value={inviteEmail}
                      onChange={(event) => setInviteEmail(event.target.value)}
                    />
                  </div>
                  <Button type="submit" className="mt-3 w-full" loading={inviting}>
                    Adicionar ao quadro
                  </Button>
                </form>
              </details>
            )}
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {message && <Notice tone={message.tone}>{message.text}</Notice>}
          {filtered && (
            <Notice tone="info">
              O arrastar e soltar fica pausado enquanto há filtros ativos, evitando uma ordem
              ambígua. Limpe os filtros para reorganizar.
            </Notice>
          )}
          <BoardFilters
            filters={filters}
            labels={detail.labels}
            members={detail.members}
            onChange={setFilters}
            onClear={() => setFilters(emptyBoardFilters)}
          />
        </div>

        <div className="mt-4">
          {detail.columns.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <h2 className="text-xl font-extrabold">Este quadro ainda não tem colunas</h2>
              <p className="mt-2 text-slate-600">Crie a primeira etapa do fluxo para começar.</p>
              <Button type="button" className="mt-5" onClick={() => setAddingColumn(true)}>
                <Plus className="size-4" /> Criar coluna
              </Button>
            </div>
          ) : (
            <KanbanBoard
              detail={detail}
              filters={filters}
              dragDisabled={filtered}
              onOpenCard={(card) => {
                setModalError(null);
                setSelectedCard(card);
              }}
              onCreateCard={handleCreateCard}
              onRenameColumn={handleRenameColumn}
              onDeleteColumn={handleDeleteColumn}
              onReorderColumns={(next) =>
                optimisticReorder(next, () =>
                  reorderColumns(
                    boardId,
                    next.columns.map((column) => column.id),
                  ),
                )
              }
              onReorderCards={(next) => optimisticReorder(next, () => reorderCards(next))}
            />
          )}

          {addingColumn ? (
            <form
              className="mt-3 flex max-w-md flex-col gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4 sm:flex-row sm:items-end"
              onSubmit={handleCreateColumn}
            >
              <div className="flex-1">
                <InputField
                  id="new-column-title"
                  label="Título da nova coluna"
                  value={newColumnTitle}
                  onChange={(event) => setNewColumnTitle(event.target.value)}
                  autoFocus
                  maxLength={80}
                />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="secondary" onClick={() => setAddingColumn(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Criar</Button>
              </div>
            </form>
          ) : (
            detail.columns.length > 0 && (
              <Button
                type="button"
                variant="secondary"
                className="mt-3"
                onClick={() => setAddingColumn(true)}
              >
                <Plus className="size-4" /> Adicionar coluna
              </Button>
            )
          )}
        </div>
      </div>

      {selectedCard && (
        <CardModal
          card={selectedCard}
          labels={detail.labels}
          members={detail.members}
          saving={savingCard}
          error={modalError}
          onClose={() => {
            setModalError(null);
            setSelectedCard(null);
          }}
          onSave={async (values: CardFormValues) => {
            setSavingCard(true);
            setModalError(null);
            try {
              await saveCard(selectedCard, values);
              await refresh();
              setSelectedCard(null);
              setMessage({ tone: 'success', text: 'Cartão atualizado.' });
            } catch (error) {
              setModalError(friendlyError(error));
            } finally {
              setSavingCard(false);
            }
          }}
          onDelete={async () => {
            setSavingCard(true);
            setModalError(null);
            try {
              await deleteCard(selectedCard.id);
              await refresh();
              setSelectedCard(null);
              setMessage({ tone: 'success', text: 'Cartão excluído.' });
            } catch (error) {
              setModalError(friendlyError(error));
            } finally {
              setSavingCard(false);
            }
          }}
        />
      )}
    </div>
  );
}
