import type LogicFlow from '@logicflow/core';
import { i18n } from "@/locales/i18n";
const t = i18n.global.t;

import { BaseVueNodeModel, BaseVueNodeView, type INodeDefine, register } from '../../internal/node-registry';
import ElView from './index.vue';
import { type IRewriteComponent } from './property.vue';

export { type IRewriteComponent };

export const nodeDefine: INodeDefine = {
  id: 'rewrite-0001',
  key: 'RewriteQuestion',
  type: 'rewrite-node',
  name: t('flow.rewriteQuestion'),
  icon: 'lucide:pencil-ruler',
  index: 8000,
};

export const getDataDefault = (): IRewriteComponent => ({
  component_name: `${nodeDefine.key}`,
  params: {
    frequency_penalty: 0.7,
    llm_id: 'qwen2.5-instruct@Xinference',
    max_tokens: 512,
    presence_penalty: 0.4,
    temperature: 0.5,
    top_p: 0.5,
    frequencyPenaltyEnabled: false,
    maxTokensEnabled: false,
    loop: 1,
    presencePenaltyEnabled: false,
    temperatureEnabled: false,
    topPEnabled: false,
  },
});

export default function registerConnect(lf: LogicFlow) {
  // 注册自定义 vue 节点
  register(
    {
      type: `${nodeDefine.type}`,
      component: ElView,
      view: BaseVueNodeView,
      model: BaseVueNodeModel,
    },
    lf,
  );
}
