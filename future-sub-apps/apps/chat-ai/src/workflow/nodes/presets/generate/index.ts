import type LogicFlow from '@logicflow/core';
import { i18n } from "@/locales/i18n";
const t = i18n.global.t;

import { BaseVueNodeModel, BaseVueNodeView, type INodeDefine, register } from '../../internal/node-registry';
import ElView from './index.vue';
import { type IGenerateComponent } from './property.vue';

export { type IGenerateComponent };

export const nodeDefine: INodeDefine = {
  id: 'generate-0001',
  key: 'Generate',
  type: 'Generate',
  name: t('flow.generate'),
  icon: 'lucide:binary',
  index: 3000,
};

export const getDataDefault = (): IGenerateComponent => ({
  component_name: `${nodeDefine.key}`,
  // inputs: [],
  // output: {
  //   content: '这段文字是一个智能助手的问候语，询问用户需要什么帮助。',
  //   reference: [],
  // },
  params: {
    temperature: 0.1,
    top_p: 0.3,
    frequency_penalty: 0.7,
    presence_penalty: 0.4,
    max_tokens: 512,
    prompt: t('flow.promptText', {'input': '{input}'}),
    cite: true,
    message_history_window_size: 12,
    llm_id: 'qwen2.5-instruct@Xinference',
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
