export type JavaApiRequest = {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    path: string;
    body?: unknown;
    headers?: Record<string, string>;
};
export declare class JavaApiClientService {
    private readonly baseUrl;
    constructor(baseUrl?: string);
    request<T = unknown>(request: JavaApiRequest): Promise<T>;
}
