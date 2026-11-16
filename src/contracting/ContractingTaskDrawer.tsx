import {
  CalendarDays,
  ChevronDown,
  Download,
  Eye,
  Info,
  MessageSquareText,
  Search,
  Star,
} from 'lucide-react';

import closeIcon from '../assets/contracting/desktop/close.svg?inline';
import { Drawer, ProductButton } from '../presentation/flows/ProductUI';
import { companies, task, type DesktopRole } from './fixtures';

const OPERATIONS = [
  { label: 'Разгрузка', checked: true },
  { label: 'Погрузка', checked: false },
  { label: 'Транспортировка', checked: true },
  { label: 'Хранение', checked: false },
  { label: 'Комплектация', checked: false },
  { label: 'Инвентаризация', checked: false },
] as const;

const RESPONSES = [
  {
    ...task.performer,
    time: '16:54',
    employment: 'ИП',
    rating: '5',
    reviews: '4 отзыва',
    completed: 'Выполнил 18 заданий из 20',
    completionRate: '90%',
    birthday: '14.03.1995',
    gender: 'Мужской',
    income: '198 716 ₽',
  },
  {
    name: 'Илья Крылов',
    initials: 'ИК',
    time: '16:57',
    employment: 'Самозанятый',
    rating: '4,8',
    reviews: '6 отзывов',
    completed: 'Выполнил 21 задание из 25',
    completionRate: '84%',
    birthday: '18.07.1997',
    gender: 'Мужской',
    phone: '+7 (9••) •••-38-17',
    income: '176 400 ₽',
  },
] as const;

export function ContractingTaskSwitch({
  checked = true,
  label,
}: {
  checked?: boolean;
  label: string;
}) {
  return (
    <div className="contracting-task-switch">
      <button
        aria-checked={checked}
        aria-disabled="true"
        tabIndex={-1}
        aria-label={label}
        className={`ww-toggle${checked ? ' is-on' : ''}`}
        role="switch"
        type="button"
      >
        <span aria-hidden="true" />
      </button>
      <span aria-hidden="true">{label}</span>
    </div>
  );
}

function TaskField({
  label,
  value,
  select = false,
  calendar = false,
}: {
  label: string;
  value: string;
  select?: boolean;
  calendar?: boolean;
}) {
  return (
    <label
      className={`ww-task-control${select ? ' is-select' : ''}${calendar ? ' has-calendar' : ''}`}
    >
      <span>{label}</span>
      {select ? (
        <select disabled>
          <option>{value}</option>
        </select>
      ) : (
        <input disabled value={value} />
      )}
      {calendar ? <CalendarDays aria-hidden="true" size={18} /> : null}
    </label>
  );
}

function TaskObjectFields() {
  return (
    <div className="contracting-task-object">
      <section className="ww-task-object-card">
        <h3>Объект</h3>
        <TaskField
          label="Выберите сохранённый объект"
          select
          value={task.object}
        />
      </section>
      <div className="ww-task-activity-row">
        <TaskField label="Вид деятельности" select value="Грузчик" />
        <div className="ww-task-rate">
          <span>Ставка</span>
          <strong>{task.rate}</strong>
        </div>
      </div>
      <TaskField label="Количество исполнителей" value="1" />
    </div>
  );
}

function TaskPeriod({ details = false }: { details?: boolean }) {
  return (
    <section className="ww-task-section">
      <h3>Период выполнения {details ? 'заказа' : 'задания'}</h3>
      {details ? (
        <p className="contracting-task-period-note">
          Укажите время того региона, в котором будет выполняться заказ
          <Info aria-hidden="true" size={19} />
        </p>
      ) : null}
      <div className="ww-task-period">
        <div>
          <strong>Начало</strong>
          <div className="ww-task-period-fields">
            <TaskField calendar label="Дата" value={task.startDate} />
            <TaskField label="Время" value={task.startTime} />
          </div>
        </div>
        <span aria-hidden="true" className="ww-task-period-dash">
          —
        </span>
        <div>
          <strong>Завершение</strong>
          <div className="ww-task-period-fields">
            <TaskField calendar label="Дата" value={task.startDate} />
            <TaskField label="Время" value={task.endTime} />
          </div>
        </div>
      </div>
    </section>
  );
}

