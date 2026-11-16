import type { OnboardingFlowId } from './onboardingTypes';
import { loadTopUpProgress } from './topUpState';
import { ChevronDown, X } from 'lucide-react';
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import fileIcon from '../assets/onboarding/icon-file-blue.svg';
import trashIcon from '../assets/onboarding/icon-trash-delete.svg';
import successIcon from '../assets/onboarding/modal-success.svg';
import uploadIcon from '../assets/onboarding/icon-upload-document.svg';
import { OnboardingShell, OnboardingHome } from './OnboardingShell';
import { OnboardingHelp } from './OnboardingHelp';
import { loadMarketplaceProgress } from './marketplaceState';
import { loadCompanyProgress } from './companyState';
import { OnboardingTour } from './OnboardingTour';
import { TariffPage } from './TariffPage';
import {
  DEMO_FIELDS,
  DEMO_SELFIE,
  REQUIRED_FIELDS,
  fieldError,
  formReady,
  loadTariffProgress,
  saveTariffProgress,
  type FieldName,
  type TariffState,
  type TourStep,
} from './tariffState';

const FIELD_LABELS: Record<FieldName, string> = {
  citizenship: 'Ваше гражданство',
  passport: 'Серия и номер паспорта',
  issuedAt: 'Дата выдачи паспорта',
  department: 'Код подразделения',
  issuedBy: 'Кем выдан',
  birthDate: 'Дата рождения',
  birthPlace: 'Место рождения',
  address: 'Адрес регистрации',
  site: 'Ссылка на соцсети или сайт компании',
  email: 'Почта',
  phone: 'Телефон',
};

