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
exports.EpiRepository = void 0;
const common_1 = require("@nestjs/common");
const java_api_client_service_1 = require("../service/java-api-client.service");
let EpiRepository = class EpiRepository {
    javaApi;
    constructor(javaApi) {
        this.javaApi = javaApi;
    }
    async findAll() {
        return this.javaApi.request({ method: 'GET', path: '/epis' });
    }
    async findById(id) {
        return this.javaApi.request({ method: 'GET', path: `/epis/${id}` });
    }
    async create(epi) {
        return this.javaApi.request({ method: 'POST', path: '/epis', body: this.mapEpi(epi) });
    }
    async createMany(epi, quantidade) {
        const mapped = this.mapEpi(epi);
        const epis = await Promise.all(Array.from({ length: quantidade }, () => this.javaApi.request({ method: 'POST', path: '/epis', body: mapped })));
        return { quantidade, epis };
    }
    async delete(id) {
        await this.javaApi.request({ method: 'DELETE', path: `/epis/${id}` });
        return true;
    }
    async update(id, epi) {
        return this.javaApi.request({
            method: 'PUT',
            path: `/epis/${id}`,
            body: this.mapEpi(epi),
        });
    }
    async patch(id, epi) {
        return this.javaApi.request({
            method: 'PUT',
            path: `/epis/${id}`,
            body: this.mapEpi(epi),
        });
    }
    mapEpi(epi) {
        const source = epi;
        return {
            nome: source.nome,
            ca: source.ca,
            lote: source.lote,
            vencimento: source.validade ?? source.vencimento,
            funcionarioIds: source.funcionarioIds ?? [],
            substituido: source.substituido ?? false,
        };
    }
};
exports.EpiRepository = EpiRepository;
exports.EpiRepository = EpiRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [java_api_client_service_1.JavaApiClientService])
], EpiRepository);
//# sourceMappingURL=epi.repository.js.map