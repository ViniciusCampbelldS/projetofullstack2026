import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
// Importa o módulo "fs" (File System) do Node.js. 
// Esse módulo permite ler, criar, alterar e excluir arquivos.
// Injectable faz a injção de http conexão de banco de dados, ou seja, cria uma instância da classe EpiRepository para ser usada em outros lugares do código.

//app.repository.ts Lê dados do JSON / banco. Escreve dados no JSON / banco.
//Localiza registros por ID. Não sabe de regras — só acessa dados

// Classe responsável por acessar os dados dos EPIs. 
// Ela funciona como um intermediário entre a aplicação e o arquivo JSON. 

// Decorator:
// Adiciona antes da classe para usar o factory:
@Injectable()
export class EpiRepository {
    private readonly dbPath = path.resolve(process.cwd(), 'db', 'epi.db.json');

    // Método responsável por retornar todos os EPIs cadastrados. 

    findAll() {

        // Lê o arquivo epi.db.json. 
        // './' significa a pasta raiz do projeto. 
        // 'utf8' define o formato de leitura do arquivo. 
        const dados = fs.readFileSync(this.dbPath, 'utf8');

        // O conteúdo do arquivo é lido como TEXTO. 
        // JSON.parse converte esse texto em um objeto JavaScript. 
        // Assim podemos trabalhar com os dados dentro da aplicação. 
        return JSON.parse(dados);
    }

    // Método responsável por encontrar um EPI específico pelo seu ID.
    findById(id: number) {
        const epis = this.findAll();
        return epis.find((epi) => epi.id === id);
    }

    // Método responsável por criar um novo EPI.
    create(epi: any) {
        const epis = this.findAll();
        const novoId = epis.length > 0
            ? Math.max(...epis.map(e => e.id)) + 1
            : 1;
        const novoEpi = { id: novoId, ...epi };
        epis.push(novoEpi);
        fs.writeFileSync(this.dbPath, JSON.stringify(epis, null, 2), 'utf8');
        return novoEpi;
    }

    // Método responsável por deletar um EPI pelo seu ID.
    delete(id: number) {
        const epis = this.findAll();
        const idx = epis.findIndex(epi => epi.id === id);
        if (idx === -1) return false;
        epis.splice(idx, 1);
        fs.writeFileSync(this.dbPath, JSON.stringify(epis, null, 2), 'utf8');
        return true;
    }

    // Método responsável por atualizar **na totalidade** um EPI pelo seu ID.
    // PUT → update()
    update(id: number, epi: any) {
        const epis = this.findAll();
        const idx = epis.findIndex(epi => epi.id === id);
        if (idx === -1) return false;
        epis[idx] = { id, ...epi };
        fs.writeFileSync(this.dbPath, JSON.stringify(epis, null, 2), 'utf8');
        return true;
    }

    // PATCH → patch()
    // Método responsável por atualizar **parcialmente** um EPI pelo seu ID.
    patch(id: number, epi: any) {
        const epis = this.findAll();
        const idx = epis.findIndex(epi => epi.id === id);
        if (idx === -1) return false;
        epis[idx] = { ...epis[idx], ...epi };
        fs.writeFileSync(this.dbPath, JSON.stringify(epis, null, 2), 'utf8');
        return true;
    }
} 