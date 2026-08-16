"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuncionarioModule = void 0;
const common_1 = require("@nestjs/common");
const funcionario_controller_1 = require("../controller/funcionario.controller");
const funcionario_service_1 = require("../service/funcionario.service");
const funcionario_repository_1 = require("../repository/funcionario.repository");
let FuncionarioModule = class FuncionarioModule {
};
exports.FuncionarioModule = FuncionarioModule;
exports.FuncionarioModule = FuncionarioModule = __decorate([
    (0, common_1.Module)({
        controllers: [funcionario_controller_1.FuncionarioController],
        providers: [funcionario_service_1.FuncionarioService, funcionario_repository_1.FuncionarioRepository],
        exports: [funcionario_service_1.FuncionarioService, funcionario_repository_1.FuncionarioRepository],
    })
], FuncionarioModule);
//# sourceMappingURL=funcionario.module.js.map