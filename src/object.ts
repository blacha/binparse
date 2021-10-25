import { StrutBase } from './base.js';
import { StrutAny, StrutInfer, StrutParserContext, StrutParserInput, StrutType } from './type.js';

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

export class StrutTypeArray<T> extends StrutBase<T[]> {
  count: number;
  type: StrutType<T>;

  constructor(name: string, type: StrutType<T>, count: number) {
    super(`Array:${name}:${type.name}x${count}`);
    this.count = count;
    this.type = type;
  }

  get size(): number {
    return this.count * this.type.size;
  }

  parse(bytes: StrutParserInput, ctx: StrutParserContext): T[] {
    const value: T[] = [];
    for (let i = 0; i < this.count; i++) value.push(this.type.parse(bytes, ctx));
    return value;
  }
}

export class StrutTypeArrayOffset<T> extends StrutBase<T[]> {
  type: StrutType<T>;
  isMaxLength: boolean;
  /** Name of the variable to use as the length */
  lengthName: string;

  constructor(name: string, type: StrutType<T>, lengthVar: string, isMaxLength: boolean) {
    super('Array:Offset:' + name);
    this.isMaxLength = isMaxLength;
    this.lengthName = lengthVar;
    this.type = type;
  }

  /** Size cannot be calculated as it is variable */
  get size(): number {
    throw new Error('Unable to calculate size of dynamic object: ' + this.name);
  }

  parse(bytes: StrutParserInput, ctx: StrutParserContext): T[] {
    const value: T[] = [];
    let packetLength = ctx.vars?.[this.lengthName];
    if (packetLength == null) throw new Error(`${this.name}: Missing variable a "${this.lengthName}"`);
    if (this.isMaxLength) packetLength -= ctx.offset - ctx.startOffset;
    for (let i = 0; i < packetLength; i++) value.push(this.type.parse(bytes, ctx));
    return value;
  }
}

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
