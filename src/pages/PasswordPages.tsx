import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { ConfigurationNotice } from '../components/ConfigurationNotice';
import { Logo } from '../components/Logo';
import { Button } from '../components/ui/Button';
import { InputField } from '../components/ui/Field';
import { Notice } from '../components/ui/Notice';
import { useAuth } from '../hooks/useAuth';

const emailSchema = z.object({ email: z.email('Digite um e-mail válido.') });
const passwordSchema = z
  .object({ password: z.string().min(8, 'Use pelo menos 8 caracteres.'), confirm: z.string() })
  .refine((values) => values.password === values.confirm, {
    message: 'As senhas não coincidem.',
    path: ['confirm'],
  });

function PasswordLayout({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-dvh place-items-center bg-[#fffaf5] px-5 py-10">
      <div className="w-full max-w-md">
        <Logo />
        <div className="mt-10 rounded-3xl border border-orange-950/10 bg-white p-6 shadow-xl shadow-orange-950/6 sm:p-8">
          <h1 className="text-3xl font-black tracking-tight">{title}</h1>
          <p className="mt-3 leading-7 text-slate-600">{text}</p>
          {children}
        </div>
        <p className="mt-6 text-center text-sm">
          <Link className="font-bold text-orange-700 hover:underline" to="/entrar">
            Voltar para entrar
          </Link>
        </p>
      </div>
    </main>
  );
}

export function RecoverPasswordPage() {
  const { configured, requestPasswordReset } = useAuth();
  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof emailSchema>>({ resolver: zodResolver(emailSchema) });

  return (
    <PasswordLayout
      title="Recupere seu acesso"
      text="Enviaremos um link seguro para você escolher uma nova senha."
    >
      <div className="mt-6 space-y-4">
        {!configured && <ConfigurationNotice />}
        {message && <Notice tone={message.tone}>{message.text}</Notice>}
      </div>
      <form
        className="mt-6 space-y-5"
        onSubmit={handleSubmit(async ({ email }) => {
          setMessage(null);
          try {
            await requestPasswordReset(email);
            setMessage({
              tone: 'success',
              text: 'Se a conta existir, enviaremos as instruções para esse e-mail.',
            });
          } catch (error) {
            setMessage({
              tone: 'error',
              text: error instanceof Error ? error.message : 'Não foi possível enviar o link.',
            });
          }
        })}
      >
        <InputField
          id="recovery-email"
          label="E-mail"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Button type="submit" loading={isSubmitting} disabled={!configured} className="w-full">
          Enviar link de recuperação
        </Button>
      </form>
    </PasswordLayout>
  );
}

export function UpdatePasswordPage() {
  const { configured, updatePassword } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof passwordSchema>>({ resolver: zodResolver(passwordSchema) });

  return (
    <PasswordLayout
      title="Defina uma nova senha"
      text="Escolha uma senha única com pelo menos oito caracteres."
    >
      <div className="mt-6 space-y-4">
        {!configured && <ConfigurationNotice />}
        {message && <Notice tone="error">{message}</Notice>}
      </div>
      <form
        className="mt-6 space-y-5"
        onSubmit={handleSubmit(async ({ password }) => {
          try {
            await updatePassword(password);
            navigate('/app', { replace: true });
          } catch (error) {
            setMessage(
              error instanceof Error ? error.message : 'Não foi possível atualizar a senha.',
            );
          }
        })}
      >
        <InputField
          id="new-password"
          label="Nova senha"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <InputField
          id="confirm-password"
          label="Confirme a senha"
          type="password"
          autoComplete="new-password"
          error={errors.confirm?.message}
          {...register('confirm')}
        />
        <Button type="submit" loading={isSubmitting} disabled={!configured} className="w-full">
          Salvar nova senha
        </Button>
      </form>
    </PasswordLayout>
  );
}
