import { Check, ChevronLeft, Eye, FileText, Info, Star, X } from 'lucide-react';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

import { MARKETPLACE_TASKS, type MarketplaceTask } from './marketplaceData';
import { MarketplacePage } from './MarketplacePage';
import { DesktopShell, ProductButton } from './ProductUI';

const SELECTION_TASK_TITLE = 'Грузчик. Комплектация заказов на складе';

type PerformerReview = {
  date: string;
  dateTime: string;
  rating: number;
  text: string;
};

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
    initials: 'АГ',
    kind: 'СМЗ',
    limit: '3 из 3',
    name: 'Громов Алексей Михайлович',
    phone: '+7 900 000 00 01',
    rating: '5,0',
    reviewCount: '12 отзывов',
    reviews: [
      {
        date: '18 августа, 18:40',
        dateTime: '2026-08-18T18:40:00',
        rating: 5,
        text: 'Приехал заранее, быстро включился в работу. Комплектацию закончили раньше запланированного времени.',
      },
      {
        date: '3 августа, 12:15',
        dateTime: '2026-08-03T12:15:00',
        rating: 4,
        text: 'Аккуратно работал с маркированным товаром, все позиции сверил по накладной. Рекомендуем.',
      },
      {
        date: '22 июля, 20:06',
        dateTime: '2026-07-22T20:06:00',
        rating: 5,
        text: 'Ответственный исполнитель. Был на связи, форму и документы подготовил заранее.',
      },
      {
        date: '9 июля, 17:32',
        dateTime: '2026-07-09T17:32:00',
        rating: 5,
        text: 'Справился с большим объёмом разгрузки без задержек. Замечаний по качеству работы нет.',
      },
      {
        date: '28 июня, 11:48',
        dateTime: '2026-06-28T11:48:00',
        rating: 4,
        text: 'Пунктуальный и вежливый, соблюдал правила склада. При необходимости пригласим снова.',
      },
      {
        date: '14 июня, 19:20',
        dateTime: '2026-06-14T19:20:00',
        rating: 5,
        text: 'Все палеты собраны и размещены правильно. Работу приняли с первого раза.',
      },
    ] satisfies readonly PerformerReview[],
    sex: 'Мужской',
  },
  {
    completed: '27 заданий из 28',
    date: '25 Aug, 15:22',
    dob: '14.09.1992',
    id: 'petrov',
    income: '236 800 ₽',
    initials: 'ДК',
    kind: 'ИП',
    limit: '2 из 3',
    name: 'Ковалёв Денис Олегович',
    phone: '+7 900 000 00 02',
    rating: '4,9',
    reviewCount: '8 отзывов',
    reviews: [
      {
        date: '20 августа, 16:05',
        dateTime: '2026-08-20T16:05:00',
        rating: 5,
        text: 'Работал быстро и внимательно, самостоятельно уточнил порядок размещения заказов по зонам.',
      },
      {
        date: '7 августа, 21:12',
        dateTime: '2026-08-07T21:12:00',
        rating: 5,
        text: 'Вышел точно к началу смены. Сборка выполнена без пересорта, документы сданы вовремя.',
      },
      {
        date: '25 июля, 15:44',
        dateTime: '2026-07-25T15:44:00',
        rating: 5,
        text: 'Надёжный исполнитель, спокойно отработал загруженную смену и помог с финальной проверкой.',
      },
      {
        date: '11 июля, 10:27',
        dateTime: '2026-07-11T10:27:00',
        rating: 4,
        text: 'Задание выполнено качественно. В начале немного задержался на проходной, затем работал без замечаний.',
      },
      {
        date: '30 июня, 18:53',
        dateTime: '2026-06-30T18:53:00',
        rating: 5,
        text: 'Быстро освоился на новом участке, бережно обращался с товаром. Результатом довольны.',
      },
      {
        date: '16 июня, 13:36',
        dateTime: '2026-06-16T13:36:00',
        rating: 5,
        text: 'Все задачи смены закрыты в срок. Был на связи с координатором и оперативно отвечал на вопросы.',
      },
    ] satisfies readonly PerformerReview[],
    sex: 'Мужской',
  },
  {
    completed: '16 заданий из 16',
    date: '25 Aug, 15:31',
    dob: '06.12.1995',
    id: 'sidorova',
    income: '129 400 ₽',
    initials: 'ЕМ',
    kind: 'СМЗ',
    limit: '3 из 3',
    name: 'Мельникова Екатерина Романовна',
    phone: '+7 900 000 00 03',
    rating: '4,8',
    reviewCount: '6 отзывов',
    reviews: [
      {
        date: '21 августа, 19:18',
        dateTime: '2026-08-21T19:18:00',
        rating: 5,
        text: 'Очень внимательная и организованная. Быстро разобралась в схеме склада и выполнила норму.',
      },
      {
        date: '10 августа, 14:02',
        dateTime: '2026-08-10T14:02:00',
        rating: 5,
        text: 'Комплектация без ошибок, упаковка аккуратная. Все контрольные листы заполнены правильно.',
      },
      {
        date: '29 июля, 20:31',
        dateTime: '2026-07-29T20:31:00',
        rating: 4,
        text: 'Работа выполнена хорошо. Понадобилось чуть больше времени на первую партию, дальше темп выровнялся.',
      },
      {
        date: '15 июля, 17:46',
        dateTime: '2026-07-15T17:46:00',
        rating: 5,
        text: 'Пришла вовремя, соблюдала инструкции и сразу сообщала о расхождениях в списке товаров.',
      },
      {
        date: '2 июля, 12:09',
        dateTime: '2026-07-02T12:09:00',
        rating: 5,
        text: 'Отлично справилась с маркировкой и сортировкой. Рабочее место после смены оставила в порядке.',
      },
      {
        date: '19 июня, 18:24',
        dateTime: '2026-06-19T18:24:00',
        rating: 5,
        text: 'Ответственная, вежливая и аккуратная. Готовы пригласить на следующие задания.',
      },
    ] satisfies readonly PerformerReview[],
    sex: 'Женский',
  },
] as const;

