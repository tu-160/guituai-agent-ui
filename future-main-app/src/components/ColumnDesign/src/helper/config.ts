import {
  useInputList,
  useDateList,
  noVModelList,
  noColumnShowList,
  noSearchList,
  systemComponentsList,
  noGroupList,
} from '@/components/FormGenerator/src/helper/config';

const noUploadList = [
  ...noVModelList,
  'uploadFile',
  'uploadImg',
  'colorPicker',
  'popupTableSelect',
  'relationForm',
  'popupSelect',
  'calculate',
  'sign',
  'signature',
  'location',
];

const getSearchType = item => {
  const futureKey = item.__config__.futureKey;
  // 等于-1  模糊-2  范围-3
  const fuzzyList = [...useInputList];
  const RangeList = [...useDateList, 'timePicker', 'datePicker', 'inputNumber', 'calculate', 'rate', 'slider'];
  if (RangeList.includes(futureKey)) return 3;
  if (fuzzyList.includes(futureKey)) return 2;
  return 1;
};
const getSearchMultiple = futureKey => {
  const searchMultipleList = ['select', 'depSelect', 'roleSelect', 'userSelect', 'usersSelect', 'organizeSelect', 'posSelect', 'groupSelect'];
  return searchMultipleList.includes(futureKey);
};
const getDefaultValue = item => {
  if (item.__config__.isFromParam) return undefined;
  const futureKey = item.__config__.futureKey;
  const list = ['areaSelect', 'timePicker', 'datePicker', 'inputNumber', 'organizeSelect', 'calculate'];
  return list.includes(futureKey) || item.multiple ? [] : undefined;
};

const defaultBtnFunc = '({ data, index, refresh, onlineUtils }) => {\r\n   \r\n}';
const defaultBtnEnableFunc = '({ row, rowIndex, onlineUtils }) => {\r\n\r\n  return true \r\n}';
const defaultFuncsData = {
  afterOnload: '({ data, tableRef, onlineUtils }) => {\r\n   \r\n}',
  rowStyle: '({ row, rowIndex }) => {\r\n   \r\n}',
  cellStyle: '({ row, column, rowIndex, columnIndex }) => {\r\n   \r\n}',
};
const defaultBtnsList = [
  { show: true, value: 'add', icon: 'icon-ym icon-ym-btn-add', label: '新增', labelI18nCode: 'common.add2Text' },
  { show: false, value: 'download', icon: 'icon-ym icon-ym-btn-download', label: '导出', labelI18nCode: 'common.exportText' },
  { show: false, value: 'upload', icon: 'icon-ym icon-ym-btn-upload', label: '导入', labelI18nCode: 'common.importText' },
  { show: false, value: 'batchRemove', icon: 'icon-ym icon-ym-btn-clearn', label: '批量删除', labelI18nCode: 'common.batchDelText' },
  { show: false, value: 'batchPrint', icon: 'icon-ym icon-ym-report-icon-preview-printPreview', label: '批量打印', labelI18nCode: 'common.batchPrintText' },
];
const defaultAppBtnsList = defaultBtnsList.filter(o => o.value === 'add');
const defaultColumnBtnsList = [
  {
    show: true,
    value: 'edit',
    icon: 'icon-ym icon-ym-btn-edit',
    label: '编辑',
    labelI18nCode: 'common.editText',
    event: { enableFunc: defaultBtnEnableFunc },
  },
  {
    show: true,
    value: 'remove',
    icon: 'icon-ym icon-ym-btn-clearn',
    label: '删除',
    labelI18nCode: 'common.delText',
    event: { enableFunc: defaultBtnEnableFunc },
  },
  {
    show: true,
    value: 'detail',
    icon: 'icon-ym icon-ym-generator-menu',
    label: '详情',
    labelI18nCode: 'common.detailText',
    event: { enableFunc: defaultBtnEnableFunc },
  },
];

const defaultColumnData = {
  ruleList: { matchLogic: 'and', conditionList: [] }, // 过滤规则
  searchList: [], // 查询字段
  hasSuperQuery: true, // 高级查询
  showOverflow: true, // 溢出省略
  childTableStyle: 1, // 子表样式
  showSummary: false, // 合计配置
  summaryField: [], // 合计字段
  columnList: [], // 字段列表
  columnOptions: [], // 字段列表
  defaultColumnList: [], // 所有可选择字段列表
  type: 1, //列表类型
  defaultSortConfig: [], // 默认排序配置
  hasPage: true, // 列表分页
  pageSize: 20, // 分页条数
  hasTreeQuery: false, //左侧树查询
  treeTitle: '左侧标题', // 树形标题
  treeTitleI18nCode: '', // 树形标题多语言标识
  treeDataSource: 'dictionary', // 树形数据来源
  treeDictionary: '', //数据字典
  treeRelation: '', // 关联字段
  treeRelationFieldSelectType: 'all', // 关联字段选择类型
  treeRelationFieldAbleIds: [], // 关联字段范围
  treeSyncType: 0, //数据加载 同步、异步
  treeSyncInterfaceId: '',
  treeSyncInterfaceName: '',
  treeSyncTemplateJson: [],
  treePropsUrl: '', // 数据选择id
  treePropsName: '', // 数据选择名称
  treeTemplateJson: [],
  treePropsValue: 'id', // 主键字段
  treePropsChildren: 'children', // 子级字段
  treePropsLabel: 'fullName', // 显示字段
  groupField: '', // 分组字段
  parentField: '', // 父级字段
  printIds: [],
  useColumnPermission: false,
  useFormPermission: false,
  useBtnPermission: false,
  useDataPermission: false,
  customBtnsList: [],
  btnsList: defaultBtnsList, // 按钮
  columnBtnsList: defaultColumnBtnsList, // 列按钮
  funcs: {
    afterOnload: '({ data, tableRef, onlineUtils }) => {\r\n   \r\n}',
    rowStyle: '({ row, rowIndex }) => {\r\n   \r\n}',
    cellStyle: '({ row, column, rowIndex, columnIndex }) => {\r\n   \r\n}',
  },
  uploaderTemplateJson: {},
  complexHeaderList: [],
  tabConfig: { on: false, relationField: '', hasAllTab: true }, //标签面板
};
const defaultAppColumnData = {
  ruleListApp: { matchLogic: 'and', conditionList: [] }, // 过滤规则
  searchList: [], // 查询字段
  hasSuperQuery: false, // 高级查询
  showOverflow: true, // 溢出省略
  columnList: [], // 字段列表
  columnOptions: [],
  defaultColumnList: [], // 所有可选择字段列表
  type: 1, //列表类型
  defaultSortConfig: [], // 默认排序配置
  hasPage: true, // 列表分页
  pageSize: 20, // 分页条数
  useColumnPermission: false,
  useFormPermission: false,
  useBtnPermission: false,
  useDataPermission: false,
  customBtnsList: [],
  btnsList: defaultAppBtnsList, // 按钮
  columnBtnsList: defaultColumnBtnsList, // 列按钮
  funcs: {
    afterOnload: '({ data, tableRef, onlineUtils }) => {\r\n   \r\n}',
  },
  tabConfig: { on: false, relationField: '', hasAllTab: true }, //标签面板
};

export {
  noColumnShowList,
  noSearchList,
  systemComponentsList,
  noGroupList,
  noUploadList,
  getSearchType,
  getSearchMultiple,
  getDefaultValue,
  defaultBtnFunc,
  defaultBtnEnableFunc,
  defaultFuncsData,
  defaultColumnData,
  defaultAppColumnData,
  defaultBtnsList,
  defaultAppBtnsList,
  defaultColumnBtnsList,
};