function TaskOperations({ details = false }: { details?: boolean }) {
  const operations = details
    ? OPERATIONS.filter((operation) => operation.checked)
    : OPERATIONS;

  return (
    <fieldset className="ww-task-section ww-task-operations">
      <legend>Операции</legend>
      <p>Названия операций будут указаны в акте</p>
      <div>
        {operations.map(({ checked, label }) => (
          <label className="ww-checkbox" key={label}>
            <input checked={checked} disabled type="checkbox" />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function TaskReward() {
  return (
    <dl className="contracting-task-reward">
      <div className="ww-task-total">
        <dt>Вознаграждение всего</dt>
        <dd>{task.total}</dd>
      </div>
      <div>
        <dt>Вознаграждение исполнителю</dt>
        <dd>{task.reward}</dd>
      </div>
      <div>
        <dt>Выплата подрядчику</dt>
        <dd>
          {companies.contractor.commission} · {task.commission}
        </dd>
      </div>
    </dl>
  );
}

function TaskName() {
  return (
    <section className="ww-task-section ww-task-name">
      <h3>Название задания</h3>
      <p>{task.title}</p>
    </section>
  );
}

export function ContractingCreateTaskDrawer() {
  return (
    <Drawer
      className="ww-contracting-drawer contracting-task-drawer contracting-task-create"
      closeIcon={<img alt="" src={closeIcon} />}
      title="Создать задание"
    >
      <form
        aria-label="Параметры задания"
        className="ww-task-form"
        onSubmit={(event) => event.preventDefault()}
        tabIndex={0}
      >
        <div className="contracting-task-create-partner">
          <section className="ww-task-object-card">
            <ContractingTaskSwitch label="Опубликовать через подрядчика" />
            <p>В документах задание будет от имени подрядчика</p>
          </section>
          <section className="ww-task-object-card">
            <h3>Подрядчик</h3>
            <TaskField
              label="Выберите подрядчика"
              select
              value={companies.contractor.name}
            />
          </section>
          <section className="contracting-task-partner-info">
            <h3>Информация о подрядчике</h3>
            <dl>
              <div>
                <dt>Юридическое лицо</dt>
                <dd>{companies.contractor.name}</dd>
              </div>
              <div>
                <dt>ИНН</dt>
                <dd>{companies.contractor.taxId}</dd>
              </div>
              <div>
                <dt>Комиссия</dt>
                <dd>{companies.contractor.commission}</dd>
              </div>
            </dl>
          </section>
        </div>
        <TaskObjectFields />
        <fieldset className="ww-task-kind">
          <legend className="sr-only">Тип задания</legend>
          <label>
            <input checked disabled name="contracting-task-kind" type="radio" />
            Разовое задание
          </label>
          <label>
            <input disabled name="contracting-task-kind" type="radio" />
            Регулярные задания
          </label>
        </fieldset>
        <TaskPeriod />
        <section className="ww-task-limits">
          <header>
            <strong>Остаток лимита в текущем месяце</strong>
            <span>10 дней до сброса лимита</span>
          </header>
          <div>
            <article>
              <span>Заданий</span>
              <p>
                <strong>12</strong> из 24
              </p>
            </article>
            <article>
              <span>Вознаграждение</span>
              <p>
                <strong>96 000 ₽</strong> из 192 000 ₽
              </p>
            </article>
          </div>
        </section>
        <TaskOperations />
        <TaskReward />
        <TaskName />
        <section className="ww-task-section">
          <h3>Дополнительно</h3>
          <label className="ww-checkbox">
            <input disabled type="checkbox" />
            Только граждане РФ
          </label>
          <label className="contracting-task-preferred">
            <strong>Предпочитаемый исполнитель (необязательно)</strong>
            <span className="ww-task-control">
              <input
                placeholder="Исполнитель (поиск по ФИО или ИНН)"
                disabled
                type="search"
              />
              <Search aria-hidden="true" size={18} />
            </span>
          </label>
        </section>
      </form>
      <footer className="contracting-task-create-footer">
        <ProductButton
          aria-disabled="true"
          data-contracting-hint=""
          tabIndex={-1}
        >
          Создать задание
        </ProductButton>
      </footer>
    </Drawer>
  );
}

function TaskDetails({ role }: { role: DesktopRole }) {
  const customer = role === 'customer';

  return (
    <div className="ww-task-form contracting-task-preview">
      <div className="ww-task-object-card contracting-task-publisher">
        <strong>
          {customer
            ? 'Опубликовано через подрядчика'
            : 'Опубликовано для клиента'}
        </strong>
        <p>{customer ? companies.contractor.name : companies.customer.name}</p>
      </div>
      <div className="contracting-task-document">
        <ProductButton aria-disabled="true" tabIndex={-1} variant="secondary">
          <Download aria-hidden="true" size={18} />
          PDF с описанием задания
        </ProductButton>
        <TaskField label="Номер задания" value={task.number} />
        <small>Одинаковый для заказчиков и исполнителей</small>
      </div>
      <TaskObjectFields />
      <TaskPeriod details />
      <TaskOperations details />
      <TaskReward />
      <TaskName />
      {customer ? (
        <ProductButton aria-disabled="true" tabIndex={-1} variant="secondary">
          Отменить задание
        </ProductButton>
      ) : null}
    </div>
  );
}

function TaskResponses({ role }: { role: DesktopRole }) {
  return (
    <div
      aria-label="Отклики исполнителей"
      className="ww-selection-responses contracting-task-responses"
      role="list"
    >
      {RESPONSES.map((response) => (
        <article
          className="ww-payment-performer-card ww-selection-response-card"
          key={response.name}
          role="listitem"
        >
          <span aria-hidden="true" className="ww-payment-avatar">
            {response.initials}
          </span>
          <div className="ww-payment-performer-heading">
            <strong>{response.name}</strong>
            <p>
              22 августа, {response.time} · <b>{response.employment}</b> ·{' '}
              <b>PDF</b> ·
              <MessageSquareText aria-hidden="true" size={17} />
            </p>
          </div>
          <button
            aria-disabled="true"
            tabIndex={-1}
            aria-label={`Данные исполнителя ${response.name}`}
            type="button"
          >
            <ChevronDown aria-hidden="true" size={18} />
          </button>
          <section>
            <h3>Рейтинг</h3>
            <p>
              <Star aria-hidden="true" fill="currentColor" size={21} />
              {response.rating} · <u>{response.reviews}</u>
            </p>
            <p>
              <span className="ww-payment-progress-dot" />
              {response.completionRate} · {response.completed}
            </p>
          </section>
          <dl className="ww-selection-personal-data">
            <div>
              <dt>Дата рождения</dt>
              <dd>{response.birthday}</dd>
            </div>
            <div>
              <dt>Пол</dt>
              <dd>{response.gender}</dd>
            </div>
            <div>
              <dt>Телефон</dt>
              <dd>{response.phone}</dd>
            </div>
          </dl>
          <footer>
            <strong>Доход за последние 12 месяцев</strong>
            <span>{response.income}</span>
          </footer>
          {role === 'customer' ? (
            <div className="ww-selection-response-actions">
              <ProductButton
                aria-disabled="true"
                data-contracting-hint={
                  response.name === task.performer.name ? '' : undefined
                }
                tabIndex={-1}
              >
                Назначить
              </ProductButton>
              <ProductButton
                aria-disabled="true"
                tabIndex={-1}
                variant="danger"
              >
                Отказать
              </ProductButton>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}

export function ContractingTaskDrawer({
  role,
  tab,
}: {
  role: DesktopRole;
  tab: 'task' | 'responses';
}) {
  const responses = tab === 'responses';
  const tabs = ['Заказ', 'Отклики', 'История'];

  return (
    <Drawer
      className="ww-contracting-drawer contracting-task-drawer contracting-task-details"
      closeIcon={<img alt="" src={closeIcon} />}
      title={task.title}
    >
      <div className="contracting-task-drawer-meta">
        <p aria-label="145 просмотров">
          <Eye aria-hidden="true" size={16} /> 145
        </p>
        <div>
          <span>Заказ от {task.created}</span>
          <strong className="ww-marketplace-status is-progress">
            {role === 'customer' ? 'Есть отклики' : 'Выполняется'}
          </strong>
        </div>
      </div>
      <div
        aria-label="Панель задания"
        className="contracting-task-drawer-tabs"
        role="tablist"
      >
        {tabs.map((label, index) => (
          <button
            aria-disabled="true"
            tabIndex={-1}
            aria-selected={index === (responses ? 1 : 0)}
            data-contracting-hint={
              !responses && label === 'Отклики' ? '' : undefined
            }
            key={label}
            role="tab"
            type="button"
          >
            {label}
          </button>
        ))}
      </div>
      {responses ? <TaskResponses role={role} /> : <TaskDetails role={role} />}
    </Drawer>
  );
}
