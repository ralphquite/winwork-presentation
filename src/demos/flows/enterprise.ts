import type { DemoFlowDefinition } from '../../presentation/engine/types';

export const enterpriseDemoFlows = {
  registration: {
    id: 'registration',
    title: 'Регистрация юридического лица',
    triggerLabel: 'Показать в WinWork: регистрация юридического лица',
    // This flow is opened only from the landing-page QA panel.
    hotspot: { x: 0, y: 0, width: 0, height: 0 },
  },
  performerRegistration: {
    id: 'performer-registration',
    title: 'Flow регистрации исполнителя',
    triggerLabel: 'Показать flow регистрации исполнителя',
    // This screenshot-based flow is opened only from the landing-page QA panel.
    hotspot: { x: 0, y: 0, width: 0, height: 0 },
  },
  createObject: {
    id: 'create-object',
    title: 'Создание объекта',
    triggerLabel: 'Показать в WinWork: создание объекта',
    hotspot: { x: 120, y: 916, width: 507, height: 68 },
  },
  managerApp: {
    id: 'manager-app',
    title: 'Работа управляющего',
    triggerLabel: 'Перейти к демо: работа управляющего',
    hotspot: { x: 120, y: 915, width: 790, height: 68 },
  },
  createActivity: {
    id: 'create-activity',
    title: 'Создание вида деятельности',
    triggerLabel: 'Показать в WinWork: создание вида деятельности',
    hotspot: { x: 1202, y: 835, width: 614, height: 68 },
  },
  documentTemplates: {
    id: 'document-templates',
    title: 'Шаблоны договора и акта',
    triggerLabel: 'Показать в WinWork: шаблон договора и акта',
    hotspot: { x: 120, y: 896, width: 567, height: 68 },
  },
  singleTask: {
    id: 'single-task',
    title: 'Создание одиночного задания',
    triggerLabel: 'Показать в WinWork: создание одиночного задания',
    hotspot: { x: 120, y: 916, width: 760, height: 68 },
  },
  performerSelection: {
    id: 'performer-selection',
    title: 'Flow выбора исполнителя',
    triggerLabel: 'Показать в WinWork: выбор исполнителя по откликам',
    // This flow is opened only from the landing-page QA panel.
    hotspot: { x: 0, y: 0, width: 0, height: 0 },
  },
  taskPayment: {
    id: 'task-payment',
    title: 'Оплата выполненного задания',
    triggerLabel: 'Показать в WinWork: оплата выполненного задания',
    // Quick access uses zero bounds; track configs may override them.
    hotspot: { x: 0, y: 0, width: 0, height: 0 },
  },
} as const satisfies Record<string, DemoFlowDefinition>;
