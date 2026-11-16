import {
  ArrowDown,
  ArrowDownUp,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Ellipsis,
  Eye,
  EyeOff,
  GripVertical,
  ListFilter,
  LockKeyhole,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type DragEvent,
  type PointerEvent,
} from 'react';

import {
  columnIds,
  columnWidth,
  columns,
  defaultView,
  findPerformers,
  formatFilter,
  isChoiceColumn,
  moveColumn,
  readView,
  saveView,
  cellOptions,
  sortLabel,
  type ColumnId,
  type Filter,
  type Performer,
  type Sort,
  type View,
} from './performerTable';
import { TablePopover } from './TablePopover';
import { CellValue, PerformerCell } from './PerformerCell';

type Popup = (
  | { kind: 'fields' | 'sort' | 'columns' | 'appearance' }
  | { kind: 'filter' | 'column'; column: ColumnId }
) & { anchor: HTMLButtonElement };
type Drop = { column: ColumnId; side: 'before' | 'after' };

function FilterEditor({
  column,
  filter,
  onApply,
  onRemove,
}: {
  column: ColumnId;
  filter?: Filter;
  onApply: (filter: Filter) => void;
  onRemove: () => void;
}) {
  const [value, setValue] = useState(filter?.value ?? '');
  const [end, setEnd] = useState(filter?.end ?? '');
  const [choices, setChoices] = useState<string[]>(
    filter ? (filter.values ?? [filter.value]) : [],
  );
  const choiceColumn = isChoiceColumn(column);
  const valid = choiceColumn
    ? choices.length > 0
    : column === 'added'
      ? Boolean(value || end) && !(value && end && value > end)
      : Boolean(value.trim());

  return (
    <form
      className="wp-panel-body"
      onSubmit={(event) => {
        event.preventDefault();
        if (valid)
          onApply({
            column,
            value: choiceColumn ? choices[0]! : value.trim(),
            values: choiceColumn ? choices : undefined,
            end: end || undefined,
          });
      }}
    >
      {choiceColumn ? (
        <div
          aria-label={columns[column].label}
          className="wp-choice-list"
          role="group"
        >
          {cellOptions[column].map(({ value: item }, index) => (
            <button
              aria-pressed={choices.includes(item)}
              className="wp-option"
              data-initial-focus={index === 0 ? '' : undefined}
              key={item}
              onClick={() =>
                setChoices((current) =>
                  current.includes(item)
                    ? current.filter((value) => value !== item)
                    : [...current, item],
                )
              }
              type="button"
            >
              <CellValue column={column} value={item} withLabel />
              {choices.includes(item) ? <Check size={16} /> : null}
            </button>
          ))}
        </div>
      ) : column === 'added' ? (
        <div className="wp-dates">
          <label>
            С
            <input
              data-initial-focus
              type="date"
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </label>
          <label>
            По
            <input
              type="date"
              value={end}
              min={value || undefined}
              onChange={(event) => setEnd(event.target.value)}
            />
          </label>
        </div>
      ) : (
        <label className="wp-stacked">
          Содержит
          <input
            data-initial-focus
            placeholder={column === 'name' ? 'ФИО или ИНН' : 'Текст примечания'}
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </label>
      )}
      {choiceColumn ? (
        <p className="wp-panel-hint">Можно выбрать несколько значений</p>
      ) : null}
      <div className="wp-panel-actions">
        {filter ? (
          <button className="wp-button" onClick={onRemove} type="button">
            Удалить фильтр
          </button>
        ) : null}
        <button
          className="wp-button wp-primary"
          disabled={!valid}
          type="submit"
        >
          Применить
        </button>
      </div>
    </form>
  );
}

