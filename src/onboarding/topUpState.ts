import type { TopUpBankId } from './bankRequisites';

export const TOP_UP_STORAGE_KEY = 'winwork.onboarding.topup.v1';
export type InvoiceProgress = {
  bank: TopUpBankId;
  format: 'PDF' | 'XLSX';
  filled: boolean;
  prepared: boolean;
};
export type TopUpTour =
  | 'welcome'
  | 'navigation'
  | 'methods'
  | 'tab'
  | 'amount'
  | 'download'
  | 'complete';
export type TopUpState = {
  page: 'home' | 'tariff' | 'topup';
  invoice: InvoiceProgress;
  tour: TopUpTour;
  guiding: boolean;
};
export function initialTopUpState(): TopUpState {
  return {
    page: 'home',
    invoice: { bank: 'tbank', format: 'PDF', filled: false, prepared: false },
    tour: 'welcome',
    guiding: true,
  };
}
export function saveTopUpProgress(state: TopUpState) {
  try {
    localStorage.setItem(
      TOP_UP_STORAGE_KEY,
      JSON.stringify({ version: 3, ...state }),
    );
  } catch {
    /* The in-memory flow also works when file:// storage is unavailable. */
  }
}
export function loadTopUpProgress(): TopUpState {
  const initial = initialTopUpState();
  try {
    const raw: unknown = JSON.parse(
      localStorage.getItem(TOP_UP_STORAGE_KEY) ?? 'null',
    );
    if (
      !raw ||
      typeof raw !== 'object' ||
      !('version' in raw) ||
      (raw.version !== 1 && raw.version !== 2 && raw.version !== 3)
    )
      return initial;
    const saved = raw as Record<string, unknown>;
    const invoice =
      saved.invoice && typeof saved.invoice === 'object'
        ? (saved.invoice as Record<string, unknown>)
        : {};
    const tours: TopUpTour[] = [
      'welcome',
      'navigation',
      'methods',
      'tab',
      'amount',
      'download',
      'complete',
    ];
    const state: TopUpState = {
      page:
        saved.page === 'invoice' ||
        saved.page === 'topup' ||
        (raw.version === 1 && saved.page === 'tariff')
          ? 'topup'
          : saved.page === 'tariff'
            ? 'tariff'
            : 'home',
      guiding: saved.guiding !== false,
      invoice: {
        bank:
          invoice.bank === 'dolinsk' || invoice.bank === 'tkb'
            ? invoice.bank
            : 'tbank',
        format: invoice.format === 'XLSX' ? 'XLSX' : 'PDF',
        filled: invoice.filled === true,
        prepared: invoice.prepared === true && invoice.filled === true,
      },
      tour:
        saved.tour === 'invoice'
          ? 'amount'
          : tours.includes(saved.tour as TopUpTour)
            ? (saved.tour as TopUpTour)
            : 'welcome',
    };
    if (state.invoice.prepared) state.tour = 'complete';
    else if (state.tour === 'complete' || state.tour === 'download')
      state.tour = state.invoice.filled ? 'download' : 'amount';
    return state;
  } catch {
    return initial;
  }
}
export function resumeTopUp(state: TopUpState): TopUpState {
  const tour = state.invoice.prepared
    ? 'complete'
    : state.tour === 'welcome'
      ? 'navigation'
      : state.tour;
  return {
    ...state,
    guiding: true,
    tour,
    page: tour === 'navigation' ? 'home' : tour === 'tab' ? 'tariff' : 'topup',
  };
}
export function clearTopUpProgress() {
  try {
    localStorage.removeItem(TOP_UP_STORAGE_KEY);
  } catch {
    /* Storage is optional. */
  }
}
