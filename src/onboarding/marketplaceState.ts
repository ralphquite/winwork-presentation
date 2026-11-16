export const MARKETPLACE_STORAGE_KEY = 'winwork.onboarding.marketplace.v1';
export const TASK_FIELDS = {
  name: 'ДЕМО — подготовка карточек товаров',
  region: 'Москва',
  city: 'Москва',
  street: 'ул. Демонстрационная',
  house: '1',
  block: '1',
  flat: '1',
  count: '1',
  activity: 'Контент-менеджер',
  price: '1 500,00 ₽',
  payment: 'За задание',
  startDate: '22.09.2026',
  startTime: '10:00',
  endDate: '23.09.2026',
  endTime: '18:00',
  work: 'Подготовить описания для 10 демонстрационных карточек товаров',
  extraWork: 'Проверить заголовки и характеристики демонстрационных товаров',
  info: 'Демонстрационное задание. Все сведения вымышлены, реальное выполнение не требуется.',
  comment: 'Первое задание · учебный пример',
  template: 'Новый типовой акт для заказов',
} as const;
export type TaskField = keyof typeof TASK_FIELDS;
export const TASK_FIELD_NAMES = Object.keys(TASK_FIELDS) as TaskField[];
export const TASK_AUDIENCES = [
  'Самозанятые',
  'ИП',
  'ИП на НПД',
  'ГПХ',
] as const;
export type TaskAudience = (typeof TASK_AUDIENCES)[number];
export type MarketplaceTour =
  | 'welcome'
  | 'navigation'
  | 'create'
  | 'details'
  | 'save'
  | 'review'
  | 'complete';
export type MarketplaceState = {
  page: 'home' | 'marketplace';
  panel: 'none' | 'create' | 'detail';
  filled: TaskField[];
  remote: boolean;
  extraWork: boolean;
  audiences: TaskAudience[];
  citizens: boolean;
  created: boolean;
  viewed: boolean;
  tour: MarketplaceTour;
  guiding: boolean;
};
export function initialMarketplaceState(): MarketplaceState {
  return {
    page: 'home',
    panel: 'none',
    filled: ['count', 'payment'],
    remote: false,
    extraWork: false,
    audiences: [],
    citizens: false,
    created: false,
    viewed: false,
    tour: 'welcome',
    guiding: true,
  };
}
export function taskFieldsFor(state: MarketplaceState): TaskField[] {
  return TASK_FIELD_NAMES.filter(
    (name) =>
      (name !== 'extraWork' || state.extraWork) &&
      (!state.remote || !['street', 'house', 'block', 'flat'].includes(name)),
  );
}
export function taskReady(state: MarketplaceState) {
  return (
    taskFieldsFor(state).every((name) => state.filled.includes(name)) &&
    state.audiences.length > 0
  );
}
export function resumeMarketplace(state: MarketplaceState): MarketplaceState {
  const tour = state.viewed
    ? 'complete'
    : state.created
      ? 'review'
      : state.tour === 'welcome'
        ? 'navigation'
        : state.tour;
  return {
    ...state,
    guiding: true,
    tour,
    page: tour === 'navigation' ? 'home' : 'marketplace',
    panel:
      tour === 'complete'
        ? 'detail'
        : ['details', 'save'].includes(tour)
          ? 'create'
          : 'none',
  };
}
export function saveMarketplaceProgress(state: MarketplaceState) {
  try {
    localStorage.setItem(
      MARKETPLACE_STORAGE_KEY,
      JSON.stringify({ version: 1, ...state }),
    );
  } catch {
    /* Storage is optional. */
  }
}
export function loadMarketplaceProgress(): MarketplaceState {
  const initial = initialMarketplaceState();
  try {
    const raw: unknown = JSON.parse(
      localStorage.getItem(MARKETPLACE_STORAGE_KEY) ?? 'null',
    );
    if (
      !raw ||
      typeof raw !== 'object' ||
      !('version' in raw) ||
      raw.version !== 1
    )
      return initial;
    const saved = raw as Record<string, unknown>;
    const tours: MarketplaceTour[] = [
      'welcome',
      'navigation',
      'create',
      'details',
      'save',
      'review',
      'complete',
    ];
    const state: MarketplaceState = {
      page: saved.page === 'marketplace' ? 'marketplace' : 'home',
      panel:
        saved.panel === 'create' || saved.panel === 'detail'
          ? saved.panel
          : 'none',
      filled: TASK_FIELD_NAMES.filter(
        (name) => Array.isArray(saved.filled) && saved.filled.includes(name),
      ),
      audiences: TASK_AUDIENCES.filter(
        (name) =>
          Array.isArray(saved.audiences) && saved.audiences.includes(name),
      ),
      remote: saved.remote === true,
      extraWork: saved.extraWork === true,
      citizens: saved.citizens === true,
      created: saved.created === true,
      viewed: saved.viewed === true,
      tour: tours.includes(saved.tour as MarketplaceTour)
        ? (saved.tour as MarketplaceTour)
        : 'welcome',
      guiding: saved.guiding !== false,
    };
    state.created = state.created && taskReady(state);
    state.viewed = state.created && state.viewed;
    if (state.created) state.tour = state.viewed ? 'complete' : 'review';
    else if (['save', 'review', 'complete'].includes(state.tour))
      state.tour = taskReady(state) ? 'save' : 'details';
    if (state.panel === 'detail' && !state.created) state.panel = 'none';
    if (state.panel === 'create' && state.created) state.panel = 'none';
    if (state.page === 'home') state.panel = 'none';
    return state;
  } catch {
    return initial;
  }
}
export function clearMarketplaceProgress() {
  try {
    localStorage.removeItem(MARKETPLACE_STORAGE_KEY);
  } catch {
    /* Storage is optional. */
  }
}
