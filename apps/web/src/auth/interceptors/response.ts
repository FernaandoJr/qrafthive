import { AxiosError, AxiosResponse } from 'axios';

export const axiosInterceptorResponse = (response: AxiosResponse): AxiosResponse => {
  // Processar resposta antes de retornar
  // Você pode adicionar lógica de transformação aqui
  return response;
};

export const axiosInterceptorCatchResponse = (error: AxiosError): Promise<AxiosError> => {
  // Tratamento de erros global
  if (error.response) {
    // Erro com resposta do servidor
    const { status, data } = error.response;

    switch (status) {
      case 401:
        // Não autorizado - redirecionar para login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          // window.location.href = '/auth/login';
        }
        break;
      case 403:
        // Acesso negado
        console.error('Acesso negado:', data);
        break;
      case 404:
        // Recurso não encontrado
        console.error('Recurso não encontrado:', error.config?.url);
        break;
      case 500:
        // Erro interno do servidor
        console.error('Erro interno do servidor:', data);
        break;
      default:
        console.error('Erro na requisição:', status, data);
    }
  } else if (error.request) {
    // Erro na requisição (sem resposta)
    console.error('Erro na requisição:', error.request);
  } else {
    // Erro ao configurar a requisição
    console.error('Erro:', error.message);
  }

  return Promise.reject(error);
};
