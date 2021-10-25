import { StrutBase } from './base.js';
import { StrutAny, StrutInfer, StrutParserContext, StrutParserInput, StrutType } from './type.js';

export type StrutReturnType<T> = { [K in keyof T]: StrutInfer<T[K]> };

export class StrutTypeObject<T extends Record<string, StrutAny>> extends StrutBase<StrutReturnType<T>> {
  type: StrutType<T>;
  fields: { key: string; parser: StrutAny }[];

  constructor(name: string, obj: T) {
    super(name);
    this.fields = [];
    for (const [key, parser] of Object.entries(obj)) {
      this.fields.push({ key, parser });
    }
  }

  private _size = -1;
  get size(): number {
    if (this._size > -1) return this._size;
    let size = 0;
    for (const ctx of this.fields) size += ctx.parser.size;
    this._size = size;
    return this._size;
  }

  parse(bytes: StrutParserInput, ctx: StrutParserContext): StrutReturnType<T> {
    const value = {} as Record<string, unknown>;
    for (const kv of this.fields) {
      const res = kv.parser.parse(bytes, ctx);
      if (res != null) value[kv.key] = res;
    }
    return value as StrutReturnType<T>;
  }
}
