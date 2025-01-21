import { bpmnSequenceFlow, bpmnIncoming, bpmnOutgoing, bpmnInclusive, bpmnExclusive, bpmnParallel, typeGateway } from '../config/variableName';
import { buildBitUUID } from '../utils/uuidUtil';
import { typeConfig } from '../config';
import { is } from 'bpmn-js/lib/util/ModelUtil';
export class NodeUtils {
  /**
   * 判断节点类型
   * @param {Node} node - 节点数据
   * @returns Boolean
   */
  static isStartNode(node) {
    return node && node.type === 'start';
  }
  static isApproverNode(node) {
    return node && node.type === 'approver';
  }
  static isSubFlowNode(node) {
    return node && node.type === 'subFlow';
  }
  static isInterflowNode(node) {
    return node && node.type === 'approver' && node.isInterflow;
  }
  static isConnectNode(node) {
    return node && node.type === bpmnSequenceFlow;
  }

  /**
   * 生成条件组名称
   * @param conditions  条件组
   * @param matchLogic  and / or
   */
  static getConditionsContent(conditions, matchLogic) {
    let content = '';
    for (let i = 0; i < conditions.length; i++) {
      const e = conditions[i];
      content += conditions.length == 1 ? '' : (i == 0 ? '' : ` ${matchLogic} `) + '( ';
      for (let j = 0; j < e.groups.length; j++) {
        const groups = e.groups[j];
        const logic = j == 0 ? '' : ` ${e.logic} `;
        const text = ` ${groups.fieldName} ${groups.symbolName}${
          groups.fieldLabel ? groups.fieldLabel : groups.fieldValue || groups.fieldValue === 0 ? groups.fieldValue : ''
        } `;
        content += logic + text;
      }
      content += conditions.length == 1 ? '' : ' )';
    }
    return content;
  }
  /**
   * 自动生成网关
   * @param xml  xml
   * @param elementRegistry  节点元素
   */
  static autoCreateGateWay(xml, elementRegistry, futureData) {
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xml, 'text/xml');
    let process: any = xmlDoc.querySelector('#Process_1');
    let divideList: any[] = [];
    let confluenceList: any = [];
    const allList: any[] = elementRegistry.getAll() || [];
    allList.map((item: any) => {
      if (item.incoming?.length > 1) confluenceList.push({ key: item.id, gatewayType: 'inclusion' });
      if (item.outgoing && item.outgoing.length > 1) {
        divideList.push({
          key: item.id,
          gatewayType: futureData.data[item.id]?.divideRule || 'inclusion',
        });
      }
    });
    // 新增分流xml标签
    if (divideList?.length) {
      divideList.map((item: any) => {
        let targetElement = xmlDoc.querySelector(`#${item.key}`);
        if (targetElement) {
          let targeChildren: any = targetElement.children;
          let outgoingList: any = [];
          let incomingList: any = [];
          for (var i = 0; i < targeChildren.length; i++) {
            if (targeChildren[i].nodeName === bpmnOutgoing) {
              // 将该值赋值给新生成的分流元素上 删除原来元素上的outgoing 并且生成一条新的outgoing连接到该线条上。
              outgoingList.push(targeChildren[i]);
            } else {
              incomingList.push(targeChildren[i]);
            }
          }
          // 新增一个分流节点 并且连接线到目前的元素上
          let gatewayElement = NodeUtils.createGateway(xmlDoc, item.gatewayType);
          let gatewayId = 'Gateway_' + buildBitUUID();
          let flowId = 'flow_' + buildBitUUID();
          gatewayElement.setAttribute('id', gatewayId);
          let flowElement = xmlDoc.createElement('bpmn2:sequenceFlow');
          flowElement.setAttribute('id', flowId);
          flowElement.setAttribute('sourceRef', item.key);
          flowElement.setAttribute('targetRef', gatewayId);
          let conditionExpression = xmlDoc.createElement('bpmn2:conditionExpression');
          conditionExpression.setAttribute('xsi:type', 'bpmn2:tFormalExpression');
          let testText = xmlDoc.createTextNode('${' + `${flowId}` + '}');
          conditionExpression.appendChild(testText);
          let childElement = xmlDoc.createElement(bpmnIncoming); // 替换为您想要创建的子标签的名称
          let textNode = xmlDoc.createTextNode(flowId);
          childElement.appendChild(textNode);
          gatewayElement.appendChild(childElement);
          if (outgoingList?.length) {
            let set: any = new Set();
            outgoingList.map((item: any) => {
              let outgoingId = item.textContent;
              let outgoingItemElementId = `#${outgoingId}`; // 替换成您要操作的元素的 ID
              let outgoingItemElement: any = xmlDoc.querySelector(outgoingItemElementId);
              outgoingItemElement.setAttribute('sourceRef', gatewayId);
              allList.map((itemElement: any) => {
                if (itemElement.id === outgoingId) set.add(itemElement.source?.id);
              });
              gatewayElement.appendChild(item);
            });
            set.forEach((item: any) => {
              let element: any = xmlDoc.getElementById(item);
              let childElement = xmlDoc.createElement(bpmnOutgoing);
              element.appendChild(childElement);
              let textNode = xmlDoc.createTextNode(flowId);
              childElement.appendChild(textNode);
            });
          }
          flowElement.appendChild(conditionExpression);
          process.appendChild(gatewayElement);
          process.appendChild(flowElement);
        }
      });
    }
    if (confluenceList?.length) {
      confluenceList.map((item: any) => {
        let targetElement = xmlDoc.querySelector(`#${item.key}`);
        if (targetElement) {
          let targeChildren: any = targetElement.children;
          let outgoingList: any = [];
          let incomingList: any = [];
          for (var i = 0; i < targeChildren.length; i++) {
            if (targeChildren[i].nodeName === bpmnOutgoing) {
              // 将该值赋值给新生成的分流元素上 删除原来元素上的outgoing 并且生成一条新的outgoing连接到该线条上。
              outgoingList.push(targeChildren[i]);
            } else {
              incomingList.push(targeChildren[i]);
            }
          }
          // 新增一个分流节点 并且连接线到目前的元素上
          let gatewayElement = NodeUtils.createGateway(xmlDoc, item.gatewayType);
          let gatewayId = 'Gateway_' + buildBitUUID();
          let flowId = 'Flow_' + buildBitUUID();
          gatewayElement.setAttribute('id', gatewayId);
          let flowElement = xmlDoc.createElement('bpmn2:sequenceFlow');
          let conditionExpression = xmlDoc.createElement('bpmn2:conditionExpression');
          conditionExpression.setAttribute('xsi:type', 'bpmn2:tFormalExpression');
          let testText = xmlDoc.createTextNode('${' + `${flowId}` + '}');
          conditionExpression.appendChild(testText);
          flowElement.setAttribute('id', flowId);
          flowElement.setAttribute('sourceRef', gatewayId);
          flowElement.setAttribute('targetRef', item.key);
          let childElement = xmlDoc.createElement(bpmnOutgoing); // 替换为您想要创建的子标签的名称
          let textNode = xmlDoc.createTextNode(flowId);
          childElement.appendChild(textNode);
          gatewayElement.appendChild(childElement);
          if (incomingList && incomingList.length) {
            let set: any = new Set();
            incomingList.map((item: any) => {
              let incomingId = item.textContent;
              let incomingItemElementId = `#${incomingId}`; // 替换成您要操作的元素的 ID
              let incomingItemElement: any = xmlDoc.querySelector(incomingItemElementId);
              incomingItemElement.setAttribute('targetRef', gatewayId);
              allList.map((itemElement: any) => {
                if (itemElement.id === incomingId) set.add(itemElement.target?.id);
              });
              gatewayElement.appendChild(item);
            });
            set.forEach((item: any) => {
              let element: any = xmlDoc.getElementById(item);
              let childElement = xmlDoc.createElement(bpmnIncoming);
              // 新增新的出线线条在元素上
              element.appendChild(childElement);
              let textNode = xmlDoc.createTextNode(flowId);
              childElement.appendChild(textNode);
            });
          }
          flowElement.appendChild(conditionExpression);
          process.appendChild(gatewayElement);
          process.appendChild(flowElement);
        }
      });
    }
    const newXml = new XMLSerializer().serializeToString(xmlDoc);
    return encodeURIComponent(newXml);
  }
  /**
   * 自动删除网关
   * @param flowXml
   * @returns
   */
  static autoDelGateWay(flowXml: string, type: number) {
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(decodeURIComponent(flowXml), 'text/xml');
    let oldXmlDoc = parser.parseFromString(decodeURIComponent(flowXml), 'text/xml');
    if (type != 1) {
      let process: any = xmlDoc.querySelector('#Process_1');
      let plane: any = xmlDoc.querySelector('#BPMNPlane_1');
      let gatewayList = NodeUtils.getAllGateway(xmlDoc);
      gatewayList.map((item: any) => {
        let incoming = item.getElementsByTagName(bpmnIncoming) || []; // 对于网关的进线线条
        let outgoing = item.getElementsByTagName(bpmnOutgoing) || []; // 对于网关的出线线条
        let sourceElement: any = []; // 当前网关的进线元素
        let targetElement: any = []; // 当前网关的出线元素
        for (let i = 0; i < incoming.length; i++) {
          // 获取进线元素的id
          let flowId = `#${incoming[i].innerText || incoming[i].textContent}`;
          // 然后在全局内找到该线条
          let connectElement: any = xmlDoc.querySelector(flowId);
          // 获取到该线条的进线元素
          let sourceElementId = connectElement.getAttribute('sourceRef');
          sourceElement.push(xmlDoc.querySelector(`#${sourceElementId}`));
        }
        for (let i = 0; i < outgoing.length; i++) {
          let flowId = `#${outgoing[i].innerText || outgoing[i].textContent}`;
          let connectElement: any = xmlDoc.querySelector(flowId);
          let targetElementId = connectElement.getAttribute('targetRef');
          targetElement.push(xmlDoc.querySelector(`#${targetElementId}`));
        }
        // 合流网关(网关有多条进线 一条出线)
        if (sourceElement.length > 1 && targetElement.length === 1) {
          // 获取当前的出线元素
          let targetElementId = targetElement[0]?.id;
          // 删除targetElement旧的进线元素
          const incomingList = NodeUtils.getIncomingConnectByElement(targetElement[0]) || [];
          incomingList.map((targetIccomingChildren: any) => {
            targetElement[0].removeChild(targetIccomingChildren);
          });
          // 遍历网关进线线条
          let list: any = [];
          // 迭代器
          for (let i = 0; i < incoming.length; i++) {
            let flowId = incoming[i].innerText || incoming[i].textContent;
            let connectElement: any = xmlDoc.querySelector(`#${flowId}`);
            let connectElementDi: any = xmlDoc.querySelector(`#${flowId}_di`);
            let connectiWaypoint = connectElementDi.getElementsByTagName('di:waypoint');
            connectElement.setAttribute('targetRef', targetElementId);
            list.push(incoming[i]);
            let id = item.getAttribute('id');
            if (id.includes('_isSimple')) {
              let outGoingId = outgoing[0].innerText || outgoing[0].textContent;
              let outGoingDi: any = xmlDoc.querySelector(`#${outGoingId}_di`);
              let newWaylist = this.getGatewayWaypoints(outGoingDi, outgoing, oldXmlDoc, connectiWaypoint);
              for (let i = 0; i < newWaylist?.length; i++) {
                if (!connectiWaypoint[i]) {
                  let newWaypoint = xmlDoc.createElementNS('http://www.omg.org/spec/DD/20100524/DI', 'di:waypoint');
                  newWaypoint.setAttribute('x', newWaylist[i].x);
                  newWaypoint.setAttribute('y', newWaylist[i].y);
                  connectElementDi.appendChild(newWaypoint);
                }
              }
            }
          }
          // 给targetElement设置新的进线元素
          list.map((item: any) => {
            targetElement[0]?.appendChild(item);
          });
          // 删除该网关及网关对应的出线元素
          process.removeChild(item);
          let flowId = outgoing[0].innerText || outgoing[0].textContent;
          let connectElement: any = xmlDoc.querySelector(`#${flowId}`);
          let connectElementDi: any = xmlDoc.querySelector(`#${flowId}_di`);
          let itemDi: any = xmlDoc.querySelector(`#${item.getAttribute('id')}_di`);
          process.removeChild(connectElement);
          connectElementDi && plane.removeChild(connectElementDi);
          itemDi && plane.removeChild(itemDi);
        }
        // 分流网关(网关有一条进线 多条出线)
        if (sourceElement.length === 1 && targetElement.length > 1) {
          // 获取当前的进元素
          let sourceElementId = sourceElement[0].id;
          // 删除sourceElement旧的出线元素
          const outgoingList = NodeUtils.getOutgoingConnectByElement(sourceElement[0]) || [];
          outgoingList.map((sourceElementChildren: any) => {
            sourceElement[0].removeChild(sourceElementChildren);
          });
          // 遍历网关出线线条
          let list: any = [];
          for (let i = 0; i < outgoing.length; i++) {
            // 获取进线元素的id
            let flowId = outgoing[i].innerText || outgoing[i].textContent;
            let incomingId = incoming[0].innerText || incoming[0].textContent;
            // 然后在全局内找到该线条 并且设置该线条的出线元素为targetElementId
            let connectElement: any = xmlDoc.querySelector(`#${flowId}`);
            connectElement.setAttribute('sourceRef', sourceElementId);
            // 给sourceElement设置新的出线信息
            list.push(outgoing[i]);
            let id = item.getAttribute('id');
            if (id.includes('_isSimple')) {
              let itemDi: any = xmlDoc.querySelector(`#${flowId}_di`);
              let itemDiWaypoint = itemDi.getElementsByTagName('di:waypoint');
              let incomingDi: any = xmlDoc.querySelector(`#${incomingId}_di`);
              let waypoint: any = incomingDi.getElementsByTagName('di:waypoint');
              let newWaylist: any = [];
              for (let i = 0; i < waypoint.length; i++) {
                newWaylist.push({
                  x: waypoint[i].getAttribute('x'),
                  y: i === 1 ? Number(waypoint[i].getAttribute('y')) + typeConfig[bpmnInclusive].renderer.attr.height / 2 : waypoint[i].getAttribute('y'),
                });
              }
              for (let i = 0; i < itemDiWaypoint.length; i++) {
                i != 0 && newWaylist.push({ x: itemDiWaypoint[i].getAttribute('x'), y: itemDiWaypoint[i].getAttribute('y') });
              }
              for (let i = 0; i < newWaylist.length; i++) {
                if (itemDiWaypoint[i]) {
                  itemDiWaypoint[i].setAttribute('x', newWaylist[i].x);
                  itemDiWaypoint[i].setAttribute('y', newWaylist[i].y);
                } else {
                  let newWaypoint = xmlDoc.createElementNS('http://www.omg.org/spec/DD/20100524/DI', 'di:waypoint');
                  newWaypoint.setAttribute('x', newWaylist[i].x);
                  newWaypoint.setAttribute('y', newWaylist[i].y);
                  itemDi.appendChild(newWaypoint);
                }
              }
            }
          }
          list.map((item: any) => {
            sourceElement[0].appendChild(item);
          });
          // 删除该网关及网关对应的出线元素
          process.removeChild(item);
          let flowId = incoming[0].innerText || incoming[0].textContent;
          let connectElement: any = xmlDoc.querySelector(`#${flowId}`);
          let connectElementDi: any = xmlDoc.querySelector(`#${flowId}_di`);
          let itemDi: any = xmlDoc.querySelector(`#${item.getAttribute('id')}_di`);
          process.removeChild(connectElement);
          connectElementDi && plane.removeChild(connectElementDi);
          itemDi && plane.removeChild(itemDi);
        }
      });
    }
    return xmlDoc;
  }
  static createGateway(xmlDoc: any, type: 'parallel' | 'inclusion' | 'exclusive') {
    if (type === 'inclusion') return xmlDoc.createElement('bpmn2:inclusiveGateway');
    if (type === 'parallel') return xmlDoc.createElement('bpmn2:parallelGateway');
    if (type === 'exclusive') return xmlDoc.createElement('bpmn2:exclusiveGateway');
  }
  static getAllGateway(xmlDoc: any) {
    let gateWayList: any = [];
    let parallelGateways = xmlDoc.getElementsByTagName('bpmn2:parallelGateway');
    let inclusiveGateways = xmlDoc.getElementsByTagName('bpmn2:inclusiveGateway');
    let exclusiveGateways = xmlDoc.getElementsByTagName('bpmn2:exclusiveGateway');
    for (let i = 0; i < parallelGateways.length; i++) {
      gateWayList.push(parallelGateways[i]);
    }
    for (let i = 0; i < inclusiveGateways.length; i++) {
      gateWayList.push(inclusiveGateways[i]);
    }
    for (let i = 0; i < exclusiveGateways.length; i++) {
      gateWayList.push(exclusiveGateways[i]);
    }
    return gateWayList;
  }
  /**
   * 获取element下的进线元素
   * @param element 元素
   * @returns {Array} 进线元素数组
   */
  static getIncomingConnectByElement(element: any) {
    let list: any = [];
    let incomingElements = element?.getElementsByTagName(bpmnIncoming);
    for (let i = 0; i < incomingElements?.length; i++) {
      list.push(incomingElements[i]);
    }
    return list;
  }
  /**
   * 获取element下的出线元素
   * @param element 元素
   * @returns {Array} 出线元素数组
   */
  static getOutgoingConnectByElement(element: any) {
    let list: any = [];
    let outgoingElements = element?.getElementsByTagName(bpmnOutgoing);
    for (let i = 0; i < outgoingElements?.length; i++) {
      list.push(outgoingElements[i]);
    }
    return list;
  }

  static getLastElementList(element: any, allElements: any[]) {
    let lastList: any = [];
    if (element && element.incoming && element.incoming.length) {
      element.incoming.forEach((item: any) => {
        return allElements.forEach((last: any) => {
          // last中的出线若和 item的id相同 则获取到上一个节点的信息
          if (last.outgoing && last.outgoing.length) {
            let nextElement = last.outgoing.find((outgoing: any) => {
              return outgoing.id === item.id;
            });
            if (nextElement) {
              lastList.push(last);
              return element;
            }
          }
        });
      });
    }
    return lastList;
  }

  static getNextElementList = (element: any, allElements: any[]) => {
    let lastList: any = [];
    if (element && element.outgoing && element.outgoing.length) {
      element.outgoing.forEach((item: any) => {
        // 遇到死循环的线条 则直接返回
        // if (detectCycleConnection.includes(item.id)) {
        //   return
        // }
        // item 为element进口的连线信息
        return allElements.forEach((last: any) => {
          // last中的出线若和 item的id相同 则获取到上一个节点的信息
          if (last.incoming && last.incoming.length) {
            let nextElement = last.incoming.find((incoming: any) => {
              return incoming.id === item.id;
            });
            if (nextElement) {
              lastList.push(last);
              return element;
            }
          }
        });
      });
    }
    return lastList;
  };

  static getEndlessLoop = (bpmn: any) => {
    // 获取 BPMN 图中的所有元素
    let elementRegistry = bpmn.get('elementRegistry');
    let elements = elementRegistry.getAll();
    // 构建图数据结构
    let graph = {};
    let edgeMap = {}; // 用于存储边信息，key 是源节点，value 是目标节点和连线 id
    elements.forEach(element => {
      if (element.type === 'bpmn:SequenceFlow') {
        const sourceId = element.source.id;
        const targetId = element.target.id;
        const edgeId = element.id;
        if (!graph[sourceId]) graph[sourceId] = [];
        graph[sourceId].push(targetId);
        if (!edgeMap[sourceId]) edgeMap[sourceId] = [];
        edgeMap[sourceId].push({ targetId, edgeId });
      }
    });
    // 使用修改后的 DFS 检测所有环路并找出每个环路的最后一个进入环路的连线
    function findAllCycles(graph, edgeMap) {
      let visited = new Set();
      let stack: any = [];
      let stackSet: any = new Set();
      let cycles: any = [];
      function visit(node, startNode) {
        if (stackSet.has(node)) {
          // 找到环，记录从开始节点到环路的路径上的连线，并选择路径上的最后一条连线作为最后一个进入环路的连线
          let pathEdges: any = [];
          let isCycle = false;
          for (let i = stack.indexOf(startNode); i < stack.length - 1; i++) {
            let source = stack[i];
            let target = stack[i + 1];
            let edge = edgeMap[source].find(edge => edge.targetId === target);
            if (edge) {
              pathEdges.push(edge.edgeId);
              if (source === node) {
                isCycle = true;
                break;
              }
            }
          }
          if (isCycle) cycles.push(pathEdges[pathEdges.length - 1]);
          return;
        }
        if (visited.has(node)) return; // 已访问过，且无环
        visited.add(node);
        stack.push(node);
        stackSet.add(node);
        let neighbors = graph[node] || [];
        for (const neighbor of neighbors) {
          visit(neighbor, startNode);
        }
        stack.pop();
        stackSet.delete(node);
      }
      for (const node in graph) {
        visit(node, node);
      }
      return cycles;
    }
    return findAllCycles(graph, edgeMap);
  };

  // 网关坐标
  static getGatewayWaypoints = (outGoingDi: any, outgoing: any, xmlDoc: any, connectiWaypoint?: any) => {
    let newList: any = [];
    let id = outGoingDi.getAttribute('bpmnElement');
    let gateway = xmlDoc.querySelector(`#${id}`);
    let itemDi: any = xmlDoc.querySelector(`#${id}_di`);
    let itemDiWaypoint = itemDi.getElementsByTagName('di:waypoint');
    for (let i = 0; i < itemDiWaypoint.length; i++) {
      newList.push({
        x: itemDiWaypoint[i].getAttribute('x'),
        y: itemDiWaypoint[i].getAttribute('y'),
      });
    }
    // 获取网关子坐标 如果子元素还是网关则继续查找后代元素
    let childrenElementId = gateway.getAttribute('targetRef');
    let childrenElement = xmlDoc.querySelector(`#${childrenElementId}`);
    if (childrenElementId.includes('Gateway_')) {
      let childrenOutgoinges = childrenElement.getElementsByTagName(bpmnOutgoing);
      let childrenOutGoingId = outgoing[0].innerText || outgoing[0].textContent;
      let childrenOutGoingDi: any = xmlDoc.querySelector(`#${childrenOutGoingId}_di`);
      let childrenList: any = this.getGatewayWaypoints(childrenOutGoingDi, childrenOutgoinges, xmlDoc);
      newList = newList.concat(childrenList);
    } else if (connectiWaypoint?.length > 0) {
      // 如果是其它节点
      for (let i = 0; i < connectiWaypoint.length - 1; i++) {
        newList.unshift({
          x: connectiWaypoint[i].getAttribute('x'),
          y: connectiWaypoint[i].getAttribute('y'),
        });
      }
    }
    return newList;
  };

  // 校验连线是否存在条件标签 不存则需要手动添加。
  static verificationConnect = bpmn => {
    let elementRegistry: any = bpmn.get('elementRegistry');
    let moddle = bpmn.get('moddle');
    let modeling = bpmn.get('modeling');
    let connect = elementRegistry.getAll().filter((element: any) => {
      if (is(element, 'bpmn:SequenceFlow') && !element?.businessObject?.conditionExpression && element.type != 'label') return element;
    });
    if (connect?.length > 0) {
      connect.forEach(sequenceFlow => {
        let conditionExpression = moddle.create('bpmn:FormalExpression', {
          body: '${' + `${sequenceFlow.id}` + '}',
        });
        modeling.updateProperties(sequenceFlow, {
          conditionExpression: conditionExpression,
        });
      });
    }
  };
  static gatewayTypeSetted = (bpmn: any, node: any) => {
    let elementRegistry: any = bpmn.get('elementRegistry');
    let allElement = elementRegistry.getAll();
    let futureData = bpmn.get('futureData');
    allElement.map((element: any) => {
      if (element.wnType === typeGateway) {
        let sourceElement = element.incoming[0]?.source;
        if (element.type === bpmnInclusive) {
          // 分流规则 inclusion: 根据条件多分支流转(包容网关)  exclusive:根据条件单分支流转（排它网关） parallel:所有分支都流转（并行网关）
          futureData.setValue(sourceElement.id, { divideRule: 'inclusion' });
          node[sourceElement.id].divideRule = 'inclusion';
        }
        if (element.type === bpmnParallel) {
          futureData.setValue(sourceElement.id, { divideRule: 'parallel' });
          node[sourceElement.id].divideRule = 'parallel';
        }
        if (element.type === bpmnExclusive) {
          futureData.setValue(sourceElement.id, { divideRule: 'exclusive' });
          node[sourceElement.id].divideRule = 'exclusive';
        }
      }
    });
    return node;
  };
}
