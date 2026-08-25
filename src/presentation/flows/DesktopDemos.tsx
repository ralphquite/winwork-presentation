import {
  Check,
  ChevronDown,
  ClipboardList,
  FilePlus2,
  FileText,
  MoreVertical,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  UserPlus,
} from 'lucide-react';
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

import {
  Checkbox,
  DesktopShell,
  Drawer,
  Field,
  ProductButton,
  ProductModal,
  SelectField,
  SettingsScaffold,
  StatusToast,
  TextAreaField,
  Toggle,
} from './ProductUI';
import { useTransientMessage } from './useTransientMessage';

const OBJECT_ROWS = [
  [
    'Распределительный центр «Север»',
    'Кладовщик, комплектовщик',
    'Москва, Дмитровское шоссе, 163А',
  ],
  [
    'Склад готовой продукции «Южный»',
    'Грузчик, работник склада',
    'Московская область, Подольск, ул. Лобачёва, 13',
  ],
  [
    'Фулфилмент-центр «Орион»',
    'Комплектовщик, упаковщик',
    'Московская область, Домодедово, Логистическая ул., 1',
  ],
  [
    'Склад интернет-заказов «Центральный»',
    'Сборщик заказов, курьер',
    'Москва, Электрозаводская ул., 21',
  ],
  [
    'Склад возвратов «Запад»',
    'Сортировщик, грузчик',
    'Москва, Рябиновая ул., 45',
  ],
  [
    'Распределительный центр «Восток»',
    'Кладовщик, работник склада',
    'Московская область, Балашиха, шоссе Энтузиастов, 2',
  ],
] as const;

const ACTIVITY_ROWS = [
  ['Грузчик', 'Погрузка, разгрузка, перемещение товаров'],
  ['Работник склада', 'Приёмка поставок, сортировка, упаковка'],
  ['Кладовщик', 'Размещение товаров, учёт остатков, инвентаризация'],
] as const;

const OBJECT_ACTIVITY_OPTIONS = [
  'Финансовые услуги',
  'Уборщик',
  'Консультирование',
  'Единоборства',
  'Доставка еды',
  'Груминг',
  'Грузчик',
  'Бармен',
  'Аналитик',
  'Аквариумисты',
] as const;

const RUSSIAN_EMAIL_DOMAINS = new Set([
  'yandex.ru',
  'ya.ru',
  'mail.ru',
  'inbox.ru',
  'bk.ru',
  'list.ru',
  'rambler.ru',
]);
const ROUBLE_FORMATTER = new Intl.NumberFormat('ru-RU');

type ObjectActivityName = (typeof OBJECT_ACTIVITY_OPTIONS)[number];
type ObjectActivityPeriod = 'День' | 'Неделя' | 'Месяц';

type ObjectManager = {
  email: string;
  firstName: string;
  id: number;
  mobileOnly: boolean;
  patronymic: string;
  phone: string;
  powerOfAttorneyVersion: number;
  status: 'draft' | 'existing' | 'invited';
  surname: string;
};

type ObjectActivity = {
  hourlyRate: string;
  limitsEnabled: boolean;
  name: ObjectActivityName;
  period: ObjectActivityPeriod;
  reward: string;
  taskCount: string;
};

const createObjectManager = (id: number): ObjectManager => ({
  email: '',
  firstName: '',
  id,
  mobileOnly: false,
  patronymic: '',
  phone: '',
  powerOfAttorneyVersion: 0,
  status: 'draft',
  surname: '',
});

const EXISTING_OBJECT_MANAGER = {
  email: 'existing.manager@example.test',
  firstName: 'Анна',
  patronymic: 'Тестовна',
  surname: 'Смирнова',
} as const;

const createObjectActivity = (name: ObjectActivityName): ObjectActivity => ({
  hourlyRate: '',
  limitsEnabled: false,
  name,
  period: 'Месяц',
  reward: '',
  taskCount: '',
});

const isSupportedManagerEmail = (email: string) => {
  const domain = email.trim().toLowerCase().split('@')[1];
  return domain ? RUSSIAN_EMAIL_DOMAINS.has(domain) : false;
};

const formatObjectManagerPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '').slice(0, 10);
  return [
    digits.slice(0, 3),
    digits.slice(3, 6),
    digits.slice(6, 8),
    digits.slice(8, 10),
  ]
    .filter(Boolean)
    .join(' ');
};

const isObjectManagerComplete = (manager: ObjectManager) => {
  if (manager.status === 'existing') {
    return true;
  }

  return (
    manager.status === 'invited' &&
    isSupportedManagerEmail(manager.email) &&
    Boolean(manager.surname.trim()) &&
    Boolean(manager.firstName.trim()) &&
    manager.phone.replace(/\D/g, '').length === 10
  );
};

const getActivityLimitError = (activity: ObjectActivity) => {
  if (!activity.limitsEnabled) {
    return null;
  }

  const hourlyRate = Number(activity.hourlyRate);
  const reward = Number(activity.reward);
  const taskCount = Number(activity.taskCount);

  if (hourlyRate <= 0 || reward <= 0 || taskCount <= 0) {
    return 'Заполните ставку, вознаграждение и количество заданий';
  }

  const minimumReward = hourlyRate * taskCount * 4;
  if (reward < minimumReward) {
    return `Минимальное вознаграждение: ${ROUBLE_FORMATTER.format(minimumReward)} ₽`;
  }

  return null;
};

