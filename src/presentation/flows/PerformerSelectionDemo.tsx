import { Check, Eye, FileText, Info, Star, X } from 'lucide-react';
import { useState } from 'react';

import { MARKETPLACE_TASKS, type MarketplaceTask } from './marketplaceData';
import { MarketplacePage } from './MarketplacePage';
import { DesktopShell, ProductButton } from './ProductUI';

const SELECTION_TASK_TITLE = 'Грузчик. Комплектация заказов на складе';

const SELECTION_MARKETPLACE_ROWS: readonly MarketplaceTask[] =
  MARKETPLACE_TASKS.map((task, index) =>
    index === 1
      ? {
          count: '1',
          created: '25.08.2026',
          performer: '—',
          startDate: '25.08.2026',
          startTime: '18:00',
          number: '20ae1846',
          taxId: '',
          title: SELECTION_TASK_TITLE,
          total: '18 000,00 ₽',
          status: 'ЕСТЬ ОТКЛИКИ',
        }
      : task,
  );

const RESPONSES = [
  {
    completed: '42 задания из 42',
    date: '25 Aug, 15:15',
    dob: '27.03.1988',
    id: 'ivanov',
    income: '184 600 ₽',
    initials: 'ИИ',
    kind: 'СМЗ',
    limit: '3 из 3',
    name: 'Иванов Иван Иванович',
    phone: '+7 900 000 00 01',
    rating: '5,0',
    reviews: '12 отзывов',
    sex: 'Мужской',
  },
  {
    completed: '27 заданий из 28',
    date: '25 Aug, 15:22',
    dob: '14.09.1992',
    id: 'petrov',
    income: '236 800 ₽',
    initials: 'ПП',
    kind: 'ИП',
    limit: '2 из 3',
    name: 'Петров Пётр Петрович',
    phone: '+7 900 000 00 02',
    rating: '4,9',
    reviews: '8 отзывов',
    sex: 'Мужской',
  },
  {
    completed: '16 заданий из 16',
    date: '25 Aug, 15:31',
    dob: '06.12.1995',
    id: 'sidorova',
    income: '129 400 ₽',
    initials: 'АС',
    kind: 'СМЗ',
    limit: '3 из 3',
    name: 'Сидорова Анна Сергеевна',
    phone: '+7 900 000 00 03',
    rating: '4,8',
    reviews: '6 отзывов',
    sex: 'Женский',
  },
] as const;

const DETAILS_TABS = ['Задание', 'Отклики (3)', 'Действия', 'История'] as const;

type DetailsTab = (typeof DETAILS_TABS)[number];
type ResponseDecision = 'accepted' | 'rejected';

function TaskDetailsTab() {
  return (
    <div className="ww-payment-tab-content ww-payment-task-details">
      <h3>Информация о задании</h3>
      <dl className="ww-payment-detail-grid">
        <div className="is-wide">
          <dt>Номер задания</dt>
          <dd>20ae1846</dd>
          <small>Одинаковый для заказчиков и исполнителей</small>
        </div>
        <div className="is-wide">
          <dt>Название задания</dt>
          <dd>{SELECTION_TASK_TITLE}</dd>
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
          <dd>18 000,00 ₽</dd>
        </div>
        <div>
          <dt>Тип оплаты</dt>
          <dd>За задание</dd>
        </div>
      </dl>
    </div>
  );
}

