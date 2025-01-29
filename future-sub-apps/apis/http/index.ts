// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
// The axios configuration can be changed according to the project, just change the file, other files can be left unchanged

import type { AxiosInstance, AxiosRequestHeaders, AxiosResponse } from 'axios';

import type { Recordable, RequestOptions, Result } from '../types/axios';
import type { AxiosTransform, CreateAxiosOptions } from './axiosTransform';

import { isObject, isString } from '@future/core/utils/is';

import { message as Message } from 'ant-design-vue';
import { clone } from 'lodash-es';

import { ContentTypeEnum, RequestEnum, ResultEnum } from '../enums/httpEnum';
import { VAxios } from './Axios';
import { formatRequestDate, joinTimestamp } from './helper';

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const { apiUrl, formatDate, joinParamsToUrl, joinPrefix, joinTime = true, urlPrefix } = options;

    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`;
    }

    if (apiUrl && isString(apiUrl) && !/https?:\/\//.test(config.url || '')) {
      config.url = `${apiUrl}${config.url}`;
    }
    const params = config.params || config.data || {};
    const data = config.data || false;
    formatDate && data && !isString(data) && formatRequestDate(data);
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (isString(params)) {
        // 兼容restful风格
        config.url = `${config.url + params}${joinTimestamp(joinTime, true)}`;
        config.params = undefined;
      } else {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      }
    } else {
      if (isString(params)) {
        // 兼容restful风格
        config.url = config.url + params;
        config.params = undefined;
      } else {
        formatDate && formatRequestDate(params);
        if (Reflect.has(config, 'data') && config.data && (Object.keys(config.data).length > 0 || config.data instanceof FormData)) {
          config.data = data;
          config.params = undefined;
        } else {
          // 非GET请求如果没有提供data，则将params视为data
          config.data = params;
          config.params = undefined;
        }
        if (joinParamsToUrl) {
          console.log('将参数放到url中');
        }
        // 数据加密
        if (config?.requestOptions?.useCipher && config.data) {
          console.log('数据加密');
          const resultStr = false;
          if (resultStr) config.data = { encryptData: resultStr };
        }
      }
    }
    return config;
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config, options) => {
    // 请求之前处理config
    (config as Recordable).headers['future-origin'] = 'pc';
    (config as Recordable).headers['vue-version'] = '3';

    console.log('处理token');
    const token = localStorage.getItem('TOKEN_') || '9999999';
    if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
      // jwt token
      (config as Recordable).headers.Authorization = options.authenticationScheme ? `${options.authenticationScheme} ${token}` : token;
    }
    return config;
  },

  /**
   * @description: 响应拦截器处理
   */
  responseInterceptors: (res: AxiosResponse<any>) => {
    // 数据解密
    if ((res.config as any)?.requestOptions?.useCipher) {
      console.log('数据解密');
    }
    return res;
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (axiosInstance: AxiosInstance, error: any) => {
    const { code, config, message, response } = error || {};
    const errorMessageMode = config?.requestOptions?.errorMessageMode || 'none';
    const msg: string = response?.data?.error?.message ?? '';
    const err: string = error?.toString?.() ?? '';
    let errMessage = '';

    try {
      if (code === 'ECONNABORTED' && message.includes('timeout')) {
        errMessage = 'apiTimeoutMessage';
      }
      if (err?.includes('Network Error')) {
        errMessage = 'networkExceptionMsg';
      }

      if (errMessage) {
        if (errorMessageMode === 'modal') {
          console.log('弹窗提示1', msg);
        } else if (errorMessageMode === 'message') {
          Message.error(errMessage);
        }
        return Promise.reject(error);
      }
    } catch (error) {
      throw new Error(error as unknown as string);
    }

    // checkStatus(error?.response?.status, msg, errorMessageMode);
    // 添加自动重试机制 保险起见 只针对GET请求
    return Promise.reject(error);
  },

  /**
   * @description: 处理响应数据。如果数据不是预期格式，可直接抛出错误
   */
  transformResponseHook: (res: AxiosResponse<Result>, options: RequestOptions) => {
    const { isReturnNativeResponse, isTransformResponse } = options;
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res;
    }
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code,data,msg这些信息时开启
    if (!isTransformResponse) {
      return res.data;
    }
    // 错误的时候返回
    if (!res.data) {
      // return '[HTTP] Request has no return value';
      throw new Error('返回数据为空');
    }
    //  这里 code,data,msg为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
    if (typeof res.data.code === 'string') {
      res.data.code = Number(res.data.code);
    }
    const { code, msg } = res.data;

    // 这里逻辑可以根据项目进行修改
    const hasSuccess = res.data && isObject(res.data) && Reflect.has(res.data, 'code') && code === ResultEnum.SUCCESS;
    if (hasSuccess) {
      return res.data;
    }

    // 在此处根据自己项目的实际情况对不同的code执行不同的操作
    // 如果不希望中断当前请求，请return数据，否则直接抛出异常即可
    const errorMsg = msg || '';
    switch (code) {
      case ResultEnum.TOKEN_ERROR:
      case ResultEnum.TOKEN_LOGGED:
      case ResultEnum.TOKEN_TIMEOUT: {
        console.log('这里应该退出登陆');
        break;
      }
      default: {
        console.log('默认的错误处理');
      }
    }

    // errorMessageMode='modal'的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
    // errorMessageMode='none' 一般是调用时明确表示不希望自动弹出错误提示
    if (options.errorMessageMode === 'modal') {
      // createErrorModal({ title: t("sys.api.errorTip"), content: errorMsg });
      console.log('弹窗提示错误信息1');
    } else if (options.errorMessageMode === 'message') {
      // createMessage.error(errorMsg);
      console.log('弹窗提示错误信息2', errorMsg);

      if(errorMsg != '会话信息为空') {
        Message.error(errorMsg);
      }

    }

    throw new Error(errorMsg);
  },
};

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    // 深度合并
    {
      // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
      // authentication schemes，e.g: Bearer
      // authenticationScheme: 'Bearer',
      authenticationScheme: '',
      headers: { 'Content-Type': ContentTypeEnum.JSON } as AxiosRequestHeaders,
      // 基础接口地址
      // baseURL: globSetting.apiUrl,

      // 配置项，下面的选项都可以在独立的接口请求中覆盖
      requestOptions: {
        // 接口地址
        apiUrl: '', // https://apifoxmock.com
        // 消息提示类型
        errorMessageMode: 'message',
        // 格式化提交参数时间
        formatDate: true,
        // 忽略重复请求
        ignoreCancelToken: true,
        // 是否返回原生响应头 比如：需要获取响应头时使用该属性
        isReturnNativeResponse: false,
        // 需要对返回数据进行处理
        isTransformResponse: true,
        // post请求的时候添加参数到url
        joinParamsToUrl: false,
        // 默认将prefix 添加到url
        joinPrefix: true,
        //  是否加入时间戳
        joinTime: true,
        retryRequest: {
          count: 5,
          isOpenRetry: false,
          waitTime: 100,
        },
        // 接口拼接地址
        urlPrefix: '',
        // 是否加密
        useCipher: false,
        // 是否携带token
        withToken: true,
      },
      timeout: 1000 * 1000,
      // 如果是form-data格式
      // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
      // 数据处理方式
      transform: clone(transform),
      ...opt,
    },
  );
}
export function createDefHttp(token: string) {
  return createAxios({
    // 配置项，下面的选项都可以在独立的接口请求中覆盖
    requestOptions: {
      // 接口地址
      apiUrl: '', // https://apifoxmock.com
      // 消息提示类型
      errorMessageMode: 'message',
      // 格式化提交参数时间
      formatDate: true,
      // 忽略重复请求
      ignoreCancelToken: true,
      // 是否返回原生响应头 比如：需要获取响应头时使用该属性
      isReturnNativeResponse: false,
      // 需要对返回数据进行处理
      isTransformResponse: true,
      // post请求的时候添加参数到url
      joinParamsToUrl: false,
      // 默认将prefix 添加到url
      joinPrefix: true,
      //  是否加入时间戳
      joinTime: true,
      retryRequest: {
        count: 5,
        isOpenRetry: false,
        waitTime: 100,
      },
      // 接口拼接地址
      urlPrefix: '',
      // 是否加密
      useCipher: false,
      // 是否携带token
      withToken: true,
    },
    timeout: 1000 * 1000,
    transform: {
      ...transform,
      requestInterceptors: (config, options) => {
        if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
          (config as Recordable).headers.Authorization = options.authenticationScheme ? `${options.authenticationScheme} ${token}` : token;
        }
        return config;
      },
    },
  });
}
export const defHttp = createAxios();

// 在vue安装时, 往http 对象里添加提示方法
