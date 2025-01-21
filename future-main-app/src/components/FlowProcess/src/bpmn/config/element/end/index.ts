import { futureConfigBpmnContextPad } from '../../contextPad';
import { bpmnEnd, typeEnd } from '../../variableName';

const { del } = futureConfigBpmnContextPad;

const futureEndConfig: any = {
  name: typeEnd,
  shapeType: bpmnEnd,
  // element: {
  //   label: 'Task',
  //   actionName: 'replace-with-task',
  //   className: 'bpmn-icon-task',
  //   target: {
  //     type: 'bpmn:UserTask',
  //   },
  // },
  palette: {
    name: 'create.future-task',
    group: 'model',
    className: 'icon-future-create icon-future-task',
    title: '创建一个类型为future-task的任务节点1',
  },
  renderer: {
    icon: 'icon-ym icon-ym-flow-node-end',
    iconColor: '#8B8BA0',
    titleColor: '#EDF3F8',
    attr: { x: 0, y: 0, width: 90, rx: 16, height: 32 },
    rendererName: '流程结束',
  },
  contextPad: {
    default: false, // contextPad 中的元素使用默认 否则遵循自定义
    customization: { del }, // 自定义 只有default = false 开启
  },
  properties: {},
};

export { futureEndConfig };
