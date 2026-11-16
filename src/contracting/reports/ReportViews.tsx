import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  Download,
  FileText,
  Search,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import type { DesktopRole } from '../fixtures';
import {
  counterparties,
  createdDate,
  createdTime,
  date,
  defaultPeriod,
  displayCell,
  money,
  partyLabel,
  partyName,
  period,
  reportData,
  reportTitle,
  reportType,
  reportTypes,
  selectTasks,
  statuses,
  type Report,
  type ReportOptions,
} from './data';
import { ReportForm } from './ReportForm';
import { downloadReport } from './workbook';

function SearchField({
  value,
  label,
  onChange,
}: {
  value: string;
  label: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="ww-report-search">
      <Search size={19} aria-hidden="true" />
      <input
        type="search"
        aria-label={label}
        placeholder={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function DownloadIcon({ report }: { report: Report }) {
  return (
    <button
      type="button"
      className="ww-report-icon"
      title="Скачать XLSX"
      aria-label={`Скачать XLSX: ${reportTitle(report)}`}
      onClick={() => downloadReport(report)}
    >
      <Download size={19} aria-hidden="true" />
    </button>
  );
}

function Footer({ count, label }: { count: number; label: string }) {
  return (
    <footer className="ww-report-table-footer">
      {label}: {count}
    </footer>
  );
}

export function ReportList({
  role,
  reports,
  now,
  base,
  onCreate,
  filters,
  setFilters,
}: {
  role: DesktopRole;
  reports: Report[];
  now: number;
  base: string;
  onCreate: (options: ReportOptions) => void;
  filters: ReportListFilters;
  setFilters: (patch: Partial<ReportListFilters>) => void;
}) {
  const ascending = filters.ascending;
  const filtered = Boolean(
    filters.query || filters.type || filters.status || filters.party,
  );
  const query = filters.query.trim().toLocaleLowerCase('ru-RU');
  const rows = reports
    .filter(
      (report) =>
        (!query ||
          (reportTitle(report) + ' ' + partyName(role, report.options.party))
            .toLocaleLowerCase('ru-RU')
            .includes(query)) &&
        (!filters.type || report.options.type === filters.type) &&
        (!filters.party || report.options.party === filters.party) &&
        (!filters.status ||
          (report.readyAt <= now ? 'ready' : 'pending') === filters.status),
    )
    .sort((a, b) =>
      ascending ? a.createdAt - b.createdAt : b.createdAt - a.createdAt,
    );

  return (
    <section className="ww-report-body" aria-labelledby="reports-title">
      <div className="ww-report-heading">
        <div>
          <h2 id="reports-title" tabIndex={-1}>
            Отчёты
          </h2>
          <p>
            {role === 'customer'
              ? 'Отчёты по заданиям, размещённым через подрядчиков.'
              : 'Отчёты по заданиям ваших клиентов.'}
          </p>
        </div>
        <ReportForm role={role} onCreate={onCreate} />
      </div>

      <div className="ww-report-filters">
        <SearchField
          label="Название отчёта или компания"
          value={filters.query}
          onChange={(query) => setFilters({ query })}
        />
        <label className="ww-report-field">
          <span>Тип отчёта</span>
          <select
            value={filters.type}
            onChange={(event) => setFilters({ type: event.target.value })}
          >
            <option value="">Все типы</option>
            {reportTypes.map((type) => (
              <option value={type} key={type}>
                {reportType(role, type)}
              </option>
            ))}
          </select>
        </label>
        <label className="ww-report-field">
          <span>{partyLabel(role)}</span>
          <select
            value={filters.party}
            onChange={(event) => setFilters({ party: event.target.value })}
          >
            <option value="">Любая компания</option>
            {counterparties[role].map(({ id, name }) => (
              <option value={id} key={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className="ww-report-field">
          <span>Статус отчёта</span>
          <select
            value={filters.status}
            onChange={(event) => setFilters({ status: event.target.value })}
          >
            <option value="">Все статусы</option>
            <option value="ready">Сформирован</option>
            <option value="pending">Формируется</option>
          </select>
        </label>
      </div>

      {filtered ? (
        <div className="ww-report-filter-summary">
          <span>
            Найдено отчётов: {rows.length} из {reports.length}
            {filters.party ? ' · Только отчёты по этой компании' : ''}
          </span>
          <button
            type="button"
            onClick={() =>
              setFilters({ query: '', type: '', status: '', party: '' })
            }
          >
            Сбросить фильтры
          </button>
        </div>
      ) : null}
      <div className="ww-report-table-card">
        <div className="ww-report-table-scroll">
          <table aria-label="Список отчётов">
            <thead>
              <tr>
                <th
                  scope="col"
                  aria-sort={ascending ? 'ascending' : 'descending'}
                >
                  <button
                    type="button"
                    className="ww-report-sort"
                    onClick={() => setFilters({ ascending: !ascending })}
                  >
                    Создан{' '}
                    {ascending ? (
                      <ArrowUp size={15} />
                    ) : (
                      <ArrowDown size={15} />
                    )}
                  </button>
                </th>
                <th scope="col">Название</th>
                <th scope="col">Период заданий</th>
                <th scope="col">{partyLabel(role)}</th>
                <th scope="col">Статус</th>
                <th scope="col">Скачать</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((report) => {
                const ready = report.readyAt <= now;
                return (
                  <tr
                    key={report.id}
                    className={ready ? 'ww-report-open-row' : undefined}
                    onClick={(event) => {
                      if (
                        ready &&
                        !(event.target as HTMLElement).closest('a,button')
                      ) {
                        event.currentTarget
                          .querySelector<HTMLAnchorElement>('a')
                          ?.click();
                      }
                    }}
                  >
                    <td className="ww-report-nowrap">
                      {createdDate(report.createdAt)}
                      <small>{createdTime(report.createdAt)}</small>
                    </td>
                    <td>
                      {ready ? (
                        <Link
                          className="ww-report-link"
                          to={`${base}/${report.id}`}
                        >
                          {reportTitle(report)}
                        </Link>
                      ) : (
                        <span>{reportTitle(report)}</span>
                      )}
                      <small>
                        {report.options.statuses.length
                          ? report.options.statuses
                              .map((status) => statuses[status])
                              .join(', ')
                          : 'Все статусы заданий'}
                      </small>
                    </td>
                    <td className="ww-report-nowrap">
                      {period(report.options)}
                    </td>
                    <td>{partyName(role, report.options.party)}</td>
                    <td>
                      <span
                        className={`ww-report-badge ${ready ? 'is-success' : 'is-processing'}`}
                        role="status"
                      >
                        {ready ? (
                          <Check size={15} aria-hidden="true" />
                        ) : (
                          <span
                            className="ww-report-spinner"
                            aria-hidden="true"
                          />
                        )}
                        {ready ? 'Сформирован' : 'Формируется'}
                      </span>
                    </td>
                    <td>
                      {ready ? (
                        <DownloadIcon report={report} />
                      ) : (
                        <span className="ww-report-muted">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {rows.length ? (
          <Footer label="Отчётов" count={rows.length} />
        ) : (
          <Empty text="По заданным фильтрам отчётов нет" />
        )}
      </div>
    </section>
  );
}

export type ReportListFilters = {
  query: string;
  type: string;
  status: string;
  party: string;
  ascending: boolean;
};

function Empty({ text }: { text: string }) {
  return (
    <div className="ww-report-empty">
      <FileText aria-hidden="true" size={27} />
      <p>{text}</p>
    </div>
  );
}

export function ReportDetails({
  report,
  base,
  now,
  onCreate,
}: {
  report: Report | undefined;
  base: string;
  now: number;
  onCreate: (options: ReportOptions) => void;
}) {
  const [search, setSearch] = useState('');
  const ready = report && report.readyAt <= now;
  const data = ready ? reportData(report.role, report.options) : null;
  const query = search.trim().toLocaleLowerCase('ru-RU');
  const results =
    data?.rows.filter(
      (row) =>
        !query ||
        row.some((value, index) =>
          String(displayCell(value, data.columns[index]!))
            .toLocaleLowerCase('ru-RU')
            .includes(query),
        ),
    ) ?? [];

  return (
    <section
      className="ww-report-body ww-report-details"
      aria-labelledby="detail-title"
    >
      <Link className="ww-report-back" to={base}>
        <ArrowLeft size={19} aria-hidden="true" /> К списку отчётов
      </Link>
      <div className="ww-report-heading">
        <div>
          <h2 id="detail-title" tabIndex={-1}>
            {report ? reportTitle(report) : 'Отчёт не найден'}
          </h2>
          {report ? (
            <p>
              {ready ? 'Сформирован' : 'Создаётся'}{' '}
              {createdDate(report.createdAt)} в {createdTime(report.createdAt)}{' '}
              ·{' '}
              {report.role === 'customer'
                ? 'Мои подрядчики'
                : 'Работа в режиме подрядчика'}
            </p>
          ) : (
            <p>Вернитесь к списку и откройте доступный отчёт.</p>
          )}
        </div>
        {ready ? (
          <div className="ww-report-heading-actions">
            <ReportForm
              role={report.role}
              onCreate={onCreate}
              initialOptions={report.options}
              label="Создать похожий"
              secondary
            />
            <button
              type="button"
              className="ww-button ww-report-outline"
              onClick={() => downloadReport(report)}
            >
              <Download size={18} aria-hidden="true" /> Скачать XLSX
            </button>
          </div>
        ) : null}
      </div>
      {report && data ? (
        <>
          <div className="ww-report-parameters">
            <dl>
              <div>
                <dt>Период по дате начала</dt>
                <dd>{period(report.options)}</dd>
              </div>
              <div>
                <dt>{partyLabel(report.role)}</dt>
                <dd>{partyName(report.role, report.options.party)}</dd>
              </div>
              <div>
                <dt>Статусы заданий</dt>
                <dd>
                  {report.options.statuses
                    .map((status) => statuses[status])
                    .join(', ') || 'Все статусы'}
                </dd>
              </div>
            </dl>
          </div>
          <dl className="ww-report-totals">
            <div>
              <dt>Заданий в отчёте</dt>
              <dd>{data.totals.count}</dd>
            </div>
            <div>
              <dt>Завершено</dt>
              <dd>{data.totals.completed}</dd>
            </div>
            <div>
              <dt>Ожидает оплаты</dt>
              <dd>{money(data.totals.payable)}</dd>
            </div>
            <div>
              <dt>Оплачено</dt>
              <dd>{money(data.totals.paid)}</dd>
            </div>
          </dl>

          <div className="ww-report-table-card">
            <div className="ww-report-detail-tools">
              <div>
                <h3>Данные отчёта</h3>
                <p className="ww-report-results-count">
                  Показано {results.length} из {data.rows.length} строк
                </p>
              </div>
              <SearchField
                label="Поиск по отчёту"
                value={search}
                onChange={setSearch}
              />
            </div>
            {query ? (
              <div className="ww-report-filter-summary ww-report-inset">
                <span>
                  Поиск меняет только таблицу. Итоги и XLSX содержат весь отчёт.
                </span>
                <button type="button" onClick={() => setSearch('')}>
                  Сбросить поиск
                </button>
              </div>
            ) : null}
            <div className="ww-report-table-scroll">
              <table aria-label="Данные отчёта">
                <thead>
                  <tr>
                    {data.columns.map(({ label, format }) => (
                      <th
                        scope="col"
                        key={label}
                        className={
                          format === 'money' ? 'ww-report-number' : undefined
                        }
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((row) => (
                    <tr key={row[0]}>
                      {row.map((value, index) => {
                        const column = data.columns[index]!;
                        const printed = displayCell(value, column);
                        const [title, site] = String(printed).split('\n', 2);
                        return (
                          <td
                            key={column.label}
                            className={
                              column.format === 'money'
                                ? 'ww-report-number'
                                : undefined
                            }
                          >
                            {column.format === 'status' ? (
                              <span
                                className={`ww-report-badge status-${value}`}
                              >
                                {printed}
                              </span>
                            ) : site ? (
                              <>
                                {title}
                                <small>{site}</small>
                              </>
                            ) : (
                              printed
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {results.length ? (
              <Footer label="Строк" count={results.length} />
            ) : (
              <Empty
                text={
                  data.rows.length
                    ? 'По запросу ничего не найдено'
                    : 'За этот период нет заданий по выбранным фильтрам'
                }
              />
            )}
          </div>
        </>
      ) : report ? (
        <div className="ww-report-table-card">
          <Empty text="Отчёт формируется" />
        </div>
      ) : null}
    </section>
  );
}

export function CabinetOverview({
  role,
  orders,
  onCreate,
}: {
  role: DesktopRole;
  orders: boolean;
  onCreate: (options: ReportOptions) => void;
}) {
  const title = orders
    ? 'Задания клиентов'
    : role === 'customer'
      ? 'Подрядчики'
      : 'Клиенты';
  const tasks = selectTasks(role, {
    type: 'tasks',
    party: '',
    statuses: [],
    ...defaultPeriod,
  });
  return (
    <section className="ww-report-body">
      <div className="ww-report-heading">
        <div>
          <h2 tabIndex={-1}>{title}</h2>
          <p>
            {orders
              ? 'Задания, которые клиенты разместили через вашу компанию.'
              : role === 'customer'
                ? 'Компании, через которые вы размещаете задания.'
                : 'Компании, которые размещают задания через вас.'}
          </p>
        </div>
        <ReportForm role={role} onCreate={onCreate} />
      </div>
      <div className="ww-report-table-card">
        <div className="ww-report-table-scroll">
          {orders ? (
            <table aria-label={title}>
              <thead>
                <tr>
                  {[
                    '№ задания',
                    'Название задания',
                    'Клиент',
                    'Дата начала',
                    'Статус',
                    'Сумма',
                  ].map((label) => (
                    <th key={label} scope="col">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.id}</td>
                    <td>
                      {task.title}
                      <small>{task.site}</small>
                    </td>
                    <td>{partyName(role, task.party)}</td>
                    <td>{date(task.date)}</td>
                    <td>
                      <span className={`ww-report-badge status-${task.status}`}>
                        {statuses[task.status]}
                      </span>
                    </td>
                    <td>{money(task.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table aria-label={title}>
              <thead>
                <tr>
                  <th scope="col">{partyLabel(role)}</th>
                  <th scope="col">Заданий в ноябре</th>
                  <th scope="col">Статус договора</th>
                  <th scope="col">Отчёты</th>
                </tr>
              </thead>
              <tbody>
                {counterparties[role].map(({ id, name }) => (
                  <tr key={id}>
                    <td>
                      <span>{name}</span>
                    </td>
                    <td>{tasks.filter((task) => task.party === id).length}</td>
                    <td>
                      <span className="ww-report-badge is-success">
                        Подписан
                      </span>
                    </td>
                    <td>
                      <ReportForm
                        role={role}
                        onCreate={onCreate}
                        label="Отчёт по компании"
                        secondary
                        initialOptions={{
                          type: 'tasks',
                          party: id,
                          ...defaultPeriod,
                          statuses: [],
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <Footer
          label={orders ? 'Заданий' : 'Компаний'}
          count={orders ? tasks.length : counterparties[role].length}
        />
      </div>
    </section>
  );
}
