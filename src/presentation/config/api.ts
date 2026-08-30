import type { PresentationConfig } from '../engine/types';

const apiSlides = [
  {
    frameId: 'eIQYt',
    title:
      'WinWork API — инфраструктура для работы с исполнителями в вашем продукте',
  },
  {
    frameId: 'HypJR',
    title: 'Сохраните свой интерфейс. Подключите инфраструктуру WinWork',
  },
  {
    frameId: 'vg05h',
    title:
      'Пользователь работает в вашем продукте, а WinWork обрабатывает инфраструктурную часть',
  },
  {
    frameId: 'Y1se2',
    title: 'Команде и исполнителям не нужно работать в двух продуктах',
  },
  {
    frameId: 'lAmWx',
    title: 'Исполнителю не нужно переходить в отдельное приложение WinWork',
  },
  {
    frameId: 'dI7KV',
    title:
      'Проверки можно выполнять в момент принятия решения в вашем продукте',
  },
  {
    frameId: 'vEAm3',
    title:
      'Если задания создаются в вашей системе, текущий процесс можно сохранить',
  },
  {
    frameId: 'b0CeJ',
    title: 'Договоры и акты формируются из данных вашего процесса',
  },
  {
    frameId: 'E6YdfS',
    title: 'Электронное подписание можно встроить в процесс клиента',
  },
  {
    frameId: 'MhloN',
    title:
      'Массовые выплаты можно запускать из вашей системы без ручной сборки в отдельном кабинете',
  },
  {
    frameId: 'N73QW',
    title: 'После выплаты акты и чеки не нужно собирать вручную',
  },
  {
    frameId: 'ML6UB',
    title: 'Статусы, документы и результаты возвращаются в вашу систему учёта',
  },
  {
    frameId: 'vk9i2',
    title: 'Проверки выполняются внутри интеграционного процесса',
  },
  {
    frameId: 'FRVKP',
    title: 'WinWork можно подключить к основной системе учёта клиента',
  },
  {
    frameId: 'n9X4x1',
    title: 'Интеграция строится вокруг текущего процесса клиента',
  },
  {
    frameId: 'b8s1i',
    title:
      'Сохраните текущий интерфейс и подключите инфраструктуру WinWork через API',
  },
] as const;

export const apiPresentation = {
  id: 'api',
  title: 'API / Embedded',
  scenes: apiSlides.map((slide, index) => {
    const slideNumber = String(index + 1).padStart(2, '0');

    return {
      id: `api-${slideNumber}`,
      type: 'slide',
      title: slide.title,
      description: `API / Embedded slide ${slideNumber} from Pencil.dev.`,
      pencil: {
        documentPath: `/api-slides/api-${slideNumber}.html`,
        frameId: slide.frameId,
        height: 1080,
        width: 1920,
      },
    } as const;
  }),
} as const satisfies PresentationConfig;
