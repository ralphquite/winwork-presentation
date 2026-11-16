import documentIcon from '../assets/contracting/performer-document.svg?inline';
import openingsIcon from '../assets/contracting/performer-openings.svg?inline';
import publisherIcon from '../assets/contracting/performer-publisher.svg?inline';
import batteryIcon from '../assets/contracting/performer-status-battery.svg?inline';
import signalIcon from '../assets/contracting/performer-status-signal.svg?inline';
import wifiIcon from '../assets/contracting/performer-status-wifi.svg?inline';
import {
  PerformerDetailHeader,
  PerformerStatusBar,
  PerformerTaskDetails,
  PerformerTaskSummary,
} from '../presentation/flows/PerformerResponseDemo';
import { publicAssetUrl } from '../presentation/publicAssetUrl';
import { companies, task, type DesktopRole } from './fixtures';

import '../styles/demo-product.css';
import '../styles/contracting-performer.css';

export type PerformerState =
  | 'offer'
  | 'applied'
  | 'confirm-start'
  | 'assigned'
  | 'working'
  | 'confirm-done'
  | 'confirmed'
  | 'payout'
  | 'paid';

type Sheet = 'offer' | 'sign' | 'confirm';

type Screen = {
  title: 'Задание' | 'Отклик';
  status?: {
    label: string;
    description: string;
    tone: 'info' | 'warning' | 'assigned' | 'active' | 'complete';
  };
  actions?: 'chat' | 'chat-and-cancel';
  showDocument?: boolean;
  sheet?: Sheet;
};

const WORKING_SCREEN = {
  title: 'Отклик',
  status: {
    label: 'В процессе выполнения',
    description: 'Выполните задание',
    tone: 'active',
  },
  actions: 'chat-and-cancel',
  showDocument: true,
} as const satisfies Screen;

const SCREENS: Record<PerformerState, Screen> = {
  offer: { title: 'Задание', sheet: 'offer' },
  applied: {
    title: 'Задание',
    status: {
      label: 'На рассмотрении',
      description: 'Отклик на рассмотрении у заказчика',
      tone: 'info',
    },
  },
  'confirm-start': {
    title: 'Задание',
    status: {
      label: 'Подтвердите выход',
      description:
        'Заказчик выбрал вас. Подпишите документы, чтобы подтвердить выход.',
      tone: 'warning',
    },
    actions: 'chat-and-cancel',
    sheet: 'sign',
  },
  assigned: {
    title: 'Задание',
    status: {
      label: 'Вы исполнитель',
      description: 'Вы назначены на задание. Начните работу в указанное время.',
      tone: 'assigned',
    },
    actions: 'chat-and-cancel',
  },
  working: WORKING_SCREEN,
  'confirm-done': { ...WORKING_SCREEN, sheet: 'confirm' },
  confirmed: {
    title: 'Отклик',
    status: {
      label: 'На подтверждении',
      description: 'Ждём подписи подрядчика и приёмки работы заказчиком.',
      tone: 'info',
    },
    actions: 'chat',
  },
  payout: {
    title: 'Отклик',
    status: {
      label: 'Выплата в процессе',
      description:
        'Заказчик принял работу и передал задание в оплату. Как правило, процесс занимает сутки.',
      tone: 'active',
    },
    actions: 'chat',
  },
  paid: {
    title: 'Отклик',
    status: {
      label: 'Выполнено',
      description: 'Все документы подписаны. Деньги перечислены.',
      tone: 'complete',
    },
    actions: 'chat',
  },
};

const SHEETS: Record<
  Sheet,
  { button: string; title?: string; description?: string; note?: string }
> = {
  offer: { button: 'Откликнуться' },
  sign: {
    button: 'Подписать',
    title: 'Подпишите документы для подтверждения выхода',
    description:
      'Для работы над этим заданием нужно подписать дополнительные документы.',
    note: 'Если вы не подпишете документы, задание будет автоматически отменено через 3 ч 45 мин',
  },
  confirm: {
    button: 'Подтвердить',
    title: 'Подтвердите выполнение',
    description: 'После подтверждения заказчик получит уведомление.',
  },
};

