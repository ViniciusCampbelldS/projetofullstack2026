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
exports.RiscoService = void 0;
const common_1 = require("@nestjs/common");
const risco_repository_1 = require("../repository/risco.repository");
let RiscoService = class RiscoService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    getDados() { return this.repository.findAll(); }
    getRiscoById(id) { return this.repository.findById(id); }
    create(risco) { return this.repository.create(risco); }
    delete(id) { return this.repository.delete(id); }
    update(id, risco) { return this.repository.update(id, risco); }
    patch(id, risco) { return this.repository.patch(id, risco); }
};
exports.RiscoService = RiscoService;
exports.RiscoService = RiscoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [risco_repository_1.RiscoRepository])
], RiscoService);
//# sourceMappingURL=risco.service.js.map