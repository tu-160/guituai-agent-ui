import nodeConfig from './config.js';
import { buildBitUUID } from '@/utils/uuid.js';

// const isEmpty = data => data === null || data === undefined || data === '';
const isEmptyArray = data => (Array.isArray(data) ? data.length === 0 : true);

export class NodeUtils {
  /**
   * 判断节点类型
   * @param {Node} node - 节点数据
   * @returns Boolean
   */
  static isConditionNode(node) {
    return node && node.type === 'condition';
  }
  static isInterflowNode(node) {
    return node && node.type === 'approver' && node.isInterflow;
  }
  static isBranchFlowNode(node) {
    return node && node.type === 'approver' && node.isBranchFlow;
  }
  static isStartNode(node) {
    return node && node.type === 'start';
  }
  static isGetDataNode(node) {
    return node && node.type === 'getData';
  }
  static isAddDataNode(node) {
    return node && node.type === 'addData';
  }
  static isUpdateDataNode(node) {
    return node && node.type === 'updateData';
  }
  static isDeleteDataNode(node) {
    return node && node.type === 'deleteData';
  }
  static isDataInterfaceNode(node) {
    return node && node.type === 'dataInterface';
  }
  static isMessageNode(node) {
    return node && node.type === 'message';
  }
  static isLaunchFlowNode(node) {
    return node && node.type === 'launchFlow';
  }
  /**
   * 创建指定节点
   * @param { String } type - 节点类型
   * @param { Object } previousNodeId - 父节点id
   * @returns { Object } 节点数据
   */
  static createNode(type, previousNodeId?) {
    let res = JSON.parse(JSON.stringify(nodeConfig[type]));
    res.nodeId = buildBitUUID();
    // if (type !== 'start' && type !== 'timer') res.properties.title += res.nodeId;
    res.prevId = previousNodeId;
    return res;
  }
  /**
   * 获取指定节点的父节点（前一个节点）
   * @param { String } prevId - 父节点id
   * @param { Object } processData - 流程图全部数据
   * @returns { Object } 父节点
   */
  static getPreviousNode(prevId, processData) {
    if (processData.nodeId === prevId) return processData;
    if (processData.childNode) {
      let r1 = this.getPreviousNode(prevId, processData.childNode);
      if (r1) {
        return r1;
      }
    }
    if (processData.conditionNodes) {
      for (let c of processData.conditionNodes) {
        let r2 = this.getPreviousNode(prevId, c);
        if (r2) {
          return r2;
        }
      }
    }
  }

  /**
   * 删除节点
   * @param { Object  } nodeData - 被删除节点的数据
   * @param { Object  } processData - 流程图的所有节点数据
   */
  static deleteNode(nodeData, processData, checkEmpty = true) {
    let prevNode = this.getPreviousNode(nodeData.prevId, processData);
    if (checkEmpty && prevNode.type === 'empty') {
      if (this.isConditionNode(nodeData) || this.isInterflowNode(nodeData) || this.isBranchFlowNode(nodeData)) {
        const willDelBranch = prevNode.conditionNodes.length === 2;
        const target = willDelBranch ? prevNode : nodeData;
        this.deleteNode(target, processData, willDelBranch);
      } else {
        if (isEmptyArray(prevNode.conditionNodes)) {
          this.deleteNode(prevNode, processData);
        }
        this.deleteNode(nodeData, processData, false);
      }
      // this.deleteNode( prevNode, processData )
      // !this.isConditionNode(nodeData) && this.deleteNode(nodeData, processData)
      return;
    }
    let concatChild = (prev, delNode) => {
      prev.childNode = delNode.childNode;
      isEmptyArray(prev.conditionNodes) && (prev.conditionNodes = delNode.conditionNodes);
      prev.childNode && (prev.childNode.prevId = prev.nodeId);
      prev.conditionNodes && prev.conditionNodes.forEach(c => (c.prevId = prev.nodeId));
    };
    if (this.isConditionNode(nodeData) || this.isInterflowNode(nodeData) || this.isBranchFlowNode(nodeData)) {
      let cons = prevNode.conditionNodes;
      let index = cons.findIndex(c => c.nodeId === nodeData.nodeId);
      if (cons.length > 2) {
        cons.splice(index, 1);
      } else {
        let anotherCon = cons[+!index];
        delete prevNode.conditionNodes;
        delete prevNode.conditionType;
        if (prevNode.childNode) {
          let endNode = anotherCon;
          while (endNode.childNode) {
            endNode = endNode.childNode;
          }
          endNode.childNode = prevNode.childNode;
          endNode.childNode.prevId = endNode.nodeId;
        }
        concatChild(prevNode, anotherCon);
        if (prevNode.childNode && prevNode.childNode.type === 'empty') {
          this.deleteNode(prevNode.childNode, prevNode);
        }
      }
      // 重新编排优先级
      cons.forEach((c, i) => (c.properties.priority = i));
      return;
    }
    concatChild(prevNode, nodeData);
  }
  // TODO:
  // static copyNode ( nodeData, processData ) {
  //   let prevNode = this.getPreviousNode( nodeData.prevId, processData )
  //   let index = prevNode.conditionNodes.findIndex( c => c.nodeId === nodeData.nodeId )

