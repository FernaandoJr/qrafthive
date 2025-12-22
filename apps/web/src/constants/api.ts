import axios from 'axios';
import { axiosInterceptorRequest } from '../auth/interceptors/request';
import {
  axiosInterceptorCatchResponse,
  axiosInterceptorResponse,
} from '../auth/interceptors/response';
import { hostApi } from './environments';

const v1 = axios.create({ baseURL: `${hostApi}/v1` });
const v2 = axios.create({ baseURL: `${hostApi}/v2` });
const v3 = axios.create({ baseURL: `${hostApi}/v3` });
const v4 = axios.create({ baseURL: `${hostApi}/v4` });
const global = axios.create({ baseURL: hostApi });

[v1, v2, v3, v4, global].forEach((api) => {
  api.interceptors.response.use(axiosInterceptorResponse, axiosInterceptorCatchResponse);
  api.interceptors.request.use(axiosInterceptorRequest, (error) => Promise.reject(error));
});

export const apis = { v1, v2, v3, v4, global };
