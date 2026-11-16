export const columns = {
  name: { label: 'ФИО в ФНС и ИНН', width: 218 },
  country: { label: 'Страна', width: 80 },
  status: { label: 'Статус', width: 91 },
  added: { label: 'Добавлен', width: 102 },
  taxApp: { label: 'Мой налог', width: 113 },
  tax: { label: 'НПД', width: 65 },
  contract: { label: 'Договор', width: 103 },
  consent: { label: 'ПДн', width: 65 },
  documents: { label: 'ЭДО', width: 65 },
  payment: { label: 'Оплата', width: 80 },
  note: { label: 'Примечание', width: 164 },
};

export type ColumnId = keyof typeof columns;
export type Sort = { column: ColumnId; direction: 'asc' | 'desc' };
export type Filter = {
  column: ColumnId;
  value: string;
  values?: string[];
  end?: string;
};
export type DocumentStatus =
  | 'created'
  | 'in_progress'
  | 'need_sign'
  | 'signed'
  | 'canceled'
  | 'missing'
  | '';
export type Performer = {
  id: number;
  name: string;
  taxId: string;
  blocked: boolean;
  country: '' | 'ru' | 'by' | 'kz' | 'am' | 'kg' | 'in';
  status: 'СМЗ' | 'ГПХ' | 'ИП' | 'ИП на НПД';
  added: string;
  taxApp: '' | 'connected' | 'disconnected' | 'not_applicable';
  // This is permission to pay NPD, not the worker's tax registration status.
  tax: boolean | null;
  contract: DocumentStatus;
  consent: DocumentStatus;
  documents: DocumentStatus;
  // Payment stores the available requisites, not permission to make a payout.
  payment: 'missing' | 'card' | 'sbp' | 'account';
  note: string;
};

export const columnIds = Object.keys(columns) as ColumnId[];
export type ChoiceColumnId = Exclude<ColumnId, 'name' | 'note' | 'added'>;
export type CellOption = { value: string; label: string; icon?: string };
const documentOptions: CellOption[] = [
  { value: '', label: 'Нет данных' },
  { value: 'missing', label: 'Отсутствует', icon: 'state-denied' },
  { value: 'created', label: 'Создан', icon: 'document-state-created' },
  { value: 'in_progress', label: 'В процессе подписания', icon: 'status-pace' },
  {
    value: 'need_sign',
    label: 'Требует подписи',
    icon: 'document-state-signature',
  },
  { value: 'signed', label: 'Подписан', icon: 'status-check' },
  { value: 'canceled', label: 'Отменён', icon: 'status-close' },
];

export const cellOptions: Record<ChoiceColumnId, CellOption[]> = {
  country: [
    { value: '', label: 'Не указана' },
    { value: 'am', label: 'Армения', icon: 'am' },
    { value: 'by', label: 'Беларусь', icon: 'by' },
    { value: 'in', label: 'Индия', icon: 'in' },
    { value: 'kz', label: 'Казахстан', icon: 'kz' },
    { value: 'kg', label: 'Кыргызстан', icon: 'kg' },
    { value: 'ru', label: 'Россия', icon: 'ru' },
  ],
  status: ['СМЗ', 'ИП на НПД', 'ИП', 'ГПХ'].map((value) => ({
    value,
    label: value,
  })),
  taxApp: [
    { value: '', label: 'Нет данных' },
    {
      value: 'disconnected',
      label: 'Не подключён',
      icon: 'icon-moi-nalog-red',
    },
    { value: 'connected', label: 'Подключён', icon: 'icon-moi-nalog' },
    { value: 'not_applicable', label: 'Не применяется' },
  ],
  tax: [
    { value: '', label: 'Нет данных' },
    {
      value: 'false',
      label: 'Права на уплату НПД не предоставлены',
      icon: 'status-close',
    },
    {
      value: 'true',
      label: 'Права на уплату НПД предоставлены',
      icon: 'status-check',
    },
  ],
  contract: documentOptions,
  consent: documentOptions,
  documents: documentOptions,
  payment: [
    { value: 'missing', label: 'Реквизиты не указаны', icon: 'state-denied' },
    { value: 'card', label: 'Банковская карта', icon: 'icon-card' },
    { value: 'sbp', label: 'СБП', icon: 'icon-sbp' },
    { value: 'account', label: 'Банковский счёт', icon: 'icon-account' },
  ],
};

