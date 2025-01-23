import { VueNodeModel } from '@logicflow/vue-node-registry';

import { RestrictedUpstreamMap } from '@/workflow/constant';
import { loadLanguageAsync, i18n } from "@/locales/i18n";

const t = i18n.global.t;

export { register, VueNodeView as BaseVueNodeView } from '@logicflow/vue-node-registry';

export interface INodeDefine {
  id: string;
  key: string;
  type: string;
  name: string;
  description: string;
  icon: string;
  index: number;
  isHidden?: boolean;
}

export var notConnectMessage:string;
const notConnectedTip = (tvals: any) => {
  let message = '';
  let i18nkey;
  for (let item of tvals) {
    // 第一个字符统一转小写
    item = item.charAt(0).toLowerCase() + item.slice(1);
    i18nkey = 'flow.' + item;
    message = message + ', ' + t(i18nkey);
  }
  message = message.replace(', ', '');
  notConnectMessage = t('flow.notConnectedTip', {'nodes': message});
}

export class BaseVueNodeModel extends VueNodeModel {
  constructor(data: any, graphModel: any) {
    super(data, graphModel);
    // 右键菜单自由配置，也可以通过边的properties或者其他属性条件更换不同菜单
    this.menu = [
      {
        text: t('common.delete'),
        callback(node: any) {
          graphModel.deleteNode(node.id);
        },
      },
      {
        text: t('common.copy'),
        callback(node: any) {
          graphModel.cloneNode(node.id);
        },
      },
    ];
  }

  override getDefaultAnchor() {
    const { id, x, y, width } = this;
    const anchors = [];
    anchors.push(
      {
        x: x - width / 2,
        y,
        id: `${id}_incoming`,
        type: 'incoming',
      },
      {
        x: x + width / 2,
        y,
        id: `${id}_outgoing`,
        type: 'outgoing',
      },
    );
    return anchors;
  }

  override initNodeData(data: any) {
    super.initNodeData(data);
    const width = 140;
    const height = 40;
    this.width = width;
    this.height = height;
    this.radius = 50;
    this.targetRules = [];
    this.sourceRules = [
      {
        message: 'Do not allow connection.',
        validate: (sourceNode, targetNode, sourceAnchor, targetAnchor) => {
          let skey = sourceNode.getProperties().data.key;
          let tkey = targetNode.getProperties().data.key;
          // 第一个字符统一转大写
          skey = skey.charAt(0).toUpperCase() + skey.slice(1);
          tkey = tkey.charAt(0).toUpperCase() + tkey.slice(1);
          let tvals = RestrictedUpstreamMap[skey];

          if(tvals.indexOf(tkey) > -1){
            notConnectedTip(tvals);
            return false;
          }
          return true;
        },
      },
    ];
  }
}