const RESPONSE_ASSETS = '/performer-response-flow/assets';
const WORKER_TYPES = ['Физлица', 'ИП', 'Самозанятые'];
const STATUS_ICONS = [wifiIcon, signalIcon, batteryIcon] as const;

function CompanyCard({ role }: { role: DesktopRole }) {
  const company = companies[role];
  const publisher = role === 'contractor';

  return (
    <div className="contracting-performer-company">
      <p>{publisher ? 'Опубликовал задание' : 'Заказчик'}</p>
      <article className="ww-response-company-card">
        <span
          aria-hidden="true"
          className={`ww-response-brand contracting-performer-brand is-${role}`}
        >
          {publisher ? <img alt="" src={publisherIcon} /> : company.brand[0]}
        </span>
        <div>
          <strong>{company.brand}</strong>
          {publisher ? (
            <span>
              С {companies.contractor.memberSince} года ·{' '}
              {companies.contractor.completedTasks} задания
            </span>
          ) : (
            <span>
              <img alt="" src={publicAssetUrl(`${RESPONSE_ASSETS}/star.svg`)} />
              <b>4,8</b> из 5 <i>12 отзывов</i>
            </span>
          )}
        </div>
        <img
          alt=""
          src={publicAssetUrl(`${RESPONSE_ASSETS}/company-chevron.svg`)}
        />
      </article>
    </div>
  );
}

function PerformerSheet({ sheet }: { sheet: Sheet }) {
  const content = SHEETS[sheet];

  return (
    <footer className="ww-response-bottom-sheet contracting-performer-sheet">
      {content.title ? (
        <div className="contracting-performer-sheet-copy">
          <h3>{content.title}</h3>
          <p>{content.description}</p>
          {content.note ? <p>{content.note}</p> : null}
        </div>
      ) : null}
      <button data-contracting-hint="" disabled type="button">
        {content.button}
      </button>
      <i aria-hidden="true" className="contracting-performer-home-indicator" />
    </footer>
  );
}

export function ContractingPerformer({ state }: { state: PerformerState }) {
  const screen = SCREENS[state];
  const isTask = screen.title === 'Задание';

  return (
    <section
      aria-label="Экран исполнителя"
      className="contracting-performer"
      data-performer-state={state}
    >
      <header>
        <PerformerStatusBar icons={STATUS_ICONS} />
        <PerformerDetailHeader title={screen.title} />
      </header>
      <div
        aria-label="Детали задания"
        className="contracting-performer-scroll"
        key={state}
        role="region"
        tabIndex={0}
      >
        <div className="ww-response-detail-top">
          <PerformerTaskSummary
            address={task.address}
            date={task.mobileDate}
            duration={task.duration}
            reward={task.reward}
            status={screen.status}
            time={`${task.startTime} — ${task.endTime}`}
            title={task.title}
            types={WORKER_TYPES}
          />
          <CompanyCard role="contractor" />
          <CompanyCard role="customer" />
          {isTask ? (
            <article className="contracting-performer-openings">
              <div>
                <strong>3 вакансии в компании</strong>
                <span>Постоянная работа</span>
              </div>
              <img alt="" src={openingsIcon} />
            </article>
          ) : null}
          {screen.actions ? (
            <div
              className="contracting-performer-actions"
              data-actions={screen.actions}
            >
              <button disabled type="button">
                Чат с заказчиком
              </button>
              {screen.actions === 'chat-and-cancel' ? (
                <button disabled type="button">
                  Отменить
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
        {isTask ? (
          <h3 className="contracting-performer-detail-title">Детали заказа</h3>
        ) : null}
        <PerformerTaskDetails
          description={task.description}
          legalEntity={companies.contractor.name}
          orderNumber={task.number}
          publicationDate={task.created}
        />
        {screen.showDocument ? (
          <button
            className="contracting-performer-document"
            disabled
            type="button"
          >
            <img alt="" src={documentIcon} /> PDF с описанием задания
          </button>
        ) : null}
      </div>
      {screen.sheet ? <PerformerSheet sheet={screen.sheet} /> : null}
    </section>
  );
}
