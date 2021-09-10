import o from 'ospec';
import { bp } from '../index.js';

o.spec('Object', () => {
  o('should parse a object', () => {
    const simpleParser = bp.object('SimpleObject', {
      x: bp.lu16,
      y: bp.lu16,
    });

    const { value, offset } = simpleParser.read([0x00, 0x01, 0x01, 0x00]);
    o(offset).equals(4);
    o(value).deepEquals({ x: 256, y: 1 });
  });
});

o.spec('Bits', () => {
  o('should parse bitflags', () => {
    const PointParser = bp.object('Flags', {
      flags: bp.bits('Flags', {
        isRed: 1,
        isGreen: 1,
        isBlue: 1,
        isAlpha: 1,
      }),
    });

    const { value } = PointParser.read([0b0101]);
    o(value.flags).deepEquals({ isRed: 1, isGreen: 0, isBlue: 1, isAlpha: 0 });
  });
});
