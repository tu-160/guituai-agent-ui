import type { RegItem, MaskConfig, SelectProps, TreeProps, DateFormatType, TimeFormatType, SizeUnitType, AlignType } from './basic';
export interface ItemCfg {
  futureKey: string;
  label: string;
  tipLabel?: string;
  labelWidth: undefined | number;
  showLabel: boolean;
  tag: string;
  tagIcon: string;
  tableAlign?: string;
  tableFixed?: string;
  className: string[];
  defaultValue?: any;
  defaultCurrent?: boolean;
  required?: false;
  layout: string;
  span: number;
  dragDisabled: boolean;
  visibility: string[];
  tableName?: Nullable<string>;
  noShow: boolean;
  regList?: RegItem[];
  trigger?: string | string[];
  isStorage?: number;
  dataType?: string;
  dictionaryType?: string;
  propsUrl?: string;
  propsName?: string;
  templateJson?: any[];
  formId?: string;
  isSubTable?: boolean;
  parentVModel?: Nullable<string>;
  relationTable?: Nullable<string>;
  // 关联表单/弹窗选择
  transferList?: any[];
  // 折叠面板/tab
  children?: any[];
  active?: any;
  // 设计子表
  showTitle?: boolean;
  complexHeaderList?: any[];
  // 表格容器、iframe
  borderType?: string;
  borderColor?: string;
  borderWidth?: number;
  // 单据规则
  rule?: string;
  ruleName?: string;
  // 日期选择/时间选择
  startTimeRule?: false;
  startTimeType?: number;
  startTimeTarget?: number;
  startTimeValue?: Nullable<number>;
  startRelationField?: string;
  endTimeRule?: false;
  endTimeType?: number;
  endTimeTarget?: number;
  endTimeValue?: Nullable<number>;
  endRelationField?: string;
}

export interface ItemOn {
  change?: string;
  blur?: string;
  click?: string;
  tabClick?: string;
}

