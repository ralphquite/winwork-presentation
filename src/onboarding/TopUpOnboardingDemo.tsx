import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { OnboardingHome, OnboardingShell } from './OnboardingShell';
import { OnboardingHelp } from './OnboardingHelp';
import { OnboardingTour } from './OnboardingTour';
import { TariffPage } from './TariffPage';
import type { OnboardingFlowId } from './onboardingTypes';
import { loadTariffProgress } from './tariffState';
import { loadCompanyProgress } from './companyState';
import { loadMarketplaceProgress } from './marketplaceState';
import {
  loadTopUpProgress,
  resumeTopUp,
  saveTopUpProgress,
  type InvoiceProgress,
  type TopUpState,
  type TopUpTour,
} from './topUpState';

export function TopUpOnboardingDemo({
  onExit,
  onReset,
  onSelectFlow,
}: {
  onExit: () => void;
  onReset: () => void;
  onSelectFlow: (flow: OnboardingFlowId) => void;
}) {
  const [state, setState] = useState(loadTopUpProgress);
  const [help, setHelp] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [message, setMessage] = useState('');
  const root = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const helpButton = useRef<HTMLButtonElement>(null);
  const closeHelp = useRef<HTMLButtonElement>(null);
  useEffect(() => saveTopUpProgress(state), [state]);
  useEffect(() => {
    if (help) closeHelp.current?.focus();
  }, [help]);
  useEffect(() => {
    if (!message) return;
    const timeout = window.setTimeout(() => setMessage(''), 4500);
    return () => window.clearTimeout(timeout);
  }, [message]);
  const patch = (next: Partial<TopUpState>) =>
    setState((current) => ({ ...current, ...next }));
  const focus = (target: string) =>
    requestAnimationFrame(() =>
      root.current
        ?.querySelector<HTMLElement>(`[data-tour-target="${target}"]`)
        ?.focus({ preventScroll: true }),
    );
  const dismissHelp = () => {
    setHelp(false);
    requestAnimationFrame(() => helpButton.current?.focus());
  };
  const dismissGuide = () => {
    patch({ guiding: false });
    helpButton.current?.focus();
  };
  const resume = () => {
    setHelp(false);
    setState(resumeTopUp);
  };
  const unavailable = () =>
    setMessage('Этот раздел не входит в сценарий пополнения счёта.');
  const goTariff = () =>
    patch({
      page: 'tariff',
      ...(state.tour === 'welcome' || state.tour === 'navigation'
        ? { tour: 'tab' as const }
        : {}),
    });
  const changeTab = (tab: 'tariff' | 'topup') => {
    patch({
      page: tab,
      ...(tab === 'topup' && state.tour === 'tab'
        ? { tour: 'methods' as const }
        : {}),
    });
  };
  const updateInvoice = (invoice: InvoiceProgress) =>
    patch({
      invoice,
      tour: invoice.prepared
        ? 'complete'
        : state.tour === 'methods' && invoice.filled === state.invoice.filled
          ? 'methods'
          : invoice.filled
            ? 'download'
            : state.tour === 'methods'
              ? 'methods'
              : 'amount',
    });
  const back = () => {
    const states: Partial<Record<TopUpTour, Partial<TopUpState>>> = {
      navigation: { tour: 'welcome' },
      tab: { page: 'home', tour: 'navigation' },
      methods: { page: 'tariff', tour: 'tab' },
      amount: { tour: 'methods' },
      download: { tour: 'amount' },
    };
    patch(states[state.tour] ?? {});
    if (state.tour === 'methods') focus('topup-tab');
    if (state.tour === 'tab') focus('tariff-nav');
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      if (help) dismissHelp();
      else if (state.guiding) dismissGuide();
    }
    if (event.key === 'Tab' && help) {
      const elements = [
        ...(layer.current?.querySelectorAll<HTMLButtonElement>(
          'button:not([disabled])',
        ) ?? []),
      ];
      const first = elements[0],
        last = elements.at(-1);
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
  const expectedPage =
    state.tour === 'welcome' || state.tour === 'navigation'
      ? 'home'
      : state.tour === 'tab'
        ? 'tariff'
        : 'topup';
  const paused = state.page !== expectedPage;
  const tours = {
    welcome: {
      target: 'tariff-nav',
      step: 0,
      title: 'Подготовьте счёт к первой оплате',
      description:
        'Задания исполнителей оплачиваются со счёта компании. После заявки на снижение комиссии подготовьте пополнение — до публикации первого задания.',
      action: 'Начать',
      onAction: () => patch({ tour: 'navigation' }),
    },
    navigation: {
      target: 'tariff-nav',
      step: 1,
      title: 'Откройте «Мой тариф»',
      description:
        'Пополнение находится на отдельной вкладке внутри раздела «Мой тариф». Нажмите «Мой тариф» в левом меню.',
      onBack: back,
    },
    tab: {
      target: 'topup-tab',
      step: 1,
      title: 'Перейдите на «Пополнение»',
      description:
        'На «Тарифе» указаны комиссии. Нажмите «Пополнение», чтобы перейти к счёту, QR-коду и банковским реквизитам.',
      onBack: back,
    },
    methods: {
      target: 'topup-bank',
      step: 2,
      title: 'Выберите банк и способ пополнения',
      description:
        'Выбор банка меняет QR-код, счёт и реквизиты. Слева можно отсканировать QR-код или сформировать счёт, справа — скопировать или скачать реквизиты.',
      note: 'Переводите деньги со счёта юрлица или ИП, на которое зарегистрирован кабинет.',
      action: 'К счёту',
      onAction: () =>
        patch({
          tour: state.invoice.prepared
            ? 'complete'
            : state.invoice.filled
              ? 'download'
              : 'amount',
        }),
      onBack: back,
    },
    amount: {
      target: 'topup-amount',
      avoidTarget: 'topup-form',
      step: 3,
      title: 'Укажите сумму пополнения',
      description:
        'Учтите оплату задания и комиссию. Нажмите на поле суммы, чтобы заполнить его и перейти к формированию счёта.',
      onBack: back,
    },
    download: {
      target: 'topup-generate',
      avoidTarget: 'topup-form',
      step: 4,
      title: 'Выберите формат и скачайте счёт',
      description:
        'Выберите PDF или Excel и нажмите «Сформировать счёт». Файл с суммой, реквизитами и назначением платежа скачается на устройство.',
      onBack: back,
    },
    complete: {
      target: 'topup-result',
      avoidTarget: 'topup-form',
      step: 4,
      title: 'Счёт готов к оплате',
      description:
        'Оплатите его в банке со счёта компании, на которую зарегистрирован кабинет. После зачисления деньги можно использовать для оплаты заданий исполнителям.',
      note: 'В демо платёж не выполняется и баланс не меняется. Подготовка счёта завершена — дальше первое задание.',
      action: 'К первому заданию',
      onAction: () => onSelectFlow('marketplace'),
    },
  };
  const progress = {
    tariffComplete: loadTariffProgress().submitted,
    topUpComplete: state.invoice.prepared,
    companyComplete: loadCompanyProgress().saved,
    marketplaceComplete: loadMarketplaceProgress().viewed,
  };

  return (
    <div
      className={`wo-app${collapsed ? ' is-collapsed' : ''}`}
      ref={root}
      onKeyDown={onKeyDown}
    >
      <OnboardingShell
        active={state.page === 'home' ? undefined : 'Мой тариф'}
        inert={help}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        helpOpen={help}
        completedCount={Object.values(progress).filter(Boolean).length}
        helpButton={helpButton}
        onHome={() => patch({ page: 'home' })}
        onTariff={goTariff}
        onSettings={() => onSelectFlow('company')}
        onMarketplace={() => onSelectFlow('marketplace')}
        onHelp={() => setHelp(true)}
        onUnavailable={unavailable}
        onMessage={setMessage}
        onExit={onExit}
        onReset={onReset}
      >
        {state.page === 'home' ? (
          <OnboardingHome onTariff={goTariff} onHelp={() => setHelp(true)} />
        ) : (
          <TariffPage
            onRequest={() => onSelectFlow('tariff')}
            onHelp={unavailable}
            onMessage={setMessage}
            activeTab={state.page === 'topup' ? 'topup' : 'tariff'}
            onTabChange={changeTab}
            invoiceProgress={state.invoice}
            onInvoiceProgress={updateInvoice}
          />
        )}
      </OnboardingShell>
      {help ? (
        <div className="wo-layer" ref={layer}>
          <div className="wo-scrim" aria-hidden="true" onClick={dismissHelp} />
          <OnboardingHelp
            {...progress}
            closeButton={closeHelp}
            onClose={dismissHelp}

            onTariff={() => onSelectFlow('tariff')}
            onTopUp={resume}
            onCompany={() => onSelectFlow('company')}
            onMarketplace={() => onSelectFlow('marketplace')}
            onReset={onReset}
          />
        </div>
      ) : null}
      {state.guiding && !help && !paused ? (
        <OnboardingTour
          root={root}
          flowName="Пополнение счёта"
          totalSteps={4}
          onClose={dismissGuide}
          {...tours[state.tour]}
        />
      ) : null}
      {state.guiding && !help && paused ? (
        <div className="wo-paused">
          <p>Пополнение счёта: вернитесь к текущему шагу.</p>
          <button onClick={resume} type="button">
            Продолжить
          </button>
          <button onClick={dismissGuide} type="button">
            Позже
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
