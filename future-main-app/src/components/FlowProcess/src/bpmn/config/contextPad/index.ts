import {
  bpmnStart,
  bpmnTask,
  bpmnEnd,
  bpmnSubFlow,
  bpmnInclusive,
  bpmnParallel,
  bpmnExclusive,
  typeStart,
  typeTask,
  typeEnd,
  typeLabel,
  typeSubFlow,
  typeGateway,
} from '../variableName';

const START = {
  name: 'append.future-start',
  group: 'model',
  className: 'context-pad-start icon-ym icon-ym-flow-node-start',
  icon: 'icon-ym icon-ym-flow-node-start',
  title: '流程发起',
  ymName: 'future-startEvent',
  type: bpmnStart,
  elementName: typeStart,
  wnType: typeStart,
};

const APPROVER = {
  name: 'append.future-task',
  group: 'model',
  className: 'context-pad-approver icon-ym icon-ym-flow-node-approve',
  title: '审批节点',
  type: bpmnTask,
  elementName: typeTask,
  wnType: typeTask,
};

const SUBFLOW = {
  name: 'append.future-subFlow',
  group: 'model',
  className: 'context-pad-sub-flow icon-ym icon-ym-flow-node-subFlow',
  title: '子流程',
  type: bpmnSubFlow,
  elementName: typeSubFlow,
  wnType: typeSubFlow,
};

const END = {
  name: 'append.future-end',
  group: 'model',
  className: 'context-pad-end icon-ym icon-ym-flow-node-end',
  title: '结束',
  type: bpmnEnd,
  elementName: typeEnd,
  wnType: typeEnd,
};

const CONNECT = {
  name: 'append.future-connect',
  group: 'connect',
  className: 'context-pad-connect icon-ym icon-ym-flow-line',
  title: '连线',
  type: 'connect',
  wnType: typeLabel,
};

const DELETE = {
  name: 'delete',
  group: 'edit',
  className: 'context-pad-delete icon-ym icon-ym-app-delete',
  title: '删除',
  ymName: 'future-delete',
  type: 'delete',
};
const INCLUSIVE = {
  name: 'append.future-inclusive',
  group: 'model',
  className: 'context-pad-condition icon-ym icon-ym-flow-node-condition',
  title: '条件分支',
  type: bpmnInclusive,
  elementName: typeGateway,
  wnType: typeGateway,
};
const PARALLEL = {
  name: 'append.future-parallel',
  group: 'model',
  className: 'context-pad-interflow icon-ym icon-ym-flow-node-interflow',
  title: '并行分支',
  type: bpmnParallel,
  elementName: typeGateway,
  wnType: typeGateway,
};
const EXCLUSIVE = {
  name: 'append.future-exclusive',
  group: 'model',
  className: 'context-pad-branch icon-ym icon-ym-flow-node-branch',
  title: '选择分支',
  type: bpmnExclusive,
  elementName: typeGateway,
  wnType: typeGateway,
};
interface futureConfigBpmnContextPadProp {
  start: any;
  approver: any;
  subFlow: any;
  end: any;
  connect: any;
  del: any;
  inclusive: any;
  patallel: any;
  exvlusive: any;
}

const futureConfigBpmnContextPad: futureConfigBpmnContextPadProp = {
  start: START,
  approver: APPROVER,
  subFlow: SUBFLOW,
  end: END,
  connect: CONNECT,
  del: DELETE,
  inclusive: INCLUSIVE,
  patallel: PARALLEL,
  exvlusive: EXCLUSIVE,
};

export { futureConfigBpmnContextPad, futureConfigBpmnContextPadProp };
