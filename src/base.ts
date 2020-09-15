import { StrutParserContext, StrutParserInput, StrutType } from './type';

export abstract class StrutBase<T> implements StrutType<T> {
  /** Human friendly name of the parser */
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  abstract parse(bytes: StrutParserInput, pkt: StrutParserContext): T;

  /** Read in raw instance of this object */
  raw(bytes: StrutParserInput, offset = 0): T {
    return this.parse(bytes, { offset, startOffset: 0 });
  }

  /** Read in a new instance of this object */
  read(bytes: StrutParserInput): { value: T; offset: number } {
    const ctx = { offset: 0, startOffset: 0 };
    const value = this.parse(bytes, ctx);
    return { value, offset: ctx.offset };
  }
}
