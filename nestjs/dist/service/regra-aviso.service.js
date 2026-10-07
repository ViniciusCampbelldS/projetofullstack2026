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
exports.RegraAvisoService = void 0;
const common_1 = require("@nestjs/common");
const regra_aviso_repository_1 = require("../repository/regra-aviso.repository");
let RegraAvisoService = class RegraAvisoService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async findAll() {
        return this.repository.findAll();
    }
    async create(regra) {
        return this.repository.create(regra);
    }
    async update(id, regra) {
        return this.repository.update(id, regra);
    }
    async delete(id) {
        await this.repository.delete(id);
    }
};
exports.RegraAvisoService = RegraAvisoService;
exports.RegraAvisoService = RegraAvisoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [regra_aviso_repository_1.RegraAvisoRepository])
], RegraAvisoService);
//# sourceMappingURL=regra-aviso.service.js.map