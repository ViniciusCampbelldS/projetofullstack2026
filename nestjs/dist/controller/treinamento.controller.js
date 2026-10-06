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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreinamentoController = void 0;
const common_1 = require("@nestjs/common");
const treinamento_service_1 = require("../service/treinamento.service");
let TreinamentoController = class TreinamentoController {
    TreinamentoService;
    constructor(TreinamentoService) {
        this.TreinamentoService = TreinamentoService;
    }
    getDados() {
        return this.TreinamentoService.getDados();
    }
    getTreinamento(id) {
        return this.TreinamentoService.getTreinamentoById(Number(id));
    }
    create(body) {
        return this.TreinamentoService.create(body);
    }
    delete(id) { return this.TreinamentoService.delete(Number(id)); }
    update(id, body) { return this.TreinamentoService.update(Number(id), body); }
    patch(id, body) { return this.TreinamentoService.patch(Number(id), body); }
};
exports.TreinamentoController = TreinamentoController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TreinamentoController.prototype, "getDados", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TreinamentoController.prototype, "getTreinamento", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TreinamentoController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TreinamentoController.prototype, "delete", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TreinamentoController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TreinamentoController.prototype, "patch", null);
exports.TreinamentoController = TreinamentoController = __decorate([
    (0, common_1.Controller)('treinamentos'),
    __metadata("design:paramtypes", [treinamento_service_1.TreinamentoService])
], TreinamentoController);
//# sourceMappingURL=treinamento.controller.js.map