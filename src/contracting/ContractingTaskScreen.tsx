import {
  ArrowDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical,
  Search,
  Star,
} from 'lucide-react';
import type { ReactNode } from 'react';

import calendarIcon from '../assets/contracting/desktop/calendar.svg?inline';
import chevronIcon from '../assets/contracting/desktop/chevron.svg?inline';
import type { MarketplaceTask } from '../presentation/flows/marketplaceData';
import { ProductButton } from '../presentation/flows/ProductUI';
import { ContractingSectionHeader, ContractingShell } from './ContractingShell';
import {
  ContractingCreateTaskDrawer,
  ContractingTaskDrawer,
  ContractingTaskSwitch,
} from './ContractingTaskDrawer';
import { clientCompanies, companies, task, type DesktopRole } from './fixtures';
import '../styles/contracting-tasks.css';

export type TaskScreenState =
  | 'marketplace'
  | 'create'
  | 'published'
  | 'customer-task'
  | 'customer-responses'
  | 'orders'
  | 'contractor-task'
  | 'contractor-responses';

export type TaskStatus =
  | 'Опубликовано'
  | 'Есть отклики'
  | 'Выполняется'
  | 'Подтверждено исполнителем'
  | 'Подтверждено подрядчиком'
  | 'Выполнено'
  | 'Оплачено';

type TableStatus = TaskStatus | 'Ожидает оплаты' | 'На модерации';

const TASK_SCREENS: Record<
  TaskScreenState,
  {
    role: DesktopRole;
    status?: TaskStatus;
    panel?: 'create' | 'task' | 'responses';
  }
> = {
  marketplace: { role: 'customer' },
  create: { role: 'customer', panel: 'create' },
  published: { role: 'customer', status: 'Опубликовано' },
  'customer-task': { role: 'customer', status: 'Есть отклики', panel: 'task' },
  'customer-responses': {
    role: 'customer',
    status: 'Есть отклики',
    panel: 'responses',
  },
  orders: { role: 'contractor', status: 'Выполняется' },
  'contractor-task': {
    role: 'contractor',
    status: 'Выполняется',
    panel: 'task',
  },
  'contractor-responses': {
    role: 'contractor',
    status: 'Выполняется',
    panel: 'responses',
  },
};

const TASK_TABS = [
  'Задания',
  'Ожидают оплаты',
  'Активные задания',
  'Завершённые задания',
  'На модерации',
  'Серия заданий',
  'Архив',
] as const;

const STATUS_TONES: Record<TableStatus, string> = {
  Опубликовано: 'progress',
  'Есть отклики': 'responses',
  Выполняется: 'progress',
  'Подтверждено исполнителем': 'progress',
  'Подтверждено подрядчиком': 'progress',
  Выполнено: 'complete',
  Оплачено: 'complete',
  'Ожидает оплаты': 'responses',
  'На модерации': 'moderation',
};

type TaskRow = Omit<MarketplaceTask, 'status'> & {
  counterparty: string;
  status: TableStatus;
};

