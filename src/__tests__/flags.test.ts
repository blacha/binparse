import { describe, it } from 'node:test';
import assert from 'node:assert';
import { bp } from '../index.js';

describe('StrutTypeFlags', () => {
  it('should parse flags', () => {
    const flags = bp.flags('RGB', bp.u8, { r: 0x01, g: 0x02, b: 0x04 });
    const output = flags.raw([0b101]);
    assert.deepEqual(output, { r: true, b: true });
  });

  it('should calculate size', () => {
    assert.equal(bp.flags('RGB', bp.u8, { r: 0x01 }).size, 1);
    assert.equal(bp.flags('RGB', bp.lu16, { r: 0x01 }).size, 2);
    assert.equal(bp.flags('RGB', bp.lu32, { r: 0x01 }).size, 4);
  });
});
