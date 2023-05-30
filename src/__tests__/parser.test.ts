import { describe, it } from 'node:test';
import assert from 'node:assert';
import { bp } from '../index.js';

describe('Object', () => {
  it('should parse a object', () => {
    const simpleParser = bp.object('SimpleObject', {
      x: bp.lu16,
      y: bp.lu16,
    });

    const { value, offset } = simpleParser.read([0x00, 0x01, 0x01, 0x00]);
    assert.equal(offset, 4);
    assert.deepEqual(value, { x: 256, y: 1 });
  });
});

describe('Bits', () => {
  it('should parse bitflags', () => {
    const PointParser = bp.object('Flags', {
      flags: bp.bits('Flags', {
        isRed: 1,
        isGreen: 1,
        isBlue: 1,
        isAlpha: 1,
      }),
    });

    const { value } = PointParser.read([0b0101]);
    assert.deepEqual(value.flags, { isRed: 1, isGreen: 0, isBlue: 1, isAlpha: 0 });
  });
});
