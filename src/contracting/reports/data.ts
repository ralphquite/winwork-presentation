import { clientCompanies, companies, type DesktopRole } from '../fixtures';

const takt = { id: 'takt', name: companies.contractor.name };
const warehouse = { id: 'warehouse', name: clientCompanies.warehouse.name };
const supplier = { id: 'supplier', name: clientCompanies.supplier.name };

export const counterparties = {
  customer: [
    takt,
    { id: 'contour', name: 'ООО «Контур Смен»' },
    { id: 'vector', name: 'ООО «Вектор Комплект»' },
  ],
  contractor: [
    { id: 'quiet', name: companies.customer.name },
    warehouse,
    supplier,
  ],
} satisfies Record<DesktopRole, { id: string; name: string }[]>;

export const statuses = {
  done: 'Завершено',
  payment: 'Ожидает оплаты',
  review: 'На подтверждении',
  active: 'Выполняется',
  published: 'Опубликовано',
  cancelled: 'Отменено',
} as const;

type Status = keyof typeof statuses;
export const reportTypes = ['tasks', 'summary'] as const;
export type ReportType = (typeof reportTypes)[number];
export type ReportOptions = {
  name?: string;
  type: ReportType;
  party: string;
  from: string;
  to: string;
  statuses: Status[];
};

type Task = {
  id: string;
  date: string;
  party: string;
  title: string;
  site: string;
  status: Status;
  amount: number;
};

const sharedTasks = [
  [
    '4108',
    '2026-11-12',
    'Инвентаризация остатков',
    'Склад «Тихий ряд»',
    'active',
    28000,
  ],
  [
    '4103',
    '2026-11-07',
    'Комплектовка заказов',
    'Склад «Тихий ряд»',
    'done',
    22400,
  ],
  [
    '4101',
    '2026-11-04',
    'Разгрузка поставки',
    'Склад «Тихий ряд»',
    'done',
    14560,
  ],
  [
    '4016',
    '2026-10-28',
    'Маркировка коробов',
    'Склад «Тихий ряд»',
    'done',
    16240,
  ],
] as const;

function taskRows(
  party: string,
  rows: readonly (readonly [string, string, string, string, Status, number])[],
): Task[] {
  return rows.map(([id, date, title, site, status, amount]) => ({
    id: 'ПС-' + id,
    date,
    party,
    title,
    site,
    status,
    amount,
  }));
}

const work = {
  customer: [
    ...taskRows('takt', sharedTasks),
    ...taskRows('contour', [
      [
        '4109',
        '2026-11-14',
        'Сборка стеллажей',
        'РЦ «Секция 4»',
        'payment',
        38400,
      ],
      [
        '4106',
        '2026-11-10',
        'Размещение товара',
        'РЦ «Секция 4»',
        'done',
        18600,
      ],
      [
        '4102',
        '2026-11-05',
        'Сортировка возвратов',
        'РЦ «Секция 4»',
        'done',
        12100,
      ],
      [
        '4011',
        '2026-10-22',
        'Обработка возвратов',
        'РЦ «Секция 4»',
        'done',
        9300,
      ],
    ]),
    ...taskRows('vector', [
      [
        '4111',
        '2026-11-15',
        'Упаковка отгрузки',
        'Объект «Запад»',
        'published',
        24500,
      ],
      [
        '4107',
        '2026-11-11',
        'Подготовка палет',
        'Объект «Запад»',
        'review',
        17800,
      ],
      [
        '4104',
        '2026-11-08',
        'Переупаковка товара',
        'Объект «Запад»',
        'cancelled',
        9500,
      ],
      ['4100', '2026-11-02', 'Приёмка тары', 'Объект «Запад»', 'done', 7850],
      [
        '4013',
        '2026-10-24',
        'Сверка маркировки',
        'Объект «Запад»',
        'done',
        10600,
      ],
    ]),
  ],
  contractor: [
    ...taskRows('quiet', sharedTasks),
    ...taskRows('warehouse', [
      [
        '4116',
        '2026-11-15',
        'Инвентаризация секции А',
        'Склад «Северный»',
        'payment',
        19200,
      ],
      [
        '4114',
        '2026-11-11',
        'Комплектовка отгрузки',
        'Склад «Северный»',
        'done',
        17600,
      ],
      [
        '4113',
        '2026-11-09',
        'Разбор возвратов',
        'Склад «Северный»',
        'done',
        12500,
      ],
      [
        '4015',
        '2026-10-25',
        'Маркировка секции Б',
        'Склад «Северный»',
        'done',
        9900,
      ],
    ]),
    ...taskRows('supplier', [
      [
        '4117',
        '2026-11-16',
        'Погрузка материалов',
        'База «Медный лист»',
        'published',
        16000,
      ],
      [
        '4115',
        '2026-11-13',
        'Подготовка груза',
        'База «Медный лист»',
        'review',
        10200,
      ],
      [
        '4112',
        '2026-11-06',
        'Приёмка материалов',
        'База «Медный лист»',
        'done',
        21500,
      ],
      [
        '4012',
        '2026-10-23',
        'Сортировка материалов',
        'База «Медный лист»',
        'cancelled',
        8000,
      ],
    ]),
  ],
} satisfies Record<DesktopRole, Task[]>;

