import type LogicFlow from '@logicflow/core';
import { i18n } from "@/locales/i18n";
const t = i18n.global.t;

import { BaseVueNodeModel, BaseVueNodeView, type INodeDefine, register } from '../../internal/node-registry';
import ElView from './index.vue';
import { type INoteedage } from './property.vue';

export { type INoteedage };

export const nodeDefine: INodeDefine = {
  id: 'note-0001',
  key: 'Note',
  type: 'Note',
  name: t('flow.note'),
  description: i18n.global.t('flow.noteDescription'),
  icon: 'lucide:book-open-text',
  index: 2000,
};

export const getDataDefault = () =>
  ({
    component_name: `${nodeDefine.key}`,
    params: {
      id: '',
        note_text: '',
    },
  }) as INoteedage;

export default function registerConnect(lf: LogicFlow) {
  class CustomNode extends BaseVueNodeModel {}

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
