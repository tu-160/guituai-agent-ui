import { EventType } from '@logicflow/core';
import { has } from 'lodash-es';

import { getBizComponentKey } from '../helper/index';

interface INodePropertiesData {
  key: string; // 节点key
  label: string; // 节点名称 节点名称_序号
  value: string; // 节点ID 类型+唯一id
  form: any; // 表单数据(业务数据)
}

export const mixin = {
  inject: ['getNode', 'getGraph', 'logicFlowInstance'],
  data() {
    return {
      width: 220,
      height: 40,
      properties: {} as any,
    };
  },
  mounted() {
    const node = (this as any).getNode();
    const graph = (this as any).getGraph();
    node.setProperty('width', (this as any).width);
    node.setProperty('height', (this as any).height);
    node.setProperty('rawWidth', (this as any).width);
    node.setProperty('rawHeight', (this as any).height);
    node.setProperty('component_id', getBizComponentKey(node.getData()));
    const { properties } = node.getData();
    (this as any).properties = properties;

    // 监听属性变化
    graph.eventCenter.on(EventType.NODE_PROPERTIES_CHANGE, (eventData: any) => {
      if (eventData.id === node.id) {
        // 节点属性变化
        (this as any).properties = eventData.properties;
      }
    });
  },
  methods: {
    /**
     * 创建节点信息
     */
    createNodeData(formInfo: any, nodeDefine: any) {
      const node = (this as any).getNode();
      const graph = (this as any).getGraph();
      const { id, properties } = node.getData();
      if (!has(properties, 'data') && formInfo) {
        // 获取所有同类型的节点信息
        const nodes = graph.nodes;
        const idNameArr = nodes
          .filter((item: any) => item.type === nodeDefine.type)
          .map((item: any) => {
            const labelArr = (item.properties?.data?.label || '').split('_');
            return labelArr.length > 0 && !Number.isNaN(Number.parseFloat(labelArr[1])) ? Number.parseFloat(labelArr[1]) : null;
          })
          .filter((item: any) => item !== null)
          .sort((a: any, b: any) => a - b);

        let maxNum = 0;
        for (let i = 0; i < idNameArr.length; i++) {
          if (i === 0) maxNum = idNameArr[0];
          if (i === idNameArr.length - 1) continue;
          if (idNameArr[i] + 1 === idNameArr[i + 1]) {
            maxNum = idNameArr[i + 1];
          } else {
            break;
          }
        }

        const name = idNameArr.length > 0 ? `${nodeDefine.name}_${maxNum + 1}` : `${nodeDefine.name}_0`;
        const data: INodePropertiesData = {
          key: nodeDefine.key,
          label: name,
          value: id,
          form: formInfo,
        };
        node.setProperty('data', data);
      }
    },
    /**
     * 删除节点信息
     */
    delNode() {
      const node = (this as any).getNode();
      (this as any).logicFlowInstance.deleteNode(node.id);
    },
    /**
     * 克隆节点信息
     */
    cloneNode() {
      const node = (this as any).getNode();
      (this as any).logicFlowInstance.cloneNode(node.id);
    },
    /**
     * 设置节点信息
     */
    setNodeProperty(key: string, value: any) {
      const node = (this as any).getNode();
      node.setProperty(key, value);
    },
  },
};