  // }
  /**
   * 添加审计节点（普通节点 approver）
   * @param { Object } data - 目标节点数据，在该数据节点之后添加审计节点
   * @param { Object } isBranchAction - 目标节点数据，是否是条件分支
   * @param { Object } newChildNode - 传入的新的节点 用户操作均为空  删除操作/添加抄送人 会传入该参数 以模拟添加节点
   */
  static addApprovalNode(data, isBranchAction, newChildNode: any = undefined) {
    let oldChildNode = data.childNode;
    newChildNode = newChildNode || this.createNode('addData', data.nodeId);
    data.childNode = newChildNode;
    if (oldChildNode) {
      newChildNode.childNode = oldChildNode;
      oldChildNode.prevId = newChildNode.nodeId;
    }
    let conditionNodes = data.conditionNodes;
    if (Array.isArray(conditionNodes) && !isBranchAction && conditionNodes.length) {
      newChildNode.conditionNodes = conditionNodes.map(c => {
        c.prevId = newChildNode.nodeId;
        return c;
      });
      delete data.conditionNodes;
    }
    if (oldChildNode && oldChildNode.type === 'empty' && newChildNode.type !== 'empty' && oldChildNode.conditionNodes.length === 0) {
      this.deleteNode(oldChildNode, data);
    }
  }
  /**
   * 添加空节点
   * @param { Object } data - 空节点的父级节点
   * @return { Object } emptyNode - 空节点数据
   */
  static addEmptyNode(data, _isNew) {
    let emptyNode = this.createNode('empty', data.nodeId);
    this.addApprovalNode(data, true, emptyNode);
    return emptyNode;
  }

