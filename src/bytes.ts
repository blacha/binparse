import { StrutBase } from './base.js';
import { StrutParserInput, StrutParserContext } from './type.js';

export class StrutTypeBytes extends StrutBase<StrutParserInput> {
  size: number;

  constructor(count: number) {
    super('Bytes:' + count);
    this.size = count;
  }

  parse(bytes: StrutParserInput, ctx: StrutParserContext): StrutParserInput {
    const value = bytes.slice(ctx.offset, ctx.offset + this.size);
    ctx.offset += this.size;
    return value;
  }
}
