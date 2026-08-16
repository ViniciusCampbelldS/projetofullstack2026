import { Injectable, UnauthorizedException } from '@nestjs/common';
@Injectable()
export class AuthService {
login(email: string, senha: string) {
const loginInformado = String(email ?? '').trim();
const loginSomenteDigitos = loginInformado.replace(/\D/g, '');

const credencialValida =
	(loginInformado === '123' || loginSomenteDigitos === '12312312312') &&
	senha === '123';

if (credencialValida) {
return { access_token: 'token-simples-123' };
}

throw new UnauthorizedException('Login inválido');
}
}
/*
Simula um usuário válido
Retorna token quando login correto
*/