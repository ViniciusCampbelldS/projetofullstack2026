"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegraAvisoModule = void 0;
const common_1 = require("@nestjs/common");
const regra_aviso_controller_1 = require("../controller/regra-aviso.controller");
const regra_aviso_repository_1 = require("../repository/regra-aviso.repository");
const regra_aviso_service_1 = require("../service/regra-aviso.service");
let RegraAvisoModule = class RegraAvisoModule {
};
exports.RegraAvisoModule = RegraAvisoModule;
exports.RegraAvisoModule = RegraAvisoModule = __decorate([
    (0, common_1.Module)({
        controllers: [regra_aviso_controller_1.RegraAvisoController],
        providers: [regra_aviso_service_1.RegraAvisoService, regra_aviso_repository_1.RegraAvisoRepository],
        exports: [regra_aviso_service_1.RegraAvisoService],
    })
], RegraAvisoModule);
//# sourceMappingURL=regra-aviso.module.js.map