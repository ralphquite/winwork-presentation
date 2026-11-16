import { CalendarDays, ChevronDown, Info } from 'lucide-react';
import type { KeyboardEvent } from 'react';
import {
  TASK_AUDIENCES,
  TASK_FIELDS,
  type MarketplaceState,
  type TaskField,
} from './marketplaceState';

const LABELS: Record<TaskField, string> = {
  name: 'Название задания',
  region: 'Регион заказа',
  city: 'Город или населённый пункт',
  street: 'Населенный пункт, название улицы',
  house: 'Дом/строение',
  block: 'Корпус (необязательно)',
  flat: 'Квартира (необязательно)',
  count: 'Количество исполнителей',
  activity: 'Вид деятельности',
  price: 'Вознаграждение, ₽',
  payment: 'Тип вознаграждения',
  startDate: 'Дата начала',
  startTime: 'Время начала',
  endDate: 'Дата завершения',
  endTime: 'Время завершения',
  work: 'Наименование работ',
  extraWork: 'Дополнительное наименование работ',
  info: 'Дополнительная информация',
  comment: 'Комментарий (необязательно)',
  template: 'Выберите шаблон',
};
export function MarketplaceTaskForm({
  state,
  onChange,
  readOnly = false,
}: {
  state: MarketplaceState;
  onChange: (next: Partial<MarketplaceState>) => void;
  readOnly?: boolean;
}) {
  const fill = (name: TaskField) =>
    onChange({ filled: [...new Set([...state.filled, name])] });
  const keyFill = (
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: TaskField,
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      fill(name);
    }
  };
  const field = (name: TaskField) => {
    const select = [
      'region',
      'city',
      'activity',
      'payment',
      'template',
    ].includes(name);
    const date = name === 'startDate' || name === 'endDate';
    const filled = state.filled.includes(name);
    const disabled =
      readOnly || (name === 'city' && !state.filled.includes('region'));
    return (
      <label
        className={`wo-field${filled ? ' is-filled' : ''}${select || date ? ' wo-citizenship' : ''}`}
        data-tour-target={`task-${name}`}
      >
        <span>{LABELS[name]}</span>
        <input
          aria-label={LABELS[name]}
          aria-describedby={readOnly ? undefined : 'task-demo-hint'}
          readOnly
          disabled={disabled}
          value={filled ? TASK_FIELDS[name] : ''}
          onClick={() => fill(name)}
          onKeyDown={(event) => keyFill(event, name)}
        />
        {select ? (
          <ChevronDown size={18} />
        ) : date ? (
          <CalendarDays size={18} />
        ) : null}
      </label>
    );
  };
  const text = (name: 'work' | 'extraWork' | 'info') => (
    <textarea
      aria-label={LABELS[name]}
      data-tour-target={`task-${name}`}
      readOnly
      disabled={readOnly}
      value={state.filled.includes(name) ? TASK_FIELDS[name] : ''}
      placeholder={
        name === 'work'
          ? 'Разгрузить автомобиль'
          : name === 'info'
            ? 'Взять медицинскую книжку'
            : ''
      }
      onClick={() => fill(name)}
      onKeyDown={(event) => keyFill(event, name)}
    />
  );
  return (
    <div className="wo-task-form">
      <div className="wo-task-name">
        {field('name')}
        <label className="wo-task-check">
          <input
            type="checkbox"
            checked={state.remote}
            disabled={readOnly}
            onChange={(event) => onChange({ remote: event.target.checked })}
          />
          Удаленная работа
        </label>
      </div>
      <div className="wo-field-row">
        {field('region')}
        {field('city')}
      </div>
      {!state.remote ? (
        <>
          {field('street')}
          <div className="wo-field-row">
            {field('house')}
            {field('block')}
          </div>
          <div className="wo-field-row">{field('flat')}</div>
        </>
      ) : null}
      {field('count')}
      {field('activity')}
      <section>
        <h3>Вознаграждение</h3>
        <div className="wo-field-row">
          {field('price')}
          {field('payment')}
        </div>
      </section>
      <section>
        <h3>Период выполнения задания</h3>
        <p className="wo-task-info">
          <Info size={20} />
          Укажите время того региона, в котором будет выполняться задание
        </p>
        <div className="wo-field-row">
          {field('startDate')}
          {field('startTime')}
        </div>
        <div className="wo-field-row">
          {field('endDate')}
          {field('endTime')}
        </div>
      </section>
      <section>
        <h3>
          Наименование работ <span>(не входит в акт выполненных работ)</span>
        </h3>
        {text('work')}
        {!readOnly && !state.extraWork ? (
          <button
            className="wo-task-text-action"
            type="button"
            onClick={() => onChange({ extraWork: true })}
          >
            Добавить
          </button>
        ) : null}
        {state.extraWork ? (
          <>
            {text('extraWork')}
            {!readOnly ? (
              <button
                className="wo-task-text-action"
                type="button"
                onClick={() =>
                  onChange({
                    extraWork: false,
                    filled: state.filled.filter((name) => name !== 'extraWork'),
                  })
                }
              >
                Убрать
              </button>
            ) : null}
          </>
        ) : null}
      </section>
      <section>
        <h3>
          Дополнительная информация{' '}
          <span>(входит в акт выполненных работ)</span>
        </h3>
        {text('info')}
      </section>
      <section>
        {field('comment')}
        <small>Исполнители его не увидят</small>
      </section>
      <section data-tour-target="task-audience">
        <h3>Кто увидит задание</h3>
        {TASK_AUDIENCES.map((audience) => (
          <label className="wo-task-check" key={audience}>
            <input
              disabled={readOnly}
              type="checkbox"
              checked={state.audiences.includes(audience)}
              onChange={(event) =>
                onChange({
                  audiences: event.target.checked
                    ? [...state.audiences, audience]
                    : state.audiences.filter((item) => item !== audience),
                })
              }
            />
            {audience}
          </label>
        ))}
      </section>
      <section>
        <h3>Дополнительно:</h3>
        <label className="wo-task-check">
          <input
            disabled={readOnly}
            type="checkbox"
            checked={state.citizens}
            onChange={(event) => onChange({ citizens: event.target.checked })}
          />
          Только граждане РФ
        </label>
      </section>
      <section>
        <p className="wo-task-template-label">
          Выберите шаблон документа, который будет подписан после выполнения
          задания <Info size={18} />
        </p>
        {field('template')}
      </section>
    </div>
  );
}
