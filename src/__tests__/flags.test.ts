import o from 'ospec';
import { bp } from '../index.js';

o.spec('StrutTypeFlags', () => {
  o('should parse flags', () => {
    const flags = bp.flags('RGB', bp.u8, { r: 0x01, g: 0x02, b: 0x04 });
    const output = flags.raw([0b101]);
    o(output).deepEquals({ r: true, b: true });
  });

  o('should calculate size', () => {
    o(bp.flags('RGB', bp.u8, { r: 0x01 }).size).equals(1);
    o(bp.flags('RGB', bp.lu16, { r: 0x01 }).size).equals(2);
    o(bp.flags('RGB', bp.lu32, { r: 0x01 }).size).equals(4);
  });
});