export function TariffOnboardingDemo({
  onExit,
  onReset,
  onSelectFlow,
}: {
  onExit: () => void;
  onReset: () => void;
  onSelectFlow: (flow: OnboardingFlowId) => void;
}) {
  const [state, setState] = useState(loadTariffProgress);
  const [help, setHelp] = useState(false);
  const [activeTab, setActiveTab] = useState<'tariff' | 'topup'>('tariff');
  const topUpActive = activeTab === 'topup';
  const [success, setSuccess] = useState(false);
  const successClose = useRef<HTMLButtonElement>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<FieldName | 'attachment', string>>
  >({});
  const [message, setMessage] = useState('');
  const root = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const closeDrawer = useRef<HTMLButtonElement>(null);
  const helpButton = useRef<HTMLButtonElement>(null);
  const requestButton = useRef<HTMLElement | null>(null);

  useEffect(() => {
    saveTariffProgress(state);
  }, [state]);
  useEffect(() => {
    if (success) successClose.current?.focus();
    else if (state.drawer || help) closeDrawer.current?.focus();
  }, [state.drawer, help, success]);
  useEffect(() => {
    if (document.activeElement !== document.body) return;
    const target =
      state.tour === 'send'
        ? 'submit'
        : state.tour === 'request'
          ? 'request'
          : 'tariff-nav';
    root.current
      ?.querySelector<HTMLElement>(`[data-tour-target="${target}"]`)
      ?.focus({ preventScroll: true });
  }, [state.tour]);
  useEffect(() => {
    if (!message) return;
    const timeout = window.setTimeout(() => setMessage(''), 4500);
    return () => window.clearTimeout(timeout);
  }, [message]);

  const patch = (next: Partial<TariffState>) =>
    setState((current) => ({ ...current, ...next }));
  const unavailable = () =>
    setMessage('Этот раздел не входит в сценарий снижения комиссии.');
  const goTariff = () => {
    setActiveTab('tariff');
    patch({ page: 'tariff', tour: state.submitted ? 'complete' : 'request' });
  };
  const openRequest = () => {
    requestButton.current =
      root.current?.querySelector('[data-tour-target="request"]') ?? null;
    patch({ drawer: true, tour: 'details' });
  };
  const dismissDrawer = () => {
    patch({ drawer: false });
    requestAnimationFrame(() =>
      (
        requestButton.current ??
        root.current?.querySelector<HTMLElement>('[data-tour-target="request"]')
      )?.focus(),
    );
  };
  const dismissHelp = () => {
    setHelp(false);
    requestAnimationFrame(() =>
      (state.drawer ? closeDrawer.current : helpButton.current)?.focus(),
    );
  };
  const dismissGuide = () => {
    patch({ guiding: false });
    requestAnimationFrame(() =>
      (state.drawer ? closeDrawer.current : helpButton.current)?.focus(),
    );
  };
  const updateField = (name: FieldName, value: string) => {
    setState((current) => {
      const next = { ...current, values: { ...current.values, [name]: value } };
      if (current.tour === 'send' && !formReady(next)) next.tour = 'details';
      if (current.tour === 'details' && formReady(next)) next.tour = 'send';
      return next;
    });
    setErrors((current) => ({ ...current, [name]: '' }));
  };
  const attach = (name: string) => {
    setState((current) => {
      const next = { ...current, attachment: name };
      return { ...next, tour: formReady(next) ? 'send' : 'details' };
    });
    setErrors((current) => ({ ...current, attachment: '' }));
  };
  const nextFromDetails = () => {
    const nextErrors: Partial<Record<FieldName | 'attachment', string>> = {};
    for (const name of REQUIRED_FIELDS) {
      const error = fieldError(name, state.values[name]);
      if (error) nextErrors[name] = error;
    }
    if (!state.attachment)
      nextErrors.attachment = 'Прикрепите селфи с паспортом';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const name = Object.keys(nextErrors)[0];
      root.current?.querySelector<HTMLElement>(`[name="${name}"]`)?.focus();
      return false;
    }
    patch({ tour: 'send' });
    return true;
  };
  const submit = () => {
    if (!nextFromDetails()) return;
    patch({ submitted: true, tour: 'complete' });
    setSuccess(true);
  };
  const dismissSuccess = () => {
    setSuccess(false);
    patch({ drawer: false });
    requestAnimationFrame(() => helpButton.current?.focus());
  };
  const fillDemo = () => {
    patch({ values: { ...DEMO_FIELDS } });
    setErrors({});
  };
  const resume = () => {
    setActiveTab('tariff');
    setHelp(false);
    const tour: TourStep = state.submitted
      ? 'complete'
      : state.tour === 'welcome'
        ? 'navigation'
        : state.tour;
    patch({
      guiding: true,
      tour,
      page: tour === 'navigation' ? 'home' : 'tariff',
      drawer: tour === 'details' || tour === 'send',
    });
  };
  const back = () => {
    if (state.tour === 'navigation') patch({ tour: 'welcome' });
    if (state.tour === 'request') patch({ page: 'home', tour: 'navigation' });
    if (state.tour === 'details') patch({ drawer: false, tour: 'request' });
    if (state.tour === 'send') patch({ tour: 'details' });
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      if (success) dismissSuccess();
      else if (help) dismissHelp();
      else if (topUpActive) {
        setActiveTab('tariff');
        requestAnimationFrame(() =>
          document.getElementById('wo-tab-tariff')?.focus(),
        );
      } else if (state.guiding) dismissGuide();
      else if (state.drawer) dismissDrawer();
      return;
    }
    if (event.key === 'Tab' && (state.drawer || help)) {
      const elements = [
        ...(layer.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]):not([type="file"]), select, [tabindex="0"]',
        ) ?? []),
      ].filter((el) => el.getClientRects().length && !el.closest('[inert]'));
      const first = elements[0];
      const last = elements.at(-1);
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !layer.current?.contains(document.activeElement))
      ) {
        event.preventDefault();
        last?.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !layer.current?.contains(document.activeElement))
      ) {
        event.preventDefault();
        first?.focus();
      }
    }
  };

  const input = (name: FieldName) => (
    <label
      className={`wo-field${name === 'citizenship' ? ' wo-citizenship' : ''}${state.values[name] ? ' is-filled' : ''}${errors[name] ? ' is-invalid' : ''}`}
      key={name}
    >
      <span>{FIELD_LABELS[name]}</span>
      <input
        aria-describedby={`wo-demo-form-hint${errors[name] ? ` error-${name}` : ''}`}
        aria-invalid={Boolean(errors[name])}
        autoComplete="off"
        name={name}
        onBlur={() => {
          setErrors((current) => ({
            ...current,
            [name]: fieldError(name, state.values[name]),
          }));
          if (state.tour === 'details' && formReady(state))
            patch({ tour: 'send' });
        }}
        onClick={() => updateField(name, DEMO_FIELDS[name])}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            updateField(name, DEMO_FIELDS[name]);
          }
        }}
        readOnly
        type={name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'text'}
        value={state.values[name]}
      />
      {name === 'citizenship' ? <ChevronDown size={18} /> : null}
      {errors[name] ? <small id={`error-${name}`}>{errors[name]}</small> : null}
    </label>
  );

  const passportReady = REQUIRED_FIELDS.filter(
    (name) => !['email', 'phone', 'site'].includes(name),
  ).every((name) => !fieldError(name, state.values[name]));
  const paused =
    ((state.tour === 'details' || state.tour === 'send') && !state.drawer) ||
    (state.tour === 'request' && state.page !== 'tariff') ||
    (state.tour === 'complete' && state.page !== 'tariff');
  let tour: ReactNode = null;
  if (state.guiding && !help && !paused && !success && !topUpActive) {
    const shared = { root, onClose: dismissGuide };
    switch (state.tour) {
      case 'welcome':
        tour = (
          <OnboardingTour
            {...shared}
            target="tariff-nav"
            step={0}
            title="Начните с меньшей комиссии"
            description="Сейчас комиссия за выплаты самозанятым на карту — 7%. Верификация представителя компании позволяет снизить её, вплоть до 3%."
            note="Пройдём вместе короткий сценарий подачи заявки. Итоговая ставка зависит от результата проверки."
            action="Начать"
            onAction={() => patch({ tour: 'navigation' })}
          />
        );
        break;
      case 'navigation':
        tour = (
          <OnboardingTour
            {...shared}
            target="tariff-nav"
            step={1}
            title="Откройте «Мой тариф»"
            description="Здесь можно посмотреть текущую комиссию и подать заявку на её снижение. Нажмите «Мой тариф» в левом меню."
            onBack={back}
          />
        );
        break;
      case 'request':
        tour = (
          <OnboardingTour
            {...shared}
            target="request"
            step={2}
            title="Подайте заявку на снижение"
            description="На вкладке «Тариф» нажмите «Оставить заявку». Для проверки понадобятся паспортные данные представителя компании и его селфи с паспортом."
            onBack={back}
          />
        );
        break;
      case 'details':
        tour = (
          <OnboardingTour
            {...shared}
            target={passportReady ? 'selfie' : 'passport'}
            step={3}
            title={
              passportReady
                ? 'Прикрепите селфи с паспортом'
                : 'Укажите данные представителя'
            }
            description={
              passportReady
                ? 'На фото должны быть видны лицо и раскрытый паспорт. Затем проверьте контакты — они нужны для связи по заявке.'
                : 'Заполните паспортные данные сотрудника, который представляет компанию, и прикрепите его селфи с паспортом. Так можно подтвердить представителя юридического лица.'
            }
            onBack={back}
            action={
              passportReady && !state.attachment
                ? 'Демо-фото'
                : !passportReady
                  ? 'Заполнить демо-данными'
                  : formReady(state)
                    ? 'Далее'
                    : undefined
            }
            onAction={
              passportReady && !state.attachment
                ? () => attach(DEMO_SELFIE)
                : !passportReady
                  ? fillDemo
                  : formReady(state)
                    ? () => patch({ tour: 'send' })
                    : undefined
            }
          />
        );
        break;
      case 'send':
        tour = (
          <OnboardingTour
            {...shared}
            target="submit"
            step={4}
            title="Отправьте заявку на проверку"
            description="Проверьте данные и нажмите «Отправить». Комиссия изменится после одобрения заявки; до этого действует текущий тариф."
            onBack={back}
          />
        );
        break;
      case 'complete':
        tour = (
          <OnboardingTour
            {...shared}
            target="help"
            step={4}
            title="Первый шаг выполнен"
            description="Заявка отправлена — с вами свяжется специалист. Следующий шаг перед первым заданием — подготовить пополнение счёта компании: с него оплачивается работа исполнителей."
            action="К пополнению счёта"
            onAction={() => onSelectFlow('topup')}
          />
        );
        break;
    }
  }

  const progress = {
    topUpComplete: loadTopUpProgress().invoice.prepared,
    tariffComplete: state.submitted,
    companyComplete: loadCompanyProgress().saved,
    marketplaceComplete: loadMarketplaceProgress().viewed,
  };

  return (
    <div
      className={`wo-app${collapsed ? ' is-collapsed' : ''}`}
      onKeyDown={onKeyDown}
      ref={root}
    >
      <OnboardingShell
        active={state.page === 'tariff' ? 'Мой тариф' : undefined}
        inert={state.drawer || help}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        helpOpen={help}
        completedCount={Object.values(progress).filter(Boolean).length}
        helpButton={helpButton}
        onHome={() => {
          setActiveTab('tariff');
          patch({ page: 'home' });
        }}
        onTariff={goTariff}
        onMarketplace={() => onSelectFlow('marketplace')}
        onSettings={() => onSelectFlow('company')}
        onHelp={() => setHelp(true)}
        onUnavailable={unavailable}
        onMessage={setMessage}
        onExit={onExit}
        onReset={onReset}
      >
        {state.page === 'home' ? (
          <OnboardingHome onHelp={() => setHelp(true)} onTariff={goTariff} />
        ) : (
          <TariffPage
            onMessage={setMessage}
            onHelp={unavailable}
            onRequest={openRequest}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        )}
      </OnboardingShell>
      {state.drawer || help ? (
        <div className="wo-layer" ref={layer}>
          <div
            aria-hidden="true"
            className="wo-scrim"
            onClick={help ? dismissHelp : dismissDrawer}
          />
          {help ? (
            <OnboardingHelp
              {...progress}

              onTopUp={() => onSelectFlow('topup')}
              closeButton={closeDrawer}
              onClose={dismissHelp}

              onTariff={resume}
              onCompany={() => onSelectFlow('company')}

              onMarketplace={() => onSelectFlow('marketplace')}
              onReset={onReset}
            />
          ) : (
            <aside
              aria-labelledby="wo-form-title"
              aria-modal="false"
              inert={success}
              className="wo-drawer"
              role="dialog"
            >
              <header>
                <h2 id="wo-form-title">Расскажите нам о своей компании</h2>
                <button
                  aria-label="Закрыть заявку"
                  onClick={dismissDrawer}
                  ref={closeDrawer}
                  type="button"
                >
                  <X size={22} />
                </button>
              </header>
              <form
                noValidate
                onSubmit={(event) => {
                  event.preventDefault();
                  submit();
                }}
              >
                <section className="wo-data-group" data-tour-target="passport">
                  <h3>Паспортные данные</h3>
                  <div className="wo-fields">
                    {input('citizenship')}
                    {input('passport')}
                    <div className="wo-field-row">
                      {input('issuedAt')}
                      {input('department')}
                    </div>
                    {input('issuedBy')}
                    <div className="wo-field-row">
                      {input('birthDate')}
                      {input('birthPlace')}
                    </div>
                    {input('address')}
                  </div>
                </section>
                {state.attachment ? (
                  <div className="wo-attached-file">
                    <span className="wo-file-number">1</span>
                    <img alt="" src={fileIcon} />
                    <span>{state.attachment}</span>
                    <button
                      aria-label="Удалить прикреплённое фото"
                      onClick={() => attach('')}
                      type="button"
                    >
                      <img alt="" src={trashIcon} />
                    </button>
                  </div>
                ) : null}
                <div
                  className={`wo-upload${errors.attachment ? ' is-invalid' : ''}`}
                  data-tour-target="selfie"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    attach(DEMO_SELFIE);
                  }}
                >
                  <button
                    name="attachment"
                    onClick={() => attach(DEMO_SELFIE)}
                    type="button"
                  >
                    <img alt="" src={uploadIcon} />
                    <span>
                      <strong>Ваше селфи с паспортом</strong>
                      <small>
                        Нажмите для загрузки файла, или перетащите в это окно
                      </small>
                      <small>Формат: jpg, png</small>
                    </span>
                  </button>
                </div>
                {errors.attachment ? (
                  <p className="wo-field-error" role="alert">
                    {errors.attachment}
                  </p>
                ) : null}
                <section className="wo-data-group wo-extra-data">
                  <h3>Дополнительная информация</h3>
                  <div className="wo-fields">
                    {input('site')}
                    {input('email')}
                    {input('phone')}
                  </div>
                </section>
                <p className="wo-support-copy">
                  Что-то не получается? Напишите в{' '}
                  <button
                    className="wo-text-link"
                    onClick={() => setHelp(true)}
                    type="button"
                  >
                    чат поддержки.
                  </button>
                </p>
                <button
                  className="wo-primary wo-submit"
                  data-tour-target="submit"
                  type="submit"
                >
                  Отправить
                </button>
                <div className="wo-demo-form-note">
                  <span id="wo-demo-form-hint">
                    Демо: нажмите на поле или загрузку фото — данные появятся
                    автоматически.
                  </span>{' '}
                  <button onClick={fillDemo} type="button">
                    Заполнить демо-данными
                  </button>
                  {' · '}
                  <button onClick={() => attach(DEMO_SELFIE)} type="button">
                    Прикрепить демо-фото
                  </button>
                </div>
              </form>
            </aside>
          )}
          {success ? (
            <div className="wo-success-layer">
              <div
                className="wo-success-scrim"
                onClick={dismissSuccess}
                aria-hidden="true"
              />
              <section
                className="wo-success"
                role="dialog"
                aria-modal="true"
                aria-labelledby="wo-success-title"
                aria-describedby="wo-success-description"
              >
                <button
                  className="wo-success-x"
                  aria-label="Закрыть подтверждение"
                  onClick={dismissSuccess}
                  type="button"
                >
                  <X size={24} />
                </button>
                <img alt="" src={successIcon} />
                <h2 id="wo-success-title">Заявка успешно отправлена</h2>
                <p id="wo-success-description">
                  Спасибо! В ближайшее время с вами свяжется наш специалист.
                </p>
                <button
                  className="wo-success-close"
                  ref={successClose}
                  onClick={dismissSuccess}
                  type="button"
                >
                  Закрыть
                </button>
              </section>
            </div>
          ) : (
            tour
          )}
        </div>
      ) : (
        tour
      )}
      {state.guiding && paused && !help ? (
        <div className="wo-paused" role="status">
          <strong>Сценарий на паузе</strong>
          <p>Вернитесь к заявке, чтобы продолжить снижение комиссии.</p>
          <button onClick={resume} type="button">
            Продолжить
          </button>
          <button
            aria-label="Закрыть подсказки"
            onClick={dismissGuide}
            type="button"
          >
            <X size={18} />
          </button>
        </div>
      ) : null}
      {message ? (
        <div className="wo-toast" role="status">
          {message}
        </div>
      ) : null}
    </div>
  );
}
