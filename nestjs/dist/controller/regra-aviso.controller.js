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
exports.RegraAvisoController = void 0;
const common_1 = require("@nestjs/common");
const regra_aviso_service_1 = require("../service/regra-aviso.service");
let RegraAvisoController = class RegraAvisoController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll() {
        return this.service.findAll();
    }
    create(body) {
        return this.service.create(this.validarBody(body));
    }
    update(id, body) {
        const parsedId = Number(id);
        if (!Number.isInteger(parsedId) || parsedId < 1) {
            throw new common_1.NotFoundException('Regra de aviso não encontrada.');
        }
        return this.service.update(parsedId, this.validarBody(body));
    }
    delete(id) {
        const parsedId = Number(id);
        if (!Number.isInteger(parsedId) || parsedId < 1) {
            throw new common_1.NotFoundException('Regra de aviso não encontrada.');
        }
        this.service.delete(parsedId);
    }
    validarBody(body) {
        if (!body || typeof body !== 'object') {
            throw new common_1.BadRequestException('Informe CA ou NR e dias de aviso.');
        }
        const candidate = body;
        const caOuNr = typeof candidate.caOuNr === 'string' ? candidate.caOuNr.trim() : '';
        if (!caOuNr || caOuNr.length > 15) {
            throw new common_1.BadRequestException('CA ou NR deve conter de 1 a 15 caracteres.');
        }
        if (!Number.isInteger(candidate.diasAviso) || (candidate.diasAviso ?? 0) <= 0) {
            throw new common_1.BadRequestException('Dias de aviso deve ser um inteiro maior que zero.');
        }
        if (typeof candidate.isNorma !== 'boolean') {
            throw new common_1.BadRequestException('Informe se o código é uma NR.');
        }
        return { caOuNr, diasAviso: candidate.diasAviso, isNorma: candidate.isNorma };
    }
};
exports.RegraAvisoController = RegraAvisoController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], RegraAvisoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], RegraAvisoController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Object)
], RegraAvisoController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RegraAvisoController.prototype, "delete", null);
exports.RegraAvisoController = RegraAvisoController = __decorate([
    (0, common_1.Controller)('avisos'),
    __metadata("design:paramtypes", [regra_aviso_service_1.RegraAvisoService])
], RegraAvisoController);
//# sourceMappingURL=regra-aviso.controller.js.map