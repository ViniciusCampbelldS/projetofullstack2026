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
exports.JavaApiClientService = void 0;
const common_1 = require("@nestjs/common");
let JavaApiClientService = class JavaApiClientService {
    baseUrl;
    constructor(baseUrl = process.env.JAVA_API_BASE_URL ?? 'http://localhost:8080') {
        this.baseUrl = baseUrl;
    }
    async request(request) {
        const url = `${this.baseUrl.replace(/\/$/, '')}${request.path}`;
        const response = await fetch(url, {
            method: request.method,
            headers: {
                'content-type': 'application/json',
                accept: 'application/json',
                ...(request.headers ?? {}),
            },
            body: request.body === undefined
                ? undefined
                : JSON.stringify(request.body),
        });
        const responseBody = await response.text();
        let parsedBody = undefined;
        if (responseBody) {
            try {
                parsedBody = JSON.parse(responseBody);
            }
            catch {
                parsedBody = responseBody;
            }
        }
        if (!response.ok) {
            throw new common_1.HttpException(parsedBody ?? { message: `Backend Java returned ${response.status}` }, response.status || common_1.HttpStatus.BAD_GATEWAY);
        }
        return parsedBody;
    }
};
exports.JavaApiClientService = JavaApiClientService;
exports.JavaApiClientService = JavaApiClientService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], JavaApiClientService);
//# sourceMappingURL=java-api-client.service.js.map