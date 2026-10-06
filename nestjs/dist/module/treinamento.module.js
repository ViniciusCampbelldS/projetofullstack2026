"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreinamentoModule = void 0;
const common_1 = require("@nestjs/common");
const treinamento_controller_1 = require("../controller/treinamento.controller");
const treinamento_service_1 = require("../service/treinamento.service");
const treinamento_repository_1 = require("../repository/treinamento.repository");
let TreinamentoModule = class TreinamentoModule {
};
exports.TreinamentoModule = TreinamentoModule;
exports.TreinamentoModule = TreinamentoModule = __decorate([
    (0, common_1.Module)({
        controllers: [treinamento_controller_1.TreinamentoController],
        providers: [treinamento_service_1.TreinamentoService, treinamento_repository_1.TreinamentoRepository],
        exports: [treinamento_service_1.TreinamentoService, treinamento_repository_1.TreinamentoRepository],
    })
], TreinamentoModule);
//# sourceMappingURL=treinamento.module.js.map