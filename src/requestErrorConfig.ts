import { history, type RequestConfig } from '@umijs/max';
import { ResponseCode } from './constants/ResponseCode';

// 与后端约定的响应数据格式
interface ResponseStructure {
  bizState?: string;
  code?: string;
  data?: any;
  message?: string;
  timestamp?: number;
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const requestConfig: RequestConfig = {
  // baseURL: "http://localhost:8080",
  withCredentials: true,
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {},

  // 请求拦截器
  requestInterceptors: [],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      const data = response.data as ResponseStructure;

      if (data.code === ResponseCode.NOT_LOGIN) {
        history.push('/user/login');
        return response;
      }

      if (data?.code !== ResponseCode.SUCCESS) {
        throw new Error(data.message || '请求失败');
      }
      return response;
    },
  ],
};
