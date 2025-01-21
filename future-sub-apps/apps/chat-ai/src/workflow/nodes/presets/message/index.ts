import type LogicFlow from '@logicflow/core';
import { i18n } from "@/locales/i18n";
const t = i18n.global.t;

import { BaseVueNodeModel, BaseVueNodeView, type INodeDefine, register } from '../../internal/node-registry';
import ElView from './index.vue';
import { type IMessageComponent } from './property.vue';

export { type IMessageComponent };

export const nodeDefine: INodeDefine = {
  id: 'message-0001',
  key: 'Message',
  type: 'message-node',
  name: t('flow.message'),
  icon: 'lucide:mail',
  index: 5000,
};

export const getDataDefault = (): IMessageComponent => ({
  component_name: `${nodeDefine.key}`,
  params: {
    messages: [],
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
