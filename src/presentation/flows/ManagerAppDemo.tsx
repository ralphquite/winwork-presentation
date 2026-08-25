import {
  ArrowLeft,
  BatteryFull,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Clock3,
  FileText,
  Flag,
  LogOut,
  MapPin,
  MessageCircle,
  MessageSquareText,
  Paperclip,
  Phone,
  Plus,
  Search,
  Send,
  Settings,
  Signal,
  SlidersHorizontal,
  Star,
  UserRound,
  UsersRound,
  Wifi,
} from 'lucide-react';
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import { Toggle } from './ProductUI';
import { useTransientMessage } from './useTransientMessage';

type MainScreen = 'chats' | 'notifications' | 'orders' | 'settings';
type ManagerScreen =
  | 'chat'
  | 'chats'
  | 'create-task'
  | 'login'
  | 'notifications'
  | 'order'
  | 'orders'
  | 'payment'
  | 'settings';
type OrderTab = 'order' | 'performer' | 'responses';

type MobileHeaderProps = {
  action?: ReactNode;
  onBack?: () => void;
  title: string;
};

const MOBILE_NAVIGATION = [
  { id: 'orders' as const, icon: BriefcaseBusiness, label: 'Маркетплейс' },
  { id: 'chats' as const, icon: MessageCircle, label: 'Чат' },
  { id: 'settings' as const, icon: Settings, label: 'Настройки' },
  { id: 'notifications' as const, icon: Bell, label: 'Уведомления' },
];

function MobileHeader({ action, onBack, title }: MobileHeaderProps) {
  return (
    <header className="ww-mobile-header">
      {onBack ? (
        <button aria-label="Назад" onClick={onBack} type="button">
          <ArrowLeft aria-hidden="true" size={21} />
        </button>
      ) : (
        <span aria-hidden="true" />
      )}
      <h1>{title}</h1>
      {action ? (
        <div className="ww-mobile-header-action">{action}</div>
      ) : (
        <span aria-hidden="true" />
      )}
    </header>
  );
}

function MobileShell({ children }: { children: ReactNode }) {
  return (
    <div className="ww-mobile-device" data-demo-viewport="mobile">
      <div className="ww-mobile-statusbar" aria-hidden="true">
        <span>9:30</span>
        <span className="ww-mobile-status-icons">
          <Signal size={13} />
          <Wifi size={14} />
          <BatteryFull size={15} />
        </span>
      </div>
      <div className="ww-mobile-screen">{children}</div>
      <div className="ww-mobile-home-indicator" aria-hidden="true" />
    </div>
  );
}

