import { useId, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

import balanceIcon from '../assets/contracting/desktop/balance.svg?inline';
import chevronIcon from '../assets/contracting/desktop/chevron.svg?inline';
import exitIcon from '../assets/contracting/desktop/exit.svg?inline';
import logoMark from '../assets/contracting/desktop/logo-mark.svg?inline';
import logoWord from '../assets/contracting/desktop/logo-word.svg?inline';
import branchActiveIcon from '../assets/contracting/desktop/nav-branch-active.svg?inline';
import branchIcon from '../assets/contracting/desktop/nav-branch.svg?inline';
import checksIcon from '../assets/contracting/desktop/nav-checks.svg?inline';
import navChevronIcon from '../assets/contracting/desktop/nav-chevron.svg?inline';
import contractingIcon from '../assets/contracting/desktop/nav-contracting.svg?inline';
import documentsIcon from '../assets/contracting/desktop/nav-documents.svg?inline';
import helpIcon from '../assets/contracting/desktop/nav-help.svg?inline';
import marketplaceIcon from '../assets/contracting/desktop/nav-marketplace.svg?inline';
import offersIcon from '../assets/contracting/desktop/nav-offers.svg?inline';
import paymentsIcon from '../assets/contracting/desktop/nav-payments.svg?inline';
import reportsIcon from '../assets/contracting/desktop/nav-reports.svg?inline';
import settingsIcon from '../assets/contracting/desktop/nav-settings.svg?inline';
import tariffIcon from '../assets/contracting/desktop/nav-tariff.svg?inline';
import usersIcon from '../assets/contracting/desktop/nav-users.svg?inline';
import notificationsIcon from '../assets/contracting/desktop/notifications.svg?inline';
import collapseIcon from '../assets/contracting/desktop/sidebar-collapse.svg?inline';
import trainingIcon from '../assets/contracting/desktop/training.svg?inline';
import { DesktopShell } from '../presentation/flows/ProductUI';
import { companies, type DesktopRole } from './fixtures';

import '../styles/contracting-desktop.css';

type ContractingSection =
  'partners' | 'clients' | 'marketplace' | 'orders' | 'performers' | 'reports';

type ReportNavigation = {
  partners: string;
  clients: string;
  orders: string;
  reports: string;
};

const navItems = [
  ['Мои исполнители', usersIcon],
  ['Маркетплейс', marketplaceIcon],
  ['Платежи', paymentsIcon],
  ['Чеки', checksIcon],
  ['Документооборот', documentsIcon],
  ['Отчёты', reportsIcon],
  ['Настройки', settingsIcon],
  ['Мой тариф', tariffIcon],
] as const;

function ContractingHeader({ role }: { role: DesktopRole }) {
  const company = companies[role];
  return (
    <div className="ww-contracting-account">
      <span className="ww-contracting-balance">
        <img alt="" src={balanceIcon} />
        {company.balance}
      </span>
      <div className="ww-contracting-account-actions">
        <img alt="Уведомления" src={notificationsIcon} />
        <span className="ww-contracting-account-item is-training">
          <img alt="Обучение" src={trainingIcon} />
        </span>
        <span className="ww-contracting-account-item">
          {company.account} <img alt="" src={chevronIcon} />
        </span>
        <span className="ww-contracting-account-item">
          {company.name} <img alt="" src={chevronIcon} />
        </span>
        <img alt="Выйти" src={exitIcon} />
      </div>
    </div>
  );
}

function ContractingSidebar({
  section,
  contractorNavigationExpanded,
  navigation,
}: {
  section: ContractingSection;
  contractorNavigationExpanded: boolean;
  navigation?: ReportNavigation;
}) {
  const contractingGroup = useId();
  const contractorGroup = useId();
  const [contractingOpen, setContractingOpen] = useState(
    section !== 'marketplace' && section !== 'performers',
  );
  const [contractorOpen, setContractorOpen] = useState(
    contractorNavigationExpanded,
  );
  const contractorMode =
    section === 'clients' ||
    section === 'orders' ||
    (section === 'reports' && contractorNavigationExpanded);

  function child(label: string, target: keyof ReportNavigation) {
    const active = section === target;
    const content = (
      <>
        <img alt="" src={active ? branchActiveIcon : branchIcon} />
        <span>{label}</span>
      </>
    );
    const props = {
      'aria-current': active ? ('page' as const) : undefined,
      className: 'ww-contracting-nav-child',
    };
    return navigation ? (
      <Link {...props} to={navigation[target]}>
        {content}
      </Link>
    ) : (
      <div {...props}>{content}</div>
    );
  }

  return (
    <>
      <div className="ww-contracting-sidebar-head">
        <div
          aria-label="WinWork"
          className="ww-contracting-wordmark"
          role="img"
        >
          <img alt="" src={logoMark} />
          <img alt="" src={logoWord} />
        </div>
        <img alt="" src={collapseIcon} />
      </div>
      <nav aria-label="Навигация WinWork" className="ww-contracting-navigation">
        {navItems.map(([label, icon], index) => (
          <div
            aria-current={
              (section === 'marketplace' && label === 'Маркетплейс') ||
              (section === 'performers' && label === 'Мои исполнители')
                ? 'page'
                : undefined
            }
            className="ww-contracting-nav-row"
            key={label}
          >
            <img alt="" src={icon} />
            <span>{label}</span>
            <img
              alt=""
              className={index >= 6 ? 'is-up' : undefined}
              src={navChevronIcon}
            />
          </div>
        ))}
        <button
          aria-controls={contractingGroup}
          aria-expanded={contractingOpen}
          className="ww-contracting-nav-row"
          data-active={section !== 'marketplace' && section !== 'performers'}
          onClick={() => setContractingOpen((open) => !open)}
          type="button"
        >
          <img alt="" src={contractingIcon} />
          <span>Подрядная схема</span>
          <img
            alt=""
            className={contractingOpen ? 'is-up' : undefined}
            src={navChevronIcon}
          />
        </button>
        <div hidden={!contractingOpen} id={contractingGroup}>
          {child('Мои подрядчики', 'partners')}
          {navigation && !contractorMode ? (
            <div className="ww-contracting-nav-children">
              {child('Отчёты', 'reports')}
            </div>
          ) : null}
          <button
            aria-controls={contractorGroup}
            aria-expanded={contractorOpen}
            className="ww-contracting-nav-child"
            data-active={contractorMode}
            onClick={() => setContractorOpen((open) => !open)}
            type="button"
          >
            <img alt="" src={contractorMode ? branchActiveIcon : branchIcon} />
            <span>Работа в режиме подрядчика</span>
          </button>
          <div
            className="ww-contracting-nav-children"
            hidden={!contractorOpen}
            id={contractorGroup}
          >
            {child('Клиенты', 'clients')}
            {child('Задания клиентов', 'orders')}
            {navigation && contractorMode ? child('Отчёты', 'reports') : null}
          </div>
        </div>
        <div className="ww-contracting-nav-utilities">
          <div className="ww-contracting-nav-row">
            <img alt="" src={helpIcon} /> <span>Помощь</span>
          </div>
          <div className="ww-contracting-nav-row">
            <img alt="" src={offersIcon} /> <span>Спецпредложения</span>
          </div>
        </div>
      </nav>
    </>
  );
}

export function ContractingShell({
  role,
  section,
  children,
  overlay,
  navigation,
  contractorNavigationExpanded = section === 'clients' || section === 'orders',
}: {
  role: DesktopRole;
  section: ContractingSection;
  children: ReactNode;
  overlay?: ReactNode;
  navigation?: ReportNavigation;
  contractorNavigationExpanded?: boolean;
}) {
  return (
    <div className="ww-contracting-viewport">
      <div className="ww-contracting-canvas">
        <DesktopShell
          className="ww-contracting-desktop"
          contentAs="div"
          headerContent={<ContractingHeader role={role} />}
          overlay={overlay}
          sidebarContent={
            <ContractingSidebar
              contractorNavigationExpanded={contractorNavigationExpanded}
              navigation={navigation}
              section={section}
            />
          }
        >
          {children}
        </DesktopShell>
      </div>
    </div>
  );
}

export function ContractingSectionHeader({
  section,
  showModeTabs = section !== 'partners',
}: {
  section: Exclude<ContractingSection, 'marketplace' | 'performers'>;
  showModeTabs?: boolean;
}) {
  return (
    <header className="ww-contracting-section-header">
      <h1>Подрядная схема</h1>
      <div className="ww-contracting-section-tabs">
        <span aria-current={section === 'partners' ? 'page' : undefined}>
          Мои подрядчики
        </span>
        <span aria-current={section !== 'partners' ? 'page' : undefined}>
          Работа в режиме подрядчика
        </span>
      </div>
      {showModeTabs ? (
        <div className="ww-contracting-mode-tabs">
          <span aria-current={section === 'clients' ? 'page' : undefined}>
            Клиенты
          </span>
          <span aria-current={section === 'orders' ? 'page' : undefined}>
            Задания клиентов
          </span>
        </div>
      ) : null}
    </header>
  );
}
