import {
  Check,
  Download,
  Eye,
  FileText,
  Info,
  ShieldAlert,
  Star,
  X,
} from 'lucide-react';
import { useState } from 'react';

import { MARKETPLACE_TASKS, type MarketplaceTask } from './marketplaceData';
import { MarketplacePage } from './MarketplacePage';
import { DesktopShell, ProductButton } from './ProductUI';

const PAYMENT_TASK_TITLE = 'Грузчик. Разгрузка товара на складе';

const PAYMENT_MARKETPLACE_ROWS: readonly MarketplaceTask[] =
  MARKETPLACE_TASKS.map((task, index) =>
    index === 1
      ? {
          count: '1',
          created: '21.08.2026',
          performer: 'Иванов И. И.',
          startDate: '21.08.2026',
          startTime: '15:33',
          number: '8f3eba07',
          taxId: '770000000005',
          title: PAYMENT_TASK_TITLE,
          total: '100 000,00 ₽',
          status: 'ВЫПОЛНЕН',
        }
      : task,
  );

const DETAILS_TABS = [
  'Задание',
  'Исполнитель',
  'Действия',
  'Документы',
  'История',
] as const;

type DetailsTab = (typeof DETAILS_TABS)[number];
type PaymentStep = 'ready' | 'code' | 'paid';

function TaskDetailsTab() {
  return (
    <div className="ww-payment-tab-content ww-payment-task-details">
      <h3>Информация о задании</h3>
      <button className="ww-payment-download-outline" type="button">
        <Download aria-hidden="true" size={19} />
        PDF с описанием задания
      </button>
      <dl className="ww-payment-detail-grid">
        <div className="is-wide">
          <dt>Номер задания</dt>
          <dd>8f3eba07</dd>
          <small>Одинаковый для заказчиков и исполнителей</small>
        </div>
        <div className="is-wide">
          <dt>Название задания</dt>
          <dd>{PAYMENT_TASK_TITLE}</dd>
        </div>
        <div>
          <dt>Регион заказа</dt>
          <dd>Московская область</dd>
        </div>
        <div>
          <dt>Город или населённый пункт</dt>
          <dd>Одинцово</dd>
        </div>
        <div>
          <dt>Количество исполнителей</dt>
          <dd>1</dd>
        </div>
        <div>
          <dt>Вид деятельности</dt>
          <dd>Грузчик</dd>
        </div>
      </dl>
      <h3>Вознаграждение</h3>
      <dl className="ww-payment-detail-grid">
        <div>
          <dt>Вознаграждение, ₽</dt>
          <dd>100 000,00 ₽</dd>
        </div>
        <div>
          <dt>Тип оплаты</dt>
          <dd>За задание</dd>
        </div>
      </dl>
      <h3>Период выполнения задания</h3>
      <p className="ww-payment-helper">
        <Info aria-hidden="true" size={17} /> Укажите время того региона, в
        котором будет выполняться задание
      </p>
      <dl className="ww-payment-detail-grid">
        <div>
          <dt>Дата начала</dt>
          <dd>21.08.2026, 15:33</dd>
        </div>
        <div>
          <dt>Дата завершения</dt>
          <dd>21.08.2026, 18:00</dd>
        </div>
      </dl>
      <h3>Операции</h3>
      <label className="ww-payment-readonly-check">
        <input checked disabled readOnly type="checkbox" />
        Погрузочно-разгрузочные работы
      </label>
      <h3>Кто увидит задание</h3>
      <div className="ww-payment-audience">
        {['Самозанятые', 'ИП', 'ИП на НПД', 'ГПХ'].map((label) => (
          <label className="ww-payment-readonly-check" key={label}>
            <input checked disabled readOnly type="checkbox" />
            {label}
          </label>
        ))}
      </div>
    </div>
  );
}

