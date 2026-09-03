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
    title: 'WinWork для работы с внештатными исполнителями',
  },
  {
    frameId: 'f9qZf',
    title:
      'Работа даже с несколькими исполнителями создаёт административную нагрузку',
  },
  {
    frameId: 'e7i4JJ',
    title:
      'Основные параметры настраиваются один раз и используются в каждом задании',
  },
  {
    frameId: 'X2lgvK',
    title: 'Весь цикл работы с исполнителем проходит в WinWork',
  },
  {
    frameId: 'VGu00',
    title:
      'Работайте со своими исполнителями или находите новых в маркетплейсе',
  },
  {
    frameId: 'Khndq',
    title: 'Создайте и опубликуйте одно задание за три шага',
    demoFlow: smallSingleTaskDemo,
  },
  {
    frameId: 'gZWhP',
    title: 'Выберите исполнителя из откликов',
  },
  {
    frameId: 'c7pel6',
    title:
      'Исполнитель самостоятельно регистрируется, подписывает документы и меняет статусы',
  },
  {
    frameId: 'HfqGP',
    title: 'Договор и акт формируются по настроенным шаблонам',
  },
  {
    frameId: 'yHEGM',
    title: 'После приёмки работы проведите выплату',
  },
  {
    frameId: 'JvJtn',
    title: 'Документы, выплата и история хранятся в карточке задания',
  },
  {
    frameId: 'AduNG',
    title: 'Ежедневная работа состоит из четырёх действий',
  },
  {
    frameId: 'iaGLr',
    title: 'Следующие шаги — от регистрации до начала работы',
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
