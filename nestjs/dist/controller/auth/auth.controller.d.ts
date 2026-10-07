import { AuthService } from '../../service/auth/auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: any): {
        access_token: string;
    };
}
