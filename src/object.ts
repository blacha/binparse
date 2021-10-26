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
      value[kv.key] = kv.parser.parse(bytes, ctx, value);
    }
    return value as StrutReturnType<T>;
  }
}

/**
 * Generate a object parser this is significantly faster than `StrutTypeObject`
 * initial benchmarks put it at almost 10x faster
 */
export class StrutTypeObjectGenerated<T extends Record<string, StrutAny>> extends StrutBase<StrutReturnType<T>> {
  type: StrutType<T>;
  fields: { key: string; parser: StrutAny }[] = [];

  constructor(name: string, obj: T) {
    super(name);

    const entries = Object.entries(obj);
    let isLookupRequired = false;
    for (const [key, parser] of entries) {
      /**
       * Determine if any sub objects need a reference to the current object during parsing as it is slightly slower
       * try and avoid it if possible
       */
      if (parser.isLookupRequired) isLookupRequired = true;
      this.fields.push({ key, parser });
    }

    // No point generating a function for no entries
    if (entries.length === 0) return;

    if (isLookupRequired) this.generateObjectAssign();
    else this.generateSingleObject();
  }
  /**
   * This method is slightly faster than `generateObjectAssign` but generates single line return
   *
   * Basic testing shows it to be roughly 20% faster than the other method
   *
   * @see StrutTypeObjectGenerated.generateObjectAssign
   */
  generateSingleObject(): void {
    const parsers: StrutAny[] = [];

    let body = '"use strict"; return {';
    for (let i = 0; i < this.fields.length; i++) {
      parsers.push(this.fields[i].parser);
      body += ` ${JSON.stringify(this.fields[i].key)}: _bp[${i}].parse(buf, ctx),`;
    }
    body += ' };';
    const func = new Function('_bp', 'buf', 'ctx', body);
    this.parse = func.bind(null, parsers);
  }

  /**
   * This method is slightly slower object creation than `generateSingleObject`
   * It is needed when sub objects want to reference the object being parsed
   *
   * @see StrutTypeObjectGenerated.generateSingleObject
   */
  generateObjectAssign(): void {
    const parsers: StrutAny[] = [];

    let body = '"use strict"; const ret = {};\n';
    for (let i = 0; i < this.fields.length; i++) {
      parsers.push(this.fields[i].parser);
      body += `ret[${JSON.stringify(this.fields[i].key)}] = _bp[${i}].parse(buf, ctx, ret)\n`;
    }
    body += `return ret`;
    const func = new Function('_bp', 'buf', 'ctx', body);
    this.parse = func.bind(null, parsers);
  }

  private _size = -1;
  get size(): number {
    if (this._size > -1) return this._size;
    let size = 0;
    for (const ctx of this.fields) size += ctx.parser.size;
    this._size = size;
    return this._size;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  parse(bytes: StrutParserInput, ctx: StrutParserContext): StrutReturnType<T> {
    return {} as StrutReturnType<T>;
  }
}
