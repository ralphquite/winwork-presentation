import { enterpriseDemoFlows } from '../../demos/flows/enterprise';
import type { PresentationConfig } from '../engine/types';

const enterpriseSlides = [
  {
    frameId: 'EFlsu',
    title: 'WinWork для массовой работы с исполнителями',
  },
  {
    frameId: 'PA7oy',
    title: 'Большая сеть требует единого управления объектами и исполнителями',
  },
  {
    frameId: 'v0FD1i',
    title: 'WinWork объединяет работу головного офиса, объектов и исполнителей',
  },
  {
    frameId: 'D5RbJI',
    title: 'Настройте объект один раз и используйте данные во всех заданиях',
    demoFlow: enterpriseDemoFlows.createObject,
  },
  {
    frameId: 'AOoMH',
    title: 'Руководитель объекта работает с телефона в рамках своих полномочий',
    demoFlow: enterpriseDemoFlows.managerApp,
  },
  {
    frameId: 'L2ehaf',
    title: 'Доступ сотрудников настраивается по ролям',
  },
  {
    frameId: 'jpsVw',
    title: 'Для каждого вида работы заранее задаются требования и документы',
    demoFlow: enterpriseDemoFlows.createActivity,
  },
  {
    frameId: 'LJWST',
    title: 'Договоры и акты формируются по шаблонам',
    demoFlow: enterpriseDemoFlows.documentTemplates,
  },
  {
    frameId: 'QgVx0',
    title: 'Одиночные задания создаются вручную, массовые — из реестра',
    demoFlow: enterpriseDemoFlows.singleTask,
  },
  {
    frameId: 'pQ5Rl',
    title: 'Подключите существующий пул исполнителей массово',
  },
  {
    frameId: 'mCXhB',
    title: 'Используйте свой пул и маркетплейс в одном процессе',
  },
  {
    frameId: 'PgLFk',
    title: 'Массовые выплаты и документы обрабатываются по одному реестру',
  },
  {
    frameId: 'H5q7pR',
    title: 'Проверки выполняются перед допуском и выплатой',
  },
  {
    frameId: 'o1my1',
    title: 'Правила ограничивают сценарии с риском переквалификации отношений',
  },
  {
    frameId: 'Fy5Vy',
    title:
      'Приглашение исполнителя в штат можно настроить по заданным условиям',
  },
  {
    frameId: 'yGBrt',
    title: 'Допуск к заданию учитывает рейтинг и ограничения',
  },
  {
    frameId: 'knW5q',
    title: 'WinWork можно встроить в существующие системы через API',
  },
  {
    frameId: 'iOKdp',
    title: 'Финансы, HR и служба контроля получают данные по своим задачам',
  },
  {
    frameId: 'ygsEo',
    title:
      'Подключайте существующих исполнителей и привлекайте новых на объектах',
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
