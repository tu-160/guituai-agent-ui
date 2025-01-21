import { futureConfigBpmnContextPad } from '../../../contextPad';
import { bpmnExclusive } from '../../../variableName';
const { approver } = futureConfigBpmnContextPad;
const futureExclusiveConfig: any = {
  name: bpmnExclusive,
  shapeType: bpmnExclusive,
  element: {
    label: 'Timer',
    actionName: 'replace-with-timer',
    className: 'bpmn-icon-timer',
    target: {
      type: bpmnExclusive,
    },
  },
  palette: {
    name: 'create.yinmai-timer',
    group: 'model',
    className: 'icon-yinmai-create icon-yinmai-timer',
  },
  renderer: {
    icon: 'icon-ym icon-ym-flow-node-approve',
    iconColor: '#1DACEB',
    titleColor: '#C0EDF8',
    background: '#ffffff',
    attr: { x: 0, y: 0, width: 90, rx: 16, height: 32 },
    rendererName: '选择分支',
    bodyDefaultText: '请设置审批人',
  },
  contextPad: {
    default: false,
    customization: { approver }, // 自定义 只有default = false 开启
  },
  properties: {},
};

export { futureExclusiveConfig };
