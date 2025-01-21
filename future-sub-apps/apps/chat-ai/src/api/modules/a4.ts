import { defHttp } from '@/api/request';
// 智能体管理接口

const bseApi1 = 'https://apifoxmock.com/m1/5462201-0-default';
const bseApi: string = '';

/**
 * G0001-高阶智能体列表
 * @param data
 * @returns
 */
export function G0001(data: any) {
  return defHttp.post({
    data,
    url: `${bseApi}/api/v1/canvas/list`,
  });
}

/**
 * G0002-高阶智能体删除
 * @param data
 * @returns
 */
export function G0002(data: any) {
  return defHttp.post({
    data,
    url: `${bseApi}/api/v1/canvas/rm?canvas_id=${data.canvas_id}`,
  });
}

// G0003-高阶智能体详情
export function G0003(data: any) {
  return defHttp.post({
    data,
    url: `${bseApi}/api/v1/canvas/get/${data.canvas_id}`,
  });
}

// G0004-高阶智能体编辑
export function G0004(data: any) {
  return defHttp.post({
    data,
    url: `${bseApi}/api/v1/canvas/set`,
  });
}

// G0005-高阶智能体对话调试
export function G0005(data: any) {
  return defHttp.post({
    data,
    url: `${bseApi1}/api/v1/canvas/completion`,
  });
}

// G0006-高阶智能体对话调试重置
export function G0006(data: any) {
  return defHttp.post({
    data,
    url: `${bseApi1}/api/v1/canvas/reset`,
  });
}
