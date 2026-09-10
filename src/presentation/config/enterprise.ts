import { enterpriseDemoFlows } from '../../demos/flows/enterprise';
import type { PresentationConfig } from '../engine/types';

const enterpriseSlides = [
  {
    id: 'ent-01',
    frameId: 'EFlsu',
    title: 'WinWork для массовой работы с исполнителями',
  },
  {
    id: 'ent-02',
    frameId: 'PA7oy',
    title: 'Большая сеть требует единого управления объектами и исполнителями',
  },
  {
    id: 'ent-03',
    frameId: 'v0FD1i',
    title: 'WinWork объединяет работу головного офиса, объектов и исполнителей',
  },
  {
    id: 'ent-04',
    frameId: 'D5RbJI',
    title: 'Настройте объект один раз и используйте данные во всех заданиях',
    demoFlow: enterpriseDemoFlows.createObject,
  },
  {
    id: 'ent-05',
    frameId: 'AOoMH',
    title: 'Руководитель объекта работает с телефона в рамках своих полномочий',
    demoFlow: enterpriseDemoFlows.managerApp,
  },
  {
    id: 'ent-06',
    frameId: 'L2ehaf',
    title: 'Доступ сотрудников настраивается по ролям',
  },
  {
    id: 'ent-07',
    frameId: 'jpsVw',
    title: 'Для каждого вида работы заранее задаются требования и документы',
    demoFlow: enterpriseDemoFlows.createActivity,
  },
  {
    id: 'ent-08',
    frameId: 'LJWST',
    title: 'Договоры и акты формируются по шаблонам',
    demoFlow: enterpriseDemoFlows.documentTemplates,
  },
  {
    id: 'ent-09',
    frameId: 'QgVx0',
    title: 'Одиночные задания создаются вручную, массовые — из реестра',
    demoFlow: enterpriseDemoFlows.singleTask,
  },
  {
    id: 'ent-10',
    frameId: 'sGz1w',
    title: 'Получайте отклики из маркетплейса и своего пула',
  },
  {
    id: 'ent-11',
    frameId: 'ygsEo',
    title:
      'Подключайте существующих исполнителей и привлекайте новых на объектах',
  },
  {
    id: 'ent-12',
    frameId: 'yGBrt',
    title: 'Допуск к заданию учитывает рейтинг, ограничения и опыт исполнителя',
  },
  {
    id: 'ent-13',
    frameId: 'H5q7pR',
    title: 'Проверки выполняются перед допуском и выплатой',
  },
  {
    id: 'ent-18',
    frameId: 'L4gz5t',
    title: 'Работа с нерезидентами',
  },
  {
    id: 'ent-14',
    frameId: 'o1my1',
    title: 'Правила ограничивают сценарии с риском переквалификации отношений',
  },
  {
    id: 'ent-16',
    frameId: 'iOKdp',
    title: 'Финансы, HR и служба контроля получают данные по своим задачам',
  },
  {
    id: 'ent-17',
    frameId: 'CPLyo',
    title: 'Следующие шаги — от регистрации до начала работы',
  },
] as const;

export const enterprisePresentation = {
  id: 'enterprise',
  title: 'Enterprise / Operations',
  scenes: enterpriseSlides.map((slide, index) => {
    const slideNumber = String(index + 1).padStart(2, '0');

    return {
      id: slide.id,
      type: 'slide',
      title: slide.title,
      description: `Enterprise slide ${slideNumber} from Pencil.dev.`,
      ...('demoFlow' in slide ? { demoFlow: slide.demoFlow } : {}),
      pencil: {
        documentPath: `/enterprise-slides/${slide.id}.html`,
        frameId: slide.frameId,
        height: 1080,
        width: 1920,
      },
    } as const;
  }),
} as const satisfies PresentationConfig;
