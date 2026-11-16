export type DesktopRole = 'customer' | 'contractor';
export type ContractingRole = DesktopRole | 'performer';

// Registration numbers have invalid checksums; contact numbers are masked.
export const companies = {
  customer: {
    name: 'ООО «Тихий ряд»',
    brand: 'Тихий ряд',
    taxId: '7728463174',
    registrationNumber: '1267746285136',
    address: 'г. Москва, Логистический проезд, д. 14',
    phone: '+7 (495) •••-37-24',
    account: '1209',
    balance: '122 784,00 ₽',
  },
  contractor: {
    name: 'ООО «Такт Персонал»',
    brand: 'Такт Персонал',
    taxId: '7719642836',
    address: 'г. Москва, ул. Литейная, д. 8',
    phone: '+7 (495) •••-61-08',
    account: '1846',
    balance: '38 420,00 ₽',
    memberSince: '2026',
    completedTasks: '1 203',
    commission: '12%',
    minimum: '500 ₽',
  },
} as const;

export const clientCompanies = {
  warehouse: { name: 'ООО «Северный стеллаж»', taxId: '7729631520' },
  supplier: { name: 'ООО «Медный лист»', taxId: '7713846270' },
} as const;

export const task = {
  title: 'Грузчик. Разгрузка товара на складе',
  number: 'a3f640c1',
  created: '21.08.2026',
  startDate: '25.08.2026',
  mobileDate: '25 августа',
  startTime: '09:00',
  endTime: '22:00',
  duration: '13 часов',
  address: companies.customer.address,
  object: 'Склад «Тихий ряд»',
  reward: '13 000 ₽',
  commission: '1 560 ₽',
  total: '14 560 ₽',
  rate: '1 000 ₽',
  description:
    'Разгрузить коробки с товарами и переместить их в зону приёмки склада.',
  performer: {
    name: 'Алексей Воронцов',
    initials: 'АВ',
    taxId: '772846193754',
    phone: '+7 (9••) •••-21-64',
  },
} as const;
