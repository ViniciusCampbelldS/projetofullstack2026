import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

export type JavaApiRequest = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
};

@Injectable()
export class JavaApiClientService {
  constructor(
    private readonly baseUrl =
      process.env.JAVA_API_BASE_URL ?? 'http://localhost:8080',
  ) {}

  async request<T = unknown>(request: JavaApiRequest): Promise<T> {
    const url = `${this.baseUrl.replace(/\/$/, '')}${request.path}`;
    const response = await fetch(url, {
      method: request.method,
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        ...(request.headers ?? {}),
      },
      body:
        request.body === undefined
          ? undefined
          : JSON.stringify(request.body),
    });

    const responseBody = await response.text();
    let parsedBody: unknown = undefined;

    if (responseBody) {
      try {
        parsedBody = JSON.parse(responseBody);
      } catch {
        parsedBody = responseBody;
      }
    }

    if (!response.ok) {
      throw new HttpException(
        parsedBody ?? { message: `Backend Java returned ${response.status}` },
        response.status || HttpStatus.BAD_GATEWAY,
      );
    }

    return parsedBody as T;
  }
}
