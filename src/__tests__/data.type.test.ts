import o from 'ospec';
import 'source-map-support/register';
import { StrutParserContext } from '../type';
import { bp } from '../index';
import { StrutTypeArrayOffset } from '../object';

o.spec('DataType', () => {
  let pkt: StrutParserContext;
  o.beforeEach(() => {
    pkt = { offset: 0, startOffset: 0 };
  });
  o.spec('String', () => {
    o('String:Fixed', () => {
      const res = bp.string(4).parse([100, 101, 102, 80, 83, 0], pkt);
      o(res).equals('defP');
      o(pkt.offset).equals(4);
    });
    o('String:Var', () => {
      const res = bp.string().parse([100, 101, 102, 80, 83, 0], pkt);
      o(res).equals('defPS');
      o(pkt.offset).equals(6);
    });
  });

  o.spec('Object', () => {
    o('should parse a object', () => {
      const obj = bp.object('Test', { u8: bp.u8, lu16: bp.lu16 });
      const res = obj.parse([255, 1, 0], pkt);
      o(res).deepEquals({ u8: 255, lu16: 1 });
    });
  });

  o.spec('Array', () => {
    o('should parse a array', () => {
      const obj = bp.bytes(4);
      const res = obj.parse([1, 2, 3, 4], pkt);
      o(res).deepEquals([1, 2, 3, 4]);
      o(pkt.offset).equals(4);
    });

    o('should parse a var array with offset', () => {
      const obj = bp.object('Obj', {
        len: bp.variable('len'),
        varArray: new StrutTypeArrayOffset('Test', bp.u8, 'len', true),
      });
      o(obj.parse([3, 2, 3, 4], pkt)).deepEquals({ len: 3, varArray: [2, 3] });
      o(pkt.offset).equals(3);
    });
    o('should parse a var array without offset', () => {
      const obj = bp.object('Obj', {
        len: bp.variable('len'),
        varArray: new StrutTypeArrayOffset('Test', bp.u8, 'len', false),
      });
      o(obj.parse([3, 2, 3, 4], pkt)).deepEquals({ len: 3, varArray: [2, 3, 4] });
      o(pkt.offset).equals(4);
    });
  });

  o.spec('Int', () => {
    o('uint8', () => {
      const bytes = [100, 101, 102, 80, 83, 0];
      o(bp.u8.parse(bytes, pkt)).equals(100);
      o(pkt.offset).equals(1);
      o(bp.u8.parse(bytes, pkt)).equals(101);
      o(pkt.offset).equals(2);
      o(bp.u8.parse(bytes, pkt)).equals(102);
      o(pkt.offset).equals(3);
      o(bp.u8.parse(bytes, pkt)).equals(80);
      o(pkt.offset).equals(4);
      o(bp.u8.parse(bytes, pkt)).equals(83);
      o(pkt.offset).equals(5);
    });

    o('uint16', () => {
      const bytes = [36, 0, 102, 80, 83, 0];
      o(bp.lu16.parse(bytes, pkt)).equals(36);
      o(pkt.offset).equals(2);
      o(bp.lu16.parse(bytes, pkt)).equals(20582);
      o(pkt.offset).equals(4);
    });

    o('uint32', () => {
      const bytes = [36, 0, 0, 0, 0, 0, 0, 1];
      o(bp.lu32.parse(bytes, pkt)).equals(36);
      o(pkt.offset).equals(4);
      o(bp.lu32.parse(bytes, pkt)).equals(16777216);
      o(pkt.offset).equals(8);

      o(bp.lu32.parse([1, 0, 0, 0], { offset: 0, startOffset: 0 })).equals(1);
      o(bp.lu32.parse([0, 1, 0, 0], { offset: 0, startOffset: 0 })).equals(256);
      o(bp.lu32.parse([0, 0, 1, 0], { offset: 0, startOffset: 0 })).equals(65536);
      o(bp.lu32.parse([0, 0, 0, 1], { offset: 0, startOffset: 0 })).equals(16777216);
      o(bp.lu32.parse([255, 255, 255, 1], { offset: 0, startOffset: 0 })).equals(33554431);
    });

    o('unit32 from buffer', () => {
      const bytes = Buffer.from([0xdd, 0x7e, 0xf4, 0xaa, 0x7f, 0xf7, 0x8c, 0xa6]);
      const uintA = bp.lu32.parse(bytes, { offset: 0, startOffset: 4 });
      const uintB = bp.lu32.parse(bytes, { offset: 4, startOffset: 4 });

      o(uintA).equals(bytes.readUInt32LE(0));
      o(uintB).equals(bytes.readUInt32LE(4));

      const outputBuffer = Buffer.alloc(bytes.length);
      outputBuffer.writeUInt32LE(uintA, 0);
      outputBuffer.writeUInt32LE(uintB, 4);

      o(outputBuffer.toString('hex')).equals(bytes.toString('hex'));
    });
  });
});
