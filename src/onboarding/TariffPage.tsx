import { Check, Copy, Download, Info } from 'lucide-react';
import { useState } from 'react';
import { TopUpInvoice } from './TopUpInvoice';
import { initialTopUpState, type InvoiceProgress } from './topUpState';
import {
  copyDemoRequisite,
  getBankRequisites,
  TOP_UP_BANKS,
  DEMO_PAYMENT_PURPOSE,
} from './bankRequisites';
import { TOP_UP_ASSETS } from './topUpAssets';

export type TariffTab = 'tariff' | 'topup';

function PaymentRates({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <section className="wo-payment-rates">
      <h3>{title}</h3>
      <dl className="wo-rate-table">
        {rows.map(([label, rate]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>
              {rate} % <span>(мин. 0.00 ₽)</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function TariffPage({
  onRequest,
  onHelp,
  activeTab,
  onTabChange,
  invoiceProgress,
  onInvoiceProgress,
  onMessage,
}: {
  onRequest: () => void;
  onHelp: () => void;
  activeTab: TariffTab;
  onTabChange: (tab: TariffTab) => void;
  invoiceProgress?: InvoiceProgress;
  onInvoiceProgress?: (progress: InvoiceProgress) => void;
  onMessage: (message: string) => void;
}) {
  const [localInvoice, setLocalInvoice] = useState(
    () => initialTopUpState().invoice,
  );
  const invoice = invoiceProgress ?? localInvoice;
  const updateInvoice = onInvoiceProgress ?? setLocalInvoice;
  const assets = TOP_UP_ASSETS[invoice.bank];
  const selectedBank = TOP_UP_BANKS.find(({ id }) => id === invoice.bank)!;
  const copy = async (value: string) => {
    const copied = await copyDemoRequisite(value);
    onMessage(
      copied
        ? 'Реквизиты скопированы'
        : 'Не удалось скопировать автоматически. Выделите реквизиты и скопируйте вручную.',
    );
  };
  const downloadRequisites = () => {
    const link = document.createElement('a');
    link.href = assets.requisites;
    link.download = `Реквизиты_WinWork_${selectedBank.label}_ДЕМО.pdf`;
    link.click();
  };
  return (
    <>
      <h1 className="wo-page-title">Мой тариф</h1>
      <div className="wo-page-tabs" role="tablist" aria-label="Мой тариф">
        {(
          [
            ['tariff', 'Тариф'],
            ['topup', 'Пополнение'],
            ['taxes', 'Налоги'],
            ['risks', 'Предупреждения о рисках'],
            ['edo', 'Пакеты ЭДО'],
          ] as const
        ).map(([id, label]) => {
          const available = id === 'tariff' || id === 'topup';
          return (
            <button
              role="tab"
              id={`wo-tab-${id}`}
              key={id}
              aria-selected={activeTab === id}
              aria-controls={available ? `wo-panel-${id}` : undefined}
              aria-disabled={!available || undefined}
              tabIndex={activeTab === id ? 0 : -1}
              className={activeTab === id ? 'is-active' : ''}
              data-tour-target={available ? `${id}-tab` : undefined}
              onClick={() => (available ? onTabChange(id) : onHelp())}
              onKeyDown={(event) => {
                if (
                  !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(
                    event.key,
                  )
                )
                  return;
                event.preventDefault();
                const next =
                  event.key === 'Home'
                    ? 'tariff'
                    : event.key === 'End'
                      ? 'topup'
                      : activeTab === 'tariff'
                        ? 'topup'
                        : 'tariff';
                onTabChange(next);
                document.getElementById(`wo-tab-${next}`)?.focus();
              }}
              type="button"
            >
              {label}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id="wo-panel-tariff"
        aria-labelledby="wo-tab-tariff"
        hidden={activeTab !== 'tariff'}
        tabIndex={0}
      >
        <section className="wo-tariff-card wo-tariff-overview">
          <h2>Мой тариф</h2>
          <div className="wo-tariff-columns">
            <div className="wo-tariff-services">
              <div className="wo-finance-notice wo-commission-banner">
                <Info size={24} aria-hidden="true" />
                <div>
                  <h3>Оставьте заявку, чтобы уменьшить свою комиссию</h3>
                  <p>
                    Получите индивидуальные условия под ваши задачи — напишите в
                    чат.
                  </p>
                  <button
                    className="wo-primary"
                    data-tour-target="request"
                    onClick={onRequest}
                    type="button"
                  >
                    Оставить заявку
                  </button>
                </div>
              </div>
              <section className="wo-document-rates">
                <h3>Документы и чеки</h3>
                <dl className="wo-rate-table wo-service-rates">
                  <div>
                    <dt>Подписание документов</dt>
                    <dd>
                      7.00 ₽{' '}
                      <span>за один документ, если не подключен пакет</span>
                    </dd>
                  </div>
                  <div>
                    <dt>Подтверждение регистрации чеков</dt>
                    <dd>
                      11.00 ₽ <span>за один чек</span>
                    </dd>
                  </div>
                </dl>
              </section>
            </div>
            <div className="wo-tariff-payments">
              <PaymentRates
                title="Платежи на реквизиты карты"
                rows={[
                  ['СМЗ', '7.00'],
                  ['ИП', '3.00'],
                  ['ГПХ', '3.00'],
                ]}
              />
              <PaymentRates
                title="Платежи на реквизиты банковского счёта"
                rows={[
                  ['СМЗ', '3.00'],
                  ['ИП', '3.00'],
                  ['ГПХ', '3.00'],
                ]}
              />
              <PaymentRates
                title="Платежи по СБП"
                rows={[
                  ['СМЗ', '1.50'],
                  ['ГПХ', '1.50'],
                ]}
              />
            </div>
          </div>
        </section>
      </div>
      <div
        role="tabpanel"
        id="wo-panel-topup"
        aria-labelledby="wo-tab-topup"
        hidden={activeTab !== 'topup'}
        tabIndex={0}
      >
        <div className="wo-tariff-card wo-bank-selector-card">
          <fieldset
            className="wo-choice-group wo-bank-selector"
            data-tour-target="topup-bank"
          >
            <legend className="wo-sr-only">Банк для пополнения</legend>
            {TOP_UP_BANKS.map((bank) => (
              <label
                className={invoice.bank === bank.id ? 'is-selected' : ''}
                key={bank.id}
              >
                <input
                  type="radio"
                  name="topup-bank"
                  value={bank.id}
                  checked={invoice.bank === bank.id}
                  onChange={() =>
                    updateInvoice({
                      ...invoice,
                      bank: bank.id,
                      prepared: false,
                    })
                  }
                />
                <span>{bank.label}</span>
                {invoice.bank === bank.id ? (
                  <Check size={16} aria-hidden="true" />
                ) : null}
              </label>
            ))}
          </fieldset>
        </div>
        <div className="wo-tariff-grid">
          <div className="wo-topup-methods">
            <section
              className="wo-tariff-card wo-qr-section"
              aria-labelledby="wo-qr-heading"
              data-tour-target="topup-qr"
            >
              <div>
                <h2 id="wo-qr-heading">Пополнение по QR-коду</h2>
                <p>Откройте приложение банка и отсканируйте код.</p>
              </div>
              <img
                alt={`QR-код — ${selectedBank.label}`}
                src={assets.qr}
                width={132}
                height={132}
              />
            </section>
            <TopUpInvoice progress={invoice} onProgressChange={updateInvoice} />
          </div>
          <section
            className="wo-tariff-card wo-requisites"
            data-tour-target="topup-requisites-panel"
          >
            <h2 data-tour-target="topup-requisites">
              Скопировать реквизиты для пополнения
            </h2>
            <div className="wo-finance-notice wo-transfer-notice">
              <Info size={20} aria-hidden="true" />
              <p>
                <strong>
                  Переводите со счёта юрлица или ИП, на которое зарегистрирован
                  кабинет.
                </strong>{' '}
                Переводы от других юрлиц, ИП и физлиц не зачисляются на баланс.
              </p>
            </div>
            <dl className="wo-bank-table" data-tour-target="topup-bank-details">
              {[
                ...getBankRequisites(invoice.bank),
                ['Назначение платежа', DEMO_PAYMENT_PURPOSE] as const,
              ].map(([label, value]) => (
                <div
                  className={
                    ['ИНН', 'КПП', 'БИК', 'Наименование банка'].includes(label)
                      ? 'is-compact'
                      : undefined
                  }
                  key={label}
                >
                  <dt>{label}</dt>
                  <dd>
                    <button
                      className="wo-copy-requisite"
                      aria-label={`Скопировать: ${label}`}
                      title="Нажмите, чтобы скопировать"
                      onClick={() => void copy(value)}
                      type="button"
                    >
                      <span>{value}</span>
                      <Copy size={16} aria-hidden="true" />
                    </button>
                  </dd>
                </div>
              ))}
            </dl>
            <button
              className="wo-download"
              data-tour-target="topup-requisites-download"
              onClick={downloadRequisites}
              type="button"
            >
              <Download size={18} />
              Скачать реквизиты
            </button>
          </section>
        </div>
      </div>
    </>
  );
}
