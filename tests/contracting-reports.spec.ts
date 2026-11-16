import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { expect, test } from './fixtures';

const file = pathToFileURL(
  resolve('dist/offline/Отчёты — подрядная схема WinWork.html'),
).href;

test('generates a scoped customer report, opens it in place and downloads a workbook', async ({
  context,
  page,
}) => {
  const requests: string[] = [];
  page.on('request', (request) => {
    if (/^https?:/.test(request.url())) requests.push(request.url());
  });
  await context.setOffline(true);
  await page.goto(file);
  await page.getByRole('link', { name: 'Отчёты', exact: true }).last().click();
  const list = page.getByRole('table', { name: 'Список отчётов' });
  await expect(list.getByRole('row')).toHaveCount(5);

  const create = page.getByRole('button', { name: 'Сформировать отчёт' });
  await create.click();
  const dialog = page.getByRole('dialog');
  await page.keyboard.press('Escape');
  await expect(create).toBeFocused();
  await create.click();
  await dialog
    .getByRole('combobox', { name: 'Подрядчик', exact: true })
    .selectOption('takt');
  await dialog.getByLabel('Дата начала').fill('2026-11-01');
  await dialog.getByLabel('Дата окончания').fill('2026-10-01');
  await dialog.getByRole('button', { name: 'Сформировать отчёт' }).click();
  await expect(dialog.getByRole('alert')).toContainText('Дата окончания');
  await dialog.getByLabel('Дата окончания').fill('2026-11-10');
  await dialog
    .getByRole('radio', { name: 'Только завершённые', exact: true })
    .check();
  await dialog.getByRole('button', { name: 'Сформировать отчёт' }).click();

  const first = list.getByRole('row').nth(1);
  await expect(first.getByText('Формируется', { exact: true })).toBeVisible();
  await expect(first.getByText('Сформирован', { exact: true })).toBeVisible();
  await first.getByRole('link').click();
  const details = page.getByRole('table', { name: 'Данные отчёта' });
  await expect(details.getByRole('row')).toHaveCount(3);
  await expect(details.getByText('Комплектовка заказов')).toBeVisible();
  await expect(details.getByText('Разгрузка поставки')).toBeVisible();
  await expect(details.getByText('Сборка стеллажей')).toHaveCount(0);
  expect(context.pages()).toHaveLength(1);

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Скачать XLSX' }).click();
  const workbook = await download;
  expect(workbook.suggestedFilename()).toMatch(/\.xlsx$/);
  const workbookBytes = await readFile(await workbook.path());
  expect(workbookBytes.subarray(0, 4)).toEqual(Buffer.from([80, 75, 3, 4]));
  expect(workbookBytes.toString('utf8')).toContain('Комплектовка заказов');
  expect(workbookBytes.toString('utf8')).not.toContain('Сборка стеллажей');
  await page.reload();
  await expect(details.getByRole('row')).toHaveCount(3);
  await page.getByRole('link', { name: 'К списку отчётов' }).click();
  await expect(list.getByRole('row')).toHaveCount(6);
  await page.goBack();
  await expect(details).toBeVisible();
  expect(requests).toEqual([]);
});

test('contractor reports are separate and a summary uses client data', async ({
  context,
  page,
}) => {
  await context.setOffline(true);
  await page.goto(file);
  await page.getByRole('link', { name: 'Работа в режиме подрядчика' }).click();
  await page
    .getByRole('link', { name: 'Задания клиентов', exact: true })
    .last()
    .click();
  await expect(
    page.getByRole('table', { name: 'Задания клиентов' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Отчёты', exact: true }).last().click();
  const list = page.getByRole('table', { name: 'Список отчётов' });
  await list
    .getByRole('link', { name: /Сводка по клиентам/ })
    .first()
    .click();
  const summary = page.getByRole('table', { name: 'Данные отчёта' });
  await expect(
    summary.getByRole('columnheader', { name: 'Клиент', exact: true }),
  ).toBeVisible();
  await expect(summary.getByText('ООО «Северный стеллаж»')).toBeVisible();
  await expect(summary.getByText('ООО «Такт Персонал»')).toHaveCount(0);
  await page.getByLabel('Поиск по отчёту').fill('несуществующий клиент');
  await expect(page.getByText('По запросу ничего не найдено')).toBeVisible();
  await page.getByRole('link', { name: 'К списку отчётов' }).click();
  await page.getByRole('button', { name: 'Сформировать отчёт' }).click();
  const dialog = page.getByRole('dialog');
  await dialog
    .getByRole('combobox', { name: 'Тип отчёта' })
    .selectOption('summary');
  await dialog
    .getByRole('combobox', { name: 'Клиент', exact: true })
    .selectOption('supplier');
  await dialog.getByRole('button', { name: 'Октябрь' }).click();
  await dialog.getByRole('radio', { name: 'Только завершённые' }).check();
  await dialog.getByRole('button', { name: 'Сформировать отчёт' }).click();
  await list.getByRole('row').nth(1).getByRole('link').click();
  await expect(
    page.getByText('За этот период нет заданий по выбранным фильтрам'),
  ).toBeVisible();
});
