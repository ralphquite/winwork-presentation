import {
  ArrowLeft,
  BatteryFull,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Eye,
  EyeOff,
  Filter,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Send,
  Signal,
  Settings,
  SlidersHorizontal,
  UserRound,
  Users,
  Wifi,
  X,
} from 'lucide-react';
import { useState, type FormEvent, type ReactNode } from 'react';

import { Toggle } from './ProductUI';
import { useTransientMessage } from './useTransientMessage';

type ManagerScreen =
  | 'login'
  | 'orders'
  | 'create-task'
  | 'order'
  | 'payment'
  | 'settings'
  | 'notifications'
  | 'chats'
  | 'chat';

type MobileHeaderProps = {
  action?: ReactNode;
  onBack?: () => void;
  title: string;
};

function MobileHeader({ action, onBack, title }: MobileHeaderProps) {
  return (
    <header className="ww-mobile-header">
      {onBack ? (
        <button aria-label="Назад" onClick={onBack} type="button">
          <ArrowLeft aria-hidden="true" size={24} />
        </button>
      ) : null}
      <h1>{title}</h1>
      {action ? <div className="ww-mobile-header-action">{action}</div> : null}
    </header>
  );
}

function MobileShell({ children }: { children: ReactNode }) {
  return (
    <div className="ww-mobile-device" data-demo-viewport="mobile">
      <div className="ww-mobile-statusbar" aria-hidden="true">
        <span>9:41</span>
        <span className="ww-mobile-status-icons">
          <Signal size={12} />
          <Wifi size={12} />
          <BatteryFull size={14} />
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
  active: 'chats' | 'orders' | 'settings';
  onNavigate: (screen: 'chats' | 'orders' | 'settings') => void;
}) {
  const items = [
    { id: 'orders' as const, icon: BriefcaseBusiness, label: 'Маркетплейс' },
    { id: 'chats' as const, icon: MessageCircle, label: 'Чат' },
    { id: 'settings' as const, icon: Settings, label: 'Настройки' },
    { id: 'notifications' as const, icon: Bell, label: 'Уведомления' },
  ];

  return (
    <nav className="ww-mobile-bottom-nav" aria-label="Основная навигация">
      {items.map(({ icon: Icon, id, label }) => (
        <button
          aria-current={active === id ? 'page' : undefined}
          className={active === id ? 'is-active' : undefined}
          key={id}
          onClick={() => onNavigate(id === 'notifications' ? 'settings' : id)}
          type="button"
        >
          <Icon aria-hidden="true" size={21} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [showPassword, setShowPassword] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onLogin();
  };

  return (
    <div className="ww-mobile-login">
      <div className="ww-mobile-logo" aria-label="WinWork">
        <img alt="" aria-hidden="true" src="/winwork-logo.svg" />
      </div>
      <div>
        <h1>Вход в приложение</h1>
        <p>Управляйте объектами, заданиями и исполнителями с телефона.</p>
      </div>
      <form onSubmit={submit}>
        <label>
          <span>Телефон</span>
          <input
            defaultValue="+7 900 555-01-09"
            inputMode="tel"
            required
            type="tel"
          />
        </label>
        <label>
          <span>Пароль</span>
          <div>
            <input
              defaultValue="demo-manager"
              required
              type={showPassword ? 'text' : 'password'}
            />
            <button
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              onClick={() => setShowPassword((visible) => !visible)}
              type="button"
            >
              {showPassword ? (
                <EyeOff aria-hidden="true" size={19} />
              ) : (
                <Eye aria-hidden="true" size={19} />
              )}
            </button>
          </div>
        </label>
        <button
          className="ww-mobile-primary"
          data-demo-action="manager-login"
          type="submit"
        >
          Войти
        </button>
        <button className="ww-mobile-text-button" type="button">
          Не помню пароль
        </button>
      </form>
    </div>
  );
}

type OrderCardProps = {
  address: string;
  amount: string;
  onClick: () => void;
  status: 'Есть отклики' | 'Ожидает оплаты' | 'Выполняется';
  time: string;
  title: string;
};

function OrderCard({
  address,
  amount,
  onClick,
  status,
  time,
  title,
}: OrderCardProps) {
  return (
    <button className="ww-order-card" onClick={onClick} type="button">
      <strong>{title}</strong>
      <span>
        <MapPin aria-hidden="true" size={18} /> {address}
      </span>
      <span>
        <Clock3 aria-hidden="true" size={18} /> {time}
      </span>
      <div>
        <b>{amount}</b>
        <em
          className={`is-${status === 'Выполняется' ? 'blue' : status === 'Есть отклики' ? 'orange' : 'red'}`}
        >
          {status}
        </em>
      </div>
    </button>
  );
}

function OrdersScreen({
  onCreate,
  onNavigate,
  onOpenOrder,
  onOpenPayment,
}: {
  onCreate: () => void;
  onNavigate: (screen: 'chats' | 'orders' | 'settings') => void;
  onOpenOrder: () => void;
  onOpenPayment: () => void;
}) {
  const [filter, setFilter] = useState<'all' | 'payment' | 'active'>('all');

  return (
    <div className="ww-mobile-page has-bottom-nav">
      <MobileHeader
        action={
          <button
            aria-label="Создать задание"
            className="ww-mobile-round-action"
            data-demo-action="manager-add-task"
            onClick={onCreate}
            type="button"
          >
            <Plus aria-hidden="true" size={25} />
          </button>
        }
        title="Маркетплейс"
      />
      <div className="ww-mobile-search-row">
        <label>
          <Search aria-hidden="true" size={18} />
          <input
            aria-label="Поиск заказов"
            placeholder="Название заказа или ФИО исполнителя"
          />
        </label>
        <button aria-label="Календарь" type="button">
          <CalendarDays aria-hidden="true" size={21} />
        </button>
      </div>
      <div className="ww-mobile-filter-row">
        <button aria-label="Другие фильтры" type="button">
          <Filter aria-hidden="true" size={20} />
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
      </div>
      <div className="ww-mobile-week" aria-label="Неделя">
        {['13', '14', '15', '16', '17', '18', '19'].map((date) => (
          <button
            className={date === '14' ? 'is-active' : undefined}
            key={date}
            type="button"
          >
            {date}
          </button>
        ))}
      </div>
      <section className="ww-order-list">
        <h2>{filter === 'payment' ? 'Ожидают оплаты' : 'Сегодня'}</h2>
        {filter === 'payment' ? (
          <OrderCard
            address="Склад «Север», зона B"
            amount="3 200 ₽"
            onClick={onOpenPayment}
            status="Ожидает оплаты"
            time="Выполнено в 14:20"
            title="Погрузка и разгрузка товаров"
          />
        ) : (
          <>
            <OrderCard
              address="ТЦ «Столица», 3 этаж"
              amount="3 200 ₽"
              onClick={onOpenOrder}
              status="Выполняется"
              time="10:00"
              title="Грузчик. Погрузка и разгрузка товаров. Склад на проспекте Ленина."
            />
            <OrderCard
              address="ЖК «Солнечный город»"
              amount="4 000 ₽"
              onClick={onOpenOrder}
              status="Есть отклики"
              time="16:00"
              title="Логист. Организация транспортировки и хранения товаров."
            />
            <OrderCard
              address="Склад «Орион», ворота №5"
              amount="2 800 ₽"
              onClick={onOpenOrder}
              status="Есть отклики"
              time="09:00"
              title="Курьер. Доставка и обработка посылок."
            />
          </>
        )}
      </section>
      <BottomNavigation active="orders" onNavigate={onNavigate} />
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
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onCreated();
  };

  return (
    <div className="ww-mobile-page">
      <MobileHeader onBack={onBack} title="Новое задание" />
      <form className="ww-mobile-form" onSubmit={submit}>
        <MobileField label="Вид деятельности">
          <select defaultValue="Кладовщик">
            <option>Кладовщик</option>
            <option>Грузчик</option>
          </select>
        </MobileField>
        <MobileField label="Название задания">
          <input defaultValue="Разгрузка товаров на складе" required />
        </MobileField>
        <MobileField label="Описание">
          <textarea
            defaultValue="Принять поставку и разместить товары по зонам хранения."
            rows={4}
          />
        </MobileField>
        <MobileField label="Объект">
          <select defaultValue="Склад на Новомосковской">
            <option>Склад на Новомосковской</option>
            <option>ТЦ «Столица»</option>
          </select>
        </MobileField>
        <div className="ww-mobile-field-grid">
          <MobileField label="Дата">
            <input defaultValue="14.08.2026" />
          </MobileField>
          <MobileField label="Время">
            <input defaultValue="10:00" />
          </MobileField>
        </div>
        <MobileField label="Вознаграждение, ₽">
          <input defaultValue="3200" inputMode="numeric" />
        </MobileField>
        <label className="ww-mobile-check">
          <input defaultChecked type="checkbox" /> Опубликовать сразу
        </label>
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

function OrderScreen({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<'order' | 'worker'>('worker');
  const [assigned, setAssigned] = useState(false);

  return (
    <div className="ww-mobile-page">
      <MobileHeader
        action={
          <button aria-label="Другие действия" type="button">
            <MoreHorizontal aria-hidden="true" size={24} />
          </button>
        }
        onBack={onBack}
        title="Заказ №1209-44"
      />
      <div className="ww-order-status-header">
        <span>14 августа · 10:00</span>
        <strong>Выполняется</strong>
      </div>
      <div className="ww-mobile-segmented">
        <button
          className={tab === 'worker' ? 'is-active' : undefined}
          onClick={() => setTab('worker')}
          type="button"
        >
          Исполнитель
        </button>
        <button
          className={tab === 'order' ? 'is-active' : undefined}
          onClick={() => setTab('order')}
          type="button"
        >
          Заказ
        </button>
      </div>
      {tab === 'worker' ? (
        <section className="ww-worker-panel">
          <div className="ww-worker-profile">
            <span>
              <UserRound aria-hidden="true" size={34} />
            </span>
            <div>
              <h2>Смирнов Иван Павлович</h2>
              <p>Рейтинг 4,9 · 38 заданий</p>
            </div>
          </div>
          <dl>
            <div>
              <dt>Телефон</dt>
              <dd>+7 900 555-14-20</dd>
            </div>
            <div>
              <dt>Статус</dt>
              <dd>{assigned ? 'Назначен' : 'Отклик получен'}</dd>
            </div>
            <div>
              <dt>Документы</dt>
              <dd>Проверены</dd>
            </div>
          </dl>
          <button
            className="ww-mobile-primary"
            onClick={() => setAssigned(true)}
            type="button"
          >
            {assigned ? (
              <>
                <Check aria-hidden="true" size={19} /> Исполнитель назначен
              </>
            ) : (
              'Назначить исполнителя'
            )}
          </button>
        </section>
      ) : (
        <section className="ww-order-info-panel">
          <h2>Грузчик. Погрузка и разгрузка товаров</h2>
          <p>
            <MapPin aria-hidden="true" size={18} /> ТЦ «Столица», 3 этаж
          </p>
          <dl>
            <div>
              <dt>Начало</dt>
              <dd>14 августа, 10:00</dd>
            </div>
            <div>
              <dt>Продолжительность</dt>
              <dd>4 часа</dd>
            </div>
            <div>
              <dt>Вознаграждение</dt>
              <dd>3 200 ₽</dd>
            </div>
            <div>
              <dt>Требования</dt>
              <dd>Медицинская книжка</dd>
            </div>
          </dl>
          <h3>Описание</h3>
          <p>
            Разгрузить товары, проверить количество мест и разместить их в зоне
            приёмки.
          </p>
        </section>
      )}
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
  const [otp, setOtp] = useState('');

  return (
    <div className="ww-mobile-page">
      <MobileHeader onBack={onBack} title="Оплата задания" />
      <section className="ww-payment-card">
        <span className="ww-payment-icon">
          <Check aria-hidden="true" size={28} />
        </span>
        <h2>Работа выполнена</h2>
        <p>Проверьте детали и оплатите задание исполнителю.</p>
      </section>
      <dl className="ww-mobile-detail-list">
        <div>
          <dt>Задание</dt>
          <dd>Погрузка и разгрузка товаров</dd>
        </div>
        <div>
          <dt>Исполнитель</dt>
          <dd>Смирнов Иван Павлович</dd>
        </div>
        <div>
          <dt>Вознаграждение</dt>
          <dd>3 200 ₽</dd>
        </div>
        <div>
          <dt>Комиссия</dt>
          <dd>160 ₽</dd>
        </div>
        <div className="is-total">
          <dt>Итого</dt>
          <dd>3 360 ₽</dd>
        </div>
      </dl>
      <button
        className="ww-mobile-primary ww-mobile-sticky-action"
        data-demo-action="manager-pay"
        onClick={() => setOtpOpen(true)}
        type="button"
      >
        Оплатить
      </button>
      {otpOpen ? (
        <div className="ww-mobile-sheet-layer">
          <button
            aria-label="Закрыть подтверждение"
            className="ww-mobile-sheet-scrim"
            onClick={() => setOtpOpen(false)}
            type="button"
          />
          <section className="ww-mobile-sheet">
            <button
              aria-label="Закрыть"
              onClick={() => setOtpOpen(false)}
              type="button"
            >
              <X aria-hidden="true" size={20} />
            </button>
            <h2>Подтвердите оплату</h2>
            <p>Введите код 1209 для подтверждения демо-операции.</p>
            <input
              aria-label="Код подтверждения"
              autoFocus
              inputMode="numeric"
              maxLength={4}
              onChange={(event) =>
                setOtp(event.currentTarget.value.replace(/\D/g, ''))
              }
              placeholder="••••"
              value={otp}
            />
            <button
              className="ww-mobile-primary"
              disabled={otp.length !== 4}
              onClick={onPaid}
              type="button"
            >
              Подтвердить
            </button>
          </section>
        </div>
      ) : null}
    </div>
  );
}

function SettingsScreen({
  onNavigate,
  onNotifications,
}: {
  onNavigate: (screen: 'chats' | 'orders' | 'settings') => void;
  onNotifications: () => void;
}) {
  const [available, setAvailable] = useState(true);

  return (
    <div className="ww-mobile-page has-bottom-nav">
      <MobileHeader title="Настройки" />
      <section className="ww-manager-card">
        <span>
          <UserRound aria-hidden="true" size={32} />
        </span>
        <div>
          <h2>Алексей Ковалёв</h2>
          <p>Руководитель объекта</p>
        </div>
      </section>
      <section className="ww-settings-list">
        <div>
          <span>
            <BriefcaseBusiness aria-hidden="true" size={20} /> Доступен для
            новых заданий
          </span>
          <Toggle
            checked={available}
            label="Доступен для новых заданий"
            onChange={setAvailable}
          />
        </div>
        <button onClick={onNotifications} type="button">
          <span>
            <Bell aria-hidden="true" size={20} /> Настройки уведомлений
          </span>
          <ChevronRight aria-hidden="true" size={20} />
        </button>
        <button type="button">
          <span>
            <Users aria-hidden="true" size={20} /> Сотрудники объекта
          </span>
          <ChevronRight aria-hidden="true" size={20} />
        </button>
        <button type="button">
          <span>
            <SlidersHorizontal aria-hidden="true" size={20} /> Параметры объекта
          </span>
          <ChevronRight aria-hidden="true" size={20} />
        </button>
      </section>
      <BottomNavigation active="settings" onNavigate={onNavigate} />
    </div>
  );
}

function NotificationSettingsScreen({ onBack }: { onBack: () => void }) {
  const [settings, setSettings] = useState({
    messages: true,
    orders: true,
    payments: false,
    reminders: true,
  });

  return (
    <div className="ww-mobile-page">
      <MobileHeader onBack={onBack} title="Уведомления" />
      <section className="ww-settings-list">
        {(
          [
            ['orders', 'Новые задания'],
            ['messages', 'Новые сообщения'],
            ['payments', 'Оплаты и документы'],
            ['reminders', 'Напоминания о начале'],
          ] as const
        ).map(([key, label]) => (
          <div key={key}>
            <span>{label}</span>
            <Toggle
              checked={settings[key]}
              label={label}
              onChange={(checked) =>
                setSettings((value) => ({ ...value, [key]: checked }))
              }
            />
          </div>
        ))}
      </section>
    </div>
  );
}

function ChatsScreen({
  onNavigate,
  onOpenChat,
}: {
  onNavigate: (screen: 'chats' | 'orders' | 'settings') => void;
  onOpenChat: () => void;
}) {
  return (
    <div className="ww-mobile-page has-bottom-nav">
      <MobileHeader title="Чаты" />
      <label className="ww-chat-search">
        <Search aria-hidden="true" size={18} />
        <input aria-label="Поиск чатов" placeholder="Поиск" />
      </label>
      <section className="ww-chat-list">
        {[
          ['Смирнов Иван', 'Буду на объекте к 9:50', '10:12'],
          ['Петров Виктор', 'Задание завершено', 'Вчера'],
          ['Поддержка WinWork', 'Документы готовы', 'Пн'],
        ].map(([name, message, time], index) => (
          <button
            key={name}
            onClick={index === 0 ? onOpenChat : undefined}
            type="button"
          >
            <span>
              <UserRound aria-hidden="true" size={24} />
            </span>
            <div>
              <strong>{name}</strong>
              <p>{message}</p>
            </div>
            <time>{time}</time>
          </button>
        ))}
      </section>
      <BottomNavigation active="chats" onNavigate={onNavigate} />
    </div>
  );
}

function ChatScreen({ onBack }: { onBack: () => void }) {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState([
    'Буду на объекте к 9:50',
    'Отлично, проход через центральный вход.',
  ]);

  const send = () => {
    const message = draft.trim();
    if (!message) return;
    setMessages((current) => [...current, message]);
    setDraft('');
  };

  return (
    <div className="ww-mobile-page ww-chat-page">
      <MobileHeader onBack={onBack} title="Смирнов Иван" />
      <div className="ww-chat-thread">
        <time>Сегодня</time>
        {messages.map((message, index) => (
          <p
            className={index % 2 === 0 ? 'is-incoming' : 'is-outgoing'}
            key={`${message}-${index}`}
          >
            {message}
            <small>{index % 2 === 0 ? '10:12' : '10:13'}</small>
          </p>
        ))}
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
  const [toast, setToast] = useTransientMessage();

  const navigateMain = (target: 'chats' | 'orders' | 'settings') =>
    setScreen(target);

  return (
    <MobileShell>
      {screen === 'login' ? (
        <LoginScreen onLogin={() => setScreen('orders')} />
      ) : null}
      {screen === 'orders' ? (
        <OrdersScreen
          onCreate={() => setScreen('create-task')}
          onNavigate={navigateMain}
          onOpenOrder={() => setScreen('order')}
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
        <OrderScreen onBack={() => setScreen('orders')} />
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
        <SettingsScreen
          onNavigate={navigateMain}
          onNotifications={() => setScreen('notifications')}
        />
      ) : null}
      {screen === 'notifications' ? (
        <NotificationSettingsScreen onBack={() => setScreen('settings')} />
      ) : null}
      {screen === 'chats' ? (
        <ChatsScreen
          onNavigate={navigateMain}
          onOpenChat={() => setScreen('chat')}
        />
      ) : null}
      {screen === 'chat' ? (
        <ChatScreen onBack={() => setScreen('chats')} />
      ) : null}
      {toast ? (
        <div className="ww-mobile-toast" role="status">
          {toast}
        </div>
      ) : null}
    </MobileShell>
  );
}