const SAMPLE_ROWS: Record<DesktopRole, readonly TaskRow[]> = {
  customer: [
    {
      count: '2',
      counterparty: '—',
      created: '20.08.2026',
      number: 'c7b1d9e3',
      performer: '—',
      startDate: '27.08.2026',
      startTime: '09:00',
      status: 'Есть отклики',
      taxId: '',
      title: 'Кладовщик. Инвентаризация зоны хранения',
      total: '12 400,00 ₽',
    },
    {
      count: '1',
      counterparty: '—',
      created: '19.08.2026',
      number: 'd3a5c8f1',
      performer: 'Соколов А. В.',
      startDate: '20.08.2026',
      startTime: '09:00',
      status: 'Ожидает оплаты',
      taxId: '771392486071',
      title: 'Грузчик. Разгрузка утренней поставки',
      total: '12 800,00 ₽',
    },
    {
      count: '1',
      counterparty: '—',
      created: '18.08.2026',
      number: 'a8f2e4b6',
      performer: 'Кузнецова Е. М.',
      startDate: '20.08.2026',
      startTime: '12:00',
      status: 'Выполнено',
      taxId: '773681259402',
      title: 'Комплектовщик. Сборка заказов к отправке',
      total: '8 400,00 ₽',
    },
    {
      count: '1',
      counterparty: '—',
      created: '17.08.2026',
      number: 'f4c8a2d5',
      performer: 'Морозов И. А.',
      startDate: '19.08.2026',
      startTime: '14:30',
      status: 'Оплачено',
      taxId: '770548316975',
      title: 'Работник склада. Сортировка и маркировка товара',
      total: '7 200,00 ₽',
    },
    {
      count: '1',
      counterparty: '—',
      created: '14.08.2026',
      number: 'b6e3c1a9',
      performer: 'Орлов Д. С.',
      startDate: '16.08.2026',
      startTime: '16:00',
      status: 'Оплачено',
      taxId: '771938204651',
      title: 'Грузчик. Погрузка товара в фургон',
      total: '4 800,00 ₽',
    },
  ],
  contractor: [
    {
      count: '2',
      counterparty: clientCompanies.warehouse.name,
      created: '20.08.2026',
      number: 'e2d7f5b4',
      performer: '—',
      startDate: '27.08.2026',
      startTime: '08:30',
      status: 'Есть отклики',
      taxId: '',
      title: 'Сборка заказов для курьеров',
      total: '14 600,00 ₽',
    },
    {
      count: '1',
      counterparty: clientCompanies.supplier.name,
      created: '19.08.2026',
      number: '719eb53d',
      performer: '—',
      startDate: '26.08.2026',
      startTime: '10:00',
      status: 'Опубликовано',
      taxId: '',
      title: 'Упаковка товара к отгрузке',
      total: '6 200,00 ₽',
    },
    {
      count: '1',
      counterparty: clientCompanies.warehouse.name,
      created: '18.08.2026',
      number: '86bf20c4',
      performer: 'Лебедев М. Р.',
      startDate: '25.08.2026',
      startTime: '14:30',
      status: 'Выполняется',
      taxId: '772607314581',
      title: 'Кладовщик. Приёмка поставки и сверка накладных',
      total: '8 900,00 ₽',
    },
    {
      count: '1',
      counterparty: clientCompanies.supplier.name,
      created: '17.08.2026',
      number: '4b3f725e',
      performer: 'Фёдорова Н. А.',
      startDate: '23.08.2026',
      startTime: '11:00',
      status: 'Ожидает оплаты',
      taxId: '772347915806',
      title: 'Маркировка коробов перед отгрузкой',
      total: '5 800,00 ₽',
    },
    {
      count: '1',
      counterparty: clientCompanies.warehouse.name,
      created: '15.08.2026',
      number: '35fc819a',
      performer: 'Беляев П. О.',
      startDate: '20.08.2026',
      startTime: '08:00',
      status: 'Оплачено',
      taxId: '773410687299',
      title: 'Грузчик. Перемещение палет в зону хранения',
      total: '9 500,00 ₽',
    },
  ],
};

type TableColumn = {
  className: string;
  header: ReactNode;
  label?: string;
  cell: (row: TaskRow) => ReactNode;
};

const TABLE_COLUMNS = {
  select: {
    className: 'is-select',
    header: <input aria-label="Выбрать все задания" disabled type="checkbox" />,
    cell: (row) => (
      <input
        aria-label={`Выбрать задание ${row.number}`}
        disabled
        type="checkbox"
      />
    ),
  },
  created: {
    className: 'is-created',
    header: (
      <span className="contracting-task-sort">
        Создан <ArrowDown aria-hidden="true" size={13} />
      </span>
    ),
    cell: (row) => row.created,
  },
  start: {
    className: 'is-start',
    header: 'Начало',
    cell: (row) => (
      <span className="ww-marketplace-cell-stack">
        <span>{row.startDate}</span>
        <small>{row.startTime}</small>
      </span>
    ),
  },
  number: {
    className: 'is-number',
    header: 'Номер задания',
    cell: (row) => row.number,
  },
  performer: {
    className: 'is-performer',
    header: 'Исполнитель',
    cell: (row) => (
      <span className="ww-marketplace-cell-stack">
        <span className="contracting-task-performer-name">
          {row.taxId ? (
            <Star aria-hidden="true" fill="currentColor" size={12} />
          ) : null}
          {row.performer}
        </span>
        {row.taxId ? <small>{row.taxId}</small> : null}
      </span>
    ),
  },
  count: { className: 'is-count', header: 'Кол-во', cell: (row) => row.count },
  title: {
    className: 'is-title',
    header: 'Название задания',
    cell: (row) => row.title,
  },
  total: { className: 'is-total', header: 'Итого', cell: (row) => row.total },
  series: { className: 'is-series', header: 'Серия', cell: () => '—' },
  status: {
    className: 'is-status',
    header: 'Статус',
    cell: (row) => (
      <span className={`ww-marketplace-status is-${STATUS_TONES[row.status]}`}>
        {row.status}
      </span>
    ),
  },
  contractor: {
    className: 'is-party',
    header: 'Подрядчик',
    cell: (row) => row.counterparty,
  },
  customer: {
    className: 'is-party',
    header: 'Клиент',
    cell: (row) => row.counterparty,
  },
  actions: {
    className: 'is-actions',
    header: null,
    label: 'Действия',
    cell: (row) => (
      <button
        aria-disabled="true"
        tabIndex={-1}
        aria-label={`Действия задания ${row.number}`}
        className="ww-marketplace-row-actions"
        type="button"
      >
        <MoreVertical aria-hidden="true" size={17} />
      </button>
    ),
  },
} satisfies Record<string, TableColumn>;

