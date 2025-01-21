// @ts-nocheck
import { asTRBL, getOrientation, getMid } from 'diagram-js/lib/layout/LayoutUtil';
import { find, reduce } from 'min-dash';
import { Shape } from 'diagram-js/lib/model';
import { Point } from 'diagram-js/lib/util/Types';

// padding to detect element placement
const PLACEMENT_DETECTION_PAD = 10;
export const DEFAULT_DISTANCE = 120;
export const DEFAULT_CONNECT = 160;
const DEFAULT_MAX_DISTANCE = 350;

/**
 * Get free position starting from given position.
 *
 * @param {Shape} source
 * @param {Shape} element
 * @param {Point} position
 * @param {Function} getNextPosition
 * @return {Point}
 */
export function findFreePosition(source: Shape, element: Shape, position: Point, getNextPosition: Function): Point {
  let connectedAtPosition;
  while ((connectedAtPosition = getConnectedAtPosition(source, position, element))) {
    position = getNextPosition(element, position, connectedAtPosition);
  }
  return position;
}

/**
 * Returns function that returns next position.
 *
 * @param {Object} nextPositionDirection
 * @param {Object} [nextPositionDirection.x]
 * @param {Object} [nextPositionDirection.y]
 * @returns {Function}
 */
export function generateGetNextPosition(nextPositionDirection: { x?: any; y?: any }): Function {
  return function (element: Shape, previousPosition: Point, connectedAtPosition: Point) {
    const nextPosition: any = {
      x: previousPosition.x,
      y: previousPosition.y,
    };
    ['x', 'y'].forEach(axis => {
      const nextPositionDirectionForAxis = nextPositionDirection[axis];
      if (!nextPositionDirectionForAxis) return;
      const dimension = axis === 'x' ? 'width' : 'height';
      const margin = nextPositionDirectionForAxis.margin;
      const minDistance = nextPositionDirectionForAxis.minDistance;
      if (margin < 0) nextPosition[axis] = Math.min(connectedAtPosition[axis] + margin - element[dimension] / 2, previousPosition[axis] - minDistance + margin);
      else {
        nextPosition[axis] = Math.max(
          connectedAtPosition[axis] + connectedAtPosition[dimension] + margin + element[dimension] / 2,
          previousPosition[axis] + minDistance + margin,
        );
      }
    });
    return nextPosition;
  };
}

/**
 * Return target at given position, if defined.
 *
 * This takes connected elements from host and attachers
 * into account, too.
 */
export function getConnectedAtPosition(source: Shape, position: Point, element: Shape): Shape | undefined {
  const bounds = {
    x: position.x - element.width / 2,
    y: position.y - element.height / 2,
    width: element.width,
    height: element.height,
  };
  const closure = getAutoPlaceClosure(source, element);
  return find(closure, (target: Shape) => {
    if (target === element) return false;
    const orientation = getOrientation(target, bounds, PLACEMENT_DETECTION_PAD);
    return orientation === 'intersect';
  });
}

/**
 * Compute optimal distance between source and target based on existing connections to and from source.
 * Assumes left-to-right and top-to-down modeling.
 *
 * @param {Shape} source
 * @param {Object} [hints]
 * @param {number} [hints.defaultDistance]
 * @param {string} [hints.direction]
 * @param {Function} [hints.filter]
 * @param {Function} [hints.getWeight]
 * @param {number} [hints.maxDistance]
 * @param {string} [hints.reference]
 * @return {number}
 */
