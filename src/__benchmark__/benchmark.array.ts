import { bp } from '../index.js';

const PointParser = bp.object('Point', {
  x: bp.lu16,
  y: bp.lu16,
});

const PointsParser = bp.object('SimpleObject', {
  length: bp.variable('len', bp.lu32),
  points: bp.array('Points', PointParser, 'len'),
});

const n = 1000;
const buf = Buffer.alloc(4 + n * 2 * 2);

buf.writeUInt32LE(n, 0);
for (let i = 0; i < n; i++) {
  buf.writeUInt16LE(123, i * 4);
  buf.writeUInt16LE(456, i * 4 + 2);
}

for (let i = 0; i < 1_000_000; i++) {
  PointsParser.raw(buf);
}
