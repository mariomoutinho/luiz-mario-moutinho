import { Link } from 'react-router-dom';

type LogoProps = {
  compact?: boolean;
  to?: string;
};

export function Logo({ compact = false, to = '/' }: LogoProps) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 rounded-lg focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-orange-500"
      aria-label="Kamba — início"
    >
      <span
        className="grid size-10 grid-cols-2 gap-1 rounded-[13px] bg-orange-500 p-2 shadow-sm"
        aria-hidden="true"
      >
        <span className="row-span-2 rounded-sm bg-orange-50" />
        <span className="rounded-sm bg-orange-200" />
        <span className="rounded-sm bg-white" />
      </span>
      {!compact && <span className="font-logo text-3xl leading-none text-slate-950">Kamba</span>}
    </Link>
  );
}
