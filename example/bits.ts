import { bp } from '../src';

const FlagParser = bp.bits('Flags', {
  isRed: 1,
  isGreen: 1,
  isBlue: 1,
  isAlpha: 1,
});

const { value } = FlagParser.read([0b0101]);

value.isRed; // true
value.isGreen; // false
value.isBlue; // true
value.isAlpha; // false
