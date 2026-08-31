import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';

export function NotFoundPage() {
  return (
    <main className="grid min-h-dvh place-items-center bg-[#fffaf5] px-5 text-center">
      <div>
        <Logo />
        <p className="mt-10 text-sm font-black tracking-[0.2em] text-orange-700 uppercase">
          Erro 404
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Esta página saiu do quadro.</h1>
        <p className="mx-auto mt-4 max-w-md leading-7 text-slate-600">
          O endereço pode estar incorreto ou o conteúdo foi removido.
        </p>
        <Link className="button-link button-link--primary mt-8" to="/">
          <ArrowLeft className="size-4" /> Voltar ao início
        </Link>
      </div>
    </main>
  );
}
