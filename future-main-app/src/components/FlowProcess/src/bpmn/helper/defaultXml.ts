const selfDefaultXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="sample-diagram" targetNamespace="http://www.flowable.org/processdef" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
  <bpmn2:process id="Process_1" name="" isExecutable="true">
    <bpmn2:userTask id="Activity_1e9s882" businessObject="[object Object]" elementBodyName="[object Object]" />
    <bpmn2:startEvent id="Event_0oz4pwh" >
      <bpmn2:outgoing>Flow_1iadlmn</bpmn2:outgoing>
    </bpmn2:startEvent>
    <bpmn2:userTask id="Activity_1qf73gq">
      <bpmn2:incoming>Flow_1iadlmn</bpmn2:incoming>
      <bpmn2:outgoing>Flow_1kz1x8a</bpmn2:outgoing>
    </bpmn2:userTask>
    <bpmn2:sequenceFlow id="Flow_1iadlmn" sourceRef="Event_0oz4pwh" targetRef="Activity_1qf73gq" />
    <bpmn2:endEvent id="Event_0zlhfee">
      <bpmn2:incoming>Flow_1kz1x8a</bpmn2:incoming>
    </bpmn2:endEvent>
    <bpmn2:sequenceFlow id="Flow_1kz1x8a" sourceRef="Activity_1qf73gq" targetRef="Event_0zlhfee" />
  </bpmn2:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="Event_0oz4pwh_di" bpmnElement="Event_0oz4pwh">
        <dc:Bounds x="675" y="75" width="90" height="32" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1qf73gq_di" bpmnElement="Activity_1qf73gq">
        <dc:Bounds x="620" y="227" width="200" height="88" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_0zlhfee_di" bpmnElement="Event_0zlhfee">
        <dc:Bounds x="675" y="435" width="90" height="32" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1iadlmn_di" bpmnElement="Flow_1iadlmn">
        <di:waypoint x="720" y="107" />
        <di:waypoint x="720" y="227" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="706" y="181" width="28" height="28" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1kz1x8a_di" bpmnElement="Flow_1kz1x8a">
        <di:waypoint x="720" y="315" />
        <di:waypoint x="720" y="435" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="706" y="361" width="28" height="28" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn2:definitions>`;
const defaultXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="sample-diagram" targetNamespace="http://www.flowable.org/processdef" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
  <bpmn2:process id="Process_1"  isExecutable="true">
    <bpmn2:startEvent id="Event_04q7xii"  />
  </bpmn2:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="Event_04q7xii_di" bpmnElement="Event_04q7xii" >
        <dc:Bounds x="145" y="304" width="90" height="32" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn2:definitions>`;

export { defaultXml, selfDefaultXml };
