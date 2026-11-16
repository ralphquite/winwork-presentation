import type { ReactNode } from 'react';

import type {
  ComponentSceneDefinition,
  PresentationConfig,
} from '../presentation/engine/types';
import { ContractingPartners, type PartnerState } from './ContractingPartners';
import {
  ContractingPerformer,
  type PerformerState,
} from './ContractingPerformer';
import {
  ContractingSettlement,
  type SettlementState,
} from './ContractingSettlement';
import {
  ContractingTaskScreen,
  type TaskScreenState,
} from './ContractingTaskScreen';
import type { ContractingRole, DesktopRole } from './fixtures';
import { contractingIntroSlides } from './introSlides';

declare const __CONTRACTING_ROLE__: DesktopRole | null;
declare const __CONTRACTING_WITH_SLIDES__: boolean;

const contractingRole = __CONTRACTING_ROLE__;

type Screen = Omit<ComponentSceneDefinition, 'type'>;
type Stage = {
  order: number;
  title: string;
  role: ContractingRole;
  screens: readonly [Screen, ...Screen[]];
};

function editionCopy(full: string, focused: string) {
  return contractingRole === null ? full : focused;
}

function screen(
  id: string,
  title: string,
  description: string,
  content: ReactNode,
): Screen {
  return { id, title, description, content };
}

function partner(
  state: PartnerState,
  title: string,
  description: string,
): Screen {
  return screen(
    state,
    title,
    description,
    <ContractingPartners state={state} />,
  );
}

function task(
  state: TaskScreenState,
  title: string,
  description: string,
): Screen {
  return screen(
    state,
    title,
    description,
    <ContractingTaskScreen state={state} />,
  );
}

function performer(
  state: PerformerState,
  title: string,
  description: string,
): Screen {
  return screen(
    `performer-${state}`,
    title,
    description,
    <ContractingPerformer state={state} />,
  );
}

function settlement(
  state: SettlementState,
  title: string,
  description: string,
): Screen {
  return screen(
    state,
    title,
    description,
    <ContractingSettlement state={state} />,
  );
}

function customerStages(): Stage[] {
  return [
    {
      order: 1,
      title: 'Подключение подрядчиков',
      role: 'customer',
      screens: [
        partner(
          'customer-intro',
          'Подключение подрядчиков',
          'Заказчик открывает раздел «Подрядная схема» и подключает работу через подрядчиков.',
        ),
        partner(
          'customer-enabled',
          'Мои подрядчики',
          'Режим подключён. Список пока пуст: можно добавить первого подрядчика.',
        ),
        partner(
          'customer-search',
          'Поиск подрядчика',
          'В панели можно найти подрядчика по названию, ИНН или городу и посмотреть условия.',
        ),
        partner(
          'customer-offer',
          'Предложение о сотрудничестве',
          'Заказчик знакомится с условиями, подписывает договор и направляет предложение.',
        ),
      ],
    },
    {
      order: 3,
      title: editionCopy('Договор у заказчика', 'Договор с подрядчиком'),
      role: 'customer',
      screens: [
        partner(
          'customer-sent',
          'Предложение отправлено',
          'До принятия предложения заказчик видит, что договор подписан с его стороны и ожидает подписи подрядчика.',
        ),
        partner(
          'customer-linked',
          'Подрядчик подключён',
          editionCopy(
            'Договор подписан обеими сторонами. Теперь можно публиковать задания через подрядчика.',
            'Подрядчик принял предложение и подписал договор. Теперь заказчик может размещать задания через него.',
          ),
        ),
      ],
    },
    {
      order: 5,
      title: 'Публикация задания',
      role: 'customer',
      screens: [
        task(
          'marketplace',
          'Маркетплейс заказчика',
          'Заказчик нажимает «Разместить заказ». Задания по подрядной схеме можно найти с помощью фильтра и колонки «Подрядчик».',
        ),
        task(
          'create',
          'Публикация через подрядчика',
          'Заказчик выбирает подключённого подрядчика, проверяет вознаграждение и комиссию, затем создаёт задание.',
        ),
        task(
          'published',
          'Задание опубликовано',
          'Новое задание появляется в «Маркетплейсе». В документах оно оформлено от имени подрядчика.',
        ),
      ],
    },
    {
      order: 7,
      title: 'Назначение исполнителя',
      role: 'customer',
      screens: [
        task(
          'customer-task',
          'Есть отклики',
          'В карточке задания заказчик переходит к откликам исполнителей.',
        ),
        task(
          'customer-responses',
          'Выбор исполнителя',
          'Во вкладке «Отклики» заказчик выбирает исполнителя и нажимает «Назначить».',
        ),
      ],
    },
    {
      order: 11,
      title: 'Ожидание подписи подрядчика',
      role: 'customer',
      screens: [
        settlement(
          'customer-work-confirmed',
          'Исполнитель подтвердил выполнение',
          'Заказчик видит подтверждение исполнителя. Для оплаты нужна подпись подрядчика на акте.',
        ),
      ],
    },
    {
      order: 13,
      title: editionCopy('Оплата заказчиком', 'Приёмка и оплата'),
      role: 'customer',
      screens: [
        settlement(
          'customer-payment',
          'Задание готово к оплате',
          'Подрядчик подписал задание и акт. Заказчик принимает работу и переходит к оплате.',
        ),
        settlement(
          'customer-payment-code',
          'Подтверждение по СМС',
          'После принятия документ подписан обеими сторонами. Заказчик подтверждает оплату кодом из СМС.',
        ),
        settlement(
          'customer-payment-sent',
          'Оплата отправлена',
          'Оплата отправлена. Подписанный документ доступен во вкладке «Документы».',
        ),
        settlement(
          'customer-documents',
          'Документы заказчика',
          'После оплаты заказчик видит задание и акт, подписанные им и подрядчиком.',
        ),
      ],
    },
  ];
}

