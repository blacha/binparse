import { StrutBase } from './base';
import { StrutParserContext, StrutParserInput } from './type';

export class UInt8 extends StrutBase<number> {
  parse(bytes: StrutParserInput, pkt: StrutParserContext): number {
    const offset = pkt.offset;
    pkt.offset++;
    return bytes[offset];
  }
}

export class LUInt16 extends StrutBase<number> {
  parse(bytes: StrutParserInput, pkt: StrutParserContext): number {
    const offset = pkt.offset;
    const byteA = bytes[offset];
    const byteB = bytes[offset + 1] << 8;
    pkt.offset += 2;
    return byteA + byteB;
  }
}
export class LUInt32 extends StrutBase<number> {
  parse(bytes: StrutParserInput, pkt: StrutParserContext): number {
    const offset = pkt.offset;
    const byteA = bytes[offset];
    const byteB = bytes[offset + 1] << 8;
    const byteC = bytes[offset + 2] << 16;
    const byteD = bytes[offset + 3] << 24;
    pkt.offset += 4;
    return byteA + byteB + byteC + byteD;
  }
}
