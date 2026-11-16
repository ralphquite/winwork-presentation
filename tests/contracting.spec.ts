import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { expect, test } from './fixtures';

function deckUrl(filename: string) {
  return pathToFileURL(resolve('dist/offline', filename)).href;
}

const fileUrl = deckUrl('Открыть подрядную схему WinWork.html');

test('the five slides lead into the prototype in the same offline file', async ({
  context,
  page,
}) => {
  const requests: string[] = [];
  page.on('request', (request) => {
    if (/^https?:/.test(request.url())) requests.push(request.url());
  });
  await page.setViewportSize({ width: 390, height: 820 });
  await context.setOffline(true);
  await page.goto(fileUrl);
  await page.mouse.move(10, 10);
  const controls = page.getByLabel('Управление презентацией');
  await expect(controls).toHaveCSS('opacity', '1');
  const slideControlsBounds = await controls.boundingBox();

  const slides = [
    ['ctr-01', 'Договор с исполнителем заключает подрядчик.'],
    ['ctr-02', 'Когда подходит подрядная схема'],
    ['ctr-03', 'Кто с кем заключает договор'],
    ['ctr-04', 'От подключения подрядчика до выплаты'],
    ['ctr-05', 'Посмотрим, как это работает в WinWork'],
  ] as const;
  await expect(
    page.getByRole('button', { name: 'Предыдущая сцена' }),
  ).toBeDisabled();
  for (const [index, [scene, copy]] of slides.entries()) {
    if (index > 0) await page.keyboard.press('ArrowRight');
    await expect(page).toHaveURL(new RegExp(`scene=${scene}$`));
    await expect(
      page
        .locator(`[data-scene-id="${scene}"]`)
        .frameLocator('iframe')
        .getByText(copy),
    ).toBeVisible();
  }

  const showDemo = page.getByRole('button', { name: 'Показать в WinWork' });
  const product = page.getByRole('region', { name: 'Экран WinWork' });
  await showDemo.press('Enter');
  await expect(page).toHaveURL(/scene=customer-intro$/);
  await expect(product).toBeVisible();
  await expect(controls).toHaveCSS('opacity', '1');
  expect(await controls.boundingBox()).toEqual(slideControlsBounds);
  await expect(
    controls.getByRole('combobox', { name: 'Этап сценария' }),
  ).toHaveValue('customer-intro');

  await page.goBack();
  await expect(showDemo).toBeVisible();
  await page.goForward();
  await expect(product).toBeVisible();
  await controls.getByRole('button', { name: 'Предыдущая сцена' }).click();
  await expect(showDemo).toBeVisible();
  await showDemo.click();
  await controls
    .getByRole('button', { name: 'Начать презентацию заново' })
    .click();
  await expect(page).toHaveURL(/scene=ctr-01$/);
  expect(requests).toEqual([]);
});

