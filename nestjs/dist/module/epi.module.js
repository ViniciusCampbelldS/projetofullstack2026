"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpiModule = void 0;
const common_1 = require("@nestjs/common");
const epi_controller_1 = require("../controller/epi.controller");
const epi_service_1 = require("../service/epi.service");
const epi_repository_1 = require("../repository/epi.repository");
let EpiModule = class EpiModule {
};
exports.EpiModule = EpiModule;
exports.EpiModule = EpiModule = __decorate([
    (0, common_1.Module)({
        controllers: [epi_controller_1.EpiController],
        providers: [epi_service_1.EpiService, epi_repository_1.EpiRepository],
        exports: [epi_service_1.EpiService, epi_repository_1.EpiRepository],
    })
], EpiModule);
//# sourceMappingURL=epi.module.js.map