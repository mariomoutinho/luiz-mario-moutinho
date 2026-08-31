import { zodResolver } from '@hookform/resolvers/zod';
import { CheckSquare2, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useEffectEvent, useRef } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { createPortal } from 'react-dom';
import { z } from 'zod';
import { Button } from '../../components/ui/Button';
import { InputField, TextareaField } from '../../components/ui/Field';
import { Notice } from '../../components/ui/Notice';
import type { BoardMember, Card, CardFormValues, Label } from '../../types/kamba';

const schema = z.object({
  title: z.string().trim().min(2, 'Digite pelo menos 2 caracteres.').max(160),
  description: z.string().max(5000, 'A descrição deve ter até 5.000 caracteres.'),
  dueDate: z.string(),
  assigneeId: z.string(),
  completed: z.boolean(),
  labelIds: z.array(z.string()),
  checklist: z.array(
    z.object({
      id: z.string().optional(),
      title: z.string().trim().min(1, 'Descreva o item.').max(240),
      completed: z.boolean(),
    }),
  ),
});

type CardModalProps = {
  card: Card;
  labels: Label[];
  members: BoardMember[];
  saving: boolean;
  error?: string | null;
  onClose: () => void;
  onSave: (values: CardFormValues) => Promise<void>;
  onDelete: () => Promise<void>;
};

const focusableSelector =
  'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

export function CardModal({
  card,
  labels,
  members,
  saving,
  error,
  onClose,
  onSave,
  onDelete,
}: CardModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const closeFromKeyboard = useEffectEvent(() => {
    if (!saving) onClose();
  });
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CardFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: card.title,
      description: card.description,
      dueDate: card.due_date ?? '',
      assigneeId: card.assignee_id ?? '',
      completed: card.completed,
      labelIds: card.labels.map((label) => label.id),
      checklist: card.checklist_items.map((item) => ({
        id: item.id,
        title: item.title,
        completed: item.completed,
      })),
    },
  });
  const checklist = useFieldArray({ control, name: 'checklist' });

  useEffect(() => {
    previousFocus.current = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const title = dialog?.querySelector<HTMLInputElement>('#card-title');
    title?.focus();
    document.body.classList.add('modal-open');

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeFromKeyboard();
        return;
      }
      if (event.key !== 'Tab' || !dialog) return;
      const elements = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector));
      if (!elements.length) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', onKeyDown);
      previousFocus.current?.focus();
    };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-[2px] sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target && !saving) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="card-dialog-title"
        aria-describedby="card-dialog-help"
        className="max-h-[94dvh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
          <div>
            <p className="text-xs font-extrabold tracking-wide text-orange-700 uppercase">
              Detalhes do cartão
            </p>
            <h2 id="card-dialog-title" className="mt-0.5 text-lg font-black">
              Edite sem perder o contexto
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="grid size-11 place-items-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-3 focus-visible:outline-orange-500"
            aria-label="Fechar detalhes do cartão"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <form className="p-5 sm:p-7" onSubmit={handleSubmit(onSave)} noValidate>
          <p id="card-dialog-help" className="mb-6 text-sm leading-6 text-slate-500">
            Use Tab para navegar entre os campos e Esc para fechar. As mudanças são salvas somente
            ao confirmar.
          </p>
          {error && (
            <div className="mb-6">
              <Notice tone="error">{error}</Notice>
            </div>
          )}
          <div className="space-y-6">
            <InputField
              id="card-title"
              label="Título"
              maxLength={160}
              error={errors.title?.message}
              {...register('title')}
            />
            <TextareaField
              id="card-description"
              label="Descrição"
              rows={5}
              maxLength={5000}
              placeholder="Contexto, critérios e informações úteis…"
              error={errors.description?.message}
              {...register('description')}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <InputField
                id="card-due-date"
                label="Data de entrega"
                type="date"
                {...register('dueDate')}
              />
              <div className="space-y-1.5">
                <label htmlFor="card-assignee" className="block text-sm font-bold text-slate-800">
                  Responsável
                </label>
                <select
                  id="card-assignee"
                  className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-base outline-none focus:border-orange-500 focus:ring-3 focus:ring-orange-100"
                  {...register('assigneeId')}
                >
                  <option value="">Sem responsável</option>
                  {members.map((member) => (
                    <option key={member.user_id} value={member.user_id}>
                      {member.profile.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold">
              <input
                type="checkbox"
                className="size-5 rounded accent-orange-600"
                {...register('completed')}
              />
              Marcar este cartão como concluído
            </label>

            <fieldset>
              <legend className="text-sm font-bold text-slate-800">Etiquetas</legend>
              <p className="mt-1 text-xs text-slate-500">
                Selecione quantas forem úteis. O texto acompanha a cor.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {labels.map((label) => (
                  <label key={label.id} className="cursor-pointer">
                    <input
                      className="peer sr-only"
                      type="checkbox"
                      value={label.id}
                      {...register('labelIds')}
                    />
                    <span className="inline-flex min-h-10 items-center gap-2 rounded-full border-2 border-transparent bg-slate-100 px-3 text-sm font-bold text-slate-700 outline-offset-2 peer-focus-visible:outline-3 peer-focus-visible:outline-orange-500 peer-checked:border-slate-950 peer-checked:bg-white">
                      <span
                        className="size-3 rounded-full"
                        style={{ backgroundColor: label.color }}
                        aria-hidden="true"
                      />
                      {label.name}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="sr-only">Checklist</legend>
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <CheckSquare2 className="size-4" /> Checklist
                </span>
                <Button
                  type="button"
                  variant="secondary"
                  className="min-h-10 px-3 py-2"
                  onClick={() => checklist.append({ title: '', completed: false })}
                >
                  <Plus className="size-4" /> Adicionar item
                </Button>
              </div>
              {checklist.fields.length === 0 ? (
                <p className="mt-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                  Nenhum item. Use “Adicionar item” para dividir a tarefa.
                </p>
              ) : (
                <div className="mt-3 space-y-3">
                  {checklist.fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-[auto_1fr_auto] items-start gap-2"
                    >
                      <label
                        className="grid size-11 place-items-center"
                        aria-label={`Concluir item ${index + 1}`}
                      >
                        <input
                          type="checkbox"
                          className="size-5 accent-orange-600"
                          {...register(`checklist.${index}.completed`)}
                        />
                      </label>
                      <div>
                        <input
                          className="min-h-11 w-full rounded-xl border border-slate-300 px-3 outline-none focus:border-orange-500 focus:ring-3 focus:ring-orange-100"
                          aria-label={`Item ${index + 1} do checklist`}
                          {...register(`checklist.${index}.title`)}
                        />
                        {errors.checklist?.[index]?.title && (
                          <p className="mt-1 text-sm text-red-700" role="alert">
                            {errors.checklist[index]?.title?.message}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => checklist.remove(index)}
                        className="grid size-11 place-items-center rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-700 focus-visible:outline-3 focus-visible:outline-orange-500"
                        aria-label={`Remover item ${index + 1}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </fieldset>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              className="text-red-700 hover:bg-red-50"
              disabled={saving}
              onClick={() => {
                if (window.confirm(`Excluir “${card.title}”? Esta ação não pode ser desfeita.`))
                  void onDelete();
              }}
            >
              <Trash2 className="size-4" /> Excluir cartão
            </Button>
            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <Button type="button" variant="secondary" disabled={saving} onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" loading={saving}>
                Salvar alterações
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
