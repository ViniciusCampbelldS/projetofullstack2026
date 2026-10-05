import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

type Funcionario = {
  id: number;
  cpf: string;
  nome: string;
  setor: string;
  cargo: string;
  permicoes: string;
  NRs: string[];
  status?: string;
};

@Injectable()
export class FuncionarioRepository {
  private readonly dbPath = path.resolve(process.cwd(), 'db', 'funcionarios.db.json');

  findAll() {
    const dados = fs.readFileSync(this.dbPath, 'utf8');
    return JSON.parse(dados);
  }

  findById(id: number) {
    const funcionarios = this.findAll();
    return funcionarios.find((funcionario) => funcionario.id === id);
  }

  create(funcionario: Omit<Funcionario, 'id'>) {
    const funcionarios = this.findAll();
    const novoFuncionario = {
      id: funcionarios.reduce((maiorId, item) => Math.max(maiorId, item.id), 0) + 1,
      ...funcionario,
      status: funcionario.status ?? 'At',
    };

    funcionarios.push(novoFuncionario);
    fs.writeFileSync(this.dbPath, JSON.stringify(funcionarios, null, 2), 'utf8');
    return novoFuncionario;
  }

  delete(id: number) {
    const funcionarios = this.findAll();
    const idx = funcionarios.findIndex((funcionario) => funcionario.id === id);
    if (idx === -1) return false;
    funcionarios.splice(idx, 1);
    fs.writeFileSync(this.dbPath, JSON.stringify(funcionarios, null, 2), 'utf8');
    return true;
  }

  update(id: number, funcionario: Omit<Funcionario, 'id'>) {
    const funcionarios = this.findAll();
    const idx = funcionarios.findIndex((item) => item.id === id);
    if (idx === -1) return false;

    funcionarios[idx] = {
      ...funcionario,
      id,
      status: funcionario.status ?? 'At',
    };

    fs.writeFileSync(this.dbPath, JSON.stringify(funcionarios, null, 2), 'utf8');
    return true;
  }

  patch(id: number, funcionario: Partial<Omit<Funcionario, 'id'>>) {
    const funcionarios = this.findAll();
    const idx = funcionarios.findIndex((item) => item.id === id);
    if (idx === -1) return false;

    funcionarios[idx] = {
      ...funcionarios[idx],
      ...funcionario,
      id,
    };

    fs.writeFileSync(this.dbPath, JSON.stringify(funcionarios, null, 2), 'utf8');
    return true;
  }
}
