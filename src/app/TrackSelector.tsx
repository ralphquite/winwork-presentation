import {
  ArrowUpRight,
  Building2,
  ChevronDown,
  Code2,
  LogOut,
  Maximize2,
  Play,
  Store,
} from 'lucide-react';
import { useRef, useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { enterpriseDemoFlows } from '../demos/flows/enterprise';
import type {
  DemoFlowDefinition,
  DemoFlowId,
} from '../presentation/engine/types';
import { DemoFlowModal } from '../presentation/flows/DemoFlowModal';

const tracks = [
  {
    description:
      'Полный маршрут из 19 слайдов, перенесённых из утверждённого Pencil-макета.',
    icon: Building2,
    label: 'Готово к показу',
    path: '/enterprise',
    title: 'Крупный бизнес',
  },
  {
    description:
      'Полный маршрут из 14 слайдов для работы через кабинет малого бизнеса.',
    icon: Store,
    label: 'Готово к показу',
    path: '/small',
    title: 'Малый бизнес',
  },
  {
    description:
      'Отдельный маршрут для подключения WinWork как инфраструктурного слоя.',
    icon: Code2,
    label: 'Технический маршрут',
    path: '/api',
    title: 'API / Embedded',
  },
] as const;

const demoFlows: readonly DemoFlowDefinition[] =
  Object.values(enterpriseDemoFlows);

const demoFlowSteps = {
  'create-object': 'Список объектов → пустая форма → заполненная форма',
  'manager-app': 'Вход → заказы → исполнитель → оплата → настройки → чаты',
  'create-activity': 'Пакеты документов → добавление вида деятельности',
  'document-templates': 'Шторка → выбор договора или акта → редактор',
  'single-task': 'Маркетплейс → меню → форма задания → результат',
} as const satisfies Record<DemoFlowId, string>;

export function TrackSelector() {
  const navigate = useNavigate();
  const demoTriggerRef = useRef<HTMLButtonElement>(null);
  const [isDemoPanelOpen, setIsDemoPanelOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState<DemoFlowDefinition>(
    enterpriseDemoFlows.createObject,
  );

  const startPresentation = (path: string) => {
    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen().catch(() => undefined);
    }

    void navigate(path);
  };

  const openDemo = (
    flow: DemoFlowDefinition,
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    demoTriggerRef.current = event.currentTarget;
    setSelectedFlow(flow);
    setIsDemoOpen(true);
  };

  return (
    <main className="track-selector-shell">
      <div className="track-selector-orb track-selector-orb-blue" />
      <div className="track-selector-orb track-selector-orb-green" />

      <section className="track-selector-content">
        <header className="track-selector-topbar">
          <img
            alt="WinWork"
            className="track-selector-brand"
            src="/winwork-logo.svg"
          />
          <form action="/auth/logout" method="post">
            <button className="track-selector-logout" type="submit">
              <LogOut aria-hidden="true" size={17} />
              Выйти
            </button>
          </form>
        </header>

        <div className="track-selector-heading">
          <p>GUIDED SALES DEMO</p>
          <h1>Выберите презентацию</h1>
          <span>
            Каждый маршрут открывается как полноэкранный показ. Используйте
            стрелки клавиатуры для навигации.
          </span>
        </div>

        <div className="track-selector-grid">
          {tracks.map((track) => {
            const Icon = track.icon;

            return (
              <button
                className="track-selector-card"
                key={track.path}
                onClick={() => startPresentation(track.path)}
                type="button"
              >
                <span className="track-selector-card-topline">
                  <span className="track-selector-icon">
                    <Icon aria-hidden="true" size={28} strokeWidth={1.8} />
                  </span>
                  <span className="track-selector-status">{track.label}</span>
                </span>
                <strong>{track.title}</strong>
                <span className="track-selector-description">
                  {track.description}
                </span>
                <span className="track-selector-action">
                  Начать показ
                  <ArrowUpRight aria-hidden="true" size={19} />
                </span>
              </button>
            );
          })}
        </div>

        <p className="track-selector-fullscreen-note">
          <Maximize2 aria-hidden="true" size={16} />F — полноэкранный режим ·
          Esc — выход
        </p>

        <section
          className={`demo-quick-access${isDemoPanelOpen ? ' is-open' : ''}`}
          aria-labelledby="demo-quick-title"
        >
          <header className="demo-quick-access-heading">
            <div>
              <span>ВРЕМЕННО · QA</span>
              <h2 id="demo-quick-title">Быстрый тест интерактивных флоу</h2>
            </div>
            <p>
              Откройте любое демо напрямую, без перехода к связанному слайду
              презентации.
            </p>
            <button
              aria-controls="demo-quick-access-grid"
              aria-expanded={isDemoPanelOpen}
              className="demo-quick-access-toggle"
              onClick={() => setIsDemoPanelOpen((isOpen) => !isOpen)}
              type="button"
            >
              {isDemoPanelOpen ? 'Свернуть' : 'Показать флоу'}
              <ChevronDown aria-hidden="true" size={18} />
            </button>
          </header>

          {isDemoPanelOpen ? (
            <div className="demo-quick-access-grid" id="demo-quick-access-grid">
              {demoFlows.map((flow, index) => (
                <button
                  className="demo-quick-access-card"
                  key={flow.id}
                  onClick={(event) => openDemo(flow, event)}
                  type="button"
                >
                  <span className="demo-quick-access-index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="demo-quick-access-copy">
                    <strong>{flow.title}</strong>
                    <small>{demoFlowSteps[flow.id]}</small>
                  </span>
                  <Play aria-hidden="true" fill="currentColor" size={18} />
                </button>
              ))}
            </div>
          ) : null}
        </section>
      </section>

      <DemoFlowModal
        flow={selectedFlow}
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        triggerRef={demoTriggerRef}
      />
    </main>
  );
}
