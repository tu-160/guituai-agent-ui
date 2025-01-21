import Modeler from 'bpmn-js/lib/Modeler';
import futurePaletteProvider from '../palette';
import futureRenderer from '../renderer';
import futureElementFactory from '../factory';
import futureOutline from '../outline';
import futureBusinessData from '../business';
import futureGridSnappingAutoPlaceBehavior from '../gridSnapping';
import futureAlignElementsContextPadProvider from '../alignElements';
import futureContextPad from '../contextPad';
import futureContextPadProvider from '../contextPad/provider';
import futureCustomBpmnRules from '../rule';
import futureCommandStack from '../commandStack';
import futureCustomBpmnCopyPaste from '../copyPaste';
import GridSnappingLayoutConnectionBehavior from '../gridSnapping/connect';
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
      'bpmnCopyPaste',
    ],
    paletteProvider: ['type', futurePaletteProvider], // 左侧的元素 目前不用该方法
    bpmnRenderer: ['type', futureRenderer, { options }], // 画布渲染
    elementFactory: ['type', futureElementFactory], // 元素工厂
    futureData: ['type', futureBusinessData], // 用于放置业务数据
    gridSnappingAutoPlaceBehavior: ['type', futureGridSnappingAutoPlaceBehavior], // 自动生成元素位置 在点击coontext-pad时计算元素生成位置
    alignElementsContextPadProvider: ['type', futureAlignElementsContextPadProvider], // 元素的排序等
    outlineProvider: ['type', futureOutline], // 元素的外边框(用于修改边框颜色，注：线条颜色有svg获取标签再去修改颜色及箭头）
    contextPad: ['type', futureContextPad], // 点击元素后的元素右侧弹窗框（显示开始节点 结束节点等）
    contextPadProvider: ['type', futureContextPadProvider], // context-pad 属性
    bpmnRules: ['type', futureCustomBpmnRules], // 自定义规则
    commandStack: ['type', futureCommandStack], // 自定义CommandStack
    gridSnappingLayoutConnectionBehavior: ['type', GridSnappingLayoutConnectionBehavior], // 修改连线的排序
    bpmnCopyPaste: ['type', futureCustomBpmnCopyPaste], // 复制元素
  },
];

class bpmnModeler extends Modeler {
  constructor(options: any) {
    flowInfo = options.flowInfo;
    super(options);
  }
}

bpmnModeler.prototype['_modules'] = [].concat(bpmnModeler.prototype['_modules'], modeler(flowInfo));

export default bpmnModeler;
