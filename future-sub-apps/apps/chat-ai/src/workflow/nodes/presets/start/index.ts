import type LogicFlow from '@logicflow/core';

import type { IStart } from './property.vue';

import { BaseVueNodeModel, BaseVueNodeView, type INodeDefine, register } from '../../internal/node-registry';
import ElView from './index.vue';
import { i18n } from "@/locales/i18n";

export { type IStart };

export const nodeDefine: INodeDefine = {
  id: 'start-0001',
  key: 'Begin',
  type: 'start-node',
  name: i18n.global.t('flow.begin'),
  icon: 'lucide:square-play',
  index: 1000,
  isHidden: true,
};

export const getDataDefault = () =>
  ({
    component_name: `${nodeDefine.key}`,
    params: {
      // prologue: '你好！我是你的助理，有什么可以帮到你的吗？',
    },
  }) as IStart;

export default function registerConnect(lf: LogicFlow) {
  class CustomNode extends BaseVueNodeModel {
    override getDefaultAnchor() {
      const { id, x, y, width } = this;
      const anchors = [];
      anchors.push({
        x: x + width / 2,
        y,
        id: `${id}_outgoing`,
        type: 'outgoing',
      });
      return anchors;
    }
  }

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
