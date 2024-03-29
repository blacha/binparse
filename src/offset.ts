import { StrutBase } from './base.js';
import { toHex } from './hex.js';
import { StrutParserContext, StrutParserInput, StrutType } from './type.js';

/**
 * Variable length string that is null terminated.
 */
export class StrutTypeOffset<T> extends StrutBase<T> {
  type: StrutType<T>;
  offset: StrutType<number>;
  constructor(offset: StrutType<number>, type: StrutType<T>) {
    super('Offset:' + offset.name + ':' + type.name);
    this.type = type;
    this.offset = offset;
  }

  get size(): number {
    return this.type.size;
  }

  parse(bytes: StrutParserInput, ctx: StrutParserContext): T {
    const readAt = this.offset.parse(bytes, ctx);
    if (readAt > bytes.length || readAt < 0) {
      throw new Error(`[${this.name}]: BufferOverflow attempted read at ${toHex(readAt)}`);
    }
    return this.type.parse(bytes, { offset: readAt, startOffset: readAt });
  }
}
