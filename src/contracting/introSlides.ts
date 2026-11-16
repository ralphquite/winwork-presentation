import type { SlideSceneDefinition } from '../presentation/engine/types';

export const contractingIntroSlides = [
  {
    id: 'ctr-01',
    frameId: 'aSI4z',
    title: 'Подрядная схема WinWork',
    description:
      'Заказчик размещает задание. Договор с исполнителем заключает подрядчик.',
  },
  {
    id: 'ctr-02',
    frameId: 'PYie0',
    title: 'Когда подходит подрядная схема',
    description: 'Роли заказчика и подрядчика на примере задания на складе.',
  },
  {
    id: 'ctr-03',
    frameId: 'U2e3V',
    title: 'Кто с кем заключает договор',
    description: 'Договоры заказчика, подрядчика и исполнителя.',
  },
  {
    id: 'ctr-04',
    frameId: 'Y9Q12',
    title: 'От подключения подрядчика до выплаты',
    description: 'Пять этапов работы по подрядной схеме.',
  },
  {
    id: 'ctr-05',
    frameId: 'lc1hA',
    title: 'Посмотрим, как это работает в WinWork',
    description: 'Переход к демонстрации задания с трёх сторон.',
    nextButtonLabel: 'Показать в WinWork',
  },
].map(
  ({ frameId, ...slide }) =>
    ({
      ...slide,
      type: 'slide',
      pencil: {
        documentPath: `/contracting-slides/${slide.id}.html`,
        frameId,
        height: 1080,
        width: 1920,
      },
    }) satisfies SlideSceneDefinition,
);
