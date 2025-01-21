import inherits from 'inherits-browser';
import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';
import { pointsAligned } from 'diagram-js/lib/util/Geometry';
import { assign } from 'min-dash';
import { typeConfluence, typeGateway } from '../../../config/variableName';

/**
 * @typedef {import('diagram-js/lib/core/EventBus').default} EventBus
 * @typedef {import('diagram-js/lib/features/grid-snapping/GridSnapping').default} GridSnapping
 * @typedef {import('../../modeling/Modeling').default} Modeling
 *
 * @typedef {import('diagram-js/lib/util/Types').Point} Point
 */

const HIGH_PRIORITY = 3000;

export default function GridSnappingLayoutConnectionBehavior(this: any, eventBus: any, gridSnapping: any, modeling: any) {
  CommandInterceptor.call(this, eventBus);
  this._gridSnapping = gridSnapping;
  const self = this;
  this.postExecuted(['connection.create', 'connection.layout'], HIGH_PRIORITY, function (event: any) {
    let context = event.context,
      connection = context.connection,
      waypoints = connection.waypoints;
    let target = connection.target,
      source = connection.source;
    if (source.wnType === typeGateway) {
      let x = source.x;
      if (target.x > source.x) x = source.x + source.width;
      waypoints = [
        {
          x: x,
          y: source.y + source.height / 2,
        },
        {
          x: target.x + target.width / 2,
          y: source.y + source.height / 2,
        },
        {
          x: target.x + target.width / 2,
          y: target.y,
        },
      ];
      if (source.x + source.width / 2 === target.x + target.width / 2) {
        waypoints = [
          {
            x: source.x + source.width / 2,
            y: source.y + source.height,
          },
          {
            x: target.x + target.width / 2,
            y: target.y,
          },
        ];
      }
    }
    if (target.wnType === typeConfluence) {
      let x = target.x;
      if (target.x < source.x) {
        // 在合流右上方
        x = target.x + target.width;
      }
      waypoints = [
        {
          x: source.x + source.width / 2,
          y: source.y + source.height,
        },
        {
          x: source.x + source.width / 2,
          y: target.y + target.height / 2,
        },
        {
          x: x,
          y: target.y + target.height / 2,
        },
      ];
      if (source.x + source.width / 2 === target.x + target.width / 2) {
        waypoints = [
          {
            x: source.x + source.width / 2,
            y: source.y + source.height,
          },
          {
            x: target.x + target.width / 2,
            y: target.y,
          },
        ];
      }
    }
    modeling.updateWaypoints(connection, self.snapMiddleSegments(waypoints));
  });
}

GridSnappingLayoutConnectionBehavior.$inject = ['eventBus', 'gridSnapping', 'modeling'];
inherits(GridSnappingLayoutConnectionBehavior, CommandInterceptor);
/**
 * Snap middle segments of a given connection.
 *
 * @param {Point[]} waypoints
 *
 * @return {Point[]}
 */
GridSnappingLayoutConnectionBehavior.prototype.snapMiddleSegments = function (this: any, waypoints: any[]) {
  const gridSnapping = this._gridSnapping;
  waypoints = waypoints.slice();

  for (let i = 1; i < waypoints.length - 2; i++) {
    const snapped = snapSegment(gridSnapping, waypoints[i], waypoints[i + 1]);
    waypoints[i] = snapped[0];
    waypoints[i + 1] = snapped[1];
  }
  return waypoints;
};

/**
 * Check whether a connection has middle segments.
 *
 * @param {Point[]} waypoints
 *
 * @return {boolean}
 */
function hasMiddleSegments(waypoints: any[]) {
  return waypoints.length > 3;
}

/**
 * Check whether an alignment is horizontal.
 *
 * @param {string} aligned
 *
 * @return {boolean}
 */
function horizontallyAligned(aligned: string) {
  return aligned === 'h';
}

/**
 * Check whether an alignment is vertical.
 *
 * @param {string} aligned
 *
 * @return {boolean}
 */
function verticallyAligned(aligned: string) {
  return aligned === 'v';
}

/**
 * Get middle segments from a given connection.
 *
 * @param {Point[]} waypoints
 *
 * @return {Point[]}
 */
function snapSegment(gridSnapping: any, segmentStart: any, segmentEnd: any) {
  const aligned = pointsAligned(segmentStart, segmentEnd);
  const snapped: any = {};

  if (horizontallyAligned(aligned)) {
    snapped.y = gridSnapping.snapValue(segmentStart.y);
  }

  if (verticallyAligned(aligned)) {
    snapped.x = gridSnapping.snapValue(segmentStart.x);
  }

  if ('x' in snapped || 'y' in snapped) {
    segmentStart = assign({}, segmentStart, snapped);
    segmentEnd = assign({}, segmentEnd, snapped);
  }

  return [segmentStart, segmentEnd];
}
