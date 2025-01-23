import type LogicFlow from '@logicflow/core';
import { i18n } from "@/locales/i18n";
const t = i18n.global.t;

import { BaseVueNodeModel, BaseVueNodeView, type INodeDefine, register } from '../../internal/node-registry';
import ElView from './index.vue';
import { type ISwitchComponent } from './property.vue';

export { type ISwitchComponent };

export const nodeDefine: INodeDefine = {
  id: 'switch-0001',
  key: 'Switch',
  type: 'Switch',
  name: t('flow.switch'),
  description: i18n.global.t('flow.switchDescription'),
  icon: 'lucide:arrow-right-left',
  index: 9000,
};

export const getDataDefault = (): ISwitchComponent => ({
  component_name: `${nodeDefine.key}`,
  params: {
    conditions: [],
    end_cpn_id: '',
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
