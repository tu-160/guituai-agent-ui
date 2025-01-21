import Modeler from 'bpmn-js/lib/Modeler';
import YmPaletteProvider from '../..//palette';
import YmRenderer from '../renderer';
import YmElementFactory from '../../factory';
import YmOutline from '../../outline';
import YmBusinessData from '../../business';
import YmGridSnappingAutoPlaceBehavior from '../gridSnapping/autoPlacebehavior';
import YmContextPad from '../../selfDeveloped/contextPad';
import YmContextPadProvider from '../../selfDeveloped/contextPad/provider';
import YmCustomBpmnRules from '../../rule';
import CustomLabelEditingProvider from '../../labelEditing/labelEditingProvider';
import GridSnappingLayoutConnectionBehavior from '../gridSnapping/connect';
import BpmnKeyboardBindings from '../keyboard/BpmnKeyboardBindings';
let flowInfo: any;
const modeler: any = options => [
  {
    __init__: [
      'paletteProvider',
      'bpmnRenderer',
      'contextPadProvider',
      'replaceMenuProvider',
      'elementFactory',
      'futureData',
      'gridSnappingAutoPlaceBehavior',
      'alignElementsContextPadProvider',
      'alignElementsMenuProvider',
      'bpmnAlignElements',
      'outlineProvider',
      'contextPad',
      'bpmnRules',
      'keyboardBindings',
    ],
    paletteProvider: ['type', YmPaletteProvider], // 左侧的元素
    bpmnRenderer: ['type', YmRenderer, { options }], // 画布渲染
    elementFactory: ['type', YmElementFactory], // 元素工厂
    futureData: ['type', YmBusinessData], // 用于放置业务数据
    gridSnappingAutoPlaceBehavior: ['type', YmGridSnappingAutoPlaceBehavior], // 自动生成元素位置 在点击coontext-pad时计算元素生成位置
    outlineProvider: ['type', YmOutline], // 元素的外边框(用于修改边框颜色，注：线条颜色有svg获取标签再去修改颜色及箭头）
    contextPad: ['type', YmContextPad], // 点击元素后的元素右侧弹窗框（显示开始节点 结束节点等）
    contextPadProvider: ['type', YmContextPadProvider], // context-pad 属性
    bpmnRules: ['type', YmCustomBpmnRules], // 自定义规则
    labelEditingProvider: ['type', CustomLabelEditingProvider], // 编辑
    gridSnappingLayoutConnectionBehavior: ['type', GridSnappingLayoutConnectionBehavior], // 修改连线的排序
    keyboardBindings: ['type', BpmnKeyboardBindings], // 快捷键
  },
];

class futureModeler extends Modeler {
  constructor(options: any) {
    flowInfo = options.flowInfo;
    super(options);
  }
}

futureModeler.prototype['_modules'] = [].concat(futureModeler.prototype['_modules'], modeler(flowInfo));

export default futureModeler;
