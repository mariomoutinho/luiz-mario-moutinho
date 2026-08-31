import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { hasActiveFilters } from '../../lib/board';
import type { BoardFilters as Filters, BoardMember, Label } from '../../types/kamba';

type BoardFiltersProps = {
  filters: Filters;
  labels: Label[];
  members: BoardMember[];
  onChange: (filters: Filters) => void;
  onClear: () => void;
};

export function BoardFilters({ filters, labels, members, onChange, onClear }: BoardFiltersProps) {
  function change<Key extends keyof Filters>(key: Key, value: Filters[Key]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4"
      aria-label="Busca e filtros"
    >
      <div className="flex items-center gap-2 text-sm font-extrabold text-slate-700">
        <SlidersHorizontal className="size-4 text-orange-600" aria-hidden="true" /> Refine o quadro
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(220px,1.5fr)_repeat(4,minmax(140px,1fr))_auto]">
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-3.5 left-3.5 size-4 text-slate-400"
            aria-hidden="true"
          />
          <label htmlFor="card-search" className="sr-only">
            Buscar cartões
          </label>
          <input
            id="card-search"
            value={filters.query}
            onChange={(event) => change('query', event.target.value)}
            className="filter-field pl-10"
            placeholder="Título ou descrição…"
          />
        </div>
        <label className="sr-only" htmlFor="label-filter">
          Filtrar por etiqueta
        </label>
        <select
          id="label-filter"
          className="filter-field"
          value={filters.labelId}
          onChange={(event) => change('labelId', event.target.value)}
        >
          <option value="">Todas as etiquetas</option>
          {labels.map((label) => (
            <option value={label.id} key={label.id}>
              {label.name}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor="assignee-filter">
          Filtrar por responsável
        </label>
        <select
          id="assignee-filter"
          className="filter-field"
          value={filters.assigneeId}
          onChange={(event) => change('assigneeId', event.target.value)}
        >
          <option value="">Todos os responsáveis</option>
          {members.map((member) => (
            <option value={member.user_id} key={member.user_id}>
              {member.profile.name}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor="due-filter">
          Filtrar por prazo
        </label>
        <select
          id="due-filter"
          className="filter-field"
          value={filters.due}
          onChange={(event) => change('due', event.target.value as Filters['due'])}
        >
          <option value="all">Qualquer prazo</option>
          <option value="overdue">Atrasados</option>
          <option value="today">Vencem hoje</option>
          <option value="upcoming">Próximos</option>
          <option value="none">Sem prazo</option>
        </select>
        <label className="sr-only" htmlFor="status-filter">
          Filtrar por status
        </label>
        <select
          id="status-filter"
          className="filter-field"
          value={filters.status}
          onChange={(event) => change('status', event.target.value as Filters['status'])}
        >
          <option value="all">Todos os status</option>
          <option value="open">Em aberto</option>
          <option value="completed">Concluídos</option>
        </select>
        {hasActiveFilters(filters) && (
          <Button
            type="button"
            variant="ghost"
            className="min-h-11 whitespace-nowrap"
            onClick={onClear}
          >
            <X className="size-4" /> Limpar filtros
          </Button>
        )}
      </div>
    </section>
  );
}
