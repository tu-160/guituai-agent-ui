import { assign } from 'min-dash';
import ICONS from 'bpmn-js/lib/features/align-elements/AlignElementsIcons';

const AlignElementContextPad = (contextPadProvider: any, element: any) => {
  let type = element.type;
  const { _alignElements: alignElements, _translate: translate, _popupMenu: popupMenu, _rules: rules } = contextPadProvider;

  return defaultContextPad();

  function defaultContextPad() {
    return [];
    // assign({
    //   'align-elements': {
    //     group: 'align-elements',
    //     title: '对齐方式',
    //     action: {
    //       click: function (event: any, elements: any) {
    //         var position = getMenuPosition(elements);

    //         // 展开对齐标签中包含的内容
    //         contextPadProvider._popupMenu.open(elements, 'align-elements', position);
    //       },
    //     },
    //   },
    // });
  }

  function getMenuPosition(elements: any) {
    var Y_OFFSET = 5;
    var diagramContainer = contextPadProvider._canvas.getContainer(),
      pad = contextPadProvider._contextPad.getPad(elements).html;
    var diagramRect = diagramContainer.getBoundingClientRect(),
      padRect = pad.getBoundingClientRect();
    var top = padRect.top - diagramRect.top;
    var left = padRect.left - diagramRect.left;
    var pos = {
      x: left,
      y: top + padRect.height + Y_OFFSET,
    };

    return pos;
  }
};

export default AlignElementContextPad;
