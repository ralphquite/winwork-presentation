import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { expect, test } from './fixtures';

for (const [name, kind] of [
  ['Открыть презентацию WinWork.html', 'court'],
  ['Открыть продажи WinWork.html', 'sales'],
  ['Открыть онбординг WinWork.html', 'onboarding'],
] as const) {
  test(`file:// without networking: ${kind}`, async ({ page, context }) => {
    const httpRequests: string[] = [];
    page.on('request', (request) => {
      if (/^https?:/.test(request.url())) httpRequests.push(request.url());
    });
    await context.setOffline(true);
    await page.goto(pathToFileURL(resolve('dist/offline', name)).href);
    if (kind === 'court') {
      const controls = page.getByRole('navigation', {
        name: 'Управление офлайн-презентацией',
      });
      const sceneBody = (sceneId: string) =>
        page
          .locator(`[data-scene-id="${sceneId}"]`)
          .frameLocator('iframe')
          .locator('body');
      await expect(controls.getByRole('button')).toHaveCount(3);
      for (let index = 1; index <= 6; index += 1) {
        const sceneId = `court-0${index}`;
        await expect(page).toHaveURL(new RegExp(`scene=${sceneId}`));
        await expect(sceneBody(sceneId)).not.toBeEmpty();
        if (index < 6)
          await controls
            .getByRole('button', { name: 'Следующий слайд', exact: true })
            .click();
      }
      await controls
        .getByRole('button', { name: 'Вернуться на первый слайд', exact: true })
        .click();
      await expect(page).toHaveURL(/scene=court-01/);
      // The hash changes before the outgoing scene's iframe is removed.
      await expect(sceneBody('court-01')).not.toBeEmpty();
    } else if (kind === 'sales') {
      await expect(
        page.getByRole('heading', { name: 'Выберите презентацию' }),
      ).toBeVisible();
      await page.getByRole('button', { name: /Крупный бизнес/ }).click();
      const picker = page.getByRole('combobox', { name: 'Перейти к сцене' });
      await expect(picker.locator('option')).toHaveCount(17);
      await expect(page.frameLocator('iframe').locator('body')).not.toBeEmpty();
    } else {
      await expect(
        page.getByRole('button', { name: /^Открыть сценарий:/ }),
      ).toHaveCount(4);
    }
    let imageCount = 0;
    for (const frame of page.frames()) {
      imageCount += await frame.locator('img').count();
      await expect
        .poll(() =>
          frame
            .locator('img')
            .evaluateAll((images) =>
              images.every(
                (image) =>
                  image instanceof HTMLImageElement &&
                  image.complete &&
                  image.naturalWidth > 0,
              ),
            ),
        )
        .toBe(true);
    }
    expect(imageCount, 'Embedded images are present').toBeGreaterThan(0);
    expect(
      httpRequests,
      'Offline HTML must not request HTTP resources',
    ).toEqual([]);
  });
}
