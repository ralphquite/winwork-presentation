import { CheckCircle2, FileText, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

import { ContractingShell } from '../ContractingShell';
import { initialReports, type Report, type ReportOptions } from './data';
import {
  CabinetOverview,
  ReportDetails,
  ReportList,
  type ReportListFilters,
} from './ReportViews';

import './reports.css';

const storageKey = 'winwork.contracting.reports.v1';
const defaultFilters: ReportListFilters = {
  query: '',
  type: '',
  status: '',
  party: '',
  ascending: false,
};

function loadReports(): Report[] {
  try {
    const saved = JSON.parse(
      localStorage.getItem(storageKey) ?? '[]',
    ) as Report[];
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function ContractingReports() {
  const location = useLocation();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<Report | null>(null);
  const [storageWarning, setStorageWarning] = useState(false);
  const content = useRef<HTMLElement>(null);
  const previousPath = useRef(location.pathname);
  const [customReports, setCustomReports] = useState(loadReports);
  const [roleFilters, setRoleFilters] = useState({
    customer: defaultFilters,
    contractor: defaultFilters,
  });
  const [now, setNow] = useState(Date.now);
  const [, rawRole, page, id, extra] = location.pathname.split('/');
  const role = rawRole === 'contractor' ? 'contractor' : 'customer';
  const reportsPath = `/${role}/reports`;
  const navigation = {
    partners: '/customer',
    clients: '/contractor',
    orders: '/contractor/orders',
    reports: reportsPath,
  };
  const section =
    page === 'reports'
      ? 'reports'
      : page === 'orders'
        ? 'orders'
        : role === 'customer'
          ? 'partners'
          : 'clients';
  const reports = [...customReports, ...initialReports]
    .filter((report) => report.role === role)
    .sort((a, b) => b.createdAt - a.createdAt);
  const upcoming = Math.min(
    ...customReports
      .filter((report) => report.readyAt > now)
      .map((report) => report.readyAt),
  );

  useEffect(() => {
    if (upcoming === Infinity) return;
    const timer = window.setTimeout(
      () => setNow(Date.now()),
      Math.max(0, upcoming - Date.now()) + 5,
    );
    return () => window.clearTimeout(timer);
  }, [upcoming]);

  useEffect(() => {
    if (previousPath.current === location.pathname) return;
    previousPath.current = location.pathname;
    content.current
      ?.querySelector<HTMLElement>('h2')
      ?.focus({ preventScroll: true });
    content.current?.closest('.ww-desktop-content')?.scrollTo(0, 0);
  }, [location.pathname]);

  function createReport(options: ReportOptions) {
    const createdAt = Date.now();
    const report: Report = {
      id: crypto.randomUUID(),
      role,
      options,
      createdAt,
      readyAt: createdAt + 1600,
    };
    const next = [report, ...customReports];
    setNow(createdAt);
    setNotice(report);
    void navigate(reportsPath);
    setCustomReports(next);
    setRoleFilters((current) => ({ ...current, [role]: defaultFilters }));
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      setStorageWarning(true);
    }
  }

  if (
    !rawRole ||
    !['customer', 'contractor'].includes(rawRole) ||
    (page &&
      page !== 'reports' &&
      (page !== 'orders' || role !== 'contractor')) ||
    (id && page !== 'reports') ||
    extra
  ) {
    return <Navigate replace to="/customer" />;
  }

  return (
    <div className={`ww-reports-app${id ? ' is-report-detail' : ''}`}>
      <ContractingShell
        key={role}
        role={role}
        section={section}
        contractorNavigationExpanded={role === 'contractor'}
        navigation={navigation}
      >
        <main className="ww-report-content" ref={content}>
          <header className="ww-contracting-section-header">
            <h1>Подрядная схема</h1>
            <nav
              aria-label="Режим работы"
              className="ww-contracting-section-tabs"
            >
              {(['customer', 'contractor'] as const).map((targetRole) => (
                <Link
                  key={targetRole}
                  aria-current={role === targetRole ? 'page' : undefined}
                  to={`/${targetRole}${section === 'reports' ? '/reports' : ''}`}
                >
                  {targetRole === 'customer'
                    ? 'Мои подрядчики'
                    : 'Работа в режиме подрядчика'}
                </Link>
              ))}
            </nav>

            <nav
              aria-label="Вкладки подрядной схемы"
              className="ww-contracting-mode-tabs"
            >
              <Link
                to={`/${role}`}
                aria-current={
                  section === 'partners' || section === 'clients'
                    ? 'page'
                    : undefined
                }
              >
                {role === 'customer' ? 'Подрядчики' : 'Клиенты'}
              </Link>
              {role === 'contractor' ? (
                <Link
                  to={navigation.orders}
                  aria-current={section === 'orders' ? 'page' : undefined}
                >
                  Задания клиентов
                </Link>
              ) : null}
              <Link
                to={reportsPath}
                aria-current={section === 'reports' ? 'page' : undefined}
              >
                Отчёты
              </Link>
            </nav>
          </header>

          {section === 'reports' ? (
            id ? (
              <ReportDetails
                key={id}
                report={reports.find((report) => report.id === id)}
                base={reportsPath}
                now={now}
                onCreate={createReport}
              />
            ) : (
              <ReportList
                role={role}
                reports={reports}
                base={reportsPath}
                now={now}
                onCreate={createReport}
                filters={roleFilters[role]}
                setFilters={(patch) =>
                  setRoleFilters((current) => ({
                    ...current,
                    [role]: { ...current[role], ...patch },
                  }))
                }
              />
            )
          ) : (
            <CabinetOverview
              key={role + section}
              role={role}
              orders={section === 'orders'}
              onCreate={createReport}
            />
          )}
        </main>
      </ContractingShell>
      {notice &&
      location.pathname !== `/${notice.role}/reports/${notice.id}` ? (
        <aside
          className="ww-report-notice"
          aria-label="Уведомление о формировании отчёта"
        >
          {notice.readyAt <= now ? (
            <CheckCircle2 size={22} aria-hidden="true" />
          ) : (
            <FileText size={22} aria-hidden="true" />
          )}
          <div>
            <strong role="status">
              {notice.readyAt <= now
                ? 'Отчёт готов'
                : 'Началось формирование отчёта'}
            </strong>
            <p>
              {notice.readyAt <= now
                ? 'Можно открыть таблицу или скачать XLSX.'
                : 'Вы можете продолжить работу. Сообщим, когда всё будет готово.'}
            </p>
            {notice.readyAt <= now ? (
              <Link
                to={`/${notice.role}/reports/${notice.id}`}
                onClick={() => setNotice(null)}
              >
                Открыть отчёт
              </Link>
            ) : null}
          </div>
          <button
            type="button"
            className="ww-report-icon"
            aria-label="Закрыть уведомление"
            onClick={() => setNotice(null)}
          >
            <X size={18} />
          </button>
        </aside>
      ) : null}
      {storageWarning ? (
        <p className="ww-report-storage-warning" role="status">
          Браузер не сохранил отчёт. Скачайте XLSX перед закрытием страницы.
        </p>
      ) : null}
    </div>
  );
}
