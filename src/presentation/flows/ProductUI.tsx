import {
  Bell,
  BriefcaseBusiness,
  ChevronDown,
  CircleHelp,
  FileCheck2,
  FileText,
  Gift,
  Menu,
  Settings,
  SlidersHorizontal,
  Users,
  WalletCards,
  X,
  type LucideIcon,
} from 'lucide-react';
import {
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';

const NAVIGATION: readonly { icon: LucideIcon; label: string }[] = [
  { icon: Users, label: 'Мои исполнители' },
  { icon: BriefcaseBusiness, label: 'Маркетплейс' },
  { icon: WalletCards, label: 'Платежи' },
  { icon: FileCheck2, label: 'Чеки' },
  { icon: FileText, label: 'Документооборот' },
  { icon: SlidersHorizontal, label: 'Отчёты' },
  { icon: Settings, label: 'Настройки' },
  { icon: Gift, label: 'Мой тариф' },
  { icon: CircleHelp, label: 'Помощь' },
  { icon: Gift, label: 'Спецпредложения' },
  { icon: Menu, label: 'Свернуть меню' },
];

type DesktopShellProps = {
  activeNavigation?: 'Маркетплейс' | 'Настройки';
  children: ReactNode;
};

export function DesktopShell({
  activeNavigation = 'Настройки',
  children,
}: DesktopShellProps) {
  return (
    <div className="ww-desktop-app" data-demo-viewport="desktop">
      <header className="ww-desktop-header">
        <div className="ww-wordmark" aria-label="WinWork">
          <img alt="" aria-hidden="true" src="/winwork-logo.svg" />
        </div>
        <div className="ww-account-strip">
          <strong>2 801 371,00 ₽</strong>
          <span>общий баланс юр. лица</span>
          <strong>482 230,85 ₽</strong>
          <span>баланс проекта</span>
          <Bell aria-hidden="true" size={18} />
          <button type="button">
            1209 <ChevronDown aria-hidden="true" size={15} />
          </button>
          <button type="button">
            ООО «Моя оборона» <ChevronDown aria-hidden="true" size={15} />
          </button>
        </div>
      </header>

      <aside className="ww-sidebar" aria-label="Навигация WinWork">
        <span className="ww-sidebar-kicker">РАБОТА</span>
        <nav>
          {NAVIGATION.map(({ icon: Icon, label }) => (
            <div
              aria-current={activeNavigation === label ? 'page' : undefined}
              className={`ww-sidebar-item${activeNavigation === label ? ' is-active' : ''}`}
              key={label}
            >
              <Icon aria-hidden="true" size={18} strokeWidth={1.9} />
              <span>{label}</span>
            </div>
          ))}
        </nav>
      </aside>

      <main className="ww-desktop-content">{children}</main>
    </div>
  );
}

type SettingsScaffoldProps = {
  activeSubtab: 'Мои объекты' | 'Пакеты документов по типам исполнителей';
  children: ReactNode;
};

export function SettingsScaffold({
  activeSubtab,
  children,
}: SettingsScaffoldProps) {
  const primaryTabs = [
    'Информация о компании',
    'Мои сотрудники',
    'Мои проекты',
    'Уведомления',
    'Дополнительные настройки',
  ];
  const secondaryTabs = [
    'Пакеты документов по типам исполнителей',
    'Мои объекты',
    'Лимиты по заданиям',
    'Приглашения в штат',
    'Исполнители и документы',
  ];

  return (
    <div className="ww-settings-page">
      <h1>Настройки</h1>
      <div className="ww-tabs ww-tabs-primary">
        {primaryTabs.map((tab) => (
          <span
            className={
              tab === 'Дополнительные настройки' ? 'is-active' : undefined
            }
            key={tab}
          >
            {tab}
          </span>
        ))}
      </div>
      <div className="ww-tabs ww-tabs-secondary">
        {secondaryTabs.map((tab) => (
          <span
            className={tab === activeSubtab ? 'is-active' : undefined}
            key={tab}
          >
            {tab}
          </span>
        ))}
      </div>
      {children}
    </div>
  );
}

type ProductButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
};

export function ProductButton({
  className = '',
  variant = 'primary',
  ...props
}: ProductButtonProps) {
  return (
    <button
      className={`ww-button is-${variant} ${className}`.trim()}
      type="button"
      {...props}
    />
  );
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Field({ label, ...props }: FieldProps) {
  return (
    <label className="ww-field">
      <span>{label}</span>
      <input {...props} />
    </label>
  );
}

type TextAreaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
};

export function TextAreaField({ label, ...props }: TextAreaFieldProps) {
  return (
    <label className="ww-field">
      <span>{label}</span>
      <textarea {...props} />
    </label>
  );
}

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: readonly string[];
};

export function SelectField({ label, options, ...props }: SelectFieldProps) {
  return (
    <label className="ww-field">
      <span>{label}</span>
      <select {...props}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

type CheckboxProps = {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
};

export function Checkbox({ checked, label, onChange }: CheckboxProps) {
  return (
    <label className="ww-checkbox">
      <input
        checked={checked}
        onChange={(event) => onChange(event.currentTarget.checked)}
        type="checkbox"
      />
      <span>{label}</span>
    </label>
  );
}

type ToggleProps = {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
};

export function Toggle({ checked, label, onChange }: ToggleProps) {
  return (
    <button
      aria-pressed={checked}
      className={`ww-toggle${checked ? ' is-on' : ''}`}
      onClick={() => onChange(!checked)}
      role="switch"
      type="button"
    >
      <span aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </button>
  );
}

type DrawerProps = {
  children: ReactNode;
  onClose: () => void;
  title: string;
};

export function Drawer({ children, onClose, title }: DrawerProps) {
  return (
    <div className="ww-drawer-layer">
      <button
        aria-label="Закрыть боковую панель"
        className="ww-drawer-scrim"
        onClick={onClose}
        type="button"
      />
      <aside aria-label={title} className="ww-drawer">
        <header>
          <h2>{title}</h2>
          <button aria-label="Закрыть" onClick={onClose} type="button">
            <X aria-hidden="true" size={21} />
          </button>
        </header>
        <div className="ww-drawer-body">{children}</div>
      </aside>
    </div>
  );
}

type ProductModalProps = {
  children: ReactNode;
  onClose: () => void;
  title: string;
  width?: 'compact' | 'document';
};

export function ProductModal({
  children,
  onClose,
  title,
  width = 'compact',
}: ProductModalProps) {
  return (
    <div className="ww-product-modal-layer">
      <button
        aria-label="Закрыть окно"
        className="ww-product-modal-scrim"
        onClick={onClose}
        type="button"
      />
      <section aria-label={title} className={`ww-product-modal is-${width}`}>
        <header>
          <h2>{title}</h2>
          <button aria-label="Закрыть" onClick={onClose} type="button">
            <X aria-hidden="true" size={21} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}

export function StatusToast({ children }: { children: ReactNode }) {
  return (
    <div aria-live="polite" className="ww-toast" role="status">
      {children}
    </div>
  );
}
