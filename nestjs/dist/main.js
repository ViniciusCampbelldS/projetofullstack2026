/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/controller/auth/auth.controller.ts"
/*!************************************************!*\
  !*** ./src/controller/auth/auth.controller.ts ***!
  \************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_service_1 = __webpack_require__(/*! ../../service/auth/auth.service */ "./src/service/auth/auth.service.ts");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    login(body) {
        return this.authService.login(body.email, body.senha);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ },

/***/ "./src/controller/epi.controller.ts"
/*!******************************************!*\
  !*** ./src/controller/epi.controller.ts ***!
  \******************************************/
(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EpiController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const epi_service_1 = __webpack_require__(/*! ../service/epi.service */ "./src/service/epi.service.ts");
let EpiController = class EpiController {
    epiService;
    constructor(epiService) {
        this.epiService = epiService;
    }
    getDados() {
        return this.epiService.getDados();
    }
    getEpi(id) {
        return this.epiService.getEpiById(Number(id));
    }
    create(body) {
        return this.epiService.create(body);
    }
    delete(id) { return this.epiService.delete(Number(id)); }
    update(id, body) { return this.epiService.update(Number(id), body); }
    patch(id, body) { return this.epiService.patch(Number(id), body); }
};
exports.EpiController = EpiController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EpiController.prototype, "getDados", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EpiController.prototype, "getEpi", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EpiController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EpiController.prototype, "delete", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EpiController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EpiController.prototype, "patch", null);
exports.EpiController = EpiController = __decorate([
    (0, common_1.Controller)('epis'),
    __metadata("design:paramtypes", [typeof (_a = typeof epi_service_1.EpiService !== "undefined" && epi_service_1.EpiService) === "function" ? _a : Object])
], EpiController);


/***/ },

/***/ "./src/controller/funcionario.controller.ts"
/*!**************************************************!*\
  !*** ./src/controller/funcionario.controller.ts ***!
  \**************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FuncionarioController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const funcionario_service_1 = __webpack_require__(/*! ../service/funcionario.service */ "./src/service/funcionario.service.ts");
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
    __metadata("design:paramtypes", [Number, typeof (_b = typeof Partial !== "undefined" && Partial) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], FuncionarioController.prototype, "patch", null);
exports.FuncionarioController = FuncionarioController = __decorate([
    (0, common_1.Controller)('funcionarios'),
    __metadata("design:paramtypes", [typeof (_a = typeof funcionario_service_1.FuncionarioService !== "undefined" && funcionario_service_1.FuncionarioService) === "function" ? _a : Object])
], FuncionarioController);


/***/ },

/***/ "./src/controller/treinamento.controller.ts"
/*!**************************************************!*\
  !*** ./src/controller/treinamento.controller.ts ***!
  \**************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TreinamentoController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const treinamento_service_1 = __webpack_require__(/*! ../service/treinamento.service */ "./src/service/treinamento.service.ts");
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
    __metadata("design:paramtypes", [typeof (_a = typeof treinamento_service_1.TreinamentoService !== "undefined" && treinamento_service_1.TreinamentoService) === "function" ? _a : Object])
], TreinamentoController);


/***/ },

/***/ "./src/module/app.module.ts"
/*!**********************************!*\
  !*** ./src/module/app.module.ts ***!
  \**********************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const epi_module_1 = __webpack_require__(/*! ./epi.module */ "./src/module/epi.module.ts");
const treinamento_module_1 = __webpack_require__(/*! ./treinamento.module */ "./src/module/treinamento.module.ts");
const funcionario_module_1 = __webpack_require__(/*! ./funcionario.module */ "./src/module/funcionario.module.ts");
const auth_service_1 = __webpack_require__(/*! ../service/auth/auth.service */ "./src/service/auth/auth.service.ts");
const auth_controller_1 = __webpack_require__(/*! ../controller/auth/auth.controller */ "./src/controller/auth/auth.controller.ts");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [epi_module_1.EpiModule, treinamento_module_1.TreinamentoModule, funcionario_module_1.FuncionarioModule],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService],
    })
], AppModule);


/***/ },

