import { Notice } from './ui/Notice';

export function ConfigurationNotice() {
  return (
    <Notice tone="info" title="Conecte o Supabase para usar sua conta">
      Copie <code>.env.example</code> para <code>.env.local</code>, preencha a URL e a chave pública
      do projeto e aplique as migrations. Nenhuma senha é armazenada pelo Kamba.
    </Notice>
  );
}
