import { FileText, X } from 'lucide-react';
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';

import type { DesktopRole } from '../fixtures';
import {
  allParties,
  counterparties,
  defaultPeriod,
  partyLabel,
  reportType,
  reportTypes,
  selectTasks,
  statuses,
  suggestedName,
  type ReportOptions,
  type ReportType,
} from './data';

const presets = [
  ['Ноябрь', defaultPeriod],
  ['Октябрь', { from: '2026-10-01', to: '2026-10-31' }],
] as const;

export function ReportForm({
  role,
  onCreate,
  initialOptions,
  label = 'Сформировать отчёт',
  secondary = false,
}: {
  role: DesktopRole;
  onCreate: (options: ReportOptions) => void;
  initialOptions?: ReportOptions;
  label?: string;
  secondary?: boolean;
}) {
  const formId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const dateEnd = useRef<HTMLInputElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const errorMessage = useRef<HTMLParagraphElement>(null);
  const [options, setOptions] = useState<ReportOptions>({
    type: 'tasks',
    party: '',
    ...defaultPeriod,
    statuses: [],
  });
  const [statusMode, setStatusMode] = useState('all');
  const [error, setError] = useState('');
  const validPeriod = Boolean(
    options.from && options.to && options.from <= options.to,
  );
  const tasks = validPeriod ? selectTasks(role, options) : [];
  const name = options.name ?? suggestedName(role, options);

  useEffect(() => {
    if (error) errorMessage.current?.scrollIntoView({ block: 'nearest' });
  }, [error]);

  function update(patch: Partial<ReportOptions>) {
    setOptions((current) => ({ ...current, ...patch }));
    setError('');
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validPeriod) {
      setError('Дата окончания должна быть не раньше даты начала.');
      dateEnd.current?.focus();
      return;
    }
    if (statusMode === 'custom' && !options.statuses.length) {
      setError('Выберите хотя бы один статус задания.');
      return;
    }
    onCreate({ ...options, name: name.trim() || suggestedName(role, options) });
    dialog.current?.close();
  }

  return (
    <>
      <button
        className={`ww-button ${secondary ? 'ww-report-outline' : 'is-primary ww-report-primary'}`}
        type="button"
        onClick={() => {
          const next = initialOptions ?? {
            type: 'tasks',
            party: '',
            ...defaultPeriod,
            statuses: [],
          };
          setOptions({ ...next, name: undefined });
          setStatusMode(
            !next.statuses.length
              ? 'all'
              : next.statuses.length === 1 && next.statuses[0] === 'done'
                ? 'done'
                : 'custom',
          );
          setError('');
          dialog.current?.showModal();
          nameInput.current?.focus();
        }}
      >
        {label}
      </button>
      <dialog
        ref={dialog}
        className="ww-report-dialog"
        aria-labelledby={formId + '-title'}
      >
        <form onSubmit={submit}>
          <header>
            <div>
              <h2 id={formId + '-title'}>Сформировать отчёт</h2>
              <p>
                {role === 'customer'
                  ? 'По заданиям ваших подрядчиков'
                  : 'По заданиям ваших клиентов'}
              </p>
            </div>
            <button
              className="ww-report-icon"
              type="button"
              aria-label="Закрыть"
              onClick={() => dialog.current?.close()}
            >
              <X size={22} aria-hidden="true" />
            </button>
          </header>
          <div className="ww-report-form-body">
            <label className="ww-report-field ww-report-name-field">
              <span>Название отчёта</span>
              <input
                ref={nameInput}
                value={name}
                maxLength={180}
                onChange={(event) => update({ name: event.target.value })}
              />
            </label>
            <label className="ww-report-field">
              <span>Тип отчёта</span>
              <select
                value={options.type}
                onChange={(event) =>
                  update({ type: event.target.value as ReportType })
                }
              >
                {reportTypes.map((type) => (
                  <option key={type} value={type}>
                    {reportType(role, type)}
                  </option>
                ))}
              </select>
            </label>
            <p className="ww-report-field-help">
              {options.type === 'tasks'
                ? 'Каждое задание отдельной строкой: компания, объект, статус и сумма.'
                : 'Количество заданий и суммы к оплате и оплаченные — по каждой компании.'}
            </p>
            <label className="ww-report-field">
              <span>{partyLabel(role)}</span>
              <select
                value={options.party}
                onChange={(event) => update({ party: event.target.value })}
              >
                <option value="">{allParties(role)}</option>
                {counterparties[role].map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <fieldset aria-describedby={formId + '-period'}>
              <legend>Период заданий</legend>
              <p id={formId + '-period'}>
                По дате начала задания, включая обе даты.
              </p>
              <div className="ww-report-presets">
                {presets.map(([label, range]) => (
                  <button
                    key={label}
                    className="ww-report-preset"
                    type="button"
                    aria-pressed={
                      options.from === range.from && options.to === range.to
                    }
                    onClick={() => update(range)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="ww-report-date-fields">
                <label className="ww-report-field">
                  <span>Дата начала</span>
                  <input
                    required
                    type="date"
                    value={options.from}
                    onChange={(event) => update({ from: event.target.value })}
                  />
                </label>
                <label className="ww-report-field">
                  <span>Дата окончания</span>
                  <input
                    ref={dateEnd}
                    required
                    type="date"
                    value={options.to}
                    aria-invalid={!validPeriod}
                    aria-describedby={error ? formId + '-error' : undefined}
                    onChange={(event) => update({ to: event.target.value })}
                  />
                </label>
              </div>
            </fieldset>
            <fieldset>
              <legend>Статусы заданий</legend>
              <div className="ww-report-status-mode">
                {[
                  ['all', 'Все статусы'],
                  ['done', 'Только завершённые'],
                  ['custom', 'Выбрать статусы'],
                ].map(([value, text]) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name={formId + '-mode'}
                      value={value}
                      checked={statusMode === value}
                      onChange={() => {
                        setStatusMode(value!);
                        update({ statuses: value === 'all' ? [] : ['done'] });
                      }}
                    />
                    {text}
                  </label>
                ))}
              </div>
              {statusMode === 'custom' ? (
                <div className="ww-report-status-options">
                  {(Object.keys(statuses) as (keyof typeof statuses)[]).map(
                    (status) => (
                      <label key={status}>
                        <input
                          type="checkbox"
                          checked={options.statuses.includes(status)}
                          onChange={(event) =>
                            update({
                              statuses: event.target.checked
                                ? [...options.statuses, status]
                                : options.statuses.filter(
                                    (item) => item !== status,
                                  ),
                            })
                          }
                        />
                        {statuses[status]}
                      </label>
                    ),
                  )}
                </div>
              ) : null}
            </fieldset>
            {error ? (
              <p
                ref={errorMessage}
                id={formId + '-error'}
                className="ww-report-error"
                role="alert"
              >
                {error}
              </p>
            ) : null}
            {validPeriod &&
            (statusMode !== 'custom' || options.statuses.length > 0) ? (
              <div className="ww-report-preview" role="status">
                <FileText size={20} aria-hidden="true" />
                <div>
                  <strong>
                    {tasks.length
                      ? `Заданий в отчёте: ${tasks.length}`
                      : 'Нет заданий по выбранным условиям'}
                  </strong>
                  <p>
                    {tasks.length
                      ? `Компаний: ${new Set(tasks.map((task) => task.party)).size}. Отчёт можно будет просмотреть и скачать.`
                      : 'Измените период или статусы. Можно сформировать и пустой отчёт.'}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
          <footer>
            <button
              type="button"
              className="ww-button ww-report-outline"
              onClick={() => dialog.current?.close()}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="ww-button is-primary ww-report-primary"
            >
              Сформировать отчёт
            </button>
          </footer>
        </form>
      </dialog>
    </>
  );
}
