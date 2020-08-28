import { StrutBase } from './base';
import { toHex } from './hex';
import { StrutParserContext, StrutParserInput } from './type';

/**
 * Variable length string that is null terminated.
 */
export class StrutTypeStringNull extends StrutBase<string> {
  constructor() {
    super('String');
  }
  parse(bytes: StrutParserInput, ctx: StrutParserContext): string {
    const offset = ctx.offset;

    const value: string[] = [];
    let size = 0;
    while (size + offset < bytes.length) {
      const res = bytes[offset + size];
      if (res == 0x00) break;
      value.push(String.fromCharCode(res));
      size++;
    }
    ctx.offset += size + 1;

    return value.join('');
  }
}

/**
 * Fixed length string
 *
 * will stop parsing when first `0x00` is read in or
 * max length which ever is first
 */
export class StrutTypeStringFixed extends StrutBase<string> {
  maxLength: number;
  constructor(maxLength: number) {
    super('String:' + maxLength);
    this.maxLength = maxLength;
  }
  parse(bytes: StrutParserInput, ctx: StrutParserContext): string {
    const offset = ctx.offset;
    if (this.maxLength + offset > bytes.length) {
      throw new Error(`BufferOverflow: ${this.name} offset: ${toHex(ctx.offset)}`);
    }
    const value: string[] = [];
    let size = 0;
    while (size < this.maxLength) {
      const res = bytes[offset + size];
      if (res == 0x00) break;
      value.push(String.fromCharCode(res));
      size++;
    }
    ctx.offset += this.maxLength;

    return value.join('');
  }
}
