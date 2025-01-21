import { futureApproverConfig } from './element/approver';
import { futureStartConfig } from './element/start';
import { futureEndConfig } from './element/end';
import { futureSubFlowConfig } from './element/subFlow';
import { futureTimerConfig } from './element/timer';
import { futureLabelConfig } from './element/label';
import { futureExclusiveConfig } from './element/gateway/exclusive';
import { futureInclusiveConfig } from './element/gateway/inclusive';
import { futureParallelConfig } from './element/gateway/parallel';
import {
  bpmnTask,
  bpmnStart,
  bpmnEnd,
  bpmnTimer,
  bpmnSubFlow,
  bpmnLabel,
  bpmnInclusive,
  bpmnParallel,
  bpmnExclusive,
  typeStart,
  typeEnd,
  typeSubFlow,
  typeTimer,
  typeLabel,
  typeGateway,
  typeTask,
  bpmnSequenceFlow,
} from './variableName';
import { futureSequenceFlow } from './element/sequenceFlow';

const hasLabelElements: any = ['bpmn:StartEvent', 'bpmn:EndEvent', 'bpmn:InclusiveGateway']; // 一开始就有label标签的元素类型
const BpmnBusinessObjectKey = {
  id: 'wnId',
};

const typeConfig: any = {
  [bpmnTask]: futureApproverConfig,
  [bpmnStart]: futureStartConfig,
  [bpmnEnd]: futureEndConfig,
  [bpmnSubFlow]: futureSubFlowConfig,
  [bpmnTimer]: futureTimerConfig,
  [bpmnLabel]: futureLabelConfig,
  [bpmnInclusive]: futureInclusiveConfig,
  [bpmnParallel]: futureParallelConfig,
  [bpmnExclusive]: futureExclusiveConfig,
  [bpmnSequenceFlow]: futureSequenceFlow,
};

// 默认wnType值
const conversionWnType: any = {
  [bpmnStart]: typeStart,
  [bpmnEnd]: typeEnd,
  [bpmnTask]: typeTask,
  [bpmnSubFlow]: typeSubFlow,
  [bpmnTimer]: typeTimer,
  [bpmnLabel]: typeLabel,
  [bpmnInclusive]: typeGateway,
  [bpmnParallel]: typeGateway,
  [bpmnExclusive]: typeGateway,
};

export { typeConfig, BpmnBusinessObjectKey, hasLabelElements, conversionWnType };
