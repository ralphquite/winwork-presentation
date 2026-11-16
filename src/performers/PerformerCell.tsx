import defaultAvatar from '../assets/performers/default-avatar.svg';
import {
  cellLabel,
  cellOptions,
  cellValue,
  columns,
  isChoiceColumn,
  type ColumnId,
  type Performer,
} from './performerTable';

const images = import.meta.glob<string>('../assets/performers/*.svg', {
  eager: true,
  import: 'default',
  query: '?url',
});

export function CellValue({
  column,
  value,
  withLabel = false,
}: {
  column: ColumnId;
  value: string;
  withLabel?: boolean;
}) {
  const option = isChoiceColumn(column)
    ? cellOptions[column].find((item) => item.value === value)
    : undefined;
  const label = cellLabel(column, value) || 'Нет данных';
  const icon = option?.icon;
  const textCell = !isChoiceColumn(column) || column === 'status';

  return (
    <span
      className="wp-cell-value"
      data-column={column}
      data-value={value}
      title={`${columns[column].label}: ${label}`}
    >
      {icon ? (
        <img
          alt={withLabel ? '' : label}
          className={column === 'country' ? 'wp-country' : 'wp-status-icon'}
          draggable={false}
          src={images[`../assets/performers/${icon}.svg`]}
        />
      ) : textCell || value === 'not_applicable' ? (
        <span className="wp-cell-text">
          {value === 'not_applicable' ? '–' : value ? label : null}
        </span>
      ) : (
        <span aria-label={label} className="wp-empty-value" role="img" />
      )}
      {withLabel && !textCell ? <span>{label}</span> : null}
    </span>
  );
}

export function PerformerCell({
  column,
  row,
  onOpen,
  withLabel,
}: {
  column: ColumnId;
  row: Performer;
  onOpen: () => void;
  withLabel?: boolean;
}) {
  if (column === 'name') {
    return (
      <div className="wp-person">
        <img
          alt=""
          className="wp-avatar"
          draggable={false}
          src={defaultAvatar}
        />
        <div>
          <button
            className="wp-name"
            onClick={onOpen}
            title={row.name}
            type="button"
          >
            {row.name}
          </button>
          <span className="wp-tax-id">{row.taxId}</span>
        </div>
      </div>
    );
  }
  return (
    <CellValue
      column={column}
      value={cellValue(row, column)}
      withLabel={withLabel}
    />
  );
}
