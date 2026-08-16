import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

type Funcionario = {
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

  findByCpf(cpf: string) {
    const funcionarios = this.findAll();
    return funcionarios.find((funcionario) => funcionario.cpf === cpf);
  }

  create(funcionario: Funcionario) {
    const funcionarios = this.findAll();
    const novoFuncionario = {
      ...funcionario,
      status: funcionario.status ?? 'At',
    };

    funcionarios.push(novoFuncionario);
    fs.writeFileSync(this.dbPath, JSON.stringify(funcionarios, null, 2), 'utf8');
    return novoFuncionario;
  }

  delete(cpf: string) {
    const funcionarios = this.findAll();
    const idx = funcionarios.findIndex((funcionario) => funcionario.cpf === cpf);
    if (idx === -1) return false;
    funcionarios.splice(idx, 1);
    fs.writeFileSync(this.dbPath, JSON.stringify(funcionarios, null, 2), 'utf8');
    return true;
  }

  update(cpf: string, funcionario: Funcionario) {
    const funcionarios = this.findAll();
    const idx = funcionarios.findIndex((item) => item.cpf === cpf);
    if (idx === -1) return false;

    funcionarios[idx] = {
      ...funcionario,
      cpf,
      status: funcionario.status ?? 'At',
    };

    fs.writeFileSync(this.dbPath, JSON.stringify(funcionarios, null, 2), 'utf8');
    return true;
  }

  patch(cpf: string, funcionario: Partial<Funcionario>) {
    const funcionarios = this.findAll();
    const idx = funcionarios.findIndex((item) => item.cpf === cpf);
    if (idx === -1) return false;

    funcionarios[idx] = {
      ...funcionarios[idx],
      ...funcionario,
      cpf,
    };

    fs.writeFileSync(this.dbPath, JSON.stringify(funcionarios, null, 2), 'utf8');
    return true;
  }
}
