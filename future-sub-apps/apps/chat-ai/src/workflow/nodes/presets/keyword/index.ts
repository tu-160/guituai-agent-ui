import type LogicFlow from '@logicflow/core';
import { i18n } from "@/locales/i18n";
const t = i18n.global.t;

import { BaseVueNodeModel, BaseVueNodeView, type INodeDefine, register } from '../../internal/node-registry';
import ElView from './index.vue';
import { type IKeywordComponent } from './property.vue';

export { type IKeywordComponent };

export const nodeDefine: INodeDefine = {
  id: 'keyword-0001',
  key: 'KeywordExtract',
  type: 'KeywordExtract',
  name: t('flow.keywordExtract'),
  icon: 'lucide:file-key',
  index: 9000,
};

export const getDataDefault = (): IKeywordComponent => ({
  component_name: `${nodeDefine.key}`,
  params: {
    frequency_penalty: 0.7,
    llm_id: 'qwen2.5-instruct@Xinference',
    max_tokens: 512,
    message_history_window_size: 12,
    presence_penalty: 0.4,
    temperature: 0.5,
    top_p: 0.5,
    top_N: 4,
    query: [],
  },
});

export default function registerConnect(lf: LogicFlow) {
  class CustomNode extends BaseVueNodeModel {}

  // 注册自定义 vue 节点
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