/***/ "./src/module/epi.module.ts"
/*!**********************************!*\
  !*** ./src/module/epi.module.ts ***!
  \**********************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EpiModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const epi_controller_1 = __webpack_require__(/*! ../controller/epi.controller */ "./src/controller/epi.controller.ts");
const epi_service_1 = __webpack_require__(/*! ../service/epi.service */ "./src/service/epi.service.ts");
const epi_repository_1 = __webpack_require__(/*! ../repository/epi.repository */ "./src/repository/epi.repository.ts");
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


/***/ },

/***/ "./src/module/funcionario.module.ts"
/*!******************************************!*\
  !*** ./src/module/funcionario.module.ts ***!
  \******************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FuncionarioModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const funcionario_controller_1 = __webpack_require__(/*! ../controller/funcionario.controller */ "./src/controller/funcionario.controller.ts");
const funcionario_service_1 = __webpack_require__(/*! ../service/funcionario.service */ "./src/service/funcionario.service.ts");
const funcionario_repository_1 = __webpack_require__(/*! ../repository/funcionario.repository */ "./src/repository/funcionario.repository.ts");
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


/***/ },

/***/ "./src/module/treinamento.module.ts"
/*!******************************************!*\
  !*** ./src/module/treinamento.module.ts ***!
  \******************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TreinamentoModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const treinamento_controller_1 = __webpack_require__(/*! ../controller/treinamento.controller */ "./src/controller/treinamento.controller.ts");
const treinamento_service_1 = __webpack_require__(/*! ../service/treinamento.service */ "./src/service/treinamento.service.ts");
const treinamento_repository_1 = __webpack_require__(/*! ../repository/treinamento.repository */ "./src/repository/treinamento.repository.ts");
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


/***/ },

/***/ "./src/repository/epi.repository.ts"
/*!******************************************!*\
  !*** ./src/repository/epi.repository.ts ***!
  \******************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EpiRepository = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
const path = __importStar(__webpack_require__(/*! path */ "path"));
let EpiRepository = class EpiRepository {
    dbPath = path.resolve(process.cwd(), 'db', 'epi.db.json');
    findAll() {
        const dados = fs.readFileSync(this.dbPath, 'utf8');
        return JSON.parse(dados);
    }
    findById(id) {
        const epis = this.findAll();
        return epis.find((epi) => epi.id === id);
    }
    create(epi) {
        const epis = this.findAll();
        const novoId = epis.length > 0
            ? Math.max(...epis.map(e => e.id)) + 1
            : 1;
        const novoEpi = { id: novoId, ...epi };
        epis.push(novoEpi);
        fs.writeFileSync(this.dbPath, JSON.stringify(epis, null, 2), 'utf8');
        return novoEpi;
    }
    delete(id) {
        const epis = this.findAll();
        const idx = epis.findIndex(epi => epi.id === id);
        if (idx === -1)
            return false;
        epis.splice(idx, 1);
        fs.writeFileSync(this.dbPath, JSON.stringify(epis, null, 2), 'utf8');
        return true;
    }
    update(id, epi) {
        const epis = this.findAll();
        const idx = epis.findIndex(epi => epi.id === id);
        if (idx === -1)
            return false;
        epis[idx] = { id, ...epi };
        fs.writeFileSync(this.dbPath, JSON.stringify(epis, null, 2), 'utf8');
        return true;
    }
    patch(id, epi) {
        const epis = this.findAll();
        const idx = epis.findIndex(epi => epi.id === id);
        if (idx === -1)
            return false;
        epis[idx] = { ...epis[idx], ...epi };
        fs.writeFileSync(this.dbPath, JSON.stringify(epis, null, 2), 'utf8');
        return true;
    }
};
exports.EpiRepository = EpiRepository;
exports.EpiRepository = EpiRepository = __decorate([
    (0, common_1.Injectable)()
], EpiRepository);


/***/ },

