import type { ComponentProps, ReactNode } from 'react';

import calendarIcon from '../assets/contracting/desktop/calendar.svg?inline';
import catalogSearchIcon from '../assets/contracting/desktop/catalog-search.svg?inline';
import checkIcon from '../assets/contracting/desktop/check.svg?inline';
import chevronIcon from '../assets/contracting/desktop/chevron.svg?inline';
import closeIcon from '../assets/contracting/desktop/close.svg?inline';
import contractIcon from '../assets/contracting/desktop/contract.svg?inline';
import contractorAvatar from '../assets/contracting/desktop/contractor-avatar.svg?inline';
import downloadIcon from '../assets/contracting/desktop/download.svg?inline';
import infoIcon from '../assets/contracting/desktop/info.svg?inline';
import locationIcon from '../assets/contracting/desktop/location.svg?inline';
import pageLeftIcon from '../assets/contracting/desktop/page-left.svg?inline';
import pageNumberBackground from '../assets/contracting/desktop/page-number.svg?inline';
import pageRightIcon from '../assets/contracting/desktop/page-right.svg?inline';
import pageSizeIcon from '../assets/contracting/desktop/page-size.svg?inline';
import plusIcon from '../assets/contracting/desktop/plus.svg?inline';
import searchIcon from '../assets/contracting/desktop/search.svg?inline';
import sortIcon from '../assets/contracting/desktop/sort-down.svg?inline';
import { Drawer, ProductButton } from '../presentation/flows/ProductUI';
import { ContractingSectionHeader, ContractingShell } from './ContractingShell';
import { clientCompanies, companies } from './fixtures';

export type PartnerState =
  | 'customer-intro'
  | 'customer-enabled'
  | 'customer-search'
  | 'customer-offer'
  | 'contractor-intro'
  | 'contractor-review'
  | 'contractor-clients'
  | 'contractor-offer'
  | 'customer-sent'
  | 'customer-linked'
  | 'contractor-linked';

type RelationshipStatus =
  | 'Предложение отправлено'
  | 'Предложение о сотрудничестве'
  | 'Активен'
  | 'Отключён';

type Relationship = {
  company: { name: string; taxId: string };
  date: string;
  status: RelationshipStatus;
};

const statusTones: Record<RelationshipStatus, 'info' | 'success' | 'danger'> = {
  'Предложение отправлено': 'info',
  'Предложение о сотрудничестве': 'info',
  Активен: 'success',
  Отключён: 'danger',
};

const collaborationDate = '21.08.2026';

const clientExamples: readonly Relationship[] = [
  {
    company: { name: 'ООО «Кленовая доставка»', taxId: '7708739642' },
    date: '20.08.2026',
    status: 'Предложение о сотрудничестве',
  },
  {
    company: clientCompanies.warehouse,
    date: '12.08.2026',
    status: 'Активен',
  },
  {
    company: clientCompanies.supplier,
    date: '06.08.2026',
    status: 'Активен',
  },
  {
    company: { name: 'ООО «Речной терминал»', taxId: '7736714030' },
    date: '29.07.2026',
    status: 'Отключён',
  },
];

type CatalogCompany = {
  name: string;
  taxId: string;
  address: string;
  phone: string;
  commission: string;
  minimum: string;
};

const contractorCatalog: readonly CatalogCompany[] = [
  companies.contractor,
  {
    name: 'ООО «Ритм смены»',
    taxId: '7731785069',
    address: 'г. Москва, ул. Резервная, д. 19',
    phone: '+7 (495) •••-28-53',
    commission: '14%',
    minimum: '500 ₽',
  },
  {
    name: 'ООО «Вектор Комплект»',
    taxId: '7724725911',
    address: 'г. Москва, ул. Пакгаузная, д. 5',
    phone: '+7 (495) •••-49-12',
    commission: '15%',
    minimum: '600 ₽',
  },
  {
    name: 'ООО «Опора Штат»',
    taxId: '7715380499',
    address: 'г. Москва, Товарный проезд, д. 23',
    phone: '+7 (495) •••-52-76',
    commission: '16%',
    minimum: '600 ₽',
  },
];

function SnapshotButton(props: ComponentProps<typeof ProductButton>) {
  return <ProductButton {...props} aria-disabled="true" tabIndex={-1} />;
}

function StatusBadge({
  children,
  tone,
}: {
  children: ReactNode;
  tone: 'info' | 'success' | 'danger';
}) {
  return <span className={`ww-contracting-status is-${tone}`}>{children}</span>;
}