test('the short customer deck shows the ten revised Pencil slides offline', async ({
  context,
  page,
}) => {
  const url = deckUrl(
    'Открыть подрядную схему WinWork — для заказчика (краткая версия).html',
  );
  const requests: string[] = [];
  page.on('request', (request) => {
    if (/^https?:/.test(request.url())) requests.push(request.url());
  });
  await context.setOffline(true);
  await page.goto(`${url}#/?scene=ctr-05`);

  const controls = page.getByLabel('Управление презентацией');
  const picker = controls.getByRole('combobox', { name: 'Перейти к сцене' });
  await expect(controls).toHaveCSS('opacity', '1');
  await expect(picker.locator('option')).toHaveCount(10);
  const overview = page
    .frameLocator('[data-scene-id="ctr-05"] iframe')
    .getByRole('heading', { name: 'Подрядная схема в трёх шагах', level: 1 });
  await expect(overview).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Показать в WinWork' }),
  ).toHaveCount(0);
  const next = page.getByRole('button', { name: 'Следующая сцена' });
  await next.click();
  await expect(page).toHaveURL(/scene=ctr-brief-connect$/);
  await page.goBack();
  await expect(overview).toBeVisible();
  await page.goForward();
  await expect(page).toHaveURL(/scene=ctr-brief-connect$/);
  const reset = controls.getByRole('button', {
    name: 'Начать презентацию заново',
  });
  await reset.click();
  await expect(
    controls.getByRole('button', { name: 'Предыдущая сцена' }),
  ).toBeDisabled();

  const slides = [
    ['ctr-01', 'P0oAV5', 'Подрядная схема WinWork', []],
    ['ctr-02', 'hZmyR', 'Когда подходит подрядная схема', []],
    ['ctr-03', 'sHCmz', 'Кто с кем заключает договор', []],
    ['ctr-04', 'TfKtw', 'От подключения подрядчика до выплаты', []],
    ['ctr-05', 'n18o3', 'Подрядная схема в трёх шагах', []],
    [
      'ctr-brief-connect',
      'D84mpU',
      'Подключите подрядчика',
      [
        'figma-brief/partners.png',
        'figma-brief/partner-search.png',
        'figma-brief/partner-signed.png',
      ],
    ],
    [
      'ctr-brief-create',
      'xqDf7',
      'Создайте задание в привычной форме',
      [
        'figma-brief/create-web.png',
        'customer-brief/images/create-mobile-top.png',
        'customer-brief/images/create-mobile-bottom.png',
      ],
    ],
    [
      'ctr-brief-pay',
      'CKB2s',
      'Примите и оплатите работу',
      ['figma-brief/pay-web.png', 'customer-brief/images/pay-mobile.png'],
    ],
    [
      'ctr-brief-limits',
      'T0ozq',
      'Задайте лимиты для каждого объекта',
      ['figma-brief/object-settings.png'],
    ],
    [
      'ctr-brief-summary',
      'vlrNw',
      'Вы управляете заданиями и выплатами',
      ['customer-brief/images/summary-illustration.png'],
    ],
  ] as const;
  for (const [index, [id, frameId, title, images]] of slides.entries()) {
    if (index > 0) await page.keyboard.press('ArrowRight');
    await expect(page).toHaveURL(new RegExp(`scene=${id}$`));
    await expect(picker).toHaveValue(id);
    const slide = page
      .frameLocator(`[data-scene-id="${id}"] iframe`)
      .locator(`[data-pencil-id="${frameId}"]`);
    await expect(
      slide.getByRole('heading', { name: title, level: 1 }),
    ).toBeVisible();
    const fills = slide.locator('[style*="background-image: url("]');
    await expect(fills).toHaveCount(images.length);
    const embedded = await fills.evaluateAll((elements) =>
      Promise.all(
        elements.map(async (element) => {
          const background = getComputedStyle(element).backgroundImage;
          const source = /^url\("(data:image\/png;base64,[^"]+)"\)$/.exec(
            background,
          )?.[1];
          if (!source) throw new Error('Expected an embedded Pencil image.');
          const image = new Image();
          image.src = source;
          await image.decode();
          return source.slice(source.indexOf(',') + 1);
        }),
      ),
    );
    const originals = await Promise.all(
      images.map(async (path) =>
        (await readFile(resolve('src/assets/contracting', path))).toString(
          'base64',
        ),
      ),
    );
    expect(embedded).toEqual(originals);
  }
  await expect(next).toBeDisabled();
  await page.keyboard.press('ArrowLeft');
  await expect(page).toHaveURL(/scene=ctr-brief-limits$/);
  await picker.selectOption('ctr-brief-pay');
  await expect(page).toHaveURL(/scene=ctr-brief-pay$/);
  await reset.click();
  await expect(page).toHaveURL(/scene=ctr-01$/);
  expect(requests).toEqual([]);
});

test('the performer action has a visual cue that clears on the waiting screen', async ({
  context,
  page,
}) => {
  await context.setOffline(true);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(`${fileUrl}#/?scene=performer-offer`);
  const product = page.getByRole('region', { name: 'Экран WinWork' });
  const cue = product.locator('[data-contracting-hint]');
  const offer = product.getByRole('button', { name: 'Откликнуться' });
  await expect(cue).toHaveCount(1);
  await expect(cue).toHaveText('Откликнуться');
  await expect(offer).toBeDisabled();
  const cueAnimation = () =>
    cue.evaluate(
      (element) => getComputedStyle(element, '::after').animationName,
    );
  await expect.poll(cueAnimation).not.toBe('none');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(cueAnimation).toBe('none');
  await page.getByRole('button', { name: 'Следующая сцена' }).click();
  await expect(
    product.getByText('На рассмотрении', { exact: true }),
  ).toBeVisible();
  await expect(cue).toHaveCount(0);
});

