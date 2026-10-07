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
exports.TreinamentoRepository = void 0;
const common_1 = require("@nestjs/common");
const java_api_client_service_1 = require("../service/java-api-client.service");
let TreinamentoRepository = class TreinamentoRepository {
    javaApi;
    constructor(javaApi) {
        this.javaApi = javaApi;
    }
    async findAll() {
        return this.javaApi.request({ method: 'GET', path: '/treinamentos' });
    }
    async findById(id) {
        return this.javaApi.request({ method: 'GET', path: `/treinamentos/${id}` });
    }
    async create(treinamento) {
        return this.javaApi.request({ method: 'POST', path: '/treinamentos', body: treinamento });
    }
    async delete(id) {
        await this.javaApi.request({ method: 'DELETE', path: `/treinamentos/${id}` });
        return true;
    }
    async update(id, treinamento) {
        return this.javaApi.request({
            method: 'PUT',
            path: `/treinamentos/${id}`,
            body: treinamento,
        });
    }
    async patch(id, treinamento) {
        return this.javaApi.request({
            method: 'PUT',
            path: `/treinamentos/${id}`,
            body: treinamento,
        });
    }
};
exports.TreinamentoRepository = TreinamentoRepository;
exports.TreinamentoRepository = TreinamentoRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [java_api_client_service_1.JavaApiClientService])
], TreinamentoRepository);
//# sourceMappingURL=treinamento.repository.js.map