import { StrutBase } from './base.js';
import { StrutType, StrutParserContext, StrutParserInput } from './type.js';

export class StrutTypeVariable extends StrutBase<number> {
  type: StrutType<number>;

  /** Name of the variable to use to store the length */
  variable: string;
  constructor(variable: string, type: StrutType<number>) {
    super(`Variable:${type.name}:${variable}`);
    this.type = type;
    this.variable = variable;
  }

  get size(): number {
    return this.type.size;
  }

  parse(bytes: StrutParserInput, pkt: StrutParserContext): number {
    const value = this.type.parse(bytes, pkt);
    if (pkt.vars) {
      pkt.vars[this.variable] = value;
    } else {
      pkt.vars = { [this.variable]: value };
    }
    return value;
  }
}
