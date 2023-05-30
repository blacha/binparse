import { describe, it } from 'node:test';
import assert from 'node:assert';
import { BitStream } from '../index.js';

describe('BitStream', () => {
  function toNullString(str: string): Buffer {
    const buf = [];
    for (let i = 0; i < str.length; i++) buf.push(str.charCodeAt(i));
    return Buffer.from(buf);
  }
  it('should read bits from a stream', () => {
    const reader = new BitStream([0b1]);
    assert.equal(reader.bit(), 1);
    assert.equal(reader.offset, 1);
    assert.equal(reader.maxOffset, 8);
    assert.equal(reader.bit(), 0);
  });

  it('should read little endian', () => {
    assert.equal(new BitStream([0xff]).bits(8), 255);
    assert.equal(new BitStream([0xff, 0xff]).bits(16), 256 * 256 - 1);
    assert.equal(new BitStream([0xff, 0xff, 0xff, 0xff]).bits(32), 256 ** 4 - 1);
  });

  it('should read a boolean', () => {
    const br = new BitStream([0b10]);
    assert.equal(br.bool(), false);
    assert.equal(br.bool(), true);
  });

  it('should read a string', () => {
    // o(new BitStream(toNullString('Hello')).string()).equals('Hello');
    // o(new BitStream(toNullString('Hello World')).string(2)).equals('He');

    const reader = new BitStream(toNullString('Hello\x00World'));
    assert.equal(reader.string(), 'Hello');
    assert.equal(reader.string(), 'World');
  });
});
