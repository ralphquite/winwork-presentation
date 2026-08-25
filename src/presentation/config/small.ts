import { enterpriseDemoFlows } from '../../demos/flows/enterprise';
import type { DemoFlowDefinition, PresentationConfig } from '../engine/types';

const smallSingleTaskDemo = {
  ...enterpriseDemoFlows.singleTask,
  triggerLabel: 'Перейти к демо: публикация одного задания',
  hotspot: { x: 120, y: 850, width: 560, height: 68 },
} as const satisfies DemoFlowDefinition;

const smallBusinessSlides = [
  {
    frameId: 'aU7uH',
    title: 'WinWork — простой способ работать с внештатными исполнителями',
  },
  {
    frameId: 'f9qZf',
    title:
      'Даже несколько исполнителей быстро превращаются в лишнюю административную работу',
  },
  {
    frameId: 'e7i4JJ',
    title:
      'Базовые правила настраиваются один раз — дальше остаётся короткий ежедневный сценарий',
  },
  {
    frameId: 'X2lgvK',
    title:
      'Весь цикл работы с исполнителем проходит последовательно в одном сервисе',
  },
  {
    frameId: 'VGu00',
    title:
      'Можно работать со своими исполнителями — или найти новых через маркетплейс',
  },
  {
    frameId: 'Khndq',
    title: 'Одиночное задание публикуется без длинного ручного оформления',
    demoFlow: smallSingleTaskDemo,
  },
  {
    frameId: 'gZWhP',
    title: 'После публикации остаётся выбрать подходящего исполнителя',
  },
  {
    frameId: 'c7pel6',
    title:
      'Исполнитель проходит свою часть процесса сам — без постоянной ручной координации',
  },
  {
    frameId: 'HfqGP',
    title:
      'Один раз настроили шаблон — дальше договор и акт формируются автоматически',
  },
  {
    frameId: 'yHEGM',
    title: 'После выполнения задания остается только провести выплату',
  },
  {
    frameId: 'JvJtn',
    title: 'По каждому заданию — документы, выплата и история в одном месте',
  },
  {
    frameId: 'jUKzQ',
    title:
      'Проверки и ограничения встроены в рабочий процесс — не нужно каждый раз начинать проверку вручную',
  },
  {
    frameId: 'AduNG',
    title: 'Для ежедневной работы достаточно 4 простых действий',
  },
  {
    frameId: 'BUbac',
    title:
      'Начните с простого сценария — и работайте с исполнителями без лишней операционки',
  },
] as const;

export const smallPresentation = {
  id: 'small',
  title: 'Малый бизнес',
  scenes: smallBusinessSlides.map((slide, index) => {
    const slideNumber = String(index + 1).padStart(2, '0');

    return {
      id: `smb-${slideNumber}`,
      type: 'slide',
      title: slide.title,
      description: `Small Business slide ${slideNumber} from Pencil.dev.`,
      ...('demoFlow' in slide ? { demoFlow: slide.demoFlow } : {}),
      pencil: {
        documentPath: `/small-slides/smb-${slideNumber}.html`,
        frameId: slide.frameId,
        height: 1080,
        width: 1920,
      },
    } as const;
  }),
} as const satisfies PresentationConfig;