  static addAddDataNode(data, isBranchAction) {
    this.addApprovalNode(data, isBranchAction, this.createNode('addData', data.nodeId));
  }
  static addUpdateDataNode(data, isBranchAction) {
    this.addApprovalNode(data, isBranchAction, this.createNode('updateData', data.nodeId));
  }
  static addDeleteDataNode(data, isBranchAction) {
    this.addApprovalNode(data, isBranchAction, this.createNode('deleteData', data.nodeId));
  }
  static addDataInterfaceNode(data, isBranchAction) {
    this.addApprovalNode(data, isBranchAction, this.createNode('dataInterface', data.nodeId));
  }
  static addMessageNode(data, isBranchAction) {
    this.addApprovalNode(data, isBranchAction, this.createNode('message', data.nodeId));
  }
  static addLaunchFlowNode(data, isBranchAction) {
    this.addApprovalNode(data, isBranchAction, this.createNode('launchFlow', data.nodeId));
  }
  /**
   * 添加条件节点 condition 通过点击添加条件进入该操作
   * @param { Object } data - 目标节点所在分支数据，在该分支最后添加条件节点
   */
  static appendConditionNode(data) {
    const conditions = data.conditionNodes;
    let node = this.createNode('condition', data.nodeId);
    let defaultNodeIndex = conditions.findIndex(node => node.properties.isDefault);
    node.properties.priority = conditions.length;
    if (defaultNodeIndex > -1) {
      conditions.splice(-1, 0, node); // 插在倒数第二个
      //更新优先级
      node.properties.priority = conditions.length - 2;
      conditions[conditions.length - 1].properties.priority = conditions.length - 1;
    } else {
      conditions.push(node);
    }
    this.setDefaultCondition(node, data);
  }
  // 添加分流/合流 branch
  static appendInterflowNode(data) {
    const conditions = data.conditionNodes;
    let node = this.createNode('interflow', data.nodeId);
    let defaultNodeIndex = conditions.findIndex(node => node.properties.isDefault);
    node.properties.priority = conditions.length;
    if (defaultNodeIndex > -1) {
      conditions.splice(-1, 0, node); // 插在倒数第二个
      //更新优先级
      node.properties.priority = conditions.length - 2;
      conditions[conditions.length - 1].properties.priority = conditions.length - 1;
    } else {
      conditions.push(node);
    }
  }
  // 添加选择分支 branch
  static appendBranchFlowNode(data) {
    const conditions = data.conditionNodes;
    let node = this.createNode('branchFlow', data.nodeId);
    let defaultNodeIndex = conditions.findIndex(node => node.properties.isDefault);
    node.properties.priority = conditions.length;
    if (defaultNodeIndex > -1) {
      conditions.splice(-1, 0, node); // 插在倒数第二个
      //更新优先级
      node.properties.priority = conditions.length - 2;
      conditions[conditions.length - 1].properties.priority = conditions.length - 1;
    } else {
      conditions.push(node);
    }
  }
  /**
   * 添加条件分支 branch
   * @param { Object } data - 目标节点所在节点数据，在该节点最后添加分支节点
   */
  static appendBranch(data, isBottomBtnOfBranch) {
    // isBottomBtnOfBranch 用户点击的是分支树下面的按钮
    let nodeData = data;
    // 由于conditionNodes是数组 不能添加下级分支 故在两个分支树之间添加一个不会显示的正常节点 兼容此种情况
    if (Array.isArray(data.conditionNodes) && data.conditionNodes.length) {
      if (isBottomBtnOfBranch) {
        // 添加一个模拟用的空白节点并返回这个节点，作为新分支的父节点
        nodeData = this.addEmptyNode(nodeData, true);
      } else {
        let emptyNode = this.addEmptyNode(nodeData, true);
        emptyNode.conditionNodes = nodeData.conditionNodes;
        emptyNode.conditionType = 'condition';
        emptyNode.conditionNodes.forEach(n => {
          n.prevId = emptyNode.nodeId;
        });
      }
    }
    let conditionNodes = [this.createNode('condition', nodeData.nodeId), this.createNode('condition', nodeData.nodeId)].map((c, i) => {
      c.properties.priority = i;
      return c;
    });
    nodeData.conditionNodes = conditionNodes;
    nodeData.conditionType = 'condition';
  }
  static appendInterflowBranch(data, isBottomBtnOfBranch) {
    // isBottomBtnOfBranch 用户点击的是分支树下面的按钮
    let nodeData = data;
    // 由于conditionNodes是数组 不能添加下级分支 故在两个分支树之间添加一个不会显示的正常节点 兼容此种情况
    if (Array.isArray(data.conditionNodes) && data.conditionNodes.length) {
      if (isBottomBtnOfBranch) {
        // 添加一个模拟用的空白节点并返回这个节点，作为新分支的父节点
        nodeData = this.addEmptyNode(nodeData, true);
      } else {
        let emptyNode = this.addEmptyNode(nodeData, true);
        emptyNode.conditionNodes = nodeData.conditionNodes;
        emptyNode.conditionType = 'interflow';
        emptyNode.conditionNodes.forEach(n => {
          n.prevId = emptyNode.nodeId;
        });
      }
    }
    let conditionNodes = [this.createNode('interflow', nodeData.nodeId), this.createNode('interflow', nodeData.nodeId)];
    nodeData.conditionNodes = conditionNodes;
    nodeData.conditionType = 'interflow';
  }
  // 新增选择分支节点
  static appendBranchFlowBranch(data, isBottomBtnOfBranch) {
    // isBottomBtnOfBranch 用户点击的是分支树下面的按钮
    let nodeData = data;
    // 由于conditionNodes是数组 不能添加下级分支 故在两个分支树之间添加一个不会显示的正常节点 兼容此种情况
    if (Array.isArray(data.conditionNodes) && data.conditionNodes.length) {
      if (isBottomBtnOfBranch) {
        // 添加一个模拟用的空白节点并返回这个节点，作为新分支的父节点
        nodeData = this.addEmptyNode(nodeData, true);
      } else {
        let emptyNode = this.addEmptyNode(nodeData, true);
        emptyNode.conditionNodes = nodeData.conditionNodes;
        emptyNode.conditionType = 'branchFlow';
        emptyNode.conditionNodes.forEach(n => {
          n.prevId = emptyNode.nodeId;
        });
      }
    }
    let conditionNodes = [this.createNode('branchFlow', nodeData.nodeId), this.createNode('branchFlow', nodeData.nodeId)];
    nodeData.conditionNodes = conditionNodes;
    nodeData.conditionType = 'branchFlow';
  }
  /**
   * 重设节点优先级（条件节点）
   * @param {Node} cNode - 当前节点
   * @param {Number} oldPriority - 替换前的优先级（在数组中的顺序）
   * @param {Node} processData - 整个流程图节点数据
   */
  static resortPriorityByCNode(cNode, oldPriority, processData) {
    // 当前节点为默认节点 取消修改优先级
    if (cNode.properties.isDefault) {
      cNode.properties.priority = oldPriority;
      return;
    }
    let prevNode = this.getPreviousNode(cNode.prevId, processData);
    let newPriority = cNode.properties.priority;
    // 替换节点为默认节点 取消修改优先级
    if (prevNode.conditionNodes[newPriority].properties.isDefault) {
      cNode.properties.priority = oldPriority;
      return;
    }
    let delNode = prevNode.conditionNodes.splice(newPriority, 1, cNode)[0];
    delNode.properties.priority = oldPriority;
    prevNode.conditionNodes[oldPriority] = delNode;
  }

