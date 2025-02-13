/**
 * Data processing class, can be configured according to the project
 */
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import type { RequestOptions, Result } from '../types/axios';

export abstract class AxiosTransform {
  /**
   * @description: Process configuration before request
   * @description: Process configuration before request
   */
  // eslint-disable-next-line no-use-before-define
  beforeRequestHook?: (config: CreateAxiosOptions, options: RequestOptions) => InternalAxiosRequestConfig;

  /**
   * @description: 请求失败处理
   */
  requestCatchHook?: (e: Error, options: RequestOptions) => Promise<any>;

  /**
   * @description: 请求之前的拦截器
   */
  // eslint-disable-next-line no-use-before-define
  requestInterceptors?: (config: InternalAxiosRequestConfig, options: CreateAxiosOptions) => InternalAxiosRequestConfig;

  /**
   * @description: 请求之前的拦截器错误处理
   */
  requestInterceptorsCatch?: (error: Error) => void;

  /**
   * @description: 请求之后的拦截器
   */
  responseInterceptors?: (res: AxiosResponse<any>) => AxiosResponse<any>;

  /**
   * @description: 请求之后的拦截器错误处理
   */
  responseInterceptorsCatch?: (axiosInstance: AxiosInstance, error: Error) => void;

  /**
   * @description: 处理响应数据
   */
  transformResponseHook?: (res: AxiosResponse<Result>, options: RequestOptions) => any;
}

export interface CreateAxiosOptions extends InternalAxiosRequestConfig {
  authenticationScheme?: string;
  requestOptions?: RequestOptions;
  transform?: AxiosTransform;
}
