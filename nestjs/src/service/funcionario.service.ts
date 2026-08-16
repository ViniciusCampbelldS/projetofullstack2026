import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { FuncionarioRepository } from '../repository/funcionario.repository';

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
export class FuncionarioService {
  constructor(private repository: FuncionarioRepository) {}

  getDados() {
    return this.repository.findAll();
  }

  getFuncionarioByCpf(cpf: string) {
    const funcionario = this.repository.findByCpf(cpf);
    if (!funcionario) {
      throw new NotFoundException('Funcionario nao encontrado');
    }

    return funcionario;
  }

  create(funcionario: Funcionario) {
    this.validarFuncionario(funcionario);

    if (this.repository.findByCpf(funcionario.cpf)) {
      throw new BadRequestException('CPF ja cadastrado');
    }

    return this.repository.create(funcionario);
  }

  delete(cpf: string) {
    if (!this.repository.delete(cpf)) {
      throw new NotFoundException('Funcionario nao encontrado');
    }

    return { deleted: true };
  }

  update(cpf: string, funcionario: Funcionario) {
    this.validarFuncionario({ ...funcionario, cpf });

    if (!this.repository.update(cpf, funcionario)) {
      throw new NotFoundException('Funcionario nao encontrado');
    }

    return this.getFuncionarioByCpf(cpf);
  }

  patch(cpf: string, funcionario: Partial<Funcionario>) {
    this.validarPatch(funcionario);

    if (!this.repository.patch(cpf, funcionario)) {
      throw new NotFoundException('Funcionario nao encontrado');
    }

    return this.getFuncionarioByCpf(cpf);
  }

  private validarFuncionario(funcionario: Funcionario) {
    if (!/^\d{8,11}$/.test(funcionario.cpf)) {
      throw new BadRequestException('CPF deve conter entre 8 e 11 digitos numericos');
    }

    if (!funcionario.nome || funcionario.nome.length > 50) {
      throw new BadRequestException('Nome obrigatorio com no maximo 50 caracteres');
    }

    if (!funcionario.setor || funcionario.setor.length > 30) {
      throw new BadRequestException('Setor obrigatorio com no maximo 30 caracteres');
    }

    if (!funcionario.cargo || funcionario.cargo.length > 20) {
      throw new BadRequestException('Cargo obrigatorio com no maximo 20 caracteres');
    }

    if (!funcionario.permicoes || funcionario.permicoes.length > 6) {
      throw new BadRequestException('Permicoes obrigatorias com no maximo 6 caracteres');
    }

    if (!Array.isArray(funcionario.NRs) || funcionario.NRs.some((nr) => !/^\d{2}$/.test(nr) || nr < '01' || nr > '99')) {
      throw new BadRequestException('NRs devem ser um array com valores entre 01 e 99');
    }

    if (funcionario.status && funcionario.status.length > 2) {
      throw new BadRequestException('Status deve ter no maximo 2 caracteres');
    }
  }

  private validarPatch(funcionario: Partial<Funcionario>) {
    if (funcionario.cpf && !/^\d{8,11}$/.test(funcionario.cpf)) {
      throw new BadRequestException('CPF deve conter entre 8 e 11 digitos numericos');
    }

    if (funcionario.nome !== undefined && (!funcionario.nome || funcionario.nome.length > 50)) {
      throw new BadRequestException('Nome deve ter no maximo 50 caracteres');
    }

    if (funcionario.setor !== undefined && (!funcionario.setor || funcionario.setor.length > 30)) {
      throw new BadRequestException('Setor deve ter no maximo 30 caracteres');
    }

    if (funcionario.cargo !== undefined && (!funcionario.cargo || funcionario.cargo.length > 20)) {
      throw new BadRequestException('Cargo deve ter no maximo 20 caracteres');
    }

    if (funcionario.permicoes !== undefined && (!funcionario.permicoes || funcionario.permicoes.length > 6)) {
      throw new BadRequestException('Permicoes devem ter no maximo 6 caracteres');
    }

    if (
      funcionario.NRs !== undefined &&
      (!Array.isArray(funcionario.NRs) ||
        funcionario.NRs.some((nr) => !/^\d{2}$/.test(nr) || nr < '01' || nr > '99'))
    ) {
      throw new BadRequestException('NRs devem ser um array com valores entre 01 e 99');
    }

    if (funcionario.status !== undefined && funcionario.status.length > 2) {
      throw new BadRequestException('Status deve ter no maximo 2 caracteres');
    }
  }
}
