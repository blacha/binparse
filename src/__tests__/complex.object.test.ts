import { describe, it } from 'node:test';
import assert from 'node:assert';
import { bp } from '../index.js';

describe('ComplexStruts', () => {
  const pkt = Buffer.from(
    '260400020000000001005b61646d696e6973747261746f725d00ff6339475323383a205379646e65792c4155532e20737570706f7274656420627920414345204775696c642020ff633400',
    'hex',
  );
  it('should parse multiple strings', () => {
    const parser = bp.object('ChatMessage', {
      packetId: bp.u8,
      chatKind: bp.lu16,
      unk1: bp.lu16,
      unk2: bp.lu32,
      type: bp.u8,
      name: bp.string(),
      message: bp.string(),
    });

    const res = parser.raw(pkt);

    assert.equal(res.packetId, 38);
    assert.equal(res['chatKind'], 4);
    assert.equal(res.name, '[administrator]');
  });

  it('should read at exact location', () => {
    const parser = bp.object('ChatMessage', {
      name: bp.at(10, bp.string()),
      message: bp.string(),
    });

    const res = parser.raw(pkt);
    assert.equal(res.name, '[administrator]');
    assert.equal(res.message.includes('Sydney'), true);
  });

  it('should support weird item names', () => {
    const pkt = Buffer.from('01020304', 'hex');
    const parser = bp.object('Message', {
      "'": bp.u8,
      'chat-kind': bp.u8,
      '"message"': bp.u8,
      '`': bp.u8,
    });

    const res = parser.raw(pkt);
    assert.equal(res["'"], 1);
    assert.equal(res['chat-kind'], 2);
    assert.equal(res['"message"'], 3);
    assert.equal(res['`'], 4);
  });
});
