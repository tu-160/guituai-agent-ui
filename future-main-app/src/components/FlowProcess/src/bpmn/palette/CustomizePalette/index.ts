import futureTask from './task';

const YmPalette = (paletteProvider: any) => {
  let actions = {};
  const {
    _bpmnFactory: bpmnFactory,
    _create: create,
    _elementFactory: elementFactory,
    _translate: translate,
    _spaceTool: spaceTool,
    _lassoTool: lassoTool,
    _handTool: handTool,
    _globalConnect: globalConnect,
  } = paletteProvider;

  Object.assign(actions, futureTask(bpmnFactory, elementFactory, create, translate));

  return actions;
};

export default YmPalette;
