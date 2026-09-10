import { useEffect, useRef, useState } from 'react';

const SCREEN_COUNT = 3;
const TARGET_TASK_INDEX = 1;
const ASSET_ROOT = '/performer-response-flow/assets';

type MarketplaceCard = {
  address: string;
  company: string;
  date: string;
  duration: string;
  logo: 'atomy' | 'dns' | 'kruiz' | 'painting' | 'spar';
  price: string;
  role: string;
  time: string;
};

const MARKETPLACE_CARDS: readonly MarketplaceCard[] = [
  {
    address: 'ул. Ленина, Ставрополь, Ставропольский край, Россия, 355012',
    company: 'Атоми Ру',
    date: '11 июня',
    duration: '4 часа',
    logo: 'atomy',
    price: '3100₽',
    role: 'Продавец консультант',
    time: '10:00 - 14:00',
  },
  {
    address: 'ул. Канашская, 16а, Нижний Новгород, 603089',
    company: 'Спар',
    date: '11 июня',
    duration: '8 часов',
    logo: 'spar',
    price: '9 400₽',
    role: 'Мерчендайзер',
    time: '10:00 - 18:00',
  },
  {
    address:
      'ул. Абрикосовая, 7 корпус 1, Сочи, Краснодарский край, Россия, 354003',
    company: 'Круиз Онлайн',
    date: '12 июня',
    duration: '10 часов',
    logo: 'kruiz',
    price: '4 700₽',
    role: 'Консультант',
    time: '10:00 - 20:00',
  },
  {
    address: 'ул. Новый Арбат, стр 11, Москва, Россия, 10912',
    company: 'Живопись маслом',
    date: '13 июня',
    duration: '4 часа',
    logo: 'painting',
    price: '4 200₽',
    role: 'Учитель живописи для детей',
    time: '10:00 - 14:00',
  },
  {
    address: 'ул. Новый Арбат, стр 11, Томск, Россия, 10912',
    company: 'ДНС',
    date: '13 июня',
    duration: '2 часа',
    logo: 'dns',
    price: '1 700₽',
    role: 'Менеджер торгового зала',
    time: '12:00 - 14:00',
  },
];

const TASK_DESCRIPTION =
  'Обязанности мерчендайзера в супермаркете включают в себя выкладку товаров, поддержание привлекательного внешнего вида торговых полок и контроль за сроками годности продукции. Важно следить за наличием товаров и их правильным размещением, чтобы покупатели могли легко находить нужные продукты. Также необходимо взаимодействовать с клиентами, предоставляя информацию о товарах и акциях. Соблюдение чистоты и порядка в торговом зале является обязательным, а за несоблюдение стандартов предусмотрены меры ответственности.';

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

function BrandLogo({ type }: { type: MarketplaceCard['logo'] }) {
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
    <button className="ww-response-card-action" onClick={onOpen} type="button">
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
            {card.time} <i>({card.duration})</i>
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
    <section className="ww-response-screen ww-response-marketplace">
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
      <button aria-label="Вернуться к заданиям" onClick={onBack} type="button">
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
        <h2>Мерчендайзер</h2>
        <strong>9 400₽</strong>
      </div>
      <div className="ww-response-divider" />
      <div className="ww-response-date-time">
        <strong>10 июля</strong>
        <span>
          10:00 — 18:00 <small>(8 часов)</small>
        </span>
      </div>
      <div className="ww-response-divider" />
      <p className="ww-response-address">
        ул. Канашская, 16а, Нижний Новгород, 603089
      </p>
      <span className="ww-response-map-link">Показать на карте</span>
      <div className="ww-response-divider" />
      <div className="ww-response-chips">
        <span>Физлица</span>
        <span>ИП</span>
        <span>Самозанятые</span>
      </div>
    </article>
  );
}

function CompanyCard() {
  return (
    <article className="ww-response-company-card">
      <BrandLogo type="spar" />
      <div>
        <strong>Спар</strong>
        <span>
          <img alt="" src={`${ASSET_ROOT}/star.svg`} />
          <b>4.6</b> из 5 <i>21 отзыв</i>
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
        <dd>ООО «Спар»</dd>
      </div>
      <div>
        <dt>Номер заказа</dt>
        <dd className="ww-response-order-number">
          156647859 <img alt="" src={`${ASSET_ROOT}/copy.svg`} />
        </dd>
      </div>
      <div>
        <dt>Дата публикации</dt>
        <dd>10.07.2026 09:22</dd>
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
    >
      <StatusBar />
      {submitted ? null : <DetailHeader onBack={onBack} />}
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
          <button onClick={onAdvance} type="button">
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
