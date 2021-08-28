import { RefineCallBack, StrutParserContext, StrutParserInput, StrutType } from './type';

export abstract class StrutBase<T> implements StrutType<T> {
  /** Human friendly name of the parser */
  name: string;

  /** number of bytes needed to read this object */
  abstract size: number;

  constructor(name: string) {
    this.name = name;
  }

  abstract parse(bytes: StrutParserInput, pkt: StrutParserContext): T;

  /** Read in raw instance of this object */
  raw(bytes: StrutParserInput, offset = 0): T {
    return this.parse(bytes, { offset, startOffset: 0 });
  }

  /** Read in a new instance of this object */
  read(bytes: StrutParserInput, offset = 0): { value: T; offset: number } {
    const ctx = { offset, startOffset: offset };
    const value = this.parse(bytes, ctx);
    return { value, offset: ctx.offset };
  }

  refine<TOut>(cb: RefineCallBack<T, TOut>): StrutType<TOut> {
    return new StrutRefine(this, cb);
  }
}


export class StrutRefine<TOut, TIn> extends StrutBase<TOut> {
  cb: RefineCallBack<TIn, TOut>;
  input: StrutBase<TIn>;

  constructor(input: StrutBase<TIn>, cb: RefineCallBack<TIn, TOut>) {
    super('Function:' + input.name);
    this.input = input;
    this.cb = cb;
  }

  get size(): number {
    return this.input.size;
  }

  parse(bytes: StrutParserInput, ctx: StrutParserContext): TOut {
    const value = this.input.parse(bytes, ctx);
    return this.cb(value, bytes, ctx);
  }
}
