import { StrutBase } from './base';
import { BitStream } from './bitstream';
import { StrutParserInput, StrutParserContext, StrutType } from './type';

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

export class StrutTypeFlags<T extends Record<string, number>> extends StrutBase<Partial<Record<keyof T, boolean>>> {
  type: StrutType<number>;
  fields: [string, number][];
  constructor(name: string, type: StrutType<number>, obj: T) {
    super('BitsFlags:' + name);
    this.type = type;
    this.fields = Object.entries(obj);
  }

  parse(bytes: StrutParserInput, pkt: StrutParserContext): Record<keyof T, boolean> {
    const raw = this.type.parse(bytes, pkt);
    const output = {} as any;
    for (const [key, value] of this.fields) {
      const flagValue = (raw & value) === value;
      if (flagValue) output[key] = flagValue;
    }
    return output;
  }
}
