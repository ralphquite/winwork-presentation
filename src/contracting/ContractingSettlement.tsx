import {
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  CircleUserRound,
  Eye,
  FileText,
  Info,
} from 'lucide-react';

import { Drawer, ProductButton } from '../presentation/flows/ProductUI';
import {
  TaskPaymentControls,
  type PaymentStep,
} from '../presentation/flows/TaskPaymentControls';
import {
  ContractingTaskWorkspace,
  type TaskStatus,
} from './ContractingTaskScreen';
import { task, type DesktopRole } from './fixtures';

import '../styles/contracting-settlement.css';

export type SettlementState =
  | 'customer-work-confirmed'
  | 'contractor-sign-acts'
  | 'customer-payment'
  | 'customer-payment-code'
  | 'customer-payment-sent'
  | 'customer-documents'
  | 'contractor-documents';

type SettlementDocumentData = {
  title: string;
  description: string;
  signature?: string;
  kind: 'contract' | 'performer' | 'company';
};

type Settlement = {
  role: DesktopRole;
  status: TaskStatus;
  documents: readonly SettlementDocumentData[];
  notice?: { title: string; text: string };
  sign?: string;
  payment?: PaymentStep;
  documentsTab?: boolean;
};

const WORK_ACT = 'Акт выполненных работ';
const TASK_AND_ACT = 'Задание и акт выполненных работ';
const CUSTOMER_ACT = {
  title: TASK_AND_ACT,
  description: 'Для вас от подрядчика',
  kind: 'company',
} as const;
const CUSTOMER_ACCEPTED_ACT = {
  ...CUSTOMER_ACT,
  signature: 'Подписан вами и подрядчиком',
};

const READY_TO_PAY = {
  role: 'customer',
  status: 'Подтверждено подрядчиком',
  documents: [{ ...CUSTOMER_ACT, signature: 'Подписан подрядчиком' }],
  notice: {
    title: 'Задание выполнено',
    text: 'Подрядчик подписал задание и акт. Теперь можно принять и оплатить работу.',
  },
} as const;

const SETTLEMENTS: Record<SettlementState, Settlement> = {
  'customer-work-confirmed': {
    role: 'customer',
    status: 'Подтверждено исполнителем',
    documents: [{ ...CUSTOMER_ACT, title: WORK_ACT }],
    notice: {
      title: 'Задание выполнено',
      text: 'Исполнитель подтвердил выполнение. Ждём подписи подрядчика на акте выполненных работ.',
    },
  },
  'contractor-sign-acts': {
    role: 'contractor',
    status: 'Подтверждено исполнителем',
    documents: [
      {
        title: TASK_AND_ACT,
        description: 'Между вами и исполнителем',
        signature: 'Подписан исполнителем',
        kind: 'performer',
      },
      {
        title: TASK_AND_ACT,
        description: 'Между вами и заказчиком',
        kind: 'company',
      },
    ],
    notice: {
      title: 'Выполнение подтверждено',
      text: 'Исполнитель подтвердил выполнение. Подпишите задание и акт выполненных работ.',
    },
    sign: 'Подтвердить и подписать',
  },
  'customer-payment': { ...READY_TO_PAY, payment: 'ready' },
  'customer-payment-code': {
    ...READY_TO_PAY,
    documents: [CUSTOMER_ACCEPTED_ACT],
    payment: 'code',
    notice: {
      title: 'Задание выполнено',
      text: 'Работа принята. Подтвердите оплату кодом из СМС.',
    },
  },
  'customer-payment-sent': {
    role: 'customer',
    status: 'Оплачено',
    documents: [CUSTOMER_ACCEPTED_ACT],
    payment: 'paid',
    notice: {
      title: 'Оплата отправлена',
      text: 'Выплата исполнителю передана в обработку.',
    },
  },
  'customer-documents': {
    role: 'customer',
    status: 'Оплачено',
    documents: [CUSTOMER_ACCEPTED_ACT],
    documentsTab: true,
  },
  'contractor-documents': {
    role: 'contractor',
    status: 'Оплачено',
    documents: [
      {
        title: 'Договор об оказании услуг',
        description: 'Исполнителю',
        signature: 'Подписан вами и исполнителем',
        kind: 'contract',
      },
      {
        title: TASK_AND_ACT,
        description: 'Для исполнителя',
        signature: 'Подписан вами и исполнителем',
        kind: 'performer',
      },
      {
        title: WORK_ACT,
        description: 'От вас для заказчика',
        signature: 'Подписан вами и заказчиком',
        kind: 'company',
      },
    ],
    documentsTab: true,
  },
};

