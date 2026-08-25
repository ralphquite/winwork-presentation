import {
  Check,
  ChevronDown,
  ClipboardList,
  FileText,
  FilePlus2,
  MapPin,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  UserPlus,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';

import {
  Checkbox,
  DesktopShell,
  Drawer,
  Field,
  ProductButton,
  ProductModal,
  SelectField,
  SettingsScaffold,
  StatusToast,
  TextAreaField,
} from './ProductUI';
import { useTransientMessage } from './useTransientMessage';

const OBJECT_ROWS = [
  ['Объект для ревью 3', 'Грузчик', 'Владимир, ул. Варварка, 1'],
  ['Тестовый склад', 'Работник склада', 'Владимирская область, Гороховец'],
  ['Успех old рүк 4', 'Бармен', 'Москва, Москва'],
  ['Успех 2', 'Доставка еды', 'Москва, Москва'],
  ['Ревью тест', 'Грузчик', 'Брянская область, Жуковка'],
  ['Объект для ревью 2', 'Работник склада', 'Владимир, пр-т Ленина, 12'],
] as const;

const ACTIVITY_ROWS = [
  ['Грузчик', 'Выбрано: 16'],
  ['Работник склада', 'Выбрано: 8'],
  ['Кладовщик', 'Комплектация, сортировка, инвентаризация'],
] as const;

function DataTable({
  columns,
  rows,
}: {
  columns: readonly string[];
  rows: readonly (readonly string[])[];
}) {
  return (
    <div className="ww-table-shell">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
            <th aria-label="Действия" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${row[0]}-${rowIndex}`}>
              {row.map((cell) => (
                <td key={cell}>{cell}</td>
              ))}
              <td>
                <button aria-label={`Редактировать ${row[0]}`} type="button">
                  <Pencil aria-hidden="true" size={17} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <footer>
        <span>На странице: 10 · Страница 1 из 3</span>
        <div>
          <button aria-label="Предыдущая страница" type="button">
            ‹
          </button>
          <button aria-current="page" type="button">
            1
          </button>
          <button aria-label="Следующая страница" type="button">
            ›
          </button>
        </div>
      </footer>
    </div>
  );
}

function PageHeading({
  actions,
  children,
}: {
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="ww-page-heading">
      <h2>{children}</h2>
      {actions ? <div className="ww-page-actions">{actions}</div> : null}
    </div>
  );
}

export function CreateObjectDemo() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [managerCount, setManagerCount] = useState(1);
  const [activityCount, setActivityCount] = useState(0);
  const [objectName, setObjectName] = useState('');
  const [rows, setRows] = useState<readonly (readonly string[])[]>(OBJECT_ROWS);
  const [toast, setToast] = useTransientMessage();

  const saveObject = () => {
    const nextName = objectName.trim() || 'Склад на Новомосковской';
    setRows((currentRows) => [
      [nextName, 'Кладовщик', 'Москва, ул. Новомосковская, 10'],
      ...currentRows,
    ]);
    setIsDrawerOpen(false);
    setToast('Объект сохранён');
  };

  return (
    <DesktopShell>
      <SettingsScaffold activeSubtab="Мои объекты">
        <PageHeading
          actions={
            <>
              <ProductButton
                data-demo-action="add-object"
                onClick={() => setIsDrawerOpen(true)}
              >
                <Plus aria-hidden="true" size={18} /> Добавить объект
              </ProductButton>
              <ProductButton variant="secondary">
                <Upload aria-hidden="true" size={18} /> Загрузить реестр
                объектов
              </ProductButton>
            </>
          }
        >
          Мои объекты
        </PageHeading>
        <DataTable
          columns={['Название объекта', 'Типы работ', 'Адрес']}
          rows={rows}
        />
      </SettingsScaffold>

      {isDrawerOpen ? (
        <Drawer onClose={() => setIsDrawerOpen(false)} title="Добавить объект">
          <section className="ww-drawer-section">
            <h3>Адрес объекта</h3>
            <Checkbox
              checked={false}
              label="Удалённая работа"
              onChange={() => undefined}
            />
            <Field
              label="Название объекта"
              onChange={(event) => setObjectName(event.currentTarget.value)}
              placeholder="Введите название объекта"
              value={objectName}
            />
            <div className="ww-field-grid is-two">
              <SelectField
                defaultValue="Москва"
                label="Регион заказа"
                options={['Москва', 'Московская область', 'Санкт-Петербург']}
              />
              <Field
                label="Город или населённый пункт"
                placeholder="Введите город"
              />
            </div>
            <Field
              label="Населённый пункт, название улицы"
              placeholder="Введите адрес"
            />
            <div className="ww-field-grid is-three">
              <Field label="Дом/строение" placeholder="—" />
              <Field label="Корпус" placeholder="—" />
              <Field label="Квартира" placeholder="—" />
            </div>
          </section>
          <section className="ww-drawer-section">
            <h3>Внутренние примечания</h3>
            <Field
              label="Идентификатор объекта"
              placeholder="Введите идентификатор"
            />
          </section>
          <section className="ww-drawer-section">
            <h3>Руководитель объекта</h3>
            <p>
              Руководителю на почту придёт ссылка на скачивание мобильного
              приложения и данные для входа.
            </p>
            {Array.from({ length: managerCount }, (_, index) => (
              <Field
                key={`manager-${index + 1}`}
                label={`Email для входа · Руководитель ${index + 1}`}
                placeholder="manager@example.test"
                type="email"
              />
            ))}
            <ProductButton
              data-demo-action="add-object-manager"
              onClick={() => setManagerCount((count) => count + 1)}
              variant="secondary"
            >
              <UserPlus aria-hidden="true" size={17} /> Добавить руководителя
            </ProductButton>
          </section>
          <section className="ww-drawer-section">
            <h3>Виды деятельности</h3>
            {Array.from({ length: activityCount }, (_, index) => (
              <SelectField
                key={`activity-${index + 1}`}
                label={`Вид деятельности ${index + 1}`}
                options={['Кладовщик', 'Грузчик', 'Комплектовщик']}
              />
            ))}
            <ProductButton
              onClick={() => setActivityCount((count) => count + 1)}
              variant="secondary"
            >
              <Plus aria-hidden="true" size={17} /> Добавить вид деятельности
            </ProductButton>
          </section>
          <ProductButton data-demo-action="save-object" onClick={saveObject}>
            Сохранить
          </ProductButton>
        </Drawer>
      ) : null}
      {toast ? <StatusToast>{toast}</StatusToast> : null}
    </DesktopShell>
  );
}

function ActivitySettingsPage({ onAdd }: { onAdd: () => void }) {
  const [taxStatus, setTaxStatus] = useState({ fl: true, ip: true, npa: true });

  return (
    <SettingsScaffold activeSubtab="Пакеты документов по типам исполнителей">
      <PageHeading
        actions={
          <ProductButton data-demo-action="add-activity" onClick={onAdd}>
            <Plus aria-hidden="true" size={18} /> Добавить вид деятельности
          </ProductButton>
        }
      >
        Формирование пакетов документов по видам деятельности
      </PageHeading>
      <section className="ww-tax-card">
        <h3>Налоговый статус исполнителей</h3>
        <p>
          Выберите налоговый статус исполнителей, с которыми вы готовы работать.
        </p>
        <div>
          <Checkbox checked={false} label="СМЗ" onChange={() => undefined} />
          <Checkbox
            checked={taxStatus.ip}
            label="ИП"
            onChange={(ip) => setTaxStatus((value) => ({ ...value, ip }))}
          />
          <Checkbox
            checked={taxStatus.npa}
            label="ИП на НПД"
            onChange={(npa) => setTaxStatus((value) => ({ ...value, npa }))}
          />
          <Checkbox
            checked={taxStatus.fl}
            label="ФЛ"
            onChange={(fl) => setTaxStatus((value) => ({ ...value, fl }))}
          />
        </div>
      </section>
      <DataTable
        columns={['Вид деятельности', 'Услуги']}
        rows={ACTIVITY_ROWS}
      />
    </SettingsScaffold>
  );
}

type ActivityDrawerContentProps = {
  onOpenActTemplate?: () => void;
  onOpenContractTemplate?: () => void;
  onSave: () => void;
  selectedActTemplate?: string;
  selectedContractTemplate?: string;
};

function ActivityDrawerContent({
  onOpenActTemplate,
  onOpenContractTemplate,
  onSave,
  selectedActTemplate = 'Шаблон акта для кладовщика',
  selectedContractTemplate = 'Шаблон договора для кладовщика',
}: ActivityDrawerContentProps) {
  const [medicalBook, setMedicalBook] = useState(true);
  const [driversLicense, setDriversLicense] = useState(true);
  const [operations, setOperations] = useState(1);

  return (
    <>
      <SelectField
        defaultValue="Кладовщик"
        label="Вид деятельности"
        options={['Кладовщик', 'Грузчик', 'Комплектовщик']}
      />
      <button
        className="ww-select-button"
        data-demo-action="contract-template"
        onClick={onOpenContractTemplate}
        type="button"
      >
        <span>
          <small>Шаблон договора</small>
          {selectedContractTemplate}
        </span>
        <ChevronDown aria-hidden="true" size={17} />
      </button>
      <button
        className="ww-select-button"
        data-demo-action="act-template"
        onClick={onOpenActTemplate}
        type="button"
      >
        <span>
          <small>Шаблон акта</small>
          {selectedActTemplate}
        </span>
        <ChevronDown aria-hidden="true" size={17} />
      </button>
      <TextAreaField
        defaultValue="Взять перчатки"
        label="Требования и указания исполнителю"
      />
      <section className="ww-drawer-section">
        <h3>Дополнительные требования</h3>
        <Checkbox
          checked={medicalBook}
          label="Требуется медицинская книжка"
          onChange={setMedicalBook}
        />
        <Checkbox
          checked={driversLicense}
          label="Требуются водительские права"
          onChange={setDriversLicense}
        />
        {driversLicense ? (
          <div className="ww-license-grid">
            {['A', 'B', 'C', 'D'].map((license) => (
              <Checkbox
                checked
                key={license}
                label={license}
                onChange={() => undefined}
              />
            ))}
          </div>
        ) : null}
      </section>
      <section className="ww-drawer-section">
        <h3>Операции</h3>
        <SelectField
          label="Перечень операций"
          options={['Выбрано: 16', 'Сортировка', 'Разгрузка', 'Инвентаризация']}
        />
        <ProductButton
          onClick={() => setOperations((count) => count + 1)}
          variant="secondary"
        >
          Создать новую операцию
        </ProductButton>
        {Array.from({ length: operations }, (_, index) => (
          <div className="ww-operation-card" key={`operation-${index + 1}`}>
            <div>
              <strong>Новая операция {index + 1}</strong>
              <button
                aria-label={`Удалить операцию ${index + 1}`}
                onClick={() => setOperations((count) => Math.max(0, count - 1))}
                type="button"
              >
                <Trash2 aria-hidden="true" size={17} />
              </button>
            </div>
            <Field
              defaultValue="Расстановка товаров на складе"
              label="Название операции"
            />
            <Field defaultValue="120" label="Длительность одной операции" />
            <Field
              defaultValue="Расставить товары по полкам на складе"
              label="Описание для договора"
            />
          </div>
        ))}
      </section>
      <div className="ww-operation-summary">
        <span>Сортировка товара</span>
        <span>
          Одна операция: <strong>30</strong> мин
        </span>
      </div>
      <div className="ww-operation-summary">
        <span>Разгрузка фуры</span>
        <span>
          Одна операция: <strong>60</strong> мин
        </span>
      </div>
      <ProductButton data-demo-action="save-activity" onClick={onSave}>
        Сохранить
      </ProductButton>
    </>
  );
}

export function CreateActivityDemo() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toast, setToast] = useTransientMessage();

  return (
    <DesktopShell>
      <ActivitySettingsPage onAdd={() => setIsDrawerOpen(true)} />
      {isDrawerOpen ? (
        <Drawer
          onClose={() => setIsDrawerOpen(false)}
          title="Добавить новый вид деятельности"
        >
          <ActivityDrawerContent
            onSave={() => {
              setIsDrawerOpen(false);
              setToast('Вид деятельности сохранён');
            }}
          />
        </Drawer>
      ) : null}
      {toast ? <StatusToast>{toast}</StatusToast> : null}
    </DesktopShell>
  );
}

type TemplatePickerProps = {
  kind: 'акт' | 'договор';
  onChoose: (value: string) => void;
  onCreate: () => void;
  onClose: () => void;
};

function TemplatePicker({
  kind,
  onChoose,
  onClose,
  onCreate,
}: TemplatePickerProps) {
  const title = kind === 'договор' ? 'Шаблон договора' : 'Шаблон акта';
  const templates =
    kind === 'договор'
      ? [
          'Шаблон договора для кладовщика',
          'Договор оказания услуг',
          'Договор подряда',
        ]
      : ['Шаблон акта для кладовщика', 'Акт выполненных работ'];

  return (
    <ProductModal onClose={onClose} title={title}>
      <div className="ww-template-picker">
        <label>
          <Search aria-hidden="true" size={17} />
          <input
            aria-label={`Найти ${title.toLowerCase()}`}
            placeholder="Поиск шаблона"
          />
        </label>
        {templates.map((template) => (
          <button
            key={template}
            onClick={() => onChoose(template)}
            type="button"
          >
            <FileText aria-hidden="true" size={18} />
            <span>{template}</span>
            <Check aria-hidden="true" size={17} />
          </button>
        ))}
        <ProductButton
          data-demo-action={`create-${kind}-template`}
          onClick={onCreate}
        >
          <FilePlus2 aria-hidden="true" size={18} /> Создать новый шаблон
        </ProductButton>
      </div>
    </ProductModal>
  );
}

type TemplateEditorProps = {
  kind: 'акт' | 'договор';
  onClose: () => void;
  onSave: (value: string) => void;
};

function TemplateEditor({ kind, onClose, onSave }: TemplateEditorProps) {
  const [name, setName] = useState(
    kind === 'договор'
      ? 'Договор для складских работ'
      : 'Акт для складских работ',
  );

  return (
    <ProductModal onClose={onClose} title="Редактор шаблона" width="document">
      <div className="ww-document-editor">
        <div className="ww-editor-sidebar">
          <Field
            label="Название шаблона"
            onChange={(event) => setName(event.currentTarget.value)}
            value={name}
          />
          <h3>Переменные</h3>
          {[
            'Номер заказа',
            'Дата',
            'ФИО исполнителя',
            'Сумма',
            'Адрес объекта',
          ].map((variable) => (
            <button key={variable} type="button">
              {`{{${variable}}}`}
            </button>
          ))}
        </div>
        <div className="ww-editor-main">
          <div className="ww-editor-toolbar" aria-label="Панель форматирования">
            {['Отменить', 'Повторить', 'B', 'I', 'U', 'Список', 'Ссылка'].map(
              (tool) => (
                <button aria-label={tool} key={tool} type="button">
                  {tool}
                </button>
              ),
            )}
          </div>
          <div
            className="ww-document-page"
            contentEditable
            suppressContentEditableWarning
          >
            <h2>
              {kind === 'договор'
                ? 'ДОГОВОР ОКАЗАНИЯ УСЛУГ'
                : 'АКТ ВЫПОЛНЕННЫХ РАБОТ'}
            </h2>
            <p>г. Москва &nbsp;&nbsp;&nbsp; {`{{Дата}}`}</p>
            <p>
              Заказчик поручает, а Исполнитель принимает на себя выполнение
              работ по заказу {`{{Номер заказа}}`}.
            </p>
            <h3>1. Предмет документа</h3>
            <p>
              Исполнитель: {`{{ФИО исполнителя}}`}. Адрес объекта:{' '}
              {`{{Адрес объекта}}`}. Стоимость выполненных работ составляет{' '}
              {`{{Сумма}}`} рублей.
            </p>
            <h3>2. Подписи сторон</h3>
            <p>
              Заказчик ____________________ Исполнитель ____________________
            </p>
          </div>
          <ProductButton
            data-demo-action="save-template"
            onClick={() => onSave(name)}
          >
            Сохранить шаблон
          </ProductButton>
        </div>
      </div>
    </ProductModal>
  );
}

export function DocumentTemplatesDemo() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [picker, setPicker] = useState<'акт' | 'договор' | null>(null);
  const [editor, setEditor] = useState<'акт' | 'договор' | null>(null);
  const [contractTemplate, setContractTemplate] = useState(
    'Шаблон договора для кладовщика',
  );
  const [actTemplate, setActTemplate] = useState('Шаблон акта для кладовщика');
  const [toast, setToast] = useTransientMessage();

  const saveTemplate = (value: string) => {
    if (editor === 'договор') {
      setContractTemplate(value);
    } else {
      setActTemplate(value);
    }
    setEditor(null);
    setToast('Шаблон сохранён и выбран');
  };

  return (
    <DesktopShell>
      <ActivitySettingsPage onAdd={() => setIsDrawerOpen(true)} />
      {isDrawerOpen ? (
        <Drawer
          onClose={() => setIsDrawerOpen(false)}
          title="Добавить новый вид деятельности"
        >
          <ActivityDrawerContent
            onOpenActTemplate={() => setPicker('акт')}
            onOpenContractTemplate={() => setPicker('договор')}
            onSave={() => {
              setIsDrawerOpen(false);
              setToast('Настройки документов сохранены');
            }}
            selectedActTemplate={actTemplate}
            selectedContractTemplate={contractTemplate}
          />
        </Drawer>
      ) : null}
      {picker ? (
        <TemplatePicker
          kind={picker}
          onChoose={(value) => {
            if (picker === 'договор') {
              setContractTemplate(value);
            } else {
              setActTemplate(value);
            }
            setPicker(null);
          }}
          onClose={() => setPicker(null)}
          onCreate={() => {
            setEditor(picker);
            setPicker(null);
          }}
        />
      ) : null}
      {editor ? (
        <TemplateEditor
          kind={editor}
          onClose={() => setEditor(null)}
          onSave={saveTemplate}
        />
      ) : null}
      {toast ? <StatusToast>{toast}</StatusToast> : null}
    </DesktopShell>
  );
}

const TASK_ROWS = [
  ['Грузчик на склад', '14 августа, 10:00', '3 200 ₽', 'Выполняется'],
  ['Комплектовщик заказов', '14 августа, 12:00', '4 000 ₽', 'Есть отклики'],
  ['Инвентаризация склада', '15 августа, 09:00', '5 600 ₽', 'Черновик'],
] as const;

export function SingleTaskDemo() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [drawerState, setDrawerState] = useState<'create' | 'created' | null>(
    null,
  );
  const [taskName, setTaskName] = useState('Разгрузка товаров на складе');
  const [remote, setRemote] = useState(false);
  const [toast, setToast] = useTransientMessage();

  return (
    <DesktopShell activeNavigation="Маркетплейс">
      <div className="ww-marketplace-page">
        <PageHeading
          actions={
            <div className="ww-create-menu-anchor">
              <ProductButton
                data-demo-action="add-task"
                onClick={() => setIsMenuOpen((open) => !open)}
              >
                <Plus aria-hidden="true" size={18} /> Добавить задание
                <ChevronDown aria-hidden="true" size={16} />
              </ProductButton>
              {isMenuOpen ? (
                <div className="ww-create-menu">
                  <button
                    data-demo-action="single-task"
                    onClick={() => {
                      setDrawerState('create');
                      setIsMenuOpen(false);
                    }}
                    type="button"
                  >
                    <ClipboardList aria-hidden="true" size={19} />
                    <span>
                      <strong>Разовое задание</strong>
                      <small>Создать и опубликовать одну задачу</small>
                    </span>
                  </button>
                  <button type="button">
                    <Upload aria-hidden="true" size={19} />
                    <span>
                      <strong>Загрузить реестр</strong>
                      <small>Создать много заданий из файла</small>
                    </span>
                  </button>
                </div>
              ) : null}
            </div>
          }
        >
          Маркетплейс
        </PageHeading>
        <div className="ww-market-filters">
          <label>
            <Search aria-hidden="true" size={17} />
            <input
              aria-label="Поиск заданий"
              placeholder="Название задания или исполнитель"
            />
          </label>
          <SelectField
            label="Статус"
            options={['Все статусы', 'Выполняется', 'Есть отклики', 'Черновик']}
          />
        </div>
        <DataTable
          columns={['Задание', 'Дата и время', 'Вознаграждение', 'Статус']}
          rows={TASK_ROWS}
        />
      </div>

      {drawerState === 'create' ? (
        <Drawer
          key="create-task"
          onClose={() => setDrawerState(null)}
          title="Создать разовое задание"
        >
          <SelectField
            label="Вид деятельности"
            options={['Кладовщик', 'Грузчик', 'Комплектовщик']}
          />
          <Field
            label="Название задания"
            onChange={(event) => setTaskName(event.currentTarget.value)}
            value={taskName}
          />
          <TextAreaField
            defaultValue="Принять поставку, проверить количество и разместить товары по зонам хранения."
            label="Описание задания"
          />
          <Checkbox
            checked={remote}
            label="Удалённая работа"
            onChange={setRemote}
          />
          {remote ? null : (
            <>
              <SelectField
                label="Объект"
                options={[
                  'Склад на Новомосковской',
                  'Распределительный центр Север',
                ]}
              />
              <div className="ww-map-placeholder">
                <MapPin aria-hidden="true" size={22} />
                <span>Москва, ул. Новомосковская, 10</span>
              </div>
            </>
          )}
          <div className="ww-field-grid is-two">
            <Field defaultValue="14.08.2026" label="Дата" type="text" />
            <Field defaultValue="10:00" label="Время" type="text" />
          </div>
          <Field
            defaultValue="3 200"
            label="Вознаграждение, ₽"
            inputMode="numeric"
          />
          <Checkbox
            checked
            label="Опубликовать сразу"
            onChange={() => undefined}
          />
          <ProductButton
            data-demo-action="create-task"
            onClick={() => {
              setDrawerState('created');
              setToast('Задание создано');
            }}
          >
            Создать задание
          </ProductButton>
        </Drawer>
      ) : null}

      {drawerState === 'created' ? (
        <Drawer
          key="created-task"
          onClose={() => setDrawerState(null)}
          title="Задание создано"
        >
          <div className="ww-created-state">
            <span className="ww-success-icon">
              <Check aria-hidden="true" size={30} />
            </span>
            <h3>{taskName}</h3>
            <p>Задание опубликовано и уже доступно исполнителям.</p>
          </div>
          <dl className="ww-details-list">
            <div>
              <dt>Статус</dt>
              <dd>Опубликовано</dd>
            </div>
            <div>
              <dt>Вид деятельности</dt>
              <dd>Кладовщик</dd>
            </div>
            <div>
              <dt>Объект</dt>
              <dd>Склад на Новомосковской</dd>
            </div>
            <div>
              <dt>Начало</dt>
              <dd>14 августа, 10:00</dd>
            </div>
            <div>
              <dt>Вознаграждение</dt>
              <dd>3 200 ₽</dd>
            </div>
          </dl>
          <ProductButton onClick={() => setDrawerState(null)}>
            Готово
          </ProductButton>
          <ProductButton variant="secondary">Скопировать задание</ProductButton>
          <button className="ww-more-button" type="button">
            <MoreVertical aria-hidden="true" size={18} /> Другие действия
          </button>
        </Drawer>
      ) : null}
      {toast ? <StatusToast>{toast}</StatusToast> : null}
    </DesktopShell>
  );
}
