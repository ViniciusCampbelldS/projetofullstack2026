import { describe, expect, it } from 'vitest';
import { unzipSync, strFromU8 } from 'fflate';
import { gerarRelatorio } from './exportar-relatorio';

const linha = { funcionario: 'João & Cia', epi: 'Óculos <proteção>', ca: '123', vencimento: '25/11/2026', status: 'Atenção' };
function bytes(blob: Blob): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => resolve(new Uint8Array(leitor.result as ArrayBuffer));
    leitor.onerror = () => reject(leitor.error);
    leitor.readAsArrayBuffer(blob);
  });
}
describe('exportação de relatórios', () => {
  it('gera XLSX e ODS com os dados escapados', async () => {
    for (const [formato, arquivo, extensao] of [['xlsx', 'xl/worksheets/sheet1.xml', 'xlsx'], ['odf', 'content.xml', 'ods']] as const) {
      const resultado = await gerarRelatorio([linha], formato);
      const zip = unzipSync(await bytes(resultado.blob));
      expect(resultado.extensao).toBe(extensao);
      const conteudo = strFromU8(zip[arquivo]);
      expect(conteudo).toContain('João &amp; Cia');
      expect(conteudo).toContain('Óculos &lt;proteção&gt;');
      expect(new DOMParser().parseFromString(conteudo, 'application/xml').querySelector('parsererror')).toBeNull();
    }
  });
  it('gera um PDF e XML válidos', async () => {
    const pdf = await gerarRelatorio([linha], 'pdf');
    expect(new TextDecoder().decode((await bytes(pdf.blob)).slice(0, 5))).toBe('%PDF-');
    const xml = await gerarRelatorio([linha], 'xml');
    const conteudo = new TextDecoder().decode(await bytes(xml.blob));
    expect(new DOMParser().parseFromString(conteudo, 'application/xml').querySelector('parsererror')).toBeNull();
    expect(conteudo).toContain('João &amp; Cia');
  });
});
