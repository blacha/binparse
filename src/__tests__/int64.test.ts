import o from 'ospec';
import { blu64, lu64 } from '../int';

o.spec('Uint64', () => {
  o('should parse a uint 64', () => {
    const buf = Buffer.from([0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    o(blu64.raw(buf)).equals(buf.readBigUInt64LE(0));
    o(lu64.raw(buf)).equals(1);
  });

  o('should loose precision', () => {
    const buf = Buffer.alloc(8);
    const tooBig = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(2);
    buf.writeBigInt64LE(tooBig, 0);

    o(blu64.raw(buf)).equals(tooBig);
    // TODO should this throw if number is too large
    o(String(lu64.raw(buf))).notEquals(String(tooBig));
  });
});
