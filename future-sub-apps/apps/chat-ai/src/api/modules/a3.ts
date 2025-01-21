import { defHttp } from '@/api/request';
// 智能体管理接口

const bseApi1 = 'https://apifoxmock.com/m1/5462201-0-default';
const bseApi: string = '';

// K0001知识库列表
export function K0001(data: any) {
  return defHttp.get({
    data: {},
    url: `${bseApi}/api/v1/kb/list?page=${data.page}&page_size=${data.page_size}&orderby=${data.orderby}&desc=${data.desc}&keywords=${data.keywords}`,
  });
}

// K0002知识库删除
export function K0002(data: any) {
  return defHttp.post({
    data,
    url: `${bseApi}/api/v1/kb/rm`,
  });
}

// K0003获取知识库详情
export function K0003(data: any) {
  return defHttp.get({
    data: {},
    url: `${bseApi}/api/v1/kb/detail?kb_id=${data.id}`,
  });
}

// K0004 新建知识库
export function K00004(data: any) {
  return defHttp.post({
    data,
    url: `${bseApi}/api/v1/kb/create`,
  });
}

// K0004查询数据集列表
export function K0004(data: any) {
  return defHttp.get({
    data: {},
    url: `${bseApi}/api/v1/document/list?kb_id=${data.id}&page=${data.page}&page_size=${data.page_size}&orderby=${data.orderby}&desc=${data.desc}`,
  });
}

// K0005Rerank模型列表
export function K0005(data: any) {
  return defHttp.get({
    data,
    url: `${bseApi}/api/v1/llm/list`,
  });
}

// K0006数据集启动停用
export function K0006(data: any) {
  return defHttp.post({
    data,
    url: `${bseApi}/api/v1/document/change_status`,
  });
}

// K0007 解析数据集
export function K0007(data: any) {
  return defHttp.post({
    data,
    url: `${bseApi}/api/v1/document/run`,
  });
}

// k0008解析方法编辑
export function k0008(data: any) {
  return defHttp.post({
    data,
    url: `${bseApi}/api/v1/document/change_parser`,
  });
}

// K0009 数据集重命名
export function K0009(data: any) {
  return defHttp.post({
    data,
    url: `${bseApi}/api/v1/document/rename`,
  });
}
// K0010 数据集删除
export function K00010(data: any) {
  return defHttp.post({
    data,
    url: `${bseApi}/api/v1/document/rm`,
  });
}

// K0011 新增文件
export function K0011(data: any) {
  return defHttp.post({
    data,
    url: `${bseApi}/api/v1/document/upload`,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

// K0013 检索测试
export function K0013(data: any) {
  return defHttp.post({
    data,
    url: `${bseApi1}/api/v1/chunk/retrieval_test`,
  });
}

// K0014 配置编辑
export function K0014(data: any) {
  return defHttp.post({
    data,
    url: `${bseApi}/api/v1/kb/update`,
  });
}
