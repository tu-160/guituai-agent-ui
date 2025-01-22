import type LogicFlow from '@logicflow/core';
import { i18n } from "@/locales/i18n";
const t = i18n.global.t;

import { BaseVueNodeModel, BaseVueNodeView, type INodeDefine, register } from '../../internal/node-registry';
import ElView from './index.vue';
import { type ITemplateComponent } from './property.vue';

export { type ITemplateComponent };

export const nodeDefine: INodeDefine = {
  id: 'template-0001',
  key: 'Template',
  type: 'Template',
  name: t('flow.template'),
  icon: 'lucide:layout-template',
  index: 90_000,
};

export const getDataDefault = (): ITemplateComponent => ({
  component_name: `${nodeDefine.key}`,
  params: {
    content: '',
    parameters: [],
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
