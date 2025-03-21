// bpmn-js/lib/draw/BpmnRenderer.js -> handlers
// BPMN2.0文件节点类型
export default {
  Event: 'bpmn:Event',
  StartEvent: 'bpmn:StartEvent',
  MessageEventDefinition: 'bpmn:MessageEventDefinition',
  TimerEventDefinition: 'bpmn:TimerEventDefinition',
  EscalationEventDefinition: 'bpmn:EscalationEventDefinition',
  ConditionalEventDefinition: 'bpmn:ConditionalEventDefinition',
  LinkEventDefinition: 'bpmn:LinkEventDefinition',
  ErrorEventDefinition: 'bpmn:ErrorEventDefinition',
  CancelEventDefinition: 'bpmn:CancelEventDefinition',
  CompensateEventDefinition: 'bpmn:CompensateEventDefinition',
  SignalEventDefinition: 'bpmn:SignalEventDefinition',
  MultipleEventDefinition: 'bpmn:MultipleEventDefinition',
  ParallelMultipleEventDefinition: 'bpmn:ParallelMultipleEventDefinition',
  EndEvent: 'bpmn:EndEvent',
  TerminateEventDefinition: 'bpmn:TerminateEventDefinition',
  IntermediateEvent: 'bpmn:IntermediateEvent',
  IntermediateCatchEvent: 'bpmn:IntermediateCatchEvent',
  IntermediateThrowEvent: 'bpmn:IntermediateThrowEvent',
  Activity: 'bpmn:Activity',
  Task: 'bpmn:Task',
  ServiceTask: 'bpmn:ServiceTask',
  UserTask: 'bpmn:UserTask',
  ManualTask: 'bpmn:ManualTask',
  SendTask: 'bpmn:SendTask',
  ReceiveTask: 'bpmn:ReceiveTask',
  ScriptTask: 'bpmn:ScriptTask',
  BusinessRuleTask: 'bpmn:BusinessRuleTask',
  SubProcess: 'bpmn:SubProcess',
  AdHocSubProcess: 'bpmn:AdHocSubProcess',
  Transaction: 'bpmn:Transaction',
  CallActivity: 'bpmn:CallActivity',
  Participant: 'bpmn:Participant',
  Lane: 'bpmn:Lane',
  InclusiveGateway: 'bpmn:InclusiveGateway',
  ExclusiveGateway: 'bpmn:ExclusiveGateway',
  ComplexGateway: 'bpmn:ComplexGateway',
  ParallelGateway: 'bpmn:ParallelGateway',
  EventBasedGateway: 'bpmn:EventBasedGateway',
  Gateway: 'bpmn:Gateway',
  SequenceFlow: 'bpmn:SequenceFlow',
  Association: 'bpmn:Association',
  DataInputAssociation: 'bpmn:DataInputAssociation',
  DataOutputAssociation: 'bpmn:DataOutputAssociation',
  MessageFlow: 'bpmn:MessageFlow',
  DataObject: 'bpmn:DataObject',
  DataObjectReference: 'bpmn:DataObjectReference',
  DataInput: 'bpmn:DataInput',
  DataOutput: 'bpmn:DataOutput',
  DataStoreReference: 'bpmn:DataStoreReference',
  BoundaryEvent: 'bpmn:BoundaryEvent',
  Group: 'bpmn:Group',
  label: 'label',
  TextAnnotation: 'bpmn:TextAnnotation',
  ParticipantMultiplicityMarker: 'ParticipantMultiplicityMarker',
  SubProcessMarker: 'SubProcessMarker',
  ParallelMarker: 'ParallelMarker',
  SequentialMarker: 'SequentialMarker',
  CompensationMarker: 'CompensationMarker',
  LoopMarker: 'LoopMarker',
  AdhocMarker: 'AdhocMarker',
};