function BottomNavigation({
  active,
  onNavigate,
}: {
  active: MainScreen;
  onNavigate: (screen: MainScreen) => void;
}) {
  return (
    <nav className="ww-mobile-bottom-nav" aria-label="Основная навигация">
      {MOBILE_NAVIGATION.map(({ icon: Icon, id, label }) => (
        <button
          aria-current={active === id ? 'page' : undefined}
          className={active === id ? 'is-active' : undefined}
          key={id}
          onClick={() => onNavigate(id)}
          type="button"
        >
          <Icon aria-hidden="true" size={20} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

function Avatar({ size = 'medium' }: { size?: 'large' | 'medium' | 'small' }) {
  return (
    <span className={`ww-mobile-avatar is-${size}`} aria-hidden="true">
      <UserRound size={size === 'large' ? 34 : size === 'medium' ? 27 : 22} />
    </span>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onLogin();
  };

  return (
    <div className="ww-mobile-login">
      <img
        className="ww-mobile-login-logo"
        alt="WinWork"
        src="/winwork-logo.svg"
      />
      <form autoComplete="off" onSubmit={submit}>
        <label className="ww-mobile-login-field">
          <img alt="" aria-hidden="true" src="/demo-assets/IYshz.png" />
          <input
            aria-label="Телефон"
            autoComplete="off"
            inputMode="tel"
            placeholder="Телефон"
            required
            type="tel"
          />
        </label>
        <label className="ww-mobile-login-field">
          <input
            aria-label="Пароль"
            autoComplete="new-password"
            placeholder="Пароль"
            required
            type="password"
          />
        </label>
        <button
          className="ww-mobile-primary"
          data-demo-action="manager-login"
          type="submit"
        >
          Войти
        </button>
        <button className="ww-mobile-secondary" type="button">
          Вход для сотрудников
        </button>
        <p>Через Active Directory</p>
        <button className="ww-mobile-text-button" type="button">
          Забыли пароль?
        </button>
      </form>
    </div>
  );
}

type WorkerSummary = {
  name: string;
  state: 'Выполнен' | 'Выполняется';
};

type OrderCardProps = {
  address: string;
  amount: string;
  onClick: () => void;
  responseCount?: number;
  status: 'Есть отклики' | 'Ожидает оплаты' | 'Выполняется';
  team?: { filled: number; total: number; workers?: WorkerSummary[] };
  time: string;
  title: string;
};

function OrderCard({
  address,
  amount,
  onClick,
  responseCount,
  status,
  team,
  time,
  title,
}: OrderCardProps) {
  const [expanded, setExpanded] = useState(Boolean(team?.workers));

  return (
    <article className="ww-order-card">
      <button className="ww-order-card-main" onClick={onClick} type="button">
        <strong>{title}</strong>
        <span>
          <MapPin aria-hidden="true" size={20} /> {address}
        </span>
        <span>
          <Clock3 aria-hidden="true" size={20} /> {time}
        </span>
        <div className="ww-order-card-meta">
          <b>{amount}</b>
          <span>
            {responseCount ? <small>{responseCount} новых</small> : null}
            <em
              className={`is-${status === 'Выполняется' ? 'blue' : status === 'Есть отклики' ? 'orange' : 'green'}`}
            >
              {status}
            </em>
          </span>
        </div>
      </button>
      {team ? (
        <div className="ww-order-team">
          <button
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
            type="button"
          >
            <UsersRound aria-hidden="true" size={19} />
            <strong>
              {team.filled} из {team.total}
            </strong>
            <ChevronDown
              aria-hidden="true"
              className={expanded ? 'is-open' : undefined}
              size={18}
            />
          </button>
          {expanded && team.workers ? (
            <div>
              {team.workers.map((worker) => (
                <span key={worker.name}>
                  {worker.name}
                  <em
                    className={
                      worker.state === 'Выполнен' ? 'is-green' : 'is-blue'
                    }
                  >
                    {worker.state}
                  </em>
                </span>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function OrdersScreen({
  onCreate,
  onOpenOrder,
  onOpenPayment,
}: {
  onCreate: () => void;
  onOpenOrder: (tab: OrderTab) => void;
  onOpenPayment: () => void;
}) {
  const [filter, setFilter] = useState<'active' | 'all' | 'payment'>('all');
  const days = [
    ['вс', '13'],
    ['пн', '14'],
    ['вт', '15'],
    ['ср', '16'],
    ['чт', '17'],
    ['пт', '18'],
    ['сб', '19'],
    ['вс', '20'],
  ];

  return (
    <div className="ww-mobile-page has-bottom-nav">
      <header className="ww-marketplace-header">
        <h1>Маркетплейс</h1>
        <button
          aria-label="Создать задание"
          data-demo-action="manager-add-task"
          onClick={onCreate}
          type="button"
        >
          <Plus aria-hidden="true" size={27} />
        </button>
      </header>
      <div className="ww-mobile-search-row">
        <label>
          <Search aria-hidden="true" size={19} />
          <textarea
            aria-label="Поиск заказов"
            placeholder="Название заказа или ФИО исполнителя"
            rows={2}
          />
        </label>
        <button aria-label="Календарь" type="button">
          <CalendarDays aria-hidden="true" size={21} />
        </button>
      </div>
      <div className="ww-mobile-filter-row">
        <button aria-label="Другие фильтры" type="button">
          <SlidersHorizontal aria-hidden="true" size={20} />
        </button>
        <button
          className={filter === 'all' ? 'is-active' : undefined}
          onClick={() => setFilter('all')}
          type="button"
        >
          Все
        </button>
        <button
          className={filter === 'payment' ? 'is-active' : undefined}
          data-demo-action="manager-waiting-payment"
          onClick={() => setFilter('payment')}
          type="button"
        >
          Ожидают оплаты
        </button>
        <button
          className={filter === 'active' ? 'is-active' : undefined}
          onClick={() => setFilter('active')}
          type="button"
        >
          Активные заказы
        </button>
        <button type="button">Завершенные сделки</button>
        <button type="button">На модерации</button>
        <button type="button">Архив</button>
      </div>
      <div className="ww-mobile-week" aria-label="Неделя">
        {days.map(([weekday, date]) => (
          <button
            className={date === '14' ? 'is-active' : undefined}
            key={date}
            type="button"
          >
            <small>{weekday}</small>
            <strong>{date}</strong>
          </button>
        ))}
      </div>
      <section className="ww-order-list">
        <h2>{filter === 'payment' ? 'Ожидают оплаты' : 'Сегодня'}</h2>
        {filter === 'payment' ? (
          <OrderCard
            address="Склад на пр. Максимова"
            amount="1 200₽"
            onClick={onOpenPayment}
            status="Ожидает оплаты"
            time="Выполнено в 14:20"
            title="Грузчик. Погрузка, разгрузка. Склад на пр. Максимова."
          />
        ) : (
          <>
            <OrderCard
              address="ТЦ «Столица», 3 этаж"
              amount="3 200₽"
              onClick={() => onOpenOrder('performer')}
              status="Выполняется"
              time="10:00"
              title="Грузчик. Погрузка и разгрузка товаров. Склад на проспекте Ленина."
            />
            <OrderCard
              address="ЖК «Солнечный город»"
              amount="4 000₽"
              onClick={() => onOpenOrder('responses')}
              responseCount={2}
              status="Есть отклики"
              time="16:00"
              title="Логист. Организация транспортировки и хранения товаров. Склад на улице Звездной."
            />
            <OrderCard
              address="Склад «Орион», ворота №5"
              amount="2 800₽"
              onClick={() => onOpenOrder('responses')}
              responseCount={2}
              status="Есть отклики"
              team={{ filled: 1, total: 3 }}
              time="09:00"
              title="Курьер. Доставка и обработка посылок. Склад на проспекте Свободы."
            />
            <OrderCard
              address="Производство «Луч»"
              amount="3 000₽"
              onClick={() => onOpenOrder('performer')}
              status="Выполняется"
              team={{
                filled: 3,
                total: 5,
                workers: [
                  { name: 'Смирнов И. П.', state: 'Выполняется' },
                  { name: 'Петров В. С.', state: 'Выполнен' },
                ],
              }}
              time="11:30"
              title="Складской работник. Упаковка и распределение товаров. Склад на улице Лунной."
            />
            <h2>Завтра</h2>
            <OrderCard
              address="Магазин на Новомосковской"
              amount="2 500₽"
              onClick={() => onOpenOrder('performer')}
              status="Выполняется"
              time="14:30"
              title="Оператор погрузчика. Управление погрузкой и разгрузкой. Склад на проспекте Технологий."
            />
          </>
        )}
      </section>
    </div>
  );
}

function MobileField({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <label className="ww-mobile-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function CreateTaskScreen({
  onBack,
  onCreated,
}: {
  onBack: () => void;
  onCreated: () => void;
}) {
  const [operations, setOperations] = useState<string[]>([]);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onCreated();
  };

  return (
    <div className="ww-mobile-page">
      <MobileHeader onBack={onBack} title="Создать задание" />
      <form className="ww-mobile-form" onSubmit={submit}>
        <h2>Объект</h2>
        <MobileField label="Объект">
          <select defaultValue="Склад на пр. Максимова">
            <option>Склад на пр. Максимова</option>
            <option>ТЦ «Столица»</option>
          </select>
        </MobileField>
        <h2>Вид деятельности</h2>
        <div className="ww-mobile-field-grid is-activity">
          <MobileField label="Вид деятельности">
            <select defaultValue="Грузчик">
              <option>Грузчик</option>
              <option>Кладовщик</option>
            </select>
          </MobileField>
          <MobileField label="Ставка">
            <input defaultValue="1000 Р" inputMode="numeric" />
          </MobileField>
        </div>
        <MobileField label="Количество исполнителей">
          <input defaultValue="1" inputMode="numeric" />
        </MobileField>
        <h2>Операции</h2>
        <div className="ww-operation-list">
          {[
            'Разгрузка',
            'Погрузка',
            'Транспортировка',
            'Хранение',
            'Комплектация',
            'Инвентаризация',
          ].map((operation) => (
            <label key={operation}>
              <input
                checked={operations.includes(operation)}
                onChange={(event) => {
                  const isChecked = event.currentTarget.checked;
                  setOperations((current) =>
                    isChecked
                      ? [...current, operation]
                      : current.filter((item) => item !== operation),
                  );
                }}
                type="checkbox"
              />
              {operation}
            </label>
          ))}
        </div>
        <h2>Период выполнения заказа</h2>
        <p className="ww-mobile-helper">
          Укажите время того региона, в котором будет выполняться заказ
        </p>
        <h3>Начало</h3>
        <div className="ww-mobile-field-grid">
          <MobileField label="Дата">
            <input defaultValue="17.03.2026" />
          </MobileField>
          <MobileField label="Время">
            <input defaultValue="09:00" />
          </MobileField>
        </div>
        <h3>Завершение</h3>
        <div className="ww-mobile-field-grid">
          <MobileField label="Дата">
            <input defaultValue="17.03.2026" />
          </MobileField>
          <MobileField label="Время">
            <input defaultValue="09:00" />
          </MobileField>
        </div>
        <section className="ww-limit-summary">
          <h2>Остаток лимита в текущем месяце</h2>
          <p>10 дней до сброса лимита</p>
          <dl>
            <div>
              <dt>Заказов</dt>
              <dd>12 из 24</dd>
            </div>
            <div>
              <dt>Вознаграждение</dt>
              <dd>96 000 Р из 192 000 Р</dd>
            </div>
          </dl>
        </section>
        <div className="ww-reward-total">
          <strong>Вознаграждение всего</strong>
          <b>13 000 Р</b>
        </div>
        <h2>Название задания</h2>
        <textarea
          aria-label="Название задания"
          defaultValue="Грузчик. Погрузка, разгрузка. Склад на пр. Максимова."
          rows={2}
        />
        <button
          className="ww-mobile-primary"
          data-demo-action="manager-create-task"
          type="submit"
        >
          Создать
        </button>
      </form>
    </div>
  );
}

function OrderTabs({
  active,
  onChange,
  showResponses,
}: {
  active: OrderTab;
  onChange: (tab: OrderTab) => void;
  showResponses: boolean;
}) {
  return (
    <div className="ww-mobile-segmented">
      <button
        className={active === 'performer' ? 'is-active' : undefined}
        onClick={() => onChange('performer')}
        type="button"
      >
        Исполнитель
      </button>
      <button
        className={active === 'order' ? 'is-active' : undefined}
        onClick={() => onChange('order')}
        type="button"
      >
        Заказ
      </button>
      {showResponses ? (
        <button
          className={active === 'responses' ? 'is-active' : undefined}
          onClick={() => onChange('responses')}
          type="button"
        >
          Отклики 12
        </button>
      ) : null}
    </div>
  );
}

function RatingLine() {
  return (
    <div className="ww-worker-rating">
      <span>
        <Star aria-hidden="true" fill="currentColor" size={15} /> 4.6 из 5
      </span>
      <button type="button">21 отзыв</button>
      <span>28.08.2006 - 20 лет</span>
    </div>
  );
}

function WorkerProgress() {
  return (
    <div className="ww-worker-progress">
      <span aria-hidden="true" />
      <strong>65%</strong>
      <p>Выполнил 18 заданий из 50</p>
    </div>
  );
}

function WorkerProfileCard({
  compact = false,
  name,
}: {
  compact?: boolean;
  name: string;
}) {
  return (
    <div className={`ww-worker-card${compact ? ' is-compact' : ''}`}>
      <div className="ww-worker-card-heading">
        <Avatar size="medium" />
        <div>
          <h2>{name}</h2>
          <p>СМЗ</p>
        </div>
        {compact ? <ChevronDown aria-hidden="true" size={19} /> : null}
      </div>
      <RatingLine />
      <WorkerProgress />
    </div>
  );
}

function ContactActions() {
  return (
    <div className="ww-worker-actions">
      <h3>Контакты</h3>
      <div>
        <button type="button">
          <MessageSquareText aria-hidden="true" size={18} /> Чат
        </button>
        <button type="button">
          <Phone aria-hidden="true" size={18} /> +7 987 097 09 10
        </button>
      </div>
      <button type="button">Посмотреть анкету</button>
    </div>
  );
}

function ShiftLimit() {
  return (
    <div className="ww-shift-limit">
      <h3>Лимит смен</h3>
      <div>
        <span>Заказов в апреле</span>
        <strong>8 из 15</strong>
      </div>
      <span aria-hidden="true">
        <i />
      </span>
      <button type="button">
        <Flag aria-hidden="true" size={17} /> Заблокировать
      </button>
    </div>
  );
}

function PerformerPanel() {
  return (
    <section className="ww-worker-panel">
      <WorkerProfileCard name="Иванов Алексей Дмитриевич" />
      <ContactActions />
      <ShiftLimit />
    </section>
  );
}

function OrderInfoPanel() {
  const details = [
    ['Объект', 'Склад на пр. Максимова'],
    ['Вид деятельности', 'Кладовщик'],
    ['Ставка', '1000 Р'],
    ['Вознаграждение всего', '1200 Р'],
    ['Период выполнения', '21.08.26 10:00 — 21.08.26 18:00'],
    [
      'Место выполнения заказа',
      'Московская область, Москва, Проспект Ленина, ст4, корпус 12, квартира 3',
    ],
    [
      'Операции',
      'Разгрузка, Погрузка, Транспортировка, Хранение, Комплектация, Инвентаризация',
    ],
    [
      'Дополнительная информация',
      'Погрузить 10 паллет воды «Хрустальный родник» и 5 паллет сока «Солнечный» на склад №5.',
    ],
    ['Комментарии', '-'],
  ];
  return (
    <section className="ww-order-info-panel">
      <dl>
        {details.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function ResponseCard({
  name,
  onSelect,
}: {
  name: string;
  onSelect: () => void;
}) {
  const [refused, setRefused] = useState(false);
  if (refused) return null;
  return (
    <article className="ww-response-card">
      <WorkerProfileCard compact name={name} />
      <div className="ww-response-actions">
        <button onClick={onSelect} type="button">
          Выбрать
        </button>
        <button onClick={() => setRefused(true)} type="button">
          Отказать
        </button>
      </div>
    </article>
  );
}

function ResponsesPanel({ onSelect }: { onSelect: () => void }) {
  return (
    <section className="ww-responses-panel">
      <ResponseCard name="Александров Егор Ильич" onSelect={onSelect} />
      <ResponseCard name="Белов Михаил Данилович" onSelect={onSelect} />
      <ResponseCard name="Воробьев Артем Павлович" onSelect={onSelect} />
    </section>
  );
}

function OrderScreen({
  initialTab,
  onBack,
  onAssigned,
}: {
  initialTab: OrderTab;
  onBack: () => void;
  onAssigned: () => void;
}) {
  const [tab, setTab] = useState<OrderTab>(initialTab);
  const showResponses = initialTab === 'responses';
  const title = showResponses
    ? 'Выкладка товара'
    : 'Грузчик. Погрузка, разгрузка. Склад на пр. Максимова.';
  return (
    <div className="ww-mobile-page">
      <MobileHeader onBack={onBack} title="Заказ" />
      <section className="ww-order-heading">
        <h2>{title}</h2>
        <div>
          <span>
            Создано<strong>28.08.26 10:00</strong>
          </span>
          <em className={showResponses ? 'is-orange' : 'is-blue'}>
            {showResponses ? 'Есть отклики' : 'Выполняется'}
          </em>
        </div>
      </section>
      <OrderTabs active={tab} onChange={setTab} showResponses={showResponses} />
      {tab === 'performer' ? <PerformerPanel /> : null}
      {tab === 'order' ? <OrderInfoPanel /> : null}
      {tab === 'responses' ? (
        <ResponsesPanel
          onSelect={() => {
            onAssigned();
            setTab('performer');
          }}
        />
      ) : null}
    </div>
  );
}

function PaymentCodeSheet({
  onCancel,
  onPaid,
}: {
  onCancel: () => void;
  onPaid: () => void;
}) {
  const [digits, setDigits] = useState(['', '', '', '', '']);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const complete = digits.every(Boolean);
  const updateDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    setDigits((current) =>
      current.map((item, position) => (position === index ? digit : item)),
    );
    if (digit && index < digits.length - 1)
      inputsRef.current[index + 1]?.focus();
  };
  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0)
      inputsRef.current[index - 1]?.focus();
  };
  return (
    <div className="ww-mobile-sheet-layer">
      <button
        aria-label="Закрыть подтверждение"
        className="ww-mobile-sheet-scrim"
        onClick={onCancel}
        type="button"
      />
      <section className="ww-mobile-sheet" aria-label="Оплата заказа">
        <span className="ww-mobile-sheet-handle" aria-hidden="true" />
        <h2>Оплата заказа</h2>
        <div className="ww-payment-sheet-amount">
          <span>Вознаграждение</span>
          <strong>2400 Р</strong>
        </div>
        <p>Отправили код на номер +7 912 345 67 89</p>
        <div className="ww-otp-fields">
          {digits.map((digit, index) => (
            <input
              aria-label={`Цифра кода ${index + 1}`}
              autoFocus={index === 0}
              inputMode="numeric"
              key={index}
              maxLength={1}
              onChange={(event) =>
                updateDigit(index, event.currentTarget.value)
              }
              onKeyDown={(event) => handleKeyDown(index, event)}
              ref={(element) => {
                inputsRef.current[index] = element;
              }}
              value={digit}
            />
          ))}
        </div>
        <button className="ww-payment-link is-muted" type="button">
          Отправить повторно через 00:58
        </button>
        <button className="ww-payment-link" type="button">
          Код не приходит
        </button>
        <button
          className="ww-mobile-primary"
          disabled={!complete}
          onClick={onPaid}
          type="button"
        >
          Отправить
        </button>
        <button
          className="ww-mobile-secondary"
          onClick={onCancel}
          type="button"
        >
          Отмена
        </button>
      </section>
    </div>
  );
}

function PaymentScreen({
  onBack,
  onPaid,
}: {
  onBack: () => void;
  onPaid: () => void;
}) {
  const [otpOpen, setOtpOpen] = useState(false);
  const [rating, setRating] = useState(0);
  return (
    <div className="ww-mobile-page">
      <MobileHeader onBack={onBack} title="Заказ" />
      <section className="ww-order-heading">
        <h2>Грузчик. Погрузка, разгрузка. Склад на пр. Максимова.</h2>
        <div>
          <span>
            Создано<strong>28.08.26 10:00</strong>
          </span>
          <em className="is-green">Выполнен</em>
        </div>
      </section>
      <div className="ww-mobile-segmented is-payment">
        <button type="button">Исполнитель</button>
        <button type="button">Заказ</button>
        <button className="is-active" type="button">
          Оплата
        </button>
      </div>
      <section className="ww-payment-content">
        <p>Исполнитель подтвердил, что всё готово.</p>
        <h2>Вознаграждение</h2>
        <strong className="ww-payment-reward">1200 Р</strong>
        <h2>Оценить исполнителей</h2>
        <p className="ww-payment-caption">
          Это поможет другим заказчикам принять решение
        </p>
        <article className="ww-rating-card">
          <div className="ww-rating-worker">
            <Avatar size="medium" />
            <div>
              <h3>Александр Иванович Петров</h3>
              <p>СМЗ</p>
            </div>
          </div>
          <h3>Кладовщик</h3>
          <div className="ww-rating-order-meta">
            <span>
              <Clock3 aria-hidden="true" size={18} /> 12 апреля&nbsp;&nbsp;09:00
            </span>
            <em>Выполнен</em>
          </div>
          <div className="ww-star-rating" aria-label="Поставьте оценку">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                aria-label={`Оценка ${star}`}
                key={star}
                onClick={() => setRating(star)}
                type="button"
              >
                <Star
                  aria-hidden="true"
                  fill={star <= rating ? 'currentColor' : 'none'}
                  size={23}
                />
              </button>
            ))}
          </div>
          <textarea
            aria-label="Оставьте отзыв"
            placeholder="Оставьте отзыв"
            rows={5}
          />
        </article>
        <button
          className="ww-mobile-primary"
          data-demo-action="manager-pay"
          onClick={() => setOtpOpen(true)}
          type="button"
        >
          Оплатить
        </button>
      </section>
      {otpOpen ? (
        <PaymentCodeSheet onCancel={() => setOtpOpen(false)} onPaid={onPaid} />
      ) : null}
    </div>
  );
}

function SettingsScreen({ onNotifications }: { onNotifications: () => void }) {
  return (
    <div className="ww-mobile-page has-bottom-nav">
      <h1 className="ww-mobile-page-title">Настройки</h1>
      <section className="ww-manager-card">
        <Avatar size="large" />
        <div>
          <h2>Анатолий Крастенко</h2>
          <p>+7 989 348 21 22</p>
        </div>
        <button aria-label="Выйти" type="button">
          <LogOut aria-hidden="true" size={20} />
        </button>
      </section>
      <section className="ww-settings-list is-main">
        <button onClick={onNotifications} type="button">
          <span>Уведомления</span>
          <ChevronRight aria-hidden="true" size={20} />
        </button>
      </section>
    </div>
  );
}

const NOTIFICATION_ROWS = [
  ['responses', 'Отклики на заказа', 'На заказ откликнулись исполнители'],
  [
    'rejection',
    'Отказ от заказа исполнителем',
    'Если назначенный исполнитель откажется от заказа',
  ],
  ['status', 'Изменение статуса заказа', 'Есть отклики, выполняется и тд'],
  ['payment', 'Ошибка оплаты', 'Если статус заказа “Ошибка оплаты”'],
  ['moderation', 'Модерация', 'Если заказ не пройдет модерацию'],
  ['start', 'Начало работы', 'Исполнитель взял заказ в работу'],
  ['finish', 'Завершение работы', 'Исполнитель завершил работу над заказом'],
] as const;

function NotificationSettingsScreen({ onBack }: { onBack: () => void }) {
  const [settings, setSettings] = useState<
    Record<(typeof NOTIFICATION_ROWS)[number][0], boolean>
  >({
    finish: true,
    moderation: false,
    payment: true,
    rejection: true,
    responses: true,
    start: true,
    status: true,
  });
  const allEnabled = Object.values(settings).every(Boolean);
  return (
    <div className="ww-mobile-page">
      <MobileHeader onBack={onBack} title="Настройки уведомлений" />
      <section className="ww-notification-settings">
        <p>Уведомления будут приходить на этот телефон в виде push</p>
        <div className="ww-notification-heading">
          <h2>Заказы</h2>
          <button
            onClick={() =>
              setSettings(
                (current) =>
                  Object.fromEntries(
                    Object.keys(current).map((key) => [key, true]),
                  ) as typeof current,
              )
            }
            type="button"
          >
            {allEnabled ? 'Все включены' : 'Включить все'}
          </button>
        </div>
        <div className="ww-notification-list">
          {NOTIFICATION_ROWS.map(([key, title, description]) => (
            <div key={key}>
              <span>
                <strong>{title}</strong>
                <small>{description}</small>
              </span>
              <Toggle
                checked={settings[key]}
                label={title}
                onChange={(checked) =>
                  setSettings((value) => ({ ...value, [key]: checked }))
                }
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const CHAT_ROWS = [
  [
    'Доставка документов в офис',
    'Василий Петров',
    'Скоро буду',
    '19:45',
    'a7b8c9d0',
  ],
  [
    'Срочная доставка цветов',
    'Анна Смирнова',
    'Подготовьте документы',
    '19:30',
    'f1g2h3i4',
  ],
  [
    'Перевозка груза по городу',
    'Алексей Кузнецов',
    'Жду на месте',
    '19:15',
    'j5k6l7m8',
  ],
  [
    'Помощь в переезде',
    'Елена Морозова',
    'Выезжаю через 5 минут',
    '19:00',
    'n9o0p1q2',
  ],
  [
    'Забрать посылку от клиента',
    'Алена Яковлева',
    'Ожидайте звонка',
    '18:45',
    'r3s4t5u6',
  ],
  [
    'Раздача листовок на улице',
    'Ольга Иванова',
    'Все готово к отправке',
    '18:15',
    'v7w8x9y0',
  ],
] as const;

function ChatsScreen({ onOpenChat }: { onOpenChat: () => void }) {
  const [filter, setFilter] = useState('Все');
  return (
    <div className="ww-mobile-page has-bottom-nav">
      <h1 className="ww-mobile-page-title">Чаты</h1>
      <section className="ww-chat-filters">
        <span>Фильтры</span>
        <div>
          {['Все', 'Активные', 'Завершенные', 'Архив'].map((label) => (
            <button
              className={filter === label ? 'is-active' : undefined}
              key={label}
              onClick={() => setFilter(label)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </section>
      <section className="ww-chat-list">
        {CHAT_ROWS.map(([title, name, message, time, id], index) => (
          <button
            key={id}
            onClick={index === 0 ? onOpenChat : undefined}
            type="button"
          >
            <Avatar size="medium" />
            <span>
              <strong>{title}</strong>
              <small>{name}</small>
              <p>{message}</p>
            </span>
            <span className="ww-chat-row-meta">
              <time>{time}</time>
              <small>{id}</small>
              <b>12</b>
            </span>
          </button>
        ))}
      </section>
    </div>
  );
}

type ChatEntry =
  | { id: string; kind: 'date'; label: string }
  | {
      direction: 'incoming' | 'outgoing';
      id: string;
      kind: 'file';
      name: string;
      size: string;
      time: string;
    }
  | {
      direction: 'incoming' | 'outgoing';
      id: string;
      kind: 'message';
      meta?: string;
      text: string;
      time: string;
    };

const INITIAL_CHAT_ENTRIES: ChatEntry[] = [
  { id: 'date-18-june', kind: 'date', label: '18 июня' },
  {
    direction: 'outgoing',
    id: 'progress-question',
    kind: 'message',
    text: 'Добрый день, Алексей! Как продвигается выкладка товара в «Сытый Барин»?',
    time: '12:39',
  },
  {
    direction: 'incoming',
    id: 'progress-answer',
    kind: 'message',
    text: 'Добрый день, Иван Петрович! Все идет по плану.',
    time: '12:39',
  },
  {
    direction: 'incoming',
    id: 'work-update',
    kind: 'message',
    text: 'Отлично! Завершаю выкладку в отделе молочной продукции.',
    time: '12:39',
  },
  { id: 'date-yesterday', kind: 'date', label: 'Вчера' },
  {
    direction: 'outgoing',
    id: 'photo-request',
    kind: 'message',
    text: 'Хорошо, как закончишь, пришли фотоотчет.',
    time: '12:39',
  },
  {
    direction: 'incoming',
    id: 'photo-confirmation',
    kind: 'message',
    text: 'Будет сделано!',
    time: '12:39',
  },
  { id: 'date-today', kind: 'date', label: 'Сегодня' },
  {
    direction: 'incoming',
    id: 'photo-ready',
    kind: 'message',
    text: 'Вот фото',
    time: '12:39',
  },
  {
    direction: 'outgoing',
    id: 'work-accepted',
    kind: 'message',
    text: 'Окей, принял работу. Меняю статус',
    time: '12:39',
  },
  {
    direction: 'incoming',
    id: 'report-file',
    kind: 'file',
    name: 'Очень длинное название файла',
    size: '911 кб',
    time: '12:39',
  },
  {
    direction: 'incoming',
    id: 'worker-thanks',
    kind: 'message',
    text: 'Спасибо!',
    time: '12:39',
  },
  {
    direction: 'outgoing',
    id: 'receipt',
    kind: 'message',
    meta: 'Сообщение создано автоматически',
    text: 'Чек по выполненному заказу\n\nПерейдите по ссылке чтобы посмотреть или скачать:\n\nhttps://lknpd.nalog.ru/api/v1/receipt/771548551232/207u1xi0yf/print',
    time: '12:39',
  },
];

function ChatScreen({ onBack }: { onBack: () => void }) {
  const [draft, setDraft] = useState('');
  const [entries, setEntries] = useState(INITIAL_CHAT_ENTRIES);
  const threadRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const thread = threadRef.current;
    if (thread) thread.scrollTop = thread.scrollHeight;
  }, [entries]);
  const send = () => {
    const message = draft.trim();
    if (!message) return;
    setEntries((current) => [
      ...current,
      {
        direction: 'outgoing',
        id: `sent-${current.length}`,
        kind: 'message',
        text: message,
        time: '12:40',
      },
    ]);
    setDraft('');
  };
  return (
    <div className="ww-mobile-page ww-chat-page">
      <header className="ww-chat-order-header">
        <button aria-label="Назад" onClick={onBack} type="button">
          <ArrowLeft aria-hidden="true" size={21} />
        </button>
        <div>
          <h1>Выкладка товара</h1>
          <p>Создано 28.08.26 10:00</p>
        </div>
        <em>Оплата</em>
      </header>
      <section className="ww-chat-worker-header">
        <Avatar size="medium" />
        <div>
          <strong>Иванов Алексей Дмитриевич</strong>
          <p>
            СМЗ • 20 лет{' '}
            <span>
              <Star aria-hidden="true" fill="currentColor" size={14} /> 4.6 из 5
            </span>
            <button type="button">21 отзыв</button>
          </p>
        </div>
        <button type="button">
          Перейти к заказу <ChevronRight aria-hidden="true" size={19} />
        </button>
      </section>
      <div className="ww-chat-thread" ref={threadRef}>
        {entries.map((entry) => {
          if (entry.kind === 'date')
            return <time key={entry.id}>{entry.label}</time>;
          if (entry.kind === 'file')
            return (
              <div
                className={`ww-chat-file is-${entry.direction}`}
                key={entry.id}
              >
                <span>
                  <FileText aria-hidden="true" size={23} />
                </span>
                <strong>{entry.name}</strong>
                <b>.pdf</b>
                <small>{entry.size}</small>
                <time>{entry.time}</time>
              </div>
            );
          return (
            <p className={`is-${entry.direction}`} key={entry.id}>
              {entry.text}
              {entry.meta ? <em>{entry.meta}</em> : null}
              <small>{entry.time}</small>
            </p>
          );
        })}
      </div>
      <div className="ww-chat-composer">
        <button aria-label="Прикрепить файл" type="button">
          <Paperclip aria-hidden="true" size={21} />
        </button>
        <input
          aria-label="Сообщение"
          onChange={(event) => setDraft(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') send();
          }}
          placeholder="Сообщение"
          value={draft}
        />
        <button aria-label="Отправить" onClick={send} type="button">
          <Send aria-hidden="true" size={20} />
        </button>
      </div>
    </div>
  );
}

export function ManagerAppDemo() {
  const [screen, setScreen] = useState<ManagerScreen>('login');
  const [orderInitialTab, setOrderInitialTab] = useState<OrderTab>('performer');
  const [toast, setToast] = useTransientMessage();
  const mainNavigationScreen: MainScreen | null =
    screen === 'orders' || screen === 'chats' || screen === 'settings'
      ? screen
      : null;
  const openOrder = (tab: OrderTab) => {
    setOrderInitialTab(tab);
    setScreen('order');
  };
  return (
    <MobileShell key={screen}>
      {screen === 'login' ? (
        <LoginScreen onLogin={() => setScreen('orders')} />
      ) : null}
      {screen === 'orders' ? (
        <OrdersScreen
          onCreate={() => setScreen('create-task')}
          onOpenOrder={openOrder}
          onOpenPayment={() => setScreen('payment')}
        />
      ) : null}
      {screen === 'create-task' ? (
        <CreateTaskScreen
          onBack={() => setScreen('orders')}
          onCreated={() => {
            setToast('Задание создано');
            setScreen('orders');
          }}
        />
      ) : null}
      {screen === 'order' ? (
        <OrderScreen
          initialTab={orderInitialTab}
          onAssigned={() => setToast('Исполнитель выбран')}
          onBack={() => setScreen('orders')}
        />
      ) : null}
      {screen === 'payment' ? (
        <PaymentScreen
          onBack={() => setScreen('orders')}
          onPaid={() => {
            setToast('Оплата подтверждена');
            setScreen('orders');
          }}
        />
      ) : null}
      {screen === 'settings' ? (
        <SettingsScreen onNotifications={() => setScreen('notifications')} />
      ) : null}
      {screen === 'notifications' ? (
        <NotificationSettingsScreen onBack={() => setScreen('settings')} />
      ) : null}
      {screen === 'chats' ? (
        <ChatsScreen onOpenChat={() => setScreen('chat')} />
      ) : null}
      {screen === 'chat' ? (
        <ChatScreen onBack={() => setScreen('chats')} />
      ) : null}
      {mainNavigationScreen ? (
        <BottomNavigation
          active={mainNavigationScreen}
          onNavigate={setScreen}
        />
      ) : null}
      {toast ? (
        <div className="ww-mobile-toast" role="status">
          {toast}
        </div>
      ) : null}
    </MobileShell>
  );
}
