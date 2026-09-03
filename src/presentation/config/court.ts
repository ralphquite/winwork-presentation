import { enterpriseDemoFlows } from '../../demos/flows/enterprise';
import type { PresentationConfig } from '../engine/types';

const customerRegistrationFlow = {
  ...enterpriseDemoFlows.registration,
  hotspot: { x: 1190, y: 468, width: 576, height: 68 },
  triggerLabel: 'Показать процесс регистрации заказчика',
} as const;

const singleTaskFlow = {
  ...enterpriseDemoFlows.singleTask,
  hotspot: { x: 1190, y: 552, width: 576, height: 68 },
  triggerLabel: 'Показать процесс размещения задания',
} as const;

const performerRegistrationFlow = {
  ...enterpriseDemoFlows.performerRegistration,
  hotspot: { x: 104, y: 584, width: 423, height: 76 },
  triggerLabel: 'Показать путь исполнителя',
} as const;

const paymentConfirmationFlow = {
  ...enterpriseDemoFlows.taskPayment,
  hotspot: { x: 1328, y: 870, width: 488, height: 76 },
  triggerLabel: 'Показать подтверждение оплаты задания',
} as const;

const performerSelectionFlow = {
  ...enterpriseDemoFlows.performerSelection,
  hotspot: { x: 1358, y: 723, width: 458, height: 76 },
  triggerLabel: 'Показать выбор исполнителей',
} as const;

const courtSlides = [
  {
    title: 'WinWork — сервис для поиска подработки',
    externalLinks: [
      {
        bounds: { x: 1104, y: 530, width: 669, height: 72 },
        href: 'https://npd.nalog.ru/aggregators/',
        label: 'Открыть официальный перечень операторов ФНС России',
      },
    ],
  },
  {
    title: 'Открытая регистрация для заказчиков',
    demoFlows: [customerRegistrationFlow, singleTaskFlow],
  },
  {
    title: 'Открытый доступ для исполнителей',
    demoFlows: [performerRegistrationFlow],
  },
  {
    title: 'Выбор исполнителей из откликов',
    demoFlows: [performerSelectionFlow],
  },
  {
    title: 'Подтверждение оплаты и уплата НПД',
    demoFlows: [paymentConfirmationFlow],
  },
] as const;

export const courtPresentation = {
  homePath: null,
  id: 'court',
  title: 'Открытая презентация',
  scenes: courtSlides.map((slide, index) => {
    const slideNumber = String(index + 1).padStart(2, '0');

    return {
      id: `court-${slideNumber}`,
      type: 'slide',
      title: slide.title,
      description: `Open court presentation slide ${slideNumber}.`,
      ...('externalLinks' in slide
        ? { externalLinks: slide.externalLinks }
        : {}),
      ...('demoFlows' in slide ? { demoFlows: slide.demoFlows } : {}),
      pencil: {
        documentPath: `/court-slides/court-${slideNumber}.html`,
        frameId: `court-${slideNumber}`,
        height: 1080,
        width: 1920,
      },
    } as const;
  }),
} as const satisfies PresentationConfig;
