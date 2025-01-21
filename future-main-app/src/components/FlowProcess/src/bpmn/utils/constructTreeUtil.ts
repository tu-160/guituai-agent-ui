import { ModdleElement } from 'diagram-js/lib/core/ElementRegistry';
import { bpmnStart, typeConfluence, typeGateway } from '../config/variableName';
import { NodeUtils } from './nodeUtil';
import { DEFAULT_CONNECT, DEFAULT_DISTANCE } from '../autoPlace/YmAutoPlaceUtil';
// 定义 TreeNode 接口，表示树状数据结构中的节点
export interface TreeNode {
  id: string;
  name: string;
  type: string;
  wnType: string;
  children: TreeNode[];
  virtualWidth: number; // 虚拟宽度(纵向排布)
  virtualHeight: number; // 虚拟高度(横向排布)
  isGateway?: boolean;
  level?: number;
  x: number;
  y: number;
  width: number;
  height: number;
  parentData?: any;
  offset?: any;
  subTree?: TreeNode; // 引用子树
}

type direction = 'vertical' | 'horizontal';
// 封装为工具类来处理树状数据结构
export class BPMNTreeBuilder {
  _allElement: any;
  constructor(allElement: any) {
    this._allElement = allElement;
  }
  // 检查并添加不重复的子节点
  private addUniqueChild(parent: TreeNode, child: TreeNode): void {
    if (!parent.children.some(c => c.id === child.id)) parent.children.push(child);
  }
  public findStartElement(obj) {
    // 获取对象的键并遍历
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const item = obj[key];
        if (item.type === bpmnStart) return item;
      }
    }
    return null; // 如果没有找到符合条件的对象，返回 null
  }
  public constructTree(): TreeNode {
    let startNode: any = this.findStartElement(this._allElement);
    if (!startNode) throw new Error('开始节点未找到');
    // 创建根节点
    const rootNode: TreeNode = {
      id: startNode.id,
      name: (startNode.businessObject as ModdleElement).name,
      type: startNode.type,
      wnType: startNode.wnType,
      children: [],
      virtualWidth: 320,
      virtualHeight: DEFAULT_DISTANCE,
      level: 0,
      x: startNode.x,
      y: startNode.y,
      width: startNode.width,
      height: startNode.height,
    };
    // 构建连接关系
    let connections: Record<string, TreeNode[]> = {};
    for (let key in this._allElement) {
      let element = this._allElement[key];
      if (element.type === 'bpmn:SequenceFlow') {
        let sourceId = element.source.id;
        let targetId = element.target.id;
        if (!connections[sourceId]) connections[sourceId] = [];
        let targetElement = element.target;
        let childNode: TreeNode = {
          id: targetId,
          name: targetElement.name,
          type: targetElement.type,
          wnType: targetElement.wnType,
          children: [],
          virtualWidth: 320,
          virtualHeight: DEFAULT_DISTANCE,
          x: targetElement.x,
          y: targetElement.y,
          width: targetElement.width,
          height: targetElement.height,
        };
        if (!connections[sourceId].some(child => child.id === childNode.id)) connections[sourceId].push(childNode);
      }
    }
    // 使用广度优先遍历构建树
    let queue: TreeNode[] = [rootNode];
    let processedNodes = new Map(); // 跟踪处理过的节点
    while (queue.length > 0) {
      let current = queue.shift();
      if (current && connections[current.id]) {
        connections[current.id].forEach(child => {
          child.parentData = current;
          if (!processedNodes.has(child.id)) {
            this.addUniqueChild(current, child); // 添加到父节点
            queue.push(child); // 推入队列
            processedNodes.set(child.id, child); // 标记为已处理
          } else this.addUniqueChild(current, processedNodes.get(child.id)); // 添加到父节点
        });
      }
    }
    return rootNode;
  }
  /**
   * 使用栈进行深度优先遍历，计算虚拟宽度
   * @type 0：自研， 1：简流
   *  */
  public calculateVirtualWidth(root: TreeNode, elementRegistry?: any): number {
    // 栈存储的是节点和已计算的子节点总宽度
    let stack: { node: TreeNode; totalWidth: number }[] = [];
    stack.push({ node: root, totalWidth: 0 });
    // 遍历过程中保存父子关系的映射
    let parentChildMapping = new Map<TreeNode, TreeNode[]>();
    while (stack.length > 0) {
      let current = stack[stack.length - 1];
      let { node, totalWidth } = current;
      // 如果节点没有子节点，则直接设置默认宽度
      if (node.children.length === 0) {
        node.virtualWidth = 320;
        stack.pop(); // 从栈中移除
        this.updateParent(stack, node.virtualWidth!, 'horizontal');
        continue;
      }
      // 如果子节点还没有完全遍历，则将子节点压入栈
      let children = node.children;
      let unprocessedChildren = parentChildMapping.get(node);
      if (!unprocessedChildren) {
        unprocessedChildren = [...children]; // 克隆子节点列表
        parentChildMapping.set(node, unprocessedChildren);
      }
      if (unprocessedChildren.length > 0) {
        let child = unprocessedChildren.pop(); // 取出一个未处理的子节点
        stack.push({ node: child!, totalWidth: 0 });
      } else {
        // 所有子节点都已处理完毕，计算虚拟宽度
        let finalWidth = totalWidth;
        let hasMergeChild = children.some(child => child.wnType === typeConfluence);
        if (hasMergeChild) finalWidth = 320;
        else
          finalWidth = children.reduce((sum, child) => {
            let virtualWidth = child.virtualWidth ?? 0;
            if (child.isGateway) virtualWidth = 320;
            return sum + virtualWidth;
          }, 0);
        // 重新计算父元素为分流网关元素的虚拟宽度 该元素的虚拟宽度需要获取到该分流到合流内的所有分流虚拟宽度 取最大值
        if (node.parentData?.wnType === typeGateway) {
          // 辅助函数，用于递归遍历路径
          let elements: any = new Map();
          let number: any = 0; // 取最大值
          function getChildrenMaxWidth(targetElement) {
            elements.set(targetElement.id, targetElement.virtualWidth);
            if (number < targetElement.virtualWidth && targetElement.wnType != typeConfluence) number = targetElement.virtualWidth;
            if (targetElement.id !== node.parentData?.id + '_confluence') findPath(targetElement, false);
          }
          function findPath(currentElement, isRoot: boolean, id?) {
            currentElement?.children.forEach(targetElement => {
              if (isRoot) {
                if (targetElement.id === id) getChildrenMaxWidth(targetElement);
              } else getChildrenMaxWidth(targetElement);
            });
          }
          findPath(node.parentData, true, node.id);
          finalWidth = number;
        }
        // 如果该节点有多个incoming线 则 将该节点默认为是合流节点 将它宽度设置为320
        if (elementRegistry) {
          let currentElement = elementRegistry.get(node.id);
          // if (currentElement.incoming?.length > 1) finalWidth = 320;
          if (currentElement.incoming?.length > 1) node.isGateway = true;
        }
        node.virtualWidth = finalWidth;
        stack.pop(); // 从栈中移除
        this.updateParent(stack, finalWidth, 'horizontal');
      }
    }
    return root.virtualWidth!;
  }
  public calculateVirtualHeight(root: TreeNode, elementRegistry?: any): number {
    // 栈存储的是节点和已计算的子节点总高度
    let stack: { node: TreeNode; totalHeight: number }[] = [];
    stack.push({ node: root, totalHeight: 0 });
    // 遍历过程中保存父子关系的映射
    let parentChildMapping = new Map<TreeNode, TreeNode[]>();
    while (stack.length > 0) {
      let current = stack[stack.length - 1];
      let { node, totalHeight } = current;
      // 如果节点没有子节点，则直接设置默认高度
      if (node.children.length === 0) {
        node.virtualHeight = 118;
        stack.pop(); // 从栈中移除
        this.updateParent(stack, node.virtualHeight!, 'vertical');
        continue;
      }
      // 如果子节点还没有完全遍历，则将子节点压入栈
      let children = node.children;
      let unprocessedChildren = parentChildMapping.get(node);
      if (!unprocessedChildren) {
        unprocessedChildren = [...children]; // 克隆子节点列表
        parentChildMapping.set(node, unprocessedChildren);
      }
      if (unprocessedChildren.length > 0) {
        let child = unprocessedChildren.pop(); // 取出一个未处理的子节点
        stack.push({ node: child!, totalHeight: 0 });
      } else {
        // 所有子节点都已处理完毕，计算虚拟高度
        let finalHeight = totalHeight;
        let hasMergeChild = children.some(child => child.wnType === typeConfluence);
        if (hasMergeChild) finalHeight = 208;
        else
          finalHeight = children.reduce((sum, child) => {
            let virtualHeight = child.virtualHeight ?? 0;
            if (child.isGateway) virtualHeight = 208;
            return sum + virtualHeight;
          }, 0);
        // 重新计算父元素为分流网关元素的虚拟高度 该元素的虚拟高度需要获取到该分流到合流内的所有分流虚拟高度 取最大值
        if (node.parentData?.wnType === typeGateway) {
          // 辅助函数，用于递归遍历路径
          let elements: any = new Map();
          let number: any = 0; // 取最大值
          function getChildrenMaxHeight(targetElement) {
            elements.set(targetElement.id, targetElement.virtualHeight);
            if (number < targetElement.virtualHeight && targetElement.wnType != typeConfluence) number = targetElement.virtualHeight;
            if (targetElement.id !== node.parentData?.id + '_confluence') findPath(targetElement, false);
          }
          function findPath(currentElement, isRoot: boolean, id?) {
            currentElement?.children.forEach(targetElement => {
              if (isRoot) {
                if (targetElement.id === id) getChildrenMaxHeight(targetElement);
              } else getChildrenMaxHeight(targetElement);
            });
          }
          findPath(node.parentData, true, node.id);
          finalHeight = number;
        }
        // 如果该节点有多个incoming线 则 将该节点默认为是合流节点 将它高度设置为320
        if (elementRegistry) {
          let currentElement = elementRegistry.get(node.id);
          if (currentElement.incoming?.length > 1) node.isGateway = true;
        }
        node.virtualHeight = finalHeight;
        stack.pop(); // 从栈中移除
        this.updateParent(stack, finalHeight, 'vertical');
      }
    }
    return root.virtualHeight!;
  }
  // 更新栈顶的父节点的 totalWidth
  private updateParent(stack: { node: TreeNode }[], number: number, type: 'horizontal' | 'vertical'): void {
    if (stack.length > 0) {
      const parent = stack[stack.length - 1];
      type === 'horizontal' ? (parent['totalWidth'] += number) : (parent['totalHeight'] += number);
    }
  }
  // 根据 ID 查询树中对应的节点，并返回其虚拟宽度
  public findNodeById(root: TreeNode, id: string): TreeNode | undefined {
    if (root.id === id) return root;
    for (const child of root.children) {
      const foundNode = this.findNodeById(child, id);
      if (foundNode) return foundNode; // 返回找到的节点
    }
    return undefined; // 如果找不到匹配的节点
  }
  // 判断是否为网关
  public isGateway(element) {
    const gatewayTypes = ['bpmn:ExclusiveGateway', 'bpmn:ParallelGateway', 'bpmn:InclusiveGateway', 'bpmn:EventBasedGateway'];
    if (element.wnType === typeConfluence) return false;
    return gatewayTypes.includes(element.type);
  }
  public formatCanvas(visited, modeling, elementRegistry) {
    let obj = visited.reduce((acc, item) => {
      let x = item.offset?.x - item.x || 0;
      if (!acc[x]) acc[x] = [];
      acc[x].push(elementRegistry.get(item.id));
      return acc;
    }, {});
    // 分组移动 优化性能
    for (const key in obj) obj.hasOwnProperty(key) && modeling.moveElements(obj[key], { x: Number(key), y: 0 });
  }
  public formatCanvas2(visited, modeling, elementRegistry) {
    let obj = visited.reduce((acc, item) => {
      let y = item.offset?.y - item.y || 0;
      if (!acc[y]) acc[y] = [];
      acc[y].push(elementRegistry.get(item.id));
      return acc;
    }, {});
    // 分组移动 优化性能
    for (const key in obj) obj.hasOwnProperty(key) && modeling.moveElements(obj[key], { x: 0, y: Number(key) });
  }
  public getParentOffsetById(data: any, id: string) {
    if (data.parentData) {
      if (data.parentData.id === id) {
        // 如果合流宽度为0 则x轴宽度和合流网关一致
        let offset = {
          x: data.parentData.offset.x + data.parentData.width / 2,
          y: data.parentData.offset.y,
        };
        return offset;
      }
      return this.getParentOffsetById(data.parentData, id);
    }
  }
  // 广度优先遍历树状结构
  public traverseTreeBFS(root: TreeNode, callback: (node: TreeNode) => void): void {
    let queue: TreeNode[] = [root]; // 初始化队列
    const processedNodes = new Set<string>(); // 用于跟踪已处理节点
    const AUTO_HEIGHT = 150;
    // 获取开始节点的虚拟高度
    while (queue.length > 0) {
      let current = queue.shift(); // 从队列中取出第一个元素
      if (current && !processedNodes.has(current.id)) {
        processedNodes.add(current.id); // 标记为已处理
        // 对开始节点外的元素进行偏移
        if (current.id != root.id) {
          let parentData = current.parentData;
          let n = 0;
          if (parentData) {
            // 遍历数组，遇到条件终止
            for (let i = 0; i < parentData.children.length; i++) {
              if (parentData.children[i].id === current.id) break;
              n += parentData.children[i].virtualWidth;
            }
          }
          let parentX = parentData.offset ? parentData.offset.x : parentData.x;
          let parentY = parentData.offset ? parentData.offset.y : parentData.y;
          // X轴坐标边界
          let minX = parentX - parentData.virtualWidth / 2;
          let currentVirtualWidth = current.virtualWidth / 2;
          if (parentData.virtualWidth > current.virtualWidth && parentData.children?.length === 1) currentVirtualWidth = parentData.virtualWidth / 2;
          let offset = {
            x: minX + currentVirtualWidth - (current.width - parentData.width) / 2 + n,
            y: parentY + AUTO_HEIGHT + current.height,
          };
          if (current.id.includes('_confluence')) {
            let id = current.id.replace('_confluence', '');
            let gatewayOffset = this.getParentOffsetById(current, id);
            offset = {
              x: gatewayOffset.x,
              y: parentY + AUTO_HEIGHT + current.height,
            };
          }
          current.offset = offset;
        }
        callback(current); // 执行操作
        current.children = current.children.map((children: any) => {
          return { ...children, parentData: { ...current } };
        });
        queue.push(...current.children); // 将子节点添加到队列中
      }
    }
  }

  // 广度优先遍历树状结构(纵向)
  public bpmnTraverseTreeBFS(root: TreeNode, callback: (node: TreeNode) => void, type: direction): void {
    let queue: TreeNode[] = [root]; // 初始化队列
    const AUTO_HEIGHT = 150;
    // 获取开始节点的虚拟高度
    while (queue.length > 0) {
      let current = queue.shift(); // 从队列中取出第一个元素
      if (current) {
        // 对开始节点外的元素进行偏移
        if (current.id != root.id) {
          let parentData = current.parentData;
          let n = 0;
          if (parentData) {
            // 遍历数组，遇到条件终止
            for (let i = 0; i < parentData.children.length; i++) {
              if (parentData.children[i].id === current.id) break;
              type === 'horizontal' ? (n += parentData.children[i].virtualHeight || 208) : (n += parentData.children[i].virtualWidth || 320);
            }
          }
          let parentX = parentData.offset ? parentData.offset.x : parentData.x;
          let parentY = parentData.offset ? parentData.offset.y : parentData.y;
          // X轴坐标边界
          if (type === 'horizontal') {
            let minY = parentY - parentData.virtualHeight / 2;
            let currentVirtualHeight = current.virtualHeight / 2;
            if (parentData.virtualHeight > current.virtualHeight && parentData.children?.length === 1) currentVirtualHeight = parentData.virtualHeight / 2;
            let offset = {
              x: parentX + AUTO_HEIGHT + current.width,
              y: minY + n + currentVirtualHeight + (parentData.height - current.height) / 2,
            };
            let level = current.level;
            current.offset = offset;
            current.level = level;
          } else {
            let minX = parentX - parentData.virtualWidth / 2;
            let currentVirtualWidth = current.virtualWidth / 2;
            if (parentData.virtualWidth > current.virtualWidth && parentData.children?.length === 1) currentVirtualWidth = parentData.virtualWidth / 2;
            let offset = {
              x: minX + n + currentVirtualWidth + (parentData.width - current.width) / 2,
              y: parentY + AUTO_HEIGHT + current.height,
            };
            let level = current.level;
            current.offset = offset;
            current.level = level;
          }
        }
        callback(current); // 执行操作
        let level = current?.level ?? 0;
        current.children = current.children.map((children: any) => {
          return { ...children, parentData: { ...current }, level: level + 1 };
        });
        queue.push(...current.children); // 将子节点添加到队列中
      }
    }
  }
  // 修改线条坐标
  public updateConnectionWaypoints(connect: any, modeling: any, type: direction) {
    let source = connect.source;
    let target = connect.target;
    let newWaypoints: any = [];
    if (type === 'vertical') {
      if (source.x < target.x) {
        newWaypoints = [
          { x: source.x + source.width / 2, y: source.y + source.height },
          { x: source.x + source.width / 2, y: target.y - 60 },
          { x: target.x + target.width / 2, y: target.y - 60 },
          { x: target.x + target.width / 2, y: target.y },
        ];
      } else if (source.x > target.x) {
        newWaypoints = [
          { x: source.x + source.width / 2, y: source.y + source.height },
          { x: source.x + source.width / 2, y: target.y - 60 },
          { x: target.x + target.width / 2, y: target.y - 60 },
          { x: target.x + target.width / 2, y: target.y },
        ];
      } else {
        newWaypoints = [
          { x: source.x + source.width / 2, y: source.y + source.height },
          { x: target.x + target.width / 2, y: target.y },
        ];
      }
    } else {
      // 横向
      if (source.y < target.y) {
        newWaypoints = [
          { x: source.x + source.width, y: source.y + source.height / 2 },
          { x: target.x - DEFAULT_CONNECT / 2, y: source.y + source.height / 2 },
          { x: target.x - DEFAULT_CONNECT / 2, y: target.y + target.height / 2 },
          { x: target.x, y: target.y + target.height / 2 },
        ];
      } else if (source.y > target.y) {
        newWaypoints = [
          { x: source.x + source.width, y: source.y + source.height / 2 },
          { x: target.x - DEFAULT_CONNECT / 2, y: source.y + source.height / 2 },
          { x: target.x - DEFAULT_CONNECT / 2, y: target.y + target.height / 2 },
          { x: target.x, y: target.y + target.height / 2 },
        ];
      } else {
        newWaypoints = [
          { x: source.x + source.width, y: source.y + source.height / 2 },
          { x: target.x, y: target.y + target.height / 2 },
        ];
      }
    }

    modeling.updateWaypoints(connect, newWaypoints);
  }
  // 判断元素与网关之间的垂直距离是否小于某个阈值
  public isWithinThresholdDel(target, source, threshold) {
    // 这里假设网关在上方，即网关的 y 坐标小于当前元素的 y 坐标
    let gatewayY = target.y;
    let sourceElementY = source.y;
    // 如果是合流节点 获取其所有的上一个节点 判断上一个节点的y轴最大值
    if (target.wnType === typeConfluence) {
      if (target.incoming?.length > 1) {
        let y = -Infinity;
        target.incoming.map((item: any) => {
          if (item?.source?.y > y) y = item.source.y;
        });
        return gatewayY - y <= threshold;
      }
    }
    return gatewayY - sourceElementY < threshold && gatewayY > sourceElementY;
  }
  public moveConnectedElements(connection: any, height?: any) {
    const stack: any = []; // 用于存储待处理的连接线
    const processedElements = new Set(); // 记录已经处理过的目标元素
    stack.push(connection); // 从给定的连接线开始
    while (stack.length > 0) {
      const currentConnection: any = stack.pop();
      const target = currentConnection.target;
      if (!target) continue; // 如果没有目标元素，跳过
      if (processedElements.has(target)) continue; // 如果目标元素已经处理过，跳过
      if (this.isWithinThresholdDel(target, currentConnection.source, height)) continue;
      processedElements.add(target);
      // 遍历目标元素的所有出线连接，并将它们压入栈
      const outgoingConnections: any = target.outgoing || [];
      for (const outgoingConnection of outgoingConnections) {
        stack.push(outgoingConnection); // 将所有关联的连接线压入栈中
      }
    }
    return Array.from(processedElements);
  }
  public getElementsByGateway(gateway: any) {
    const elementsMap = new Map();
    let allElements = this._allElement;
    function getList(list: any) {
      list.map((element: any) => {
        if (element.id === gateway.id + '_confluence') return;
        if (!elementsMap.has(element.id)) {
          elementsMap.set(element.id, element);
          let childrenList = NodeUtils.getNextElementList(element, allElements);
          getList(childrenList);
        }
        return;
      });
    }
    let list = NodeUtils.getNextElementList(gateway, allElements);
    getList(list);
    return Array.from(elementsMap.values());
  }
}
