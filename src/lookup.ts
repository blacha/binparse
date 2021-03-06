import { StrutBase } from './base';
import { StrutParserContext, StrutParserInput, StrutType } from './type';

type ValueOf<T> = T[keyof T];

export class StrutTypeLookup<T> extends StrutBase<{ id: ValueOf<T>; name: keyof T }> {
  name: string;
  type: StrutType<number>;
  lookup: (id: number) => keyof T | undefined;

  constructor(name: string, type: StrutType<number>, lookup: (id: number) => keyof T | undefined) {
    super('Lookup:' + name);
    this.lookup = lookup;
    this.type = type;
  }

  parse(bytes: StrutParserInput, ctx: StrutParserContext): { id: ValueOf<T>; name: keyof T } {
    const id = this.type.parse(bytes, ctx) as any;
    const name = this.lookup(id);
    if (name == null) throw new Error(`${this.name}: Failed to lookup ${id}`);
    return { id, name } as any;
  }
}

export class StrutTypeEnum<T extends Record<string, string | number>> extends StrutBase<{
  id: ValueOf<T>;
  name: keyof T;
}> {
  enumeration: T;
  type: StrutType<number>;
  constructor(name: string, type: StrutType<number>, enumeration: T) {
    super('Enum:' + name);
    this.enumeration = enumeration;
    this.type = type;
  }
  parse(bytes: StrutParserInput, ctx: StrutParserContext): { id: ValueOf<T>; name: keyof T } {
    const id = this.type.parse(bytes, ctx) as any;
    const name = this.enumeration[id] as keyof T;
    if (name == null) throw new Error(`${this.name}: Failed to lookup ${id}`);
    return { id, name };
  }
}
