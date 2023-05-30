import { describe, beforeEach, it } from 'node:test';
import assert from 'node:assert';
import 'source-map-support/register.js';
import { StrutParserContext } from '../type.js';
import { bp } from '../index.js';
import { StrutTypeArrayOffset } from '../array.js';

describe('DataType', () => {
  let pkt: StrutParserContext;
  beforeEach(() => {
    pkt = { offset: 0, startOffset: 0 };
  });
  it('String:Fixed', () => {
    const res = bp.string(4).parse([100, 101, 102, 80, 83, 0], pkt);
    assert.equal(res, 'defP');
    assert.equal(pkt.offset, 4);
  });
  it('String:Var', () => {
    const res = bp.string().parse([100, 101, 102, 80, 83, 0], pkt);
    assert.equal(res, 'defPS');
    assert.equal(pkt.offset, 6);
  });

  it('should parse a object', () => {
    const obj = bp.object('Test', { u8: bp.u8, lu16: bp.lu16 });
    const res = obj.parse([255, 1, 0], pkt);
    assert.deepEqual(res, { u8: 255, lu16: 1 });
    assert.equal(obj.size, 3);
  });

  it('should parse a array', () => {
    const obj = bp.bytes(4);
    assert.equal(obj.size, 4);
    const res = obj.parse([1, 2, 3, 4], pkt);
    assert.deepEqual(res, [1, 2, 3, 4]);
    assert.equal(pkt.offset, 4);
  });

  it('should parse a var array with offset', () => {
    const obj = bp.object('Obj', {
      len: bp.u8,
      varArray: new StrutTypeArrayOffset('Test', bp.u8, 'len', true),
    });
    assert.deepEqual(obj.parse([3, 2, 3, 4], pkt), { len: 3, varArray: [2, 3] });
    assert.equal(pkt.offset, 3);
    assert.throws(() => obj.size, Error);
  });
  it('should parse a var array without offset', () => {
    const obj = bp.object('Obj', {
      len: bp.u8,
      varArray: new StrutTypeArrayOffset('Test', bp.u8, 'len', false),
    });
    assert.deepEqual(obj.parse([3, 2, 3, 4], pkt), { len: 3, varArray: [2, 3, 4] });
    assert.equal(pkt.offset, 4);
    assert.throws(() => obj.size, Error);
  });

  it('uint8', () => {
    assert.equal(bp.u8.size, 1);
    const bytes = [100, 101, 102, 80, 83, 0];
    assert.equal(bp.u8.parse(bytes, pkt), 100);
    assert.equal(pkt.offset, 1);
    assert.equal(bp.u8.parse(bytes, pkt), 101);
    assert.equal(pkt.offset, 2);
    assert.equal(bp.u8.parse(bytes, pkt), 102);
    assert.equal(pkt.offset, 3);
    assert.equal(bp.u8.parse(bytes, pkt), 80);
    assert.equal(pkt.offset, 4);
    assert.equal(bp.u8.parse(bytes, pkt), 83);
    assert.equal(pkt.offset, 5);
  });

  it('uint16', () => {
    assert.equal(bp.lu16.size, 2);
    const bytes = [36, 0, 102, 80, 83, 0];
    assert.equal(bp.lu16.parse(bytes, pkt), 36);
    assert.equal(pkt.offset, 2);
    assert.equal(bp.lu16.parse(bytes, pkt), 20582);
    assert.equal(pkt.offset, 4);
  });

  it('uint32', () => {
    assert.equal(bp.lu32.size, 4);

    const bytes = [36, 0, 0, 0, 0, 0, 0, 1];
    assert.equal(bp.lu32.parse(bytes, pkt), 36);
    assert.equal(pkt.offset, 4);
    assert.equal(bp.lu32.parse(bytes, pkt), 16777216);
    assert.equal(pkt.offset, 8);

    assert.equal(bp.lu32.parse([1, 0, 0, 0], { offset: 0, startOffset: 0 }), 1);
    assert.equal(bp.lu32.parse([0, 1, 0, 0], { offset: 0, startOffset: 0 }), 256);
    assert.equal(bp.lu32.parse([0, 0, 1, 0], { offset: 0, startOffset: 0 }), 65536);
    assert.equal(bp.lu32.parse([0, 0, 0, 1], { offset: 0, startOffset: 0 }), 16777216);
    assert.equal(bp.lu32.parse([255, 255, 255, 1], { offset: 0, startOffset: 0 }), 33554431);
  });

  it('unit32 from buffer', () => {
    const bytes = Buffer.from([0xdd, 0x7e, 0xf4, 0xaa, 0x7f, 0xf7, 0x8c, 0xa6]);
    const uintA = bp.lu32.parse(bytes, { offset: 0, startOffset: 4 });
    const uintB = bp.lu32.parse(bytes, { offset: 4, startOffset: 4 });

    assert.equal(uintA, bytes.readUInt32LE(0));
    assert.equal(uintB, bytes.readUInt32LE(4));

    const outputBuffer = Buffer.alloc(bytes.length);
    outputBuffer.writeUInt32LE(uintA, 0);
    outputBuffer.writeUInt32LE(uintB, 4);

    assert.equal(outputBuffer.toString('hex'), bytes.toString('hex'));
  });
});
