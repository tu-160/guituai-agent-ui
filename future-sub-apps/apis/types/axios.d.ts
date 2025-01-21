/**
 * Data processing class, can be configured according to the project
 */
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export interface MessageAPI {
  error?: number;
  info?: boolean;
  success?: number;
  warning?: number;
}

declare type Recordable<T = any> = Record<string, T>;

export interface RetryRequest {
  count: number;
  isOpenRetry: boolean;
  waitTime: number;
}
export interface Result<T = any> {
  code: number;
  data?: T;
  msg: string;
}

// multipart/form-data: upload file
export interface UploadFileParams {
  [key: string]: any;
  // Other parameters
  data?: Recordable;
  // file name
  file: Blob | File;
  // file name
  filename?: string;
  // File parameter interface field name
  name?: string;
}

export type ErrorMessageMode = 'message' | 'modal' | 'none' | undefined;

export interface RequestOptions {
  // Interface address, use the default apiUrl if you leave it blank
  apiUrl?: string;
  // Error message prompt type
  errorMessageMode?: ErrorMessageMode;
  // Format request parameter time
  formatDate?: boolean;
  ignoreCancelToken?: boolean;
  // Whether to return native response headers
  // For example: use this attribute when you need to get the response headers
  isReturnNativeResponse?: boolean;
  // Whether to process the request result
  isTransformResponse?: boolean;
  // Splicing request parameters to url
  joinParamsToUrl?: boolean;
  // Whether to join url
  joinPrefix?: boolean;
  // Whether to add a timestamp
  joinTime?: boolean;
  // 请求重试机制
  retryRequest?: RetryRequest;
  // 请求拼接路径
  urlPrefix?: string;
  // 是否加密
  useCipher?: boolean;
  // Whether to send token in header
  withToken?: boolean;
}

export interface CreateAxiosOptions extends InternalAxiosRequestConfig {
  authenticationScheme?: string;
  requestOptions?: RequestOptions;
  // eslint-disable-next-line no-use-before-define
  transform?: AxiosTransform;
}

export abstract class AxiosTransform {
  /**
   * @description: Process configuration before request
   */
  beforeRequestHook?: (config: CreateAxiosOptions, options: RequestOptions) => InternalAxiosRequestConfig;

  /**
   * @description: 请求失败处理
   */
  requestCatchHook?: (e: Error, options: RequestOptions) => Promise<any>;

  /**
   * @description: 请求之前的拦截器
   */
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