function contractorStages(): Stage[] {
  return [
    {
      order: 2,
      title: 'Режим подрядчика',
      role: 'contractor',
      screens: [
        partner(
          'contractor-intro',
          'Стать подрядчиком',
          'Компания подаёт заявку, чтобы размещать задания от своего имени для клиентов.',
        ),
        partner(
          'contractor-review',
          'Заявка на рассмотрении',
          'До подключения в кабинете виден статус заявки.',
        ),
        partner(
          'contractor-clients',
          'Клиенты подрядчика',
          editionCopy(
            'После подключения подрядчик открывает предложение заказчика в списке клиентов.',
            'Режим подключён. Заказчик подписал договор со своей стороны и отправил предложение. Подрядчик открывает его в списке клиентов.',
          ),
        ),
        partner(
          'contractor-offer',
          'Принятие предложения',
          'Подрядчик открывает предложение заказчика. Здесь он может принять его и подписать договор.',
        ),
      ],
    },
    {
      order: 4,
      title: editionCopy('Договор у подрядчика', 'Договор с заказчиком'),
      role: 'contractor',
      screens: [
        partner(
          'contractor-linked',
          'Договор подписан',
          editionCopy(
            'У подрядчика в карточке клиента тоже видно, что договор подписан обеими сторонами.',
            'В карточке клиента видны обе подписи. Теперь заказчик может размещать задания через подрядчика.',
          ),
        ),
      ],
    },
    {
      order: 9,
      title: 'Задания клиентов',
      role: 'contractor',
      screens: [
        task(
          'orders',
          'Задания клиентов',
          editionCopy(
            'Подрядчик видит задания клиентов и открывает нужное задание из таблицы.',
            'Заказчик создаёт и публикует задание. Оно появляется у подрядчика в разделе «Задания клиентов», откуда можно открыть карточку.',
          ),
        ),
        task(
          'contractor-task',
          'Просмотр задания',
          'Подрядчик видит параметры задания и может открыть вкладку «Отклики».',
        ),
        task(
          'contractor-responses',
          'Просмотр откликов',
          'Подрядчик видит отклики. Назначение исполнителя остаётся за заказчиком.',
        ),
      ],
    },
    {
      order: 12,
      title: editionCopy('Подписание подрядчиком', 'Подписание актов'),
      role: 'contractor',
      screens: [
        settlement(
          'contractor-sign-acts',
          'Подписание задания и акта',
          'Подрядчик подписывает документы после подтверждения исполнителя. Затем заказчик может принять работу и оплатить её.',
        ),
      ],
    },
    {
      order: 15,
      title: editionCopy('Документы подрядчика', 'Подписанные документы'),
      role: 'contractor',
      screens: [
        settlement(
          'contractor-documents',
          'Документы подрядчика',
          'Подрядчик видит статус «Оплачено» и подписанные документы по заданию с исполнителем и заказчиком.',
        ),
      ],
    },
  ];
}