export interface BasicGenItem {
  __config__: ItemCfg;
  on?: ItemOn;
  style?: {
    width: string;
  };
  __vModel__?: string;
}
// 单行输入
export interface InputGenItem extends BasicGenItem {
  placeholder: string;
  useScan: boolean;
  useMask: boolean;
  maskConfig: MaskConfig;
  clearable: boolean;
  addonBefore: string;
  addonAfter: string;
  prefixIcon: string;
  suffixIcon: string;
  maxlength: Nullable<number>;
  showCount: boolean;
  showPassword: boolean;
  readonly: boolean;
  disabled: boolean;
}
// 多行输入
export interface TextareaGenItem extends BasicGenItem {
  placeholder: string;
  autoSize: any;
  clearable: boolean;
  maxlength: Nullable<number>;
  showCount: boolean;
  readonly: boolean;
  disabled: boolean;
}
// 数字输入
export interface InputNumberGenItem extends BasicGenItem {
  placeholder: string;
  min?: number;
  max?: number;
  controls: boolean;
  addonBefore: string;
  addonAfter: string;
  thousands: boolean;
  isAmountChinese: boolean;
  step: number;
  precision?: number;
  disabled: boolean;
}
// 开关
export interface SwitchGenItem extends BasicGenItem {
  disabled: boolean;
  activeTxt: string;
  inactiveTxt: string;
  activeValue: number;
  inactiveValue: number;
}
// 单选框组
export interface RadioGenItem extends BasicGenItem {
  options: any[];
  props: SelectProps;
  direction: string;
  optionType: string;
  buttonStyle: string;
  size: string;
  disabled: boolean;
}
// 多选框组
export interface CheckboxGenItem extends BasicGenItem {
  options: any[];
  props: SelectProps;
  direction: string;
  disabled: boolean;
}
// 下拉框
export interface SelectGenItem extends BasicGenItem {
  options: any[];
  props: SelectProps;
  placeholder: string;
  clearable: boolean;
  disabled: boolean;
  filterable: boolean;
  multiple: boolean;
}
// 下拉树形
export interface TreeSelectGenItem extends SelectGenItem {
  props: TreeProps;
}
// 级联选择
export interface CascaderGenItem extends TreeSelectGenItem {}
// 日期选择
export interface DatePickerGenItem extends BasicGenItem {
  placeholder: string;
  format: DateFormatType;
  startTime: Nullable<number>;
  endTime: Nullable<number>;
  clearable: boolean;
  disabled: boolean;
}
// 时间选择
export interface TimePickerGenItem extends BasicGenItem {
  placeholder: string;
  format: TimeFormatType;
  startTime: Nullable<number>;
  endTime: Nullable<number>;
  clearable: boolean;
  disabled: boolean;
}
// 图片上传
export interface UploadImgGenItem extends BasicGenItem {
  disabled: boolean;
  fileSize: Nullable<number>;
  sizeUnit: SizeUnitType;
  buttonText: string;
  limit: Nullable<number>;
  pathType: string;
  sortRule: string[];
  timeFormat: string;
  folder: string;
  tipText: string;
}
// 文件上传
export interface UploadFileGenItem extends UploadImgGenItem {
  accept: string;
}
// 颜色选择
export interface ColorPickerGenItem extends BasicGenItem {
  showAlpha: boolean;
  colorFormat: string;
  disabled: boolean;
}
// 评分
export interface RateGenItem extends BasicGenItem {
  count: number;
  allowHalf: boolean;
  disabled: boolean;
}
// 滑块
export interface SliderGenItem extends BasicGenItem {
  min: number;
  max: number;
  step: number;
  disabled: boolean;
}
// 富文本
export interface EditorGenItem extends BasicGenItem {
  placeholder: string;
  disabled: boolean;
}
// 链接
export interface LinkGenItem extends BasicGenItem {
  content: string;
  href: string;
  target: string;
  textStyle: any;
}
// 按钮
export interface ButtonGenItem extends BasicGenItem {
  align: AlignType;
  buttonText: string;
  type: string;
  disabled: boolean;
}
// 文本
export interface TextGenItem extends BasicGenItem {
  content: string;
  textStyle: any;
}
// 提示
export interface AlertGenItem extends BasicGenItem {
  content: string;
  textStyle: any;
  title: string;
  type: string;
  showIcon: boolean;
  closable: boolean;
  description: string;
  closeText: string;
}
// 二维码
export interface QrcodeGenItem extends BasicGenItem {
  colorDark: string;
  colorLight: string;
  width: number;
  dataType: string;
  staticText: string;
  relationField: string;
}
// 条形码
export interface BarcodeGenItem extends BasicGenItem {
  format: string;
  lineColor: string;
  background: string;
  width: number;
  height: number;
  dataType: string;
  staticText: string;
  relationField: string;
}
// 计算公式
export interface CalculateGenItem extends BasicGenItem {
  expression: any[];
  isStorage: number;
  thousands: boolean;
  isAmountChinese: boolean;
  precision: Nullable<number>;
}

