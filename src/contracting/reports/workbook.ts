import {
  displayCell,
  partyName,
  period,
  reportData,
  reportTitle,
  statuses,
  type Cell,
  type Report,
} from './data';

const encoder = new TextEncoder();
const declaration = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
const xmlns = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
const relationships =
  'http://schemas.openxmlformats.org/officeDocument/2006/relationships';

function escape(value: string) {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&apos;',
      })[char]!,
  );
}

// Excel accepts uncompressed ZIP entries. The workbook uses inline strings and
// numeric cells, so it needs neither a shared string table nor runtime libraries.
function zip(entries: Record<string, string>) {
  const chunks: ArrayBuffer[] = [];
  const directory: ArrayBuffer[] = [];
  let offset = 0;
  let centralSize = 0;
  for (const [path, xml] of Object.entries(entries)) {
    const name = encoder.encode(path);
    const data = encoder.encode(declaration + xml);
    let crc = -1;
    for (const byte of data) {
      crc ^= byte;
      for (let bit = 0; bit < 8; bit++)
        crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
    const local = new DataView(new ArrayBuffer(30 + name.length));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);
    local.setUint16(12, 33, true);
    local.setUint32(14, ~crc, true);
    local.setUint32(18, data.length, true);
    local.setUint32(22, data.length, true);
    local.setUint16(26, name.length, true);
    new Uint8Array(local.buffer).set(name, 30);

    const central = new DataView(new ArrayBuffer(46 + name.length));
    central.setUint32(0, 0x02014b50, true);
    central.setUint16(4, 20, true);
    new Uint8Array(central.buffer).set(new Uint8Array(local.buffer, 4, 26), 6);
    central.setUint32(42, offset, true);
    new Uint8Array(central.buffer).set(name, 46);
    chunks.push(local.buffer, data.buffer);
    directory.push(central.buffer);
    offset += local.byteLength + data.length;
    centralSize += central.byteLength;
  }
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, directory.length, true);
  end.setUint16(10, directory.length, true);
  end.setUint32(12, centralSize, true);
  end.setUint32(16, offset, true);
  return new Blob([...chunks, ...directory, end.buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

export function downloadReport(report: Report) {
  const { options, role } = report;
  const { columns, rows } = reportData(role, options);
  const table: Cell[][] = [
    [reportTitle(report)],
    ['Период по дате начала задания', period(options)],
    ['Охват', partyName(role, options.party)],
    [
      'Статусы',
      options.statuses.map((status) => statuses[status]).join(', ') ||
        'Все статусы',
    ],
    [],
    columns.map(({ label }) => label),
    ...rows.map((row) =>
      row.map((value, index) => {
        const column = columns[index]!;
        return column.format === 'money' ? value : displayCell(value, column);
      }),
    ),
  ];
  const sheet = table
    .map(
      (row, index) =>
        `<row r="${index + 1}">${row
          .map((cell, col) => {
            const ref = String.fromCharCode(65 + col) + (index + 1);
            return typeof cell === 'number'
              ? `<c r="${ref}"><v>${cell}</v></c>`
              : `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${escape(cell.replaceAll('\n', ' · '))}</t></is></c>`;
          })
          .join('')}</row>`,
    )
    .join('');

  const url = URL.createObjectURL(
    zip({
      '[Content_Types].xml':
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>',
      '_rels/.rels': `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${relationships}/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
      'xl/workbook.xml': `<workbook xmlns="${xmlns}" xmlns:r="${relationships}"><sheets><sheet name="Отчёт" sheetId="1" r:id="rId1"/></sheets></workbook>`,
      'xl/_rels/workbook.xml.rels': `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${relationships}/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`,
      'xl/worksheets/sheet1.xml': `<worksheet xmlns="${xmlns}"><cols><col min="1" max="1" width="32" customWidth="1"/><col min="2" max="2" width="56" customWidth="1"/><col min="3" max="8" width="26" customWidth="1"/></cols><sheetData>${sheet}</sheetData></worksheet>`,
    }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = reportTitle(report) + '.xlsx';
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 5000);
}