function performerStages(): Stage[] {
  return [
    {
      order: 6,
      title: 'Отклик исполнителя',
      role: 'performer',
      screens: [
        performer(
          'offer',
          'Задание в приложении',
          contractingRole === 'contractor'
            ? 'Заказчик разместил задание через подрядчика. Исполнитель видит его в приложении и может откликнуться.'
            : 'Исполнитель видит, кто опубликовал задание и кто его заказал, и может откликнуться.',
        ),
        performer(
          'applied',
          'Отклик на рассмотрении',
          'Отклик отправлен заказчику. Исполнитель ждёт его решения.',
        ),
      ],
    },
    {
      order: 8,
      title: 'Подтверждение выхода',
      role: 'performer',
      screens: [
        performer(
          'confirm-start',
          'Подтвердите выход',
          'Заказчик назначил исполнителя. Для подтверждения выхода нужно подписать документы.',
        ),
        performer(
          'assigned',
          'Вы исполнитель',
          'Документы подписаны. Исполнитель видит, что назначен на задание.',
        ),
        performer(
          'working',
          'Задание в работе',
          'В назначенное время задание переходит в статус «В процессе выполнения».',
        ),
      ],
    },
    {
      order: 10,
      title: 'Подтверждение исполнителем',
      role: 'performer',
      screens: [
        performer(
          'confirm-done',
          'Подтверждение выполнения',
          'Когда работа завершена, исполнитель первым подтверждает выполнение в приложении.',
        ),
        performer(
          'confirmed',
          'Исполнитель подтвердил выполнение',
          'Исполнитель отправил подтверждение. Статус задания меняется на «На подтверждении».',
        ),
      ],
    },
    {
      order: 14,
      title: 'Выплата исполнителю',
      role: 'performer',
      screens: [
        performer(
          'payout',
          'Выплата в процессе',
          contractingRole === 'contractor'
            ? 'Заказчик принял работу и подтвердил оплату. Исполнитель видит в приложении, что выплата в процессе.'
            : 'Оплата передана в обработку. Исполнитель видит её статус в приложении.',
        ),
        performer(
          'paid',
          'Задание выполнено',
          'Выплата прошла, документы подписаны, задание завершено.',
        ),
      ],
    },
  ];
}

const stages = [
  ...(__CONTRACTING_ROLE__ !== 'contractor' ? customerStages() : []),
  ...(__CONTRACTING_ROLE__ !== 'customer' ? contractorStages() : []),
  ...performerStages(),
].sort((left, right) => left.order - right.order);

export const contractingStages = stages.map(
  ({ role, title, screens }, index) => ({
    id: screens[0].id,
    role,
    title,
    number: index + 1,
  }),
);

export const contractingScenes = new Map(
  stages.flatMap(({ role, screens }, stageIndex) =>
    screens.map(
      ({ id }, index) =>
        [
          id,
          {
            role,
            stageId: screens[0].id,
            stageNumber: stageIndex + 1,
            screenNumber: index + 1,
            screenCount: screens.length,
          },
        ] as const,
    ),
  ),
);

export const contractingPresentation: PresentationConfig = {
  id: 'contracting',
  title: 'Подрядная схема WinWork',
  homePath: null,
  scenes: [
    ...(__CONTRACTING_WITH_SLIDES__ ? contractingIntroSlides : []),
    ...stages.flatMap(({ screens }) =>
      screens.map((entry) => ({
        ...entry,
        type: 'component' as const,
      })),
    ),
  ],
};