function SearchField({
  catalog = false,
  label,
}: {
  catalog?: boolean;
  label: string;
}) {
  return (
    <label className="ww-contracting-filter">
      <img alt="" src={catalog ? catalogSearchIcon : searchIcon} />
      <input aria-label={label} disabled placeholder={label} type="search" />
    </label>
  );
}

function LabeledFilter({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="ww-contracting-filter">
      <img alt="" src={icon} />
      <span>
        <small>{label}</small>
        {value}
      </span>
      <img alt="" src={chevronIcon} />
    </div>
  );
}

function RelationshipList({
  clients = false,
  hint,
  rows,
}: {
  clients?: boolean;
  hint?: 'add' | 'offer';
  rows: readonly Relationship[];
}) {
  const title = clients ? 'Клиенты' : 'Ваши подрядчики';
  return (
    <section className="ww-contracting-list">
      <div className="ww-contracting-list-head">
        <h2>{title}</h2>
        <SnapshotButton
          data-contracting-hint={hint === 'add' ? '' : undefined}
          variant={clients ? 'danger' : 'primary'}
        >
          {clients ? 'Отключить режим подрядчика' : 'Добавить подрядчика'}
        </SnapshotButton>
      </div>
      <div className="ww-contracting-list-filters">
        <SearchField label="Поиск по названию или ИНН" />
        <LabeledFilter
          icon={calendarIcon}
          label="Календарь"
          value="За всё время"
        />
      </div>
      <div className="ww-table-shell ww-contracting-table">
        <table aria-label={title}>
          <colgroup>
            <col className="is-date" />
            <col />
            <col className="is-tax-id" />
            {clients ? null : <col className="is-percent" />}
            <col
              className={clients ? 'is-client-status' : 'is-partner-status'}
            />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">Дата подключения</th>
              <th scope="col">Компания</th>
              <th scope="col">ИНН</th>
              {clients ? null : <th scope="col">Процент</th>}
              <th scope="col">
                <span className="ww-contracting-table-sort">
                  Статус <img alt="" src={sortIcon} />
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ company, date, status }) => (
              <tr
                data-contracting-hint={
                  hint === 'offer' && company.taxId === companies.customer.taxId
                    ? ''
                    : undefined
                }
                key={company.taxId}
              >
                <td>{date}</td>
                <td>{company.name}</td>
                <td>{company.taxId}</td>
                {clients ? null : <td>{companies.contractor.commission}</td>}
                <td>
                  <StatusBadge tone={statusTones[status]}>{status}</StatusBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <p className="ww-contracting-empty">У вас пока нет подрядчиков</p>
        ) : (
          <footer>
            <div className="ww-contracting-page-size">
              На странице:{' '}
              <span>
                10 <img alt="" src={pageSizeIcon} />
              </span>
            </div>
            <div className="ww-contracting-pagination">
              <span
                aria-hidden="true"
                className="ww-contracting-page-arrows is-back"
              >
                <img alt="" src={pageLeftIcon} />
                <img alt="" src={pageLeftIcon} />
              </span>
              <span className="ww-contracting-page-current">
                <img alt="" src={pageNumberBackground} />
                <span>1</span>
              </span>
              <span>/ 1</span>
              <span
                aria-hidden="true"
                className="ww-contracting-page-arrows is-forward"
              >
                <img alt="" src={pageRightIcon} />
                <img alt="" src={pageRightIcon} />
              </span>
            </div>
          </footer>
        )}
      </div>
    </section>
  );
}

function ContractorCard({
  company,
  selectable = false,
}: {
  company: CatalogCompany;
  selectable?: boolean;
}) {
  return (
    <article className="ww-contracting-catalog-card">
      <div className="ww-contracting-catalog-company">
        <img alt="" src={contractorAvatar} />
        <div>
          <h3>{company.name}</h3>
          <span>ИНН {company.taxId}</span>
        </div>
        {selectable ? (
          <SnapshotButton
            aria-label={`Выбрать ${company.name}`}
            data-contracting-hint={
              company.taxId === companies.contractor.taxId ? '' : undefined
            }
          >
            <img alt="" src={plusIcon} />
          </SnapshotButton>
        ) : null}
      </div>
      <p>{company.address}</p>
      <p>{company.phone}</p>
      <dl className="ww-contracting-catalog-terms">
        <div>
          <dt>комиссия</dt>
          <dd>{company.commission}</dd>
        </div>
        <div>
          <dt>минимальная сумма комиссии</dt>
          <dd>{company.minimum}</dd>
        </div>
      </dl>
    </article>
  );
}

function PartnerDrawer({
  children,
  footer,
  title,
}: {
  children: ReactNode;
  footer?: ReactNode;
  title: string;
}) {
  return (
    <Drawer
      className="ww-contracting-drawer ww-contracting-partner-drawer"
      closeIcon={<img alt="" src={closeIcon} />}
      title={title}
    >
      {children}
      {footer ? (
        <div className="ww-contracting-drawer-footer">{footer}</div>
      ) : null}
    </Drawer>
  );
}

