import type LogicFlow from '@logicflow/core';
import { i18n } from "@/locales/i18n";
const t = i18n.global.t;

import { BaseVueNodeModel, BaseVueNodeView, type INodeDefine, register } from '../../internal/node-registry';
import ElView from './index.vue';
import { type ICategorizeComponent } from './property.vue';

export { type ICategorizeComponent };

export const nodeDefine: INodeDefine = {
  id: 'categorize-0001',
  key: 'Categorize',
  type: 'categorize-node',
  name: t('flow.categorize'),
  icon: 'lucide:chart-bar-stacked',
  index: 5000,
};

export const getDataDefault = (): ICategorizeComponent => ({
  component_name: `${nodeDefine.key}`,
  params: {
    frequency_penalty: 0.7,
    llm_id: 'qwen2.5-instruct@Xinference',
    max_tokens: 512,
    message_history_window_size: 12,
    presence_penalty: 0.4,
    temperature: 0.5,
    top_p: 0.5,
    query: [],
    category_description: {},
  },
});

export default function registerConnect(lf: LogicFlow) {
  class CustomNodeModel extends BaseVueNodeModel {}

  // 注册节点
  register(
    {
      type: `${nodeDefine.type}`,
      component: ElView,
      view: BaseVueNodeView,
      model: CustomNodeModel,
    },
    lf,
  );
}