function SettlementDocument({
  title,
  description,
  signature,
  kind,
}: SettlementDocumentData) {
  const Icon =
    kind === 'contract'
      ? FileText
      : kind === 'performer'
        ? CircleUserRound
        : BriefcaseBusiness;

  return (
    <li className="ww-settlement-document">
      <Icon aria-hidden="true" size={22} />
      <div>
        <strong>{title}</strong>
        <span>{description}</span>
        {signature ? (
          <small>
            <Check aria-hidden="true" size={14} /> {signature}
          </small>
        ) : (
          <span>Не подписан</span>
        )}
      </div>
      <ArrowUpRight
        aria-hidden="true"
        className="ww-settlement-open-document"
        size={18}
      />
    </li>
  );
}

function SettlementPanel({ settlement }: { settlement: Settlement }) {
  const { role, status, notice, sign, payment, documents, documentsTab } =
    settlement;
  const activeTab = documentsTab ? 'Документы' : 'Действия';
  const tabs = [
    'Заказ',
    'Исполнитель',
    'Действия',
    'Документы',
    ...(documentsTab ? [] : ['История']),
  ];

  return (
    <Drawer
      className="ww-contracting-drawer ww-contracting-settlement"
      title={task.title}
      label="Панель задания"
    >
      <div className="ww-settlement-meta">
        <span className="ww-settlement-views">
          <Eye aria-hidden="true" size={15} /> 1
        </span>
        <div>
          <span>Задание от {task.created}</span>
          <strong
            className={
              role === 'customer' && status !== 'Оплачено'
                ? 'is-progress'
                : undefined
            }
          >
            {status}
          </strong>
        </div>
      </div>
      <ul aria-label="Разделы задания" className="ww-settlement-tabs">
        {tabs.map((tab) => (
          <li
            aria-current={tab === activeTab ? 'true' : undefined}
            data-contracting-hint={
              payment === 'paid' && tab === 'Документы' ? '' : undefined
            }
            key={tab}
          >
            {tab}
          </li>
        ))}
      </ul>
      <div aria-label={activeTab} className="ww-settlement-scroll" tabIndex={0}>
        {notice ? (
          <section className="ww-payment-complete-notice ww-settlement-notice">
            <Info aria-hidden="true" size={20} />
            <div>
              <strong>{notice.title}</strong>
              <p>{notice.text}</p>
            </div>
          </section>
        ) : null}
        {documentsTab ? null : (
          <dl className="ww-settlement-fields">
            <div>
              <dt>Название</dt>
              <dd>{task.title}</dd>
            </div>
            <div>
              <dt>Вознаграждение исполнителю</dt>
              <dd>{task.reward}</dd>
            </div>
            <div>
              <dt>Дополнительная информация</dt>
              <dd>{task.description}</dd>
            </div>
          </dl>
        )}
        <ul aria-label="Документы задания" className="ww-settlement-documents">
          {documents.map((document) => (
            <SettlementDocument {...document} key={document.kind} />
          ))}
        </ul>
      </div>
      {sign || payment ? (
        <footer className="ww-settlement-actions">
          {sign ? (
            <ProductButton
              aria-disabled="true"
              data-contracting-hint=""
              tabIndex={-1}
            >
              {sign}
            </ProductButton>
          ) : null}
          {payment ? (
            <>
              {payment !== 'paid' ? (
                <div className="ww-settlement-total">
                  <span>К оплате с учётом комиссии</span>
                  <strong>{task.total}</strong>
                </div>
              ) : null}
              <TaskPaymentControls
                confirmLabel="Принять и оплатить"
                preview
                step={payment}
              />
            </>
          ) : null}
        </footer>
      ) : null}
    </Drawer>
  );
}

export function ContractingSettlement({ state }: { state: SettlementState }) {
  const settlement = SETTLEMENTS[state];
  return (
    <ContractingTaskWorkspace
      overlay={<SettlementPanel settlement={settlement} />}
      role={settlement.role}
      status={settlement.status}
    />
  );
}