export function cellValue(row: Performer, column: ColumnId): string {
  const value = row[column];
  return value === null ? '' : String(value);
}

export function cellLabel(column: ColumnId, value: string): string {
  if (isChoiceColumn(column))
    return (
      cellOptions[column].find((option) => option.value === value)?.label ??
      'Нет данных'
    );
  return column === 'added' ? formatDate(value) : value;
}

export function sortLabel(column: ColumnId, direction: Sort['direction']) {
  if (column === 'added')
    return direction === 'asc' ? 'Сначала старые' : 'Сначала новые';
  if (isChoiceColumn(column) && column !== 'country')
    return direction === 'asc' ? 'По порядку значений' : 'В обратном порядке';
  return direction === 'asc' ? 'От А до Я' : 'От Я до А';
}

const names = [
  'Алексей Воронцов',
  'Вероника Сомова',
  'Олег Белозёров',
  'Дарья Лаврова',
  'Никита Речкин',
  'Полина Кедрова',
  'Марат Тихонов',
  'Вера Снегирёва',
  'Илья Соснов',
  'Анна Грачева',
  'Тимур Яшин',
  'Ольга Ольхова',
  'Роман Руднев',
  'Алина Дымова',
  'Артём Ветров',
  'Лилия Мирная',
  'Виктор Лесин',
  'Софья Клёнова',
  'Денис Истомин',
  'Елена Лунёва',
  'Вадим Тополев',
  'Мила Березина',
  'Павел Луговой',
  'Арина Соколова',
  'Руслан Мелихов',
  'Марина Веснина',
  'Глеб Стрижин',
  'Юлия Ясная',
  'Семён Липатов',
  'Светлана Зорина',
  'Максим Рассветов',
  'Ирина Боровая',
];

// Synthetic fixtures cover the cell states observed in the dev table.
// Identity values and row combinations are deliberately fictional.
const countries: Performer['country'][] = [
  'ru',
  'by',
  'kz',
  'am',
  '',
  'kg',
  'in',
];
const documentStates: DocumentStatus[] = [
  'signed',
  'in_progress',
  'need_sign',
  '',
  'created',
  'canceled',
  'missing',
];
const paymentMethods: Performer['payment'][] = [
  'missing',
  'card',
  'sbp',
  'account',
];
const taxStatuses: Performer['status'][] = [
  'СМЗ',
  'СМЗ',
  'ИП на НПД',
  'ГПХ',
  'СМЗ',
  'ИП',
];
const notes = ['Объект 1', '', 'Объект 2', '', '', 'Объект 3', '', ''];

export const performers: Performer[] = names.map((name, id) => {
  const status = taxStatuses[id % taxStatuses.length]!;
  const usesNpd = status === 'СМЗ' || status === 'ИП на НПД';
  return {
    id,
    name,
    blocked: id >= 30,
    taxId: `00••••••${String(id + 101).padStart(4, '0')}`,
    country: countries[id % countries.length]!,
    status,
    added: `2026-${String(10 - Math.floor(id / 12)).padStart(2, '0')}-${String(28 - (id % 12) * 2).padStart(2, '0')}`,
    taxApp: !usesNpd
      ? 'not_applicable'
      : id % 7 === 4
        ? ''
        : id % 3 === 0
          ? 'connected'
          : 'disconnected',
    tax: usesNpd && id % 3 === 0,
    contract: documentStates[id % documentStates.length]!,
    consent: documentStates[(id + 2) % documentStates.length]!,
    documents: documentStates[(id + 4) % documentStates.length]!,
    payment: paymentMethods[id % paymentMethods.length]!,
    note: notes[id % notes.length]!,
  };
});

export function isChoiceColumn(id: ColumnId): id is ChoiceColumnId {
  return id !== 'name' && id !== 'note' && id !== 'added';
}

export function formatDate(date: string) {
  return date.split('-').reverse().join('.');
}

export function formatFilter(filter: Filter) {
  if (isChoiceColumn(filter.column))
    return (filter.values ?? [filter.value])
      .map((value) => cellLabel(filter.column, value))
      .join(', ');
  if (filter.column !== 'added') return filter.value || 'Пусто';
  return [
    filter.value && `с ${formatDate(filter.value)}`,
    filter.end && `по ${formatDate(filter.end)}`,
  ]
    .filter(Boolean)
    .join(' ');
}

