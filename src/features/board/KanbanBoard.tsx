import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  CalendarDays,
  CheckCircle2,
  CheckSquare2,
  GripVertical,
  MoreHorizontal,
  Plus,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { filterCards, moveCardLocally } from '../../lib/board';
import type { BoardColumn, BoardDetail, BoardFilters, Card } from '../../types/kamba';

type KanbanBoardProps = {
  detail: BoardDetail;
  filters: BoardFilters;
  dragDisabled: boolean;
  onOpenCard: (card: Card) => void;
  onCreateCard: (columnId: string, title: string) => Promise<void>;
  onRenameColumn: (column: BoardColumn) => Promise<void>;
  onDeleteColumn: (column: BoardColumn) => Promise<void>;
  onReorderColumns: (detail: BoardDetail) => Promise<void>;
  onReorderCards: (detail: BoardDetail) => Promise<void>;
};

function SortableCard({
  card,
  disabled,
  onOpen,
}: {
  card: Card;
  disabled: boolean;
  onOpen: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `card:${card.id}`,
    data: { type: 'card', cardId: card.id, columnId: card.column_id },
    disabled,
  });
  const checklistDone = card.checklist_items.filter((item) => item.completed).length;
  const assigneeInitial = card.assignee_id?.slice(0, 1).toUpperCase();
  const dueLabel = card.due_date
    ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(
        new Date(`${card.due_date}T00:00:00`),
      )
    : null;

  return (
    <article
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`group rounded-xl border bg-white p-3 shadow-sm transition ${isDragging ? 'z-20 rotate-2 border-orange-300 opacity-70 shadow-xl' : 'border-slate-200 hover:border-orange-200 hover:shadow-md'}`}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          className="grid size-8 shrink-0 cursor-grab place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-3 focus-visible:outline-orange-500 disabled:cursor-default disabled:opacity-35"
          aria-label={`Arrastar cartão ${card.title}`}
          disabled={disabled}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onOpen}
          className="min-w-0 flex-1 rounded-lg text-left focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
        >
          {card.labels.length > 0 && (
            <span className="mb-2 flex flex-wrap gap-1.5">
              {card.labels.map((label) => (
                <span
                  key={label.id}
                  className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-extrabold text-slate-700"
                >
                  <span className="size-2 rounded-full" style={{ backgroundColor: label.color }} />
                  {label.name}
                </span>
              ))}
            </span>
          )}
          <span
            className={`block text-sm leading-5 font-bold ${card.completed ? 'text-slate-500 line-through' : 'text-slate-900'}`}
          >
            {card.title}
          </span>
          <span className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-500">
            {dueLabel && (
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-1">
                <CalendarDays className="size-3" />
                {dueLabel}
              </span>
            )}
            {card.checklist_items.length > 0 && (
              <span className="inline-flex items-center gap-1">
                <CheckSquare2 className="size-3" />
                {checklistDone}/{card.checklist_items.length}
              </span>
            )}
            {card.completed && (
              <span className="inline-flex items-center gap-1 text-emerald-700">
                <CheckCircle2 className="size-3" />
                Concluído
              </span>
            )}
            {assigneeInitial && (
              <span
                className="ml-auto grid size-6 place-items-center rounded-full bg-orange-100 text-[9px] font-black text-orange-800"
                aria-label="Cartão com responsável"
              >
                {assigneeInitial}
              </span>
            )}
          </span>
        </button>
      </div>
    </article>
  );
}

