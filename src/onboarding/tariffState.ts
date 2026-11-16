export const STORAGE_KEY = 'winwork.onboarding.tariff.v1';
export const DEMO_SELFIE = 'Селфи_представителя_ДЕМО.png';

export const DEMO_FIELDS = {
  citizenship: 'Российская Федерация',
  passport: '00 00 123456',
  issuedAt: '14.06.2021',
  department: '000-000',
  issuedBy: 'Демо-отдел МВД России по г. Москве',
  birthDate: '18.04.1990',
  birthPlace: 'г. Москва',
  address: 'г. Москва, ул. Примерная, д. 12, кв. 8',
  site: 'https://sever-logistics.example',
  email: 'anna@sever-logistics.example',
  phone: '+7 (000) 123-45-67',
} as const;

export type FieldName = keyof typeof DEMO_FIELDS;
export type FormValues = Record<FieldName, string>;
export type TourStep =
  'welcome' | 'navigation' | 'request' | 'details' | 'send' | 'complete';
export type TariffState = {
  page: 'home' | 'tariff';
  drawer: boolean;
  values: FormValues;
  attachment: string;
  submitted: boolean;
  tour: TourStep;
  guiding: boolean;
};

export const REQUIRED_FIELDS: FieldName[] = [
  'citizenship',
  'passport',
  'issuedAt',
  'department',
  'issuedBy',
  'birthDate',
  'birthPlace',
  'address',
  'site',
  'email',
  'phone',
];

export function initialTariffState(): TariffState {
  return {
    page: 'home',
    drawer: false,
    attachment: '',
    submitted: false,
    tour: 'welcome',
    guiding: true,
    values: {
      citizenship: '',
      passport: '',
      issuedAt: '',
      department: '',
      issuedBy: '',
      birthDate: '',
      birthPlace: '',
      address: '',
      site: '',
      email: DEMO_FIELDS.email,
      phone: DEMO_FIELDS.phone,
    },
  };
}

function validDate(value: string) {
  if (!/^\d{2}\.\d{2}\.\d{4}$/.test(value)) return false;
  const [day, month, year] = value.split('.').map(Number);
  const date = new Date(
    `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T12:00:00Z`,
  );
  return (
    date.getUTCDate() === day &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCFullYear() === year &&
    date.getTime() <= Date.now()
  );
}

export function fieldError(name: FieldName, value: string): string {
  if (!value.trim())
    return REQUIRED_FIELDS.includes(name) ? 'Заполните поле' : '';
  if (name === 'passport' && !/^\d{2}\s?\d{2}\s?\d{6}$/.test(value))
    return 'Укажите 10 цифр: серию и номер паспорта';
  if (name === 'department' && !/^\d{3}-\d{3}$/.test(value))
    return 'Укажите код в формате 000-000';
  if ((name === 'issuedAt' || name === 'birthDate') && !validDate(value))
    return 'Укажите дату в формате ДД.ММ.ГГГГ';
  if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return 'Проверьте адрес электронной почты';
  if (name === 'phone' && value.replace(/\D/g, '').length !== 11)
    return 'Укажите телефон с кодом страны';
  return '';
}

export function formReady(state: TariffState) {
  return (
    Boolean(state.attachment) &&
    REQUIRED_FIELDS.every((name) => !fieldError(name, state.values[name]))
  );
}

// Persist checkpoints only. Never store typed identity data, filenames or photos.
export function saveTariffProgress(state: TariffState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        page: state.page,
        drawer: state.drawer,
        submitted: state.submitted,
        tour: state.tour,
        guiding: state.guiding,
        attachment: Boolean(state.attachment),
        filled: Object.keys(DEMO_FIELDS).filter((key) => {
          const name = key as FieldName;
          return state.values[name] === DEMO_FIELDS[name];
        }),
      }),
    );
  } catch {
    /* file:// or private browsing may deny storage; the flow still works. */
  }
}

export function loadTariffProgress(): TariffState {
  const initial = initialTariffState();
  try {
    const raw: unknown = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? 'null',
    );
    if (
      !raw ||
      typeof raw !== 'object' ||
      !('version' in raw) ||
      raw.version !== 1
    )
      return initial;
    const saved = raw as Record<string, unknown>;
    const filled = Array.isArray(saved.filled) ? saved.filled : [];
    const values = { ...initial.values };
    for (const name of Object.keys(DEMO_FIELDS) as FieldName[]) {
      if (filled.includes(name)) values[name] = DEMO_FIELDS[name];
    }
    const steps: TourStep[] = [
      'welcome',
      'navigation',
      'request',
      'details',
      'send',
      'complete',
    ];
    const state: TariffState = {
      ...initial,
      values,
      page: saved.page === 'tariff' ? 'tariff' : 'home',
      drawer: saved.drawer === true,
      attachment: saved.attachment === true ? DEMO_SELFIE : '',
      submitted: saved.submitted === true,
      guiding: saved.guiding !== false,
      tour: steps.includes(saved.tour as TourStep)
        ? (saved.tour as TourStep)
        : 'welcome',
    };
    if (state.submitted) {
      state.drawer = false;
      state.tour = 'complete';
    } else if (state.tour === 'complete') state.tour = 'navigation';
    else if (state.tour === 'send' && !formReady(state)) state.tour = 'details';
    return state;
  } catch {
    return initial;
  }
}

export function clearTariffProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* No storage is required. */
  }
}
