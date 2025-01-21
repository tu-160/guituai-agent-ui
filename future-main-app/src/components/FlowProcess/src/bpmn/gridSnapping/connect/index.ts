import inherits from 'inherits-browser';
import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';
import { pointsAligned } from 'diagram-js/lib/util/Geometry';
import { assign } from 'min-dash';
import { DEFAULT_CONNECT } from '../../autoPlace/YmAutoPlaceUtil';
/**
 * @typedef {import('diagram-js/lib/core/EventBus').default} EventBus
 * @typedef {import('diagram-js/lib/features/grid-snapping/GridSnapping').default} GridSnapping
 * @typedef {import('../../modeling/Modeling').default} Modeling
 *
 * @typedef {import('diagram-js/lib/util/Types').Point} Point
 */

const HIGH_PRIORITY = 3000;

export default function GridSnappingLayoutConnectionBehavior(this: any, eventBus: any, gridSnapping: any, modeling: any, futureData: any) {
  CommandInterceptor.call(this, eventBus);
  this._gridSnapping = gridSnapping;
  const self = this;
  this.postExecuted(['connection.create', 'connection.layout'], HIGH_PRIORITY, function (event: any) {
    let context = event.context,
      connection = context.connection,
      waypoints = connection.waypoints;
    let target = connection.target,
      source = connection.source;
    // 横向美化
    if (futureData.data?.layout?.value === 'horizontal') {
      let x = source.x;
      let y = source.y + source.height / 2;
      let targetX = target.x + target.width / 2;
      if (source.x + source.width <= target.x) {
        // 右侧
        x = source.x + source.width;
        if (y === target.y + target.height / 2) {
          waypoints = [
            { x: x, y: y },
            { x: target.x, y: target.y + target.height / 2 },
          ];
        } else if (y >= target.y + target.height && x + 30 > target.x) {
          waypoints = [
            { x: x, y: y },
            { x: targetX, y: y },
            { x: targetX, y: target.y + target.height },
          ];
        } else if (y - 10 < target.y && x + 30 > target.x) {
          waypoints = [
            { x: x, y: y },
            { x: targetX, y: y },
            { x: targetX, y: target.y },
          ];
        } else {
          waypoints = [
            { x: x, y: y },
            { x: target.x - DEFAULT_CONNECT / 2, y: y },
            { x: target.x - DEFAULT_CONNECT / 2, y: target.y + target.height / 2 },
            { x: target.x, y: target.y + target.height / 2 },
          ];
        }
      } else if (source.x > target.x + target.width) {
        // 左侧
        x = target.x + target.width;
        if (x + 30 > source.x) {
          if (y - 10 > target.y + target.height) {
            waypoints = [
              { x: source.x, y: source.y + source.height / 2 },
              { x: target.x + target.width / 2, y: source.y + source.height / 2 },
              { x: target.x + target.width / 2, y: target.y + target.height },
            ];
          } else if (y - 10 < target.y + target.height) {
            waypoints = [
              { x: source.x, y: source.y + source.height / 2 },
              { x: target.x + target.width / 2, y: source.y + source.height / 2 },
              { x: target.x + target.width / 2, y: target.y },
            ];
          }
        } else {
          waypoints = [
            { x: source.x, y: source.y + source.height / 2 },
            { x: (source.x - x) / 2 + x, y: source.y + source.height / 2 },
            { x: (source.x - x) / 2 + x, y: target.y + target.height / 2 },
            { x: x, y: target.y + target.height / 2 },
          ];
        }
      } else {
        // 上侧
        if (target.y < source.y) {
          if (source.x + source.width / 2 === target.x + target.width / 2) {
            waypoints = [
              { x: source.x + source.width / 2, y: source.y },
              { x: target.x + target.width / 2, y: target.y + target.height },
            ];
          } else if (target.y + target.height > source.y - 20) {
            if (source.x + source.width / 2 >= target.x + target.width) {
              // 左上
              waypoints = [
                { x: source.x + source.width / 2, y: source.y },
                { x: source.x + source.width / 2, y: target.y + target.height / 2 },
                { x: target.x + target.width, y: target.y + target.height / 2 },
              ];
            } else if (source.x + source.width / 2 <= target.x) {
              // 右上
              waypoints = [
                { x: source.x + source.width / 2, y: source.y },
                { x: source.x + source.width / 2, y: target.y + target.height / 2 },
                { x: target.x, y: target.y + target.height / 2 },
              ];
            } else {
              waypoints = [
                { x: source.x + source.width / 2, y: source.y },
                { x: source.x + source.width / 2, y: source.y - (source.y - target.y - target.height) / 2 },
                { x: target.x + target.width / 2, y: target.y + target.height },
              ];
            }
          } else {
            waypoints = [
              { x: source.x + source.width / 2, y: source.y },
              { x: source.x + source.width / 2, y: source.y - (source.y - target.y - target.height) / 2 },
              { x: target.x + target.width / 2, y: source.y - (source.y - target.y - target.height) / 2 },
              { x: target.x + target.width / 2, y: target.y + target.height },
            ];
          }
        } else if (target.y + target.height > source.y + source.height) {
          // 下侧
          if (source.x + source.width / 2 === target.x + target.width / 2) {
            waypoints = [
              { x: source.x + source.width / 2, y: source.y + source.height },
              { x: target.x + target.width / 2, y: target.y },
            ];
          } else if (target.y - 20 < source.y + source.height) {
            if (source.x + source.width / 2 >= target.x + target.width) {
              // 左下
              waypoints = [
                { x: source.x + source.width / 2, y: source.y + source.height },
                { x: source.x + source.width / 2, y: target.y + target.height / 2 },
                { x: target.x + target.width, y: target.y + target.height / 2 },
              ];
            } else if (source.x + source.width / 2 <= target.x) {
              // 右下
              waypoints = [
                { x: source.x + source.width / 2, y: source.y + source.height },
                { x: source.x + source.width / 2, y: target.y + target.height / 2 },
                { x: target.x, y: target.y + target.height / 2 },
              ];
            } else {
              waypoints = [
                { x: source.x + source.width / 2, y: source.y + source.height },
                { x: source.x + source.width / 2, y: target.y - (target.y - source.y - source.height) / 2 },
                { x: target.x + target.width / 2, y: target.y - (target.y - source.y - source.height) / 2 },
                { x: target.x + target.width / 2, y: target.y },
              ];
            }
          } else {
            waypoints = [
              { x: source.x + source.width / 2, y: source.y + source.height },
              { x: source.x + source.width / 2, y: target.y - (target.y - source.y - source.height) / 2 },
              { x: target.x + target.width / 2, y: target.y - (target.y - source.y - source.height) / 2 },
              { x: target.x + target.width / 2, y: target.y },
            ];
          }
        }
      }
    }
    if (futureData.data?.layout?.value === 'vertical') {
      if (source.y + source.height < target.y) {
        if (source.x + source.width / 2 === target.x + target.width / 2) {
          waypoints = [
            { x: source.x + source.width / 2, y: source.y + source.height },
            { x: target.x + target.width / 2, y: target.y },
          ];
        } else {
          if (source.y + source.height + 20 > target.y && source.x + source.width / 2 < target.x) {
            waypoints = [
              { x: source.x + source.width / 2, y: source.y + source.height },
              { x: source.x + source.width / 2, y: target.y + target.height / 2 },
              { x: target.x, y: target.y + target.height / 2 },
            ];
          } else if (source.y + source.height + 20 > target.y && source.x + source.width / 2 > target.x + target.width + 10) {
            waypoints = [
              { x: source.x + source.width / 2, y: source.y + source.height },
              { x: source.x + source.width / 2, y: target.y + target.height / 2 },
              { x: target.x + target.width, y: target.y + target.height / 2 },
            ];
          } else
            waypoints = [
              { x: source.x + source.width / 2, y: source.y + source.height },
              { x: source.x + source.width / 2, y: source.y + source.height + (target.y - source.y - source.height) / 2 },
              { x: target.x + target.width / 2, y: source.y + source.height + (target.y - source.y - source.height) / 2 },
              { x: target.x + target.width / 2, y: target.y },
            ];
        }
      } else if (source.y > target.y + target.height) {
        if (source.x + source.width / 2 === target.x + target.width / 2) {
          waypoints = [
            { x: source.x + source.width / 2, y: source.y },
            { x: target.x + target.width / 2, y: target.y + target.height },
          ];
        } else {
          if (source.y - 20 < target.y + target.height && source.x + source.width / 2 < target.x) {
            waypoints = [
              { x: source.x + source.width / 2, y: source.y },
              { x: source.x + source.width / 2, y: target.y + target.height / 2 },
              { x: target.x, y: target.y + target.height / 2 },
            ];
          } else if (source.y - 20 < target.y + target.height && source.x + source.width / 2 > target.x + target.width + 10) {
            waypoints = [
              { x: source.x + source.width / 2, y: source.y },
              { x: source.x + source.width / 2, y: target.y + target.height / 2 },
              { x: target.x + target.width, y: target.y + target.height / 2 },
            ];
          } else
            waypoints = [
              { x: source.x + source.width / 2, y: source.y },
              { x: source.x + source.width / 2, y: source.y - (source.y - target.y - target.height) / 2 },
              { x: target.x + target.width / 2, y: source.y - (source.y - target.y - target.height) / 2 },
              { x: target.x + target.width / 2, y: target.y + target.height },
            ];
        }
      } else if (source.x + source.width / 2 < target.x - 10) {
        // 右侧
        if (source.x + source.width >= target.x - 10 && source.y + source.height / 2 >= target.y + target.height - 10) {
          waypoints = [
            { x: source.x + source.width, y: source.y + source.height / 2 },
            { x: target.x + target.width / 2, y: source.y + source.height / 2 },
            { x: target.x + target.width / 2, y: target.y + target.height },
          ];
        } else if (source.x + source.width >= target.x - 10 && source.y + source.height / 2 + 10 <= target.y) {
          waypoints = [
            { x: source.x + source.width, y: source.y + source.height / 2 },
            { x: target.x + target.width / 2, y: source.y + source.height / 2 },
            { x: target.x + target.width / 2, y: target.y },
          ];
        } else {
          waypoints = [
            { x: source.x + source.width, y: source.y + source.height / 2 },
            { x: source.x + source.width + (target.x - source.x - source.width) / 2, y: source.y + source.height / 2 },
            { x: source.x + source.width + (target.x - source.x - source.width) / 2, y: target.y + target.height / 2 },
            { x: target.x, y: target.y + target.height / 2 },
          ];
        }
      } else if (source.x + source.width / 2 > target.x + target.width - 10) {
        // 左侧
        if (source.x < target.x + target.width + 20 && source.y + source.height / 2 >= target.y + target.height - 10) {
          waypoints = [
            { x: source.x, y: source.y + source.height / 2 },
            { x: target.x + target.width / 2, y: source.y + source.height / 2 },
            { x: target.x + target.width / 2, y: target.y + target.height },
          ];
        } else if (source.x < target.x + target.width + 20 && source.y + source.height / 2 + 10 <= target.y) {
          waypoints = [
            { x: source.x, y: source.y + source.height / 2 },
            { x: target.x + target.width / 2, y: source.y + source.height / 2 },
            { x: target.x + target.width / 2, y: target.y },
          ];
        } else
          waypoints = [
            { x: source.x, y: source.y + source.height / 2 },
            { x: target.x + target.width + (source.x - target.x - target.width) / 2, y: source.y + source.height / 2 },
            { x: target.x + target.width + (source.x - target.x - target.width) / 2, y: target.y + target.height / 2 },
            { x: target.x + target.width, y: target.y + target.height / 2 },
          ];
      }
    }
    // 判断是横向还是纵向 如果是纵向 需要重新修改坐标
    modeling.updateWaypoints(connection, self.snapMiddleSegments(waypoints));
  });
}

GridSnappingLayoutConnectionBehavior.$inject = ['eventBus', 'gridSnapping', 'modeling', 'futureData'];
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
