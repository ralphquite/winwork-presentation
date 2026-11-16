import { ChevronLeft, Star } from 'lucide-react';
import { useEffect, useRef, type KeyboardEvent } from 'react';

export type PerformerReview = {
  date: string;
  dateTime: string;
  rating: number;
  text: string;
};

export type PerformerReviewsProfile = {
  id: string;
  name: string;
  reviews: readonly PerformerReview[];
};

type PerformerReviewsDrawerProps = {
  onClose: () => void;
  response: PerformerReviewsProfile;
};

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [contenteditable="true"], [tabindex]:not([tabindex="-1"])';

function ReviewStars({ rating }: { rating: number }) {
  return (
    <span
      aria-label={`Оценка: ${rating} из 5`}
      className="ww-selection-review-stars"
      role="img"
    >
      {[1, 2, 3, 4, 5].map((position) => (
        <Star
          aria-hidden="true"
          fill={position <= rating ? 'currentColor' : 'none'}
          key={position}
          size={24}
          strokeWidth={2}
        />
      ))}
    </span>
  );
}

export function PerformerReviewsDrawer({
  onClose,
  response,
}: PerformerReviewsDrawerProps) {
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    backButtonRef.current?.focus();
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    event.stopPropagation();

    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key !== 'Tab' || !drawerRef.current) return;

    const focusableElements = Array.from(
      drawerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements.at(-1);

    if (!firstElement || !lastElement) return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  return (
    <div className="ww-selection-reviews-layer">
      <button
        aria-label="Закрыть отзывы об исполнителе"
        className="ww-selection-reviews-scrim"
        onClick={onClose}
        tabIndex={-1}
        type="button"
      />
      <aside
        aria-labelledby={`${response.id}-reviews-title`}
        aria-modal="true"
        className="ww-selection-reviews-drawer"
        onKeyDown={handleKeyDown}
        ref={drawerRef}
        role="dialog"
      >
        <button
          className="ww-selection-reviews-back"
          onClick={onClose}
          ref={backButtonRef}
          type="button"
        >
          <ChevronLeft aria-hidden="true" size={24} strokeWidth={1.8} />
          Назад
        </button>
        <h2 id={`${response.id}-reviews-title`}>
          Отзывы об исполнителе
          <span>{response.name}</span>
        </h2>
        <div aria-label={`Отзывы об исполнителе ${response.name}`} role="list">
          {response.reviews.map((review) => (
            <article
              className="ww-selection-review"
              key={review.dateTime}
              role="listitem"
            >
              <header>
                <ReviewStars rating={review.rating} />
                <time dateTime={review.dateTime}>{review.date}</time>
              </header>
              <p>{review.text}</p>
            </article>
          ))}
        </div>
      </aside>
    </div>
  );
}
