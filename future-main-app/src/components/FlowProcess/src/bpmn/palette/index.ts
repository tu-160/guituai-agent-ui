import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider';
import bpmnPalette from './bpmnPalette';
import YmPalette from './CustomizePalette';

class YmPaletteProvider extends PaletteProvider {
  constructor(
    palette: any,
    create: any,
    elementFactory: any,
    spaceTool: any,
    lassoTool: any,
    handTool: any,
    globalConnect: any,
    translate: any,
    bpmnFactory: any,
  ) {
    super(palette, create, elementFactory, spaceTool, lassoTool, handTool, globalConnect, translate);
    //  this._bpmnFactory = bpmnFactory;
    palette.registerProvider(this);
  }

  // @ts-ignore
  getPaletteEntries(element: any) {
    // 继承 扩展自定义 palette 需要原生怎开启注释
    return Object.assign(bpmnPalette(this), YmPalette(this));
  }
}

YmPaletteProvider.$inject = ['palette', 'create', 'elementFactory', 'spaceTool', 'lassoTool', 'handTool', 'globalConnect', 'translate', 'bpmnFactory'];

export default YmPaletteProvider;
