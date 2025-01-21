import ContextPadProvider from 'bpmn-js/lib/features/context-pad/ContextPadProvider';
import CustomizeContextPad from './CustomizeContextPad';
class YmContextPadProvider extends ContextPadProvider {
  _modeling: any;
  _rules: any;
  _eventBus: any;
  _injector: any;
  _commandStack: any;
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
    commandStack: any,
  ) {
    super(config, injector, eventBus, contextPad, modeling, elementFactory, connect, create, popupMenu, canvas, rules, translate);
    this._rules = rules;
    this._modeling = modeling;
    this._injector = injector;
    this._eventBus = eventBus;
    this._commandStack = commandStack;
  }

  getContextPadEntries(element: any): (() => any) | any | undefined {
    return CustomizeContextPad(this, element);
  }

  // 多个元素框选时 默认包含框选删除元素
  getMultiElementContextPadEntries() {
    var actions = {};
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
  'commandStack',
];

export default YmContextPadProvider;
