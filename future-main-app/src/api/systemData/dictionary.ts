import { defHttp } from '@/utils/http/axios';

enum Api {
  Prefix = '/api/system/DictionaryData',
  TypePrefix = '/api/system/DictionaryType',
}

// 判断是否是开发环境
let appUrl = `/..${import.meta.env.VITE_PUBLIC_PATH}/mock.json`;
if (import.meta.env.PROD) {
  appUrl = `/..${import.meta.env.VITE_PUBLIC_PATH}/appConfig.json`;
}

// 获取字典分类下拉框列表
export function getDictionaryTypeSelector(id = '0') {
  return defHttp.get({ url: Api.TypePrefix + `/Selector/${id || '0'}` });
}
// 获取数据字典列表(分类+内容)
export function getDictionaryAll() {
  return defHttp.get({ url: appUrl }).then((res) => {
    return res[Api.Prefix + '/All']
  });

  // return defHttp.get({ url: Api.Prefix + '/All' });
}

// 获取字典数据下拉框列表
export function getDictionaryDataSelector(typeId) {
  return defHttp.get({ url: Api.Prefix + `/${typeId}/Data/Selector` });
}