function ObjectManagerCard({
  index,
  manager,
  onChange,
  onRemove,
}: {
  index: number;
  manager: ObjectManager;
  onChange: (patch: Partial<ObjectManager>) => void;
  onRemove: () => void;
}) {
  const hasEmail = manager.email.trim().length > 0;
  const emailSupported = isSupportedManagerEmail(manager.email);
  const isExisting = manager.status === 'existing';
  const isInvited = manager.status === 'invited';

  const changeEmail = (email: string) => {
    if (
      email.trim().toLowerCase() === EXISTING_OBJECT_MANAGER.email.toLowerCase()
    ) {
      onChange({
        ...EXISTING_OBJECT_MANAGER,
        mobileOnly: false,
        phone: '',
        powerOfAttorneyVersion: 0,
        status: 'existing',
      });
      return;
    }

    onChange({ email, status: 'draft' });
  };

  return (
    <article className="ww-object-card ww-object-manager-card">
      <header>
        <div>
          <strong>Руководитель {index + 1}</strong>
          {isInvited ? <span>Приглашение</span> : null}
        </div>
        <button
          aria-label={`Удалить руководителя ${index + 1}`}
          onClick={onRemove}
          type="button"
        >
          <Trash2 aria-hidden="true" size={16} />
        </button>
      </header>

      {isExisting ? (
        <>
          <div className="ww-manager-readonly-field">
            <span>Email для входа</span>
            <strong>{manager.email}</strong>
          </div>
          <div className="ww-manager-summary">
            <span>ФИО</span>
            <strong>
              {[manager.surname, manager.firstName, manager.patronymic]
                .filter(Boolean)
                .join(' ')}
            </strong>
          </div>
        </>
      ) : (
        <Field
          aria-label={`Email руководителя ${index + 1}`}
          label="Email для входа"
          onChange={(event) => changeEmail(event.currentTarget.value)}
          placeholder="existing.manager@example.test"
          readOnly={isInvited}
          type="email"
          value={manager.email}
        />
      )}

      {hasEmail && manager.status === 'draft' && !emailSupported ? (
        <p className="ww-field-error">
          Используйте адрес российского почтового сервиса
        </p>
      ) : null}

      {hasEmail && emailSupported && manager.status === 'draft' ? (
        <div className="ww-manager-invite-state">
          <span>Никто не найден</span>
          <ProductButton
            onClick={() => onChange({ status: 'invited' })}
            variant="secondary"
          >
            Пригласить руководителя
          </ProductButton>
        </div>
      ) : null}

      {isInvited ? (
        <div className="ww-manager-details">
          <Field
            label="Фамилия"
            onChange={(event) =>
              onChange({ surname: event.currentTarget.value })
            }
            value={manager.surname}
          />
          <Field
            label="Имя"
            onChange={(event) =>
              onChange({ firstName: event.currentTarget.value })
            }
            value={manager.firstName}
          />
          <Field
            label="Отчество"
            onChange={(event) =>
              onChange({ patronymic: event.currentTarget.value })
            }
            value={manager.patronymic}
          />
          <label className="ww-field">
            <span>Номер телефона</span>
            <span className="ww-phone-field">
              <span aria-hidden="true">+7</span>
              <input
                aria-label={`Номер телефона руководителя ${index + 1}`}
                inputMode="numeric"
                maxLength={10}
                onChange={(event) =>
                  onChange({
                    phone: event.currentTarget.value.replace(/\D/g, ''),
                  })
                }
                placeholder="999 000-00-00"
                type="tel"
                value={formatObjectManagerPhone(manager.phone)}
              />
            </span>
          </label>
          <section className="ww-manager-subsection">
            <h4>Разрешения</h4>
            <div className="ww-manager-permission">
              <Checkbox
                checked={manager.mobileOnly}
                label="Разрешено работать только в мобильном приложении"
                onChange={(mobileOnly) => onChange({ mobileOnly })}
              />
            </div>
          </section>
          <section className="ww-manager-subsection">
            <h4>Доверенность</h4>
            {manager.powerOfAttorneyVersion > 0 ? (
              <div className="ww-manager-power-of-attorney">
                <FileText aria-hidden="true" size={25} />
                <div>
                  <span>
                    Доверенность DEMO-000{manager.powerOfAttorneyVersion}
                  </span>
                  <small>Действует до 01.12.2027</small>
                </div>
                <button
                  aria-label={`Обновить доверенность руководителя ${index + 1}`}
                  onClick={() =>
                    onChange({
                      powerOfAttorneyVersion:
                        manager.powerOfAttorneyVersion + 1,
                    })
                  }
                  type="button"
                >
                  <RefreshCw aria-hidden="true" size={21} />
                </button>
              </div>
            ) : (
              <ProductButton
                className="ww-manager-add-power"
                onClick={() => onChange({ powerOfAttorneyVersion: 1 })}
                variant="secondary"
              >
                <FilePlus2 aria-hidden="true" size={18} /> Добавить доверенность
              </ProductButton>
            )}
          </section>
        </div>
      ) : null}
    </article>
  );
}

function ObjectActivityPicker({
  onClose,
  onSave,
  selectedNames,
}: {
  onClose: () => void;
  onSave: (names: readonly ObjectActivityName[]) => void;
  selectedNames: readonly ObjectActivityName[];
}) {
  const [search, setSearch] = useState('');
  const [draftNames, setDraftNames] = useState<readonly ObjectActivityName[]>(
    [],
  );
  const normalizedSearch = search.trim().toLocaleLowerCase('ru-RU');
  const availableOptions = OBJECT_ACTIVITY_OPTIONS.filter(
    (name) =>
      !selectedNames.includes(name) &&
      name.toLocaleLowerCase('ru-RU').includes(normalizedSearch),
  );

  return (
    <section
      aria-label="Выбор видов деятельности"
      className="ww-activity-picker"
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.stopPropagation();
          onClose();
        }
      }}
    >
      <label className="ww-activity-search">
        <input
          autoFocus
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder="Поиск"
          type="search"
          value={search}
        />
        <Search aria-hidden="true" size={18} />
      </label>
      <div className="ww-activity-picker-list">
        {availableOptions.length > 0 ? (
          availableOptions.map((name) => (
            <Checkbox
              checked={draftNames.includes(name)}
              key={name}
              label={name}
              onChange={(checked) =>
                setDraftNames((currentNames) =>
                  checked
                    ? [...currentNames, name]
                    : currentNames.filter(
                        (currentName) => currentName !== name,
                      ),
                )
              }
            />
          ))
        ) : (
          <p>Подходящих видов деятельности нет</p>
        )}
      </div>
      <ProductButton
        disabled={draftNames.length === 0}
        onClick={() => onSave(draftNames)}
      >
        Сохранить
      </ProductButton>
    </section>
  );
}

function ObjectActivityCard({
  activity,
  onChange,
  onRemove,
}: {
  activity: ObjectActivity;
  onChange: (patch: Partial<ObjectActivity>) => void;
  onRemove: () => void;
}) {
  const limitError = getActivityLimitError(activity);

  return (
    <article className="ww-object-card ww-activity-card">
      <header>
        <strong>{activity.name}</strong>
        <button
          aria-label={`Удалить вид деятельности ${activity.name}`}
          onClick={onRemove}
          type="button"
        >
          <Trash2 aria-hidden="true" size={16} />
        </button>
      </header>
      <Field
        aria-label={`Ставка за час для ${activity.name}`}
        inputMode="decimal"
        label="Ставка за час"
        onChange={(event) =>
          onChange({ hourlyRate: event.currentTarget.value })
        }
        value={activity.hourlyRate}
      />
      <div className="ww-activity-limit-toggle">
        <Toggle
          checked={activity.limitsEnabled}
          label={`Лимиты для ${activity.name}`}
          onChange={(limitsEnabled) => onChange({ limitsEnabled })}
        />
        <span>Лимиты</span>
      </div>
      {activity.limitsEnabled ? (
        <div className="ww-activity-limits">
          <Field
            inputMode="decimal"
            label="Вознаграждение ₽"
            onChange={(event) =>
              onChange({ reward: event.currentTarget.value })
            }
            value={activity.reward}
          />
          <Field
            inputMode="numeric"
            label="Задания"
            onChange={(event) =>
              onChange({ taskCount: event.currentTarget.value })
            }
            value={activity.taskCount}
          />
          <SelectField
            label="Период"
            onChange={(event) =>
              onChange({
                period: event.currentTarget.value as ObjectActivityPeriod,
              })
            }
            options={['День', 'Неделя', 'Месяц']}
            value={activity.period}
          />
        </div>
      ) : null}
      {limitError ? <p className="ww-field-error">{limitError}</p> : null}
    </article>
  );
}

