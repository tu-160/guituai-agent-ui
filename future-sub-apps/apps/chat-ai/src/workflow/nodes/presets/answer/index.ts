import type LogicFlow from '@logicflow/core';

import { BaseVueNodeModel, BaseVueNodeView, type INodeDefine, register } from '../../internal/node-registry';
import ElView from './index.vue';
import { type IAnswerComponent } from './property.vue';
import { loadLanguageAsync, i18n } from "@/locales/i18n";
const t = i18n.global.t;

export { type IAnswerComponent };



// 节点定义
export const nodeDefine: INodeDefine = {
  id: 'answer-0001',
  key: 'Answer',
  type: 'Answer',
  name: t('chat_index.agentDialog'),
  icon: 'lucide:message-circle-more',
  index: 4000,
};

// 获取默认表单默认数据
export const getDataDefault = (): IAnswerComponent => ({
  component_name: `${nodeDefine.key}`,
  params: {},
});

export default function registerConnect(lf: LogicFlow) {
  class CustomNode extends BaseVueNodeModel {
    // 节点有不一样的地方可以在这里拓展
  }

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
