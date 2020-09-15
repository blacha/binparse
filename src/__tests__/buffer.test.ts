import o from 'ospec';
import { bp } from '../index';

o.spec('InputTypes', () => {
  o('String:Buffer', () => {
    const res = bp.string(4).raw(Buffer.from('defP'));
    o(res).equals('defP');
  });

  o('String:Number', () => {
    const res = bp.string(4).raw([100, 101, 102, 80, 83, 0]);
    o(res).equals('defP');
  });

  o('String:UInt8', () => {
    const buf = Buffer.from('defP');
    const uint8Array = new Uint8Array(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
    const res = bp.string(4).raw(uint8Array);
    o(res).equals('defP');
  });
});
