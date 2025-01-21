import { bpmnTask, bpmnEnd, bpmnSubFlow, typeSubFlow, typeTask, typeEnd } from '../bpmn/config/variableName';
// 流程节点
const flowNodeList = [
  {
    fullName: '审批节点',
    icon: 'icon-ym icon-ym-flow-node-approve',
    type: bpmnTask,
    option: {
      wnType: typeTask,
      wnName: '审批节点',
    },
  },
  {
    fullName: '子流程',
    icon: 'icon-ym icon-ym-flow-node-subFlow',
    type: bpmnSubFlow,
    option: {
      wnType: typeSubFlow,
      wnName: '子流程',
    },
  },
  {
    fullName: '流程结束',
    icon: 'icon-ym icon-ym-flow-node-end',
    type: bpmnEnd,
    option: {
      wnType: typeEnd,
      wnName: '流程结束',
    },
  },
];

export { flowNodeList };