export function PerformersTable() {
  const [view, setView] = useState(readView);
  const [blocked, setBlocked] = useState(false);
  const [search, setSearch] = useState('');
  const [columnQuery, setColumnQuery] = useState('');
  const [filters, setFilters] = useState<Filter[]>([]);
  const [sorts, setSorts] = useState<Sort[]>([]);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [popup, setPopup] = useState<Popup>();
  const [drop, setDrop] = useState<Drop>();
  const [dragged, setDragged] = useState<ColumnId>();
  const [profile, setProfile] = useState<Performer>();
  const [announcement, setAnnouncement] = useState('');
  const columnsButton = useRef<HTMLButtonElement>(null);
  const filterButton = useRef<HTMLButtonElement>(null);
  const details = useRef<HTMLDialogElement>(null);
  const scroll = useRef<HTMLDivElement>(null);

  const rows = findPerformers(blocked, search, filters, sorts);
  const pageCount = Math.max(1, Math.ceil(rows.length / view.pageSize));
  const limit = view.pageSize;
  const pageRows = rows.slice(page * limit, (page + 1) * limit);
  const visible = view.order.filter((id) => !view.hidden.includes(id));
  const matchingColumns = view.order.filter((id) =>
    columns[id].label
      .toLocaleLowerCase('ru')
      .includes(columnQuery.trim().toLocaleLowerCase('ru')),
  );
  const widthOf = (column: ColumnId) =>
    view.widths[column] ??
    Math.ceil((columns[column].width * view.fontSize) / 12);
  const checkedCount = pageRows.filter(({ id }) =>
    selected.includes(id),
  ).length;

  useEffect(() => saveView(view), [view]);
  useEffect(() => {
    if (profile) details.current?.showModal();
  }, [profile]);

  const closePopup = useCallback(
    (restoreFocus: boolean) => {
      const anchor = popup?.anchor;
      setPopup(undefined);
      if (restoreFocus) {
        requestAnimationFrame(() => {
          (anchor?.isConnected ? anchor : filterButton.current)?.focus({
            preventScroll: true,
          });
        });
      }
    },
    [popup],
  );

  function togglePopup(
    kind: 'fields' | 'sort' | 'columns' | 'appearance',
    anchor: HTMLButtonElement,
  ) {
    if (popup?.anchor === anchor) {
      closePopup(false);
      return;
    }
    setColumnQuery('');
    setPopup({ kind, anchor });
  }

  function openColumn(column: ColumnId, anchor: HTMLButtonElement) {
    if (popup?.anchor === anchor) closePopup(false);
    else setPopup({ kind: 'column', column, anchor });
  }

  function changePage(next: number) {
    setPage(next);
    if (scroll.current) scroll.current.scrollTop = 0;
  }

  function changeFilter(column: ColumnId, next?: Filter) {
    setFilters((current) =>
      next
        ? current.some((filter) => filter.column === column)
          ? current.map((filter) => (filter.column === column ? next : filter))
          : [...current, next]
        : current.filter((filter) => filter.column !== column),
    );
    changePage(0);
    setSelected([]);
    closePopup(true);
  }

  function setSort(column: ColumnId, direction: Sort['direction']) {
    setSorts((current) =>
      current.some((sort) => sort.column === column)
        ? current.map((sort) =>
            sort.column === column ? { column, direction } : sort,
          )
        : [...current, { column, direction }],
    );
    changePage(0);
  }

  function reset() {
    setView(defaultView);
    setFilters([]);
    setSorts([]);
    setSearch('');
    setSelected([]);
    changePage(0);
    if (scroll.current) scroll.current.scrollLeft = 0;
    setAnnouncement('Настройки таблицы сброшены');
  }

  function toggleColumn(column: ColumnId) {
    setView((current) => ({
      ...current,
      hidden: current.hidden.includes(column)
        ? current.hidden.filter((id) => id !== column)
        : [...current.hidden, column],
    }));
  }

  function reorder(from: ColumnId, to: Drop) {
    setView((current) => ({
      ...current,
      order: moveColumn(current.order, from, to.column, to.side),
    }));
    setAnnouncement(`Перемещён столбец «${columns[from].label}»`);
  }

  function startDrag(event: DragEvent, column: ColumnId) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', columns[column].label);
    closePopup(false);
    setDragged(column);
  }

  function endDrag() {
    setDragged(undefined);
    setDrop(undefined);
  }

  function targetPosition(
    event: DragEvent,
    column: ColumnId,
    vertical: boolean,
  ): Drop {
    const rect = event.currentTarget.getBoundingClientRect();
    const before = vertical
      ? event.clientY < rect.top + rect.height / 2
      : event.clientX < rect.left + rect.width / 2;
    return { column, side: before ? 'before' : 'after' };
  }

  function dragTarget(column: ColumnId, vertical = false) {
    return {
      'data-drop': drop?.column === column ? drop.side : undefined,
      'data-dragging': dragged === column || undefined,
      onDragOver: (event: DragEvent) => {
        if (!dragged || dragged === column || column === 'name') {
          setDrop(undefined);
          return;
        }
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        const target = targetPosition(event, column, vertical);
        setDrop((current) =>
          current?.column === column && current.side === target.side
            ? current
            : target,
        );
      },
      onDragLeave: (event: DragEvent) => {
        if (
          event.relatedTarget instanceof Node &&
          event.currentTarget.contains(event.relatedTarget)
        )
          return;
        setDrop((current) =>
          current?.column === column ? undefined : current,
        );
      },
      onDrop: (event: DragEvent) => {
        if (!dragged || column === 'name') return;
        event.preventDefault();
        reorder(dragged, targetPosition(event, column, vertical));
        endDrag();
      },
    };
  }

  function updateWidth(column: ColumnId, width: number) {
    setView((current) => ({
      ...current,
      widths: { ...current.widths, [column]: columnWidth(column, width) },
    }));
  }

  function startResize(
    event: PointerEvent<HTMLSpanElement>,
    column: ColumnId,
    width: number,
  ) {
    if (event.button !== 0) return;
    event.preventDefault();
    const handle = event.currentTarget;
    handle.focus({ preventScroll: true });
    handle.setPointerCapture(event.pointerId);
    const startX = event.clientX;
    const move = (moveEvent: globalThis.PointerEvent) =>
      updateWidth(column, width + moveEvent.clientX - startX);
    handle.addEventListener('pointermove', move);
    handle.addEventListener(
      'lostpointercapture',
      () => {
        handle.removeEventListener('pointermove', move);
      },
      { once: true },
    );
  }

  function renderPopup() {
    if (!popup) return null;
    const { anchor } = popup;
    if (popup.kind === 'filter') {
      const { column } = popup;
      return (
        <TablePopover
          anchor={anchor}
          close={closePopup}
          title={columns[column].label}
          back={() => {
            setColumnQuery('');
            setPopup({ kind: 'fields', anchor });
          }}
        >
          <FilterEditor
            column={column}
            filter={filters.find((filter) => filter.column === column)}
            key={column}
            onApply={(filter) => changeFilter(column, filter)}
            onRemove={() => changeFilter(column)}
          />
        </TablePopover>
      );
    }

    if (popup.kind === 'fields') {
      return (
        <TablePopover anchor={anchor} close={closePopup} title="Фильтровать по">
          <div className="wp-panel-body">
            <input
              aria-label="Найти столбец для фильтра"
              data-initial-focus
              placeholder="Найти столбец…"
              value={columnQuery}
              onChange={(event) => setColumnQuery(event.target.value)}
            />
            {matchingColumns.length === 0 ? (
              <p className="wp-menu-empty" role="status">
                Столбцы не найдены
              </p>
            ) : null}
            {matchingColumns.map((column) => (
              <button
                className="wp-option"
                key={column}
                onClick={() => setPopup({ kind: 'filter', anchor, column })}
                type="button"
              >
                {columns[column].label}
                {filters.some((filter) => filter.column === column) ? (
                  <Check size={16} />
                ) : (
                  <ChevronRight size={15} />
                )}
              </button>
            ))}
          </div>
        </TablePopover>
      );
    }

    if (popup.kind === 'sort') {
      return (
        <TablePopover
          anchor={anchor}
          close={closePopup}
          title="Сортировка"
          wide
        >
          <div className="wp-panel-body">
            {sorts.length > 1 ? (
              <p className="wp-panel-hint">
                Сортировка применяется сверху вниз
              </p>
            ) : null}
            {sorts.map(({ column, direction }, index) => (
              <div className="wp-sort-row" key={column}>
                <button
                  aria-label={`Повысить приоритет: ${columns[column].label}`}
                  className="wp-icon"
                  disabled={index === 0}
                  onClick={() => {
                    setSorts((current) => {
                      const updated = [...current];
                      [updated[index - 1], updated[index]] = [
                        updated[index]!,
                        updated[index - 1]!,
                      ];
                      return updated;
                    });
                    changePage(0);
                  }}
                  type="button"
                >
                  <ArrowUp size={15} />
                </button>
                <span>{columns[column].label}</span>
                <select
                  aria-label={`Направление: ${columns[column].label}`}
                  value={direction}
                  onChange={(event) =>
                    setSort(column, event.target.value as Sort['direction'])
                  }
                >
                  <option value="asc">{sortLabel(column, 'asc')}</option>
                  <option value="desc">{sortLabel(column, 'desc')}</option>
                </select>
                <button
                  aria-label={`Удалить сортировку: ${columns[column].label}`}
                  className="wp-icon"
                  onClick={() => {
                    setSorts((current) =>
                      current.filter((sort) => sort.column !== column),
                    );
                    changePage(0);
                  }}
                  type="button"
                >
                  <X size={15} />
                </button>
              </div>
            ))}
            {sorts.length < columnIds.length ? (
              <select
                aria-label="Добавить сортировку"
                data-initial-focus
                value=""
                onChange={(event) =>
                  setSort(event.target.value as ColumnId, 'asc')
                }
              >
                <option disabled value="">
                  Добавить столбец…
                </option>
                {columnIds
                  .filter(
                    (column) => !sorts.some((sort) => sort.column === column),
                  )
                  .map((column) => (
                    <option key={column} value={column}>
                      {columns[column].label}
                    </option>
                  ))}
              </select>
            ) : null}
            {sorts.length > 0 ? (
              <button
                className="wp-option wp-reset"
                onClick={() => {
                  setSorts([]);
                  changePage(0);
                }}
                type="button"
              >
                <RotateCcw size={16} /> Сбросить сортировку
              </button>
            ) : null}
          </div>
        </TablePopover>
      );
    }

    if (popup.kind === 'columns') {
      return (
        <TablePopover anchor={anchor} close={closePopup} title="Столбцы">
          <div className="wp-panel-body">
            <input
              aria-label="Найти столбец"
              data-initial-focus
              placeholder="Найти столбец…"
              value={columnQuery}
              onChange={(event) => setColumnQuery(event.target.value)}
            />
            {matchingColumns.length === 0 ? (
              <p className="wp-menu-empty" role="status">
                Столбцы не найдены
              </p>
            ) : null}
            <div className="wp-column-summary">
              <span>
                В таблице {visible.length} из {columnIds.length}
              </span>
              {view.hidden.length > 0 ? (
                <button
                  className="wp-link"
                  onClick={() =>
                    setView((current) => ({ ...current, hidden: [] }))
                  }
                  type="button"
                >
                  Показать все
                </button>
              ) : null}
            </div>
            {matchingColumns.map((column) => {
              const hidden = view.hidden.includes(column);
              return (
                <div
                  className="wp-column-option"
                  key={column}
                  {...dragTarget(column, true)}
                >
                  {column === 'name' ? (
                    <LockKeyhole aria-label="Закреплён" size={15} />
                  ) : (
                    <button
                      aria-label={`Переместить столбец «${columns[column].label}»`}
                      className="wp-grip"
                      draggable
                      type="button"
                      onKeyDown={(event) => {
                        if (
                          event.key !== 'ArrowUp' &&
                          event.key !== 'ArrowDown'
                        )
                          return;
                        event.preventDefault();
                        const index = view.order.indexOf(column);
                        const up = event.key === 'ArrowUp';
                        const target = view.order[index + (up ? -1 : 1)];
                        if (target && target !== 'name')
                          reorder(column, {
                            column: target,
                            side: up ? 'before' : 'after',
                          });
                      }}
                      onDragStart={(event) => {
                        event.dataTransfer.effectAllowed = 'move';
                        event.dataTransfer.setData(
                          'text/plain',
                          columns[column].label,
                        );
                        setDragged(column);
                      }}
                      onDragEnd={endDrag}
                      title="Перетащите или используйте стрелки ↑ и ↓"
                    >
                      <GripVertical size={15} />
                    </button>
                  )}
                  <span>{columns[column].label}</span>
                  <button
                    aria-label={`${hidden ? 'Показать' : 'Скрыть'} столбец «${columns[column].label}»`}
                    className="wp-icon"
                    disabled={column === 'name'}
                    onClick={() => toggleColumn(column)}
                    type="button"
                  >
                    {hidden ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              );
            })}
          </div>
        </TablePopover>
      );
    }

    if (popup.kind === 'appearance') {
      return (
        <TablePopover anchor={anchor} close={closePopup} title="Вид таблицы">
          <div className="wp-panel-body">
            <label className="wp-stacked">
              Высота строк
              <select
                data-initial-focus
                value={view.density}
                onChange={(event) =>
                  setView({
                    ...view,
                    density: Number(event.target.value) as View['density'],
                  })
                }
              >
                <option value="44">Компактная · 44 px</option>
                <option value="56">Стандартная · 56 px</option>
                <option value="64">Свободная · 64 px</option>
              </select>
            </label>
            <label className="wp-stacked">
              Размер текста
              <select
                value={view.fontSize}
                onChange={(event) =>
                  setView({
                    ...view,
                    fontSize: Number(event.target.value) as View['fontSize'],
                  })
                }
              >
                {[12, 13, 14].map((size) => (
                  <option key={size} value={size}>
                    {size} px
                  </option>
                ))}
              </select>
            </label>
            <button
              className="wp-option wp-reset"
              onClick={reset}
              type="button"
            >
              <RotateCcw size={16} /> Сбросить настройки таблицы
            </button>
          </div>
        </TablePopover>
      );
    }

    if (popup.kind !== 'column') return null;
    const { column } = popup;
    const index = visible.indexOf(column);
    const previous = visible[index - 1];
    const next = visible[index + 1];
    return (
      <TablePopover
        anchor={anchor}
        close={closePopup}
        title={columns[column].label}
      >
        <div className="wp-panel-body">
          <button
            className="wp-option"
            data-initial-focus
            onClick={() => {
              setSort(column, 'asc');
              closePopup(true);
            }}
            type="button"
          >
            <ArrowUp size={16} /> {sortLabel(column, 'asc')}
          </button>
          <button
            className="wp-option"
            onClick={() => {
              setSort(column, 'desc');
              closePopup(true);
            }}
            type="button"
          >
            <ArrowDown size={16} /> {sortLabel(column, 'desc')}
          </button>
          <button
            className="wp-option"
            onClick={() => setPopup({ kind: 'filter', anchor, column })}
            type="button"
          >
            <ListFilter size={16} /> Фильтровать
          </button>
          {column === 'name' ? (
            <div className="wp-locked">
              <LockKeyhole size={15} /> Закреплён слева
            </div>
          ) : (
            <>
              <div className="wp-menu-divider" />
              <button
                className="wp-option"
                disabled={!previous || previous === 'name'}
                onClick={() =>
                  previous &&
                  reorder(column, { column: previous, side: 'before' })
                }
                type="button"
              >
                <ArrowLeft size={16} /> Сдвинуть влево
              </button>
              <button
                className="wp-option"
                disabled={!next}
                onClick={() =>
                  next && reorder(column, { column: next, side: 'after' })
                }
                type="button"
              >
                <ArrowRight size={16} /> Сдвинуть вправо
              </button>
              <button
                className="wp-option"
                onClick={() => {
                  toggleColumn(column);
                  closePopup(false);
                  columnsButton.current?.focus();
                }}
                type="button"
              >
                <EyeOff size={16} /> Скрыть столбец
              </button>
            </>
          )}
        </div>
      </TablePopover>
    );
  }

  return (
    <main className="wp-page">
      <h1>Мои исполнители</h1>
      <div aria-label="Списки исполнителей" className="wp-tabs" role="group">
        {([false, true] as const).map((state) => (
          <button
            aria-pressed={state === blocked}
            key={String(state)}
            onClick={() => {
              setBlocked(state);
              setSelected([]);
              changePage(0);
            }}
            type="button"
          >
            {state ? 'Заблокированы' : 'Все исполнители'}
          </button>
        ))}
      </div>

      <section aria-label="Список исполнителей" className="wp-card">
        <div className="wp-toolbar">
          <div className="wp-search">
            <Search size={17} />
            <input
              aria-label="Поиск исполнителей"
              onChange={(event) => {
                setSearch(event.target.value);
                setSelected([]);
                changePage(0);
              }}
              placeholder="ФИО или ИНН"
              type="search"
              value={search}
            />
            {search ? (
              <button
                aria-label="Очистить поиск"
                className="wp-icon"
                onClick={() => {
                  setSearch('');
                  changePage(0);
                  setSelected([]);
                }}
                type="button"
              >
                <X size={15} />
              </button>
            ) : null}
          </div>
          <div className="wp-tools">
            <button
              aria-expanded={popup?.kind === 'fields'}
              aria-haspopup="dialog"
              className="wp-button"
              data-active={filters.length > 0}
              onClick={(event) => togglePopup('fields', event.currentTarget)}
              ref={filterButton}
              type="button"
            >
              <ListFilter size={17} /> Фильтр{' '}
              {filters.length ? (
                <span className="wp-count">{filters.length}</span>
              ) : null}
            </button>
            <button
              aria-expanded={popup?.kind === 'sort'}
              aria-haspopup="dialog"
              className="wp-button"
              data-active={sorts.length > 0}
              onClick={(event) => togglePopup('sort', event.currentTarget)}
              type="button"
            >
              <ArrowDownUp size={16} /> Сортировка{' '}
              {sorts.length ? (
                <span className="wp-count">{sorts.length}</span>
              ) : null}
            </button>
            <button
              aria-expanded={popup?.kind === 'columns'}
              aria-haspopup="dialog"
              className="wp-button"
              data-active={view.hidden.length > 0}
              onClick={(event) => togglePopup('columns', event.currentTarget)}
              ref={columnsButton}
              type="button"
            >
              <Columns3 size={17} /> Столбцы{' '}
              <ChevronDown className="wp-tool-chevron" size={13} />
            </button>
            <button
              aria-expanded={popup?.kind === 'appearance'}
              aria-haspopup="dialog"
              aria-label="Вид таблицы"
              className="wp-button wp-icon"
              onClick={(event) =>
                togglePopup('appearance', event.currentTarget)
              }
              title="Вид таблицы"
              type="button"
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>

        {filters.length > 0 ? (
          <div aria-label="Активные фильтры" className="wp-filters">
            {filters.map((filter) => (
              <div className="wp-filter-chip" key={filter.column}>
                <button
                  aria-haspopup="dialog"
                  onClick={(event) =>
                    setPopup({
                      kind: 'filter',
                      column: filter.column,
                      anchor: event.currentTarget,
                    })
                  }
                  type="button"
                >
                  {columns[filter.column].label}:{' '}
                  <strong>{formatFilter(filter)}</strong>
                  <ChevronDown size={12} />
                </button>
                <button
                  aria-label={`Снять фильтр «${columns[filter.column].label}»`}
                  onClick={() => {
                    changeFilter(filter.column);
                    filterButton.current?.focus();
                  }}
                  type="button"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
            <button
              className="wp-link"
              onClick={() => {
                setFilters([]);
                setSelected([]);
                changePage(0);
                filterButton.current?.focus();
              }}
              type="button"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : null}

        <div
          aria-label="Прокручиваемая таблица исполнителей"
          className="wp-scroll"
          onScroll={() => {
            if (popup?.anchor.closest('.wp-scroll')) closePopup(false);
          }}
          ref={scroll}
          role="region"
          tabIndex={0}
        >
          <table
            aria-label="Мои исполнители"
            style={
              {
                '--wp-min-table': `calc(40px + min(${widthOf('name')}px, var(--wp-name-limit)) + ${visible.slice(1).reduce((total, column) => total + widthOf(column), 0)}px)`,
                '--wp-row': `${view.density}px`,
                '--wp-cell-font': `${view.fontSize}px`,
              } as CSSProperties
            }
          >
            <colgroup>
              <col className="wp-check-width" />
              {visible.map((column) => (
                <col
                  key={column}
                  style={{
                    width:
                      column === 'name'
                        ? `min(${widthOf('name')}px, var(--wp-name-limit))`
                        : widthOf(column),
                  }}
                />
              ))}
              <col />
            </colgroup>
            <thead>
              <tr>
                <th className="wp-check-cell" scope="col">
                  <input
                    aria-label="Выбрать все строки на странице"
                    checked={
                      pageRows.length > 0 && checkedCount === pageRows.length
                    }
                    disabled={pageRows.length === 0}
                    ref={(input) => {
                      if (input)
                        input.indeterminate =
                          checkedCount > 0 && checkedCount !== pageRows.length;
                    }}
                    onChange={(event) => {
                      const ids = pageRows.map(({ id }) => id);
                      setSelected((current) =>
                        event.target.checked
                          ? [...new Set([...current, ...ids])]
                          : current.filter((id) => !ids.includes(id)),
                      );
                    }}
                    type="checkbox"
                  />
                </th>
                {visible.map((column) => {
                  const width = widthOf(column);
                  const sort = sorts.find((entry) => entry.column === column);
                  const filtered = filters.some(
                    (filter) => filter.column === column,
                  );
                  const SortIcon =
                    sort?.direction === 'desc' ? ArrowDown : ArrowUp;
                  return (
                    <th
                      aria-sort={
                        sort && sorts[0]?.column === column
                          ? sort.direction === 'desc'
                            ? 'descending'
                            : 'ascending'
                          : undefined
                      }
                      className={column === 'name' ? 'wp-frozen' : undefined}
                      data-column={column}
                      key={column}
                      scope="col"
                      {...dragTarget(column)}
                    >
                      <div className="wp-header">
                        <button
                          aria-expanded={
                            popup?.kind === 'column' && popup.column === column
                          }
                          aria-haspopup="dialog"
                          aria-label={`Столбец «${columns[column].label}»`}
                          draggable={column !== 'name'}
                          onClick={(event) =>
                            openColumn(column, event.currentTarget)
                          }
                          onDragEnd={endDrag}
                          onDragStart={(event) => startDrag(event, column)}
                          onContextMenu={(event) => {
                            event.preventDefault();
                            openColumn(column, event.currentTarget);
                          }}
                          title={
                            column === 'name'
                              ? 'Настройки закреплённого столбца'
                              : `${columns[column].label}: нажмите для настроек, перетащите для перемещения`
                          }
                          type="button"
                        >
                          <span>{columns[column].label}</span>
                          {sort ? (
                            <SortIcon className="wp-header-accent" size={13} />
                          ) : filtered ? (
                            <ListFilter
                              className="wp-header-accent"
                              size={13}
                            />
                          ) : (
                            <Ellipsis className="wp-header-more" size={14} />
                          )}
                        </button>
                        <span
                          aria-label={`Ширина столбца «${columns[column].label}»`}
                          aria-orientation="vertical"
                          aria-valuemin={columnWidth(column, 0)}
                          aria-valuemax={480}
                          aria-valuenow={width}
                          aria-valuetext={`${width} пикселей`}
                          className="wp-resize"
                          onDoubleClick={() =>
                            setView((current) => {
                              const widths = { ...current.widths };
                              delete widths[column];
                              return { ...current, widths };
                            })
                          }
                          onKeyDown={(event) => {
                            if (
                              event.key !== 'ArrowLeft' &&
                              event.key !== 'ArrowRight'
                            )
                              return;
                            event.preventDefault();
                            updateWidth(
                              column,
                              width + (event.key === 'ArrowRight' ? 8 : -8),
                            );
                          }}
                          onPointerDown={(event) =>
                            startResize(event, column, width)
                          }
                          role="separator"
                          tabIndex={0}
                          title="Потяните для изменения ширины. Двойной щелчок вернёт исходную ширину."
                        />
                      </div>
                    </th>
                  );
                })}
                <th aria-hidden="true" />
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => (
                <tr data-selected={selected.includes(row.id)} key={row.id}>
                  <td className="wp-check-cell">
                    <input
                      aria-label={`Выбрать ${row.name}`}
                      checked={selected.includes(row.id)}
                      onChange={(event) =>
                        setSelected((current) =>
                          event.target.checked
                            ? [...current, row.id]
                            : current.filter((id) => id !== row.id),
                        )
                      }
                      type="checkbox"
                    />
                  </td>
                  {visible.map((column) => (
                    <td
                      className={column === 'name' ? 'wp-frozen' : undefined}
                      key={column}
                    >
                      <PerformerCell
                        column={column}
                        row={row}
                        onOpen={() => setProfile(row)}
                      />
                    </td>
                  ))}
                  <td aria-hidden="true" />
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 ? (
            <div className="wp-empty">
              <Search size={21} />
              <strong>Исполнители не найдены</strong>
              <button
                className="wp-link"
                onClick={() => {
                  setFilters([]);
                  setSearch('');
                  changePage(0);
                }}
                type="button"
              >
                Очистить поиск и фильтры
              </button>
            </div>
          ) : null}
        </div>
        <footer className="wp-footer">
          <div aria-live="polite">
            {selected.length > 0 ? (
              <>
                Выбрано {selected.length}{' '}
                <button
                  className="wp-link"
                  onClick={() => setSelected([])}
                  type="button"
                >
                  Снять выбор
                </button>
              </>
            ) : (
              `Показано ${rows.length ? page * limit + 1 : 0}–${Math.min((page + 1) * limit, rows.length)} из ${rows.length}`
            )}
          </div>
          <div className="wp-pagination">
            <label>
              На странице{' '}
              <select
                value={limit}
                onChange={(event) => {
                  setView({
                    ...view,
                    pageSize: Number(event.target.value) as View['pageSize'],
                  });
                  changePage(0);
                }}
              >
                {[10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
            <div className="wp-page-buttons">
              <button
                aria-label="Предыдущая страница"
                className="wp-icon"
                disabled={page === 0}
                onClick={() => changePage(page - 1)}
                type="button"
              >
                <ChevronLeft size={17} />
              </button>
              <span aria-label={`Страница ${page + 1} из ${pageCount}`}>
                {page + 1} / {pageCount}
              </span>
              <button
                aria-label="Следующая страница"
                className="wp-icon"
                disabled={page + 1 === pageCount}
                onClick={() => changePage(page + 1)}
                type="button"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </footer>
      </section>

      {renderPopup()}
      <dialog
        aria-labelledby="wp-profile-name"
        className="wp-profile"
        ref={details}
        onClose={() => setProfile(undefined)}
        onClick={(event) => {
          if (event.target === event.currentTarget) details.current?.close();
        }}
      >
        {profile ? (
          <article>
            <div className="wp-popover-heading">
              <h2 id="wp-profile-name">{profile.name}</h2>
              <button
                aria-label="Закрыть карточку"
                className="wp-icon"
                onClick={() => details.current?.close()}
                type="button"
              >
                <X size={18} />
              </button>
            </div>
            <dl>
              <div>
                <dt>ИНН</dt>
                <dd>{profile.taxId}</dd>
              </div>
              {columnIds.slice(1).map((column) => (
                <div key={column}>
                  <dt>{columns[column].label}</dt>
                  <dd>
                    <PerformerCell
                      column={column}
                      row={profile}
                      withLabel
                      onOpen={() => {}}
                    />
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        ) : null}
      </dialog>
      <span aria-live="polite" className="sr-only">
        {announcement}
      </span>
    </main>
  );
}
