import type { OnboardingFlowId } from './onboardingTypes';
import { loadTopUpProgress } from './topUpState';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

import emptyLogo from '../assets/onboarding/building-fill.svg';
import demoLogo from '../assets/onboarding/company-demo-logo.svg';
import { OnboardingShell, OnboardingHome } from './OnboardingShell';
import { OnboardingHelp } from './OnboardingHelp';
import { loadMarketplaceProgress } from './marketplaceState';
import { OnboardingTour } from './OnboardingTour';
import { loadTariffProgress } from './tariffState';
import {
  COMPANY_FIELDS,
  COMPANY_FIELD_NAMES,
  companyReady,
  loadCompanyProgress,
  saveCompanyProgress,
  type CompanyField,
  type CompanyState,
} from './companyState';

const LABELS: Record<CompanyField, string> = {
  brandName: 'Название бренда / компании',
  description: 'Описание компании',
  address: 'Адрес',
  website: 'Сайт компании',
  phone: 'Публичный телефон',
  email: 'Публичный email',
};

export function CompanyOnboardingDemo({
  onExit,
  onReset,
  onSelectFlow,
}: {
  onExit: () => void;
  onReset: () => void;
  onSelectFlow: (flow: OnboardingFlowId) => void;
}) {
  const [state, setState] = useState(loadCompanyProgress);
  const [help, setHelp] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [message, setMessage] = useState('');
  const [brandError, setBrandError] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const helpButton = useRef<HTMLButtonElement>(null);
  const closeHelp = useRef<HTMLButtonElement>(null);
  useEffect(() => saveCompanyProgress(state), [state]);
  useEffect(() => {
    if (help) closeHelp.current?.focus();
  }, [help]);
  useEffect(() => {
    if (!message) return;
    const timeout = window.setTimeout(() => setMessage(''), 4500);
    return () => window.clearTimeout(timeout);
  }, [message]);
  const patch = (next: Partial<CompanyState>) =>
    setState((current) => ({ ...current, ...next }));
  const focus = (selector: string) =>
    requestAnimationFrame(() =>
      root.current
        ?.querySelector<HTMLElement>(selector)
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
  const goSettings = () =>
    patch({ page: 'settings', tour: state.saved ? 'complete' : 'tab' });
  const openCompany = () => {
    patch({
      page: 'settings',
      tour: state.saved ? 'complete' : companyReady(state) ? 'save' : 'details',
    });
    requestAnimationFrame(() =>
      root.current
        ?.querySelector('[data-company-profile]')
        ?.scrollIntoView({ block: 'start', behavior: 'instant' }),
    );
  };
  const fill = (name: CompanyField) => {
    setState((current) => {
      const next = {
        ...current,
        filled: COMPANY_FIELD_NAMES.filter(
          (key) => key === name || current.filled.includes(key),
        ),
      };
      if (!current.saved) next.tour = companyReady(next) ? 'save' : 'details';
      return next;
    });
    if (name === 'brandName') setBrandError(false);
  };
  const attach = (logo: boolean) => {
    setState((current) => {
      const next = { ...current, logo, saved: logo && current.saved };
      next.tour = next.saved
        ? 'complete'
        : companyReady(next)
          ? 'save'
          : 'details';
      return next;
    });
    if (!logo) focus('[data-tour-target="company-logo"]');
  };
  const save = () => {
    if (!state.filled.includes('brandName')) {
      setBrandError(true);
      requestAnimationFrame(() =>
        root.current?.querySelector<HTMLElement>('#company-brandName')?.focus(),
      );
      return;
    }
    const ready = companyReady(state);
    patch({ saved: ready, tour: ready ? 'complete' : 'details' });
    setMessage('Публичный профиль обновлён');
  };
  const resume = () => {
    setHelp(false);
    const tour = state.saved
      ? 'complete'
      : state.tour === 'welcome'
        ? 'navigation'
        : state.tour;
    patch({
      guiding: true,
      tour,
      page: tour === 'navigation' ? 'home' : 'settings',
    });
    focus(
      tour === 'navigation'
        ? '[data-tour-target="settings-nav"]'
        : '[data-tour-target="company-tab"]',
    );
  };
  const back = () => {
    if (state.tour === 'navigation') patch({ tour: 'welcome' });
    if (state.tour === 'tab') {
      patch({ page: 'home', tour: 'navigation' });
      focus('[data-tour-target="settings-nav"]');
    }
    if (state.tour === 'details') {
      patch({ tour: 'tab' });
      focus('[data-tour-target="company-tab"]');
    }
    if (state.tour === 'save') patch({ tour: 'details' });
  };
  const unavailable = () =>
    setMessage('Этот раздел не входит в сценарий информации о компании.');
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      if (help) dismissHelp();
      else if (state.guiding) dismissGuide();
    }
    if (event.key === 'Tab' && help) {
      const elements = [
        ...(layer.current?.querySelectorAll<HTMLElement>(
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
  const field = (name: CompanyField) => {
    const value = state.filled.includes(name) ? COMPANY_FIELDS[name] : '';
    const props = {
      id: `company-${name}`,
      name,
      readOnly: true,
      value,
      placeholder: LABELS[name],
      'aria-describedby': `company-demo-hint${name === 'brandName' ? ' company-brand-hint' : ''}${name === 'brandName' && brandError ? ' company-brand-error' : ''}`,
      'aria-invalid': name === 'brandName' && brandError,
      onClick: () => fill(name),
      onKeyDown: (
        event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          fill(name);
        }
      },
    };
    return (
      <div
        className="wo-company-field"
        data-tour-target={`company-${name}`}
        key={name}
      >
        <label htmlFor={props.id}>{LABELS[name]}</label>
        {name === 'description' ? (
          <textarea {...props} rows={4} maxLength={3000} />
        ) : (
          <input
            {...props}
            autoComplete="off"
            type={
              name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'text'
            }
          />
        )}
        {name === 'brandName' ? (
          <small id="company-brand-hint">
            Это название отображается в карточке крупным шрифтом
          </small>
        ) : null}
        {name === 'description' ? <small>{value.length}/3000</small> : null}
        {name === 'brandName' && brandError ? (
          <small className="wo-company-error" id="company-brand-error">
            Укажите название бренда или компании
          </small>
        ) : null}
      </div>
    );
  };
  const paused =
    state.page === 'home' && !['welcome', 'navigation'].includes(state.tour);
  const firstEmpty = COMPANY_FIELD_NAMES.find(
    (name) => !state.filled.includes(name),
  );
  const detailsTarget = !state.logo
    ? 'company-logo'
    : `company-${firstEmpty ?? 'brandName'}`;
  const tours = {
    welcome: {
      target: 'settings-nav',
      step: 0,
      title: 'Представьте компанию исполнителям',
      description:
        'Добавим логотип, название и контакты в публичный профиль — эти сведения видят исполнители.',
      action: 'Начать',
      onAction: () => patch({ tour: 'navigation' }),
    },
    navigation: {
      target: 'settings-nav',
      step: 1,
      title: 'Откройте «Настройки»',
      description:
        'Нажмите «Настройки» в левом меню. Здесь хранится информация о вашей компании.',
    },
    tab: {
      target: 'company-tab',
      step: 2,
      title: 'Откройте информацию о компании',
      description:
        'Нажмите вкладку «Информация о компании» и перейдите к блоку «Публичный профиль».',
    },
    details: {
      target: detailsTarget,
      step: 3,
      title: 'Заполните публичный профиль',
      description:
        'Добавьте логотип, название бренда, описание, адрес, сайт, публичный телефон и email.',
      note: 'Демо: нажимайте на логотип и поля — данные появятся без печати и выбора файла.',
    },
    save: {
      target: 'company-save',
      step: 4,
      title: 'Сохраните информацию о компании',
      description:
        'Все сведения заполнены. Проверьте публичный профиль и нажмите «Сохранить».',
    },
    complete: {
      target: 'company-save',
      step: 4,
      title: 'Информация о компании заполнена',
      description:
        'Логотип, название и контакты сохранены в демонстрационном профиле. Сценарий завершён.',
      action: 'Готово',
      onAction: () => {
        patch({ guiding: false });
        setHelp(true);
      },
    },
  };
  const progress = {
    topUpComplete: loadTopUpProgress().invoice.prepared,
    tariffComplete: loadTariffProgress().submitted,
    companyComplete: state.saved,
    marketplaceComplete: loadMarketplaceProgress().viewed,
  };

  return (
    <div
      className={`wo-app${collapsed ? ' is-collapsed' : ''}`}
      ref={root}
      onKeyDown={onKeyDown}
    >
      <OnboardingShell
        active={state.page === 'settings' ? 'Настройки' : undefined}
        inert={help}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        helpOpen={help}
        completedCount={Object.values(progress).filter(Boolean).length}
        helpButton={helpButton}
        onHome={() => patch({ page: 'home' })}
        onTariff={() => onSelectFlow('tariff')}
        onMarketplace={() => onSelectFlow('marketplace')}
        onSettings={goSettings}
        onHelp={() => setHelp(true)}
        onUnavailable={unavailable}
        onMessage={setMessage}
        onExit={onExit}
        onReset={onReset}
      >
        {state.page === 'home' ? (
          <OnboardingHome
            onTariff={() => onSelectFlow('tariff')}
            onHelp={() => setHelp(true)}
          />
        ) : (
          <>
            <h1 className="wo-page-title">Настройки</h1>
            <div className="wo-page-tabs">
              {[
                'Информация о компании',
                'Мои сотрудники',
                'Мои проекты',
                'Уведомления',
                'Дополнительные настройки',
              ].map((label, index) => (
                <button
                  type="button"
                  className={index === 0 ? 'is-active' : ''}
                  aria-current={index === 0 ? 'page' : undefined}
                  data-tour-target={index === 0 ? 'company-tab' : undefined}
                  key={label}
                  onClick={index === 0 ? openCompany : unavailable}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="wo-company-settings">
              <section className="wo-company-card wo-company-legal">
                <h2>Юридические данные</h2>
                <dl>
                  {[
                    ['Юридическое лицо', 'ООО «Север Логистика»'],
                    ['ИНН', '0000000000'],
                    ['ОГРН/ ОГРНИП', '0000000000000'],
                    ['Телефон (для операций)', '+7 (000) 123-45-67'],
                    ['Email (для уведомлений)', 'anna@sever-logistics.example'],
                  ].map(([name, value], index) => (
                    <div key={name}>
                      <dt>{name}</dt>
                      <dd>
                        {value}
                        {index > 2 ? (
                          <button type="button" onClick={unavailable}>
                            Изменить
                            <Pencil size={20} />
                          </button>
                        ) : null}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
              <form
                className="wo-company-card wo-company-profile"
                data-company-profile
                data-tour-target="company-profile"
                noValidate
                onSubmit={(event) => {
                  event.preventDefault();
                  save();
                }}
              >
                <header>
                  <h2>Публичный профиль</h2>
                  <span>Видят исполнители</span>
                </header>
                <div className="wo-company-brand-row">
                  <div className="wo-company-logo-wrap">
                    <button
                      className={`wo-company-logo${state.logo ? ' is-filled' : ''}`}
                      data-tour-target="company-logo"
                      type="button"
                      aria-label={
                        state.logo ? 'Заменить логотип' : 'Добавить логотип'
                      }
                      aria-describedby="company-demo-hint"
                      onClick={() => attach(true)}
                    >
                      <img
                        src={state.logo ? demoLogo : emptyLogo}
                        alt={state.logo ? 'Логотип демо-компании' : ''}
                      />
                      <span>
                        {state.logo ? <Pencil size={32} /> : <Plus size={32} />}
                      </span>
                    </button>
                    {state.logo ? (
                      <button
                        className="wo-company-remove"
                        type="button"
                        aria-label="Удалить логотип"
                        onClick={() => attach(false)}
                      >
                        <Trash2 size={14} />
                      </button>
                    ) : null}
                  </div>
                  {field('brandName')}
                </div>
                {field('description')}
                {field('address')}
                {field('website')}
                <div className="wo-company-contact-row">
                  {field('phone')}
                  {field('email')}
                </div>
                <button
                  className="wo-primary wo-company-save"
                  data-tour-target="company-save"
                  type="submit"
                >
                  Сохранить
                </button>
              </form>
              <p className="wo-company-demo-hint" id="company-demo-hint">
                Демо: логотип и каждое поле заполняются по клику или Enter /
                Пробел. Чтобы завершить сценарий, заполните весь профиль и
                сохраните.
              </p>
              <section className="wo-company-card wo-company-reviews">
                <h2>Отзывы о вашей компании</h2>
                <p>У компании пока нет отзывов</p>
              </section>
            </div>
          </>
        )}
      </OnboardingShell>
      {help ? (
        <div className="wo-layer" ref={layer}>
          <div aria-hidden="true" className="wo-scrim" onClick={dismissHelp} />
          <OnboardingHelp
            {...progress}

            onTopUp={() => onSelectFlow('topup')}
            closeButton={closeHelp}
            onClose={dismissHelp}

            onTariff={() => onSelectFlow('tariff')}
            onCompany={resume}

            onMarketplace={() => onSelectFlow('marketplace')}
            onReset={onReset}
          />
        </div>
      ) : null}
      {state.guiding && !help && !paused ? (
        <OnboardingTour
          root={root}
          flowName="Информация о компании"
          avoidTarget={
            ['details', 'save', 'complete'].includes(state.tour)
              ? 'company-profile'
              : undefined
          }
          {...tours[state.tour]}
          onBack={
            state.tour !== 'welcome' && state.tour !== 'complete'
              ? back
              : undefined
          }
          onClose={dismissGuide}
        />
      ) : null}
      {state.guiding && paused && !help ? (
        <div className="wo-paused" role="status">
          <strong>Сценарий на паузе</strong>
          <p>Вернитесь к профилю компании, чтобы продолжить заполнение.</p>
          <button type="button" onClick={resume}>
            Продолжить
          </button>
          <button
            type="button"
            aria-label="Закрыть подсказки"
            onClick={dismissGuide}
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
