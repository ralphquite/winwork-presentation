import { Check, Download } from 'lucide-react';
import { TOP_UP_ASSETS } from './topUpAssets';
import type { InvoiceProgress } from './topUpState';

export function TopUpInvoice({
  progress,
  onProgressChange,
}: {
  progress: InvoiceProgress;
  onProgressChange: (progress: InvoiceProgress) => void;
}) {
  const { bank, format, filled, prepared: downloaded } = progress;
  const update = (next: Partial<InvoiceProgress>) => {
    onProgressChange({ ...progress, ...next });
  };
  const download = () => {
    const link = document.createElement('a');
    link.href = TOP_UP_ASSETS[bank][format];
    link.download = `Счет_на_пополнение_${bank}_ДЕМО_25000.${format.toLowerCase()}`;
    link.click();
    update({ prepared: true });
  };
  return (
    <section className="wo-tariff-card wo-top-up-card">
      <h2>Сформировать счёт на пополнение</h2>
      <form
        className="wo-invoice-form"
        data-tour-target="topup-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (filled) download();
        }}
      >
        <label
          className={`wo-field${filled ? ' is-filled' : ''}`}
          data-tour-target="topup-amount"
        >
          <span>Введите сумму, ₽</span>
          <input
            autoComplete="off"
            name="invoice-amount"
            onClick={() => update({ filled: true })}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                update({ filled: true });
              }
            }}
            readOnly
            type="text"
            value={filled ? '25 000 ₽' : ''}
          />
        </label>
        <div
          className="wo-invoice-generation"
          data-tour-target="topup-generate"
        >
          <fieldset className="wo-choice-group wo-invoice-formats">
            <legend>Формат счёта</legend>
            {(['PDF', 'XLSX'] as const).map((item) => (
              <label
                className={format === item ? 'is-selected' : ''}
                key={item}
              >
                <input
                  checked={format === item}
                  name="invoice-format"
                  onChange={() => update({ format: item, prepared: false })}
                  type="radio"
                  value={item}
                />
                <span>{item === 'XLSX' ? 'Excel · XLSX' : 'PDF'}</span>
                {format === item ? (
                  <Check size={16} aria-hidden="true" />
                ) : null}
              </label>
            ))}
          </fieldset>
          <button
            className="wo-primary wo-invoice-submit"
            data-tour-target="topup-download"
            disabled={!filled}
            type="submit"
          >
            <Download size={18} />
            Сформировать счёт
          </button>
        </div>
        {downloaded ? (
          <p
            className="wo-invoice-download-status"
            role="status"
            data-tour-target="topup-result"
          >
            <Check size={18} />
            Счёт {format} подготовлен.
          </p>
        ) : null}
      </form>
    </section>
  );
}
