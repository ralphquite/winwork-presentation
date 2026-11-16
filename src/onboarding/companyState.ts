export const COMPANY_STORAGE_KEY = 'winwork.onboarding.company.v1';
export const COMPANY_FIELDS = {
  brandName: 'Север Логистика · Демо',
  description:
    'Демонстрационная компания: организуем доставку и работу складов. Все сведения в этом профиле вымышлены.',
  address: 'г. Москва, ул. Примерная, д. 12',
  website: 'https://sever-logistics.example',
  phone: '+7 (000) 123-45-67',
  email: 'info@sever-logistics.example',
} as const;
export type CompanyField = keyof typeof COMPANY_FIELDS;
export const COMPANY_FIELD_NAMES = Object.keys(
  COMPANY_FIELDS,
) as CompanyField[];
export type CompanyTour =
  'welcome' | 'navigation' | 'tab' | 'details' | 'save' | 'complete';
export type CompanyState = {
  page: 'home' | 'settings';
  filled: CompanyField[];
  logo: boolean;
  saved: boolean;
  tour: CompanyTour;
  guiding: boolean;
};
export function initialCompanyState(): CompanyState {
  return {
    page: 'home',
    filled: [],
    logo: false,
    saved: false,
    tour: 'welcome',
    guiding: true,
  };
}
export function companyReady(state: CompanyState) {
  return (
    state.logo &&
    COMPANY_FIELD_NAMES.every((name) => state.filled.includes(name))
  );
}
export function saveCompanyProgress(state: CompanyState) {
  try {
    localStorage.setItem(
      COMPANY_STORAGE_KEY,
      JSON.stringify({ version: 1, ...state }),
    );
  } catch {
    /* The current session works without storage. */
  }
}
export function loadCompanyProgress(): CompanyState {
  const initial = initialCompanyState();
  try {
    const raw: unknown = JSON.parse(
      localStorage.getItem(COMPANY_STORAGE_KEY) ?? 'null',
    );
    if (
      !raw ||
      typeof raw !== 'object' ||
      !('version' in raw) ||
      raw.version !== 1
    )
      return initial;
    const saved = raw as Record<string, unknown>;
    const steps: CompanyTour[] = [
      'welcome',
      'navigation',
      'tab',
      'details',
      'save',
      'complete',
    ];
    const state: CompanyState = {
      page: saved.page === 'settings' ? 'settings' : 'home',
      filled: COMPANY_FIELD_NAMES.filter(
        (name) => Array.isArray(saved.filled) && saved.filled.includes(name),
      ),
      logo: saved.logo === true,
      saved: saved.saved === true,
      guiding: saved.guiding !== false,
      tour: steps.includes(saved.tour as CompanyTour)
        ? (saved.tour as CompanyTour)
        : 'welcome',
    };
    state.saved = state.saved && companyReady(state);
    if (state.saved) state.tour = 'complete';
    else if (state.tour === 'complete' || state.tour === 'save')
      state.tour = companyReady(state) ? 'save' : 'details';
    return state;
  } catch {
    return initial;
  }
}
export function clearCompanyProgress() {
  try {
    localStorage.removeItem(COMPANY_STORAGE_KEY);
  } catch {
    /* Storage is optional. */
  }
}
