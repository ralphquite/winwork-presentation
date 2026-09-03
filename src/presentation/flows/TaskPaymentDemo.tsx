import {
  CalendarDays,
  Check,
  ChevronDown,
  Download,
  Eye,
  FileText,
  Info,
  Search,
  ShieldAlert,
  Star,
  X,
} from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';

import { DesktopShell, ProductButton } from './ProductUI';

const PAYMENT_TASK_TITLE = 'Грузчик. Разгрузка товара на складе';

const MARKETPLACE_ROWS = [
  {
    created: '31.08.2026',
    performer: 'Смирнов С. С.',
    start: '31.08.2026 16:38',
    number: '2abf1a0f',
    title: 'Мерчендайзер. Проверка торговой точки',
    total: '1,00 ₽',
    status: 'ОПЛАЧЕН',
  },
  {
    created: '21.08.2026',
    performer: 'Иванов И. И.',
    start: '21.08.2026 15:33',
    number: '8f3eba07',
    title: PAYMENT_TASK_TITLE,
    total: '100 000,00 ₽',
    status: 'ВЫПОЛНЕН',
  },
  {
    created: '30.08.2026',
    performer: 'Петров П. П.',
    start: '30.08.2026 15:18',
    number: '07f8deec',
    title: 'Мерчендайзер. Проверка выкладки',
    total: '6,00 ₽',
    status: 'ОПЛАТА',
  },
  {
    created: '25.08.2026',
    performer: '—',
    start: '25.08.2026 15:00',
    number: '3e827f6a',
    title: 'Авиакурьер. Тестовое задание',
    total: '6,00 ₽',
    status: 'ВЫПОЛНЯЕТСЯ',
  },
] as const;

const DETAILS_TABS = [
  'Задание',
  'Исполнитель',
  'Действия',
  'Документы',
  'История',
] as const;

type DetailsTab = (typeof DETAILS_TABS)[number];
type PaymentStep = 'ready' | 'code' | 'paid';

function MarketplaceFilters() {
  return (
    <>
      <div className="ww-payment-market-tabs" role="tablist">
        {[
          'Задания',
          'Ожидают оплаты',
          'Активные задания',
          'Завершенные задания',
          'На модерации',
          'Архив',
        ].map((tab, index) => (
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
      <div className="ww-payment-filters">
        <label>
          <Search aria-hidden="true" size={18} />
          <input
            aria-label="Название или номер задания"
            placeholder="Название или номер задания"
          />
        </label>
        <label>
          <Search aria-hidden="true" size={18} />
          <input
            aria-label="ФИО или ИНН исполнителя"
            placeholder="ФИО или ИНН исполнителя"
          />
        </label>
        <button aria-label="Найти" type="button">
          <Search aria-hidden="true" size={19} />
        </button>
        <button className="ww-payment-date-filter" type="button">
          <CalendarDays aria-hidden="true" size={18} />
          02.08.2026 — 02.09.2026
        </button>
        <button className="ww-payment-status-filter" type="button">
          <span>
            <small>Статус задания</small>
            Все статусы
          </span>
          <ChevronDown aria-hidden="true" size={16} />
        </button>
      </div>
    </>
  );
}

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

  const openSecondTask = () => setIsTaskOpen(true);
  const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openSecondTask();
  };

  return (
    <DesktopShell activeNavigation="Маркетплейс">
      <div className="ww-marketplace-page ww-payment-marketplace">
        <div className="ww-page-heading">
          <h2>Маркетплейс</h2>
          <div className="ww-page-actions">
            <ProductButton>
              Разместить задание <ChevronDown aria-hidden="true" size={16} />
            </ProductButton>
            <ProductButton variant="secondary">
              Реестр на редактирование
            </ProductButton>
          </div>
        </div>
        <MarketplaceFilters />
        <div className="ww-payment-table-shell">
          <table>
            <thead>
              <tr>
                <th aria-label="Выбрать все">
                  <input aria-label="Выбрать все задания" type="checkbox" />
                </th>
                <th>Создан</th>
                <th>Начало</th>
                <th>Номер задания</th>
                <th>Исполнитель</th>
                <th>Название задания</th>
                <th>Итого</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {MARKETPLACE_ROWS.map((row, index) => {
                const status = index === 1 && isPaid ? 'ОПЛАЧЕН' : row.status;

                return (
                  <tr
                    className={index === 1 ? 'is-target-task' : undefined}
                    key={row.number}
                    onClick={index === 1 ? openSecondTask : undefined}
                    onKeyDown={index === 1 ? handleRowKeyDown : undefined}
                    tabIndex={index === 1 ? 0 : undefined}
                  >
                    <td>
                      <input
                        aria-label={`Выбрать задание ${row.number}`}
                        onClick={(event) => event.stopPropagation()}
                        type="checkbox"
                      />
                    </td>
                    <td>{row.created}</td>
                    <td>{row.start}</td>
                    <td>{row.number}</td>
                    <td>{row.performer}</td>
                    <td>
                      {index === 1 ? (
                        <button
                          aria-label={`Открыть выполненное задание: ${row.title}`}
                          className="ww-payment-row-trigger"
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
                        className={`ww-payment-status is-${status.toLocaleLowerCase('ru-RU')}`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <footer>
            <span>На странице: 10</span>
            <span>1 / 2</span>
          </footer>
        </div>
      </div>
      {isTaskOpen ? (
        <TaskPanel
          initialPaid={isPaid}
          onClose={() => setIsTaskOpen(false)}
          onPaid={() => setIsPaid(true)}
        />
      ) : null}
    </DesktopShell>
  );
}