test('the offline deck restores the role, drawer and stage when going back', async ({
  context,
  page,
}) => {
  const requests: string[] = [];
  page.on('request', (request) => {
    if (/^https?:/.test(request.url())) requests.push(request.url());
  });
  await context.setOffline(true);
  await page.goto(`${fileUrl}#/?scene=customer-intro`);

  const activeRole = page
    .getByRole('list', { name: 'Роли в сценарии' })
    .locator('[aria-current="true"]');
  const steps = page.getByRole('combobox', { name: 'Этап сценария' });
  const next = page.getByRole('button', { name: 'Следующая сцена' });
  await expect(activeRole).toContainText('Заказчик');
  await expect(steps.locator('option')).toHaveCount(15);

  await page.keyboard.press('ArrowRight');
  await next.click();
  await expect(
    page.getByRole('complementary', { name: 'Добавить подрядчика' }),
  ).toBeVisible();
  await expect(steps).toHaveValue('customer-intro');

  await steps.selectOption('contractor-intro');
  await expect(activeRole).toContainText('Подрядчик');
  const nav = page.getByRole('navigation', { name: 'Навигация WinWork' });
  const disclosure = nav.getByRole('button', {
    name: 'Подрядная схема',
    exact: true,
  });
  const urlBefore = page.url();
  await expect(disclosure).toHaveAttribute('aria-expanded', 'true');
  await disclosure.click();
  await expect(disclosure).toHaveAttribute('aria-expanded', 'false');
  await expect(nav.getByText('Мои подрядчики', { exact: true })).toBeHidden();
  await expect(page).toHaveURL(urlBefore);

  await page.goBack();
  await expect(activeRole).toContainText('Заказчик');
  await expect(
    page.getByRole('complementary', { name: 'Добавить подрядчика' }),
  ).toBeVisible();
  expect(requests).toEqual([]);
});

test('the performer confirms, the contractor signs, and the customer accepts and pays', async ({
  context,
  page,
}) => {
  await context.setOffline(true);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(`${fileUrl}#/?scene=performer-confirm-done`);

  const activeRole = page
    .getByRole('list', { name: 'Роли в сценарии' })
    .locator('[aria-current="true"]');
  const next = page.getByRole('button', { name: 'Следующая сцена' });
  const product = page.getByRole('region', { name: 'Экран WinWork' });
  const taskPanel = page.getByRole('complementary', { name: 'Панель задания' });
  const documents = taskPanel.getByRole('list', { name: 'Документы задания' });

  await expect(activeRole).toContainText('Исполнитель');
  await expect(
    product.getByText('В процессе выполнения', { exact: true }),
  ).toBeVisible();
  await expect(
    product.getByRole('button', { name: 'Подтвердить', exact: true }),
  ).toBeVisible();
  await next.click();
  await expect(
    product.getByText('На подтверждении', { exact: true }),
  ).toBeVisible();

  await next.click();
  await expect(activeRole).toContainText('Заказчик');
  await expect(
    taskPanel.getByText('Подтверждено исполнителем', { exact: true }),
  ).toBeVisible();
  await expect(taskPanel.getByText(/ждём подписи подрядчика/i)).toBeVisible();
  await expect(documents.getByRole('listitem')).toHaveCount(1);
  await expect(
    documents.getByText('Не подписан', { exact: true }),
  ).toBeVisible();
  await expect(taskPanel.getByText(/оплатить/i)).toHaveCount(0);

  await next.click();
  await expect(activeRole).toContainText('Подрядчик');
  await expect(
    taskPanel.getByText('Подтвердить и подписать', { exact: true }),
  ).toBeVisible();
  await expect(documents.getByRole('listitem')).toHaveCount(2);
  await expect(
    documents.getByText('Задание и акт выполненных работ', { exact: true }),
  ).toHaveCount(2);
  await expect(
    documents.getByText('Подписан исполнителем', { exact: true }),
  ).toBeVisible();
  await expect(
    documents.getByText('Не подписан', { exact: true }),
  ).toBeVisible();
  await expect(taskPanel.getByText(/оплатить/i)).toHaveCount(0);
  const roleAndScreenChangedTogether = await next.evaluate(
    (button) =>
      new Promise<boolean>((resolve) => {
        const cards = document.querySelector('[aria-label="Роли в сценарии"]');
        if (!cards || !(button instanceof HTMLButtonElement)) {
          resolve(false);
          return;
        }
        const observer = new MutationObserver(() => {
          const role = cards.querySelector('[aria-current="true"]');
          if (role?.getAttribute('data-role') !== 'customer') return;
          observer.disconnect();
          resolve(
            Boolean(
              document.querySelector('[data-scene-id="customer-payment"]'),
            ) &&
              !document.querySelector('[data-scene-id="contractor-sign-acts"]'),
          );
        });
        observer.observe(cards, {
          attributes: true,
          childList: true,
          subtree: true,
        });
        button.click();
      }),
  );
  expect(roleAndScreenChangedTogether).toBe(true);
  await expect(activeRole).toContainText('Заказчик');
  await expect(
    taskPanel.getByText('Принять и оплатить', { exact: true }),
  ).toBeVisible();
  await expect(
    documents.getByText('Подписан подрядчиком', { exact: true }),
  ).toBeVisible();
  await next.click();
  await expect(
    taskPanel.getByText('Введите код из СМС', { exact: true }),
  ).toBeVisible();
  await expect(
    taskPanel.getByRole('textbox', { name: 'Введите код из СМС' }),
  ).toHaveValue('1234');
  await expect(
    documents.getByText('Подписан вами и подрядчиком', { exact: true }),
  ).toBeVisible();
  await next.click();
  await expect(
    taskPanel.getByText('Отправлено', { exact: true }),
  ).toBeVisible();
  await next.click();
  await expect(documents.getByRole('listitem')).toHaveCount(1);
  await expect(
    documents.getByText('Задание и акт выполненных работ', { exact: true }),
  ).toBeVisible();
  await expect(
    documents.getByText('Подписан вами и подрядчиком', { exact: true }),
  ).toBeVisible();

  await next.click();
  await expect(activeRole).toContainText('Исполнитель');
  await expect(
    product.getByText('Выплата в процессе', { exact: true }),
  ).toBeVisible();
  await next.click();
  await expect(product.getByText('Выполнено', { exact: true })).toBeVisible();
  await next.click();
  await expect(activeRole).toContainText('Подрядчик');
  await expect(documents.getByRole('listitem')).toHaveCount(3);
  await expect(
    documents.getByText('Договор об оказании услуг', { exact: true }),
  ).toBeVisible();
  await expect(
    documents.getByText('Подписан вами и исполнителем', { exact: true }),
  ).toHaveCount(2);
  await expect(
    documents.getByText('Подписан вами и заказчиком', { exact: true }),
  ).toBeVisible();
  await expect(next).toBeDisabled();
});

