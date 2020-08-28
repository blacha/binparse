export type StrutParserInput = number[] | Uint8Array | Buffer;

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
  /** Name of the parser */
  name: string;
  /** Parse some bytes with the provided context */
  parse(bytes: StrutParserInput, pkt: StrutParserContext): T;
}

export type StrutAny = StrutType<any>;
export type StrutEval<T> = T extends any[] | Date ? T : { [Key in keyof T]: T[Key] };
export type StrutInfer<T> = T extends StrutType<infer K> ? StrutEval<K> : never;
