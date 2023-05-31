import { describe, it } from 'node:test';
import assert from 'node:assert';
import { blu64, lu64 } from '../int.js';

describe('Uint64', () => {
  it('should parse a uint 64', () => {
    const buf = Buffer.from([0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    assert.equal(blu64.raw(buf), buf.readBigUInt64LE(0));
    assert.equal(lu64.raw(buf), 1);
  });

  it('should loose precision', () => {
    const buf = Buffer.alloc(8);
    const tooBig = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(2);
    buf.writeBigInt64LE(tooBig, 0);

    assert.equal(blu64.raw(buf), tooBig);
    // TODO should this throw if number is too large
    assert.notEqual(String(lu64.raw(buf)), String(tooBig));
  });
});
