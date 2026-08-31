import { LayoutDashboard, LogOut, UserRound } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

export function AppShell() {
  const { signOut } = useAuth();
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-bold transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${isActive ? 'bg-orange-100 text-orange-800' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`;

  return (
    <div className="min-h-dvh bg-[#f7f7f5] text-slate-950">
      <a href="#conteudo" className="skip-link">
        Ir para o conteúdo
      </a>
      <header className="sticky top-0 z-30 border-b border-slate-200/85 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-6">
          <Logo />
          <nav aria-label="Área do usuário" className="flex items-center gap-1">
            <NavLink to="/app" end className={navClass}>
              <LayoutDashboard className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Quadros</span>
            </NavLink>
            <NavLink to="/app/perfil" className={navClass}>
              <UserRound className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Perfil</span>
            </NavLink>
            <Button
              type="button"
              variant="ghost"
              className="px-3"
              onClick={() => void signOut()}
              aria-label="Sair da conta"
            >
              <LogOut className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </nav>
        </div>
      </header>
      <main id="conteudo">
        <Outlet />
      </main>
    </div>
  );
}
