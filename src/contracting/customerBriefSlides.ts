import type { SlideSceneDefinition } from '../presentation/engine/types';

export const contractingCustomerBriefSlides = [
  {
    id: 'ctr-01',
    frameId: 'P0oAV5',
    title: 'Подрядная схема WinWork',
    description:
      'Заказчик размещает задание. Договор с исполнителем заключает подрядчик.',
  },
  {
    id: 'ctr-02',
    frameId: 'hZmyR',
    title: 'Когда подходит подрядная схема',
    description: 'Роли заказчика и подрядчика на примере задания на складе.',
  },
  {
    id: 'ctr-03',
    frameId: 'sHCmz',
    title: 'Кто с кем заключает договор',
    description: 'Договоры заказчика, подрядчика и исполнителя.',
  },
  {
    id: 'ctr-04',
    frameId: 'TfKtw',
    title: 'От подключения подрядчика до выплаты',
    description: 'Пять этапов работы по подрядной схеме.',
  },
  {
    id: 'ctr-05',
    frameId: 'n18o3',
    exportName: 'ctr-brief-overview',
    title: 'Подрядная схема в трёх шагах',
    description: 'Подключение подрядчика, создание задания и оплата работы.',
  },
  {
    id: 'ctr-brief-connect',
    frameId: 'D84mpU',
    title: 'Подключите подрядчика',
    description: 'Выбор подрядчика и договор, подписанный обеими сторонами.',
  },
  {
    id: 'ctr-brief-create',
    frameId: 'xqDf7',
    title: 'Создайте задание в привычной форме',
    description: 'Публикация через подрядчика в веб-кабинете и приложении.',
  },
  {
    id: 'ctr-brief-pay',
    frameId: 'CKB2s',
    title: 'Примите и оплатите работу',
    description: 'Приёмка, оплата и акт выполненных работ от подрядчика.',
  },
  {
    id: 'ctr-brief-limits',
    frameId: 'T0ozq',
    title: 'Задайте лимиты для каждого объекта',
    description: 'Виды деятельности и лимиты, доступные руководителю объекта.',
  },
  {
    id: 'ctr-brief-summary',
    frameId: 'vlrNw',
    title: 'Вы управляете заданиями и выплатами',
    description: 'Оплата отдельных заданий и массовые выплаты по реестру.',
  },
].map(
  ({ frameId, exportName, ...slide }) =>
    ({
      ...slide,
      type: 'slide',
      pencil: {
        documentPath: `/contracting-slides/${exportName ?? slide.id}.html`,
        frameId,
        height: 1080,
        width: 1920,
      },
    }) satisfies SlideSceneDefinition,
);
