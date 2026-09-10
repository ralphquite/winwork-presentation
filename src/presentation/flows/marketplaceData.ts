export type MarketplaceTask = {
  count: string;
  created: string;
  number: string;
  performer: string;
  startDate: string;
  startTime: string;
  status:
    | 'ОПЛАТА'
    | 'ВЫПОЛНЕН'
    | 'ЕСТЬ ОТКЛИКИ'
    | 'ВЫПОЛНЯЕТСЯ'
    | 'ОПЛАЧЕН'
    | 'НА МОДЕРАЦИИ';
  taxId: string;
  title: string;
  total: string;
};

export const MARKETPLACE_TASKS: readonly MarketplaceTask[] = [
  {
    count: '1',
    created: '05.09.2026',
    number: 'd3a5c8f1',
    performer: 'Соколов А. В.',
    startDate: '10.09.2026',
    startTime: '09:00',
    status: 'ОПЛАТА',
    taxId: '770000000001',
    title: 'Грузчик. Разгрузка и размещение утренней поставки',
    total: '12 800,00 ₽',
  },
  {
    count: '2',
    created: '04.09.2026',
    number: 'a8f2e4b6',
    performer: 'Кузнецова Е. М.',
    startDate: '10.09.2026',
    startTime: '12:00',
    status: 'ВЫПОЛНЕН',
    taxId: '780000000002',
    title: 'Комплектовщик. Сборка интернет-заказов к отправке',
    total: '8 400,00 ₽',
  },
  {
    count: '1',
    created: '03.09.2026',
    number: 'c7b1d9e3',
    performer: '—',
    startDate: '11.09.2026',
    startTime: '09:00',
    status: 'ЕСТЬ ОТКЛИКИ',
    taxId: '',
    title: 'Кладовщик. Инвентаризация сектора хранения',
    total: '6 200,00 ₽',
  },
  {
    count: '1',
    created: '02.09.2026',
    number: 'f4c8a2d5',
    performer: 'Морозов И. А.',
    startDate: '11.09.2026',
    startTime: '14:30',
    status: 'ВЫПОЛНЯЕТСЯ',
    taxId: '660000000004',
    title: 'Работник склада. Сортировка и маркировка товара',
    total: '7 200,00 ₽',
  },
  {
    count: '1',
    created: '01.09.2026',
    number: 'b6e3c1a9',
    performer: 'Орлов Д. С.',
    startDate: '09.09.2026',
    startTime: '16:00',
    status: 'ОПЛАЧЕН',
    taxId: '500000000003',
    title: 'Грузчик. Погрузка готовой продукции в транспорт',
    total: '4 800,00 ₽',
  },
  {
    count: '3',
    created: '31.08.2026',
    number: 'e2d7f5b4',
    performer: '—',
    startDate: '12.09.2026',
    startTime: '08:30',
    status: 'НА МОДЕРАЦИИ',
    taxId: '',
    title: 'Комплектовщик. Подготовка заказов для курьерской службы',
    total: '19 200,00 ₽',
  },
];
