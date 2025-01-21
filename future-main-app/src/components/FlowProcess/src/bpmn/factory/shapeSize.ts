import { isExpanded } from '../utils/DiUtil';
import { getBusinessObject, getDi, is } from '../utils/modelUtil';
import { typeConfig } from '../config';
import { bpmnTask, bpmnStart, bpmnEnd, bpmnGateway, bpmnSubFlow } from '../config/variableName';

const YmDefaultSize = (element: any, di: any) => {
  var bo = getBusinessObject(element);
  di = di || getDi(element);

  if (is(bo, 'bpmn:SubProcess')) {
    return isExpanded(bo, di) ? { width: 350, height: 200 } : { width: 100, height: 80 };
  }

  if (is(bo, bpmnTask)) {
    try {
      let { renderer } = typeConfig[bpmnTask];
      return { width: renderer.attr.width, height: renderer.attr.height };
    } catch (err: any) {
      return { width: 50, height: 50 };
    }
  }

  if (is(bo, bpmnGateway)) {
    try {
      let { renderer } = typeConfig[bpmnGateway];
      return { width: renderer.attr.width, height: renderer.attr.height };
    } catch (err: any) {
      return { width: 0, height: 0 };
    }
  }
  if (is(bo, bpmnStart)) {
    try {
      let { renderer } = typeConfig[bpmnStart];
      return { width: renderer.attr.width, height: renderer.attr.height };
    } catch (err: any) {
      return { width: 50, height: 50 };
    }
  }

  if (is(bo, bpmnEnd)) {
    try {
      let { renderer } = typeConfig[bpmnEnd];
      return { width: renderer.attr.width, height: renderer.attr.height };
    } catch (err: any) {
      return { width: 50, height: 50 };
    }
  }

  if (is(bo, bpmnSubFlow)) {
    try {
      let { renderer } = typeConfig[bpmnEnd];
      return { width: renderer.attr.width, height: renderer.attr.height };
    } catch (err: any) {
      return { width: 50, height: 50 };
    }
  }

  if (is(bo, 'bpmn:Participant')) {
    if (isExpanded(bo, di)) {
      return { width: 600, height: 250 };
    } else {
      return { width: 400, height: 60 };
    }
  }

  if (is(bo, 'bpmn:Lane')) {
    return { width: 400, height: 100 };
  }

  if (is(bo, 'bpmn:DataObjectReference')) {
    return { width: 36, height: 50 };
  }

  if (is(bo, 'bpmn:DataStoreReference')) {
    return { width: 50, height: 50 };
  }

  if (is(bo, 'bpmn:TextAnnotation')) {
    return { width: 100, height: 30 };
  }

  if (is(bo, 'bpmn:Group')) {
    return { width: 300, height: 300 };
  }

  return { width: 100, height: 80 };
};

export default YmDefaultSize;
