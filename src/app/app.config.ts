import { AuthService } from './services/auth/auth';
import { firstValueFrom, catchError, of } from 'rxjs';
// Importa as configurações necessárias para inicializar a aplicação Angular.
import {
  ApplicationConfig,
  inject, provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
// Configura o HttpClient para permitir chamadas HTTP para a API Java.
import {
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
// Configura o sistema de rotas do Angular.
import { provideRouter } from '@angular/router';
// Importa as rotas principais da aplicação.
import { routes } from './app.routes';
// Importa o interceptor responsável por adicionar o JWT/token às requisições.
import { authInterceptor } from './auth/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(()=>{const auth=inject(AuthService);return firstValueFrom(auth.inicializar().pipe(catchError(()=>{auth.limpar();return of(null);})));}),

    // Captura erros globais da aplicação Angular.
    provideBrowserGlobalErrorListeners(),

    // Otimiza a detecção de alterações agrupando eventos do navegador.
    provideZoneChangeDetection({
      eventCoalescing: true,
    }),

    // Registra todas as rotas definidas em app.routes.ts.
    provideRouter(routes),

    // Disponibiliza HttpClient para todos os serviços.
    //
    // O authInterceptor será executado automaticamente antes das
    // requisições HTTP que passarem pelo HttpClient.
    provideHttpClient(
      withInterceptors([
        authInterceptor,
      ]),
    ),
  ],
};