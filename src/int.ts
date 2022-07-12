import { StrutBase } from './base.js';
import { StrutParserContext, StrutParserInput } from './type.js';

export class UInt8 extends StrutBase<number> {
  size = 1;
  parse(bytes: StrutParserInput, pkt: StrutParserContext): number {
    const offset = pkt.offset;
    pkt.offset += this.size;
    return bytes[offset];
  }
}

export class LUInt16 extends StrutBase<number> {
  size = 2;
  parse(bytes: StrutParserInput, pkt: StrutParserContext): number {
    let offset = pkt.offset;
    const byteA = bytes[offset++];
    const byteB = bytes[offset++] << 8;
    pkt.offset += 2;
    return byteA | byteB;
  }
}

export class LUInt32 extends StrutBase<number> {
  size = 4;
  parse(bytes: StrutParserInput, pkt: StrutParserContext): number {
    let offset = pkt.offset;
    const byteA = bytes[offset++];
    const byteB = bytes[offset++] << 8;
    const byteC = bytes[offset++] << 16;
    const byteD = bytes[offset++] * 0x1000000;
    pkt.offset = offset;
    return (byteA | byteB | byteC) + byteD;
  }
}

const Pow32 = 2 ** 32;
/**
 *  Read a int from 64bits of number
 * **Warning** this can and will loose precision if the number is > Number.MAX_SAFE_INTEGER
 *
 * When using 64 bit for offsets all memory offsets can fit into a float without loosing precision,
 * as Number.MAX_SAFE_INTEGER is approx 9000TB in bytes
 */
export class LUInt64 extends StrutBase<number> {
  size = 8;
  parse(bytes: StrutParserInput, pkt: StrutParserContext): number {
    const intA = lu32.parse(bytes, pkt);
    const intB = lu32.parse(bytes, pkt);
    return intA + intB * Pow32; // Shifting by 32 doesn't work in javascript
  }
}

export class BigLUInt64 extends StrutBase<bigint> {
  size = 8;
  parse(bytes: StrutParserInput, pkt: StrutParserContext): bigint {
    const intA = BigInt(lu32.parse(bytes, pkt));
    const intB = BigInt(lu32.parse(bytes, pkt));
    return intA + (intB << BigInt(32));
  }
}

export const u8 = new UInt8('UInt8');
export const lu16 = new LUInt16('LUInt16');
export const lu32 = new LUInt32('LUInt32');
export const lu64 = new LUInt64('LUInt64');
export const blu64 = new BigLUInt64('BigLUInt64');
