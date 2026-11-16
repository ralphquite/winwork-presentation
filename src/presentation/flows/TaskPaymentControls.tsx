import { Check } from 'lucide-react';

import { ProductButton } from './ProductUI';

export const PAYMENT_SMS_CODE = '1234';
export type PaymentStep = 'ready' | 'code' | 'paid';

type TaskPaymentControlsProps = { step: PaymentStep } & (
  | { preview: true; confirmLabel?: string }
  | {
      preview?: false;
      code: string;
      error: string | null;
      onCodeChange: (value: string) => void;
      onConfirm: () => void;
      onPay: () => void;
    }
);

export function TaskPaymentControls(props: TaskPaymentControlsProps) {
  const { step, preview } = props;
  const code = preview ? PAYMENT_SMS_CODE : props.code;
  const fillCode = () => {
    if (!preview && !code) props.onCodeChange(PAYMENT_SMS_CODE);
  };

  if (step === 'ready') {
    const label = preview ? props.confirmLabel : undefined;
    return (
      <div className="ww-payment-actions-footer">
        <ProductButton
          aria-disabled={preview || undefined}
          data-demo-action="confirm-payment"
          onClick={preview ? undefined : props.onConfirm}
          tabIndex={preview ? -1 : undefined}
        >
          {label ?? 'Подтвердить и оплатить'}
        </ProductButton>
        {preview ? null : (
          <ProductButton variant="danger">Отменить задание</ProductButton>
        )}
      </div>
    );
  }

  if (step === 'code') {
    return (
      <div className="ww-payment-code-form">
        <label>
          <span>Введите код из СМС</span>
          <input
            aria-label="Введите код из СМС"
            disabled={preview}
            inputMode="numeric"
            maxLength={4}
            onChange={
              preview
                ? undefined
                : (event) =>
                    props.onCodeChange(
                      event.currentTarget.value.replace(/\D/g, ''),
                    )
            }
            onClick={preview ? undefined : fillCode}
            onFocus={preview ? undefined : fillCode}
            placeholder={PAYMENT_SMS_CODE}
            tabIndex={preview ? -1 : undefined}
            value={code}
          />
        </label>
        <p>
          Запросить повторно можно через <strong>00:55</strong>
        </p>
        <ProductButton
          aria-disabled={preview || undefined}
          data-demo-action="pay-task"
          disabled={code.length !== 4}
          onClick={preview ? undefined : props.onPay}
          tabIndex={preview ? -1 : undefined}
        >
          Оплатить
        </ProductButton>
        {!preview && props.error ? (
          <p aria-live="polite" className="ww-payment-code-error" role="alert">
            {props.error}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="ww-payment-actions-footer">
      <ProductButton aria-live="polite" className="ww-payment-sent" disabled>
        <Check aria-hidden="true" size={18} /> Отправлено
      </ProductButton>
    </div>
  );
}
