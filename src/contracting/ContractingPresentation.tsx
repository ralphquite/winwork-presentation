import { Building2, Handshake, Smartphone } from 'lucide-react';
import { useLayoutEffect, useRef } from 'react';

import {
  Presentation,
  type PresentationLayoutProps,
} from '../presentation/engine/Presentation';
import type { ContractingRole } from './fixtures';
import {
  contractingPresentation,
  contractingScenes,
  contractingStages,
} from './scenario';

const roles = [
  {
    id: 'customer',
    name: 'Заказчик',
    description: 'Публикует задание и оплачивает работу',
    icon: Building2,
  },
  {
    id: 'contractor',
    name: 'Подрядчик',
    description: 'Работает с клиентами и подписывает акты',
    icon: Handshake,
  },
  {
    id: 'performer',
    name: 'Исполнитель',
    description: 'Откликается и выполняет задание',
    icon: Smartphone,
  },
] satisfies ReadonlyArray<{
  id: ContractingRole;
  name: string;
  description: string;
  icon: typeof Building2;
}>;

const visibleRoles = roles.filter(({ id }) =>
  contractingStages.some(({ role }) => role === id),
);

const stageOptions = contractingStages.map(({ id, number, title }) => ({
  id,
  label: `${String(number).padStart(2, '0')}. ${title}`,
}));

function getContractingScenePicker(sceneId: string) {
  const stageId = contractingScenes.get(sceneId)?.stageId;
  if (!stageId) return undefined;

  return { label: 'Этап сценария', options: stageOptions, value: stageId };
}

function ContractingLayout({ children, scene }: PresentationLayoutProps) {
  const stageRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    stageRef.current
      ?.querySelector('[data-contracting-hint]')
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [scene.id]);

  const current = contractingScenes.get(scene.id);
  if (!current) throw new Error(`Unknown contracting scene: ${scene.id}`);
  const stageCount = contractingStages.length;

  return (
    <div className="ww-contracting">
      <header className="ww-contracting-header">
        <ul
          aria-label="Роли в сценарии"
          className="ww-contracting-roles"
          role="list"
        >
          {visibleRoles.map(({ id, name, description, icon: Icon }) => {
            const active = current.role === id;
            return (
              <li
                aria-current={active ? 'true' : undefined}
                data-role={id}
                key={id}
              >
                <span className="ww-contracting-role-icon">
                  <Icon aria-hidden="true" size={20} />
                </span>
                <div>
                  <strong>{name}</strong>
                  <small>{description}</small>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="ww-contracting-caption" aria-live="polite">
          <div>
            <h1>{scene.title}</h1>
            <p>{scene.description}</p>
          </div>
          <div className="ww-contracting-caption-progress">
            <span className="ww-contracting-stage-number">
              Этап {current.stageNumber} из {stageCount}
            </span>
            {current.screenCount > 1 ? (
              <span
                className="ww-contracting-substep"
                title="Состояние внутри этапа"
              >
                {current.screenNumber} / {current.screenCount}
              </span>
            ) : null}
          </div>
        </div>
      </header>

      <section
        aria-label="Экран WinWork"
        className="ww-contracting-stage"
        data-role={current.role}
        ref={stageRef}
      >
        {children}
      </section>
    </div>
  );
}

export function ContractingPresentation() {
  return (
    <Presentation
      componentLayout={ContractingLayout}
      config={contractingPresentation}
      controlsVariant="always-visible"
      getScenePicker={getContractingScenePicker}
    />
  );
}
