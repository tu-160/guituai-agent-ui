import { typeConfig } from '../../../config';
import { futureConfigBpmnContextPad } from '../../../config/contextPad';
import { bpmnEnd, bpmnTask, typeTask, typeSubFlow, typeLabel, bpmnInclusive, typeConfluence, typeGateway, bpmnStart } from '../../../config/variableName';
import { BPMNTreeBuilder } from '../../../utils/constructTreeUtil';
import { DEFAULT_DISTANCE } from '../../../autoPlace/YmAutoPlaceUtil';
import { buildBitUUID } from '../../../utils/uuidUtil';

const CustomizeContextPad = (contextPadProvider: any, element: any) => {
  let type = element.type;
  let isAction = true;
  if (typeConfig[type]) {
    const {
      _autoPlace: autoPlace,
      _create: create,
      _elementFactory: elementFactory,
      _modeling: modeling,
      _connect: connects,
      _injector: injector,
      _rules: rules,
    } = contextPadProvider;
    const { contextPad, shapeType } = typeConfig[type];
    const { del } = futureConfigBpmnContextPad;
    if (type === shapeType) {
      if (contextPad) {
        if (contextPad.default) return defaultContextPad;
        else if (contextPad.customization) {
          let result: any = {};
          let wnType = element.wnType;
          const customization = wnType === typeConfluence ? contextPad.otherCustomization : contextPad.customization;
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
                  wnGatewayType: typeGateway,
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
                  click: isAction && startConnect,
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
        rules.allowed('elements.delete', { elements: [element] });
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
          if (element.type === typeLabel) {
            let businessTaskObject = bpmnFactory.create(bpmnTask);
            let businessTask2Object = bpmnFactory.create(bpmnTask);
            let businessInclusiveObject = bpmnFactory.create(bpmnInclusive);
            let shape: any;
            if (wnType === typeGateway) {
              let id = `Gateway_${buildBitUUID()}_isSimple`;
              businessObject.id = id;
              shape = elementFactory.createShape(Object.assign({ type, id: id, name: name, businessObject, wnType: wnType }, options));
            } else {
              shape = elementFactory.createShape(Object.assign({ type, name: name, businessObject, wnType: wnType }, options));
            }
            updateShapePosition(shape, element, businessTaskObject, businessInclusiveObject, businessTask2Object);
          } else {
            autoPlace.append(element, shape);
            // 自研
            if (element.wnType === typeGateway) {
              // 获取对应的合流网关
              const gateway = injector.get('elementRegistry').get(element.id + '_confluence');
              modeling.connect(shape, gateway);
            }
          }
          // 计算需要横向偏移的元素(只有出现分流的情况下需要用到)
          if (element?.type === typeLabel || element.wnType === typeGateway) onAutoPosition();
        };
        var append = autoPlace ? autoPlaceAppend : appendStart;
        let disable = isAction;
        if (element?.labelTarget?.source?.wnType === typeConfluence && wnType === typeGateway) disable = false;
        if (element?.labelTarget?.source?.wnType === typeSubFlow && wnType === typeGateway) disable = false;
        if (element?.labelTarget?.target?.wnType === typeGateway && wnType === typeGateway) disable = false;
        return {
          group: 'model',
          className: className,
          title: title,
          disable: disable,
          action: { click: disable && append },
        };
      }
      // 默认contextPad
      function defaultContextPad() {
        return Object.assign({
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
      // 判断元素与网关之间的垂直距离是否小于某个阈值
      function isWithinThreshold(target, source, threshold) {
        // 这里假设网关在上方，即网关的 y 坐标小于当前元素的 y 坐标
        let gatewayY = target.y;
        let sourceElementY = source.y;
        return gatewayY - sourceElementY > threshold && gatewayY > sourceElementY;
      }
      function moveConnectedElements(connection: any, height: any) {
        const stack: any = []; // 用于存储待处理的连接线
        const processedElements = new Set(); // 记录已经处理过的目标元素
        stack.push(connection); // 从给定的连接线开始
        while (stack.length > 0) {
          const currentConnection: any = stack.pop();
          const target = currentConnection.target;
          if (!target) continue; // 如果没有目标元素，跳过
          if (processedElements.has(target)) continue; // 如果目标元素已经处理过，跳过
          if (isWithinThreshold(target, currentConnection.source, height)) continue;
          processedElements.add(target); // 标记该元素已经被处理
          // 遍历目标元素的所有出线连接，并将它们压入栈
          const outgoingConnections: any = target.outgoing || [];
          for (const outgoingConnection of outgoingConnections) {
            stack.push(outgoingConnection); // 将所有关联的连接线压入栈中
          }
        }
        return Array.from(processedElements);
      }
      async function updateShapePosition(shape: any, element: any, businessTaskObject, businessInclusiveObject, businessTask2Object) {
        let connectElement: any = element?.labelTarget;
        let targetElement = connectElement?.target;
        let sourceElement = connectElement?.source;
        let promises: any = [];
        if (shape.wnType === typeGateway) {
          // 生成两个分支 包含分支 → 条件节点*2 → 任务节点*2 → 合流节点*1 最后融入到旧元素内
          let shape1 = elementFactory.createShape(
            Object.assign({ type: bpmnTask, name: typeTask, businessObject: businessTaskObject, wnType: typeTask }, { wnName: '审批节点' }),
          );
          businessInclusiveObject.id = shape.id + '_confluence';
          let gateway = elementFactory.createShape(
            Object.assign(
              {
                id: shape.id + '_confluence',
                type: bpmnInclusive,
                name: typeConfluence,
                businessObject: businessInclusiveObject,
                wnType: typeConfluence,
              },
              { wnName: '合流' },
            ),
          );
          let shape2 = elementFactory.createShape(
            Object.assign({ type: bpmnTask, name: typeTask, businessObject: businessTask2Object, wnType: typeTask }, { wnName: '审批节点' }),
          );
          let labelTargetY =
            DEFAULT_DISTANCE * 4 +
            typeConfig[bpmnTask].renderer.attr.height +
            typeConfig[sourceElement.type].renderer.attr.height +
            typeConfig[bpmnInclusive].renderer.attr.height;

          promises.push(
            modeling.moveElements(moveConnectedElements(element.labelTarget, labelTargetY), {
              x: 0,
              y: labelTargetY - (targetElement.y - sourceElement.y),
            }),
          );
          promises.push(modeling.removeConnection(connectElement));
          promises.push(autoPlace.append(sourceElement, shape));
          promises.push(autoPlace.append(shape, shape1));
          promises.push(autoPlace.append(shape, shape2));
          promises.push(autoPlace.append(shape1, gateway));
          promises.push(modeling.connect(shape2, gateway));
          promises.push(modeling.connect(gateway, targetElement));
        } else if (targetElement) {
          let labelTargetY = (DEFAULT_DISTANCE + typeConfig[bpmnTask].renderer.attr.height) * 2;
          let y = labelTargetY - (targetElement.y - sourceElement.y);
          if (targetElement.type === bpmnEnd) y = DEFAULT_DISTANCE + typeConfig[bpmnTask].renderer.attr.height;
          if (sourceElement.type === bpmnStart) y = DEFAULT_DISTANCE + typeConfig[bpmnTask].renderer.attr.height;
          if (sourceElement.wnType === typeConfluence) {
            y = DEFAULT_DISTANCE + typeConfig[bpmnTask].renderer.attr.height;
            if (targetElement.y - sourceElement.y - DEFAULT_DISTANCE * 2 - typeConfig[bpmnTask].renderer.attr.height > 0) y = 0;
            if (targetElement.y - sourceElement.y - DEFAULT_DISTANCE * 2 - typeConfig[bpmnTask].renderer.attr.height < 0)
              y = Math.abs(targetElement.y - sourceElement.y - DEFAULT_DISTANCE * 2 - typeConfig[bpmnTask].renderer.attr.height);
          }
          if (sourceElement?.wnType === typeConfluence && targetElement?.wnType === typeConfluence) {
            let maxY = -Infinity;
            let id;
            targetElement = injector.get('elementRegistry').get(targetElement.id);
            targetElement.incoming?.length > 0 &&
              targetElement.incoming.map(item => {
                let currentElement: any = injector.get('elementRegistry').get(item.id);
                if (currentElement.source?.y > maxY) {
                  id = currentElement.source.id;
                  maxY = currentElement.source.y;
                }
              });
            if (targetElement.y - maxY <= DEFAULT_DISTANCE && sourceElement.id != id) {
              y = DEFAULT_DISTANCE - (targetElement.y - maxY);
            }
          }
          promises.push(
            modeling.moveElements(moveConnectedElements(element.labelTarget, labelTargetY), {
              x: 0,
              y: y,
            }),
          );

          promises.push(modeling.removeConnection(connectElement));
          autoPlace.append(sourceElement, shape);
          promises.push(modeling.connect(shape, targetElement));
        }
        Promise.all(promises);
      }
      async function onAutoPosition() {
        let elementRegistry: any = await contextPadProvider._injector.get('elementRegistry');
        let allElements = elementRegistry.getAll();
        let treeBuilder = new BPMNTreeBuilder(allElements); // 实例化工具类
        let bpmnTree = treeBuilder.constructTree(); // 构建树状数据结构
        let visited: any = new Map(); // 用于防止重复访问
        treeBuilder.calculateVirtualWidth(bpmnTree); // 计算虚拟宽度
        treeBuilder.traverseTreeBFS(bpmnTree, node => {
          node?.offset && node.x != node.offset.x && visited.set(node.id, node);
        });
        treeBuilder.formatCanvas(Array.from(visited.values()), modeling, elementRegistry);
      }
    }
    return undefined;
  }
  return undefined;
};
export default CustomizeContextPad;
