import { bpmnTimer, typeTimer } from '../../variableName';
const futureTimerConfig: any = {
  name: typeTimer,
  shapeType: bpmnTimer,
  element: {
    label: 'Timer',
    actionName: 'replace-with-timer',
    className: 'bpmn-icon-timer',
    target: {
      type: bpmnTimer,
    },
  },
  palette: {
    name: 'create.yinmai-timer',
    group: 'model',
    className: 'icon-yinmai-create icon-yinmai-timer',
    title: '创建一个类型为yinmai-task的定时器',
  },
  renderer: {
    attr: { x: 0, y: 0, width: 200, height: 38 },
    rendererName: '定时器',
    fillColor: 'rgb(240,245,255)',
  },
  contextPad: {
    default: true, // contextPad 中的元素使用默认 否则遵循自定义
    customization: {}, // 自定义 只有default = false 开启
  },
  properties: {},
};

export { futureTimerConfig };
