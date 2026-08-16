"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuncionarioService = void 0;
const common_1 = require("@nestjs/common");
const funcionario_repository_1 = require("../repository/funcionario.repository");
let FuncionarioService = class FuncionarioService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    getDados() {
        return this.repository.findAll();
    }
    getFuncionarioByCpf(cpf) {
        const funcionario = this.repository.findByCpf(cpf);
        if (!funcionario) {
            throw new common_1.NotFoundException('Funcionario nao encontrado');
        }
        return funcionario;
    }
    create(funcionario) {
        this.validarFuncionario(funcionario);
        if (this.repository.findByCpf(funcionario.cpf)) {
            throw new common_1.BadRequestException('CPF ja cadastrado');
        }
        return this.repository.create(funcionario);
    }
    delete(cpf) {
        if (!this.repository.delete(cpf)) {
            throw new common_1.NotFoundException('Funcionario nao encontrado');
        }
        return { deleted: true };
    }
    update(cpf, funcionario) {
        this.validarFuncionario({ ...funcionario, cpf });
        if (!this.repository.update(cpf, funcionario)) {
            throw new common_1.NotFoundException('Funcionario nao encontrado');
        }
        return this.getFuncionarioByCpf(cpf);
    }
    patch(cpf, funcionario) {
        this.validarPatch(funcionario);
        if (!this.repository.patch(cpf, funcionario)) {
            throw new common_1.NotFoundException('Funcionario nao encontrado');
        }
        return this.getFuncionarioByCpf(cpf);
    }
    validarFuncionario(funcionario) {
        if (!/^\d{8,11}$/.test(funcionario.cpf)) {
            throw new common_1.BadRequestException('CPF deve conter entre 8 e 11 digitos numericos');
        }
        if (!funcionario.nome || funcionario.nome.length > 50) {
            throw new common_1.BadRequestException('Nome obrigatorio com no maximo 50 caracteres');
        }
        if (!funcionario.setor || funcionario.setor.length > 30) {
            throw new common_1.BadRequestException('Setor obrigatorio com no maximo 30 caracteres');
        }
        if (!funcionario.cargo || funcionario.cargo.length > 20) {
            throw new common_1.BadRequestException('Cargo obrigatorio com no maximo 20 caracteres');
        }
        if (!funcionario.permicoes || funcionario.permicoes.length > 6) {
            throw new common_1.BadRequestException('Permicoes obrigatorias com no maximo 6 caracteres');
        }
        if (!Array.isArray(funcionario.NRs) || funcionario.NRs.some((nr) => !/^\d{2}$/.test(nr) || nr < '01' || nr > '99')) {
            throw new common_1.BadRequestException('NRs devem ser um array com valores entre 01 e 99');
        }
        if (funcionario.status && funcionario.status.length > 2) {
            throw new common_1.BadRequestException('Status deve ter no maximo 2 caracteres');
        }
    }
    validarPatch(funcionario) {
        if (funcionario.cpf && !/^\d{8,11}$/.test(funcionario.cpf)) {
            throw new common_1.BadRequestException('CPF deve conter entre 8 e 11 digitos numericos');
        }
        if (funcionario.nome !== undefined && (!funcionario.nome || funcionario.nome.length > 50)) {
            throw new common_1.BadRequestException('Nome deve ter no maximo 50 caracteres');
        }
        if (funcionario.setor !== undefined && (!funcionario.setor || funcionario.setor.length > 30)) {
            throw new common_1.BadRequestException('Setor deve ter no maximo 30 caracteres');
        }
        if (funcionario.cargo !== undefined && (!funcionario.cargo || funcionario.cargo.length > 20)) {
            throw new common_1.BadRequestException('Cargo deve ter no maximo 20 caracteres');
        }
        if (funcionario.permicoes !== undefined && (!funcionario.permicoes || funcionario.permicoes.length > 6)) {
            throw new common_1.BadRequestException('Permicoes devem ter no maximo 6 caracteres');
        }
        if (funcionario.NRs !== undefined &&
            (!Array.isArray(funcionario.NRs) ||
                funcionario.NRs.some((nr) => !/^\d{2}$/.test(nr) || nr < '01' || nr > '99'))) {
            throw new common_1.BadRequestException('NRs devem ser um array com valores entre 01 e 99');
        }
        if (funcionario.status !== undefined && funcionario.status.length > 2) {
            throw new common_1.BadRequestException('Status deve ter no maximo 2 caracteres');
        }
    }
};
exports.FuncionarioService = FuncionarioService;
exports.FuncionarioService = FuncionarioService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [funcionario_repository_1.FuncionarioRepository])
], FuncionarioService);
//# sourceMappingURL=funcionario.service.js.map