export function getConnectedDistance(
  source: Shape,
  hints?: {
    defaultDistance?: number;
    direction?: string;
    filter?: Function;
    getWeight?: Function;
    maxDistance?: number;
    reference?: string;
  },
): number {
  if (!hints) hints = {};
  function getDefaultWeight(connection: any): number {
    return connection.source === source ? 1 : -1;
  }
  const defaultDistance = hints.defaultDistance || DEFAULT_DISTANCE;
  const direction = hints.direction || 'e';
  let filter = hints.filter;
  const getWeight = hints.getWeight || getDefaultWeight;
  const maxDistance = hints.maxDistance || DEFAULT_MAX_DISTANCE;
  const reference = hints.reference || 'start';
  if (!filter) filter = noneFilter;
  function getDistance(a: any, b: any): number {
    if (direction === 'n') {
      if (reference === 'start') {
        return asTRBL(a).top - asTRBL(b).bottom;
      } else if (reference === 'center') {
        return asTRBL(a).top - getMid(b).y;
      } else {
        return asTRBL(a).top - asTRBL(b).top;
      }
    } else if (direction === 'w') {
      if (reference === 'start') return asTRBL(a).left - asTRBL(b).right;
      else if (reference === 'center') return asTRBL(a).left - getMid(b).x;
      else return asTRBL(a).left - asTRBL(b).left;
    } else if (direction === 's') {
      if (reference === 'start') return asTRBL(b).top - asTRBL(a).bottom;
      else if (reference === 'center') return getMid(b).y - asTRBL(a).bottom;
      else return asTRBL(b).bottom - asTRBL(a).bottom;
    } else {
      if (reference === 'start') return asTRBL(b).left - asTRBL(a).right;
      else if (reference === 'center') return getMid(b).x - asTRBL(a).right;
      else return asTRBL(b).right - asTRBL(a).right;
    }
  }

  const sourcesDistances = source.incoming.filter(filter).map((connection: any) => {
    const weight = getWeight(connection);
    const distance = weight < 0 ? getDistance(connection.source, source) : getDistance(source, connection.source);
    return {
      id: connection.source.id,
      distance: distance,
      weight: weight,
    };
  });

  const targetsDistances = source.outgoing.filter(filter).map((connection: any) => {
    const weight = getWeight(connection);
    const distance = weight > 0 ? getDistance(source, connection.target) : getDistance(connection.target, source);
    return {
      id: connection.target.id,
      distance: distance,
      weight: weight,
    };
  });

  const distances = sourcesDistances.concat(targetsDistances).reduce((accumulator, currentValue) => {
    accumulator[currentValue.id + '__weight_' + currentValue.weight] = currentValue;
    return accumulator;
  }, {});

  const distancesGrouped = reduce(
    distances,
    (accumulator, currentValue) => {
      const distance = currentValue.distance;
      const weight = currentValue.weight;
      if (distance < 0 || distance > maxDistance) return accumulator;
      if (!accumulator[String(distance)]) accumulator[String(distance)] = 0;
      accumulator[String(distance)] += 1 * weight;
      if (!accumulator.distance || accumulator[accumulator.distance] < accumulator[String(distance)]) accumulator.distance = distance;
      return accumulator;
    },
    {},
  );
  return distancesGrouped.distance || defaultDistance;
}
/**
 * Returns all connected elements around the given source.
 * This includes:
 *   - connected elements
 *   - host connected elements
 *   - attachers connected elements
 * @param {Shape} source
 * @return {Array<Shape>}
 */
function getAutoPlaceClosure(source: Shape, element: Shape): Array<Shape> {
  let allConnected = getConnected(source);
  if (source.host) allConnected = allConnected.concat(getConnected(source.host));
  if (source.attachers)
    allConnected = allConnected.concat(
      source.attachers.reduce((shapes: Array<Shape>, attacher: Shape) => {
        return shapes.concat(getConnected(attacher));
      }, []),
    );
  return allConnected;
}
function getConnected(element: Shape): Array<Shape> {
  return getTargets(element).concat(getSources(element));
}
function getSources(shape: Shape): Array<Shape> {
  return shape.incoming.map((connection: any) => {
    return connection.source;
  });
}
function getTargets(shape: Shape): Array<Shape> {
  return shape.outgoing.map((connection: any) => {
    return connection.target;
  });
}
function noneFilter(): boolean {
  return true;
}
