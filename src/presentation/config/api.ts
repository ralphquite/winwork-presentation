import type { PresentationConfig } from '../engine/types';

const apiSlides = [
  {
    id: 'api-01',
    frameId: 'eIQYt',
    title:
      'WinWork API — инфраструктура для работы с исполнителями в вашем продукте',
  },
  {
    id: 'api-02',
    frameId: 'HypJR',
    title: 'Сохраните свой интерфейс. Подключите инфраструктуру WinWork',
  },
  {
    id: 'api-03',
    frameId: 'vg05h',
    title:
      'Пользователь работает в вашем продукте, а WinWork обрабатывает инфраструктурную часть',
  },
  {
    id: 'api-04',
    frameId: 'Y1se2',
    title: 'Исполнителям не нужно работать в двух продуктах',
  },
  {
    id: 'api-05',
    frameId: 'hLUa8',
    title: 'После регистрации исполнитель продолжает работу в вашем продукте',
  },
  {
    id: 'api-06',
    frameId: 'dI7KV',
    title:
      'Проверки можно выполнять в момент принятия решения в вашем продукте',
  },
  {
    id: 'api-12',
    frameId: 'ML6UB',
    title: 'Статусы, документы и результаты возвращаются в вашу систему учёта',
  },
  {
    id: 'api-15',
    frameId: 'n9X4x1',
    title: 'Интеграция строится вокруг текущего процесса клиента',
  },
  {
    id: 'api-17',
    frameId: 'TQWD8',
    title: 'Следующие шаги — от регистрации до начала работы',
  },
] as const;

export const apiPresentation = {
  id: 'api',
  title: 'API / Embedded',
  scenes: apiSlides.map((slide, index) => {
    const position = String(index + 1).padStart(2, '0');

    return {
      id: slide.id,
      type: 'slide',
      title: slide.title,
      description: `API / Embedded slide ${position} from Pencil.dev.`,
      pencil: {
        documentPath: `/api-slides/${slide.id}.html`,
        frameId: slide.frameId,
        height: 1080,
        width: 1920,
      },
    } as const;
  }),
} as const satisfies PresentationConfig;
