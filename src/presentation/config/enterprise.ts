import { enterpriseDemoFlows } from '../../demos/flows/enterprise';
import type { PresentationConfig } from '../engine/types';

const enterpriseSlides = [
  {
    frameId: 'EFlsu',
    title: 'WinWork для массовой работы с исполнителями',
  },
  {
    frameId: 'PA7oy',
    title:
      'Когда объектов и исполнителей много, проблема уже не в найме — а в управлении системой',
  },
  {
    frameId: 'v0FD1i',
    title:
      'WinWork превращает распределённую работу в единый управляемый контур',
  },
  {
    frameId: 'D5RbJI',
    title: 'Настройте объект один раз — и не собирайте каждый заказ заново',
    demoFlow: enterpriseDemoFlows.createObject,
  },
  {
    frameId: 'AOoMH',
    title:
      'Локальный руководитель управляет объектом с телефона — но только в разрешённых рамках',
    demoFlow: enterpriseDemoFlows.managerApp,
  },
  {
    frameId: 'L2ehaf',
    title: 'Полномочия распределяются по ролям, а не передаются «на доверии»',
  },
  {
    frameId: 'jpsVw',
    title: 'Каждый тип работы заранее превращается в управляемый шаблон',
    demoFlow: enterpriseDemoFlows.createActivity,
  },
  {
    frameId: 'LJWST',
    title: 'Договоры и акты создаются автоматически под конкретный тип работы',
    demoFlow: enterpriseDemoFlows.documentTemplates,
  },
  {
    frameId: 'QgVx0',
    title: 'Одно задание — вручную. Тысячи — реестром',
    demoFlow: enterpriseDemoFlows.singleTask,
  },
  {
    frameId: 'pQ5Rl',
    title:
      'Не нужно начинать с нуля: существующий пул исполнителей подключается массово',
  },
  {
    frameId: 'mCXhB',
    title:
      'Работайте со своим проверенным пулом — и расширяйте его через маркетплейс',
  },
  {
    frameId: 'PgLFk',
    title:
      'После выполнения работы выплаты и документы не превращаются во второй ручной процесс',
  },
  {
    frameId: 'H5q7pR',
    title:
      'Контроль рисков встроен в процесс — проверка происходит тогда, когда принимается решение',
  },
  {
    frameId: 'o1my1',
    title:
      'Система ограничивает сценарии, которые увеличивают риск переквалификации отношений',
  },
  {
    frameId: 'Fy5Vy',
    title:
      'Если сотрудничество становится постоянным, переход в штат — тоже управляемый процесс',
  },
  {
    frameId: 'yGBrt',
    title:
      'Масштабировать пул исполнителей можно без потери контроля над качеством',
  },
  {
    frameId: 'knW5q',
    title:
      'Если процессы уже живут в вашей системе, WinWork работает как инфраструктурный слой',
  },
  {
    frameId: 'iOKdp',
    title:
      'После масштабирования процесс остаётся прозрачным для финансов, HR и контроля соответствия требованиям',
  },
  {
    frameId: 'ygsEo',
    title:
      'Подключайте своих исполнителей — и привлекайте новых прямо на объектах',
  },
] as const;

export const enterprisePresentation = {
  id: 'enterprise',
  title: 'Enterprise / Operations',
  scenes: enterpriseSlides.map((slide, index) => {
    const slideNumber = String(index + 1).padStart(2, '0');

    return {
      id: `ent-${slideNumber}`,
      type: 'slide',
      title: slide.title,
      description: `Enterprise slide ${slideNumber} from Pencil.dev.`,
      ...('demoFlow' in slide ? { demoFlow: slide.demoFlow } : {}),
      pencil: {
        documentPath: `/enterprise-slides/ent-${slideNumber}.html`,
        frameId: slide.frameId,
        height: 1080,
        width: 1920,
      },
    } as const;
  }),
} as const satisfies PresentationConfig;
