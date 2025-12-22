import { HttpClient } from '../../abstracts/httpClient';
import { IHttp } from '../../abstracts/httpClient/types';
import { UserResponse } from './types';

export class UserService extends HttpClient<UserResponse> {
  constructor(http: IHttp, version: string, baseUrl: string) {
    super(http, version, baseUrl);
  }

  // async login(data: LoginRequest): Promise<ISuccessResponse> {
  //   const response = await this.create(data);

  //   if (response.Message && typeof window !== 'undefined') {
  //     localStorage.setItem('token', response.Message);
  //   }

  //   return response;
  // }

  // async register(data: RegisterRequest): Promise<ISuccessResponse> {
  //   const response = await this.create(data);

  //   if (response.Message && typeof window !== 'undefined') {
  //     localStorage.setItem('token', response.Message);
  //   }

  //   return response;
  // }

  async getCurrentUser(guid: string): Promise<UserResponse> {
    return this.getOne(guid);
  }

  // async updateUser(guid: string, data: Partial<UserResponse>): Promise<ISuccessResponse> {
  //   return this.update({ ...data, guid });
  // }

  async getUserById(guid: string): Promise<UserResponse> {
    return this.getOne(guid);
  }

  // async forgotPassword(email: string): Promise<ISuccessResponse> {
  // 	return this.create({ email, guid: '' });
  // }

  // async resetPassword(
  //   token: string,
  //   newPassword: string,
  // ): Promise<AxiosResponse<{ message: string }>> {
  //   return this.post<{ message: string }>('/auth/reset-password', {
  //     token,
  //     password: newPassword,
  //   });
  // }

  // async changePassword(
  //   currentPassword: string,
  //   newPassword: string,
  // ): Promise<AxiosResponse<{ message: string }>> {
  //   return this.post<{ message: string }>('/auth/change-password', {
  //     currentPassword,
  //     newPassword,
  //   });
  // }
}