function SortableColumn({
  column,
  filters,
  dragDisabled,
  ...props
}: {
  column: BoardColumn;
  filters: BoardFilters;
  dragDisabled: boolean;
  onOpenCard: (card: Card) => void;
  onCreateCard: (title: string) => Promise<void>;
  onRename: () => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `column:${column.id}`,
    data: { type: 'column', columnId: column.id },
    disabled: dragDisabled,
  });
  const visibleCards = filterCards(column.cards, filters);

  return (
    <section
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`w-[86vw] max-w-[340px] shrink-0 self-start rounded-2xl border border-slate-200 bg-slate-100 p-2.5 sm:w-[310px] ${isDragging ? 'z-20 rotate-1 opacity-70 shadow-2xl' : ''}`}
      aria-labelledby={`column-${column.id}`}
    >
      <div className="flex min-h-11 items-center gap-1 px-1.5">
        <button
          type="button"
          className="grid size-9 cursor-grab place-items-center rounded-lg text-slate-400 hover:bg-white hover:text-slate-700 focus-visible:outline-3 focus-visible:outline-orange-500 disabled:cursor-default disabled:opacity-35"
          aria-label={`Arrastar coluna ${column.title}`}
          disabled={dragDisabled}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
        <h2 id={`column-${column.id}`} className="min-w-0 flex-1 truncate text-sm font-extrabold">
          {column.title}
        </h2>
        <span
          className="rounded-full bg-white px-2 py-1 text-[10px] font-extrabold text-slate-500"
          aria-label={`${visibleCards.length} cartões`}
        >
          {visibleCards.length}
        </span>
        <details className="relative">
          <summary
            className="grid size-9 cursor-pointer list-none place-items-center rounded-lg text-slate-500 hover:bg-white focus-visible:outline-3 focus-visible:outline-orange-500"
            aria-label={`Ações da coluna ${column.title}`}
          >
            <MoreHorizontal className="size-4" />
          </summary>
          <div className="absolute top-9 right-0 z-20 w-36 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
            <button type="button" className="menu-button" onClick={() => void props.onRename()}>
              Renomear
            </button>
            <button
              type="button"
              className="menu-button text-red-700"
              onClick={() => void props.onDelete()}
            >
              Excluir
            </button>
          </div>
        </details>
      </div>

      <SortableContext
        items={visibleCards.map((card) => `card:${card.id}`)}
        strategy={verticalListSortingStrategy}
      >
        <div className="mt-1 space-y-2" role="list" aria-label={`Cartões em ${column.title}`}>
          {visibleCards.map((card) => (
            <SortableCard
              key={card.id}
              card={card}
              disabled={dragDisabled}
              onOpen={() => props.onOpenCard(card)}
            />
          ))}
          {visibleCards.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 px-3 py-6 text-center text-xs leading-5 text-slate-500">
              {column.cards.length
                ? 'Nenhum cartão corresponde aos filtros.'
                : 'Sem cartões por aqui. Adicione o próximo passo.'}
            </div>
          )}
        </div>
      </SortableContext>

      {adding ? (
        <form
          className="mt-2 rounded-xl bg-white p-2"
          onSubmit={async (event) => {
            event.preventDefault();
            if (!title.trim()) return;
            setSaving(true);
            try {
              await props.onCreateCard(title);
              setTitle('');
              setAdding(false);
            } finally {
              setSaving(false);
            }
          }}
        >
          <label htmlFor={`new-card-${column.id}`} className="sr-only">
            Título do novo cartão
          </label>
          <textarea
            id={`new-card-${column.id}`}
            autoFocus
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            rows={3}
            maxLength={160}
            className="w-full resize-none rounded-lg border border-slate-300 p-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            placeholder="O que precisa ser feito?"
          />
          <div className="mt-2 flex gap-2">
            <Button type="submit" className="min-h-9 px-3 py-1.5" loading={saving}>
              Adicionar
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="min-h-9 px-3 py-1.5"
              onClick={() => setAdding(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      ) : (
        <Button
          type="button"
          variant="ghost"
          className="mt-2 w-full justify-start text-slate-600"
          onClick={() => setAdding(true)}
        >
          <Plus className="size-4" /> Adicionar cartão
        </Button>
      )}
    </section>
  );
}

export function KanbanBoard({
  detail,
  filters,
  dragDisabled,
  onOpenCard,
  onCreateCard,
  onRenameColumn,
  onDeleteColumn,
  onReorderColumns,
  onReorderCards,
}: KanbanBoardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const activeData = active.data.current;
    const overData = over.data.current;
    if (activeData?.type === 'column' && overData?.type === 'column') {
      const from = detail.columns.findIndex((column) => column.id === activeData.columnId);
      const to = detail.columns.findIndex((column) => column.id === overData.columnId);
      if (from < 0 || to < 0) return;
      const next = {
        ...detail,
        columns: arrayMove(detail.columns, from, to).map((column, index) => ({
          ...column,
          position: (index + 1) * 1024,
        })),
      };
      await onReorderColumns(next);
      return;
    }
    if (activeData?.type === 'card') {
      const targetColumnId =
        overData?.type === 'card'
          ? String(overData.columnId)
          : overData?.type === 'column'
            ? String(overData.columnId)
            : '';
      if (!targetColumnId) return;
      const targetColumn = detail.columns.find((column) => column.id === targetColumnId);
      if (!targetColumn) return;
      const targetIndex =
        overData?.type === 'card'
          ? targetColumn.cards.findIndex((card) => card.id === overData.cardId)
          : targetColumn.cards.length;
      await onReorderCards(
        moveCardLocally(detail, String(activeData.cardId), targetColumnId, targetIndex),
      );
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={(event) => void handleDragEnd(event)}
    >
      <SortableContext
        items={detail.columns.map((column) => `column:${column.id}`)}
        strategy={horizontalListSortingStrategy}
      >
        <div
          className="board-scroll flex min-h-[calc(100dvh-22rem)] gap-3 overflow-x-auto pb-5"
          aria-label="Colunas do quadro"
        >
          {detail.columns.map((column) => (
            <SortableColumn
              key={column.id}
              column={column}
              filters={filters}
              dragDisabled={dragDisabled}
              onOpenCard={onOpenCard}
              onCreateCard={(title) => onCreateCard(column.id, title)}
              onRename={() => onRenameColumn(column)}
              onDelete={() => onDeleteColumn(column)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
