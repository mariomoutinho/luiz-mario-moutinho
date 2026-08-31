import { Logo } from '../Logo';

export function LoadingScreen({ label = 'Carregando o Kamba…' }: { label?: string }) {
  return (
    <div className="grid min-h-dvh place-items-center bg-orange-50 px-5" role="status">
      <div className="flex flex-col items-center gap-5 text-center">
        <Logo />
        <span className="size-7 animate-spin rounded-full border-3 border-orange-200 border-t-orange-600 motion-reduce:animate-none" />
        <p className="text-sm font-semibold text-slate-600">{label}</p>
      </div>
    </div>
  );
}
