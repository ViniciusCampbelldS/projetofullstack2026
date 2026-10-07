import { createServer, Server } from 'http';
import { AddressInfo } from 'net';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { JavaApiClientService } from './java-api-client.service';

describe('JavaApiClientService', () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    server = createServer((request, response) => {
      let body = '';
      request.on('data', chunk => body += chunk);
      request.on('end', () => {
        response.writeHead(201, { 'content-type': 'application/json' });
        response.end(JSON.stringify({
          method: request.method,
          path: request.url,
          body: body ? JSON.parse(body) : null,
        }));
      });
    });

    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) =>
      server.close(error => error ? reject(error) : resolve()),
    );
  });

  it('encaminha metodo, rota, corpo e resposta para o backend Java', async () => {
    const originalBaseUrl = process.env.JAVA_API_BASE_URL;
    process.env.JAVA_API_BASE_URL = baseUrl;

    try {
      const service = new JavaApiClientService();
      const response = await service.request({
        method: 'POST',
        path: '/epis',
        body: { ca: '123', nome: 'Capacete' },
      });

      expect(response).toEqual({
        method: 'POST',
        path: '/epis',
        body: { ca: '123', nome: 'Capacete' },
      });
    } finally {
      if (originalBaseUrl === undefined) delete process.env.JAVA_API_BASE_URL;
      else process.env.JAVA_API_BASE_URL = originalBaseUrl;
    }
  });
});
