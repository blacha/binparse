import o from 'ospec';
import { bp } from '../index';

o.spec('StrutTypeFlags', () => {
  o('should parse flags', () => {
    const flags = bp.flags('RGB', bp.u8, { r: 0x01, g: 0x02, b: 0x04 });
    const output = flags.raw([0b101]);
    o(output).deepEquals({ r: true, b: true });
  });
});
