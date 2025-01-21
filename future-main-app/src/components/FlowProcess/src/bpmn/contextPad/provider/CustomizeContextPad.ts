import { typeConfig } from '../../config';
import { futureConfigBpmnContextPad } from '../../config/contextPad';
import {
  bpmnEnd,
  bpmnTask,
  bpmnSubFlow,
  typeEnd,
  typeTask,
  typeSubFlow,
  typeConfluence,
  typeGateway,
  bpmnStart,
  bpmnSequenceFlow,
} from '../../config/variableName';
import { futureApproverConfig } from '../../config/element/approver';
import { futureSubFlowConfig } from '../../config/element/subFlow';
import { futureEndConfig } from '../../config/element/end';

const CustomizeContextPad = (contextPadProvider: any, element: any) => {
  let type = element.type;
  if (typeConfig[type]) {
    const {
      _autoPlace: autoPlace,
      _create: create,
      _elementFactory: elementFactory,
      _modeling: modeling,
      _connect: connects,
      _canvas: canvas,
      _eventBus: eventBus,
    } = contextPadProvider;
    const { contextPad, shapeType } = typeConfig[type];
    const { connect, end, approver, subFlow, del } = futureConfigBpmnContextPad;
    // 根据类型 判断contextPad
    if (type === shapeType) {
      if (contextPad) {
        if (contextPad.default) return defaultContextPad;
        else if (contextPad.customization) {
          let result: any = {};
          let wnGatewayType = element.wnGatewayType || '';
          const customization = wnGatewayType === typeConfluence ? contextPad.otherCustomization : contextPad.customization;
          for (let key of Object.keys(customization)) {
            let data = customization[key];
            if (data.group === 'model') {
              let options: any = {
                wnName: data.title,
              };
              if (element.type === bpmnStart && key === typeGateway) {
                // 开始节点只有分类节点 因为网关的分流节点和合流节点类型一致 多增加一个字段来表示
                options = {
                  wnName: data.title,
                  // wnGatewayType: typeGateway,
                  wnType: typeGateway,
                  icon: data.icon,
                };
              }
              result[data.name] = appendAction(data.type, data.elementName, data.className, data.title, data.wnType, options);
            } else if (data.group === 'connect') {
              result[data.name] = {
                group: data.group,
                className: data.className,
                title: data.title,
                action: {
                  click: startConnect,
                  dragstart: startConnect,
                },
              };
            } else if (data.group === 'edit') {
              result[data.name] = {
                group: data.group,
                className: data.className,
                title: data.title,
                action: {
                  click: removeElement,
                },
              };
            }
          }
          return Object.assign(result);
        } else return defaultContextPad();
      }

      // 单个节点删除功能
      function removeElement() {
        if (element.type === bpmnSequenceFlow) {
          modeling.removeElements([element]);
        } else
          eventBus.fire('commandStack.canExecute', {
            command: 'shape.delete',
            context: {
              shape: element,
            },
          });
      }
      // 开始连线（拖拽）
      function startConnect(event: any, element: any) {
        connects.start(event, element);
      }
      // 添加事件
      function appendAction(type: any, name: any, className: any, title: any, wnType: any, options?: any) {
        const appendStart = (event: any, element: any) => {
          if (type === typeSubFlow) type = bpmnTask;
          let bpmnFactory = elementFactory._bpmnFactory;
          let businessObject = bpmnFactory.create(type);
          let shape = elementFactory.createShape(Object.assign({ type, name, wnType, ...options }, businessObject));
          create.start(event, shape, { source: element });
        };
        const autoPlaceAppend = async (_event: any, element: any) => {
          if (type === typeSubFlow) type = bpmnTask;
          let bpmnFactory = elementFactory._bpmnFactory;
          let businessObject = bpmnFactory.create(type);
          let shape = elementFactory.createShape(Object.assign({ type, name: name, businessObject, wnType: wnType }, options));
          autoPlace.append(element, shape);
        };
        var append = autoPlace ? autoPlaceAppend : appendStart;
        return {
          group: 'model',
          className: className,
          title: title,
          action: { dragstart: appendStart, click: append },
        };
      }
      // 默认contextPad
      function defaultContextPad() {
        return Object.assign({
          [approver.name]: appendAction(bpmnTask, typeTask, approver.className, approver.title, typeTask, { wnName: futureApproverConfig.renderer.rendererName }),
          [subFlow.name]: appendAction(bpmnTask, bpmnSubFlow, subFlow.className, subFlow.title, typeSubFlow, {
            wnName: futureSubFlowConfig.renderer.rendererName,
          }),
          [end.name]: appendAction(bpmnEnd, typeEnd, end.className, end.title, typeEnd, { wnName: futureEndConfig.renderer.rendererName }),
          [connect.name]: {
            group: connect.group,
            className: connect.className,
            title: connect.title,
            action: {
              click: startConnect,
              dragstart: startConnect,
            },
          },
          [del.name]: {
            group: del.group,
            className: del.className,
            title: del.title,
            action: {
              click: removeElement,
            },
          },
        });
      }
    }
    return undefined;
  }
  return undefined;
};
export default CustomizeContextPad;
