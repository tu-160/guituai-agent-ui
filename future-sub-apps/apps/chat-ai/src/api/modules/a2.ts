import { defHttp } from '@/api/request';
// 智能体管理接口

const bseApi1 = 'https://apifoxmock.com/m1/5462201-0-default';
const bseApi: string = '';

// 模拟数据列表
// 用户登录
export function userLogin(data: any) {
  return defHttp.post({
    data: {},
    url: `${bseApi}/api/v1/user/login?nickname=${data.nickname}&password=${data.password}`,
  });
}
export function infoGet(data: any) {
  return defHttp.get({
    data,
    url: `${bseApi}/api/v1/user/infoGet`,
  });
}

export function infoCheck(data: any) {
  return defHttp.get({
    data,
    url: `${bseApi}/api/v1/user/infoCheck`,
  });
}
// 获取用户信息
export function getUserInfo(data: any) {
  return defHttp.post({
    data,
    url: `${bseApi1}/api/v1/user/info`,
  });
}

// C0006用户注册
export function C0006(data: any) {
  return defHttp.post({
    data,
    url: `${bseApi}/api/v1/user/register?nickname=${data.nickname}&password=${data.password}&email=${data.email}`,
  });
}

// D0001智能体新增
export function D0001(data: any) {
  return defHttp.post({
    data,
    url: `${bseApi}/api/v1/dialog/set`,
  });
}

// D0002智能体详情
export function D0002(data: any) {
  return defHttp.post({
    data: {},
    url: `${bseApi}/api/v1/dialog/get?dialog_id=${data.dialog_id}`,
  });
}

// D0003智能体删除
export function D0003(data: any) {
  return defHttp.post({
    data: {},
    url: `${bseApi}/api/v1/dialog/rm?dialog_id=${data.dialog_id}`,
  });
}

// D0004创作中心-智能体列表
export function D0004(data: any) {
  return defHttp.post({
    data,
    url: `${bseApi}/api/v1/dialog/list`,
  });
}
