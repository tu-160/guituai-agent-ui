import { append as svgAppend, attr as svgAttr, create as svgCreate } from 'tiny-svg';
import { assign } from 'min-dash';
import { query as domQuery } from 'min-dom';

export default function createAddMarkerSelect(element: any, ymCanvas: any) {
  var activeElement = document.getElementById('bpmnSequenceFlowActiveId');
  if (!activeElement) {
    if (element.type === 'bpmn:SequenceFlow') {
      var sequenceflowEnd = svgCreate('path');
      svgAttr(sequenceflowEnd, { d: 'M 1 5 L 11 10 L 1 15 Z' });
      addMarker(
        'bpmnSequenceFlowActiveId',
        {
          element: sequenceflowEnd,
          ref: { x: 11, y: 10 },
          scale: 0.5,
          attrs: {
            fill: 'rgb(24, 131, 255)',
            stroke: 'rgb(24, 131, 255)',
          },
        },
        ymCanvas,
      );
    }
  }
}
function addMarker(id: any, options: any, ymCanvas: any) {
  let attrs = assign(
    {
      fill: 'hsl(225, 10%, 15%)',
      strokeWidth: 1,
      strokeLinecap: 'round',
      strokeDasharray: 'none',
    },
    options.attrs,
  );
  let ref = options.ref || { x: 0, y: 0 };
  let scale = options.scale || 1;
  if (attrs.strokeDasharray === 'none') {
    attrs.strokeDasharray = [10000, 1];
  }
  let marker = svgCreate('marker');
  svgAttr(options.element, attrs);
  svgAppend(marker, options.element);
  svgAttr(marker, {
    id: id,
    viewBox: '0 0 20 20',
    refX: ref.x,
    refY: ref.y,
    markerWidth: 20 * scale,
    markerHeight: 20 * scale,
    orient: 'auto',
  });
  let defs = domQuery('defs', ymCanvas._svg);
  if (!defs) {
    defs = svgCreate('defs');
    svgAppend(ymCanvas._svg, defs);
  }
  svgAppend(defs, marker);
  // markers[id] = marker;
}