function ContractorCatalog() {
  return (
    <PartnerDrawer title="Добавить подрядчика">
      <div className="ww-contracting-catalog-filters">
        <SearchField catalog label="Поиск по названию или ИНН" />
        <LabeledFilter icon={locationIcon} label="Город" value="Все города" />
      </div>
      <div className="ww-contracting-catalog">
        {contractorCatalog.map((company) => (
          <ContractorCard company={company} key={company.taxId} selectable />
        ))}
      </div>
    </PartnerDrawer>
  );
}

function ContractFile({
  download = false,
  expires = false,
  signature,
}: {
  download?: boolean;
  expires?: boolean;
  signature?: string;
}) {
  return (
    <div className="ww-contracting-contract">
      <img alt="" src={contractIcon} />
      <div>
        <span className="ww-contracting-contract-title">
          Договор об оказании услуг по подрядной схеме
        </span>
        {expires ? (
          <span className="ww-contracting-contract-expiry">
            Действует до 01.12.2026
          </span>
        ) : null}
        {signature ? (
          <span className="ww-contracting-contract-signature">
            <img alt="" src={checkIcon} /> {signature}
          </span>
        ) : null}
      </div>
      {download ? <img alt="Скачать договор" src={downloadIcon} /> : null}
    </div>
  );
}

function ContractorAgreement({
  state,
}: {
  state: 'customer-offer' | 'customer-sent' | 'customer-linked';
}) {
  const linked = state === 'customer-linked';
  const sent = state === 'customer-sent';
  return (
    <PartnerDrawer
      footer={
        linked ? (
          <SnapshotButton variant="danger">Отключить подрядчика</SnapshotButton>
        ) : null
      }
      title={linked ? 'Подрядчик' : 'Добавить подрядчика'}
    >
      <div className="ww-contracting-drawer-overview">
        {linked ? (
          <div className="ww-contracting-notice is-active">
            <img alt="" src={infoIcon} />
            <div>
              <strong>Активен</strong>
              <p>Вы можете размещать задания от имени подрядчика</p>
            </div>
          </div>
        ) : null}
        <ContractorCard company={companies.contractor} />
      </div>
      <section className="ww-contracting-drawer-section">
        <h3>Договор</h3>
        <ContractFile
          download={!linked}
          expires={linked}
          signature={
            linked
              ? 'Подписан обеими сторонами'
              : sent
                ? 'Подписан вами'
                : undefined
          }
        />
        {state === 'customer-offer' ? (
          <SnapshotButton data-contracting-hint="">
            Подписать и направить предложение
          </SnapshotButton>
        ) : null}
      </section>
      {sent ? (
        <div className="ww-contracting-notice">
          <img alt="" src={infoIcon} />
          <div>
            <strong>Ожидаем подпись подрядчика</strong>
            <p>Подрядчик получил ваше предложение о сотрудничестве.</p>
            <p>Он может принять его или отклонить.</p>
          </div>
        </div>
      ) : null}
    </PartnerDrawer>
  );
}

