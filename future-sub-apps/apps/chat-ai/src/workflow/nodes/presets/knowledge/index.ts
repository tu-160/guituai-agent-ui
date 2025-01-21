import type LogicFlow from '@logicflow/core';
import { i18n } from "@/locales/i18n";
const t = i18n.global.t;

import { BaseVueNodeModel, BaseVueNodeView, type INodeDefine, register } from '../../internal/node-registry';
import ElView from './index.vue';
import { type IKnowledage } from './property.vue';

export { type IKnowledage };

export const nodeDefine: INodeDefine = {
  id: 'retrieval-0001',
  key: 'Retrieval',
  type: 'retrieval-node',
  name: t('flow.retrieval'),
  icon: 'lucide:book-open-text',
  index: 2000,
};

export const getDataDefault = () =>
  ({
    component_name: `${nodeDefine.key}`,
    params: {
      id: '',
      empty_response: '',
      kb_ids: [] as string[],
      similarity_threshold: 0.2, // 相似度阈值
      keywords_similarity_weight: 0.3, // 关键字相似度权重
      rerank_id: '', // Rerank模型
      top_k: 1024,
      top_n: 8,
      query: [],
    },
  }) as IKnowledage;

export default function registerConnect(lf: LogicFlow) {
  class CustomNode extends BaseVueNodeModel {}

  // 注册节点
  register(
    {
      type: `${nodeDefine.type}`,
      component: ElView,
      view: BaseVueNodeView,
      model: CustomNode,
    },
    lf,
  );
}
