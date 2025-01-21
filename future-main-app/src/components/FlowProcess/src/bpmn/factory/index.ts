import ElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory';
import YmDefaultSize from './shapeSize';
import { bpmnInclusive, typeConfluence } from '../config/variableName';

class YmElementFactory extends ElementFactory {
  constructor(bpmnFactory: any, moddle: any, translate: any) {
    super(bpmnFactory, moddle, translate);
  }

  create(elementType: any, attrs: any): any {
    if (attrs.type === bpmnInclusive + '_confluence') {
      attrs.type = bpmnInclusive;
      attrs.businessObject.wnType = typeConfluence;
    }
    return super.create(elementType, attrs);
  }

  createBpmnElement(elementType: any, attrs: any) {
    // @ts-ignore
    return super.createBpmnElement(elementType, attrs);
  }

  getDefaultSize(element: any, di: any) {
    return YmDefaultSize(element, di);
  }

  createParticipantShape(attrs: any) {
    return super.createParticipantShape(attrs);
  }
}

YmElementFactory.$inject = ['bpmnFactory', 'moddle', 'translate'];

export default YmElementFactory;
