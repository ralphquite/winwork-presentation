export const TOP_UP_BANKS = [
  {
    id: 'tbank',
    label: 'Т-банк',
    account: '4070 2800 0000 0000 0000',
    bic: '000 000 000',
    correspondent: '3010 1800 0000 0000 0000',
  },
  {
    id: 'dolinsk',
    label: 'Банк Долинск',
    account: '4070 2800 0000 0000 0001',
    bic: '000 000 001',
    correspondent: '3010 1800 0000 0000 0001',
  },
  {
    id: 'tkb',
    label: 'ТКБ',
    account: '4070 2800 0000 0000 0002',
    bic: '000 000 002',
    correspondent: '3010 1800 0000 0000 0002',
  },
] as const;
export type TopUpBankId = (typeof TOP_UP_BANKS)[number]['id'];

export function getBankRequisites(bankId: TopUpBankId): [string, string][] {
  const bank = TOP_UP_BANKS.find(({ id }) => id === bankId)!;
  return [
    ['Расчетный счет', bank.account],
    ['БИК', bank.bic],
    ['Наименование банка', `${bank.label} (демо)`],
    ['Корреспондентский счет', bank.correspondent],
    ['ИНН', '7700000000'],
    ['КПП', '770001001'],
    ['Получатель платежа', 'ООО «Север Логистика — Демо»'],
  ];
}
export const DEMO_PAYMENT_PURPOSE =
  'Пополнение счета по публичной оферте сервиса WinWork по адресу docs.winwork.pro/public_offer. НДС не облагается';

export async function copyDemoRequisite(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    // file:// may not expose Clipboard API; a user-click fallback stays local.
    const focus = document.activeElement;
    const field = document.createElement('textarea');
    field.value = value;
    field.readOnly = true;
    field.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.append(field);
    field.select();
    try {
      return document.execCommand('copy');
    } catch {
      return false;
    } finally {
      field.remove();
      if (focus instanceof HTMLElement) focus.focus({ preventScroll: true });
    }
  }
}
