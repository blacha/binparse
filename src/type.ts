/** Minimal interface that should allow for `UInt8Array` `Buffer` and `number[]` to be passed into our functions */
export interface StrutParserInput {
  readonly [n: number]: number;
  length: number;
  slice(start: number, end: number): StrutParserInput;
}

/** Parser context that is passed around during the parsing process */
export interface StrutParserContext {
  /** Current offset */
  offset: number;
  /** Offset the current strut parser started at */
  startOffset: number;
  /** Values to be used in other strut parsers */
  vars?: Record<string, number>;
}

export interface StrutType<T> {
  /** Number of bytes needed */
  size: number;
  /** Name of the parser */
  name: string;
  /** Parse some bytes with the provided context */
  parse(bytes: StrutParserInput, pkt: StrutParserContext): T;

  /** Read in the data throwing away any parser information */
  raw(bytes: StrutParserInput, offset?: number): T;

  /** Refine the type using a custom function */
  refine<TOut>(cb: RefineCallBack<T, TOut>): StrutType<TOut>;
}

export type RefineCallBack<TIn, TOut> = (value: TIn, bytes?: StrutParserInput, pkt?: StrutParserContext) => TOut;

export type StrutAny = StrutType<any>;
export type StrutEval<T> = T extends any[] | Date ? T : { [Key in keyof T]: T[Key] };
export type StrutInfer<T> = T extends StrutType<infer K> ? StrutEval<K> : never;