export const defaultPeriod = { from: '2026-11-01', to: '2026-11-16' };
export const date = (value: string) => value.split('-').reverse().join('.');
export const period = ({ from, to }: { from: string; to: string }) =>
  `${date(from)} — ${date(to)}`;
const currencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});
export const money = (value: number) => currencyFormatter.format(value);

export const partyLabel = (role: DesktopRole) =>
  role === 'customer' ? 'Подрядчик' : 'Клиент';
export const reportType = (role: DesktopRole, type: ReportType) =>
  type === 'tasks'
    ? 'Реестр заданий'
    : role === 'customer'
      ? 'Сводка по подрядчикам'
      : 'Сводка по клиентам';
export const allParties = (role: DesktopRole) =>
  role === 'customer' ? 'Все подрядчики' : 'Все клиенты';
export function partyName(role: DesktopRole, id: string) {
  return (
    counterparties[role].find((party) => party.id === id)?.name ??
    allParties(role)
  );
}

export function selectTasks(role: DesktopRole, options: ReportOptions) {
  return work[role]
    .filter(
      (task) =>
        (!options.party || task.party === options.party) &&
        task.date >= options.from &&
        task.date <= options.to &&
        (!options.statuses.length || options.statuses.includes(task.status)),
    )
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
}

function totals(tasks: Task[]) {
  return tasks.reduce(
    (total, task) => ({
      count: total.count + 1,
      completed: total.completed + Number(task.status === 'done'),
      payable: total.payable + (task.status === 'payment' ? task.amount : 0),
      paid: total.paid + (task.status === 'done' ? task.amount : 0),
    }),
    { count: 0, completed: 0, payable: 0, paid: 0 },
  );
}

export type Report = {
  id: string;
  role: DesktopRole;
  createdAt: number;
  readyAt: number;
  options: ReportOptions;
};

export function reportTitle(report: Report) {
  return (
    report.options.name?.trim() || suggestedName(report.role, report.options)
  );
}

export function suggestedName(role: DesktopRole, options: ReportOptions) {
  return `${reportType(role, options.type)} · ${partyName(role, options.party)} · ${period(options)}`;
}

export function createdDate(value: number) {
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'short',
    timeZone: 'Asia/Bangkok',
  }).format(value);
}

export function createdTime(value: number) {
  return new Intl.DateTimeFormat('ru-RU', {
    timeStyle: 'short',
    timeZone: 'Asia/Bangkok',
  }).format(value);
}

export const initialReports = (['customer', 'contractor'] as const).flatMap(
  (role) => {
    const october = { from: '2026-10-01', to: '2026-10-31' };
    const examples: [number, number, ReportOptions][] = [
      [
        16,
        6,
        { type: 'tasks', party: '', ...defaultPeriod, statuses: ['done'] },
      ],
      [16, 5, { type: 'summary', party: '', ...defaultPeriod, statuses: [] }],
      [
        15,
        4,
        {
          type: 'tasks',
          party: role === 'customer' ? 'contour' : warehouse.id,
          ...defaultPeriod,
          to: '2026-11-14',
          statuses: [],
        },
      ],
      [2, 4, { type: 'summary', party: '', ...october, statuses: [] }],
    ];
    return examples.map(([day, utcHour, options], index) => {
      const createdAt = Date.UTC(2026, 10, day, utcHour, 30);
      return {
        id: 'demo-' + (index + 1),
        role,
        createdAt,
        readyAt: createdAt,
        options,
      };
    });
  },
);

export type Column = { label: string; format?: 'money' | 'date' | 'status' };
export type Cell = string | number;

export function reportData(role: DesktopRole, options: ReportOptions) {
  const tasks = selectTasks(role, options);
  const party = { label: partyLabel(role) };
  const columns: Column[] =
    options.type === 'tasks'
      ? [
          { label: '№ задания' },
          { label: 'Задание / объект' },
          party,
          { label: 'Дата начала', format: 'date' },
          { label: 'Статус', format: 'status' },
          { label: 'Сумма, ₽', format: 'money' },
        ]
      : [
          party,
          { label: 'Всего заданий' },
          { label: 'Завершено' },
          { label: 'Ожидает оплаты, ₽', format: 'money' },
          { label: 'Оплачено, ₽', format: 'money' },
        ];
  const rows: Cell[][] =
    options.type === 'tasks'
      ? tasks.map((task) => [
          task.id,
          task.title + '\n' + task.site,
          partyName(role, task.party),
          task.date,
          task.status,
          task.amount,
        ])
      : counterparties[role].flatMap(({ id, name }) => {
          const group = tasks.filter((task) => task.party === id);
          const result = totals(group);
          return result.count
            ? [
                [
                  name,
                  result.count,
                  result.completed,
                  result.payable,
                  result.paid,
                ],
              ]
            : [];
        });
  return { columns, rows, totals: totals(tasks) };
}

export function displayCell(value: Cell, column: Column): Cell {
  if (column.format === 'status') return statuses[value as Status];
  if (column.format === 'date') return date(String(value));
  if (column.format === 'money') return money(Number(value));
  return value;
}
