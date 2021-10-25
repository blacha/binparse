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

export class StrutTypeObjectGenerated<T extends Record<string, StrutAny>> extends StrutBase<StrutReturnType<T>> {
  type: StrutType<T>;
  parsers: StrutAny[];

  _parse: (bytes: StrutParserInput, ctx: StrutParserContext, parsers: StrutAny[]) => StrutReturnType<T>;

  constructor(name: string, obj: T) {
    super(name);
    this.parsers = [];
    const entries = Object.entries(obj);
    // No point generating a function for no entries
    if (entries.length === 0) return;
    let body = 'return {';
    for (let i = 0; i < entries.length; i++) {
      const [key, parser] = entries[i];
      this.parsers.push(parser);
      body += ` ${key}: _bp[${i}].parse(buf, ctx),`;
    }
    body += ' };';

    const func = new Function('_bp', 'buf', 'ctx', body);
    this.parse = func.bind(null, this.parsers);
  }

  private _size = -1;
  get size(): number {
    if (this._size > -1) return this._size;
    let size = 0;
    for (const ctx of this.parsers) size += ctx.size;
    this._size = size;
    return this._size;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  parse(bytes: StrutParserInput, ctx: StrutParserContext): StrutReturnType<T> {
    return {} as StrutReturnType<T>;
  }
}
