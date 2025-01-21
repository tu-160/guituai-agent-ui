import { is, isAny } from '../../../utils/modelUtil';
import { findFreePosition, generateGetNextPosition, getConnectedDistance } from '../../../autoPlace/YmAutoPlaceUtil';
import { isObject } from 'min-dash';
import { typeLabel } from '../../../config/variableName';
var HIGH_PRIORITY = 2000;
function distance(a: any, b: any) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}
/**
 * Convert the given bounds to a { top, left, bottom, right } descriptor.
 * @param {Point|Rect} bounds
 * @return {RectTRBL}
 *
 */
export function asTRBL(bounds: any) {
  return {
    top: bounds.y,
    right: bounds.x + (bounds.width || 0),
    bottom: bounds.y + (bounds.height || 0),
    left: bounds.x,
  };
}
export function getConnectionMid(connection: any) {
  var waypoints = connection.waypoints;
  var parts = waypoints.reduce(function (parts: any, point: any, index: any) {
    var lastPoint = waypoints[index - 1];
    if (lastPoint) {
      var lastPart = parts[parts.length - 1];
      var startLength = (lastPart && lastPart.endLength) || 0;
      var length = distance(lastPoint, point);
      parts.push({
        start: lastPoint,
        end: point,
        startLength: startLength,
        endLength: startLength + length,
        length: length,
      });
    }
    return parts;
  }, []);
  var totalLength = parts.reduce(function (length: any, part: any) {
    return length + part.length;
  }, 0);
  var midLength = totalLength / 2;
  var i = 0;
  var midSegment = parts[i];
  while (midSegment.endLength < midLength) {
    midSegment = parts[++i];
  }
  var segmentProgress = (midLength - midSegment.startLength) / midSegment.length;
  var midPoint = {
    x: midSegment.start.x + (midSegment.end.x - midSegment.start.x) * segmentProgress,
    y: midSegment.start.y + (midSegment.end.y - midSegment.start.y) * segmentProgress,
  };
  return midPoint;
}
export function roundPoint(point: any) {
  return {
    x: Math.round(point.x),
    y: Math.round(point.y),
  };
}
export function getBoundsMid(bounds: any) {
  return roundPoint({
    x: bounds.x + (bounds.width || 0) / 2,
    y: bounds.y + (bounds.height || 0) / 2,
  });
}
export function getMid(element: any) {
  if (!!element.waypoints) return getConnectionMid(element);
  return getBoundsMid(element);
}
export function getOrientation(rect: any, reference: any, padding: any) {
  padding = padding || 0;
  if (!isObject(padding)) padding = { x: padding, y: padding };
  var rectOrientation = asTRBL(rect),
    referenceOrientation = asTRBL(reference);
  var top = rectOrientation.bottom + padding.y <= referenceOrientation.top,
    right = rectOrientation.left - padding.x >= referenceOrientation.right,
    bottom = rectOrientation.top - padding.y >= referenceOrientation.bottom,
    left = rectOrientation.right + padding.x <= referenceOrientation.left;
  var vertical = top ? 'top' : bottom ? 'bottom' : null,
    horizontal = left ? 'left' : right ? 'right' : null;
  if (horizontal && vertical) return vertical + '-' + horizontal;
  else return horizontal || vertical || 'intersect';
}
/**
 * Always try to place element right of source;
 * compute actual distance from previous nodes in flow.
 */
export function getFlowNodePosition(source: any, element: any) {
  var sourceTrbl = asTRBL(source); // 描述图形或区域在页面或画布上的位置和大小
  var sourceMid = getMid(source); // 获取中心点坐标
  var horizontalDistance = getConnectedDistance(source, {
    direction: 's',
    filter: function (connection: any) {
      return is(connection, 'bpmn:SequenceFlow');
    },
  });
  var margin = 30,
    minDistance = 50,
    orientation = 'top';
  if (is(source, 'bpmn:BoundaryEvent')) {
    orientation = getOrientation(source, source.host, -25);
    if (orientation.indexOf('top') !== -1) margin *= -1;
  }
  var position: any = {};
  // todo: 获取排序 横向还是竖向 横向
  position = {
    // x: sourceTrbl.right + horizontalDistance + element.width / 2,
    // y: sourceMid.y + getVerticalDistance(orientation, minDistance),
    x: sourceMid.x,
    y: sourceTrbl.bottom + horizontalDistance + element.height / 2,
  };
  // y轴距离
  var nextPositionDirection = {
    x: {
      margin: margin,
      minDistance: minDistance,
    },
  };
  return findFreePosition(source, element, position, generateGetNextPosition(nextPositionDirection));
}
export function getNewShapePosition(source: any, element: any) {
  if (is(element, 'bpmn:TextAnnotation')) return getTextAnnotationPosition(source, element);
  if (isAny(element, ['bpmn:DataObjectReference', 'bpmn:DataStoreReference'])) return getDataElementPosition(source, element);
  if (is(element, 'bpmn:FlowNode')) return getFlowNodePosition(source, element);
}
export function getDataElementPosition(source: any, element: any) {
  var sourceTrbl = asTRBL(source);
  var position = {
    x: sourceTrbl.right - 10 + element.width / 2,
    y: sourceTrbl.bottom + 40 + element.width / 2,
  };
  var nextPositionDirection = {
    x: {
      margin: 30,
      minDistance: 30,
    },
  };
  return findFreePosition(source, element, position, generateGetNextPosition(nextPositionDirection));
}
export function getTextAnnotationPosition(source: any, element: any) {
  var sourceTrbl = asTRBL(source);
  var position = {
    x: sourceTrbl.right + element.width / 2,
    y: sourceTrbl.top - 50 - element.height / 2,
  };
  if (!!source.waypoints) {
    position = getMid(source);
    position.x += 100;
    position.y -= 50;
  }
  var nextPositionDirection = {
    y: {
      margin: -30,
      minDistance: 20,
    },
  };
  return findFreePosition(source, element, position, generateGetNextPosition(nextPositionDirection));
}
function getNewSourceInLabel(source: any) {
  if (source.type === typeLabel) {
    let connectElement: any = source?.labelTarget;
    if (connectElement?.target) return connectElement.target;
  }
  return source;
}
export default function YmGridSnappingAutoPlaceBehavior(eventBus: any, gridSnapping: any, injector: any) {
  eventBus.on('autoPlace', HIGH_PRIORITY, function (context: any) {
    var source = context.source,
      sourceMid = getMid(source),
      shape = context.shape;
    let elementRegistry = injector.get('elementRegistry');
    let element = elementRegistry.get(source.id);
    var position: any = getNewShapePosition(getNewSourceInLabel(element), shape);
    ['x', 'y'].forEach(function (axis: any) {
      var options: any = {};
      if (position[axis] === sourceMid[axis]) return;
      if (position[axis] > sourceMid[axis]) options.min = position[axis];
      else options.max = position[axis];
      if (is(shape, 'bpmn:TextAnnotation')) {
        if (isHorizontal(axis)) options.offset = -shape.width / 2;
        else options.offset = -shape.height / 2;
      }
    });
    position = {
      x: position.x,
      y: Math.abs(position.y - element.y) > 260 ? element.y + 168 : position.y,
    };
    return position;
  });
}
YmGridSnappingAutoPlaceBehavior.$inject = ['eventBus', 'gridSnapping', 'injector'];
function isHorizontal(axis: any) {
  return axis === 'x';
}
