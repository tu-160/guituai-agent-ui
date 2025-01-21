import { bpmnTask, typeTask } from '../../variableName';

const futureApproverConfig: any = {
  name: typeTask,
  shapeType: bpmnTask,
  element: {
    label: 'Task',
    actionName: 'replace-with-task',
    className: 'bpmn-icon-task',
    target: {
      type: bpmnTask,
    },
  },
  palette: {
    name: 'create.future-task',
    group: 'model',
    className: 'icon-future-create icon-future-task',
    title: '创建一个类型为future-task的任务节点1',
  },
  renderer: {
    icon: 'icon-ym icon-ym-flow-node-approve',
    iconColor: '#1DACEB',
    titleColor: 'linear-gradient(90deg, #C0EDF8 0%, #B4DEF2 100%)',
    background: '#ffffff',
    attr: { x: 0, y: 0, rx: 8, width: 200, height: 88 },
    rendererName: '审批节点',
    bodyDefaultText: '请设置审批人',
  },
  contextPad: {
    default: true, // contextPad 中的元素使用默认 否则遵循自定义
  },
  properties: {},
};

export { futureApproverConfig };
