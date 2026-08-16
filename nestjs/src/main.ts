import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // LIBERA CORS
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
// Postman para testes
// Todos os estados de erro: https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Reference/Status
// Se usa htttp / navegador é nesscessário annotations (@ get, @module, @injectable, etc.)