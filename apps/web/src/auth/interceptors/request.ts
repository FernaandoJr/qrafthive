import { InternalAxiosRequestConfig } from 'axios';

export const axiosInterceptorRequest = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  // Adicione aqui lógica de autenticação, headers, etc.
  // Exemplo: adicionar token de autenticação
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Adicione outros headers padrão se necessário
  if (config.headers) {
    config.headers['Content-Type'] =
      config.headers['Content-Type'] || 'application/json';
  }

  return config;
};

