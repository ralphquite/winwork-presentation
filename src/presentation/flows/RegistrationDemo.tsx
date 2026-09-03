import { Check, ChevronDown, CircleCheck, EyeOff } from 'lucide-react';
import { useState, type InputHTMLAttributes, type ReactNode } from 'react';

import { DesktopShell } from './ProductUI';

type AuthScreen = 'sign-in' | 'sign-up' | 'email-sent' | 'signed-in';

const DEMO_COMPANY = 'ООО «ДЕМО КОМПАНИЯ»';
const DEMO_EMAIL = 'demo.registration@yandex.ru';
const DEMO_PASSWORD = 'WinWorkDemo2026';
const DEMO_PHONE = '+7 (999) 555-09-02';
const DEMO_POSITION = 'ассистент/менеджер';

const BENEFITS = [
  {
    description:
      'Ищите исполнителей, заключайте сделки, подписывайте договоры и акты',
    title: 'Задания и сделки',
  },
  {
    description:
      'Проверяйте статус ваших самозанятых исполнителей перед выплатами',
    title: 'Проверка исполнителей',
  },
  {
    description:
      'Платите исполнителям по реквизитам счета или карты, получайте чеки',
    title: 'Выплаты и чеки',
  },
] as const;

type AutoFillFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> & {
  autoFillValue: string;
  label: string;
  onValueChange: (value: string) => void;
  value: string;
};

function AutoFillField({
  autoFillValue,
  className = '',
  label,
  onValueChange,
  value,
  ...props
}: AutoFillFieldProps) {
  const fill = () => {
    if (!value) onValueChange(autoFillValue);
  };

  return (
    <label
      className={`ww-auth-field${value ? ' is-filled' : ''} ${className}`.trim()}
    >
      <span>{label}</span>
      <input
        {...props}
        aria-label={label}
        onChange={(event) => onValueChange(event.currentTarget.value)}
        onClick={fill}
        onFocus={fill}
        placeholder={value ? undefined : label}
        value={value}
      />
      {props.type === 'password' ? (
        <EyeOff aria-hidden="true" className="ww-auth-field-icon" size={20} />
      ) : null}
    </label>
  );
}

function AuthBenefits({ onRegister }: { onRegister?: () => void }) {
  return (
    <aside className="ww-auth-benefits">
      <div className="ww-auth-benefits-list">
        {BENEFITS.map((benefit) => (
          <article key={benefit.title}>
            <h2>{benefit.title}</h2>
            <p>{benefit.description}</p>
          </article>
        ))}
        {onRegister ? (
          <button
            className="ww-auth-benefits-register"
            onClick={onRegister}
            type="button"
          >
            Зарегистрироваться
          </button>
        ) : null}
      </div>
    </aside>
  );
}

function AuthFrame({
  children,
  onRegister,
}: {
  children: ReactNode;
  onRegister?: () => void;
}) {
  return (
    <div className="ww-auth-demo" data-demo-viewport="desktop">
      <section className="ww-auth-primary">
        <img alt="WinWork" className="ww-auth-logo" src="/winwork-logo.svg" />
        {children}
        <span className="ww-auth-copyright">© 2026 WinWork</span>
      </section>
      <AuthBenefits onRegister={onRegister} />
    </div>
  );
}

function SignInScreen({
  onRegister,
  onSignedIn,
}: {
  onRegister: () => void;
  onSignedIn: () => void;
}) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const canSignIn = Boolean(phone && password);

  return (
    <AuthFrame onRegister={onRegister}>
      <div className="ww-auth-content is-sign-in">
        <h1>Вход в личный кабинет</h1>
        <div className="ww-auth-tabs" role="tablist">
          <button aria-selected="true" role="tab" type="button">
            По номеру телефона
          </button>
          <button aria-selected="false" role="tab" type="button">
            По логину
          </button>
        </div>
        <div className="ww-auth-form">
          <AutoFillField
            autoComplete="tel"
            autoFillValue={DEMO_PHONE}
            label="Телефон, указанный при регистрации"
            onValueChange={setPhone}
            type="tel"
            value={phone}
          />
          <AutoFillField
            autoComplete="current-password"
            autoFillValue={DEMO_PASSWORD}
            label="Пароль"
            onValueChange={setPassword}
            type="password"
            value={password}
          />
          <button className="ww-auth-forgot" type="button">
            Забыли пароль?
          </button>
          <button
            className="ww-auth-submit"
            data-demo-action="registration-sign-in"
            disabled={!canSignIn}
            onClick={onSignedIn}
            type="button"
          >
            Войти
          </button>
          <button className="ww-auth-ad-button" type="button">
            Вход через AD для сотрудников
          </button>
          <p className="ww-auth-switch-copy">
            Еще не зарегистрированы?{' '}
            <button onClick={onRegister} type="button">
              Регистрация
            </button>
          </p>
        </div>
      </div>
    </AuthFrame>
  );
}

