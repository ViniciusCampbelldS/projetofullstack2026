"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegraAvisoRepository = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let RegraAvisoRepository = class RegraAvisoRepository {
    dbPath = path.resolve(process.cwd(), 'db', 'avisos.db.json');
    findAll() {
        return JSON.parse(fs.readFileSync(this.dbPath, 'utf8'));
    }
    create(regra) {
        const regras = this.findAll();
        const id = regras.length > 0 ? Math.max(...regras.map((item) => item.id)) + 1 : 1;
        const novaRegra = { id, ...regra };
        regras.push(novaRegra);
        fs.writeFileSync(this.dbPath, JSON.stringify(regras, null, 2), 'utf8');
        return novaRegra;
    }
    update(id, regra) {
        const regras = this.findAll();
        const index = regras.findIndex((item) => item.id === id);
        if (index === -1)
            return undefined;
        regras[index] = { id, ...regra };
        fs.writeFileSync(this.dbPath, JSON.stringify(regras, null, 2), 'utf8');
        return regras[index];
    }
    delete(id) {
        const regras = this.findAll();
        const index = regras.findIndex((item) => item.id === id);
        if (index === -1)
            return false;
        regras.splice(index, 1);
        fs.writeFileSync(this.dbPath, JSON.stringify(regras, null, 2), 'utf8');
        return true;
    }
};
exports.RegraAvisoRepository = RegraAvisoRepository;
exports.RegraAvisoRepository = RegraAvisoRepository = __decorate([
    (0, common_1.Injectable)()
], RegraAvisoRepository);
//# sourceMappingURL=regra-aviso.repository.js.map