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
exports.TreinamentoService = void 0;
const common_1 = require("@nestjs/common");
const treinamento_repository_1 = require("../repository/treinamento.repository");
let TreinamentoService = class TreinamentoService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    getDados() { return this.repository.findAll(); }
    getTreinamentoById(id) { return this.repository.findById(id); }
    create(treinamento) { return this.repository.create(treinamento); }
    delete(id) { return this.repository.delete(id); }
    update(id, treinamento) { return this.repository.update(id, treinamento); }
    patch(id, treinamento) { return this.repository.patch(id, treinamento); }
};
exports.TreinamentoService = TreinamentoService;
exports.TreinamentoService = TreinamentoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [treinamento_repository_1.TreinamentoRepository])
], TreinamentoService);
//# sourceMappingURL=treinamento.service.js.map