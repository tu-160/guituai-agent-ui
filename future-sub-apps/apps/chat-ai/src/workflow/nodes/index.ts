import type LogicFlow from '@logicflow/core';

import { cloneDeep } from 'lodash-es';

const registerFuncList = import.meta.glob('./presets/**/index.ts', { import: 'default', eager: true });
const getDataDefaultFuncList = import.meta.glob('./presets/**/index.ts', { import: 'getDataDefault', eager: true });
const propertyList = import.meta.glob('./presets/**/property.vue', { import: 'default', eager: true });
export const nodeDefineList = import.meta.glob('./presets/**/index.ts', { import: 'nodeDefine', eager: true });

/**
 * 获取节点属性界面
 * @returns
 */
const propertyViews = {} as any;
export function getAllNodesPropertyView() {
  if (propertyViews.isInit) {
    return propertyViews;
  }
  Object.keys(propertyList).forEach((key) => {

    let tmpKey = key.replace('./presets/', '').replace('/property.vue', '').replace('/', '');
    if(tmpKey === 'begin') {
      propertyViews[tmpKey] = propertyList[key];
    } else {
      // 第一个字符统一转大写
      tmpKey = tmpKey.charAt(0).toUpperCase() + tmpKey.slice(1);
      propertyViews[tmpKey] = propertyList[key];
    }

    // propertyViews[key.replace('./presets/', '').replace('/property.vue', '-node').replace('/', '-')] = propertyList[key];
  });
  propertyViews.isInit = true;
  return propertyViews;
}

/**
 * 获取节点属性界面的默认值
 * @returns
 */
const DataDefault = {} as any;
export function getAllNodesPropertyDataDefault(type: string) {

  if (DataDefault.isInit) {
    return cloneDeep(DataDefault[type]);
  }
  Object.keys(getDataDefaultFuncList).forEach((key) => {

    let tmpKey = generateKey(key);
    if(tmpKey === 'begin') {
      DataDefault[tmpKey] = (getDataDefaultFuncList[key] as () => any)();
    } else {
      DataDefault[tmpKey] = (getDataDefaultFuncList[key] as () => any)();
    }
    // DataDefault[key.replace('./presets/', '').replace('/index.ts', '-node').replace('/', '-')] = (getDataDefaultFuncList[key] as () => any)();
  });
  DataDefault.isInit = true;

  return cloneDeep(DataDefault[type]);
}

export function generateKey(pathString: string) {
  let tmpKey = pathString.replace('./presets/', '').replace('/index.ts', '');
  if(tmpKey === 'begin') {
    return tmpKey;
  } else {
    // 第一个字符统一转大写
    tmpKey = tmpKey.charAt(0).toUpperCase() + tmpKey.slice(1);
    return tmpKey;
  }
}
/**
 * 获取节点定义
 * @returns
 */
const nodeDefines = [] as any;
export function getAllNodesNodeDefineList() {
  if (nodeDefines.length > 0) {
    return nodeDefines.filter((item: any) => !item.isHidden);
  }
  Object.keys(nodeDefineList).forEach((key) => {
    nodeDefines.push(nodeDefineList[key]);
  });

  nodeDefines.sort((a: any, b: any) => (a.index || 0) - (b.index || 0));
  return nodeDefines.filter((item: any) => !item.isHidden);
}

/**
 * 注册节点
 * @param lf
 */
export default function registerAllNodes(lf: LogicFlow) {

  Object.keys(registerFuncList).forEach((key) => {
    (registerFuncList[key] as any)(lf);
  });
}
