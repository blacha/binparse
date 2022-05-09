import { StrutBase } from './base.js';
import { toHex } from './hex.js';
import { StrutParserContext, StrutParserInput, StrutType } from './type.js';

/**
 * Read a object at a specific offset
 */
export class StrutTypeAt<T> extends StrutBase<T> {
  type: StrutType<T>;
  offset: number;
  constructor(offset: number, type: StrutType<T>) {
    super('At:' + toHex(offset) + ':' + type.name);
    this.type = type;
    this.offset = offset;
  }

  get size(): number {
    throw new Error('Cannot calculate size with: ' + this.name);
  }

  parse(bytes: StrutParserInput, ctx: StrutParserContext): T {
    const readAt = ctx.startOffset + this.offset;
    if (readAt > bytes.length || readAt < 0) {
      throw new Error(`[${this.name}]: BufferOverflow attempted read at ${toHex(readAt)}`);
    }

    const readAmount = { offset: readAt, startOffset: ctx.startOffset };
    const ret = this.type.parse(bytes, readAmount);
    ctx.offset = readAmount.offset;
    return ret;
  }
}
