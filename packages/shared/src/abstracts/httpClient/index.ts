import { AxiosInstance } from 'axios';
import { ISuccessResponse } from '../../types';
import { IHttp, IHttpClient, IHttpOptions } from './types';

export class HttpClient<T> implements IHttpClient<T> {
  http: IHttp;
  version = 'v1';
  baseUrl = '';

  constructor(http: IHttp, version: string, baseUrl: string) {
    this.http = http;
    this.version = version;
    this.baseUrl = baseUrl;
  }

  protected getHttpInstance(version: string): AxiosInstance {
    const httpInstance = this.http[version];
    if (!httpInstance) {
      throw new Error(`HTTP instance for version ${version} not found`);
    }
    return httpInstance;
  }

  async get(options?: IHttpOptions): Promise<T[]> {
    const { data } = await this.getHttpInstance(options?.version ?? this.version).get<T[]>(
      options?.baseUrl ?? this.baseUrl,
    );
    return data;
  }

  async getOne(guid: string, options?: IHttpOptions): Promise<T> {
    const { data } = await this.getHttpInstance(options?.version ?? this.version).get<T>(
      options?.baseUrl ?? `${this.baseUrl}/${guid}`,
    );
    return data;
  }

  async create(values: T, options?: IHttpOptions): Promise<ISuccessResponse> {
    const { data } = await this.getHttpInstance(options?.version ?? this.version).post(
      options?.baseUrl ?? this.baseUrl,
      values,
    );

    return data;
  }

  async update(values: T, options?: IHttpOptions): Promise<ISuccessResponse> {
    const { data } = await this.getHttpInstance(options?.version ?? this.version).put(
      options?.baseUrl ?? this.baseUrl,
      values,
    );

    return data;
  }

  async patch(values: T, options?: IHttpOptions): Promise<ISuccessResponse> {
    const { data } = await this.getHttpInstance(options?.version ?? this.version).patch(
      options?.baseUrl ?? this.baseUrl,
      values,
    );

    return data;
  }

  async delete(guid: string, options?: IHttpOptions): Promise<void> {
    const { data } = await this.getHttpInstance(options?.version ?? this.version).delete(
      options?.baseUrl ?? `${this.baseUrl}/${guid}`,
      {
        data: { Guid: guid },
      },
    );

    return data;
  }
}
