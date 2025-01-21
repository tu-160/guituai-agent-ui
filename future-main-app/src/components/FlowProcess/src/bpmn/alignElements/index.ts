import AlignElementsContextPadProvider from 'bpmn-js/lib/features/align-elements/AlignElementsContextPadProvider';
import AlignElementContextPad from './AlignElementContextPad';

class YmAlignElementsContextPadProvider extends AlignElementsContextPadProvider {
  constructor(contextPad: any, popupMenu: any, translate: any, canvas: any) {
    super(contextPad, popupMenu, translate, canvas);
  }

  getMultiElementContextPadEntries(element: any): any {
    // actions 获取默认的父节点contextPad
    // let actions = super.getMultiElementContextPadEntries(element);
    return AlignElementContextPad(this, element);
  }
}

YmAlignElementsContextPadProvider.$inject = ['contextPad', 'popupMenu', 'translate', 'canvas'];

export default YmAlignElementsContextPadProvider;
