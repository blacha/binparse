import { bp } from '../index.js';
import o from 'ospec';
const { at, lu16 } = bp;

o.spec('ExplicitLocation', () => {
  const buf = Buffer.from([
    0x00, 0x00, 0x01, 0x00, 0x02, 0x00, 0x03, 0x00, 0x04, 0x00, 0x05, 0x00, 0x06, 0x00, 0x07, 0x00, 0x08, 0x00, 0x09,
    0x00, 0x0a, 0x00, 0x0b, 0x00, 0x0c, 0x00, 0x0d, 0x00, 0x0e, 0x00, 0x0f, 0x00, 0x10, 0x00, 0x11, 0x00,
  ]);

  //   const buf = Buffer.alloc(0x24);
  o('should parse a complex object from buffer', () => {
    const locStrut = bp.object('Location', {
      xOffset: at(0x00, lu16),
      x: at(0x02, lu16),
      yOffset: at(0x04, lu16),
      y: at(0x06, lu16),
      staticX: at(0x10, lu16),
      staticY: at(0x14, lu16),
      pRoom: at(0x20, lu16),
    });
    const ret = locStrut.read(buf);
    o(ret.value).deepEquals({ xOffset: 0, x: 1, yOffset: 2, y: 3, staticX: 8, staticY: 10, pRoom: 16 });
    o(ret.offset).equals(0x22);
  });

  o('should extract from the middle of a buffer', () => {
    const jumpingStruct = bp.object('Loc', {
      beforeA: lu16,
      beforeB: lu16,
      jumpA: at(0x00, lu16), // Jump back to 0x00 and read 0x2 bytes
      afterJump: lu16,
    });

    const ret = jumpingStruct.read(buf);

    o(ret.value).deepEquals({ beforeA: 0, beforeB: 1, jumpA: 0, afterJump: 1 });
    o(ret.offset).equals(4);
  });
});
