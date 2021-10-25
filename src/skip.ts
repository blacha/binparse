import { StrutBase } from './base.js';
import { StrutParserContext, StrutParserInput } from './type.js';

/** Skip count amount of bytes from the buffer */
export class StrutTypeSkip extends StrutBase<undefined> {
  size: number;

  constructor(count: number) {
    super('Skip:' + count);
    this.size = count;
  }

  parse(bytes: StrutParserInput, ctx: StrutParserContext): undefined {
    ctx.offset += this.size;
    return undefined;
  }
}
