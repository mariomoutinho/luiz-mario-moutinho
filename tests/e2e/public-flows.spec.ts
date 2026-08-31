import { expect, test } from '@playwright/test';

const viewports = [
  { width: 320, height: 568 },
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 412, height: 915 },
  { width: 768, height: 1024 },
  { width: 1366, height: 768 },
  { width: 1920, height: 1080 },
];

for (const viewport of viewports) {
  test(`landing sem rolagem horizontal em ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Projetos em movimento/ })).toBeVisible();
    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
  });
}

test('navegação pública e estado sem configuração do Supabase', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Criar conta grátis' }).click();
  await expect(page).toHaveURL(/\/cadastro$/);
  await expect(page.getByRole('heading', { name: 'Crie sua conta.' })).toBeVisible();
  await expect(page.getByText('Conecte o Supabase para usar sua conta')).toBeVisible();
  await expect(page.getByRole('button', { name: /Criar conta/ })).toBeDisabled();
});

test('links legais funcionam e o acesso privado é protegido', async ({ page }) => {
  await page.goto('/privacidade');
  await expect(page.getByRole('heading', { name: 'Política de privacidade' })).toBeVisible();
  await page.goto('/app');
  await expect(page).toHaveURL(/\/entrar$/);
});

test('captura evidências visuais públicas', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Projetos em movimento/ })).toBeVisible();
  await page.screenshot({ path: 'test-results/kamba-landing-desktop.png', fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Projetos em movimento/ })).toBeVisible();
  await page.screenshot({ path: 'test-results/kamba-landing-mobile.png', fullPage: true });
  await page.goto('/cadastro');
  await expect(page.getByRole('heading', { name: 'Crie sua conta.' })).toBeVisible();
  await page.screenshot({ path: 'test-results/kamba-cadastro-mobile.png', fullPage: true });
});