function PerformerTab() {
  return (
    <div className="ww-payment-tab-content">
      <article className="ww-payment-performer-card">
        <span className="ww-payment-avatar" aria-hidden="true">
          ИИ
        </span>
        <div className="ww-payment-performer-heading">
          <strong>Иванов Иван Иванович</strong>
          <span>Отклик просмотрен</span>
          <p>30 Aug, 17:10 · ИП</p>
        </div>
        <button aria-label="Открыть сообщения" type="button">
          <FileText aria-hidden="true" size={20} />
        </button>
        <section>
          <h3>Рейтинг</h3>
          <p>
            <Star aria-hidden="true" fill="currentColor" size={21} />
            <strong>4,8</strong>
            <span>12 оценок</span>
          </p>
          <p>
            <span className="ww-payment-progress-dot" />
            100% · Выполнил 19 заданий из 19
          </p>
        </section>
        <footer>
          <strong>Доход в качестве самозанятого за год:</strong> 186 400 ₽
          <br />
          <strong>Оставшихся заданий до лимита в августе:</strong> 3 из 3
        </footer>
      </article>
    </div>
  );
}

function ActionTab({
  code,
  error,
  onCodeChange,
  onConfirm,
  onPay,
  paymentStep,
}: {
  code: string;
  error: string | null;
  onCodeChange: (value: string) => void;
  onConfirm: () => void;
  onPay: () => void;
  paymentStep: PaymentStep;
}) {
  return (
    <div className="ww-payment-tab-content ww-payment-actions">
      <section className="ww-payment-complete-notice">
        <Info aria-hidden="true" size={21} />
        <div>
          <strong>Задание выполнено</strong>
          <p>
            Исполнитель сообщил, что выполнил задание. Нажмите «Подтвердить и
            оплатить», чтобы оплатить задание.
          </p>
        </div>
      </section>
      <dl className="ww-payment-action-fields">
        <div>
          <dt>Название</dt>
          <dd>{PAYMENT_TASK_TITLE}</dd>
        </div>
        <div>
          <dt>Вознаграждение, ₽</dt>
          <dd>100 000,00 ₽</dd>
        </div>
        <div className="is-notes">
          <dt>Дополнительная информация</dt>
          <dd>Доехать на автобусе</dd>
        </div>
      </dl>
      <section className="ww-payment-risk">
        <ShieldAlert aria-hidden="true" size={22} />
        <div>
          <strong>Есть риски</strong>
          <ul>
            <li>
              <b>Аннулированные чеки.</b> Исполнитель ранее аннулировал ваши
              чеки.
            </li>
          </ul>
          <ProductButton variant="secondary">Сформировать отчет</ProductButton>
        </div>
      </section>

      {paymentStep === 'ready' ? (
        <div className="ww-payment-actions-footer">
          <ProductButton data-demo-action="confirm-payment" onClick={onConfirm}>
            Подтвердить и оплатить
          </ProductButton>
          <ProductButton variant="danger">Отменить задание</ProductButton>
        </div>
      ) : paymentStep === 'code' ? (
        <div className="ww-payment-code-form">
          <label>
            <span>Введите код из СМС</span>
            <input
              aria-label="Введите код из СМС"
              inputMode="numeric"
              maxLength={4}
              onChange={(event) =>
                onCodeChange(event.currentTarget.value.replace(/\D/g, ''))
              }
              placeholder="0000"
              value={code}
            />
          </label>
          <p>
            Запросить повторно можно через <strong>00:55</strong>
          </p>
          <ProductButton
            data-demo-action="pay-task"
            disabled={code.length !== 4}
            onClick={onPay}
          >
            Оплатить
          </ProductButton>
          {error ? (
            <p
              aria-live="polite"
              className="ww-payment-code-error"
              role="alert"
            >
              {error}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="ww-payment-actions-footer">
          <ProductButton
            aria-live="polite"
            className="ww-payment-sent"
            disabled
          >
            <Check aria-hidden="true" size={18} />
            Отправлено
          </ProductButton>
        </div>
      )}
    </div>
  );
}

function DocumentsTab() {
  const [prepared, setPrepared] = useState(false);

  return (
    <div className="ww-payment-tab-content ww-payment-documents">
      <button onClick={() => setPrepared(true)} type="button">
        <Download aria-hidden="true" size={19} />
        Скачать документ
      </button>
      {prepared ? (
        <p aria-live="polite" role="status">
          <Check aria-hidden="true" size={17} /> Документ подготовлен
        </p>
      ) : null}
    </div>
  );
}

function HistoryTab({ paid }: { paid: boolean }) {
  const events = [
    ['21.08.2026 15:33', 'Создано'],
    ['21.08.2026 15:39', 'Есть отклики'],
    ['21.08.2026 15:41', 'Назначен'],
    ['21.08.2026 15:44', 'Выполняется'],
    ['21.08.2026 17:58', 'Выполнено исполнителем'],
    ...(paid ? ([['21.08.2026 18:02', 'Оплачено']] as const) : []),
  ];

  return (
    <div className="ww-payment-tab-content">
      <ol className="ww-payment-history">
        {events.map(([time, label]) => (
          <li key={label}>
            <time>{time}</time>
            <span aria-hidden="true" />
            <strong>{label}</strong>
          </li>
        ))}
      </ol>
    </div>
  );
}

function TaskPanel({
  initialPaid,
  onClose,
  onPaid,
}: {
  initialPaid: boolean;
  onClose: () => void;
  onPaid: () => void;
}) {
  const [activeTab, setActiveTab] = useState<DetailsTab>('Задание');
  const [paymentStep, setPaymentStep] = useState<PaymentStep>(
    initialPaid ? 'paid' : 'ready',
  );
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const paid = paymentStep === 'paid';

  const pay = () => {
    if (code !== '0000') {
      setError('Неверный код из СМС');
      return;
    }

    setError(null);
    setPaymentStep('paid');
    onPaid();
  };

  return (
    <div className="ww-payment-drawer-layer">
      <button
        aria-label="Закрыть панель задания"
        className="ww-payment-drawer-scrim"
        onClick={onClose}
        type="button"
      />
      <aside aria-label="Панель задания" className="ww-payment-drawer">
        <header>
          <div>
            <h2>{PAYMENT_TASK_TITLE}</h2>
            <p>
              <Eye aria-hidden="true" size={15} /> 1
            </p>
          </div>
          <button aria-label="Закрыть" onClick={onClose} type="button">
            <X aria-hidden="true" size={23} />
          </button>
        </header>
        <div className="ww-payment-task-meta">
          <span>Задание от 21.08.2026</span>
          <strong className={paid ? 'is-paid' : undefined}>
            {paid ? 'ОПЛАЧЕН' : 'ВЫПОЛНЕН'}
          </strong>
        </div>
        <div
          aria-label="Разделы задания"
          className="ww-payment-panel-tabs"
          role="tablist"
        >
          {DETAILS_TABS.map((tab) => (
            <button
              aria-selected={activeTab === tab}
              key={tab}
              onClick={() => setActiveTab(tab)}
              role="tab"
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="ww-payment-panel-scroll">
          {activeTab === 'Задание' ? <TaskDetailsTab /> : null}
          {activeTab === 'Исполнитель' ? <PerformerTab /> : null}
          {activeTab === 'Действия' ? (
            <ActionTab
              code={code}
              error={error}
              onCodeChange={(value) => {
                setCode(value);
                setError(null);
              }}
              onConfirm={() => {
                setPaymentStep('code');
                setError(null);
              }}
              onPay={pay}
              paymentStep={paymentStep}
            />
          ) : null}
          {activeTab === 'Документы' ? <DocumentsTab /> : null}
          {activeTab === 'История' ? <HistoryTab paid={paid} /> : null}
        </div>
      </aside>
    </div>
  );
}

export function TaskPaymentDemo() {
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const rows: readonly MarketplaceTask[] = PAYMENT_MARKETPLACE_ROWS.map(
    (task) =>
      task.number === '8f3eba07' && isPaid
        ? { ...task, status: 'ОПЛАЧЕН' }
        : task,
  );

  return (
    <DesktopShell
      activeNavigation="Маркетплейс"
      chrome="marketplace"
      overlay={
        isTaskOpen ? (
          <TaskPanel
            initialPaid={isPaid}
            onClose={() => setIsTaskOpen(false)}
            onPaid={() => setIsPaid(true)}
          />
        ) : null
      }
    >
      <MarketplacePage
        rows={rows}
        taskAction={{
          number: '8f3eba07',
          label: `Открыть выполненное задание: ${PAYMENT_TASK_TITLE}`,
          onOpen: () => setIsTaskOpen(true),
        }}
      />
    </DesktopShell>
  );
}
