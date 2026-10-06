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
exports.FuncionarioController = void 0;
const common_1 = require("@nestjs/common");
const funcionario_service_1 = require("../service/funcionario.service");
let FuncionarioController = class FuncionarioController {
    funcionarioService;
    constructor(funcionarioService) {
        this.funcionarioService = funcionarioService;
    }
    getDados() {
        return this.funcionarioService.getDados();
    }
    getFuncionario(id) {
        return this.funcionarioService.getFuncionarioById(id);
    }
    create(body) {
        return this.funcionarioService.create(body);
    }
    delete(id) {
        return this.funcionarioService.delete(id);
    }
    update(id, body) {
        return this.funcionarioService.update(id, body);
    }
    patch(id, body) {
        return this.funcionarioService.patch(id, body);
    }
};
exports.FuncionarioController = FuncionarioController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FuncionarioController.prototype, "getDados", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], FuncionarioController.prototype, "getFuncionario", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FuncionarioController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], FuncionarioController.prototype, "delete", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], FuncionarioController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], FuncionarioController.prototype, "patch", null);
exports.FuncionarioController = FuncionarioController = __decorate([
    (0, common_1.Controller)('funcionarios'),
    __metadata("design:paramtypes", [funcionario_service_1.FuncionarioService])
], FuncionarioController);
//# sourceMappingURL=funcionario.controller.js.map