import { ArrowRight, Check, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import logo from '../assets/onboarding/win-work-logo.svg';
import { TariffOnboardingDemo } from './TariffOnboardingDemo';
import { TopUpOnboardingDemo } from './TopUpOnboardingDemo';
import {
  clearTopUpProgress,
  loadTopUpProgress,
  saveTopUpProgress,
  resumeTopUp,
} from './topUpState';
import type { OnboardingFlowId as FlowId } from './onboardingTypes';
import { CompanyOnboardingDemo } from './CompanyOnboardingDemo';
import {
  clearTariffProgress,
  loadTariffProgress,
  saveTariffProgress,
} from './tariffState';
import {
  clearCompanyProgress,
  loadCompanyProgress,
  saveCompanyProgress,
} from './companyState';
import { MarketplaceOnboardingDemo } from './MarketplaceOnboardingDemo';
import {
  clearMarketplaceProgress,
  loadMarketplaceProgress,
  saveMarketplaceProgress,
  resumeMarketplace,
} from './marketplaceState';
import '../styles/onboarding.css';

function hashFlow(hashPrefix: string): FlowId | null {
  const prefix = hashPrefix ? `#${hashPrefix}#` : '#';
  const flow = window.location.hash.startsWith(prefix)
    ? window.location.hash.slice(prefix.length)
    : '';
  return flow === 'tariff' ||
    flow === 'topup' ||
    flow === 'company' ||
    flow === 'marketplace'
    ? flow
    : null;
}

export function OnboardingPrototype({
  hashPrefix = '',
  homeHref,
}: {
  hashPrefix?: string;
  homeHref?: string;
}) {
  const [open, setOpen] = useState(() => hashFlow(hashPrefix));
  const [revision, setRevision] = useState(0);
  const lastFlow = useRef<FlowId>(open ?? 'tariff');
  const cards = useRef<Partial<Record<FlowId, HTMLButtonElement | null>>>({});
  const tariff = loadTariffProgress();
  const company = loadCompanyProgress();
  const topUp = loadTopUpProgress();
  const marketplace = loadMarketplaceProgress();
  const flows = [
    {
      id: 'tariff' as const,
      title: 'Снижение комиссии',
      path: 'Главная → Мой тариф → Заявка → Отправка',
      complete: tariff.submitted,
      started: tariff.tour !== 'welcome',
      result: 'Заявка отправлена',
    },
    {
      id: 'topup' as const,
      title: 'Пополнение счёта',
      path: 'Мой тариф → Пополнение → Реквизиты → Готовый счёт',
      complete: topUp.invoice.prepared,
      started: topUp.tour !== 'welcome',
      result: 'Счёт сформирован',
    },
    {
      id: 'company' as const,
      title: 'Информация о компании',
      path: 'Главная → Настройки → Публичный профиль → Сохранение',
      complete: company.saved,
      started: company.tour !== 'welcome',
      result: 'Профиль заполнен',
    },
    {
      id: 'marketplace' as const,
      title: 'Первое задание на маркетплейсе',
      path: 'Главная → Маркетплейс → Одиночное задание → Информация и отклики',
      complete: marketplace.viewed,
      started: marketplace.tour !== 'welcome',
      result: 'Задание создано и просмотрено',
    },
  ];
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'WinWork · Онбординг';
    return () => {
      document.title = previousTitle;
    };
  }, []);
  useEffect(() => {
    const onHashChange = () => {
      const next = hashFlow(hashPrefix);
      if (next) lastFlow.current = next;
      setOpen(next);
      if (!next)
        requestAnimationFrame(() => cards.current[lastFlow.current]?.focus());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [hashPrefix]);
  const reset = (flow: FlowId) => {
    if (flow === 'tariff') clearTariffProgress();
    else if (flow === 'topup') clearTopUpProgress();
    else if (flow === 'company') clearCompanyProgress();
    else clearMarketplaceProgress();
    setRevision((value) => value + 1);
  };
  const onSelectFlow = (flow: FlowId) => {
    lastFlow.current = flow;
    window.location.assign(`#${hashPrefix ? `${hashPrefix}#` : ''}${flow}`);
  };
  const demoProps = {
    onExit: () => {
      window.location.assign(`#${hashPrefix}`);
    },
    onReset: () => reset(open ?? 'tariff'),
    onSelectFlow: (flow: FlowId) => {
      if (flow === 'tariff') {
        const progress = loadTariffProgress();
        const tour = progress.submitted
          ? 'complete'
          : progress.tour === 'welcome'
            ? 'navigation'
            : progress.tour;
        saveTariffProgress({
          ...progress,
          guiding: true,
          tour,
          page: tour === 'navigation' ? 'home' : 'tariff',
          drawer: tour === 'details' || tour === 'send',
        });
      } else if (flow === 'company') {
        const progress = loadCompanyProgress();
        const tour = progress.saved
          ? 'complete'
          : progress.tour === 'welcome'
            ? 'navigation'
            : progress.tour;
        saveCompanyProgress({
          ...progress,
          guiding: true,
          tour,
          page: tour === 'navigation' ? 'home' : 'settings',
        });
      }
      if (flow === 'topup') saveTopUpProgress(resumeTopUp(loadTopUpProgress()));
      if (flow === 'marketplace')
        saveMarketplaceProgress(resumeMarketplace(loadMarketplaceProgress()));
      onSelectFlow(flow);
    },
  };
  return (
    <div className="wo-prototype">
      {open ? (
        open === 'tariff' ? (
          <TariffOnboardingDemo key={`tariff-${revision}`} {...demoProps} />
        ) : open === 'topup' ? (
          <TopUpOnboardingDemo key={`topup-${revision}`} {...demoProps} />
        ) : open === 'marketplace' ? (
          <MarketplaceOnboardingDemo
            key={`marketplace-${revision}`}
            {...demoProps}
          />
        ) : (
          <CompanyOnboardingDemo key={`company-${revision}`} {...demoProps} />
        )
      ) : (
        <main className="wo-catalog">
          <header>
            <img alt="WinWork" src={logo} />
            {homeHref ? (
              <a className="wo-catalog-reset" href={homeHref}>
                К выбору презентаций
              </a>
            ) : (
              <span>Офлайн-прототип</span>
            )}
          </header>
          <div className="wo-catalog-heading">
            <p>ОНБОРДИНГ НОВОГО ПОЛЬЗОВАТЕЛЯ</p>
            <h1>Первые шаги в WinWork</h1>
            <p>
              Откройте сценарий и пройдите его в интерфейсе с интерактивными
              подсказками.
            </p>
          </div>
          <div
            aria-label="Список сценариев онбординга"
            className="wo-catalog-list"
          >
            {flows.map((flow, index) => (
              <article
                className="wo-catalog-card"
                aria-label={flow.title}
                key={flow.id}
              >
                <button
                  className="wo-catalog-flow"
                  aria-label={`Открыть сценарий: ${flow.title}`}
                  onClick={() => onSelectFlow(flow.id)}
                  ref={(el) => {
                    cards.current[flow.id] = el;
                  }}
                  type="button"
                >
                  <span className="wo-catalog-number">
                    {flow.complete ? (
                      <Check size={24} />
                    ) : (
                      String(index + 1).padStart(2, '0')
                    )}
                  </span>
                  <span>
                    <strong>{flow.title}</strong>
                    <small>{flow.path}</small>
                    <span className="wo-catalog-meta">
                      {flow.id === 'marketplace' ? '5 шагов' : '4 шага'} ·{' '}
                      {flow.complete
                        ? flow.result
                        : flow.started
                          ? 'Есть сохранённый прогресс'
                          : 'Готов к прохождению'}
                    </span>
                  </span>
                  <ArrowRight size={24} />
                </button>
                <footer>
                  <button
                    className="wo-catalog-reset"
                    aria-label={`Сбросить: ${flow.title}`}
                    onClick={() => reset(flow.id)}
                    type="button"
                  >
                    <RotateCcw size={15} /> Сбросить флоу
                  </button>
                </footer>
              </article>
            ))}
          </div>
          <footer>
            <p>
              Все данные вымышлены. Заявки и файлы никуда не отправляются.
              <br />
              Можно проходить без подсказок, возвращаться к обучению и начинать
              заново.
            </p>
          </footer>
        </main>
      )}
    </div>
  );
}