// 组织选择、部门选择、岗位选择、角色选择、分组选择
export interface OrgGenItem extends BasicGenItem {
  placeholder: string;
  selectType: string;
  ableIds: string[];
  multiple: boolean;
  clearable: boolean;
  filterable: boolean;
  disabled: boolean;
}
export interface UserSelectGenItem extends OrgGenItem {
  ableRelationIds: string[];
  relationField: string;
}
// 表格容器
export interface TableGenItem extends BasicGenItem {
  disabled: boolean;
  showSummary: boolean;
  summaryField: string[];
  defaultValue: any[];
  columnBtnsList: any[];
  footerBtnsList: any[];
  layoutType: string;
  defaultExpandAll: boolean;
}
// 弹窗选择
export interface PopupSelectGenItem extends BasicGenItem {
  placeholder: string;
  interfaceId: string;
  interfaceName: string;
  templateJson: any[];
  hasPage: boolean;
  pageSize: number;
  columnOptions: any[];
  propsValue: string;
  relationField: string;
  popupType: string;
  popupTitle: string;
  popupWidth: string;
  disabled: boolean;
  clearable: boolean;
  multiple: boolean;
  filterable: boolean;
}
// 关联表单
export interface RelationFormGenItem extends BasicGenItem {
  placeholder: string;
  modelId: string;
  templateJson: any[];
  hasPage: boolean;
  pageSize: number;
  columnOptions: any[];
  propsValue: string;
  relationField: string;
  popupType: string;
  popupTitle: string;
  popupWidth: string;
  disabled: boolean;
  clearable: boolean;
  multiple: boolean;
  filterable: boolean;
}
// 弹窗选择属性、关联表单属性
export interface AttrGenItem extends BasicGenItem {
  showField: string;
  relationField: string;
  isStorage: number;
}
// 下拉补全
export interface AutoCompleteGenItem extends BasicGenItem {
  interfaceId: string;
  interfaceName: string;
  templateJson: any[];
  total: number;
  relationField: string;
  disabled: boolean;
  clearable: boolean;
}
// 省市区域
export interface AreaSelectGenItem extends BasicGenItem {
  placeholder: string;
  disabled: boolean;
  clearable: boolean;
  filterable: boolean;
  multiple: boolean;
  level: number;
}
// 个人签名
export interface SignGenItem extends BasicGenItem {
  isInvoke: boolean;
  disabled: boolean;
}
// 定位
export interface LocationGenItem extends BasicGenItem {
  autoLocation: boolean;
  enableLocationScope: boolean;
  adjustmentScope: number;
  enableDesktopLocation: boolean;
  locationScope: any[];
  disabled: boolean;
  clearable: boolean;
}
// Iframe
export interface IframeGenItem extends BasicGenItem {
  href: string;
  height: Nullable<number>;
  borderType: string;
  borderColor: string;
  borderWidth: number;
}
// 所属组织
export interface CurrOrganizeGenItem extends BasicGenItem {
  type: string;
  readonly: boolean;
  showLevel: string;
  placeholder: string;
}
// 分割线
export interface DividerGenItem extends BasicGenItem {
  content: string;
  contentPosition: AlignType;
}
// 分组标题
export interface GroupTitleGenItem extends DividerGenItem {
  helpMessage: string;
}
// 折叠面板
export interface CollapseGenItem extends BasicGenItem {
  accordion: boolean;
  ghost: boolean;
  expandIconPosition: 'start' | 'end';
}
// 标签面板
export interface TabGenItem extends BasicGenItem {
  type: string;
  tabPosition: string;
}
// 步骤条
export interface StepsGenItem extends BasicGenItem {
  simple: boolean;
  processStatus: string;
}
// 栅格容器
export interface RowGenItem extends BasicGenItem {
  type: string;
  justify: string;
  align: string;
}
// 卡片容器
export interface CardGenItem extends BasicGenItem {
  header: string;
  shadow: string;
}
// 表格容器
export interface TableGridGenItem extends BasicGenItem {}

// export interface GenItem {
//   __config__: ItemCfg;
//   on?: ItemOn;
//   [prop: string]: any;
// }

export type GenItem =
  | InputGenItem
  | TextareaGenItem
  | InputNumberGenItem
  | SwitchGenItem
  | RadioGenItem
  | CheckboxGenItem
  | SelectGenItem
  | TreeSelectGenItem
  | CascaderGenItem
  | DatePickerGenItem
  | TimePickerGenItem
  | UploadImgGenItem
  | UploadFileGenItem
  | ColorPickerGenItem
  | RateGenItem
  | SliderGenItem
  | EditorGenItem
  | LinkGenItem
  | ButtonGenItem
  | TextGenItem
  | AlertGenItem
  | QrcodeGenItem
  | BarcodeGenItem
  | CalculateGenItem
  | OrgGenItem
  | UserSelectGenItem
  | TableGenItem
  | PopupSelectGenItem
  | RelationFormGenItem
  | AttrGenItem
  | AutoCompleteGenItem
  | AreaSelectGenItem
  | SignGenItem
  | LocationGenItem
  | IframeGenItem
  | CurrOrganizeGenItem
  | DividerGenItem
  | GroupTitleGenItem
  | CollapseGenItem
  | TabGenItem
  | StepsGenItem
  | RowGenItem
  | CardGenItem
  | TableGridGenItem;
