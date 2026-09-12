import { useEffect, useRef, useState } from 'react';

const SCREEN_COUNT = 3;
const TARGET_TASK_INDEX = 0;
const ASSET_ROOT = '/performer-response-flow/assets';

type BrandLogoType = 'company' | 'hp-group' | 'perspektiva' | 'spar-tomsk';

type MarketplaceCard = {
  address: string;
  company: string;
  date: string;
  duration?: string;
  logo: BrandLogoType;
  price: string;
  role: string;
  time: string;
};

const TARGET_TASK = {
  address: 'г Томск, ул 30 летия Победы, д 5',
  company: 'ООО “Перспектива”',
  detailDate: '12 сентября',
  detailTime: '8:00 — 17:00',
  duration: '9 часов',
  legalEntity: 'ООО “Перспектива”',
  logo: 'perspektiva',
  orderNumber: '1924801284019',
  price: '1 744₽',
  publicationDate: '10.09.2026 09:21',
  role: 'Мерчендайзер',
  time: '8:00 - 17:00',
} as const;

const MARKETPLACE_CARDS: readonly MarketplaceCard[] = [
  {
    address: TARGET_TASK.address,
    company: TARGET_TASK.company,
    date: '11 июня',
    duration: TARGET_TASK.duration,
    logo: TARGET_TASK.logo,
    price: TARGET_TASK.price,
    role: TARGET_TASK.role,
    time: TARGET_TASK.time,
  },
  {
    address: 'г Томск, пер Дербышевский, д 17',
    company: 'ООО “Спар-Томск”',
    date: '11 июня',
    duration: '5 часов',
    logo: 'spar-tomsk',
    price: '1 365₽',
    role: 'Фасовщик',
    time: '18:00 - 23:00',
  },
  {
    address: 'Обл Московская, г Клин',
    company: 'ООО “ HP Групп профешинал”',
    date: '12 июня',
    duration: '10 часов',
    logo: 'hp-group',
    price: '2 054₽',
    role: 'Уборка и клининг',
    time: '8:00 - 18:00',
  },
  {
    address: 'г Астрахант, ул Ботвина, д 59',
    company: 'ИП Бещева Малика Вахаевна',
    date: '13 июня',
    duration: '4 часа',
    logo: 'company',
    price: '4 200₽',
    role: 'Оператор',
    time: '10:00 - 14:00',
  },
  {
    address: 'Все регионы, Все города, Рябиновая',
    company: 'ООО “ HP Групп профешинал”',
    date: '13 июня',
    logo: 'hp-group',
    price: '41 182,98₽',
    role: 'Ассистент',
    time: 'Не указан',
  },
];

const TASK_DESCRIPTION =
  'Задачи: Подтядка товаров на полках, Размещение акционных товаров на полках, Снятие товаров с истекшим сроком годности, Установка акционных ценников. Желаемое время начала работы 08:00. При себе иметь мед книжку и сменную одежду.';

function StatusBar() {
  return (
    <div aria-hidden="true" className="ww-response-statusbar">
      <span>9:30</span>
      <span className="ww-response-status-icons">
        <img alt="" src={`${ASSET_ROOT}/status-wifi.svg`} />
        <img alt="" src={`${ASSET_ROOT}/status-signal.svg`} />
        <img alt="" src={`${ASSET_ROOT}/status-battery.svg`} />
      </span>
    </div>
  );
}

function BrandLogo({ type }: { type: BrandLogoType }) {
  return (
    <span aria-hidden="true" className={`ww-response-brand is-${type}`}>
      <img alt="" src={`${ASSET_ROOT}/brand-${type}.png`} />
    </span>
  );
}