/***/ "./src/repository/funcionario.repository.ts"
/*!**************************************************!*\
  !*** ./src/repository/funcionario.repository.ts ***!
  \**************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FuncionarioRepository = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
const path = __importStar(__webpack_require__(/*! path */ "path"));
let FuncionarioRepository = class FuncionarioRepository {
    dbPath = path.resolve(process.cwd(), 'db', 'funcionarios.db.json');
    findAll() {
        const dados = fs.readFileSync(this.dbPath, 'utf8');
        return JSON.parse(dados);
    }
    findById(id) {
        const funcionarios = this.findAll();
        return funcionarios.find((funcionario) => funcionario.id === id);
    }
    create(funcionario) {
        const funcionarios = this.findAll();
        const novoFuncionario = {
            id: funcionarios.reduce((maiorId, item) => Math.max(maiorId, item.id), 0) + 1,
            ...funcionario,
            status: funcionario.status ?? 'At',
        };
        funcionarios.push(novoFuncionario);
        fs.writeFileSync(this.dbPath, JSON.stringify(funcionarios, null, 2), 'utf8');
        return novoFuncionario;
    }
    delete(id) {
        const funcionarios = this.findAll();
        const idx = funcionarios.findIndex((funcionario) => funcionario.id === id);
        if (idx === -1)
            return false;
        funcionarios.splice(idx, 1);
        fs.writeFileSync(this.dbPath, JSON.stringify(funcionarios, null, 2), 'utf8');
        return true;
    }
    update(id, funcionario) {
        const funcionarios = this.findAll();
        const idx = funcionarios.findIndex((item) => item.id === id);
        if (idx === -1)
            return false;
        funcionarios[idx] = {
            ...funcionario,
            id,
            status: funcionario.status ?? 'At',
        };
        fs.writeFileSync(this.dbPath, JSON.stringify(funcionarios, null, 2), 'utf8');
        return true;
    }
    patch(id, funcionario) {
        const funcionarios = this.findAll();
        const idx = funcionarios.findIndex((item) => item.id === id);
        if (idx === -1)
            return false;
        funcionarios[idx] = {
            ...funcionarios[idx],
            ...funcionario,
            id,
        };
        fs.writeFileSync(this.dbPath, JSON.stringify(funcionarios, null, 2), 'utf8');
        return true;
    }
};
exports.FuncionarioRepository = FuncionarioRepository;
exports.FuncionarioRepository = FuncionarioRepository = __decorate([
    (0, common_1.Injectable)()
], FuncionarioRepository);


/***/ },

/***/ "./src/repository/treinamento.repository.ts"
/*!**************************************************!*\
  !*** ./src/repository/treinamento.repository.ts ***!
  \**************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TreinamentoRepository = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
const path = __importStar(__webpack_require__(/*! path */ "path"));
let TreinamentoRepository = class TreinamentoRepository {
    dbPath = path.resolve(process.cwd(), 'db', 'treinamento.db.json');
    findAll() {
        const dados = fs.readFileSync(this.dbPath, 'utf8');
        return JSON.parse(dados);
    }
    findById(id) {
        const treinamentos = this.findAll();
        return treinamentos.find((treinamento) => treinamento.id === id);
    }
    create(treinamento) {
        const treinamentos = this.findAll();
        const novoId = treinamentos.length > 0
            ? Math.max(...treinamentos.map(e => e.id)) + 1
            : 1;
        const novoTreinamento = { id: novoId, ...treinamento };
        treinamentos.push(novoTreinamento);
        fs.writeFileSync(this.dbPath, JSON.stringify(treinamentos, null, 2), 'utf8');
        return novoTreinamento;
    }
    delete(id) {
        const treinamentos = this.findAll();
        const idx = treinamentos.findIndex(treinamento => treinamento.id === id);
        if (idx === -1)
            return false;
        treinamentos.splice(idx, 1);
        fs.writeFileSync(this.dbPath, JSON.stringify(treinamentos, null, 2), 'utf8');
        return true;
    }
    update(id, treinamento) {
        const treinamentos = this.findAll();
        const idx = treinamentos.findIndex(treinamento => treinamento.id === id);
        if (idx === -1)
            return false;
        treinamentos[idx] = { id, ...treinamento };
        fs.writeFileSync(this.dbPath, JSON.stringify(treinamentos, null, 2), 'utf8');
        return true;
    }
    patch(id, treinamento) {
        const treinamentos = this.findAll();
        const idx = treinamentos.findIndex(treinamento => treinamento.id === id);
        if (idx === -1)
            return false;
        treinamentos[idx] = { ...treinamentos[idx], ...treinamento };
        fs.writeFileSync(this.dbPath, JSON.stringify(treinamentos, null, 2), 'utf8');
        return true;
    }
};
exports.TreinamentoRepository = TreinamentoRepository;
exports.TreinamentoRepository = TreinamentoRepository = __decorate([
    (0, common_1.Injectable)()
], TreinamentoRepository);


