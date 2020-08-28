import { StrutParserContext, StrutParserInput, StrutType } from './type';

export class StrutTypeLookup<T, K extends keyof T> implements StrutType<{ id: T[K]; name: keyof T }> {
  name: string;
  type: StrutType<number>;
  lookup: (id: number) => keyof T;

  constructor(name: string, type: StrutType<number>, lookup: (id: number) => keyof T) {
    this.lookup = lookup;
    this.type = type;
    this.name = 'Lookup:' + name;
  }

  parse(bytes: StrutParserInput, ctx: StrutParserContext): { id: T[K]; name: keyof T } {
    const id = this.type.parse(bytes, ctx) as any;
    const name = this.lookup(id);
    if (name == null) throw new Error(`${this.name}: Failed to lookup ${id}`);
    return { id, name };
  }
}
