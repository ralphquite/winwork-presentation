import { ArrowUpRight, Building2, Code2, Maximize2, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    description: 'Отдельный маршрут для работы через кабинет малого бизнеса.',
    icon: Store,
    label: 'Технический маршрут',
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

export function TrackSelector() {
  const navigate = useNavigate();

  const startPresentation = (path: string) => {
    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen().catch(() => undefined);
    }

    void navigate(path);
  };

  return (
    <main className="track-selector-shell">
      <div className="track-selector-orb track-selector-orb-blue" />
      <div className="track-selector-orb track-selector-orb-green" />

      <section className="track-selector-content">
        <div className="track-selector-brand" aria-label="WinWork">
          <span className="track-selector-mark" aria-hidden="true">
            W
          </span>
          <span>WinWork</span>
        </div>

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
      </section>
    </main>
  );
}
