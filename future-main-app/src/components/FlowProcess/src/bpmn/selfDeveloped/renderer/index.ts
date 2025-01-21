import BpmnRenderer from 'bpmn-js/lib/draw/BpmnRenderer';
import CustomizeRenderer from './CustomizeRenderer';
import { getRectPath } from 'bpmn-js/lib/draw/BpmnRenderUtil';
import createAddMarkerSelect from './connect/marker';
import { typeConfluence, typeGateway } from '../../config/variableName';
import { createLine } from 'diagram-js/lib/util/RenderUtil';
import { append as svgAppend } from 'tiny-svg';
let futureCanvas: any;
let defaultStrokeColor = '#A2B9D5';
let futureFlowInfo: any;
class YmRenderer extends BpmnRenderer {
  _styles: any;
  constructor(config: any, eventBus: any, styles: any, pathMap: any, canvas: any, textRenderer: any, flowInfo: any, priority: number) {
    super(
      (config = {
        defaultLabelColor: 'rgb(102,102,102)',
        defaultStrokeColor: defaultStrokeColor,
        ...config,
      }),
      eventBus,
      styles,
      pathMap,
      canvas,
      textRenderer,
      priority,
    );
    this._styles = styles;
    futureCanvas = canvas;
    futureFlowInfo = flowInfo;
  }

  canRender(element: any) {
    return super.canRender(element);
  }

  // 绘制画布上元素
  drawShape(parentNode: any, element: any) {
    if (element) return CustomizeRenderer(parentNode, element, futureFlowInfo) || super.drawShape(parentNode, element);
    return super.drawShape(parentNode, element);
  }

  drawConnection(parentGfx: any, element: any) {
    let stroke = element.nodeState == 'state-past' ? '#4ED587' : '';
    if (
      element.target.wnType === typeConfluence ||
      (element.isPreview && element.target.wnType === typeGateway) ||
      (element.isPreview && element.source.wnType === typeGateway)
    ) {
      function lineStyle(_styles, attrs) {
        return _styles.computeStyle(attrs, ['no-fill'], {
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          stroke: defaultStrokeColor,
          strokeWidth: 2,
        });
      }
      function drawLine(parentGfx, waypoints, attrs, radius, _styles) {
        attrs = lineStyle(_styles, attrs);
        var line = createLine(waypoints, attrs, radius);
        svgAppend(parentGfx, line);
        return line;
      }
      if (element.isPreview && element.waypoints?.length > 1) {
        if (element.waypoints.length === 2) {
          element.waypoints = [
            {
              x: element.waypoints[0].x,
              y: element.waypoints[0].y,
            },
            {
              x: element.waypoints[1].x,
              y: element.waypoints[1].y + 15,
            },
          ];
        } else {
          element.waypoints = [
            {
              x: element.waypoints[0].x > element.waypoints[1].x ? element.waypoints[0].x + 45 : element.waypoints[0].x - 45,
              y: element.waypoints[0].y,
            },
            {
              x: element.waypoints[1].x,
              y: element.waypoints[1].y,
            },
            {
              x: element.waypoints[2].x,
              y: element.waypoints[2].y,
            },
          ];
        }
      }
      var connection = drawLine(
        parentGfx,
        element.waypoints,
        {
          markerEnd: '',
          stroke: stroke || defaultStrokeColor,
        },
        5,
        this._styles,
      );
      return connection;
    } else {
      let connect = super.drawConnection(parentGfx, element, { stroke });
      createAddMarkerSelect(element, futureCanvas); // 选中线的箭头
      return connect;
    }
  }
  // 绘制
  getShapePath(shape: any) {
    return getRectPath(shape);
  }
}
YmRenderer.$inject = ['config.bpmnRenderer', 'eventBus', 'styles', 'pathMap', 'canvas', 'textRenderer', 'config.flowInfo'];

export default YmRenderer;