const collator = new Intl.Collator('ru', {
  numeric: true,
  sensitivity: 'base',
});

function includesText(text: string, query: string) {
  const normalize = (value: string) =>
    value.toLocaleLowerCase('ru').replaceAll('ё', 'е');
  return normalize(text).includes(normalize(query.trim()));
}

export function findPerformers(
  blocked: boolean,
  search: string,
  filters: Filter[],
  sorts: Sort[],
) {
  return performers
    .filter(
      (row) =>
        row.blocked === blocked &&
        includesText(`${row.name} ${row.taxId}`, search) &&
        filters.every(({ column, value, values, end }) => {
          if (column === 'added') {
            return (!value || row.added >= value) && (!end || row.added <= end);
          }
          if (isChoiceColumn(column))
            return (values ?? [value]).includes(cellValue(row, column));
          if (column === 'name')
            return includesText(`${row.name} ${row.taxId}`, value);
          return includesText(cellValue(row, column), value);
        }),
    )
    .sort((left, right) => {
      for (const { column, direction } of sorts) {
        const difference =
          isChoiceColumn(column) && column !== 'country'
            ? cellOptions[column].findIndex(
                (option) => option.value === cellValue(left, column),
              ) -
              cellOptions[column].findIndex(
                (option) => option.value === cellValue(right, column),
              )
            : collator.compare(
                column === 'country'
                  ? cellLabel(column, left.country)
                  : cellValue(left, column),
                column === 'country'
                  ? cellLabel(column, right.country)
                  : cellValue(right, column),
              );
        if (difference) return direction === 'asc' ? difference : -difference;
      }
      return left.id - right.id;
    });
}

export type View = {
  order: ColumnId[];
  hidden: ColumnId[];
  widths: Partial<Record<ColumnId, number>>;
  density: 44 | 56 | 64;
  fontSize: 12 | 13 | 14;
  pageSize: 10 | 20 | 50;
};

export const defaultView: View = {
  order: columnIds,
  hidden: [],
  widths: {},
  density: 56,
  fontSize: 12,
  pageSize: 10,
};

const viewKey = 'winwork-performers-view-v1';

export function columnWidth(id: ColumnId, width: number) {
  const min = Math.min(columns[id].width, id === 'name' ? 144 : 85);
  return Math.min(480, Math.max(min, Math.round(width)));
}

export function readView(): View {
  try {
    const saved = JSON.parse(
      localStorage.getItem(viewKey) ?? '{}',
    ) as Partial<View>;
    const order = Array.isArray(saved.order) ? saved.order : [];
    const hidden = Array.isArray(saved.hidden) ? saved.hidden : [];
    return {
      order: [
        ...new Set<ColumnId>([
          'name',
          ...order.filter((id) => columnIds.includes(id)),
          ...columnIds,
        ]),
      ],
      hidden: columnIds.filter((id) => id !== 'name' && hidden.includes(id)),
      widths: Object.fromEntries(
        columnIds.flatMap((id) => {
          const width = saved.widths?.[id];
          return typeof width === 'number' && Number.isFinite(width)
            ? [[id, columnWidth(id, width)]]
            : [];
        }),
      ),
      density:
        saved.density === 44 || saved.density === 64 ? saved.density : 56,
      fontSize:
        saved.fontSize === 13 || saved.fontSize === 14 ? saved.fontSize : 12,
      pageSize:
        saved.pageSize === 20 || saved.pageSize === 50 ? saved.pageSize : 10,
    };
  } catch {
    return defaultView;
  }
}

export function saveView(view: View) {
  try {
    localStorage.setItem(viewKey, JSON.stringify(view));
  } catch {
    // Settings remain available for the open document if local storage is blocked.
  }
}

export function moveColumn(
  order: ColumnId[],
  from: ColumnId,
  to: ColumnId,
  side: 'before' | 'after',
) {
  if (from === to || from === 'name' || to === 'name') return order;
  const next = order.filter((id) => id !== from);
  next.splice(next.indexOf(to) + Number(side === 'after'), 0, from);
  return next;
}
