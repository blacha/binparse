import { describe, it } from 'node:test';
import assert from 'node:assert';
import { bp } from '../index.js';

describe('InputTypes', () => {
  it('String:Buffer', () => {
    const res = bp.string(4).raw(Buffer.from('defP'));
    assert.equal(res, 'defP');
  });

  it('String:Number', () => {
    const res = bp.string(4).raw([100, 101, 102, 80, 83, 0]);
    assert.equal(res, 'defP');
  });

  it('String:UInt8', () => {
    const buf = Buffer.from('defP');
    const uint8Array = new Uint8Array(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
    const res = bp.string(4).raw(uint8Array);
    assert.equal(res, 'defP');
  });
});
