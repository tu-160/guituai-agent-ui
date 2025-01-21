const sourceTypeOptions = [
  { id: 1, fullName: '字段' },
  { id: 2, fullName: '自定义' },
];
const interfaceSourceTypeOptions = [...sourceTypeOptions, { id: 3, fullName: '为空' }];
const triggerRuleTypeOptions = [
  { id: 0, fullName: '无条件' },
  { id: 1, fullName: '按条件' },
];
const msgUserOptions = [
  { id: 1, fullName: '创建人' },
  { id: 2, fullName: '超级管理员' },
  { id: 3, fullName: '自定义' },
];
const noticeOptions = [
  { id: 3, fullName: '默认' },
  { id: 1, fullName: '自定义' },
  { id: 0, fullName: '关闭' },
];
const logicOptions = [
  { id: 'and', fullName: '且' },
  { id: 'or', fullName: '或' },
];
const symbolOptions = [
  { id: '>=', fullName: '大于等于' },
  { id: '>', fullName: '大于' },
  { id: '==', fullName: '等于' },
  { id: '<=', fullName: '小于等于' },
  { id: '<', fullName: '小于' },
  { id: '<>', fullName: '不等于' },
  { id: 'like', fullName: '包含' },
  { id: 'notLike', fullName: '不包含' },
  { id: 'null', fullName: '为空' },
  { id: 'notNull', fullName: '不为空' },
];
const notSupportList = ['relationFormAttr', 'popupAttr', 'uploadFile', 'uploadImg', 'colorPicker', 'editor', 'link', 'button', 'text', 'alert', 'table'];
export { sourceTypeOptions, interfaceSourceTypeOptions, triggerRuleTypeOptions, msgUserOptions, noticeOptions, logicOptions, symbolOptions, notSupportList };
