import { bp } from '../src';

const PointParser = bp.object('Point', {
  /** X Offset */
  x: bp.lu16,
  /** Y Offset */
  y: bp.lu16,
});

const PointsParser = bp.object('SimpleObject', {
  length: bp.u8,
  // Array of points with length "len"
  points: bp.array('Points', PointParser, 'length', false),
});

const points = PointsParser.read([0x01, 0x01, 0x00, 0x02, 0x00]);

points.value.length; // 1
points.value.points[0]; // { x: 1, y: 2 }
points.value.points[0].x; // 1
points.value.points[0].y; // 2