function DataTable({
  columns,
  rows,
}: {
  columns: readonly string[];
  rows: readonly (readonly string[])[];
}) {
  return (
    <div className="ww-table-shell">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
            <th aria-label="Действия" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${row[0]}-${rowIndex}`}>
              {row.map((cell) => (
                <td key={cell}>{cell}</td>
              ))}
              <td>
                <button aria-label={`Редактировать ${row[0]}`} type="button">
                  <Pencil aria-hidden="true" size={17} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <footer>
        <span>На странице: 10 · Страница 1 из 3</span>
        <div>
          <button aria-label="Предыдущая страница" type="button">
            ‹
          </button>
          <button aria-current="page" type="button">
            1
          </button>
          <button aria-label="Следующая страница" type="button">
            ›
          </button>
        </div>
      </footer>
    </div>
  );
}

function PageHeading({
  actions,
  children,
}: {
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="ww-page-heading">
      <h2>{children}</h2>
      {actions ? <div className="ww-page-actions">{actions}</div> : null}
    </div>
  );
}

export function CreateObjectDemo() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [objectName, setObjectName] = useState('');
  const [remoteWork, setRemoteWork] = useState(false);
  const [region, setRegion] = useState('Москва');
  const [city, setCity] = useState('Москва');
  const [street, setStreet] = useState('');
  const [house, setHouse] = useState('');
  const [building, setBuilding] = useState('');
  const [apartment, setApartment] = useState('');
  const [objectId, setObjectId] = useState('');
  const [managers, setManagers] = useState<readonly ObjectManager[]>(() => [
    createObjectManager(1),
  ]);
  const [activities, setActivities] = useState<readonly ObjectActivity[]>([]);
  const [isActivityPickerOpen, setIsActivityPickerOpen] = useState(false);
  const [smsCode, setSmsCode] = useState('');
  const [smsError, setSmsError] = useState('');
  const [isSmsPending, setIsSmsPending] = useState(false);
  const [rows, setRows] = useState<readonly (readonly string[])[]>(OBJECT_ROWS);
  const [toast, setToast] = useTransientMessage();

  const resetObjectDraft = () => {
    setObjectName('');
    setRemoteWork(false);
    setRegion('Москва');
    setCity('Москва');
    setStreet('');
    setHouse('');
    setBuilding('');
    setApartment('');
    setObjectId('');
    setManagers([createObjectManager(1)]);
    setActivities([]);
    setIsActivityPickerOpen(false);
    setSmsCode('');
    setSmsError('');
    setIsSmsPending(false);
  };

  const openObjectDrawer = () => {
    resetObjectDraft();
    setIsDrawerOpen(true);
  };

  const updateManager = (id: number, patch: Partial<ObjectManager>) => {
    setManagers((currentManagers) =>
      currentManagers.map((manager) =>
        manager.id === id ? { ...manager, ...patch } : manager,
      ),
    );
  };

  const addManager = () => {
    setManagers((currentManagers) => [
      ...currentManagers,
      createObjectManager(
        currentManagers.reduce(
          (largestId, manager) => Math.max(largestId, manager.id),
          0,
        ) + 1,
      ),
    ]);
  };

  const updateActivity = (
    name: ObjectActivityName,
    patch: Partial<ObjectActivity>,
  ) => {
    setActivities((currentActivities) =>
      currentActivities.map((activity) =>
        activity.name === name ? { ...activity, ...patch } : activity,
      ),
    );
  };

  const addSelectedActivities = (
    selectedNames: readonly ObjectActivityName[],
  ) => {
    setActivities((currentActivities) => [
      ...currentActivities,
      ...selectedNames.map(createObjectActivity),
    ]);
    setIsActivityPickerOpen(false);
  };

  const changeRegion = (nextRegion: string) => {
    setRegion(nextRegion);
    setCity(
      nextRegion === 'Санкт-Петербург'
        ? 'Санкт-Петербург'
        : nextRegion === 'Московская область'
          ? 'Подольск'
          : 'Москва',
    );
  };

  const finalizeObject = () => {
    const activityNames = activities.map((activity) => activity.name);
    const visibleActivities = activityNames.slice(0, 3).join(', ');
    const activitySummary =
      activityNames.length > 3
        ? `${visibleActivities} и ещё ${activityNames.length - 3}`
        : visibleActivities;
    const address = remoteWork
      ? `${region}, ${city}`
      : [region, city, street, house, building, apartment]
          .filter(Boolean)
          .join(', ');

    setRows((currentRows) => [
      [objectName.trim(), activitySummary, address],
      ...currentRows,
    ]);
    setIsDrawerOpen(false);
    setToast('Объект сохранён');
    resetObjectDraft();
  };

  const saveObject = () => {
    if (managers.some((manager) => manager.status === 'invited')) {
      setIsSmsPending(true);
      setSmsCode('');
      setSmsError('');
      return;
    }

    finalizeObject();
  };

  const handleSmsCodeChange = (value: string) => {
    const nextCode = value.replace(/\D/g, '').slice(0, 4);
    setSmsCode(nextCode);
    setSmsError('');

    if (nextCode.length === 4) {
      if (nextCode === '0000') {
        finalizeObject();
      } else {
        setSmsError('Неверный код. Для демо используйте 0000');
      }
    }
  };

  const addressComplete =
    Boolean(region) &&
    Boolean(city) &&
    (remoteWork || (Boolean(street.trim()) && Boolean(house.trim())));
  const managersComplete =
    managers.length > 0 && managers.every(isObjectManagerComplete);
  const activitiesComplete =
    activities.length > 0 &&
    activities.every(
      (activity) =>
        Boolean(activity.hourlyRate) &&
        getActivityLimitError(activity) === null,
    );
  const canSave =
    Boolean(objectName.trim()) &&
    addressComplete &&
    managersComplete &&
    activitiesComplete &&
    !isSmsPending;

  return (
    <DesktopShell>
      <SettingsScaffold activeSubtab="Мои объекты">
        <PageHeading
          actions={
            <>
              <ProductButton
                data-demo-action="add-object"
                onClick={openObjectDrawer}
              >
                <Plus aria-hidden="true" size={18} /> Добавить объект
              </ProductButton>
              <ProductButton variant="secondary">
                <Upload aria-hidden="true" size={18} /> Загрузить реестр
                объектов
              </ProductButton>
            </>
          }
        >
          Мои объекты
        </PageHeading>
        <DataTable
          columns={['Название объекта', 'Типы работ', 'Адрес']}
          rows={rows}
        />
      </SettingsScaffold>

      {isDrawerOpen ? (
        <Drawer onClose={() => setIsDrawerOpen(false)} title="Добавить объект">
          <section className="ww-drawer-section">
            <h3>Адрес объекта</h3>
            <div className="ww-object-name-row">
              <Field
                label="Название объекта"
                onChange={(event) => setObjectName(event.currentTarget.value)}
                placeholder="Введите название объекта"
                value={objectName}
              />
              <Checkbox
                checked={remoteWork}
                label="Удаленная работа"
                onChange={setRemoteWork}
              />
            </div>
            <div className="ww-field-grid is-two">
              <SelectField
                label="Регион заказа"
                onChange={(event) => changeRegion(event.currentTarget.value)}
                options={['Москва', 'Московская область', 'Санкт-Петербург']}
                value={region}
              />
              <SelectField
                label="Город или населённый пункт"
                onChange={(event) => setCity(event.currentTarget.value)}
                options={
                  region === 'Санкт-Петербург'
                    ? ['Санкт-Петербург']
                    : region === 'Московская область'
                      ? ['Подольск', 'Домодедово', 'Балашиха']
                      : ['Москва']
                }
                value={city}
              />
            </div>
            {!remoteWork ? (
              <>
                <Field
                  label="Населённый пункт, название улицы"
                  onChange={(event) => setStreet(event.currentTarget.value)}
                  placeholder="Введите адрес"
                  value={street}
                />
                <div className="ww-field-grid is-three">
                  <Field
                    label="Дом/строение"
                    onChange={(event) => setHouse(event.currentTarget.value)}
                    placeholder="—"
                    value={house}
                  />
                  <Field
                    label="Корпус (необязательно)"
                    onChange={(event) => setBuilding(event.currentTarget.value)}
                    placeholder="—"
                    value={building}
                  />
                  <Field
                    label="Квартира (необязательно)"
                    onChange={(event) =>
                      setApartment(event.currentTarget.value)
                    }
                    placeholder="—"
                    value={apartment}
                  />
                </div>
              </>
            ) : null}
          </section>
          <section className="ww-drawer-section">
            <h3>Внутренние примечания</h3>
            <Field
              label="Идентификатор объекта"
              onChange={(event) => setObjectId(event.currentTarget.value)}
              placeholder="Введите идентификатор"
              value={objectId}
            />
          </section>
          <section className="ww-drawer-section">
            <h3>Руководитель объекта</h3>
            <p>
              Руководителю на почту придёт ссылка на скачивание мобильного
              приложения и данные для входа.
            </p>
            {managers.map((manager, index) => (
              <ObjectManagerCard
                index={index}
                key={manager.id}
                manager={manager}
                onChange={(patch) => updateManager(manager.id, patch)}
                onRemove={() =>
                  setManagers((currentManagers) =>
                    currentManagers.filter(
                      (currentManager) => currentManager.id !== manager.id,
                    ),
                  )
                }
              />
            ))}
            <ProductButton
              data-demo-action="add-object-manager"
              onClick={addManager}
              variant="secondary"
            >
              <UserPlus aria-hidden="true" size={17} /> Добавить руководителя
            </ProductButton>
          </section>
          <section className="ww-drawer-section">
            <h3>Виды деятельности</h3>
            <div className="ww-activity-picker-anchor">
              <ProductButton
                aria-expanded={isActivityPickerOpen}
                onClick={() => setIsActivityPickerOpen((isOpen) => !isOpen)}
                variant="secondary"
              >
                <Plus aria-hidden="true" size={17} /> Добавить вид деятельности
              </ProductButton>
              {isActivityPickerOpen ? (
                <ObjectActivityPicker
                  onClose={() => setIsActivityPickerOpen(false)}
                  onSave={addSelectedActivities}
                  selectedNames={activities.map((activity) => activity.name)}
                />
              ) : null}
            </div>
            {activities.map((activity) => (
              <ObjectActivityCard
                activity={activity}
                key={activity.name}
                onChange={(patch) => updateActivity(activity.name, patch)}
                onRemove={() =>
                  setActivities((currentActivities) =>
                    currentActivities.filter(
                      (currentActivity) =>
                        currentActivity.name !== activity.name,
                    ),
                  )
                }
              />
            ))}
          </section>
          {isSmsPending ? (
            <section aria-live="polite" className="ww-sms-confirmation">
              <strong>Подтвердите кодом из СМС создание руководителей</strong>
              <span>Для демо используйте код 0000.</span>
              <Field
                autoFocus
                inputMode="numeric"
                label="Код из СМС"
                maxLength={4}
                onChange={(event) =>
                  handleSmsCodeChange(event.currentTarget.value)
                }
                value={smsCode}
              />
              {smsError ? <p className="ww-field-error">{smsError}</p> : null}
              <button disabled type="button">
                Запросить новый код через 0:58
              </button>
              <span>Не приходит СМС</span>
            </section>
          ) : (
            <ProductButton
              data-demo-action="save-object"
              disabled={!canSave}
              onClick={saveObject}
            >
              Сохранить
            </ProductButton>
          )}
        </Drawer>
      ) : null}
      {toast ? <StatusToast>{toast}</StatusToast> : null}
    </DesktopShell>
  );
}

function ActivitySettingsPage({ onAdd }: { onAdd: () => void }) {
  const [taxStatus, setTaxStatus] = useState({ fl: true, ip: true, npa: true });

  return (
    <SettingsScaffold activeSubtab="Пакеты документов по типам исполнителей">
      <PageHeading
        actions={
          <ProductButton data-demo-action="add-activity" onClick={onAdd}>
            <Plus aria-hidden="true" size={18} /> Добавить вид деятельности
          </ProductButton>
        }
      >
        Формирование пакетов документов по видам деятельности
      </PageHeading>
      <section className="ww-tax-card">
        <h3>Налоговый статус исполнителей</h3>
        <p>
          Выберите налоговый статус исполнителей, с которыми вы готовы работать.
        </p>
        <div>
          <Checkbox checked={false} label="СМЗ" onChange={() => undefined} />
          <Checkbox
            checked={taxStatus.ip}
            label="ИП"
            onChange={(ip) => setTaxStatus((value) => ({ ...value, ip }))}
          />
          <Checkbox
            checked={taxStatus.npa}
            label="ИП на НПД"
            onChange={(npa) => setTaxStatus((value) => ({ ...value, npa }))}
          />
          <Checkbox
            checked={taxStatus.fl}
            label="ФЛ"
            onChange={(fl) => setTaxStatus((value) => ({ ...value, fl }))}
          />
        </div>
      </section>
      <DataTable
        columns={['Вид деятельности', 'Услуги']}
        rows={ACTIVITY_ROWS}
      />
    </SettingsScaffold>
  );
}

type TemplateKind = 'акт' | 'договор';

type ActivityDrawerContentProps = {
  activeTemplatePicker?: TemplateKind | null;
  onChooseTemplate?: (kind: TemplateKind, value: string) => void;
  onCloseTemplatePicker?: () => void;
  onCreateTemplate?: (kind: TemplateKind) => void;
  onSave: () => void;
  onToggleTemplatePicker?: (kind: TemplateKind) => void;
  selectedActTemplate?: string;
  selectedContractTemplate?: string;
};

function ActivityDrawerContent({
  activeTemplatePicker = null,
  onChooseTemplate,
  onCloseTemplatePicker,
  onCreateTemplate,
  onSave,
  onToggleTemplatePicker,
  selectedActTemplate = 'Шаблон акта для кладовщика',
  selectedContractTemplate = 'Шаблон договора для кладовщика',
}: ActivityDrawerContentProps) {
  const [medicalBook, setMedicalBook] = useState(true);
  const [driversLicense, setDriversLicense] = useState(true);
  const [operations, setOperations] = useState(1);

  return (
    <>
      <SelectField
        defaultValue="Кладовщик"
        label="Вид деятельности"
        options={['Кладовщик', 'Грузчик', 'Комплектовщик']}
      />
      <TemplateSelect
        isOpen={activeTemplatePicker === 'договор'}
        kind="договор"
        onChoose={(value) => onChooseTemplate?.('договор', value)}
        onClose={() => onCloseTemplatePicker?.()}
        onCreate={() => onCreateTemplate?.('договор')}
        onToggle={() => onToggleTemplatePicker?.('договор')}
        selectedTemplate={selectedContractTemplate}
      />
      <TemplateSelect
        isOpen={activeTemplatePicker === 'акт'}
        kind="акт"
        onChoose={(value) => onChooseTemplate?.('акт', value)}
        onClose={() => onCloseTemplatePicker?.()}
        onCreate={() => onCreateTemplate?.('акт')}
        onToggle={() => onToggleTemplatePicker?.('акт')}
        selectedTemplate={selectedActTemplate}
      />
      <TextAreaField
        defaultValue="Взять перчатки"
        label="Требования и указания исполнителю"
      />
      <section className="ww-drawer-section">
        <h3>Дополнительные требования</h3>
        <Checkbox
          checked={medicalBook}
          label="Требуется медицинская книжка"
          onChange={setMedicalBook}
        />
        <Checkbox
          checked={driversLicense}
          label="Требуются водительские права"
          onChange={setDriversLicense}
        />
        {driversLicense ? (
          <div className="ww-license-grid">
            {['A', 'B', 'C', 'D'].map((license) => (
              <Checkbox
                checked
                key={license}
                label={license}
                onChange={() => undefined}
              />
            ))}
          </div>
        ) : null}
      </section>
      <section className="ww-drawer-section">
        <h3>Операции</h3>
        <SelectField
          label="Перечень операций"
          options={['Выбрано: 16', 'Сортировка', 'Разгрузка', 'Инвентаризация']}
        />
        <ProductButton
          onClick={() => setOperations((count) => count + 1)}
          variant="secondary"
        >
          Создать новую операцию
        </ProductButton>
        {Array.from({ length: operations }, (_, index) => (
          <div className="ww-operation-card" key={`operation-${index + 1}`}>
            <div>
              <strong>Новая операция {index + 1}</strong>
              <button
                aria-label={`Удалить операцию ${index + 1}`}
                onClick={() => setOperations((count) => Math.max(0, count - 1))}
                type="button"
              >
                <Trash2 aria-hidden="true" size={17} />
              </button>
            </div>
            <Field
              defaultValue="Расстановка товаров на складе"
              label="Название операции"
            />
            <Field defaultValue="120" label="Длительность одной операции" />
            <Field
              defaultValue="Расставить товары по полкам на складе"
              label="Описание для договора"
            />
          </div>
        ))}
      </section>
      <div className="ww-operation-summary">
        <span>Сортировка товара</span>
        <span>
          Одна операция: <strong>30</strong> мин
        </span>
      </div>
      <div className="ww-operation-summary">
        <span>Разгрузка фуры</span>
        <span>
          Одна операция: <strong>60</strong> мин
        </span>
      </div>
      <ProductButton data-demo-action="save-activity" onClick={onSave}>
        Сохранить
      </ProductButton>
    </>
  );
}

export function CreateActivityDemo() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toast, setToast] = useTransientMessage();

  return (
    <DesktopShell>
      <ActivitySettingsPage onAdd={() => setIsDrawerOpen(true)} />
      {isDrawerOpen ? (
        <Drawer
          onClose={() => setIsDrawerOpen(false)}
          title="Добавить новый вид деятельности"
        >
          <ActivityDrawerContent
            onSave={() => {
              setIsDrawerOpen(false);
              setToast('Вид деятельности сохранён');
            }}
          />
        </Drawer>
      ) : null}
      {toast ? <StatusToast>{toast}</StatusToast> : null}
    </DesktopShell>
  );
}

type TemplateOption = {
  badge?: 'Новый' | 'Рекомендуемый';
  value: string;
};

const TEMPLATE_OPTIONS: Record<TemplateKind, readonly TemplateOption[]> = {
  договор: [
    {
      badge: 'Новый',
      value: 'Шаблон договора для кладовщика вручную',
    },
    {
      badge: 'Рекомендуемый',
      value: 'Шаблон договора для кладовщика',
    },
    { value: 'Шаблон договора для мерчандайзера' },
    { value: 'Шаблон договора для склада' },
    { value: 'Шаблон договора для грузчика' },
    { value: 'Шаблон договора для кладовщика 2' },
    { value: 'Шаблон договора для уборщика' },
    { value: 'Шаблон договора для водителя' },
  ],
  акт: [
    { value: 'Шаблон акта для мерчандайзера' },
    { value: 'Шаблон акта для склада' },
    { value: 'Шаблон акта для грузчика' },
    { value: 'Шаблон акта для кладовщика 2' },
    { value: 'Шаблон акта для уборщика' },
    { value: 'Шаблон акта для водителя' },
  ],
};

type TemplateSelectProps = {
  isOpen: boolean;
  kind: TemplateKind;
  onChoose: (value: string) => void;
  onCreate: () => void;
  onClose: () => void;
  onToggle: () => void;
  selectedTemplate: string;
};

function TemplateSelect({
  isOpen,
  kind,
  onChoose,
  onClose,
  onCreate,
  onToggle,
  selectedTemplate,
}: TemplateSelectProps) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const title = kind === 'договор' ? 'Шаблон договора' : 'Шаблон акта';
  const pickerId = `template-${kind}-picker`;

  useLayoutEffect(() => {
    if (!isOpen || !anchorRef.current) return;

    const pickerElement = anchorRef.current.querySelector<HTMLElement>(
      '.ww-template-picker',
    );
    if (!pickerElement) return;

    const scrollContainers = [
      anchorRef.current.closest<HTMLElement>('.ww-drawer-body'),
      anchorRef.current.closest<HTMLElement>('.demo-product-app-surface'),
    ];
    scrollContainers.forEach((scrollContainer) => {
      if (!scrollContainer) return;

      const overflow =
        pickerElement.getBoundingClientRect().bottom -
        scrollContainer.getBoundingClientRect().bottom +
        12;
      if (overflow > 0) {
        scrollContainer.scrollTop += overflow;
      }
    });
  }, [isOpen]);

  const closeAndRestoreFocus = () => {
    onClose();
    queueMicrotask(() => triggerRef.current?.focus());
  };

  return (
    <div className="ww-template-select" ref={anchorRef}>
      <button
        aria-controls={isOpen ? pickerId : undefined}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="ww-select-button"
        data-demo-action={`${kind === 'договор' ? 'contract' : 'act'}-template`}
        onClick={onToggle}
        ref={triggerRef}
        type="button"
      >
        <span>
          <small>{title}</small>
          {selectedTemplate}
        </span>
        <ChevronDown aria-hidden="true" size={17} />
      </button>
      {isOpen ? (
        <TemplatePicker
          id={pickerId}
          kind={kind}
          onClose={closeAndRestoreFocus}
          onCreate={onCreate}
          onSave={(value) => {
            onChoose(value);
            queueMicrotask(() => triggerRef.current?.focus());
          }}
          selectedTemplate={selectedTemplate}
        />
      ) : null}
    </div>
  );
}

type TemplatePickerProps = {
  id: string;
  kind: TemplateKind;
  onClose: () => void;
  onCreate: () => void;
  onSave: (value: string) => void;
  selectedTemplate: string;
};

function TemplatePicker({
  id,
  kind,
  onClose,
  onCreate,
  onSave,
  selectedTemplate,
}: TemplatePickerProps) {
  const [draftTemplate, setDraftTemplate] = useState(selectedTemplate);
  const [search, setSearch] = useState('');
  const title = kind === 'договор' ? 'Шаблон договора' : 'Шаблон акта';
  const normalizedSearch = search.trim().toLocaleLowerCase('ru-RU');
  const visibleOptions = TEMPLATE_OPTIONS[kind].filter(({ value }) =>
    value.toLocaleLowerCase('ru-RU').includes(normalizedSearch),
  );

  return (
    <section
      aria-label={`Выбор: ${title.toLowerCase()}`}
      className={`ww-template-picker is-${kind === 'договор' ? 'contract' : 'act'}`}
      id={id}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          onClose();
        }
      }}
      role="dialog"
    >
      <label className="ww-template-search">
        <input
          aria-label={`Найти ${title.toLowerCase()}`}
          autoFocus
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder="Поиск"
          type="search"
          value={search}
        />
        <Search aria-hidden="true" size={18} />
      </label>
      <button
        className="ww-template-picker-action"
        data-demo-action={`create-${kind}-template`}
        onClick={onCreate}
        type="button"
      >
        {kind === 'договор'
          ? 'Создать новый договор'
          : 'Перейти в Документооборот'}
      </button>
      <div
        aria-label={`Доступные ${title.toLowerCase()}`}
        className="ww-template-options"
        role="radiogroup"
      >
        {visibleOptions.length > 0 ? (
          visibleOptions.map(({ badge, value }) => (
            <label
              className={`ww-template-option${badge ? ' is-featured' : ''}`}
              key={value}
            >
              <input
                checked={draftTemplate === value}
                name={`template-${kind}`}
                onChange={() => setDraftTemplate(value)}
                type="radio"
                value={value}
              />
              <span>
                {badge ? <small>{badge}</small> : null}
                <span>{value}</span>
              </span>
            </label>
          ))
        ) : (
          <p>Шаблоны не найдены</p>
        )}
      </div>
      <ProductButton
        data-demo-action={`save-${kind}-template`}
        onClick={() => onSave(draftTemplate)}
      >
        Сохранить
      </ProductButton>
    </section>
  );
}

type TemplateEditorProps = {
  kind: 'акт' | 'договор';
  onClose: () => void;
  onSave: (value: string) => void;
};

function TemplateEditor({ kind, onClose, onSave }: TemplateEditorProps) {
  const [name, setName] = useState(
    kind === 'договор'
      ? 'Договор для складских работ'
      : 'Акт для складских работ',
  );

  return (
    <ProductModal onClose={onClose} title="Редактор шаблона" width="document">
      <div className="ww-document-editor">
        <div className="ww-editor-sidebar">
          <Field
            label="Название шаблона"
            onChange={(event) => setName(event.currentTarget.value)}
            value={name}
          />
          <h3>Переменные</h3>
          {[
            'Номер заказа',
            'Дата',
            'ФИО исполнителя',
            'Сумма',
            'Адрес объекта',
          ].map((variable) => (
            <button key={variable} type="button">
              {`{{${variable}}}`}
            </button>
          ))}
        </div>
        <div className="ww-editor-main">
          <div className="ww-editor-toolbar" aria-label="Панель форматирования">
            {['Отменить', 'Повторить', 'B', 'I', 'U', 'Список', 'Ссылка'].map(
              (tool) => (
                <button aria-label={tool} key={tool} type="button">
                  {tool}
                </button>
              ),
            )}
          </div>
          <div
            className="ww-document-page"
            contentEditable
            suppressContentEditableWarning
          >
            <h2>
              {kind === 'договор'
                ? 'ДОГОВОР ОКАЗАНИЯ УСЛУГ'
                : 'АКТ ВЫПОЛНЕННЫХ РАБОТ'}
            </h2>
            <p>г. Москва &nbsp;&nbsp;&nbsp; {`{{Дата}}`}</p>
            <p>
              Заказчик поручает, а Исполнитель принимает на себя выполнение
              работ по заказу {`{{Номер заказа}}`}.
            </p>
            <h3>1. Предмет документа</h3>
            <p>
              Исполнитель: {`{{ФИО исполнителя}}`}. Адрес объекта:{' '}
              {`{{Адрес объекта}}`}. Стоимость выполненных работ составляет{' '}
              {`{{Сумма}}`} рублей.
            </p>
            <h3>2. Подписи сторон</h3>
            <p>
              Заказчик ____________________ Исполнитель ____________________
            </p>
          </div>
          <ProductButton
            data-demo-action="save-template"
            onClick={() => onSave(name)}
          >
            Сохранить шаблон
          </ProductButton>
        </div>
      </div>
    </ProductModal>
  );
}

export function DocumentTemplatesDemo() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [picker, setPicker] = useState<TemplateKind | null>(null);
  const [editor, setEditor] = useState<TemplateKind | null>(null);
  const [contractTemplate, setContractTemplate] = useState(
    'Шаблон договора для кладовщика 2',
  );
  const [actTemplate, setActTemplate] = useState(
    'Шаблон акта для кладовщика 2',
  );
  const [toast, setToast] = useTransientMessage();

  const chooseTemplate = (kind: TemplateKind, value: string) => {
    if (kind === 'договор') {
      setContractTemplate(value);
    } else {
      setActTemplate(value);
    }
    setPicker(null);
  };

  const saveTemplate = (value: string) => {
    if (editor === 'договор') {
      setContractTemplate(value);
    } else {
      setActTemplate(value);
    }
    setEditor(null);
    setToast('Шаблон сохранён и выбран');
  };

  return (
    <DesktopShell>
      <ActivitySettingsPage onAdd={() => setIsDrawerOpen(true)} />
      {isDrawerOpen ? (
        <Drawer
          onClose={() => {
            setIsDrawerOpen(false);
            setPicker(null);
          }}
          title="Добавить новый вид деятельности"
        >
          <ActivityDrawerContent
            activeTemplatePicker={picker}
            onChooseTemplate={chooseTemplate}
            onCloseTemplatePicker={() => setPicker(null)}
            onCreateTemplate={(kind) => {
              setEditor(kind);
              setPicker(null);
            }}
            onSave={() => {
              setIsDrawerOpen(false);
              setPicker(null);
              setToast('Настройки документов сохранены');
            }}
            onToggleTemplatePicker={(kind) =>
              setPicker((current) => (current === kind ? null : kind))
            }
            selectedActTemplate={actTemplate}
            selectedContractTemplate={contractTemplate}
          />
        </Drawer>
      ) : null}
      {editor ? (
        <TemplateEditor
          kind={editor}
          onClose={() => setEditor(null)}
          onSave={saveTemplate}
        />
      ) : null}
      {toast ? <StatusToast>{toast}</StatusToast> : null}
    </DesktopShell>
  );
}

const TASK_ROWS = [
  [
    'Разгрузка утренней поставки',
    '14 августа, 10:00',
    '3 200 ₽',
    'Выполняется',
  ],
  [
    'Комплектация интернет-заказов',
    '14 августа, 12:00',
    '4 000 ₽',
    'Есть отклики',
  ],
  ['Инвентаризация зоны хранения', '15 августа, 09:00', '5 600 ₽', 'Черновик'],
] as const;

const TASK_OBJECTS = [
  'Склад на Новомосковской',
  'Распределительный центр «Север»',
] as const;

const TASK_ACTIVITY_RATES = {
  Грузчик: 1000,
  Кладовщик: 1200,
  Комплектовщик: 1100,
} as const;

const TASK_OPERATIONS = [
  'Разгрузка',
  'Погрузка',
  'Транспортировка',
  'Хранение',
  'Комплектация',
  'Инвентаризация',
] as const;

type TaskActivity = keyof typeof TASK_ACTIVITY_RATES;
type TaskKind = 'regular' | 'single';
type TaskOperation = (typeof TASK_OPERATIONS)[number];

function getTaskDurationHours(
  startDate: string,
  startTime: string,
  endDate: string,
  endTime: string,
) {
  const start = Date.parse(`${startDate}T${startTime}:00`);
  const end = Date.parse(`${endDate}T${endTime}:00`);

  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    return 0;
  }

  return (end - start) / 3_600_000;
}

function formatTaskReward(value: number) {
  return `${ROUBLE_FORMATTER.format(value)} ₽`;
}

export function SingleTaskDemo() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [drawerState, setDrawerState] = useState<'create' | 'created' | null>(
    null,
  );
  const [activity, setActivity] = useState<TaskActivity>('Грузчик');
  const [citizensOnly, setCitizensOnly] = useState(false);
  const [endDate, setEndDate] = useState('2026-08-25');
  const [endTime, setEndTime] = useState('22:00');
  const [preferredWorker, setPreferredWorker] = useState('');
  const [selectedOperations, setSelectedOperations] = useState<TaskOperation[]>(
    ['Разгрузка', 'Транспортировка'],
  );
  const [startDate, setStartDate] = useState('2026-08-25');
  const [startTime, setStartTime] = useState('09:00');
  const [taskKind, setTaskKind] = useState<TaskKind>('single');
  const [taskObject, setTaskObject] = useState<(typeof TASK_OBJECTS)[number]>(
    TASK_OBJECTS[0],
  );
  const [workerCount, setWorkerCount] = useState(1);
  const [toast, setToast] = useTransientMessage();

  const durationHours = getTaskDurationHours(
    startDate,
    startTime,
    endDate,
    endTime,
  );
  const reward = Math.round(
    TASK_ACTIVITY_RATES[activity] * durationHours * workerCount,
  );
  const operationSummary = TASK_OPERATIONS.filter((operation) =>
    selectedOperations.includes(operation),
  )
    .map((operation, index) =>
      index === 0 ? operation : operation.toLocaleLowerCase('ru-RU'),
    )
    .join(', ');
  const taskName = operationSummary
    ? `${activity}. ${operationSummary}. ${taskObject}.`
    : `${activity}. ${taskObject}.`;

  const toggleOperation = (operation: TaskOperation, checked: boolean) => {
    setSelectedOperations((current) =>
      checked
        ? current.includes(operation)
          ? current
          : [...current, operation]
        : current.filter((item) => item !== operation),
    );
  };

  return (
    <DesktopShell activeNavigation="Маркетплейс">
      <div className="ww-marketplace-page">
        <PageHeading
          actions={
            <div className="ww-create-menu-anchor">
              <ProductButton
                data-demo-action="add-task"
                onClick={() => setIsMenuOpen((open) => !open)}
              >
                <Plus aria-hidden="true" size={18} /> Добавить задание
                <ChevronDown aria-hidden="true" size={16} />
              </ProductButton>
              {isMenuOpen ? (
                <div className="ww-create-menu">
                  <button
                    data-demo-action="single-task"
                    onClick={() => {
                      setDrawerState('create');
                      setIsMenuOpen(false);
                    }}
                    type="button"
                  >
                    <ClipboardList aria-hidden="true" size={19} />
                    <span>
                      <strong>Разовое задание</strong>
                      <small>Создать и опубликовать одну задачу</small>
                    </span>
                  </button>
                  <button type="button">
                    <Upload aria-hidden="true" size={19} />
                    <span>
                      <strong>Загрузить реестр</strong>
                      <small>Создать много заданий из файла</small>
                    </span>
                  </button>
                </div>
              ) : null}
            </div>
          }
        >
          Маркетплейс
        </PageHeading>
        <div className="ww-market-filters">
          <label>
            <Search aria-hidden="true" size={17} />
            <input
              aria-label="Поиск заданий"
              placeholder="Название задания или исполнитель"
            />
          </label>
          <SelectField
            label="Статус"
            options={['Все статусы', 'Выполняется', 'Есть отклики', 'Черновик']}
          />
        </div>
        <DataTable
          columns={['Задание', 'Дата и время', 'Вознаграждение', 'Статус']}
          rows={TASK_ROWS}
        />
      </div>

      {drawerState === 'create' ? (
        <Drawer
          className="is-task-drawer"
          key="create-task"
          onClose={() => setDrawerState(null)}
          title="Создать задание"
        >
          <form
            className="ww-task-form"
            onSubmit={(event) => {
              event.preventDefault();
              setDrawerState('created');
              setToast('Задание создано');
            }}
          >
            <section className="ww-task-object-card">
              <h3>Объект</h3>
              <label className="ww-task-control is-select">
                <span>Выберите сохраненный объект</span>
                <select
                  aria-label="Объект"
                  onChange={(event) =>
                    setTaskObject(
                      event.currentTarget
                        .value as (typeof TASK_OBJECTS)[number],
                    )
                  }
                  value={taskObject}
                >
                  {TASK_OBJECTS.map((object) => (
                    <option key={object}>{object}</option>
                  ))}
                </select>
              </label>
            </section>

            <div className="ww-task-activity-row">
              <label className="ww-task-control is-select">
                <span>Вид деятельности</span>
                <select
                  aria-label="Вид деятельности"
                  onChange={(event) =>
                    setActivity(event.currentTarget.value as TaskActivity)
                  }
                  value={activity}
                >
                  {Object.keys(TASK_ACTIVITY_RATES).map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
              <div className="ww-task-rate" aria-label="Ставка">
                <span>Ставка</span>
                <strong>
                  {formatTaskReward(TASK_ACTIVITY_RATES[activity])}
                </strong>
              </div>
            </div>

            <label className="ww-task-control">
              <span>Количество исполнителей</span>
              <input
                aria-label="Количество исполнителей"
                min="1"
                onChange={(event) =>
                  setWorkerCount(
                    Math.max(1, Number(event.currentTarget.value) || 1),
                  )
                }
                type="number"
                value={workerCount}
              />
            </label>

            <fieldset className="ww-task-kind">
              <legend className="sr-only">Тип задания</legend>
              <label>
                <input
                  checked={taskKind === 'single'}
                  name="task-kind"
                  onChange={() => setTaskKind('single')}
                  type="radio"
                />
                <span>Разовое задание</span>
              </label>
              <label>
                <input
                  checked={taskKind === 'regular'}
                  name="task-kind"
                  onChange={() => setTaskKind('regular')}
                  type="radio"
                />
                <span>Регулярные задания</span>
              </label>
            </fieldset>

            <section className="ww-task-section">
              <h3>Период выполнения задания</h3>
              <p>
                Укажите время того региона, в котором будет выполняться задание
              </p>
              <div className="ww-task-period">
                <div>
                  <strong>Начало</strong>
                  <div className="ww-task-period-fields">
                    <label className="ww-task-control">
                      <span>Дата</span>
                      <input
                        aria-label="Дата начала"
                        onChange={(event) =>
                          setStartDate(event.currentTarget.value)
                        }
                        type="date"
                        value={startDate}
                      />
                    </label>
                    <label className="ww-task-control">
                      <span>Время</span>
                      <input
                        aria-label="Время начала"
                        onChange={(event) =>
                          setStartTime(event.currentTarget.value)
                        }
                        type="time"
                        value={startTime}
                      />
                    </label>
                  </div>
                </div>
                <span aria-hidden="true" className="ww-task-period-dash">
                  —
                </span>
                <div>
                  <strong>Завершение</strong>
                  <div className="ww-task-period-fields">
                    <label className="ww-task-control">
                      <span>Дата</span>
                      <input
                        aria-label="Дата завершения"
                        onChange={(event) =>
                          setEndDate(event.currentTarget.value)
                        }
                        type="date"
                        value={endDate}
                      />
                    </label>
                    <label className="ww-task-control">
                      <span>Время</span>
                      <input
                        aria-label="Время завершения"
                        onChange={(event) =>
                          setEndTime(event.currentTarget.value)
                        }
                        type="time"
                        value={endTime}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </section>

            <section className="ww-task-limits">
              <header>
                <strong>Остаток лимита в текущем месяце</strong>
                <span>10 дней до сброса лимита</span>
              </header>
              <div>
                <article>
                  <span>Заданий</span>
                  <p>
                    <strong>12</strong> из 24
                  </p>
                </article>
                <article>
                  <span>Вознаграждение</span>
                  <p>
                    <strong>96 000 ₽</strong> из 192 000 ₽
                  </p>
                </article>
              </div>
            </section>

            <fieldset className="ww-task-section ww-task-operations">
              <legend>Операции</legend>
              <p>Название операций будет отображено в акте</p>
              <div>
                {TASK_OPERATIONS.map((operation) => (
                  <Checkbox
                    checked={selectedOperations.includes(operation)}
                    key={operation}
                    label={operation}
                    onChange={(checked) => toggleOperation(operation, checked)}
                  />
                ))}
              </div>
            </fieldset>

            <div className="ww-task-total">
              <strong>Вознаграждение всего</strong>
              <span>{formatTaskReward(reward)}</span>
            </div>

            <section className="ww-task-section ww-task-name">
              <h3>Название задания</h3>
              <p>{taskName}</p>
            </section>

            <fieldset className="ww-task-section ww-task-additional">
              <legend>Дополнительно</legend>
              <Checkbox
                checked={citizensOnly}
                label="Только граждане РФ"
                onChange={setCitizensOnly}
              />
            </fieldset>

            <label className="ww-task-preferred">
              <span>Предпочитаемый исполнитель (необязательно)</span>
              <div>
                <input
                  aria-label="Предпочитаемый исполнитель"
                  onChange={(event) =>
                    setPreferredWorker(event.currentTarget.value)
                  }
                  placeholder="Исполнитель (поиск по ФИО или ИНН)"
                  value={preferredWorker}
                />
                <Search aria-hidden="true" size={21} />
              </div>
            </label>

            <ProductButton
              data-demo-action="create-task"
              disabled={durationHours === 0 || selectedOperations.length === 0}
              type="submit"
            >
              Создать задание
            </ProductButton>
          </form>
        </Drawer>
      ) : null}

      {drawerState === 'created' ? (
        <Drawer
          key="created-task"
          onClose={() => setDrawerState(null)}
          title="Задание создано"
        >
          <div className="ww-created-state">
            <span className="ww-success-icon">
              <Check aria-hidden="true" size={30} />
            </span>
            <h3>{taskName}</h3>
            <p>Задание опубликовано и уже доступно исполнителям.</p>
          </div>
          <dl className="ww-details-list">
            <div>
              <dt>Статус</dt>
              <dd>Опубликовано</dd>
            </div>
            <div>
              <dt>Вид деятельности</dt>
              <dd>{activity}</dd>
            </div>
            <div>
              <dt>Объект</dt>
              <dd>{taskObject}</dd>
            </div>
            <div>
              <dt>Начало</dt>
              <dd>
                {startDate.split('-').reverse().join('.')}, {startTime}
              </dd>
            </div>
            <div>
              <dt>Вознаграждение</dt>
              <dd>{formatTaskReward(reward)}</dd>
            </div>
          </dl>
          <ProductButton onClick={() => setDrawerState(null)}>
            Готово
          </ProductButton>
          <ProductButton variant="secondary">Скопировать задание</ProductButton>
          <button className="ww-more-button" type="button">
            <MoreVertical aria-hidden="true" size={18} /> Другие действия
          </button>
        </Drawer>
      ) : null}
      {toast ? <StatusToast>{toast}</StatusToast> : null}
    </DesktopShell>
  );
}