test('the prototype-only edition starts with the full demo and skips all slides', async ({
  context,
  page,
}) => {
  const url = deckUrl('Открыть демо подрядной схемы WinWork.html');
  const requests: string[] = [];
  page.on('request', (request) => {
    if (/^https?:/.test(request.url())) requests.push(request.url());
  });
  await context.setOffline(true);
  await page.goto(url);

  const product = page.getByRole('region', { name: 'Экран WinWork' });
  const steps = page.getByRole('combobox', { name: 'Этап сценария' });
  const previous = page.getByRole('button', { name: 'Предыдущая сцена' });
  const next = page.getByRole('button', { name: 'Следующая сцена' });
  await expect(page).toHaveURL(/scene=customer-intro$/);
  await expect(previous).toBeDisabled();
  await expect(steps.locator('option')).toHaveCount(15);

  const stages = [
    ['customer', 4],
    ['contractor', 4],
    ['customer', 2],
    ['contractor', 1],
    ['customer', 3],
    ['performer', 2],
    ['customer', 2],
    ['performer', 3],
    ['contractor', 3],
    ['performer', 2],
    ['customer', 1],
    ['contractor', 1],
    ['customer', 4],
    ['performer', 2],
    ['contractor', 1],
  ] as const;
  for (const [index, [role, screenCount]] of stages.entries()) {
    for (let screen = 0; screen < screenCount; screen++) {
      await expect(product).toHaveAttribute('data-role', role);
      await expect(page.locator('iframe')).toHaveCount(0);
      if (index < stages.length - 1 || screen < screenCount - 1) {
        await next.click();
      }
    }
  }
  await expect(next).toBeDisabled();
  await expect(page).toHaveURL(/scene=contractor-documents$/);
  await page.getByRole('button', { name: 'Начать презентацию заново' }).click();
  await expect(page).toHaveURL(/scene=customer-intro$/);
  await page.goto(`${url}#/?scene=ctr-05`);
  await expect(page).toHaveURL(/scene=customer-intro$/);
  expect(requests).toEqual([]);
});

const audienceEditions = [
  {
    role: 'customer',
    audience: 'заказчика',
    stages: [
      ['customer-intro', 4],
      ['customer-sent', 2],
      ['marketplace', 3],
      ['performer-offer', 2],
      ['customer-task', 2],
      ['performer-confirm-start', 3],
      ['performer-confirm-done', 2],
      ['customer-work-confirmed', 1],
      ['customer-payment', 4],
      ['performer-payout', 2],
    ],
    last: 'performer-paid',
    excluded: 'contractor-intro',
    documents: 'customer-documents',
    documentCount: 1,
  },
  {
    role: 'contractor',
    audience: 'подрядчика',
    stages: [
      ['contractor-intro', 4],
      ['contractor-linked', 1],
      ['performer-offer', 2],
      ['performer-confirm-start', 3],
      ['orders', 3],
      ['performer-confirm-done', 2],
      ['contractor-sign-acts', 1],
      ['performer-payout', 2],
      ['contractor-documents', 1],
    ],
    last: 'contractor-documents',
    excluded: 'customer-intro',
    documents: 'contractor-documents',
    documentCount: 3,
  },
] as const;

