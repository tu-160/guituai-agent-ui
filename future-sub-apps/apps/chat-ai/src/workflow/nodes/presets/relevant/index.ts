import type LogicFlow from '@logicflow/core';
import { i18n } from "@/locales/i18n";
const t = i18n.global.t;

import { BaseVueNodeModel, BaseVueNodeView, type INodeDefine, register } from '../../internal/node-registry';
import ElView from './index.vue';
import { type IRelevantComponent } from './property.vue';

export { type IRelevantComponent };

export const nodeDefine: INodeDefine = {
  id: 'relevant-0001',
  key: 'Relevant',
  type: 'Relevant',
  name: t('flow.relevant'),
  description: i18n.global.t('flow.relevantDescription'),
  icon: 'lucide:equal-approximately',
  index: 5000,
};

export const getDataDefault = (): IRelevantComponent => ({
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
    no: '',
    presencePenaltyEnabled: false,
    temperatureEnabled: false,
    topPEnabled: false,
    yes: '',
  },
});

export default function registerConnect(lf: LogicFlow) {
  class CustomNode extends BaseVueNodeModel {
    // override getDefaultAnchor() {
    //   const { id, x, y, width, height, properties } = this;
    //   const { a1Top, a2Top } = properties as { a1Top: number; a2Top: number };
    //   const anchors = [];
    //   anchors.push(
    //     {
    //       x: x - width / 2,
    //       y,
    //       id: `${id}_incoming`,
    //       type: 'incoming',
    //     },
    //     {
    //       x: x + width / 2,
    //       y: y - height / 2 + a1Top + 10,
    //       id: `${id}_outgoing_yes`,
    //       type: 'outgoing',
    //       tag: 'yes',
    //     },
    //     {
    //       x: x + width / 2,
    //       y: y - height / 2 + a2Top + 10,
    //       id: `${id}_outgoing_no`,
    //       type: 'outgoing',
    //       tag: 'no',
    //     },
    //   );
    //
    //   return anchors;
    // }
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
