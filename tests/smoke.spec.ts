import { expect, test } from './fixtures';

for (const [track, firstScene, count] of [
  ['enterprise', 'ent-01', 17],
  ['small', 'smb-01', 12],
  ['api', 'api-01', 8],
] as const) {
  test(`${track}: direct links, slides and browser history`, async ({
    page,
  }) => {
    await page.goto(`/${track}?scene=unavailable&source=smoke`);
    const picker = page.getByRole('combobox', { name: 'Перейти к сцене' });
    await expect(picker).toHaveValue(firstScene);
    await expect(picker.locator('option')).toHaveCount(count);
    await expect(page).toHaveURL(
      new RegExp(`scene=${firstScene}&source=smoke`),
    );
    await expect(page.frameLocator('iframe').locator('body')).not.toBeEmpty();

    await page
      .getByRole('button', { name: 'Следующая сцена', exact: true })
      .click();
    await expect(picker).not.toHaveValue(firstScene);
    const secondUrl = page.url();
    await page.goBack();
    await expect(picker).toHaveValue(firstScene);
    await page.goForward();
    await expect(page).toHaveURL(secondUrl);
    await page.reload();
    await expect(page).toHaveURL(secondUrl);

    await page.locator('body').click({ position: { x: 5, y: 5 } });
    await page.keyboard.press('ArrowLeft');
    await expect(picker).toHaveValue(firstScene);
    await page.keyboard.press('ArrowRight');
    await expect(page).toHaveURL(secondUrl);
  });
}

test('landing and onboarding catalog are reachable', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Выберите презентацию' }),
  ).toBeVisible();
  for (const title of ['Крупный бизнес', 'Малый бизнес', 'API / Embedded']) {
    await expect(
      page.getByRole('button', { name: new RegExp(title) }),
    ).toBeVisible();
  }
  await page.getByRole('button', { name: 'Открыть флоу', exact: true }).click();
  await expect(page).toHaveURL('/onboarding');
  await expect(
    page.getByRole('button', { name: /^Открыть сценарий:/ }),
  ).toHaveCount(4);
});

test('demo reset, Escape and focus restoration', async ({ page }) => {
  await page.goto('/enterprise?scene=ent-04');
  const trigger = page.getByRole('button', {
    name: 'Показать в WinWork: создание объекта',
    exact: true,
  });
  await trigger.click();
  const dialog = page.getByRole('dialog', {
    name: 'Создание объекта',
    exact: true,
  });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole('button', { name: 'Закрыть демо', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL('/enterprise?scene=ent-04');
  await dialog
    .getByRole('button', { name: 'Добавить объект', exact: true })
    .click();
  await expect(dialog.getByRole('textbox').first()).toBeVisible();
  await dialog
    .getByRole('button', { name: 'Сбросить демо', exact: true })
    .click();
  await expect(
    dialog.getByRole('button', { name: 'Добавить объект', exact: true }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(
    dialog.getByRole('button', { name: 'Добавить объект', exact: true }),
  ).toBeVisible();
});

test('all quick-access demos open and close', async ({ page }) => {
  await page.goto('/');
  await page
    .getByRole('button', { name: 'Показать флоу', exact: true })
    .click();
  const demos = page.locator('#demo-quick-access-grid').getByRole('button');
  await expect(demos).toHaveCount(10);
  for (const demo of await demos.all()) {
    await demo.click();
    await expect(page.getByRole('dialog').first()).toBeVisible();
    await page
      .getByRole('button', { name: 'Закрыть демо', exact: true })
      .click();
    await expect(page.locator('.demo-flow-dialog')).toHaveCount(0);
    await expect(demo).toBeFocused();
  }
});

test('public Court entry keeps hotspots aligned after resize', async ({
  page,
}) => {
  await page.goto('/court.html?scene=court-02');
  await expect(
    page.getByRole('combobox', { name: 'Перейти к сцене' }).locator('option'),
  ).toHaveCount(6);
  const trigger = page.getByRole('button', {
    name: 'Показать процесс регистрации заказчика',
    exact: true,
  });
  const source = page
    .frameLocator('iframe')
    .locator('[data-demo-flow="registration"]');
  for (const viewport of [
    { width: 1920, height: 1080 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await expect(trigger).toBeVisible();
    await expect(source).toBeVisible();
    await expect
      .poll(async () => {
        const [overlay, target] = await Promise.all([
          trigger.boundingBox(),
          source.boundingBox(),
        ]);
        if (!overlay || !target) return Number.POSITIVE_INFINITY;
        return Math.max(
          ...(['x', 'y', 'width', 'height'] as const).map((key) =>
            Math.abs(overlay[key] - target[key]),
          ),
        );
      })
      .toBeLessThan(1);
  }
  await trigger.click();
  await expect(
    page.getByRole('dialog', {
      name: 'Регистрация юридического лица',
      exact: true,
    }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});
