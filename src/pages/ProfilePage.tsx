import { zodResolver } from '@hookform/resolvers/zod';
import { UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../components/ui/Button';
import { InputField } from '../components/ui/Field';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { Notice } from '../components/ui/Notice';
import { useAuth } from '../hooks/useAuth';
import { useProfile, useUpdateProfile } from '../hooks/useKambaData';
import { friendlyError } from '../lib/errors';

const schema = z.object({
  name: z.string().trim().min(2, 'Digite pelo menos 2 caracteres.').max(80),
});

export function ProfilePage() {
  const { user } = useAuth();
  const profileQuery = useProfile(user?.id ?? '');
  const mutation = useUpdateProfile(user?.id ?? '');
  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (profileQuery.data) reset({ name: profileQuery.data.name });
  }, [profileQuery.data, reset]);

  if (profileQuery.isLoading) return <LoadingScreen label="Carregando seu perfil…" />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <p className="eyebrow">Sua conta</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Perfil</h1>
      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
          <span
            className="grid size-16 place-items-center rounded-2xl bg-orange-100 text-2xl font-black text-orange-800"
            aria-hidden="true"
          >
            {profileQuery.data?.name?.slice(0, 1).toUpperCase() || <UserRound className="size-7" />}
          </span>
          <div>
            <h2 className="text-xl font-extrabold">{profileQuery.data?.name ?? 'Seu perfil'}</h2>
            <p className="mt-1 text-sm text-slate-500">{profileQuery.data?.email ?? user?.email}</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {profileQuery.isError && (
            <Notice tone="error">{friendlyError(profileQuery.error)}</Notice>
          )}
          {message && <Notice tone={message.tone}>{message.text}</Notice>}
        </div>

        <form
          className="mt-6 space-y-5"
          onSubmit={handleSubmit(async ({ name }) => {
            setMessage(null);
            try {
              await mutation.mutateAsync(name);
              setMessage({ tone: 'success', text: 'Perfil atualizado.' });
            } catch (error) {
              setMessage({ tone: 'error', text: friendlyError(error) });
            }
          })}
        >
          <InputField
            id="profile-name"
            label="Nome de exibição"
            autoComplete="name"
            maxLength={80}
            error={errors.name?.message}
            {...register('name')}
          />
          <InputField
            id="profile-email"
            label="E-mail"
            value={profileQuery.data?.email ?? user?.email ?? ''}
            disabled
            help="O e-mail é gerenciado pela autenticação e não pode ser alterado nesta versão."
            readOnly
          />
          <Notice title="Avatar por iniciais">
            O Kamba usa suas iniciais nesta versão. Upload de imagem fica desativado até existir um
            bucket privado com políticas próprias no Supabase.
          </Notice>
          <Button type="submit" loading={isSubmitting || mutation.isPending}>
            Salvar alterações
          </Button>
        </form>
      </div>
    </div>
  );
}