const ROLE_COLUMNS: Record<DesktopRole, readonly TableColumn[]> = {
  customer: [
    TABLE_COLUMNS.select,
    TABLE_COLUMNS.created,
    TABLE_COLUMNS.start,
    TABLE_COLUMNS.number,
    TABLE_COLUMNS.performer,
    TABLE_COLUMNS.count,
    TABLE_COLUMNS.title,
    TABLE_COLUMNS.total,
    TABLE_COLUMNS.series,
    TABLE_COLUMNS.status,
    TABLE_COLUMNS.contractor,
    TABLE_COLUMNS.actions,
  ],
  contractor: [
    TABLE_COLUMNS.select,
    TABLE_COLUMNS.created,
    TABLE_COLUMNS.start,
    TABLE_COLUMNS.customer,
    TABLE_COLUMNS.title,
    TABLE_COLUMNS.number,
    TABLE_COLUMNS.performer,
    TABLE_COLUMNS.count,
    TABLE_COLUMNS.total,
    TABLE_COLUMNS.series,
    TABLE_COLUMNS.status,
    TABLE_COLUMNS.actions,
  ],
};

function TaskSearch({ label }: { label: string }) {
  return (
    <div className="ww-marketplace-worker-search">
      <label>
        <Search aria-hidden="true" size={19} />
        <input aria-label={label} placeholder={label} disabled type="search" />
      </label>
      <button
        aria-disabled="true"
        tabIndex={-1}
        aria-label={`Поиск: ${label}`}
        type="button"
      >
        <Search aria-hidden="true" size={19} />
      </button>
    </div>
  );
}

function TaskFilters({ role }: { role: DesktopRole }) {
  const customer = role === 'customer';

  return (
    <div className="ww-marketplace-filters">
      <TaskSearch
        label={
          customer
            ? 'Название или номер задания'
            : 'Название, номер задания, клиент'
        }
      />
      {customer ? <TaskSearch label="ФИО или ИНН исполнителя" /> : null}
      <button
        aria-disabled="true"
        tabIndex={-1}
        className="ww-marketplace-date"
        type="button"
      >
        <img alt="" src={calendarIcon} />
        <span>
          <small>Календарь</small>
          <strong>За всё время</strong>
        </span>
        <img alt="" src={chevronIcon} />
      </button>
      <label className="ww-marketplace-status-filter">
        <span>
          <small>Статусы</small>
          <select aria-label="Статус задания" disabled>
            <option>Все статусы</option>
          </select>
        </span>
      </label>
    </div>
  );
}

