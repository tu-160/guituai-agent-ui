import { is, getBusinessObject, getDi } from './modelUtil';

export function isExpanded(element: any, di: any) {
  if (is(element, 'bpmn:CallActivity')) {
    return false;
  }

  if (is(element, 'bpmn:SubProcess')) {
    di = di || getDi(element);

    if (di && is(di, 'bpmndi:BPMNPlane')) {
      return true;
    }

    return di && !!di.isExpanded;
  }

  if (is(element, 'bpmn:Participant')) {
    return !!getBusinessObject(element).processRef;
  }

  return true;
}

export function isInterrupting(element: any) {
  return element && getBusinessObject(element).isInterrupting !== false;
}

export function isEventSubProcess(element: any) {
  return element && !!getBusinessObject(element).triggeredByEvent;
}

export function hasEventDefinition(element: any, eventType: any) {
  var bo = getBusinessObject(element),
    hasEventDefinition = false;

  if (bo.eventDefinitions) {
    bo.eventDefinitions.forEach(event => {
      if (is(event, eventType)) {
        hasEventDefinition = true;
      }
    });
  }

  return hasEventDefinition;
}

export function hasErrorEventDefinition(element: any) {
  return hasEventDefinition(element, 'bpmn:ErrorEventDefinition');
}

export function hasEscalationEventDefinition(element: any) {
  return hasEventDefinition(element, 'bpmn:EscalationEventDefinition');
}

export function hasCompensateEventDefinition(element: any) {
  return hasEventDefinition(element, 'bpmn:CompensateEventDefinition');
}
