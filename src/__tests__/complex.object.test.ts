import o from 'ospec';
import { bp } from '../index.js';

o.spec('ComplexStruts', () => {
  o('should parse multiple strings', () => {
    const pkt = Buffer.from(
      '260400020000000001005b61646d696e6973747261746f725d00ff6339475323383a205379646e65792c4155532e20737570706f7274656420627920414345204775696c642020ff633400',
      'hex',
    );

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

    o(res.packetId).equals(38);
    o(res.chatKind).equals(4);
    o(res.name).equals('[administrator]');
  });
});
