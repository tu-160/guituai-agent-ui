import { bpmnSubFlow, typeSubFlow } from '../../variableName';

const futureSubFlowConfig: any = {
  name: typeSubFlow,
  shapeType: bpmnSubFlow,
  element: {
    label: 'subProcess',
    actionName: 'replace-with-task',
    className: 'bpmn-icon-task',
    target: {
      type: bpmnSubFlow,
    },
  },
  palette: {
    name: 'create.future-task',
    group: 'model',
    className: 'icon-future-create icon-future-task',
    title: '创建一个类型为future-task的任务节点1',
  },
  renderer: {
    icon: 'icon-ym icon-ym-flow-node-subFlow',
    iconColor: '#F0962D',
    titleColor: 'linear-gradient(90deg, #FFDFC1 0%, #FDDAA7 100%)',
    background: '#ffffff',
    attr: { x: 0, y: 0, width: 200, height: 88, background: '#e6f4ff' },
    rendererName: '子流程',
    bodyDefaultText: '请设置发起人',
  },
  contextPad: {
    default: false, // contextPad 中的元素使用默认 否则遵循自定义
  },
  properties: {},
};

export { futureSubFlowConfig };
