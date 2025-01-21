import { defHttp } from '@/utils/http/axios';

enum Api {
  Prefix = '/api/message/SendMessageConfig',
}
// 发送配置下拉列表
export function getSendConfigSelect(data) {
  return defHttp.get({ url: Api.Prefix + `/getSendConfigList`, data });
}
