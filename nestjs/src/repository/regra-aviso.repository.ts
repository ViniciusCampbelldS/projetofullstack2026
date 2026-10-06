import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface RegraAviso {
    id: number;
    caOuNr: string;
    diasAviso: number;
    isNorma: boolean; //true é um número de NR, false é um CA de EPI
}

@Injectable()
export class RegraAvisoRepository {
    private readonly dbPath = path.resolve(process.cwd(), 'db', 'dias_notificacao.db.json');

    findAll(): RegraAviso[] {
        return JSON.parse(fs.readFileSync(this.dbPath, 'utf8')) as RegraAviso[];
    }

    create(regra: Omit<RegraAviso, 'id'>): RegraAviso {
        const regras = this.findAll();
        const id = regras.length > 0 ? Math.max(...regras.map((item) => item.id)) + 1 : 1;
        const novaRegra = { id, ...regra };
        regras.push(novaRegra);
        fs.writeFileSync(this.dbPath, JSON.stringify(regras, null, 2), 'utf8');
        return novaRegra;
    }

    update(id: number, regra: Omit<RegraAviso, 'id'>): RegraAviso | undefined {
        const regras = this.findAll();
        const index = regras.findIndex((item) => item.id === id);
        if (index === -1) return undefined;

        regras[index] = { id, ...regra };
        fs.writeFileSync(this.dbPath, JSON.stringify(regras, null, 2), 'utf8');
        return regras[index];
    }

    delete(id: number): boolean {
        const regras = this.findAll();
        const index = regras.findIndex((item) => item.id === id);
        if (index === -1) return false;

        regras.splice(index, 1);
        fs.writeFileSync(this.dbPath, JSON.stringify(regras, null, 2), 'utf8');
        return true;
    }
}