function SignUpScreen({
  onEmailSent,
  onSignIn,
}: {
  onEmailSent: () => void;
  onSignIn: () => void;
}) {
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const canRegister = Boolean(
    company && position && phone && email && password,
  );

  return (
    <AuthFrame>
      <div className="ww-auth-content is-sign-up">
        <header className="ww-auth-sign-up-heading">
          <h1>Регистрация</h1>
          <button type="button">Вы самозанятый?</button>
        </header>
        <div className="ww-auth-form is-registration">
          <AutoFillField
            autoFillValue={DEMO_COMPANY}
            label="Название компании или ИНН"
            onValueChange={setCompany}
            value={company}
          />
          {company ? (
            <p className="ww-auth-company-manager">
              Руководитель: Петров Алексей Иванович
            </p>
          ) : null}
          <div className="ww-auth-position-field">
            <AutoFillField
              autoFillValue={DEMO_POSITION}
              label="Ваша должность в компании"
              onValueChange={setPosition}
              value={position}
            />
            <ChevronDown aria-hidden="true" size={20} />
          </div>
          <div className="ww-auth-contact-heading">
            <h2>Контактные данные</h2>
            <p>Данные используются для авторизации и подтверждения оплаты</p>
          </div>
          <div className="ww-auth-contact-row">
            <AutoFillField
              autoComplete="tel"
              autoFillValue={DEMO_PHONE}
              label="Телефон для СМС-кодов"
              onValueChange={setPhone}
              type="tel"
              value={phone}
            />
            <AutoFillField
              autoComplete="email"
              autoFillValue={DEMO_EMAIL}
              label="E-mail"
              onValueChange={setEmail}
              type="email"
              value={email}
            />
          </div>
          <AutoFillField
            autoComplete="new-password"
            autoFillValue={DEMO_PASSWORD}
            label="Пароль"
            onValueChange={setPassword}
            type="password"
            value={password}
          />
          <p className="ww-auth-password-hint">
            Пароль должен содержать от 10 до 30 символов.
            <br />
            Допустимы латинские символы и цифры
          </p>
          <button
            className="ww-auth-submit"
            data-demo-action="registration-submit"
            disabled={!canRegister}
            onClick={onEmailSent}
            type="button"
          >
            Зарегистрироваться
          </button>
          <p className="ww-auth-switch-copy">
            Уже зарегистрированы?{' '}
            <button onClick={onSignIn} type="button">
              Войти
            </button>
          </p>
          {company ? (
            <p className="ww-auth-terms">
              Нажимая на кнопку «Зарегистрироваться» я подтверждаю, что являюсь
              уполномоченным представителем {DEMO_COMPANY}, ознакомился и
              принимаю{' '}
              <button type="button">правила использования сервиса</button>
            </p>
          ) : null}
        </div>
      </div>
    </AuthFrame>
  );
}

function EmailSentScreen({ onSignIn }: { onSignIn: () => void }) {
  return (
    <AuthFrame>
      <div className="ww-auth-content is-email-sent">
        <CircleCheck aria-hidden="true" size={24} />
        <h1>
          Последний шаг, чтобы
          <br />
          завершить регистрацию
        </h1>
        <p>Мы отправили письмо на {DEMO_EMAIL}.</p>
        <p>
          Перейдите по ссылке из письма для завершения регистрации. Если письмо
          не пришло, проверьте спам или{' '}
          <button type="button">отправьте его повторно</button>. Если вы уже
          перешли по ссылке, обновите страницу.
        </p>
        <button
          className="ww-auth-demo-continue"
          data-demo-action="registration-email-confirmed"
          onClick={onSignIn}
          type="button"
        >
          <Check aria-hidden="true" size={18} />
          Письмо подтверждено — перейти ко входу
        </button>
      </div>
    </AuthFrame>
  );
}

function SignedInScreen() {
  return (
    <DesktopShell>
      <section className="ww-auth-signed-in">
        <span>
          <Check aria-hidden="true" size={24} />
        </span>
        <p>Вход выполнен</p>
        <h1>Добро пожаловать в WinWork</h1>
        <small>Демо-аккаунт {DEMO_COMPANY} готов к работе.</small>
      </section>
    </DesktopShell>
  );
}

export function RegistrationDemo() {
  const [screen, setScreen] = useState<AuthScreen>('sign-in');

  switch (screen) {
    case 'sign-in':
      return (
        <SignInScreen
          onRegister={() => setScreen('sign-up')}
          onSignedIn={() => setScreen('signed-in')}
        />
      );
    case 'sign-up':
      return (
        <SignUpScreen
          onEmailSent={() => setScreen('email-sent')}
          onSignIn={() => setScreen('sign-in')}
        />
      );
    case 'email-sent':
      return <EmailSentScreen onSignIn={() => setScreen('sign-in')} />;
    case 'signed-in':
      return <SignedInScreen />;
  }
}