function ResponsesTab() {
  const [decisions, setDecisions] = useState<
    Partial<Record<(typeof RESPONSES)[number]['id'], ResponseDecision>>
  >({});

  const decide = (
    id: (typeof RESPONSES)[number]['id'],
    decision: ResponseDecision,
  ) => {
    setDecisions((current) => {
      const next = { ...current };

      if (decision === 'accepted') {
        RESPONSES.forEach((response) => {
          if (next[response.id] === 'accepted') delete next[response.id];
        });
      }

      next[id] = decision;
      return next;
    });
  };

  return (
    <div
      aria-label="Отклики исполнителей"
      className="ww-payment-tab-content ww-selection-responses"
      role="list"
    >
      {RESPONSES.map((response) => {
        const decision = decisions[response.id];

        return (
          <article
            className={`ww-payment-performer-card ww-selection-response-card${decision ? ` is-${decision}` : ''}`}
            key={response.id}
            role="listitem"
          >
            <span className="ww-payment-avatar" aria-hidden="true">
              {response.initials}
            </span>
            <div className="ww-payment-performer-heading">
              <div className="ww-selection-name-row">
                <strong>{response.name}</strong>
                <span>Отклик просмотрен</span>
              </div>
              <p>
                {response.date} · <b>{response.kind}</b> · PDF
              </p>
            </div>
            <button
              aria-label={`Открыть сообщения с исполнителем ${response.name}`}
              type="button"
            >
              <FileText aria-hidden="true" size={20} />
            </button>
            <section>
              <h3>Рейтинг</h3>
              <p>
                <Star aria-hidden="true" fill="currentColor" size={21} />
                <strong>{response.rating}</strong>
                <span>{response.reviews}</span>
              </p>
              <p>
                <span className="ww-payment-progress-dot" />
                100% · Выполнил {response.completed}
              </p>
            </section>
            <dl className="ww-selection-personal-data">
              <div>
                <dt>Дата рождения</dt>
                <dd>{response.dob}</dd>
              </div>
              <div>
                <dt>Пол</dt>
                <dd>{response.sex}</dd>
              </div>
              <div>
                <dt>Телефон</dt>
                <dd>{response.phone}</dd>
              </div>
            </dl>
            <footer>
              <strong>Доход в качестве самозанятого за год:</strong>{' '}
              {response.income}
              <br />
              <strong>
                Количество оставшихся заданий до лимита в августе:
              </strong>{' '}
              {response.limit}
            </footer>
            <div className="ww-selection-response-actions">
              <ProductButton
                aria-pressed={decision === 'accepted'}
                onClick={() => decide(response.id, 'accepted')}
              >
                {decision === 'accepted' ? (
                  <>
                    <Check aria-hidden="true" size={17} /> Принят
                  </>
                ) : (
                  'Принять'
                )}
              </ProductButton>
              <ProductButton
                aria-pressed={decision === 'rejected'}
                onClick={() => decide(response.id, 'rejected')}
                variant="danger"
              >
                {decision === 'rejected' ? 'Отказано' : 'Отказать'}
              </ProductButton>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function ActionsTab() {
  return (
    <div className="ww-payment-tab-content">
      <section className="ww-payment-complete-notice">
        <Info aria-hidden="true" size={21} />
        <div>
          <strong>Получено 3 отклика</strong>
          <p>
            Сравните исполнителей в разделе «Отклики» и выберите подходящего.
          </p>
        </div>
      </section>
    </div>
  );
}

function HistoryTab() {
  return (
    <div className="ww-payment-tab-content">
      <ol className="ww-payment-history">
        {[
          ['25.08.2026 14:40', 'Создано'],
          ['25.08.2026 14:45', 'Опубликовано'],
          ['25.08.2026 15:15', 'Получен первый отклик'],
          ['25.08.2026 15:31', 'Получено 3 отклика'],
        ].map(([time, label]) => (
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

function TaskPanel({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<DetailsTab>('Отклики (3)');

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
            <h2>{SELECTION_TASK_TITLE}</h2>
            <p>
              <Eye aria-hidden="true" size={15} /> 3
            </p>
          </div>
          <button aria-label="Закрыть" onClick={onClose} type="button">
            <X aria-hidden="true" size={23} />
          </button>
        </header>
        <div className="ww-payment-task-meta">
          <span>Задание от 25.08.2026</span>
          <strong className="is-responses">ЕСТЬ ОТКЛИКИ</strong>
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
          {activeTab === 'Отклики (3)' ? <ResponsesTab /> : null}
          {activeTab === 'Действия' ? <ActionsTab /> : null}
          {activeTab === 'История' ? <HistoryTab /> : null}
        </div>
      </aside>
    </div>
  );
}

export function PerformerSelectionDemo() {
  const [isTaskOpen, setIsTaskOpen] = useState(false);

  return (
    <DesktopShell
      activeNavigation="Маркетплейс"
      chrome="marketplace"
      overlay={
        isTaskOpen ? <TaskPanel onClose={() => setIsTaskOpen(false)} /> : null
      }
    >
      <MarketplacePage
        rows={SELECTION_MARKETPLACE_ROWS}
        taskAction={{
          number: '20ae1846',
          label: `Открыть задание с откликами: ${SELECTION_TASK_TITLE}`,
          onOpen: () => setIsTaskOpen(true),
        }}
      />
    </DesktopShell>
  );
}
