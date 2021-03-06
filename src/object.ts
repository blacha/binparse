import { StrutBase } from './base';
import { StrutAny, StrutParserContext, StrutType, StrutInfer, StrutParserInput } from './type';

export class StrutTypeBytes extends StrutBase<StrutParserInput> {
  count: number;

  constructor(count: number) {
    super('Bytes:' + count);
    this.count = count;
  }

  parse(bytes: StrutParserInput, ctx: StrutParserContext): StrutParserInput {
    const value = bytes.slice(ctx.offset, ctx.offset + this.count);
    ctx.offset += this.count;
    return value;
  }
}

export class StrutTypeSkip extends StrutBase<undefined> {
  count: number;

  constructor(count: number) {
    super('Skip:' + count);
    this.count = count;
  }

  parse(bytes: StrutParserInput, ctx: StrutParserContext): undefined {
    ctx.offset += this.count;
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

  parse(bytes: StrutParserInput, ctx: StrutParserContext): T[] {
    const value: T[] = [];
    let packetLength = ctx.vars?.[this.lengthName];
    if (packetLength == null) throw new Error(`${this.name}: Missing variable a "${this.lengthName}"`);
    if (this.isMaxLength) packetLength -= ctx.offset - ctx.startOffset;
    for (let i = 0; i < packetLength; i++) value.push(this.type.parse(bytes, ctx));
    return value;
  }
}

export class StrutTypeObject<T extends Record<string, StrutAny>> extends StrutBase<
  { [K in keyof T]: StrutInfer<T[K]> }
> {
  type: StrutType<T>;
  fields: [string, StrutAny][];

  constructor(name: string, obj: T) {
    super(name);
    this.fields = Object.entries(obj);
  }

  parse(bytes: StrutParserInput, ctx: StrutParserContext): { [K in keyof T]: StrutInfer<T[K]> } {
    const value = {} as any;
    for (const [key, parser] of this.fields) {
      value[key] = parser.parse(bytes, ctx);
      if (ctx.offset > bytes.length) throw new Error(`${this.name}: Buffer Overflow`);
    }
    return value;
  }
}
