import type { OnboardingFlowId } from './onboardingTypes';
import { loadTopUpProgress } from './topUpState';
import {
  CalendarDays,
  ChevronDown,
  Download,
  Eye,
  Search,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { OnboardingHome, OnboardingShell } from './OnboardingShell';
import { OnboardingHelp } from './OnboardingHelp';
import { OnboardingTour } from './OnboardingTour';
import { MarketplaceTaskForm } from './MarketplaceTaskForm';
import { loadTariffProgress } from './tariffState';
import { loadCompanyProgress } from './companyState';
import {
  TASK_FIELDS,
  taskFieldsFor,
  taskReady,
  loadMarketplaceProgress,
  saveMarketplaceProgress,
  resumeMarketplace,
  type MarketplaceState,
  type MarketplaceTour,
} from './marketplaceState';

export function MarketplaceOnboardingDemo({
  onExit,
  onReset,
  onSelectFlow,
}: {
  onExit: () => void;
  onReset: () => void;
  onSelectFlow: (flow: OnboardingFlowId) => void;
}) {
  const [state, setState] = useState(loadMarketplaceProgress);
  const [help, setHelp] = useState(false);
  const [menu, setMenu] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [message, setMessage] = useState('');
  const [detailTab, setDetailTab] = useState('Задание');
  const [listTab, setListTab] = useState('Задания');
  const [query, setQuery] = useState('');
  const root = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const helpButton = useRef<HTMLButtonElement>(null);
  const closeHelp = useRef<HTMLButtonElement>(null);
  const closePanel = useRef<HTMLButtonElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => saveMarketplaceProgress(state), [state]);
  useEffect(() => {
    if (help) closeHelp.current?.focus();
    else if (state.panel !== 'none') closePanel.current?.focus();
  }, [help, state.panel]);
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(''), 4500);
    return () => window.clearTimeout(timer);
  }, [message]);
  const patch = (next: Partial<MarketplaceState>) =>
    setState((current) => ({ ...current, ...next }));
  const focus = (selector: string) =>
    requestAnimationFrame(() =>
      root.current
        ?.querySelector<HTMLElement>(selector)
        ?.focus({ preventScroll: true }),
    );
  const unavailable = () =>
    setMessage('Это действие не входит в сценарий первого задания.');
  const dismissHelp = () => {
    setHelp(false);
    requestAnimationFrame(() => helpButton.current?.focus());
  };
  const dismissGuide = () => {
    patch({ guiding: false });
    if (state.panel !== 'none') closePanel.current?.focus();
    else helpButton.current?.focus();
  };
  const dismissPanel = () => {
    patch({ panel: 'none' });
    focus(
      state.created
        ? '[data-task-row-button]'
        : '[data-tour-target="task-create"]',
    );
  };
  const resume = () => {
    setHelp(false);
    setListTab('Задания');
    setQuery('');
    setDetailTab('Задание');
    setState(resumeMarketplace(state));
    focus(
      state.created
        ? '[data-tour-target="task-responses"]'
        : state.tour === 'navigation' || state.tour === 'welcome'
          ? '[data-tour-target="marketplace-nav"]'
          : '[data-tour-target="task-create"]',
    );
  };
  const goMarketplace = () => {
    setListTab('Задания');
    patch({
      page: 'marketplace',
      panel: 'none',
      tour: state.created
        ? state.viewed
          ? 'complete'
          : 'review'
        : state.tour === 'navigation' || state.tour === 'welcome'
          ? 'create'
          : state.tour,
    });
  };
  const openCreate = () => {
    setMenu(false);
    if (state.created) {
      setMessage(
        'Первое задание уже создано. Откройте его строку или сбросьте сценарий.',
      );
      return;
    }
    patch({ panel: 'create', tour: taskReady(state) ? 'save' : 'details' });
  };
  const changeForm = (next: Partial<MarketplaceState>) =>
    setState((current) => {
      const updated = { ...current, ...next };
      updated.tour = taskReady(updated) ? 'save' : 'details';
      return updated;
    });
  const create = () => {
    if (!taskReady(state) || state.created) return;
    setListTab('Задания');
    setQuery('');
    patch({ created: true, panel: 'none', tour: 'review' });
    focus('[data-task-row-button]');
  };
  const openDetail = () => {
    setDetailTab('Задание');
    patch({ panel: 'detail', viewed: true, tour: 'complete' });
  };
  const back = () => {
    const previous: Record<MarketplaceTour, Partial<MarketplaceState>> = {
      welcome: {},
      navigation: { tour: 'welcome' },
      create: { page: 'home', tour: 'navigation' },
      details: { panel: 'none', tour: 'create' },
      save: { tour: 'details' },
      review: {},
      complete: {},
    };
    patch(previous[state.tour]);
    if (state.tour === 'details') focus('[data-tour-target="task-create"]');
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      if (help) dismissHelp();
      else if (menu) {
        setMenu(false);
        menuButton.current?.focus();
      } else if (state.guiding) dismissGuide();
      else if (state.panel !== 'none') dismissPanel();
    }
    if (event.key === 'Tab' && (help || state.panel !== 'none')) {
      const scope = help ? layer.current : root.current;
      const elements = [
        ...(scope?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex="0"]',
        ) ?? []),
      ].filter((el) => el.getClientRects().length && !el.closest('[inert]'));
      const first = elements[0],
        last = elements.at(-1);
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !elements.includes(document.activeElement as HTMLElement))
      ) {
        event.preventDefault();
        last?.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !elements.includes(document.activeElement as HTMLElement))
      ) {
        event.preventDefault();
        first?.focus();
      }
    }
  };
  const firstEmpty = taskFieldsFor(state).find(
    (name) => !state.filled.includes(name),
  );
  const detailsTarget = firstEmpty
    ? `task-${firstEmpty}`
    : state.audiences.length
      ? 'task-save'
      : 'task-audience';
  const paused =
    (state.page === 'home' &&
      !['welcome', 'navigation'].includes(state.tour)) ||
    (state.page === 'marketplace' &&
      ((['details', 'save'].includes(state.tour) && state.panel !== 'create') ||
        (state.tour === 'complete' && state.panel !== 'detail') ||
        (state.tour === 'review' &&
          (listTab !== 'Задания' || Boolean(query)))));
  const tours = {
    welcome: {
      target: 'marketplace-nav',
      step: 0,
      title: 'Разместите первое задание',
      description:
        'Создадим одиночное задание, проверим его условия и покажем, где появятся отклики исполнителей.',
      action: 'Начать',
      onAction: () => patch({ tour: 'navigation' }),
    },
    navigation: {
      target: 'marketplace-nav',
      step: 1,
      title: 'Откройте «Маркетплейс»',
      description:
        'Нажмите «Маркетплейс» в левом меню, чтобы разместить задание для исполнителей.',
    },
    create: {
      target: menu ? 'task-single' : 'task-create',
      step: 2,
      title: 'Создайте одиночное задание',
      description:
        'Нажмите «Разместить задание» и выберите «Одиночное задание».',
    },
    details: {
      target: detailsTarget,
      step: 3,
      title: 'Заполните условия задания',
      description:
        'Укажите место, вид работ, вознаграждение и сроки. Добавьте описание работ, выберите исполнителей и шаблон документа.',
      note: 'Демо: каждое поле заполняется по клику или Enter / Пробел. «Добавить» открывает ещё одно наименование работ.',
    },
    save: {
      target: 'task-save',
      step: 4,
      title: 'Сохраните задание',
      description:
        'Все поля заполнены. Нажмите «Создать задание» — оно появится в таблице маркетплейса.',
    },
    review: {
      target: 'task-row',
      step: 5,
      title: 'Откройте новое задание',
      description:
        'Нажмите строку созданного задания в таблице, чтобы проверить информацию о нём.',
    },
    complete: {
      target: 'task-responses',
      step: 5,
      title: 'Теперь исполнители будут откликаться',
      description:
        'Задание создано. Здесь можно проверить его условия, а во вкладке «Отклики» будут появляться отклики исполнителей.',
      note: 'В демо отклики не поступают: сейчас их 0.',
      action: 'Готово',
      onAction: () => {
        patch({ guiding: false, panel: 'none' });
        setHelp(true);
      },
    },
  };
  const progress = {
    topUpComplete: loadTopUpProgress().invoice.prepared,
    tariffComplete: loadTariffProgress().submitted,
    companyComplete: loadCompanyProgress().saved,
    marketplaceComplete: state.viewed,
  };

  return (
    <div
      className={`wo-app wo-marketplace-app${collapsed ? ' is-collapsed' : ''}`}
      ref={root}
      onKeyDown={onKeyDown}
    >
      <OnboardingShell
        companyOnly
        active={state.page === 'marketplace' ? 'Маркетплейс' : undefined}
        inert={help || state.panel !== 'none'}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        helpOpen={help}
        completedCount={Object.values(progress).filter(Boolean).length}
        helpButton={helpButton}
        onHome={() => {
          setMenu(false);
          patch({ page: 'home', panel: 'none' });
        }}
        onTariff={() => onSelectFlow('tariff')}
        onSettings={() => onSelectFlow('company')}
        onMarketplace={goMarketplace}
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
            <h1 className="wo-page-title">Маркетплейс</h1>
            <div className="wo-marketplace-actions">
              <div className="wo-task-menu-wrap">
                <button
                  className="wo-primary"
                  data-tour-target="task-create"
                  ref={menuButton}
                  aria-expanded={menu}
                  onClick={() => setMenu(!menu)}
                  type="button"
                >
                  Разместить задание <ChevronDown size={18} />
                </button>
                {menu ? (
                  <div className="wo-task-menu">
                    <button
                      data-tour-target="task-single"
                      type="button"
                      onClick={openCreate}
                    >
                      Одиночное задание
                    </button>
                    <button type="button" onClick={unavailable}>
                      Реестр заданий
                    </button>
                  </div>
                ) : null}
              </div>
              <button
                className="wo-marketplace-outline"
                type="button"
                onClick={unavailable}
              >
                Реестр на редактирование
              </button>
            </div>
            <div className="wo-page-tabs wo-marketplace-tabs">
              {[
                'Задания',
                'Ожидают оплаты',
                'Активные задания',
                'Завершенные задания',
                'На модерации',
                'Серии заданий',
                'Архив',
              ].map((tab) => (
                <button
                  className={listTab === tab ? 'is-active' : ''}
                  key={tab}
                  type="button"
                  onClick={() => {
                    setListTab(tab);
                    setMenu(false);
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="wo-task-filters">
              <label>
                <Search size={20} />
                <input
                  aria-label="Название или номер задания"
                  placeholder="Название или номер задания"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
              <button type="button" onClick={unavailable}>
                <Search size={20} />
                ФИО или ИНН исполнителя
                <span>
                  <Search size={18} />
                </span>
              </button>
              <button
                type="button"
                onClick={() => setMessage('Показаны задания за всё время.')}
              >
                <CalendarDays size={20} />
                <span>
                  <small>Календарь</small>За все время
                </span>
              </button>
              <button
                type="button"
                onClick={() => setMessage('Показаны все статусы заданий.')}
              >
                <span>
                  <small>Статус задания</small>Все статусы
                </span>
                <ChevronDown size={18} />
              </button>
            </div>
            <div className="wo-task-table-wrap">
              <table className="wo-task-table">
                <thead>
                  <tr>
                    {[
                      '',
                      'Создан ↓',
                      'Начало',
                      'Номер задания',
                      'Исполнитель',
                      'Кол-во',
                      'Название задания',
                      'Итого',
                      'Серия',
                      'Статус',
                    ].map((label, i) => (
                      <th key={i}>{label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {state.created &&
                  listTab === 'Задания' &&
                  `${TASK_FIELDS.name} DEMO-001`
                    .toLowerCase()
                    .includes(query.toLowerCase()) ? (
                    <tr data-tour-target="task-row" onClick={openDetail}>
                      <td>
                        <input
                          type="checkbox"
                          aria-label="Выбрать задание"
                          onClick={(event) => event.stopPropagation()}
                        />
                      </td>
                      <td>21.09.2026</td>
                      <td>
                        22.09.2026
                        <br />
                        10:00
                      </td>
                      <td>DEMO-001</td>
                      <td>—</td>
                      <td>1</td>
                      <td>
                        <button
                          data-task-row-button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            openDetail();
                          }}
                        >
                          {TASK_FIELDS.name}
                        </button>
                      </td>
                      <td>1 500,00 ₽</td>
                      <td>—</td>
                      <td>
                        <span className="wo-task-status">Создан</span>
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan={10} className="wo-task-empty">
                        Задания отсутствуют
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </OnboardingShell>
      {state.panel !== 'none' || help ? (
        <div className="wo-layer" ref={layer}>
          <div
            className="wo-scrim"
            aria-hidden="true"
            onClick={help ? dismissHelp : dismissPanel}
          />
          {help ? (
            <OnboardingHelp
              {...progress}

              onTopUp={() => onSelectFlow('topup')}
              closeButton={closeHelp}
              onClose={dismissHelp}

              onTariff={() => onSelectFlow('tariff')}
              onCompany={() => onSelectFlow('company')}
              onMarketplace={resume}
              onReset={onReset}
            />
          ) : (
            <aside
              className={`wo-drawer wo-task-drawer${state.panel === 'detail' ? ' wo-task-detail' : ''}`}
              data-tour-target="task-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="task-panel-title"
            >
              <header>
                <h2 id="task-panel-title">
                  {state.panel === 'create'
                    ? 'Создать задание'
                    : TASK_FIELDS.name}
                </h2>
                <button
                  aria-label="Закрыть задание"
                  ref={closePanel}
                  type="button"
                  onClick={dismissPanel}
                >
                  <X size={22} />
                </button>
              </header>
              {state.panel === 'create' ? (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    create();
                  }}
                >
                  <MarketplaceTaskForm state={state} onChange={changeForm} />
                  <p className="wo-task-demo-hint" id="task-demo-hint">
                    Демо: нажимайте на поля — вымышленные данные появятся
                    автоматически. Заполните все видимые поля и выберите хотя бы
                    одну категорию исполнителей.
                  </p>
                  <button
                    className="wo-primary wo-task-save"
                    data-tour-target="task-save"
                    type="submit"
                    disabled={!taskReady(state)}
                  >
                    Создать задание
                  </button>
                </form>
              ) : (
                <>
                  <p className="wo-task-views">
                    <Eye size={16} />0
                  </p>
                  <div className="wo-task-meta">
                    <span>Задание от 21.09.2026</span>
                    <span className="wo-task-status">Создан</span>
                  </div>
                  <div className="wo-page-tabs wo-task-detail-tabs">
                    {['Задание', 'Отклики (0)', 'Действия', 'История'].map(
                      (tab) => (
                        <button
                          type="button"
                          key={tab}
                          data-tour-target={
                            tab === 'Отклики (0)' ? 'task-responses' : undefined
                          }
                          className={detailTab === tab ? 'is-active' : ''}
                          onClick={() =>
                            ['Задание', 'Отклики (0)'].includes(tab)
                              ? setDetailTab(tab)
                              : unavailable()
                          }
                        >
                          {tab}
                        </button>
                      ),
                    )}
                  </div>
                  {detailTab === 'Задание' ? (
                    <>
                      <h3>Информация о задании</h3>
                      <button
                        type="button"
                        className="wo-marketplace-outline wo-task-pdf"
                        onClick={() =>
                          setMessage(
                            'Скачивание PDF не входит в это демо. Условия задания доступны ниже.',
                          )
                        }
                      >
                        <Download size={20} />
                        PDF с описанием задания
                      </button>
                      <div className="wo-task-number">
                        <small>Номер задания</small>DEMO-001
                      </div>
                      <p className="wo-task-number-hint">
                        Одинаковый для заказчиков и исполнителей
                      </p>
                      <MarketplaceTaskForm
                        state={state}
                        onChange={() => {}}
                        readOnly
                      />
                    </>
                  ) : (
                    <div className="wo-task-responses-empty">
                      Откликов пока нет
                    </div>
                  )}
                </>
              )}
            </aside>
          )}
          {!help && state.guiding && !paused ? (
            <OnboardingTour
              root={root}
              flowName="Первое задание на маркетплейсе"
              totalSteps={5}
              avoidTarget="task-panel"
              {...tours[state.tour]}
              onBack={
                ['details', 'save'].includes(state.tour) ? back : undefined
              }
              onClose={dismissGuide}
            />
          ) : null}
        </div>
      ) : null}
      {state.guiding && !help && state.panel === 'none' && !paused ? (
        <OnboardingTour
          root={root}
          flowName="Первое задание на маркетплейсе"
          totalSteps={5}
          {...tours[state.tour]}
          onBack={
            ['navigation', 'create'].includes(state.tour) ? back : undefined
          }
          onClose={dismissGuide}
        />
      ) : null}
      {state.guiding && paused && !help ? (
        <div className="wo-paused" role="status">
          <strong>Сценарий на паузе</strong>
          <p>Вернитесь к заданию, чтобы продолжить.</p>
          <button type="button" onClick={resume}>
            Продолжить
          </button>
          <button
            aria-label="Закрыть подсказки"
            type="button"
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
