export interface LinhaRelatorio {
  funcionario: string; epi: string; ca: string; vencimento: string; status: string;
}
type Formato = 'pdf' | 'odf' | 'xlsx' | 'xml';
const colunas: (keyof LinhaRelatorio)[] = ['funcionario', 'epi', 'ca', 'vencimento', 'status'];
const titulos = ['Funcionário', 'EPI', 'CA', 'Vencimento', 'Situação'];
const xml = (valor: string) => String(valor ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export async function gerarRelatorio(linhas: LinhaRelatorio[], formato: Formato): Promise<{blob: Blob; extensao: string}> {
  if (formato === 'xml') {
    const itens = linhas.map(l => `<epi><funcionario>${xml(l.funcionario)}</funcionario><nome>${xml(l.epi)}</nome><ca>${xml(l.ca)}</ca><vencimento>${xml(l.vencimento)}</vencimento><status>${xml(l.status)}</status></epi>`).join('');
    return { blob: new Blob([`<?xml version="1.0" encoding="UTF-8"?><relatorio>${itens}</relatorio>`], {type: 'application/xml;charset=utf-8'}), extensao: 'xml' };
  }
  if (formato === 'pdf') {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    doc.setFontSize(16); doc.text('Relatório de EPIs', 15, 18);
    doc.setFontSize(10); doc.text(`Gerado em ${new Intl.DateTimeFormat('pt-BR').format(new Date())}`, 15, 25);
    let y = 34;
    linhas.forEach((linha, indice) => {
      const texto = `${indice + 1}. ${linha.funcionario} | ${linha.epi} | CA: ${linha.ca} | ${linha.vencimento} | ${linha.status}`;
      const partes: string[] = doc.splitTextToSize(texto, 180);
      for (const parte of partes) {
        if (y > 282) { doc.addPage(); y = 15; }
        doc.text(parte, 15, y); y += 5;
      }
      y += 3;
    });
    return { blob: doc.output('blob'), extensao: 'pdf' };
  }
  const { zipSync, strToU8 } = await import('fflate');
  const texto = (s: string) => strToU8(s);
  const dados = [titulos, ...linhas.map(l => colunas.map(c => l[c]))];
  if (formato === 'odf') {
    const rows = dados.map(row => `<table:table-row>${row.map(v => `<table:table-cell office:value-type="string"><text:p>${xml(v)}</text:p></table:table-cell>`).join('')}</table:table-row>`).join('');
    const content = `<?xml version="1.0" encoding="UTF-8"?><office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" office:version="1.2"><office:body><office:spreadsheet><table:table table:name="EPIs">${rows}</table:table></office:spreadsheet></office:body></office:document-content>`;
    const mime = 'application/vnd.oasis.opendocument.spreadsheet';
    const manifest = `<?xml version="1.0" encoding="UTF-8"?><manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="1.2"><manifest:file-entry manifest:full-path="/" manifest:media-type="${mime}"/><manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/></manifest:manifest>`;
    const zip = zipSync({mimetype: [texto(mime), {level: 0}], 'content.xml': texto(content), 'META-INF/manifest.xml': texto(manifest)});
    return {blob: new Blob([zip as BlobPart], {type: mime}), extensao: 'ods'};
  }
  const rows = dados.map((row, i) => `<row r="${i + 1}">${row.map((v, j) => `<c r="${String.fromCharCode(65 + j)}${i + 1}" t="inlineStr"><is><t xml:space="preserve">${xml(v)}</t></is></c>`).join('')}</row>`).join('');
  const arquivos: Record<string, string> = {
    '[Content_Types].xml': '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>',
    '_rels/.rels': '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
    'xl/workbook.xml': '<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="EPIs" sheetId="1" r:id="rId1"/></sheets></workbook>',
    'xl/_rels/workbook.xml.rels': '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>',
    'xl/worksheets/sheet1.xml': `<?xml version="1.0" encoding="UTF-8"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${rows}</sheetData></worksheet>`,
  };
  const zip = zipSync(Object.fromEntries(Object.entries(arquivos).map(([nome, conteudo]) => [nome, texto(conteudo)])));
  return {blob: new Blob([zip as BlobPart], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}), extensao: 'xlsx'};
}
