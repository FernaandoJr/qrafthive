import { AxiosInstance, AxiosResponse } from 'axios';
import { ISuccessResponse } from '../../types';

export type IHttp = Record<string, AxiosInstance>;

export interface IHttpClient<T> {
  get: (options?: IHttpOptions) => Promise<T[]>;
  getOne: (guid: string, options?: IHttpOptions) => Promise<T>;
  create: (values: T, options?: IHttpOptions) => Promise<ISuccessResponse>;
  update: (values: T, options?: IHttpOptions) => Promise<ISuccessResponse>;
  patch: (values: T, options?: IHttpOptions) => Promise<ISuccessResponse>;
  delete: (guid: string, options?: IHttpOptions) => Promise<void>;
}

export interface IHttpOptions {
  version: string;
  baseUrl: string;
}

export type IHttpResponse<T = any> = AxiosResponse<T>;
