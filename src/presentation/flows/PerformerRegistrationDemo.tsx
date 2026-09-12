import {
  ArrowLeft,
  Bell,
  BriefcaseBusiness,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  FileText,
  Home,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

const SCREEN_COUNT = 11;
const ASSET_ROOT = '/performer-registration-flow/assets';

type ScreenProps = {
  children: ReactNode;
  className?: string;
};

type FieldProps = {
  label?: string;
  value: string;
  withChevron?: boolean;
};

type MarketplaceCard = {
  address: string;
  company: string;
  date: string;
  duration?: string;
  logo: 'hp-group' | 'operator' | 'perspektiva' | 'spar-tomsk';
  price: string;
  role: string;
  time: string;
};

type Country = {
  icon: string;
  name: string;
  wide?: boolean;
};

const MARKETPLACE_CARDS: MarketplaceCard[] = [
  {
    address: 'г Томск, ул 30 летия Победы, д 5',
    company: 'ООО “Перспектива”',
    date: '11 июня',
    duration: '9 часов',
    logo: 'perspektiva',
    price: '1744₽',
    role: 'Мерчендайзер',
    time: '8:00 - 17:00',
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
    company: 'ИП Бециева Малика Вахаевна',
    date: '13 июня',
    duration: '4 часа',
    logo: 'operator',
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

const COUNTRIES: readonly Country[] = [
  { icon: 'flag-russia.png', name: 'Россия' },
  { icon: 'flag-azerbaijan.png', name: 'Азербайджан' },
  { icon: 'flag-armenia.png', name: 'Армения' },
  { icon: 'flag-belarus.png', name: 'Беларусь' },
  { icon: 'flag-georgia.png', name: 'Грузия' },
  { icon: 'flag-kazakhstan.png', name: 'Казахстан' },
  { icon: 'flag-kyrgyzstan.png', name: 'Кыргызстан' },
  { icon: 'flag-moldova.png', name: 'Молдова' },
  { icon: 'flag-tajikistan.png', name: 'Таджикистан' },
  { icon: 'flag-turkmenistan.png', name: 'Туркменистан' },
  { icon: 'flag-uzbekistan.png', name: 'Узбекистан', wide: true },
  { icon: 'flag-ukraine.png', name: 'Украина', wide: true },
  { icon: 'flag-dnr.png', name: 'ДНР', wide: true },
  { icon: 'flag-lnr.png', name: 'ЛНР', wide: true },
];

function Screen({ children, className = '' }: ScreenProps) {
  return <section className={`ww-pr-screen ${className}`}>{children}</section>;
}

function StatusBar({ time = '9:30' }: { time?: string }) {
  return (
    <div aria-hidden="true" className="ww-pr-statusbar">
      <span>{time}</span>
      <span className="ww-pr-statusbar-icons">
        <img alt="" src={`${ASSET_ROOT}/status-wifi.svg`} />
        <img alt="" src={`${ASSET_ROOT}/status-signal.svg`} />
        <img alt="" src={`${ASSET_ROOT}/status-battery.svg`} />
      </span>
    </div>
  );
}

function RegistrationHeader() {
  return (
    <div className="ww-pr-header">
      <ArrowLeft aria-hidden="true" size={24} />
      <strong>Регистрация</strong>
      <span>Помощь</span>
    </div>
  );
}

function RegistrationTop() {
  return (
    <>
      <StatusBar />
      <RegistrationHeader />
    </>
  );
}

function WinWorkLogo() {
  return (
    <img alt="WinWork" className="ww-pr-winwork-logo" src="/winwork-logo.svg" />
  );
}

function LoginField({ filled }: { filled: boolean }) {
  return (
    <div className="ww-pr-login-field">
      <img
        alt=""
        className="ww-pr-login-country-icon"
        src={`${ASSET_ROOT}/flag-russia.png`}
      />
      <span>
        <small>Телефон</small>
        <b>{filled ? '+7 912 345 67 89' : '+7'}</b>
      </span>
    </div>
  );
}

function LegalCopy() {
  return (
    <p className="ww-pr-legal-copy">
      Нажимая кнопку «Войти»,
      <br />я принимаю условия <span>пользовательского соглашения</span>,{' '}
      <span>согласия на обработку персональных данных</span>,{' '}
      <span>публичной оферты</span> и <span>правил работы сервиса</span>
    </p>
  );
}

function LoginScreen({ filled }: { filled: boolean }) {
  return (
    <Screen className="ww-pr-screen--compact ww-pr-login-screen">
      <StatusBar />
      <div className="ww-pr-login-content">
        <WinWorkLogo />
        <p className="ww-pr-login-description">Войдите в приложение Win Work</p>
        <LoginField filled={filled} />
        <div className={`ww-pr-primary-button${filled ? '' : ' is-disabled'}`}>
          Войти
        </div>
        <LegalCopy />
        <span className="ww-pr-help-link">Помощь</span>
      </div>
    </Screen>
  );
}

function CodeScreen() {
  return (
    <Screen className="ww-pr-screen--compact ww-pr-code-screen">
      <StatusBar />
      <div className="ww-pr-code-content">
        <WinWorkLogo />
        <p>Введите код подтверждения, отправленный на номер +7 912 345 67 89</p>
        <div aria-label="Пятизначный код" className="ww-pr-code-cells">
          {Array.from({ length: 5 }, (_, index) => (
            <span className={index === 0 ? 'is-focused' : ''} key={index}>
              {index === 0 ? <i aria-hidden="true" /> : null}
            </span>
          ))}
        </div>
        <small>Отправить повторно через 00:58</small>
        <span>Не могу войти</span>
      </div>
    </Screen>
  );
}

function BrandLogo({ type }: { type: MarketplaceCard['logo'] }) {
  return (
    <span aria-hidden="true" className={`ww-pr-brand-logo is-${type}`}>
      <img alt="" src={`${ASSET_ROOT}/brand-${type}.png`} />
    </span>
  );
}

function MarketplaceTaskCard({ card }: { card: MarketplaceCard }) {
  return (
    <article className="ww-pr-task-card">
      <h3>{card.role}</h3>
      <div className="ww-pr-task-company">
        <span>
          <b>{card.company}</b>
          <small>{card.address}</small>
        </span>
        <BrandLogo type={card.logo} />
      </div>
      <div className="ww-pr-task-footer">
        <span>
          <strong>{card.price}</strong>
          <small className={card.duration ? undefined : 'is-muted'}>
            {card.time}
            {card.duration ? <i> ({card.duration})</i> : null}
          </small>
        </span>
        <span className="ww-pr-card-action">Откликнуться</span>
      </div>
    </article>
  );
}

function BottomNavigation() {
  const items = [
    { icon: Home, label: 'Главная' },
    { icon: BriefcaseBusiness, label: 'Отклики' },
    { icon: FileText, label: 'Документы' },
    { icon: CircleUserRound, label: 'Профиль' },
  ];

  return (
    <div className="ww-pr-bottom-navigation">
      {items.map(({ icon: Icon, label }, index) => (
        <span className={index === 0 ? 'is-active' : ''} key={label}>
          <Icon aria-hidden="true" size={22} />
          <small>{label}</small>
        </span>
      ))}
      <i aria-hidden="true" />
    </div>
  );
}

function MarketplaceContent({ showAlert }: { showAlert: boolean }) {
  return (
    <>
      <StatusBar />
      <div className="ww-pr-marketplace-header">
        <div>
          <h1>Главный</h1>
          <span className="ww-pr-icon-button">
            <Bell aria-hidden="true" size={24} />
          </span>
        </div>
        <div className="ww-pr-filter-strip">
          <span className="is-icon">
            <SlidersHorizontal aria-hidden="true" size={22} />
          </span>
          <span>Вид деятельности</span>
          <span>Оплата</span>
          <span>Тип занятости</span>
          <span>Время</span>
          <span>Смена</span>
        </div>
      </div>
      <main className="ww-pr-marketplace-content">
        {showAlert ? (
          <section className="ww-pr-registration-alert">
            <span>
              <b>Завершите регистрацию</b>
              <small>Чтобы выходить на задания и получать вознаграждение</small>
            </span>
            <img
              alt=""
              className="ww-pr-registration-alert-art"
              src={`${ASSET_ROOT}/registration-alert.png`}
            />
          </section>
        ) : null}
        {MARKETPLACE_CARDS.map((card, index) => {
          const showDate = card.date !== MARKETPLACE_CARDS[index - 1]?.date;
          return (
            <div
              className="ww-pr-marketplace-group"
              key={`${card.role}-${card.company}`}
            >
              {showDate ? (
                <h2>
                  {card.date}
                  {card.date === '11 июня' ? <small>Сегодня</small> : null}
                </h2>
              ) : null}
              <MarketplaceTaskCard card={card} />
            </div>
          );
        })}
      </main>
      <BottomNavigation />
    </>
  );
}

function MarketplaceScreen({ completed = false }: { completed?: boolean }) {
  return (
    <Screen
      className={`ww-pr-marketplace-screen${completed ? ' is-completed' : ''}`}
    >
      <MarketplaceContent showAlert={!completed} />
      {completed ? (
        <>
          <div aria-hidden="true" className="ww-pr-success-scrim" />
          <section className="ww-pr-success-sheet">
            <i aria-hidden="true" className="ww-pr-sheet-grabber" />
            <img
              alt=""
              className="ww-pr-success-icon"
              src={`${ASSET_ROOT}/registration-success.png`}
            />
            <h2>Вы зарегистрировались</h2>
            <p>Для получения выплат, добавьте реквизиты</p>
            <div className="ww-pr-primary-button">Добавить реквизиты</div>
            <i aria-hidden="true" className="ww-pr-home-indicator" />
          </section>
        </>
      ) : null}
    </Screen>
  );
}

function CountryIcon({ icon, wide = false }: Pick<Country, 'icon' | 'wide'>) {
  return (
    <span aria-hidden="true" className="ww-pr-country-icon">
      <img
        alt=""
        className={wide ? 'is-wide' : undefined}
        src={`${ASSET_ROOT}/${icon}`}
      />
    </span>
  );
}

function CitizenshipScreen() {
  return (
    <Screen>
      <RegistrationTop />
      <main className="ww-pr-registration-content ww-pr-citizenship-content">
        <h1>Ваше гражданство</h1>
        <div className="ww-pr-search-field">
          <Search aria-hidden="true" size={22} />
          <span>Выберите страну</span>
        </div>
        <div className="ww-pr-country-list">
          {COUNTRIES.map((country) => (
            <div className="ww-pr-country-row" key={country.name}>
              <CountryIcon icon={country.icon} wide={country.wide} />
              <span>{country.name}</span>
              <ChevronRight aria-hidden="true" size={22} />
            </div>
          ))}
        </div>
      </main>
      <i aria-hidden="true" className="ww-pr-home-indicator" />
    </Screen>
  );
}

function NumberedStep({
  children,
  number,
}: {
  children: ReactNode;
  number: number;
}) {
  return (
    <div className="ww-pr-numbered-step">
      <span>{number}</span>
      <div>{children}</div>
    </div>
  );
}

function TaxLogoPanel() {
  return (
    <div className="ww-pr-tax-logo-panel">
      <img
        alt="Федеральная налоговая служба"
        src={`${ASSET_ROOT}/tax-logo.png`}
      />
    </div>
  );
}

function WorkFormatScreen() {
  return (
    <Screen>
      <RegistrationTop />
      <main className="ww-pr-registration-content ww-pr-work-format-content">
        <h1>Выберите формат работы</h1>
        <div className="ww-pr-work-options">
          <div>
            <span>
              <b>Я самозанятый</b>
              <small>99% заказов размещаются для самозанятых</small>
            </span>
            <ChevronRight aria-hidden="true" size={22} />
          </div>
          <div>
            <b>Физлицо</b>
            <ChevronRight aria-hidden="true" size={22} />
          </div>
          <div>
            <b>ИП</b>
            <ChevronRight aria-hidden="true" size={22} />
          </div>
        </div>
        <section className="ww-pr-work-card">
          <h2>Как стать самозанятым</h2>
          <TaxLogoPanel />
          <NumberedStep number={1}>
            <b>Откройте приложение Мой налог</b>
            <p>
              Зарегистрируйтесь или зайдите в приложение с номером из WinWork:
            </p>
            <p className="ww-pr-number-line">
              <strong>+7 912 345 67 89</strong> <span>Изменить</span>
            </p>
            <div className="ww-pr-secondary-button">Открыть Мой налог</div>
          </NumberedStep>
          <NumberedStep number={2}>
            <b>
              Выберите пункт:
              <br />
              Стать самозанятым
            </b>
            <p>Следуйте подсказкам приложения</p>
          </NumberedStep>
          <NumberedStep number={3}>
            <b>Вернитесь в WinWork и нажмите</b>
            <div className="ww-pr-primary-button is-compact">
              Я зарегистрировался
            </div>
          </NumberedStep>
        </section>
      </main>
    </Screen>
  );
}

function PartnerPhoneScreen() {
  return (
    <Screen>
      <RegistrationTop />
      <main className="ww-pr-registration-content ww-pr-partner-content">
        <h1>
          Подключите партнера WinWork
          <br />в Мой налог
        </h1>
        <div className="ww-pr-segmented-control">
          <span className="is-active">По номеру телефона</span>
          <span>По ИНН</span>
        </div>
        <p>Номер указанный в Мой налог:</p>
        <div className="ww-pr-phone-line">
          <strong>+7 999 123 45 67</strong>
          <span>Изменить</span>
        </div>
      </main>
      <div className="ww-pr-sticky-action">
        <div className="ww-pr-primary-button">Подключить</div>
      </div>
    </Screen>
  );
}

function TaxConnectionScreen() {
  return (
    <Screen>
      <RegistrationTop />
      <main className="ww-pr-registration-content ww-pr-tax-connection-content">
        <h1>Подключить приложение Мой Налог</h1>
        <TaxLogoPanel />
        <div className="ww-pr-invitation-row">
          <span>
            <Check aria-hidden="true" size={30} />
          </span>
          <p>
            <b>Мы отправили вам приглашение</b>
            <small>Подключите WinWork как партнера</small>
          </p>
        </div>
        <NumberedStep number={1}>
          <b>Откройте приложение Мой налог</b>
          <p>Перейдите в раздел Прочее → Партнеры</p>
          <div className="ww-pr-secondary-button">Открыть “Мой налог”</div>
        </NumberedStep>
        <NumberedStep number={2}>
          <b>Выберите WinWork вверху списка</b>
          <p>Укажите все нужные данные</p>
        </NumberedStep>
        <NumberedStep number={3}>
          <b>Пролистайте вниз и нажмите Разрешить</b>
        </NumberedStep>
        <NumberedStep number={4}>
          <b>Вернитесь сюда и нажмите</b>
          <div className="ww-pr-primary-button is-compact">Я подключил</div>
        </NumberedStep>
        <span className="ww-pr-missing-invite">Мне не пришло приглашение</span>
      </main>
    </Screen>
  );
}

function TaxLoadingScreen() {
  return (
    <Screen className="ww-pr-tax-loading-screen">
      <img
        alt="Экран загрузки приложения «Мой налог»"
        className="ww-pr-tax-loading-image"
        src={`${ASSET_ROOT}/tax-app-loading.png`}
      />
    </Screen>
  );
}

function FormField({ label, value, withChevron = false }: FieldProps) {
  return (
    <div className="ww-pr-form-field">
      {label ? <small>{label}</small> : null}
      <span>{value}</span>
      {withChevron ? <ChevronDown aria-hidden="true" size={18} /> : null}
    </div>
  );
}

function PersonalDataScreen() {
  return (
    <Screen>
      <RegistrationTop />
      <main className="ww-pr-registration-content ww-pr-personal-data-content">
        <h1>Внесите свои личные данные</h1>
        <p className="ww-pr-personal-intro">
          Мы сделаем для вас электронную подпись, чтобы вы могли легко
          подписывать документы с заказчиками
        </p>
        <div className="ww-pr-form-fields">
          <FormField
            label="Гражданство"
            value="Российская Федерация"
            withChevron
          />
          <FormField label="Фамилия" value="Иванов" />
          <FormField label="Имя" value="Иванов" />
          <FormField label="Отчество" value="Карпович" />
          <div className="ww-pr-checkbox-row">
            <i aria-hidden="true" />
            Нет отчества
          </div>
          <FormField label="Дата рождения" value="02.02.2000" />
          <FormField label="Серия и номер паспорта" value="2304 293847" />
          <FormField label="Код подразделения" value="440-987" />
          <FormField label="Кем выдан" value="УФМС России по Томской области" />
          <h2>Адрес</h2>
          <FormField
            label="Адрес регистрации"
            value="г. Томск, ул. Ленина, 24"
          />
        </div>
      </main>
      <div className="ww-pr-personal-actions">
        <div className="ww-pr-scan-action">
          <Camera aria-hidden="true" size={26} />
          Отсканировать паспорт
        </div>
        <div className="ww-pr-primary-button">Далее</div>
      </div>
    </Screen>
  );
}

function FlowScreen({ index }: { index: number }) {
  switch (index) {
    case 0:
      return <LoginScreen filled={false} />;
    case 1:
      return <LoginScreen filled />;
    case 2:
      return <CodeScreen />;
    case 3:
      return <MarketplaceScreen />;
    case 4:
      return <CitizenshipScreen />;
    case 5:
      return <WorkFormatScreen />;
    case 6:
      return <PartnerPhoneScreen />;
    case 7:
      return <TaxConnectionScreen />;
    case 8:
      return <TaxLoadingScreen />;
    case 9:
      return <PersonalDataScreen />;
    case 10:
      return <MarketplaceScreen completed />;
  }
}

export function PerformerRegistrationDemo() {
  const [screenIndex, setScreenIndex] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    viewportRef.current?.scrollTo({ top: 0 });
  }, [screenIndex]);

  const showNext = () => {
    setScreenIndex((current) => Math.min(SCREEN_COUNT - 1, current + 1));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      event.key === 'ArrowRight' ||
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault();
      showNext();
    }
  };

  const screenNumber = screenIndex + 1;

  return (
    <div className="ww-registration-flow">
      <div
        aria-disabled={screenIndex === SCREEN_COUNT - 1}
        aria-label={`Регистрация исполнителя. Экран ${screenNumber} из ${SCREEN_COUNT}${screenIndex < SCREEN_COUNT - 1 ? '. Нажмите, чтобы перейти дальше.' : '. Финальный экран.'}`}
        className="ww-pr-viewport"
        data-demo-viewport="performer-registration"
        onClick={showNext}
        onKeyDown={handleKeyDown}
        ref={viewportRef}
        role="button"
        tabIndex={0}
      >
        <FlowScreen index={screenIndex} />
      </div>
      <output aria-live="polite" className="sr-only">
        Экран {screenNumber} из {SCREEN_COUNT}
      </output>
    </div>
  );
}
