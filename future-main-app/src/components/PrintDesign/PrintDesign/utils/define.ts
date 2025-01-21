import { templateJson1, templateJson2, templateJson3, templateJson4 } from '../template';

export const subComponents = [
  {
    id: 'hline',
    label: '横线',
    icon: 'icon-ym icon-ym-hLine',
  },
  {
    id: 'vline',
    label: '竖线',
    icon: 'icon-ym icon-ym-vLine',
  },
  {
    id: 'rect',
    label: '矩形',
    icon: 'icon-ym icon-ym-rect',
  },
  {
    id: 'oval',
    label: '圆形',
    icon: 'icon-ym icon-ym-oval',
  },
];
export const basicComponents = [
  {
    id: 'text',
    label: '文本',
    icon: 'icon-ym icon-ym-generator-input',
  },
  {
    id: 'longText',
    label: '长文本',
    icon: 'icon-ym icon-ym-generator-textarea',
  },
  {
    id: 'qrcode',
    label: '二维码',
    icon: 'icon-ym icon-ym-generator-qrcode',
  },
  {
    id: 'barcode',
    label: '条形码',
    icon: 'icon-ym icon-ym-generator-barcode',
  },
  {
    id: 'image',
    label: '图片',
    icon: 'icon-ym icon-ym-portal-image',
  },
  {
    id: 'images',
    label: '图片组',
    icon: 'icon-ym icon-ym-portal-image',
  },
  {
    id: 'table',
    label: '表格',
    icon: 'icon-ym icon-ym-generator-tableGrid',
  },
];
export const systemComponents = [
  {
    id: 'printTime',
    label: '打印时间',
    icon: 'icon-ym icon-ym-combination',
  },
  {
    id: 'printer',
    label: '打印人员',
    icon: 'icon-ym icon-ym-combination',
  },
  {
    id: 'flowRecord',
    label: '审批记录',
    icon: 'icon-ym icon-ym-combination',
  },
];
export const seniorComponents: any[] = [];
export const businessComponents: any[] = [
  {
    id: 'business1',
    label: '入职申请',
    icon: 'icon-ym icon-ym-combination',
    templateJson: templateJson1,
  },
  {
    id: 'business2',
    label: '培训记录',
    icon: 'icon-ym icon-ym-combination',
    templateJson: templateJson2,
  },
  {
    id: 'business3',
    label: '劳动合同',
    icon: 'icon-ym icon-ym-combination',
    templateJson: templateJson3,
  },
  {
    id: 'business4',
    label: '工作证明',
    icon: 'icon-ym icon-ym-combination',
    templateJson: templateJson4,
  },
];
export const rankType = [
  {
    type: 'left',
    title: '左对齐',
    preIcon: 'icon-ym icon-ym-flow-align-left',
  },
  {
    type: 'vertical',
    title: '居中对齐',
    preIcon: 'icon-ym icon-ym-flow-align-center',
  },
  {
    type: 'right',
    title: '右对齐',
    preIcon: 'icon-ym icon-ym-flow-align-right',
  },
  {
    type: 'top',
    title: '顶部对齐',
    preIcon: 'icon-ym icon-ym-flow-align-top',
  },
  {
    type: 'horizontal',
    title: '垂直居中',
    preIcon: 'icon-ym icon-ym-flow-align-middle',
  },
  {
    type: 'bottom',
    title: '底部对齐',
    preIcon: 'icon-ym icon-ym-flow-align-bottom',
  },
  {
    type: 'distributeHor',
    title: '横向分散',
    preIcon: 'icon-ym icon-ym-beautify-vertical',
  },
  {
    type: 'distributeVer',
    title: '纵向分散',
    preIcon: 'icon-ym icon-ym-beautify-horizontal',
  },
];

export const paperTypes = [
  {
    type: 'A3',
    width: 420,
    height: 297,
  },
  {
    type: 'A4',
    width: 210,
    height: 297,
  },
  {
    type: 'A5',
    width: 210,
    height: 148,
  },
  {
    type: 'B3',
    width: 500,
    height: 353,
  },
  {
    type: 'B4',
    width: 250,
    height: 352,
  },
  {
    type: 'B5',
    width: 250,
    height: 176,
  },
];