for (const edition of audienceEditions) {
  test(`the ${edition.role} edition shows its cabinet and the performer app`, async ({
    context,
    page,
  }) => {
    const url = deckUrl(
      `Открыть подрядную схему WinWork — для ${edition.audience}.html`,
    );
    const requests: string[] = [];
    page.on('request', (request) => {
      if (/^https?:/.test(request.url())) requests.push(request.url());
    });
    await context.setOffline(true);
    await page.goto(url);
    await expect(page).toHaveURL(/scene=ctr-01$/);
    await expect(
      page
        .frameLocator('iframe')
        .getByText(`Демонстрация для ${edition.audience}`, { exact: false }),
    ).toBeVisible();

    const next = page.getByRole('button', { name: 'Следующая сцена' });
    for (const id of ['ctr-02', 'ctr-03', 'ctr-04', 'ctr-05']) {
      await next.click();
      await expect(
        page.locator(`[data-scene-id="${id}"] iframe`),
      ).toBeVisible();
    }

    const showDemo = page.getByRole('button', { name: 'Показать в WinWork' });
    const product = page.getByRole('region', { name: 'Экран WinWork' });
    await showDemo.click();
    await expect(page).toHaveURL(new RegExp(`scene=${edition.stages[0][0]}$`));
    await page.goBack();
    await expect(showDemo).toBeVisible();
    await expect(
      page.frameLocator('iframe').getByText('В демо', { exact: true }),
    ).toHaveCount(2);
    await page.goForward();
    await expect(product).toBeVisible();

    const steps = page.getByRole('combobox', { name: 'Этап сценария' });
    expect(
      await steps
        .locator('option')
        .evaluateAll((options) =>
          options.map((option) => option.getAttribute('value')),
        ),
    ).toEqual(edition.stages.map(([stage]) => stage));
    const roleCards = page.getByRole('list', { name: 'Роли в сценарии' });
    await expect(roleCards.getByRole('listitem')).toHaveCount(2);
    const activeRole = roleCards.locator('[aria-current="true"]');
    const screens = edition.stages.flatMap(([stage, count]) =>
      Array.from({ length: count }, () => stage),
    );
    for (const [index, stageId] of screens.entries()) {
      const role = stageId.startsWith('performer-')
        ? 'performer'
        : edition.role;
      await expect(page.locator('.presentation-scene-counter')).toHaveText(
        `${index + 6} / ${screens.length + 5}`,
      );
      await expect(steps).toHaveValue(stageId);
      await expect(activeRole).toHaveAttribute('data-role', role);
      await expect(product).toHaveAttribute('data-role', role);
      if (index < screens.length - 1) await next.click();
    }
    await expect(next).toBeDisabled();
    await expect(page).toHaveURL(new RegExp(`scene=${edition.last}$`));

    await steps.selectOption('performer-offer');
    const performer = product.getByRole('region', {
      name: 'Экран исполнителя',
    });
    await expect(
      performer.getByRole('button', { name: 'Откликнуться' }),
    ).toBeVisible();
    await expect
      .poll(() =>
        performer
          .locator('img')
          .evaluateAll(
            (images) =>
              images.length > 0 &&
              images.every(
                (image) =>
                  image instanceof HTMLImageElement &&
                  image.complete &&
                  image.naturalWidth > 0,
              ),
          ),
      )
      .toBe(true);
    await steps.selectOption('performer-payout');
    await expect(
      performer.getByText('Выплата в процессе', { exact: true }),
    ).toBeVisible();

    if (edition.role === 'contractor') {
      await steps.selectOption('orders');
      await expect(page.locator('.ww-contracting-caption')).toContainText(
        'Заказчик создаёт и публикует задание. Оно появляется у подрядчика в разделе «Задания клиентов»',
      );
      await expect(
        product.getByRole('row').filter({
          hasText: 'Грузчик. Разгрузка товара на складе',
        }),
      ).toBeVisible();
    }

    await page.goto(`${url}#/?scene=${edition.documents}`);
    await expect(
      product
        .getByRole('list', { name: 'Документы задания' })
        .getByRole('listitem'),
    ).toHaveCount(edition.documentCount);

    await page.goto(`${url}#/?scene=${edition.excluded}`);
    await expect(page).toHaveURL(/scene=ctr-01$/);
    expect(requests).toEqual([]);
  });
}
