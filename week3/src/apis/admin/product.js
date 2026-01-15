import { adminApi } from '../base';

export const apiGetAllProducts = () => adminApi.get('/products/all');

export const apiGetProducts = (page = 1, category = '') =>
  adminApi.get(`/products?page=${page}&category=${category}`);

export const apiPostProduct = (data) => adminApi.post('/product', data);

export const apiPutProduct = (id, data) => adminApi.put(`/product/${id}`, data);

export const apiDeleteProduct = (id) => adminApi.delete(`/product/${id}`);
