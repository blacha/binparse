import { bp } from '../index.js';

const pkt = Buffer.from('6e6973747261746f725d00ff633947532', 'hex');

for (let i = 0; i < 5_000_000; i++) {
  bp.u8.raw(pkt);
  bp.lu16.raw(pkt);
  bp.lu32.raw(pkt);
  bp.lu64.raw(pkt);
}