function TaskTable({
  highlightTask,
  role,
  status,
}: {
  highlightTask: boolean;
  role: DesktopRole;
  status?: TaskStatus;
}) {
  const columns = ROLE_COLUMNS[role];
  const assigned = status !== 'Опубликовано' && status !== 'Есть отклики';
  const sampleRows = SAMPLE_ROWS[role];
  const rows = status
    ? [
        {
          count: '1',
          counterparty:
            role === 'customer'
              ? companies.contractor.name
              : companies.customer.name,
          created: task.created,
          number: task.number,
          performer: assigned ? task.performer.name : '—',
          startDate: task.startDate,
          startTime: task.startTime,
          status,
          taxId: assigned ? task.performer.taxId : '',
          title: task.title,
          total: task.total,
        },
        ...sampleRows,
      ]
    : sampleRows;

  return (
    <div className="ww-marketplace-table-shell">
      <table>
        <caption className="sr-only">
          {role === 'customer'
            ? 'Список заданий Маркетплейса'
            : 'Задания клиентов'}
        </caption>
        <colgroup>
          {columns.map((column) => (
            <col className={column.className} key={column.className} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                aria-label={column.label}
                className={column.className}
                key={column.className}
                scope="col"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              className={
                row.number === task.number ? 'is-current-task' : undefined
              }
              data-contracting-hint={
                highlightTask && row.number === task.number ? '' : undefined
              }
              key={row.number}
            >
              {columns.map((column) => (
                <td className={column.className} key={column.className}>
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <footer>
        <label>
          <span>На странице:</span>
          <select aria-label="Количество заданий на странице" disabled>
            <option>10</option>
          </select>
        </label>
        <nav aria-label="Пагинация заданий">
          <button aria-label="Первая страница" disabled type="button">
            <ChevronsLeft aria-hidden="true" size={17} />
          </button>
          <button aria-label="Предыдущая страница" disabled type="button">
            <ChevronLeft aria-hidden="true" size={17} />
          </button>
          <input aria-label="Текущая страница" disabled value="1" />
          <span>/ 1</span>
          <button aria-label="Следующая страница" disabled type="button">
            <ChevronRight aria-hidden="true" size={17} />
          </button>
          <button aria-label="Последняя страница" disabled type="button">
            <ChevronsRight aria-hidden="true" size={17} />
          </button>
        </nav>
      </footer>
    </div>
  );
}

export function ContractingTaskWorkspace({
  hint,
  role,
  status,
  overlay,
}: {
  hint?: 'place-order' | 'open-task';
  role: DesktopRole;
  status?: TaskStatus;
  overlay?: ReactNode;
}) {
  const customer = role === 'customer';
  const tabs = customer ? ['Реестры', ...TASK_TABS] : TASK_TABS;

  return (
    <ContractingShell
      overlay={overlay}
      role={role}
      section={customer ? 'marketplace' : 'orders'}
    >
      <div className={`contracting-task-workspace is-${role}`}>
        {customer ? (
          <section className="ww-marketplace-heading">
            <h1>Маркетплейс</h1>
            <div className="ww-marketplace-heading-actions">
              <ProductButton
                aria-disabled="true"
                data-contracting-hint={hint === 'place-order' ? '' : undefined}
                tabIndex={-1}
              >
                Разместить заказ <ChevronDown aria-hidden="true" size={19} />
              </ProductButton>
              <ProductButton
                aria-disabled="true"
                tabIndex={-1}
                variant="secondary"
              >
                Реестр на редактирование
              </ProductButton>
            </div>
          </section>
        ) : (
          <ContractingSectionHeader section="orders" />
        )}
        <div
          aria-label="Категории заданий"
          className="ww-marketplace-tabs"
          role="tablist"
        >
          {tabs.map((tab) => (
            <button
              aria-disabled="true"
              tabIndex={-1}
              aria-selected={tab === 'Задания'}
              key={tab}
              role="tab"
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>
        <TaskFilters role={role} />
        {customer ? (
          <ContractingTaskSwitch
            checked={false}
            label="Показать задания только по подрядной схеме"
          />
        ) : null}
        <TaskTable
          highlightTask={hint === 'open-task'}
          role={role}
          status={status}
        />
      </div>
    </ContractingShell>
  );
}

export function ContractingTaskScreen({ state }: { state: TaskScreenState }) {
  const { role, status, panel } = TASK_SCREENS[state];
  const overlay =
    panel === 'create' ? (
      <ContractingCreateTaskDrawer />
    ) : panel ? (
      <ContractingTaskDrawer role={role} tab={panel} />
    ) : undefined;

  return (
    <ContractingTaskWorkspace
      hint={
        state === 'marketplace'
          ? 'place-order'
          : state === 'orders'
            ? 'open-task'
            : undefined
      }
      key={state}
      overlay={overlay}
      role={role}
      status={status}
    />
  );
}