/***/ },

/***/ "./src/service/auth/auth.service.ts"
/*!******************************************!*\
  !*** ./src/service/auth/auth.service.ts ***!
  \******************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let AuthService = class AuthService {
    login(email, senha) {
        const loginInformado = String(email ?? '').trim();
        const loginSomenteDigitos = loginInformado.replace(/\D/g, '');
        const credencialValida = (loginInformado === '123' || loginSomenteDigitos === '12312312312') &&
            senha === '123';
        if (credencialValida) {
            return { access_token: 'token-simples-123' };
        }
        throw new common_1.UnauthorizedException('Login inválido');
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);


/***/ },

/***/ "./src/service/epi.service.ts"
/*!************************************!*\
  !*** ./src/service/epi.service.ts ***!
  \************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EpiService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const epi_repository_1 = __webpack_require__(/*! ../repository/epi.repository */ "./src/repository/epi.repository.ts");
let EpiService = class EpiService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    getDados() { return this.repository.findAll(); }
    getEpiById(id) { return this.repository.findById(id); }
    create(epi) { return this.repository.create(epi); }
    delete(id) { return this.repository.delete(id); }
    update(id, epi) { return this.repository.update(id, epi); }
    patch(id, epi) { return this.repository.patch(id, epi); }
};
exports.EpiService = EpiService;
exports.EpiService = EpiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof epi_repository_1.EpiRepository !== "undefined" && epi_repository_1.EpiRepository) === "function" ? _a : Object])
], EpiService);


/***/ },

/***/ "./src/service/funcionario.service.ts"
/*!********************************************!*\
  !*** ./src/service/funcionario.service.ts ***!
  \********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FuncionarioService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const funcionario_repository_1 = __webpack_require__(/*! ../repository/funcionario.repository */ "./src/repository/funcionario.repository.ts");
