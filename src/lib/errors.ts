const knownMessages: Array<[RegExp, string]> = [
  [/invalid login credentials/i, 'E-mail ou senha incorretos. Revise os dados e tente novamente.'],
  [/email not confirmed/i, 'Confirme seu e-mail antes de entrar.'],
  [/user already registered/i, 'Já existe uma conta com este e-mail.'],
  [/password should be at least/i, 'A senha não atende ao tamanho mínimo exigido.'],
  [
    /failed to fetch|network|load failed/i,
    'Sem conexão. Verifique sua internet e tente novamente.',
  ],
  [
    /row-level security|permission denied|not authorized/i,
    'Você não tem permissão para esta ação.',
  ],
  [/not found|no rows/i, 'Este conteúdo não existe mais ou foi removido.'],
];

export function friendlyError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    knownMessages.find(([pattern]) => pattern.test(message))?.[1] ??
    'Não foi possível concluir a ação. Seus dados foram preservados; tente novamente.'
  );
}
