import type { LogicFlow, Model, Point } from '@logicflow/core';

import type { Ref } from 'vue';
import { reactive } from 'vue';

import { EventType } from '@logicflow/core';

// 返回值
export type EdgeConfig = {
  endPoint?: Point;
  id?: string;
  properties?: Record<string, unknown>;
  sourceNodeId: string;
  startPoint?: Point;
  targetNodeId: string;
  text?: string;
  type?: string;
};

export function useHandleFlow(currentNodeInfo?: Ref<Model.BaseModel>, lfInstance?: Ref<LogicFlow>) {
  const modelRt = reactive({
    nodesPropertyArr: [] as any[],
    nodesPropertyDataArr: [] as any[], // 节点属性数据中的Data
  });

  const updateProperty = () => {
    if (!currentNodeInfo || !lfInstance) return;

    lfInstance.value.setProperties(currentNodeInfo.value.id, {
      width: 200,
      height: 200,
    });
  };

  /**
   * 获取画板模型
   * @returns
   */
  const getGraph = () => {
    if (!lfInstance) return;
    return lfInstance.value.graphModel;
  };

  const addEdge = (edgeConfig: EdgeConfig) => {
    if (!lfInstance) return;
    lfInstance.value.addEdge(edgeConfig);
  };

  const getEdgeModels = (sourceNodeId?: string, targetNodeId?: string) => {
    if (!sourceNodeId || !targetNodeId) return;
    if (!lfInstance) return;
    // 获取起点为节点A，终点为节点B的边
    return lfInstance.value.getEdgeModels({
      sourceNodeId,
      targetNodeId,
    });
  };

  const deleteEdge = (edgeId: string) => {
    if (!lfInstance) return;
    return lfInstance.value.deleteEdge(edgeId);
  };

  /**
   * 获取所有节点信息
   * @returns
   */
  const getNodesInfoArr = () => {
    const grap = getGraph();
    if (!grap) return;
    const infoArr = grap.nodes.map((node: any) => node.properties);
    modelRt.nodesPropertyArr = infoArr;
    modelRt.nodesPropertyDataArr = infoArr.map((item: any) => item.data).filter((item: any) => !!item);
    return infoArr;
  };

  const init = () => {
    if (!lfInstance) return;
    // 节点添加/删除事件/属性变动事件， 获取所有节点信息
    lfInstance.value.on(`${EventType.NODE_DND_ADD},${EventType.NODE_DELETE},${EventType.NODE_PROPERTIES_CHANGE}`, () => {
      // console.log(`${EventType.NODE_DND_ADD},${EventType.NODE_DELETE}`, data);
      getNodesInfoArr();
    });
    getNodesInfoArr();
  };

  init();
  return { modelRt, updateProperty, getNodesInfoArr, addEdge, getEdgeModels, deleteEdge };
}
