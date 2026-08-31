import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { boardDetail, card, label } from '../../test/fixtures';
import { CardModal } from './CardModal';

describe('CardModal', () => {
  it('abre com foco no título, fecha com Esc e devolve o foco', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const opener = document.createElement('button');
    opener.textContent = 'Abrir';
    document.body.append(opener);
    opener.focus();

    render(
      <CardModal
        card={card}
        labels={[label]}
        members={boardDetail.members}
        saving={false}
        onClose={onClose}
        onSave={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    await waitFor(() => expect(screen.getByLabelText('Título')).toHaveFocus());
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('mantém o foco dentro do diálogo ao navegar com Tab', async () => {
    const user = userEvent.setup();
    render(
      <CardModal
        card={card}
        labels={[label]}
        members={boardDetail.members}
        saving={false}
        onClose={vi.fn()}
        onSave={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    const dialog = screen.getByRole('dialog');
    await waitFor(() => expect(screen.getByLabelText('Título')).toHaveFocus());
    for (let index = 0; index < 20; index += 1) await user.tab();
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
  });

  it('envia título e detalhes editados', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(
      <CardModal
        card={card}
        labels={[label]}
        members={boardDetail.members}
        saving={false}
        onClose={vi.fn()}
        onSave={onSave}
        onDelete={vi.fn()}
      />,
    );

    const title = screen.getByLabelText('Título');
    await user.clear(title);
    await user.type(title, 'Apresentar resultados');
    await user.click(screen.getByRole('button', { name: 'Salvar alterações' }));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Apresentar resultados',
        description: 'Reunir os resultados do trimestre',
        labelIds: ['label-1'],
      }),
      expect.anything(),
    );
  });
});
