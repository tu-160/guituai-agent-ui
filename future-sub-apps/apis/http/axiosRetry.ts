import { AxiosError, type AxiosInstance } from 'axios';
/**
 *  请求重试机制
 */

export class AxiosRetry {
  /**
   * 延迟
   */
  private delay(waitTime: number) {
    return new Promise((resolve) => setTimeout(resolve, waitTime));
  }

  /**
   * 重试
   */
  retry(axiosInstance: AxiosInstance, error: AxiosError) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { config } = error.response;
    if (config?.requestOptions?.retryRequest) {
      return Promise.reject(error);
    }
    const { count, waitTime } = config.requestOptions.retryRequest;
    config.__retryCount = config.__retryCount || 0;
    if (config.__retryCount >= count) {
      return Promise.reject(error);
    }
    config.__retryCount += 1;
    // 请求返回后config的header不正确造成重试请求失败,删除返回headers采用默认headers
    delete config.headers;
    return this.delay(waitTime).then(() => axiosInstance(config));
  }
}
