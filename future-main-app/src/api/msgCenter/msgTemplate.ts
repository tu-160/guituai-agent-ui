import { defHttp } from '@/utils/http/axios';

enum Api {
  Prefix = '/api/message/MessageTemplateConfig',
}

// 获取消息模板
export function getInfo(id) {
  return defHttp.get({ url: Api.Prefix + '/' + id });
}

