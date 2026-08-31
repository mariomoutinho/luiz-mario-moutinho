import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Search } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { ConfigurationNotice } from '../components/ConfigurationNotice';
import { Logo } from '../components/Logo';
import { Button } from '../components/ui/Button';
import { InputField } from '../components/ui/Field';
import { Notice } from '../components/ui/Notice';
import { useAuth } from '../hooks/useAuth';

const schema = z.object({
  name: z.string().trim(),
  email: z.email('Digite um e-mail válido.'),
  password: z.string().min(8, 'Use pelo menos 8 caracteres.'),
});

const signupSchema = schema.extend({
  name: z.string().trim().min(2, 'Digite seu nome com pelo menos 2 caracteres.').max(80),
});

type FormValues = z.infer<typeof schema>;

export function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
  const { configured, signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(mode === 'signup' ? signupSchema : schema),
    defaultValues: { name: '', email: '', password: '' },
  });

  if (user) return <Navigate to="/app" replace />;

  const submit = handleSubmit(async (values) => {
    setMessage(null);
    try {
      if (mode === 'login') {
        await signIn(values.email, values.password);
        const from = (location.state as { from?: string } | null)?.from ?? '/app';
        navigate(from, { replace: true });
      } else {
        const hasSession = await signUp(values.name, values.email, values.password);
        if (hasSession) navigate('/app', { replace: true });
        else
          setMessage({
            tone: 'success',
            text: 'Conta criada. Confira seu e-mail para confirmar o acesso.',
          });
      }
    } catch (error) {
      setMessage({
        tone: 'error',
        text: error instanceof Error ? error.message : 'Não foi possível continuar.',
      });
    }
  });

  return (
    <main className="grid min-h-dvh bg-[#fffaf5] lg:grid-cols-[0.9fr_1.1fr]">
      <section className="flex min-w-0 flex-col px-5 py-6 sm:px-10 lg:px-14 lg:py-10">
        <div className="flex items-center justify-between">
          <Logo />
          <Link
            className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-bold text-slate-600 hover:text-slate-950 focus-visible:outline-3 focus-visible:outline-orange-500"
            to="/"
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> Voltar
          </Link>
        </div>
        <div className="mx-auto my-auto w-full max-w-md py-12">
          <p className="eyebrow">
            {mode === 'login' ? 'Boas-vindas de volta' : 'Seu espaço começa aqui'}
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            {mode === 'login' ? 'Entre no Kamba.' : 'Crie sua conta.'}
          </h1>
          <p className="mt-4 leading-7 text-slate-600">
            {mode === 'login'
              ? 'Retome seus quadros e continue de onde parou.'
              : 'A versão atual é gratuita e não exige cartão.'}
          </p>

          <div className="mt-7 space-y-4">
            {!configured && <ConfigurationNotice />}
            {message && <Notice tone={message.tone}>{message.text}</Notice>}
          </div>

          <form className="mt-7 space-y-5" onSubmit={submit} noValidate>
            {mode === 'signup' && (
              <InputField
                id="name"
                label="Seu nome"
                autoComplete="name"
                placeholder="Como devemos chamar você?"
                error={errors.name?.message}
                {...register('name')}
              />
            )}
            <InputField
              id="email"
              label="E-mail"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="voce@exemplo.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <div className="relative">
              <InputField
                id="password"
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                placeholder="Mínimo de 8 caracteres"
                className="pr-12"
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute top-8 right-1 grid size-11 place-items-center rounded-lg text-slate-500 hover:text-slate-950 focus-visible:outline-3 focus-visible:outline-orange-500"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
            {mode === 'login' && (
              <div className="text-right">
                <Link
                  className="text-sm font-bold text-orange-700 underline-offset-4 hover:underline"
                  to="/recuperar-senha"
                >
                  Esqueci minha senha
                </Link>
              </div>
            )}
            <Button type="submit" loading={isSubmitting} disabled={!configured} className="w-full">
              {mode === 'login' ? 'Entrar' : 'Criar conta'}{' '}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-600">
            {mode === 'login' ? 'Ainda não tem conta?' : 'Já tem uma conta?'}{' '}
            <Link
              className="font-extrabold text-orange-700 underline-offset-4 hover:underline"
              to={mode === 'login' ? '/cadastro' : '/entrar'}
            >
              {mode === 'login' ? 'Criar conta' : 'Entrar'}
            </Link>
          </p>
        </div>
      </section>
      <aside
        className="auth-panel hidden p-10 lg:flex lg:flex-col lg:justify-between"
        aria-label="Sobre o Kamba"
      >
        <p className="max-w-sm text-sm leading-6 font-semibold text-orange-950/70">
          “Clareza não é ter menos trabalho. É saber qual trabalho merece atenção agora.”
        </p>
        <div className="max-w-xl">
          <Search className="size-10 text-orange-800" aria-hidden="true" />
          <h2 className="mt-6 text-5xl leading-tight font-black tracking-tight text-orange-950">
            Encontre contexto antes que ele vire ruído.
          </h2>
          <p className="mt-5 text-lg leading-8 text-orange-950/70">
            Busque, filtre e mova tarefas em um espaço criado para decisões rápidas e trabalho
            compartilhado.
          </p>
        </div>
      </aside>
    </main>
  );
}
