// bpmn-js工具栏默认配置
import cn from '../translate/cn';

function getDi(element: any) {
  return element && element.di;
}

const bpmnPalette = (paletteProvider: any) => {
  const actions = {},
    create = paletteProvider._create,
    elementFactory = paletteProvider._elementFactory,
    spaceTool = paletteProvider._spaceTool,
    lassoTool = paletteProvider._lassoTool,
    handTool = paletteProvider._handTool,
    globalConnect = paletteProvider._globalConnect,
    translate = paletteProvider._translate;

  function createAction(type: any, group: any, className: any, title: any, options?: any) {
    function createListener(event: any) {
      var shape = elementFactory.createShape(Object.assign({ type: type, name11: 'csj' }, options));

      if (options) {
        var di = getDi(shape);
        di.isExpanded = options.isExpanded;
      }

      create.start(event, shape);
    }

    var shortType = type.replace(/^bpmn:/, '');

    return {
      group: group,
      className: className,
      title: title || translate('Create {type}', { type: shortType }),
      action: {
        dragstart: createListener,
        click: createListener,
      },
    };
  }

  function createSubprocess(event: any) {
    var subProcess = elementFactory.createShape({
      type: 'bpmn:SubProcess',
      x: 0,
      y: 0,
      isExpanded: false,
    });
    //createShape 创建新的图表形状
    var startEvent = elementFactory.createShape({
      type: 'bpmn:StartEvent',
      x: 40,
      y: 82,
      parent: subProcess,
    });

    create.start(event, [subProcess, startEvent], {
      hints: {
        autoSelect: [subProcess],
      },
    });
  }

  function createParticipant(event: any) {
    create.start(event, elementFactory.createParticipantShape());
  }

  Object.assign(actions, {
    'hand-tool': {
      group: 'tools',
      className: 'bpmn-icon-hand-tool',
      title: translate(cn['Activate the hand tool']),
      action: {
        click: function (event: any) {
          handTool.activateHand(event);
        },
      },
    },
    'lasso-tool': {
      group: 'tools',
      className: 'bpmn-icon-lasso-tool',
      title: translate(cn['Activate the lasso tool']),
      action: {
        click: function (event: any) {
          lassoTool.activateSelection(event);
        },
      },
    },
    'space-tool': {
      group: 'tools',
      className: 'bpmn-icon-space-tool',
      title: translate(cn['Activate the create/remove space tool']),
      action: {
        click: function (event: any) {
          spaceTool.activateSelection(event);
        },
      },
    },
    'global-connect-tool': {
      group: 'tools',
      className: 'bpmn-icon-connection-multi',
      title: translate(cn['Activate the global connect tool']),
      action: {
        click: function (event: any) {
          globalConnect.start(event);
        },
      },
    },
    'tool-separator': {
      group: 'tools',
      separator: true,
    },
    'create.start-event': createAction('bpmn:StartEvent', 'event', 'bpmn-icon-start-event-none', translate(cn['Create StartEvent'])),
    'create.intermediate-event': createAction(
      'bpmn:IntermediateThrowEvent',
      'event',
      'bpmn-icon-intermediate-event-none',
      translate(cn['Create Intermediate/Boundary Event']),
    ),
    'create.end-event': createAction('bpmn:EndEvent', 'event', 'bpmn-icon-end-event-none', translate(cn['Create EndEvent'])),
    'create.exclusive-gateway': createAction('bpmn:ExclusiveGateway', 'gateway', 'bpmn-icon-gateway-none', translate(cn['Create Gateway'])),
    'create.task': createAction('bpmn:Task', 'activity', 'bpmn-icon-task', translate(cn['Create Task'])),
    'create.data-object': createAction('bpmn:DataObjectReference', 'data-object', 'bpmn-icon-data-object', translate(cn['Create DataObjectReference'])),
    'create.data-store': createAction('bpmn:DataStoreReference', 'data-store', 'bpmn-icon-data-store', translate(cn['Create DataStoreReference'])),
    'create.subprocess-expanded': {
      group: 'activity',
      className: 'bpmn-icon-subprocess-expanded',
      title: translate(cn['Create expanded SubProcess']),
      action: {
        dragstart: createSubprocess,
        click: createSubprocess,
      },
    },
    'create.participant-expanded': {
      group: 'collaboration',
      className: 'bpmn-icon-participant',
      title: translate(cn['Create Pool/Participant']),
      action: {
        dragstart: createParticipant,
        click: createParticipant,
      },
    },
    'create.group': createAction('bpmn:Group', 'artifact', 'bpmn-icon-group', translate(cn['Create Group'])),
  });

  return actions;
};

export default bpmnPalette;
