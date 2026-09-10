import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  MoreVertical,
  Search,
  X,
} from 'lucide-react';
import type { ReactNode } from 'react';

import { MARKETPLACE_TASKS, type MarketplaceTask } from './marketplaceData';
import { ProductButton } from './ProductUI';

const MARKETPLACE_TABS = [
  'Задания',
  'Ожидают оплаты',
  'Активные задания',
  'Завершенные задания',
  'На модерации',
  'Архив',
] as const;

function MarketplaceFilters() {
  return (
    <div className="ww-marketplace-filters">
      <label className="ww-marketplace-search">
        <Search aria-hidden="true" size={20} />
        <input
          aria-label="Название или номер задания"
          placeholder="Название или номер задания"
        />
      </label>
      <div className="ww-marketplace-worker-search">
        <label>
          <Search aria-hidden="true" size={20} />
          <input
            aria-label="ФИО или ИНН исполнителя"
            placeholder="ФИО или ИНН исполнителя"
          />
        </label>
        <button aria-label="Найти исполнителя" type="button">
          <Search aria-hidden="true" size={20} />
        </button>
      </div>
      <button className="ww-marketplace-date" type="button">
        <CalendarDays aria-hidden="true" size={19} />
        <span>
          <small>Календарь</small>
          <strong>10.08.2026 — 09.09.2026</strong>
        </span>
        <X aria-hidden="true" size={18} />
      </button>
      <label className="ww-marketplace-status-filter">
        <span>
          <small>Статус задания</small>
          <select aria-label="Статус задания" defaultValue="Все статусы">
            <option>Все статусы</option>
            <option>Выполняется</option>
            <option>Есть отклики</option>
            <option>Выполнен</option>
          </select>
        </span>
      </label>
    </div>
  );
}

type TaskAction = {
  number: string;
  label: string;
  onOpen: () => void;
};

type MarketplaceTableProps = {
  rows: readonly MarketplaceTask[];
  taskAction?: TaskAction;
};

function MarketplaceTable({ rows, taskAction }: MarketplaceTableProps) {
  return (
    <div className="ww-marketplace-table-shell">
      <table>
        <caption className="sr-only">Список заданий Маркетплейса</caption>
        <colgroup>
          <col className="is-select" />
          <col className="is-created" />
          <col className="is-start" />
          <col className="is-number" />
          <col className="is-performer" />
          <col className="is-count" />
          <col className="is-title" />
          <col className="is-total" />
          <col className="is-status" />
          <col className="is-actions" />
        </colgroup>
        <thead>
          <tr>
            <th>
              <input aria-label="Выбрать все задания" type="checkbox" />
            </th>
            <th>
              <button type="button">
                Создан <ChevronDown aria-hidden="true" size={15} />
              </button>
            </th>
            <th>Начало</th>
            <th>Номер задания</th>
            <th>Исполнитель</th>
            <th>Кол-во</th>
            <th>Название задания</th>
            <th>Итого</th>
            <th>Статус</th>
            <th aria-label="Действия" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const action =
              taskAction?.number === row.number ? taskAction : undefined;

            return (
              <tr
                className={action ? 'is-target-task' : undefined}
                key={row.number}
                onClick={action?.onOpen}
                onKeyDown={
                  action
                    ? (event) => {
                        if (
                          event.target !== event.currentTarget ||
                          (event.key !== 'Enter' && event.key !== ' ')
                        )
                          return;
                        event.preventDefault();
                        action.onOpen();
                      }
                    : undefined
                }
                tabIndex={action ? 0 : undefined}
              >
                <td>
                  <input
                    aria-label={`Выбрать задание ${row.number}`}
                    onClick={(event) => event.stopPropagation()}
                    type="checkbox"
                  />
                </td>
                <td>{row.created}</td>
                <td>
                  <span className="ww-marketplace-cell-stack">
                    <span>{row.startDate}</span>
                    <small>{row.startTime}</small>
                  </span>
                </td>
                <td>
                  <span className="ww-marketplace-number">
                    {row.number}
                    <button
                      aria-label={`Скопировать номер ${row.number}`}
                      onClick={(event) => event.stopPropagation()}
                      type="button"
                    >
                      <Copy aria-hidden="true" size={12} />
                    </button>
                  </span>
                </td>
                <td>
                  <span className="ww-marketplace-cell-stack">
                    <span>{row.performer}</span>
                    {row.taxId ? <small>{row.taxId}</small> : null}
                  </span>
                </td>
                <td>{row.count}</td>
                <td>
                  {action ? (
                    <button
                      aria-label={action.label}
                      className="ww-marketplace-row-trigger"
                      type="button"
                    >
                      {row.title}
                    </button>
                  ) : (
                    row.title
                  )}
                </td>
                <td>{row.total}</td>
                <td>
                  <span
                    className={`ww-marketplace-status is-${
                      row.status === 'ВЫПОЛНЯЕТСЯ'
                        ? 'progress'
                        : row.status === 'ЕСТЬ ОТКЛИКИ'
                          ? 'responses'
                          : row.status === 'НА МОДЕРАЦИИ'
                            ? 'moderation'
                            : 'complete'
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td>
                  <button
                    aria-label={`Действия задания ${row.number}`}
                    className="ww-marketplace-row-actions"
                    type="button"
                  >
                    <MoreVertical aria-hidden="true" size={19} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <footer>
        <label>
          <span>На странице:</span>
          <select aria-label="Количество заданий на странице" defaultValue="10">
            <option>10</option>
            <option>50</option>
            <option>100</option>
          </select>
        </label>
        <nav aria-label="Пагинация заданий">
          <button aria-label="Первая страница" disabled type="button">
            <ChevronsLeft aria-hidden="true" size={18} />
          </button>
          <button aria-label="Предыдущая страница" disabled type="button">
            <ChevronLeft aria-hidden="true" size={18} />
          </button>
          <input aria-label="Текущая страница" readOnly value="1" />
          <span>/ 3</span>
          <button aria-label="Следующая страница" type="button">
            <ChevronRight aria-hidden="true" size={18} />
          </button>
          <button aria-label="Последняя страница" type="button">
            <ChevronsRight aria-hidden="true" size={18} />
          </button>
        </nav>
      </footer>
    </div>
  );
}

type MarketplacePageProps = {
  primaryAction?: ReactNode;
  rows?: readonly MarketplaceTask[];
  taskAction?: TaskAction;
};

export function MarketplacePage({
  primaryAction,
  rows = MARKETPLACE_TASKS,
  taskAction,
}: MarketplacePageProps) {
  return (
    <div className="ww-marketplace-page ww-desktop-marketplace">
      <section className="ww-marketplace-heading">
        <h2>Маркетплейс</h2>
        <div className="ww-marketplace-heading-actions">
          {primaryAction ?? (
            <ProductButton>
              Разместить задание
              <ChevronDown aria-hidden="true" size={17} />
            </ProductButton>
          )}
          <ProductButton variant="secondary">
            Реестр на редактирование
          </ProductButton>
        </div>
      </section>
      <div className="ww-marketplace-tabs" role="tablist">
        {MARKETPLACE_TABS.map((tab, index) => (
          <button
            aria-selected={index === 0}
            key={tab}
            role="tab"
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>
      <MarketplaceFilters />
      <MarketplaceTable rows={rows} taskAction={taskAction} />
    </div>
  );
}
