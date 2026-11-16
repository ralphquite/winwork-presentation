import {
  ChevronDown,
  ChevronRight,
  CircleHelp,
  MessageSquare,
  RotateCcw,
} from 'lucide-react';
import { type ReactNode, type RefObject } from 'react';
import logo from '../assets/onboarding/win-work-logo.svg';
import usersIcon from '../assets/onboarding/icon-users.svg';
import searchIcon from '../assets/onboarding/icon-search.svg';
import paymentsIcon from '../assets/onboarding/icon-rouble.svg';
import receiptsIcon from '../assets/onboarding/icon-bill.svg';
import documentsIcon from '../assets/onboarding/icon-documents.svg';
import reportsIcon from '../assets/onboarding/icon-reports.svg';
import settingsIcon from '../assets/onboarding/account-settings.svg';
import tariffIcon from '../assets/onboarding/account_balance_wallet.svg';
import helpIcon from '../assets/onboarding/icon-help.svg';
import offersIcon from '../assets/onboarding/icon-specials.svg';
import collapseIcon from '../assets/onboarding/icon-collapse.svg';
import walletIcon from '../assets/onboarding/icon-wallet.svg';
import bellIcon from '../assets/onboarding/icon-bell.svg';
import logoutIcon from '../assets/onboarding/my-smz-icon-logout.svg';
const NAV_ITEMS = [
  ['Мои исполнители', usersIcon],
  ['Маркетплейс', searchIcon],
  ['Платежи', paymentsIcon],
  ['Чеки', receiptsIcon],
  ['Документооборот', documentsIcon],
  ['Отчёты', reportsIcon],
  ['Настройки', settingsIcon],
  ['Мой тариф', tariffIcon],
  ['Помощь', helpIcon],
  ['Спецпредложения', offersIcon],
  ['Свернуть меню', collapseIcon],
] as const;

export function OnboardingHome({
  onTariff,
  onHelp,
}: {
  onTariff: () => void;
  onHelp: () => void;
}) {
  return (
    <section className="wo-home-card">
      <div className="wo-home-intro">
        <h1>Здравствуйте!</h1>
        <p>
          Здесь собрана основная информация по сервису — с чего начать, как
          платить, как получить документы.
        </p>
        <p>
          Если у вас остались вопросы, напишите их в{' '}
          <button className="wo-text-link" onClick={onHelp} type="button">
            наш чат поддержки.
          </button>
        </p>
        <div className="wo-home-topics">
          {[
            'С чего начать',
            'Как подключить или найти исполнителей',
            'Как заплатить исполнителям и получить чеки',
            'Как подписать электронные документы с исполнителями',
            'Проверка на риски переквалификации',
          ].map((item, index) => (
            <button
              className={index === 0 ? 'is-active' : ''}
              key={item}
              onClick={index === 0 ? undefined : onHelp}
              type="button"
            >
              {item}
              <ChevronRight size={20} />
            </button>
          ))}
        </div>
      </div>
      <div className="wo-home-start">
        <h2>С чего начать</h2>
        <p>Чтобы пользоваться всеми возможностями сервиса:</p>
        <ol>
          <li>
            <span>1</span>
            <div>Ознакомьтесь с договором (офертой)</div>
          </li>
          <li>
            <span>2</span>
            <div>
              Пополните счёт на сумму первой выплаты
              <br />с учётом комиссии. В назначении платежа
              <br />
              обязательно укажите: «Пополнение счета в<br />
              порядке акцепта публичной оферты сервиса
              <br />
              WinWork <span className="wo-text-link">biz.winwork.pro</span> НДС
              не облагается.»
            </div>
          </li>
          <li>
            <span>3</span>
            <div>
              Дождитесь зачисления денег (в будни
              <br />в течение часа или быстрее)
            </div>
          </li>
          <li>
            <span>4</span>
            <div>
              Готово! Вам доступны все возможности
              <br />
              сервиса
            </div>
          </li>
        </ol>
        <div className="wo-home-actions">
          <button className="wo-primary" onClick={onTariff} type="button">
            Пополнить счет
          </button>
          <button className="wo-plain-link" onClick={onHelp} type="button">
            Договор (оферта)
          </button>
          <button className="wo-plain-link" onClick={onTariff} type="button">
            Тарифы
          </button>
        </div>
      </div>
    </section>
  );
}

