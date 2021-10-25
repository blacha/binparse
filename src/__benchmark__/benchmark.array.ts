import { bp } from '../index.js';

const PointParser = bp.object('Point', {
  x: bp.lu16,
  y: bp.lu32,
});

const PointsParser = bp.object('SimpleObject', {
  length: bp.lu32,
  points: bp.array('Points', PointParser, 'length'),
});

const n = 1000;
const buf = Buffer.alloc(4 + n * 6);

buf.writeUInt32LE(n, 0);
for (let i = 0; i < n; i++) {
  buf.writeUInt16LE(123, 4 + i * 4);
  buf.writeUInt32LE(456, 4 + i * 4 + 2);
}

for (let i = 0; i < 1_000; i++) {
  PointsParser.read(buf);
}
