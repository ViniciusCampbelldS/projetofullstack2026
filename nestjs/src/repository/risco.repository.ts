import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class RiscoRepository {
    private readonly dbPath = path.resolve(process.cwd(), 'db', 'risco.db.json');

    // Método responsável por retornar todos os EPIs cadastrados. 

    findAll() {
        const dados = fs.readFileSync(this.dbPath, 'utf8');
        return JSON.parse(dados);
    }

    // Método responsável por encontrar um EPI específico pelo seu ID.
    findById(id: number) {
        const riscos = this.findAll();
        return riscos.find((risco) => risco.id === id);
    }

    // Método responsável por criar um novo EPI.
    create(risco: any) {
        const riscos = this.findAll();
        const novoId = riscos.length > 0
            ? Math.max(...riscos.map(e => e.id)) + 1
            : 1;
        const novoRisco = { id: novoId, ...risco };
        riscos.push(novoRisco);
        fs.writeFileSync(this.dbPath, JSON.stringify(riscos, null, 2), 'utf8');
        return novoRisco;
    }

    // Método responsável por deletar um EPI pelo seu ID.
    delete(id: number) {
        const riscos = this.findAll();
        const idx = riscos.findIndex(risco => risco.id === id);
        if (idx === -1) return false;
        riscos.splice(idx, 1);
        fs.writeFileSync(this.dbPath, JSON.stringify(riscos, null, 2), 'utf8');
        return true;
    }

    // Método responsável por atualizar **na totalidade** um EPI pelo seu ID.
    // PUT → update()
    update(id: number, risco: any) {
        const riscos = this.findAll();
        const idx = riscos.findIndex(risco => risco.id === id);
        if (idx === -1) return false;
        riscos[idx] = { id, ...risco };
        fs.writeFileSync(this.dbPath, JSON.stringify(riscos, null, 2), 'utf8');
        return true;
    }

    // PATCH → patch()
    // Método responsável por atualizar **parcialmente** um EPI pelo seu ID.
    patch(id: number, risco: any) {
        const riscos = this.findAll();
        const idx = riscos.findIndex(risco => risco.id === id);
        if (idx === -1) return false;
        riscos[idx] = { ...riscos[idx], ...risco };
        fs.writeFileSync(this.dbPath, JSON.stringify(riscos, null, 2), 'utf8');
        return true;
    }
} 