const DETAILS_TABS = ['Задание', 'Отклики (3)', 'Действия', 'История'] as const;

type DetailsTab = (typeof DETAILS_TABS)[number];
type ResponseDecision = 'accepted' | 'rejected';
type ResponseItem = (typeof RESPONSES)[number];

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [contenteditable="true"], [tabindex]:not([tabindex="-1"])';

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

function ResponsesTab({
  onOpenReviews,
}: {
  onOpenReviews: (response: ResponseItem, trigger: HTMLButtonElement) => void;
}) {
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
                <button
                  aria-label={`${response.reviewCount}, открыть отзывы об исполнителе ${response.name}`}
                  className="ww-selection-reviews-trigger"
                  onClick={(event) =>
                    onOpenReviews(response, event.currentTarget)
                  }
                  type="button"
                >
                  {response.reviewCount}
                </button>
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

function ReviewStars({ rating }: { rating: number }) {
  return (
    <span
      aria-label={`Оценка: ${rating} из 5`}
      className="ww-selection-review-stars"
      role="img"
    >
      {[1, 2, 3, 4, 5].map((position) => (
        <Star
          aria-hidden="true"
          fill={position <= rating ? 'currentColor' : 'none'}
          key={position}
          size={24}
          strokeWidth={2}
        />
      ))}
    </span>
  );
}

function PerformerReviewsDrawer({
  onClose,
  response,
}: {
  onClose: () => void;
  response: ResponseItem;
}) {
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    backButtonRef.current?.focus();
  }, []);

  const closeAndRestoreFocus = () => {
    onClose();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    event.stopPropagation();

    if (event.key === 'Escape') {
      event.preventDefault();
      closeAndRestoreFocus();
      return;
    }

    if (event.key !== 'Tab' || !drawerRef.current) return;

    const focusableElements = Array.from(
      drawerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements.at(-1);

    if (!firstElement || !lastElement) return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  return (
    <div className="ww-selection-reviews-layer">
      <button
        aria-label="Закрыть отзывы об исполнителе"
        className="ww-selection-reviews-scrim"
        onClick={closeAndRestoreFocus}
        tabIndex={-1}
        type="button"
      />
      <aside
        aria-labelledby={`${response.id}-reviews-title`}
        aria-modal="true"
        className="ww-selection-reviews-drawer"
        onKeyDown={handleKeyDown}
        ref={drawerRef}
        role="dialog"
      >
        <button
          className="ww-selection-reviews-back"
          onClick={closeAndRestoreFocus}
          ref={backButtonRef}
          type="button"
        >
          <ChevronLeft aria-hidden="true" size={24} strokeWidth={1.8} />
          Назад
        </button>
        <h2 id={`${response.id}-reviews-title`}>
          Отзывы об исполнителе
          <span>{response.name}</span>
        </h2>
        <div aria-label={`Отзывы об исполнителе ${response.name}`} role="list">
          {response.reviews.map((review) => (
            <article
              className="ww-selection-review"
              key={review.dateTime}
              role="listitem"
            >
              <header>
                <ReviewStars rating={review.rating} />
                <time dateTime={review.dateTime}>{review.date}</time>
              </header>
              <p>{review.text}</p>
            </article>
          ))}
        </div>
      </aside>
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
  const [selectedResponse, setSelectedResponse] = useState<ResponseItem | null>(
    null,
  );
  const reviewTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!selectedResponse) reviewTriggerRef.current?.focus();
  }, [selectedResponse]);

  const openReviews = (response: ResponseItem, trigger: HTMLButtonElement) => {
    reviewTriggerRef.current = trigger;
    setSelectedResponse(response);
  };

  return (
    <div className="ww-payment-drawer-layer">
      <button
        aria-label="Закрыть панель задания"
        className="ww-payment-drawer-scrim"
        onClick={onClose}
        type="button"
      />
      <aside
        aria-label="Панель задания"
        className="ww-payment-drawer"
        inert={Boolean(selectedResponse)}
      >
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
          {activeTab === 'Отклики (3)' ? (
            <ResponsesTab onOpenReviews={openReviews} />
          ) : null}
          {activeTab === 'Действия' ? <ActionsTab /> : null}
          {activeTab === 'История' ? <HistoryTab /> : null}
        </div>
      </aside>
      {selectedResponse ? (
        <PerformerReviewsDrawer
          onClose={() => setSelectedResponse(null)}
          response={selectedResponse}
        />
      ) : null}
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
