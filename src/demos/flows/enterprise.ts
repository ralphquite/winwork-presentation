import type { DemoFlowDefinition } from '../../presentation/engine/types';

export const enterpriseDemoFlows = {
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
} as const satisfies Record<string, DemoFlowDefinition>;
