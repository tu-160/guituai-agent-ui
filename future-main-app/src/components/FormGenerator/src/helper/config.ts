// 动态options
const dyOptionsList = ['radio', 'checkbox', 'select', 'cascader', 'treeSelect'];
// 展示组件
const vModelIgnoreList = ['divider', 'text', 'link', 'alert', 'groupTitle', 'button', 'barcode', 'qrcode', 'iframe'];
// 动态存储
const dyStorageList = ['relationFormAttr', 'popupAttr', 'calculate'];
// 不添加vModel
const noVModelList = [...vModelIgnoreList, ...dyStorageList];
// 不可以添加到子表组件
const noTableAllowList = [...vModelIgnoreList, 'editor', 'radio', 'checkbox', 'colorPicker', 'table'];
// 不可以添加到列表展示
const noColumnShowList = [...vModelIgnoreList, 'colorPicker', 'editor', 'relationFormAttr', 'popupAttr'];
// 不可以添加到搜索
const noSearchList = [
  ...noColumnShowList,
  'switch',
  'timeRange',
  'dateRange',
  'relationForm',
  'popupSelect',
  'popupTableSelect',
  'uploadImg',
  'uploadFile',
  'sign',
  'signature',
];
// 搜索时控件为input
const useInputList = ['input', 'textarea', 'billRule', 'location'];
// 搜索时控件为日期选择器
const useDateList = ['createTime', 'modifyTime'];
// 搜索时控件为下拉选择器
const useSelectList = ['radio', 'checkbox', 'select'];
// 系统控件
const systemComponentsList = ['createUser', 'createTime', 'modifyUser', 'modifyTime', 'currOrganize', 'currPosition', 'billRule'];
// 不允许关联到联动里面的控件
const noAllowRelationList = ['table', 'uploadImg', 'uploadFile', 'modifyUser', 'modifyTime'];
// 不允许关联表单选择的控件
const noAllowSelectList = [...noAllowRelationList, ...systemComponentsList, 'relationForm', 'popupSelect'];
// 不允许分组和排序
const noGroupList = ['sign', 'signature', 'location', 'uploadImg', 'uploadFile', 'editor'];

export {
  dyOptionsList,
  noVModelList,
  noTableAllowList,
  noColumnShowList,
  noSearchList,
  useInputList,
  useDateList,
  useSelectList,
  systemComponentsList,
  noAllowRelationList,
  noAllowSelectList,
  noGroupList,
};
