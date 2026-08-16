import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../../service/auth/auth.service';

@Controller('auth')
export class AuthController {
constructor(private authService: AuthService) {}

@Post('login')
login(@Body() body: any) {
return this.authService.login(body.email, body.senha);
}
}
