import { StrutBase } from './base';
import { BitStream } from './bitstream';
import { StrutParserInput, StrutParserContext } from './type';

export class StrutTypeBits<T extends Record<string, number>> extends StrutBase<T> {
  fields: { key: string; bits: number }[];
  bytesRequired: number;

  constructor(name: string, obj: T) {
    super('Bits:' + name);
    let totalBits = 0;
    this.fields = Object.keys(obj).map((key) => {
      const bits = obj[key];
      totalBits += bits;
      return { key, bits };
    });
    this.bytesRequired = Math.ceil(totalBits / 8);
  }

  parse(bytes: StrutParserInput, pkt: StrutParserContext): T {
    const offset = pkt.offset;

    const output = {} as any;
    const bs = new BitStream(bytes, offset, offset + this.bytesRequired);
    for (const { key, bits } of this.fields) {
      output[key] = bs.bits(bits);
    }
    pkt.offset += this.bytesRequired;
    return output;
  }
}