  /**
   * 提升条件节点优先级——排序在前
   * @param { Object } data - 目标节点数据
   * @param { Object  } processData - 流程图的所有节点数据
   */
  static increasePriority(data, processData) {
    if (data.properties.isDefault) {
      // 默认节点不能修改优先级
      return;
    }
    // 分支节点数据 包含该分支所有的条件节点
    let prevNode = this.getPreviousNode(data.prevId, processData);
    let branchData = prevNode.conditionNodes;
    let index = branchData.findIndex(c => c === data);
    if (index) {
      // 和前一个数组项交换位置 Array.prototype.splice会返回包含被删除的项的集合（数组）
      branchData[index - 1].properties.priority = index;
      branchData[index].properties.priority = index - 1;
      branchData[index - 1] = branchData.splice(index, 1, branchData[index - 1])[0];
    }
  }
  /**
   * 降低条件节点优先级——排序在后
   * @param { Object } data - 目标节点数据
   * @param { Object  } processData - 流程图的所有节点数据
   */
  static decreasePriority(data, processData) {
    // 分支节点数据 包含该分支所有的条件节点
    let prevNode = this.getPreviousNode(data.prevId, processData);
    let branchData = prevNode.conditionNodes;
    let index = branchData.findIndex(c => c.nodeId === data.nodeId);
    if (index < branchData.length - 1) {
      let lastNode = branchData[index + 1];
      if (lastNode.properties.isDefault) {
        // 默认节点不能修改优先级
        return;
      }
      // 和后一个数组项交换位置 Array.prototype.splice会返回包含被删除的项的集合（数组）
      lastNode.properties.priority = index;
      branchData[index].properties.priority = index + 1;
      branchData[index + 1] = branchData.splice(index, 1, branchData[index + 1])[0];
    }
  }
  /**
   * 当有其他条件节点设置条件后 检查并设置最后一个节点为默认节点
   * @param {Node} cNode  - 当前节点
   * @param {Node} processData - 整个流程图节点数据或父级节点数据
   */
  static setDefaultCondition(cNode, processData) {
    const DEFAULT_TEXT = '其他情况进入此流程';
    const conditions = this.getPreviousNode(cNode.prevId, processData).conditionNodes;
    const hasCondition = node => node.properties && (node.properties.initiator || !isEmptyArray(node.properties.conditions));
    const clearDefault = node => {
      node.properties.isDefault = false;
      node.content === DEFAULT_TEXT && (node.content = '请设置条件');
    };
    const setDefault = node => {
      node.properties.isDefault = true;
      node.content = DEFAULT_TEXT;
    };
    let count = 0;
    conditions.slice(0, -1).forEach(node => {
      hasCondition(node) && count++;
      clearDefault(node);
    });
    const lastNode = conditions[conditions.length - 1];
    count > 0 && !hasCondition(lastNode) ? setDefault(lastNode) : clearDefault(lastNode);
  }
  /**
   * 校验单个节点必填项完整性
   * @param {Node} node - 节点数据
   */
  static checkNode(node, _parent?) {
    let valid = true;
    const props = node.properties;
    this.isStartNode(node) &&
      ((props.integrateType == 1 && !props.formId) ||
        (props.integrateType == 2 && (!props.cron || !props.startTime)) ||
        (props.integrateType == 3 && !props.formFieldList.length)) &&
      (valid = false);
    this.isGetDataNode(node) && !props.formId && (valid = false);
    this.isAddDataNode(node) && !props.formId && (valid = false);
    this.isUpdateDataNode(node) && !props.formId && (valid = false);
    this.isDeleteDataNode(node) && !props.formId && (valid = false);
    this.isDataInterfaceNode(node) && !props.formId && (valid = false);
    this.isLaunchFlowNode(node) && !props.flowId && (valid = false);
    this.isMessageNode(node) && (!props.msgId || !props.msgUserIds.length) && (valid = false);
    return valid;
  }
  /**
   * 判断所有节点是否信息完整
   * @param {Node} processData - 整个流程图数据
   * @returns {Boolean}
   */
  static checkAllNode(processData) {
    let valid = true;
    const loop = (node, callback, parent?) => {
      !this.checkNode(node, parent) && callback();
      if (node.childNode) loop(node.childNode, callback, parent);
      if (!isEmptyArray(node.conditionNodes)) {
        node.conditionNodes.forEach(n => loop(n, callback, node));
      }
    };
    loop(processData, () => (valid = false));
    return valid;
  }
}

/**
 * 添模拟数据
 */
export function getMockData(type = 1) {
  let startNode = NodeUtils.createNode('start');
  startNode.properties.integrateType = type;
  if (type == 2) {
    startNode.content = '请设置定时触发器';
    startNode.properties.title = '定时触发设置';
    startNode.childNode = NodeUtils.createNode('getData', startNode.nodeId);
  }
  if (type == 3) {
    startNode.content = '请设置触发方式';
    startNode.properties.title = 'webhook触发设置';
  }
  return startNode;
}
