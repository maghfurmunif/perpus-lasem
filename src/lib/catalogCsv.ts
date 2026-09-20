// RFC 4180 parser: quoted commas, escaped quotes and multiline fields.
export function parseCatalogCsv(text: string): Record<string, string>[] {
  const rows: string[][] = []; let row: string[] = [], cell = '', quoted = false;
  text = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (quoted && text[i + 1] === '"') { cell += '"'; i++; }
      else if (!quoted && cell.length) throw new Error('Tanda kutip CSV tidak valid.');
      else quoted = !quoted;
    } else if (c === ',' && !quoted) { row.push(cell); cell = ''; }
    else if ((c === '\n' || c === '\r') && !quoted) {
      if (c === '\r' && text[i+1] === '\n') i++;
      row.push(cell); if (row.some(v => v.trim())) rows.push(row); row = []; cell = '';
    } else cell += c;
  }
  if (quoted) throw new Error('Tanda kutip CSV belum ditutup.');
  row.push(cell); if (row.some(v => v.trim())) rows.push(row);
  const headers = rows.shift()?.map(v => v.trim()) ?? [];
  if (!headers.includes('title') || !headers.includes('author')) throw new Error('Kolom title dan author wajib ada.');
  if (new Set(headers).size !== headers.length) throw new Error('Nama kolom CSV ganda.');
  if (!rows.length || rows.length > 1000) throw new Error('CSV harus berisi 1–1000 buku.');
  const seen = new Set<string>();
  return rows.map((values, index) => {
    if (values.length !== headers.length) throw new Error(`Baris ${index + 2}: jumlah kolom tidak sesuai.`);
    const item = Object.fromEntries(headers.map((h, i) => [h, values[i].trim()]));
    if (!item.title || !item.author) throw new Error(`Baris ${index + 2}: judul dan penulis wajib diisi.`);
    for (const field of ['pages','year','total_copies','available_copies']) {
      if (item[field] && (!Number.isInteger(Number(item[field])) || Number(item[field]) < 0)) throw new Error(`Baris ${index+2}: ${field} tidak valid.`);
    }
    if (Number(item.available_copies || 1) > Number(item.total_copies || 1)) throw new Error(`Baris ${index+2}: stok tersedia melebihi total.`);
    if (item.category && !['Edukasi','Pertanian','UMKM','Budaya Desa','Fiksi & Populer'].includes(item.category)) throw new Error(`Baris ${index+2}: kategori tidak valid.`);
    if (item.format && !['PDF','EPUB','Buku Fisik'].includes(item.format)) throw new Error(`Baris ${index+2}: format tidak valid.`);
    if (item.access_type && !['Akses Terbuka','Lisensi Terbatas'].includes(item.access_type)) throw new Error(`Baris ${index+2}: akses tidak valid.`);
    if (item.isbn) { if (seen.has(item.isbn)) throw new Error(`ISBN ganda dalam file: ${item.isbn}`); seen.add(item.isbn); }
    return item;
  });
}
