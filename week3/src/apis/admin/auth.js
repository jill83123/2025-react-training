import { authApi } from '../base';

export const apiLogin = (data) => authApi.post('/admin/signin', data);

export const apiLogout = () => authApi.post('/logout');

export const apiCheckLogin = () => authApi.post('/api/user/check');
