import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { ProtectedRoute } from './components/ProtectedRoute';

const AppShell = lazy(() =>
  import('./layouts/AppShell').then((module) => ({ default: module.AppShell })),
);
const AuthPage = lazy(() =>
  import('./pages/AuthPage').then((module) => ({ default: module.AuthPage })),
);
const BoardPage = lazy(() =>
  import('./pages/BoardPage').then((module) => ({ default: module.BoardPage })),
);
const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((module) => ({ default: module.DashboardPage })),
);
const LandingPage = lazy(() =>
  import('./pages/LandingPage').then((module) => ({ default: module.LandingPage })),
);
const LegalPage = lazy(() =>
  import('./pages/LegalPage').then((module) => ({ default: module.LegalPage })),
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
);
const ProfilePage = lazy(() =>
  import('./pages/ProfilePage').then((module) => ({ default: module.ProfilePage })),
);
const RecoverPasswordPage = lazy(() =>
  import('./pages/PasswordPages').then((module) => ({ default: module.RecoverPasswordPage })),
);
const UpdatePasswordPage = lazy(() =>
  import('./pages/PasswordPages').then((module) => ({ default: module.UpdatePasswordPage })),
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/entrar" element={<AuthPage mode="login" />} />
          <Route path="/cadastro" element={<AuthPage mode="signup" />} />
          <Route path="/recuperar-senha" element={<RecoverPasswordPage />} />
          <Route path="/atualizar-senha" element={<UpdatePasswordPage />} />
          <Route path="/privacidade" element={<LegalPage type="privacidade" />} />
          <Route path="/termos" element={<LegalPage type="termos" />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<AppShell />}>
              <Route index element={<DashboardPage />} />
              <Route path="perfil" element={<ProfilePage />} />
              <Route path="quadros/:boardId" element={<BoardPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