let FuncionarioService = class FuncionarioService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    getDados() {
        return this.repository.findAll();
    }
    getFuncionarioById(id) {
        const funcionario = this.repository.findById(id);
        if (!funcionario) {
            throw new common_1.NotFoundException('Funcionario nao encontrado');
        }
        return funcionario;
    }
    create(funcionario) {
        this.validarFuncionario(funcionario);
        if (this.repository.findAll().some((item) => item.cpf === funcionario.cpf)) {
            throw new common_1.BadRequestException('CPF ja cadastrado');
        }
        return this.repository.create(funcionario);
    }
    delete(id) {
        if (!this.repository.delete(id)) {
            throw new common_1.NotFoundException('Funcionario nao encontrado');
        }
        return { deleted: true };
    }
    update(id, funcionario) {
        this.validarFuncionario(funcionario);
        if (!this.repository.update(id, funcionario)) {
            throw new common_1.NotFoundException('Funcionario nao encontrado');
        }
        return this.getFuncionarioById(id);
    }
    patch(id, funcionario) {
        this.validarPatch(funcionario);
        if (!this.repository.patch(id, funcionario)) {
            throw new common_1.NotFoundException('Funcionario nao encontrado');
        }
        return this.getFuncionarioById(id);
    }
    validarFuncionario(funcionario) {
        if (!/^\d{8,11}$/.test(funcionario.cpf)) {
            throw new common_1.BadRequestException('CPF deve conter entre 8 e 11 digitos numericos');
        }
        if (!funcionario.nome || funcionario.nome.length > 50) {
            throw new common_1.BadRequestException('Nome obrigatorio com no maximo 50 caracteres');
        }
        if (!funcionario.setor || funcionario.setor.length > 30) {
            throw new common_1.BadRequestException('Setor obrigatorio com no maximo 30 caracteres');
        }
        if (!funcionario.cargo || funcionario.cargo.length > 20) {
            throw new common_1.BadRequestException('Cargo obrigatorio com no maximo 20 caracteres');
        }
        if (!funcionario.permicoes || funcionario.permicoes.length > 6) {
            throw new common_1.BadRequestException('Permicoes obrigatorias com no maximo 6 caracteres');
        }
        if (!Array.isArray(funcionario.NRs) || funcionario.NRs.some((nr) => !/^\d{2}$/.test(nr) || nr < '01' || nr > '99')) {
            throw new common_1.BadRequestException('NRs devem ser um array com valores entre 01 e 99');
        }
        if (funcionario.status && funcionario.status.length > 2) {
            throw new common_1.BadRequestException('Status deve ter no maximo 2 caracteres');
        }
    }
    validarPatch(funcionario) {
        if (funcionario.cpf && !/^\d{8,11}$/.test(funcionario.cpf)) {
            throw new common_1.BadRequestException('CPF deve conter entre 8 e 11 digitos numericos');
        }
        if (funcionario.nome !== undefined && (!funcionario.nome || funcionario.nome.length > 50)) {
            throw new common_1.BadRequestException('Nome deve ter no maximo 50 caracteres');
        }
        if (funcionario.setor !== undefined && (!funcionario.setor || funcionario.setor.length > 30)) {
            throw new common_1.BadRequestException('Setor deve ter no maximo 30 caracteres');
        }
        if (funcionario.cargo !== undefined && (!funcionario.cargo || funcionario.cargo.length > 20)) {
            throw new common_1.BadRequestException('Cargo deve ter no maximo 20 caracteres');
        }
        if (funcionario.permicoes !== undefined && (!funcionario.permicoes || funcionario.permicoes.length > 6)) {
            throw new common_1.BadRequestException('Permicoes devem ter no maximo 6 caracteres');
        }
        if (funcionario.NRs !== undefined &&
            (!Array.isArray(funcionario.NRs) ||
                funcionario.NRs.some((nr) => !/^\d{2}$/.test(nr) || nr < '01' || nr > '99'))) {
            throw new common_1.BadRequestException('NRs devem ser um array com valores entre 01 e 99');
        }
        if (funcionario.status !== undefined && funcionario.status.length > 2) {
            throw new common_1.BadRequestException('Status deve ter no maximo 2 caracteres');
        }
    }
};
exports.FuncionarioService = FuncionarioService;
exports.FuncionarioService = FuncionarioService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof funcionario_repository_1.FuncionarioRepository !== "undefined" && funcionario_repository_1.FuncionarioRepository) === "function" ? _a : Object])
], FuncionarioService);


/***/ },

/***/ "./src/service/treinamento.service.ts"
/*!********************************************!*\
  !*** ./src/service/treinamento.service.ts ***!
  \********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TreinamentoService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const treinamento_repository_1 = __webpack_require__(/*! ../repository/treinamento.repository */ "./src/repository/treinamento.repository.ts");
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
    __metadata("design:paramtypes", [typeof (_a = typeof treinamento_repository_1.TreinamentoRepository !== "undefined" && treinamento_repository_1.TreinamentoRepository) === "function" ? _a : Object])
], TreinamentoService);


/***/ },

/***/ "@nestjs/common"
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
(module) {

module.exports = require("@nestjs/common");

/***/ },

/***/ "@nestjs/core"
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
(module) {

module.exports = require("@nestjs/core");

/***/ },

/***/ "fs"
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
(module) {

module.exports = require("fs");

/***/ },

/***/ "path"
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
(module) {

module.exports = require("path");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const app_module_1 = __webpack_require__(/*! ./module/app.module */ "./src/module/app.module.ts");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: [
            'http://localhost:4200',
            'https://projetointegradosenac2026.netlify.app',
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

})();

/******/ })()
;