function MarketplaceTaskCard({
  card,
  onOpen,
}: {
  card: MarketplaceCard;
  onOpen?: () => void;
}) {
  const action = onOpen ? (
    <button
      className="ww-response-card-action"
      onClick={(event) => {
        event.stopPropagation();
        onOpen();
      }}
      type="button"
    >
      Откликнуться
    </button>
  ) : (
    <span className="ww-response-card-action">Откликнуться</span>
  );

  return (
    <article className="ww-response-task-card">
      <h3>{card.role}</h3>
      <div className="ww-response-task-company">
        <span>
          <b>{card.company}</b>
          <small>{card.address}</small>
        </span>
        <BrandLogo type={card.logo} />
      </div>
      <div className="ww-response-task-footer">
        <span>
          <strong>{card.price}</strong>
          <small>
            {card.time}
            {card.duration ? (
              <>
                {' '}
                <i>({card.duration})</i>
              </>
            ) : null}
          </small>
        </span>
        {action}
      </div>
    </article>
  );
}

function BottomNavigation() {
  const items = [
    { icon: 'nav-home.svg', label: 'Главная' },
    { icon: 'nav-responses.svg', label: 'Отклики' },
    { icon: 'nav-documents.svg', label: 'Документы' },
    { icon: 'nav-profile.svg', label: 'Профиль' },
  ] as const;

  return (
    <div aria-hidden="true" className="ww-response-bottom-nav">
      {items.map((item, index) => (
        <span
          className={index === 0 ? 'is-active' : undefined}
          key={item.label}
        >
          <img alt="" src={`${ASSET_ROOT}/${item.icon}`} />
          <small>{item.label}</small>
        </span>
      ))}
      <i />
    </div>
  );
}

function MarketplaceScreen({ onOpen }: { onOpen: () => void }) {
  return (
    <section
      className="ww-response-screen ww-response-marketplace"
      onClick={onOpen}
    >
      <StatusBar />
      <header className="ww-response-marketplace-header">
        <div>
          <h1>Главный</h1>
          <span aria-hidden="true" className="ww-response-icon-button">
            <img alt="" src={`${ASSET_ROOT}/notification.svg`} />
          </span>
        </div>
        <div className="ww-response-filter-strip">
          <span className="is-icon">
            <img alt="" src={`${ASSET_ROOT}/filter.svg`} />
          </span>
          <span>Вид деятельности</span>
          <span>Оплата</span>
          <span>Тип занятости</span>
          <span>Время</span>
        </div>
      </header>
      <main className="ww-response-marketplace-content">
        {MARKETPLACE_CARDS.map((card, index) => {
          const showDate = card.date !== MARKETPLACE_CARDS[index - 1]?.date;

          return (
            <div className="ww-response-marketplace-group" key={card.role}>
              {showDate ? (
                <h2 className={index === 0 ? undefined : 'is-later-date'}>
                  {card.date}
                  {card.date === '11 июня' ? <small>Сегодня</small> : null}
                </h2>
              ) : null}
              <MarketplaceTaskCard
                card={card}
                onOpen={index === TARGET_TASK_INDEX ? onOpen : undefined}
              />
            </div>
          );
        })}
      </main>
      <BottomNavigation />
    </section>
  );
}

function DetailHeader({ onBack }: { onBack: () => void }) {
  return (
    <div className="ww-response-detail-header">
      <button
        aria-label="Вернуться к заданиям"
        onClick={(event) => {
          event.stopPropagation();
          onBack();
        }}
        type="button"
      >
        <img alt="" src={`${ASSET_ROOT}/back.svg`} />
      </button>
      <strong>Отклик</strong>
      <span aria-hidden="true" />
    </div>
  );
}

function TaskSummary({ submitted }: { submitted: boolean }) {
  return (
    <article className="ww-response-summary-card">
      {submitted ? (
        <>
          <div className="ww-response-review-status">
            <span>На рассмотрении</span>
            <p>Отклик на рассмотрении у заказчика</p>
          </div>
          <div className="ww-response-divider" />
        </>
      ) : null}
      <div className="ww-response-role-price">
        <h2>{TARGET_TASK.role}</h2>
        <strong>{TARGET_TASK.price}</strong>
      </div>
      <div className="ww-response-divider" />
      <div className="ww-response-date-time">
        <strong>{TARGET_TASK.detailDate}</strong>
        <span>
          {TARGET_TASK.detailTime} <small>({TARGET_TASK.duration})</small>
        </span>
      </div>
      <div className="ww-response-divider" />
      <p className="ww-response-address">{TARGET_TASK.address}</p>
      <span className="ww-response-map-link">Показать на карте</span>
      <div className="ww-response-divider" />
      <div className="ww-response-chips">
        <span>СМЗ</span>
      </div>
    </article>
  );
}

