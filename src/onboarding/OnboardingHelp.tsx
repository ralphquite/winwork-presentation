import { Check, ChevronRight, RotateCcw, X } from 'lucide-react';
import type { RefObject } from 'react';

export function OnboardingHelp({
  closeButton,
  onClose,
  tariffComplete,
  companyComplete,
  topUpComplete,
  marketplaceComplete,
  onTariff,
  onCompany,
  onTopUp,
  onMarketplace,
  onReset,
}: {
  closeButton: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  tariffComplete: boolean;
  companyComplete: boolean;
  topUpComplete: boolean;
  marketplaceComplete: boolean;
  onTariff: () => void;
  onCompany: () => void;
  onTopUp: () => void;
  onMarketplace: () => void;
  onReset: () => void;
}) {
  const completed =
    Number(tariffComplete) +
    Number(topUpComplete) +
    Number(companyComplete) +
    Number(marketplaceComplete);
  return (
    <aside
      aria-labelledby="wo-help-title"
      aria-modal="true"
      className="wo-drawer wo-help-panel"
      role="dialog"
    >
      <header>
        <h2 id="wo-help-title">Первые шаги</h2>
        <button
          aria-label="Закрыть помощь"
          onClick={onClose}
          ref={closeButton}
          type="button"
        >
          <X size={22} />
        </button>
      </header>
      <p className="wo-help-intro">
        Подготовьте компанию к работе в WinWork. Выберите задачу — подскажем,
        что делать.
      </p>
      <div className="wo-help-progress">
        <span>{completed} из 4 доступных сценариев пройдено</span>
        <div>
          <i style={{ width: `${(completed / 4) * 100}%` }} />
        </div>
      </div>
      {[
        {
          name: 'Снижение комиссии',
          complete: tariffComplete,
          onClick: onTariff,
          detail: 'Проверка представителя компании · 4 шага',
          result: 'Заявка отправлена · ожидается проверка',
        },
        {
          name: 'Пополнение счёта',
          complete: topUpComplete,
          onClick: onTopUp,
          detail: 'Реквизиты и готовый счёт для оплаты · 4 шага',
          result: 'Счёт сформирован · оплата в банке',
        },
        {
          name: 'Информация о компании',
          complete: companyComplete,
          onClick: onCompany,
          detail: 'Логотип, название и контакты · 4 шага',
          result: 'Публичный профиль заполнен',
        },
        {
          name: 'Первое задание на маркетплейсе',
          complete: marketplaceComplete,
          onClick: onMarketplace,
          detail: 'Создание задания и просмотр откликов · 5 шагов',
          result: 'Задание создано и просмотрено',
        },
      ].map((flow, index) => (
        <button
          className={`wo-help-flow${flow.complete ? ' is-complete' : ''}`}
          onClick={flow.onClick}
          key={flow.name}
          type="button"
        >
          <span className="wo-help-flow-icon">
            {flow.complete ? <Check size={20} /> : index + 1}
          </span>
          <span>
            <strong>{flow.name}</strong>
            <small>{flow.complete ? flow.result : flow.detail}</small>
            <em>
              {flow.complete ? 'Посмотреть результат' : 'Начать / продолжить'}
            </em>
          </span>
          <ChevronRight size={20} />
        </button>
      ))}
      <p className="wo-help-footnote">
        Подсказки можно закрыть в любой момент. Прогресс сохранится, а
        продолжить можно здесь.
      </p>
      <button className="wo-help-repeat" onClick={onReset} type="button">
        <RotateCcw size={16} />
        Пройти текущий сценарий заново
      </button>
    </aside>
  );
}
