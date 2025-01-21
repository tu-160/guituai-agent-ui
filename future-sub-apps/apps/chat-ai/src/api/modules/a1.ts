import { defHttp } from '@/api/request';
// 聊天模块接口
const bseApi1 = 'https://apifoxmock.com/m1/5462201-5137547-default';
const bseApi = '';

/**
 * 对话信息列表
 */
export interface IMessage {
  /**
   * 对话内容
   */
  content: string;
  /**
   * 对话角色, assistant: 智能体, user: 用户
   */
  role: 'assistant' | 'user';
}

export interface IChatParams {
  /**
   * 对话ID
   */
  conversation_id: string;
  /**
   * 智能体ID
   */
  dialog_id: string;
  /**
   * 对话列表数组
   */
  messages: IMessage;
}

// 会话历史接口
export function C0004(data: { dialog_id: string }) {
  return defHttp.post({
    data: {},
    url: `${bseApi}/api/v1/conversation/list?dialog_id=${data.dialog_id}`,
  });
}

// 对话详情接口
export function C0003(data: { conversation_id: string }) {
  return defHttp.post({
    data,
    url: `${bseApi}/api/v1/conversation/get?conversation_id=${data.conversation_id}`,
  });
}

// 新建会话
export function C0002(data: { dialog_id: string }) {
  return defHttp.post({
    data: {},
    url: `${bseApi}/api/v1/conversation/new?dialog_id=${data.dialog_id}`,
  });
}

// 流式对话响应接口
export async function C0001(data: IChatParams) {
  try {
    const response = await fetch(`${bseApi}/api/v1/conversation/completion?conversation_id=${data.conversation_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: localStorage.getItem('TOKEN_') || '',
      },
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}

// 会话删除
export function C0005(data: { conversation_id: string }) {
  return defHttp.post({
    data,
    url: `${bseApi}/api/v1/conversation/rm?conversation_id=${data.conversation_id}`,
  });
}

// 最近使用智能体
export function C0009() {
  return defHttp.post({
    data: {},
    url: `${bseApi}/api/v1/dialog/list/my`,
  });
}

// 获取基础智能体
export function C0010() {
  return defHttp.post({
    data: {},
    url: `${bseApi1}/api/v1/dialog/base/list`,
  });
}

// C0011删除最近使用智能体
export function C0011(data: any) {
  return defHttp.post({
    data: {},
    url: `${bseApi}/api/v1/dialog/list/my/rm?dialog_id=${data.id}`,
  });
}
export function C0012(data: any) {
  return defHttp.post({
    data,
    url: `${bseApi}/api/v1/dialog/list/public?searchSize=${data.searchSize}`,
  });
}

// // D0003智能体删除
// export function D0003(data: any) {
//   return defHttp.get({
//     data: {},
//     url: `${bseApi}/api/v1/dialog/rm?dialog_id=${data.id}`,
//   });
// }
export function C0013(data: any) {
  return defHttp.post({
    data,
    url: `${bseApi}/api/v1/dialog/default_question?dialog_id=${data.dialog_id}`,
  });
}
