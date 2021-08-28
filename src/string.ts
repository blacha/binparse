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

  get size(): number {
    throw new Error('Unable to calculate size from dynamic object');
  }

  parse(bytes: StrutParserInput, ctx: StrutParserContext): string {
    const offset = ctx.offset;

    const value: string[] = [];
    let size = 0;
    while (size + offset < bytes.length) {
      const res = bytes[offset + size];
      if (res === 0x00) break;
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
  size: number;
  constructor(maxLength: number) {
    super('String:' + maxLength);
    this.size = maxLength;
  }

  parse(bytes: StrutParserInput, ctx: StrutParserContext): string {
    const offset = ctx.offset;
    if (this.size + offset > bytes.length) {
      throw new Error(`BufferOverflow: ${this.name} offset: ${toHex(ctx.offset)}`);
    }
    const value: string[] = [];
    let size = 0;
    while (size < this.size) {
      const res = bytes[offset + size];
      if (res === 0x00) break;
      value.push(String.fromCharCode(res));
      size++;
    }
    ctx.offset += this.size;

    return value.join('');
  }
}