function ClientAgreement({ linked }: { linked: boolean }) {
  const fields = [
    ['Юридическое лицо', companies.customer.name],
    ['ИНН', companies.customer.taxId],
    ['ОГРН', companies.customer.registrationNumber],
    ['Телефон (для операций)', companies.customer.phone],
  ];
  return (
    <PartnerDrawer title={linked ? 'Клиент' : 'Предложение о сотрудничестве'}>
      <section className="ww-contracting-client-info">
        <h3>Информация о клиенте</h3>
        <dl>
          {fields.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="ww-contracting-drawer-section">
        <h3>Договор</h3>
        <ContractFile
          expires
          signature={linked ? 'Подписан обеими сторонами' : 'Подписан клиентом'}
        />
      </section>
      <div className="ww-contracting-drawer-actions">
        {linked ? null : (
          <SnapshotButton data-contracting-hint="">
            Принять предложение и подписать
          </SnapshotButton>
        )}
        <SnapshotButton variant="danger">
          {linked ? 'Отключить клиента' : 'Отклонить'}
        </SnapshotButton>
      </div>
    </PartnerDrawer>
  );
}

function CustomerSection({ state }: { state: PartnerState }) {
  const enabled = state !== 'customer-intro';
  const rows: Relationship[] = [];
  if (state === 'customer-sent' || state === 'customer-linked') {
    rows.push({
      company: companies.contractor,
      date: collaborationDate,
      status:
        state === 'customer-linked' ? 'Активен' : 'Предложение отправлено',
    });
  }
  return (
    <>
      <section className="ww-contracting-summary">
        <div className="ww-contracting-summary-lead">
          <div>
            <p>
              Вы можете размещать задания через подключённых подрядчиков. В
              документах задание будет от имени подрядчика.
            </p>
            <p>
              Вы будете выплачивать процент от суммы заказа дополнительно к
              комиссии сервиса.
            </p>
            <span className="ww-contracting-tariff-link">
              Посмотреть все тарифы
            </span>
          </div>
          {enabled ? (
            <StatusBadge tone="success">
              {state === 'customer-linked'
                ? 'Подрядчик подключён'
                : 'Подрядная схема подключена'}
            </StatusBadge>
          ) : (
            <SnapshotButton data-contracting-hint="">
              Подключить подрядчиков
            </SnapshotButton>
          )}
        </div>
      </section>
      {enabled ? (
        <RelationshipList
          hint={state === 'customer-enabled' ? 'add' : undefined}
          rows={rows}
        />
      ) : null}
    </>
  );
}

function ContractorSection({
  enabled,
  highlightOffer,
  reviewing,
  linked,
}: {
  enabled: boolean;
  highlightOffer: boolean;
  reviewing: boolean;
  linked: boolean;
}) {
  const rows: Relationship[] = [
    {
      company: companies.customer,
      date: collaborationDate,
      status: linked ? 'Активен' : 'Предложение о сотрудничестве',
    },
    ...clientExamples,
  ];

  return (
    <>
      <section
        className={`ww-contracting-summary${enabled ? '' : ' is-application'}`}
      >
        <div className="ww-contracting-summary-lead">
          <div>
            <p>
              В этом режиме вы можете размещать задания клиентов от своего
              имени.
            </p>
            <p>Вы будете получать процент от суммы заказов.</p>
          </div>
          {enabled ? (
            <StatusBadge tone="success">Вы являетесь подрядчиком</StatusBadge>
          ) : null}
        </div>
        {enabled ? (
          <>
            <dl className="ww-contracting-metrics">
              <div>
                <dt>На платформе с</dt>
                <dd>{companies.contractor.memberSince}</dd>
              </div>
              <div>
                <dt>Выполнено заданий</dt>
                <dd>{companies.contractor.completedTasks}</dd>
              </div>
            </dl>
            <div className="ww-contracting-commission">
              <h3>Ваша комиссия</h3>
              <dl className="ww-contracting-metrics">
                <div>
                  <dt>Комиссия</dt>
                  <dd>{companies.contractor.commission}</dd>
                </div>
                <div>
                  <dt>Минимальная сумма комиссии</dt>
                  <dd>{companies.contractor.minimum}</dd>
                </div>
              </dl>
            </div>
          </>
        ) : reviewing ? (
          <StatusBadge tone="info">Ваша заявка на рассмотрении</StatusBadge>
        ) : (
          <SnapshotButton data-contracting-hint="">
            Стать подрядчиком
          </SnapshotButton>
        )}
      </section>
      {enabled ? (
        <RelationshipList
          clients
          hint={highlightOffer ? 'offer' : undefined}
          rows={rows}
        />
      ) : null}
    </>
  );
}

function overlayFor(state: PartnerState) {
  switch (state) {
    case 'customer-search':
      return <ContractorCatalog />;
    case 'customer-offer':
    case 'customer-sent':
    case 'customer-linked':
      return <ContractorAgreement state={state} />;
    case 'contractor-offer':
    case 'contractor-linked':
      return <ClientAgreement linked={state === 'contractor-linked'} />;
    default:
      return undefined;
  }
}

export function ContractingPartners({ state }: { state: PartnerState }) {
  const role = state.startsWith('customer-') ? 'customer' : 'contractor';
  const section = role === 'customer' ? 'partners' : 'clients';
  const contractorEnabled =
    role === 'contractor' &&
    state !== 'contractor-intro' &&
    state !== 'contractor-review';
  return (
    <ContractingShell
      contractorNavigationExpanded={contractorEnabled}
      key={state}
      overlay={overlayFor(state)}
      role={role}
      section={section}
    >
      <div className="ww-contracting-partners">
        <ContractingSectionHeader
          section={section}
          showModeTabs={contractorEnabled}
        />
        {role === 'customer' ? (
          <CustomerSection state={state} />
        ) : (
          <ContractorSection
            enabled={contractorEnabled}
            highlightOffer={state === 'contractor-clients'}
            linked={state === 'contractor-linked'}
            reviewing={state === 'contractor-review'}
          />
        )}
      </div>
    </ContractingShell>
  );
}
