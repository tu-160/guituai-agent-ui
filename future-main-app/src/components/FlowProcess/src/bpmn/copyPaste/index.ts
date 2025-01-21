import { getBusinessObject, getDi, is } from 'bpmn-js/lib/util/ModelUtil';
import { forEach, isArray, isUndefined, omit, reduce } from 'min-dash';
import { isLabel } from 'bpmn-js/lib/util/LabelUtil';
function copyProperties(source, target, properties) {
  if (!isArray(properties)) properties = [properties];
  forEach(properties, function (property: any) {
    if (!isUndefined(source[property])) target[property] = source[property];
  });
}
let LOW_PRIORITY = 750;
/**
 * BPMN-specific copy & paste.
 *
 * @param {BpmnFactory} bpmnFactory
 * @param {EventBus} eventBus
 * @param {ModdleCopy} moddleCopy
 */
export default function BpmnCopyPaste(bpmnFactory, eventBus, moddleCopy) {
  function copy(bo: any, clone?: any) {
    let targetBo = bpmnFactory.create(bo.$type);
    return moddleCopy.copyElement(bo, targetBo, null, clone);
  }
  eventBus.on('copyPaste.copyElement', LOW_PRIORITY, function (context) {
    let descriptor = context.descriptor,
      element = context.element,
      businessObject = getBusinessObject(element);
    if (isLabel(element)) return descriptor;
    let businessObjectCopy = (descriptor.businessObject = copy(businessObject, true));
    let diCopy = (descriptor.di = copy(getDi(element), true));
    diCopy.bpmnElement = businessObjectCopy;
    copyProperties(businessObjectCopy, descriptor, 'name');
    copyProperties(diCopy, descriptor, 'isExpanded');
    descriptor.wnType = element?.wnType || null;
    if (businessObject.default) {
      descriptor.default = businessObject.default.id;
    }
  });
  let referencesKey = '-bpmn-js-refs';
  function getReferences(cache) {
    return (cache[referencesKey] = cache[referencesKey] || {});
  }
  function setReferences(cache: any, references: any) {
    cache[referencesKey] = references;
  }
  function resolveReferences(descriptor, cache, references) {
    let businessObject = getBusinessObject(descriptor);
    if (descriptor.default) {
      references[descriptor.default] = {
        element: businessObject,
        property: 'default',
      };
    }
    if (descriptor.host) getBusinessObject(descriptor).attachedToRef = getBusinessObject(cache[descriptor.host]);
    return omit(
      references,
      reduce(
        references,
        function (array: any, reference: any, key: any) {
          let element = reference.element,
            property = reference.property;
          if (key === descriptor.id) {
            element.set(property, businessObject);
            array.push(descriptor.id);
          }
          return array;
        },
        [],
      ),
    );
  }
  eventBus.on('copyPaste.pasteElement', function (context) {
    let cache = context.cache,
      descriptor = context.descriptor,
      businessObject = descriptor.businessObject,
      di = descriptor.di;
    if (isLabel(descriptor)) {
      descriptor.businessObject = getBusinessObject(cache[descriptor.labelTarget]);
      descriptor.di = getDi(cache[descriptor.labelTarget]);
      return;
    }
    businessObject = descriptor.businessObject = copy(businessObject);
    di = descriptor.di = copy(di);
    di.bpmnElement = businessObject;
    copyProperties(descriptor, businessObject, ['isExpanded', 'name', 'wnType']); // 添加自定义的wnType
    descriptor.type = businessObject.$type;
  });
  eventBus.on('copyPaste.copyElement', LOW_PRIORITY, function (context) {
    let descriptor = context.descriptor,
      element = context.element;
    if (!is(element, 'bpmn:Participant')) return;
    let participantBo = getBusinessObject(element);
    if (participantBo.processRef) descriptor.processRef = copy(participantBo.processRef, true);
  });
  eventBus.on('copyPaste.pasteElement', function (context) {
    let descriptor = context.descriptor,
      processRef = descriptor.processRef;
    if (processRef) descriptor.processRef = copy(processRef);
  });
  eventBus.on('copyPaste.pasteElement', LOW_PRIORITY, function (context) {
    let cache = context.cache,
      descriptor = context.descriptor;
    setReferences(cache, resolveReferences(descriptor, cache, getReferences(cache)));
  });
}
BpmnCopyPaste.$inject = ['bpmnFactory', 'eventBus', 'moddleCopy'];
