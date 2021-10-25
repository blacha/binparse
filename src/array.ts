import { StrutBase } from './base.js';
import { StrutParserContext, StrutParserInput, StrutType } from './type.js';

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