function CompanyCard() {
  return (
    <article className="ww-response-company-card">
      <BrandLogo type={TARGET_TASK.logo} />
      <div>
        <strong>{TARGET_TASK.company}</strong>
        <span>
          <img alt="" src={`${ASSET_ROOT}/star.svg`} />
          <b>5,0</b> из 5 <i>37 отзывов</i>
        </span>
      </div>
      <img alt="" src={`${ASSET_ROOT}/company-chevron.svg`} />
    </article>
  );
}

function TaskDetails() {
  return (
    <dl className="ww-response-details">
      <div className="is-description">
        <dt>Описание работ</dt>
        <dd>{TASK_DESCRIPTION}</dd>
      </div>
      <div>
        <dt>Юридическое лицо</dt>
        <dd>{TARGET_TASK.legalEntity}</dd>
      </div>
      <div>
        <dt>Номер заказа</dt>
        <dd className="ww-response-order-number">
          {TARGET_TASK.orderNumber}{' '}
          <img alt="" src={`${ASSET_ROOT}/copy.svg`} />
        </dd>
      </div>
      <div>
        <dt>Дата публикации</dt>
        <dd>{TARGET_TASK.publicationDate}</dd>
      </div>
    </dl>
  );
}

function DetailScreen({
  onAdvance,
  onBack,
  submitted,
}: {
  onAdvance: () => void;
  onBack: () => void;
  submitted: boolean;
}) {
  return (
    <section
      className={`ww-response-screen ww-response-detail${submitted ? ' is-submitted' : ''}`}
      onClick={onAdvance}
    >
      <StatusBar />
      <DetailHeader onBack={onBack} />
      <main className="ww-response-detail-content">
        <div className="ww-response-detail-top">
          <TaskSummary submitted={submitted} />
          <CompanyCard />
          {submitted ? (
            <div className="ww-response-submitted-actions">
              <button type="button">Чат с заказчиком</button>
              <button type="button">Отменить</button>
            </div>
          ) : null}
        </div>
        <TaskDetails />
      </main>
      {submitted ? null : (
        <div className="ww-response-bottom-sheet">
          <button
            onClick={(event) => {
              event.stopPropagation();
              onAdvance();
            }}
            type="button"
          >
            Откликнуться
          </button>
          <i aria-hidden="true" />
        </div>
      )}
    </section>
  );
}

function FlowScreen({
  index,
  onAdvance,
  onBack,
}: {
  index: number;
  onAdvance: () => void;
  onBack: () => void;
}) {
  if (index === 0) return <MarketplaceScreen onOpen={onAdvance} />;

  return (
    <DetailScreen
      onAdvance={onAdvance}
      onBack={onBack}
      submitted={index === SCREEN_COUNT - 1}
    />
  );
}

export function PerformerResponseDemo() {
  const [screenIndex, setScreenIndex] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    viewportRef.current?.scrollTo({ top: 0 });

    if (document.activeElement === document.body) {
      viewportRef.current?.focus({ preventScroll: true });
    }
  }, [screenIndex]);

  const showNext = () => {
    setScreenIndex((current) => Math.min(SCREEN_COUNT - 1, current + 1));
  };

  const showPrevious = () => {
    setScreenIndex((current) => Math.max(0, current - 1));
  };

  return (
    <div className="ww-performer-response-flow">
      <div
        className="ww-response-viewport"
        data-demo-viewport="performer-response"
        ref={viewportRef}
        tabIndex={-1}
      >
        <FlowScreen
          index={screenIndex}
          onAdvance={showNext}
          onBack={showPrevious}
        />
      </div>
      <output aria-live="polite" className="sr-only">
        Путь отклика исполнителя. Экран {screenIndex + 1} из {SCREEN_COUNT}
      </output>
    </div>
  );
}
