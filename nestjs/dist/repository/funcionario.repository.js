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
exports.FuncionarioRepository = void 0;
const common_1 = require("@nestjs/common");
const java_api_client_service_1 = require("../service/java-api-client.service");
let FuncionarioRepository = class FuncionarioRepository {
    javaApi;
    constructor(javaApi) {
        this.javaApi = javaApi;
    }
    async findAll() {
        return this.javaApi.request({ method: 'GET', path: '/funcionarios' });
    }
    async findById(id) {
        return this.javaApi.request({ method: 'GET', path: `/funcionarios/${id}` });
    }
    async create(funcionario) {
        return this.javaApi.request({
            method: 'POST',
            path: '/funcionarios',
            body: funcionario,
        });
    }
    async update(id, funcionario) {
        return this.javaApi.request({
            method: 'PUT',
            path: `/funcionarios/${id}`,
            body: funcionario,
        });
    }
    async patch(id, funcionario) {
        return this.javaApi.request({
            method: 'PUT',
            path: `/funcionarios/${id}`,
            body: funcionario,
        });
    }
    async delete(id) {
        await this.javaApi.request({
            method: 'DELETE',
            path: `/funcionarios/${id}`,
        });
        return true;
    }
};
exports.FuncionarioRepository = FuncionarioRepository;
exports.FuncionarioRepository = FuncionarioRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [java_api_client_service_1.JavaApiClientService])
], FuncionarioRepository);
//# sourceMappingURL=funcionario.repository.js.map