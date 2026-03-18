/**
 * PDF Export Utility — uses browser print dialog (no external library needed).
 */

export interface ExportColumn {
  header: string;
  key: string;
}

export interface ExportOptions {
  title: string;
  subtitle?: string;
  columns: ExportColumn[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[];
  filename?: string;
}

export function exportToPDF(options: ExportOptions): void {
  const { title, subtitle, columns, data } = options;

  const headerRow = columns.map(c => '<th>' + c.header + '</th>').join('');
  const bodyRows = data.map(row =>
    '<tr>' + columns.map(c => '<td>' + (row[c.key] ?? '') + '</td>').join('') + '</tr>'
  ).join('');

  const styles = [
    'body{font-family:Arial,sans-serif;font-size:12px;color:#111;margin:24px}',
    'h1{font-size:20px;margin:0 0 4px}',
    '.sub{color:#555;font-size:13px;margin:0 0 16px}',
    '.meta{font-size:11px;color:#777;margin-bottom:12px}',
    'table{width:100%;border-collapse:collapse}',
    'th{background:#166534;color:#fff;padding:8px 10px;text-align:left;font-size:11px;text-transform:uppercase}',
    'td{padding:7px 10px;border-bottom:1px solid #e5e7eb;font-size:12px}',
    'tr:nth-child(even) td{background:#f9fafb}',
    '@media print{button{display:none}}',
  ].join('');

  const html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + title + '</title>'
    + '<style>' + styles + '</style></head><body>'
    + '<h1>' + title + '</h1>'
    + (subtitle ? '<p class="sub">' + subtitle + '</p>' : '')
    + '<p class="meta">Generated: ' + new Date().toLocaleString() + ' &nbsp;|&nbsp; MediPharm</p>'
    + '<table><thead><tr>' + headerRow + '</tr></thead><tbody>' + bodyRows + '</tbody></table>'
    + '<script>window.onload=function(){window.print()}<\/script>'
    + '</body></html>';

  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}

export function exportToCSV(options: ExportOptions): void {
  const { title, columns, data, filename } = options;

  const header = columns.map(c => '"' + c.header + '"').join(',');
  const rows = data.map(row =>
    columns.map(c => '"' + String(row[c.key] ?? '').replace(/"/g, '""') + '"').join(',')
  );

  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = (filename ?? title).replace(/\s+/g, '_') + '.csv';
  a.click();
  URL.revokeObjectURL(url);
}