export function OnboardingShell({
  children,
  active,
  inert,
  collapsed,
  setCollapsed,
  helpOpen,
  completedCount,
  helpButton,
  onHome,
  onTariff,
  onSettings,
  onMarketplace,
  companyOnly = false,
  onHelp,
  onUnavailable,
  onMessage,
  onExit,
  onReset,
}: {
  children: ReactNode;
  active?: string;
  inert: boolean;
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  helpOpen: boolean;
  completedCount: number;
  helpButton: RefObject<HTMLButtonElement | null>;
  onHome: () => void;
  onTariff: () => void;
  onSettings: () => void;
  onMarketplace: () => void;
  companyOnly?: boolean;
  onHelp: () => void;
  onUnavailable: () => void;
  onMessage: (message: string) => void;
  onExit: () => void;
  onReset: () => void;
}) {
  return (
    <div className="wo-shell" inert={inert}>
      <aside aria-label="Навигация WinWork" className="wo-sidebar">
        <button
          aria-label="Главная WinWork"
          className="wo-logo"
          onClick={() => {
            onHome();
          }}
          type="button"
        >
          <img alt="WinWork" src={logo} />
        </button>
        <nav>
          {NAV_ITEMS.filter(([label]) => !companyOnly || label !== 'Чеки').map(
            ([label, icon]) => (
              <button
                aria-current={active === label ? 'page' : undefined}
                aria-label={collapsed ? label : undefined}
                className={`${active === label ? 'is-active ' : ''}${label === 'Помощь' || label === 'Свернуть меню' ? 'has-divider' : ''}`}
                data-tour-target={
                  label === 'Мой тариф'
                    ? 'tariff-nav'
                    : label === 'Настройки'
                      ? 'settings-nav'
                      : label === 'Маркетплейс'
                        ? 'marketplace-nav'
                        : undefined
                }
                key={label}
                onClick={
                  label === 'Мой тариф'
                    ? onTariff
                    : label === 'Настройки'
                      ? onSettings
                      : label === 'Маркетплейс'
                        ? onMarketplace
                        : label === 'Помощь'
                          ? onHelp
                          : label === 'Свернуть меню'
                            ? () => setCollapsed(!collapsed)
                            : onUnavailable
                }
                type="button"
              >
                <img alt="" src={icon} />
                <span>{label}</span>
              </button>
            ),
          )}
        </nav>
      </aside>
      <div className="wo-main-scroll">
        <div className="wo-main">
          <header className="wo-header">
            <div className="wo-balances">
              <img alt="" src={walletIcon} />
              <div>
                <div>
                  0,00 ₽ <span>– общий баланс юр. лица</span>
                </div>
                {!companyOnly ? (
                  <div>
                    0,00 ₽ <span>– баланс проекта</span>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="wo-account">
              <button
                aria-label="Уведомления"
                className="wo-header-icon"
                onClick={() => onMessage('Новых уведомлений нет')}
                type="button"
              >
                <img alt="" src={bellIcon} />
              </button>
              <button
                aria-label={`Обучение — ${completedCount} из 4 сценариев`}
                aria-haspopup="dialog"
                aria-expanded={helpOpen}
                className="wo-help-trigger"
                data-tour-target="help"
                onClick={onHelp}
                ref={helpButton}
                type="button"
              >
                <CircleHelp aria-hidden="true" size={18} />
                <span>
                  <strong>Обучение</strong>
                  <small>{completedCount} из 4</small>
                </span>
              </button>
              {!companyOnly ? (
                <button
                  className="wo-account-select"
                  onClick={() => onMessage('Выбран проект «Основной проект»')}
                  type="button"
                >
                  Основной проект
                  <ChevronDown size={16} />
                </button>
              ) : null}
              <button
                className="wo-account-select"
                onClick={() =>
                  onMessage('Выбрана демо-компания «Север Логистика»')
                }
                type="button"
              >
                ООО «Север Логистика»
                <ChevronDown size={16} />
              </button>
              <button
                aria-label="Выйти к списку сценариев"
                className="wo-header-icon"
                onClick={onExit}
                type="button"
              >
                <img alt="" src={logoutIcon} />
              </button>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </div>
      <button
        aria-label="Открыть помощь"
        className="wo-chat"
        onClick={onHelp}
        type="button"
      >
        <MessageSquare size={23} />
      </button>
      <div className="wo-prototype-tools">
        <span>ДЕМО · ВЫМЫШЛЕННЫЕ ДАННЫЕ</span>
        <div>
          <button onClick={onExit} type="button">
            К списку флоу
          </button>
          <button
            aria-label="Сбросить прототип"
            onClick={onReset}
            type="button"
          >
            <RotateCcw size={14} />
            Сбросить
          </button>
        </div>
      </div>
    </div>
  );
}
