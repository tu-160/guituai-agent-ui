import type LogicFlow from '@logicflow/core';
import { i18n } from "@/locales/i18n";
const t = i18n.global.t;

import { BaseVueNodeModel, BaseVueNodeView, type INodeDefine, register } from '../../internal/node-registry';
import ElView from './index.vue';
import { type IConcentratorComponent } from './property.vue';

export { type IConcentratorComponent };

export const nodeDefine: INodeDefine = {
  id: 'concentrator-0001',
  key: 'Concentrator',
  type: 'Concentrator',
  name: t('flow.concentrator'),
  icon: 'lucide:merge',
  index: 11_000,
};

export const getDataDefault = (): IConcentratorComponent => ({
  component_name: `${nodeDefine.key}`,
  params: {},
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
