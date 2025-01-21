import ContextPadProvider from 'bpmn-js/lib/features/context-pad/ContextPadProvider';
import CustomizeContextPad from './CustomizeContextPad';
import { futureConfigBpmnContextPad } from '../../config/contextPad';
class YmContextPadProvider extends ContextPadProvider {
  _modeling: any;
  _rules: any;
  _injector: any;
  _eventBus: any;
  constructor(
    config: any,
    injector: any,
    eventBus: any,
    contextPad: any,
    modeling: any,
    elementFactory: any,
    connect: any,
    create: any,
    popupMenu: any,
    canvas: any,
    rules: any,
    translate: any,
  ) {
    super(config, injector, eventBus, contextPad, modeling, elementFactory, connect, create, popupMenu, canvas, rules, translate);
    this._rules = rules;
    this._modeling = modeling;
    this._injector = injector;
    this._eventBus = eventBus;
  }

  getContextPadEntries(element: any): (() => any) | any | undefined {
    return CustomizeContextPad(this, element);
  }

  // 多个元素框选时 默认包含框选删除元素
  getMultiElementContextPadEntries(element: any) {
    var actions = {};
    const { del } = futureConfigBpmnContextPad;
    Object.assign(actions, {
      delete: {
        group: 'edit',
        className: del.className,
        title: del.title,
        action: {
          click: (_event: any, elements: any) => {
            //判断存在开始节点给出不能删除的提示
            const hasStartElement = elements.some(o => o.type == 'bpmn:StartEvent');
            hasStartElement &&
              this._eventBus.fire('custom.message', {
                context: '无法删除开始节点',
              });
            //过滤开始节点后删除选择的节点
            const newElements = elements.filter(o => o.type != 'bpmn:StartEvent');
            this._modeling.removeElements(newElements.slice());
          },
        },
      },
    });
    return actions;
  }
}

YmContextPadProvider.$inject = [
  'config.contextPad',
  'injector',
  'eventBus',
  'contextPad',
  'modeling',
  'elementFactory',
  'connect',
  'create',
  'popupMenu',
  'canvas',
  'rules',
  'translate',
];

export default YmContextPadProvider;
