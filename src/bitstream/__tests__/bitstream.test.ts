import o from 'ospec';
import { BitStream } from '..';

o.spec('BitStream', () => {
  function toNullString(str: string): Buffer {
    const buf = [];
    for (let i = 0; i < str.length; i++) buf.push(str.charCodeAt(i));
    return Buffer.from(buf);
  }
  o('should read bits from a stream', () => {
    const reader = new BitStream([0b1]);
    o(reader.bit()).equals(1);
    o(reader.offset).equals(1);
    o(reader.maxOffset).equals(8);
    o(reader.bit()).equals(0);
  });

  o('should read little endian', () => {
    o(new BitStream([0xff]).bits(8)).equals(255);
    o(new BitStream([0xff, 0xff]).bits(16)).equals(256 * 256 - 1);
    o(new BitStream([0xff, 0xff, 0xff, 0xff]).bits(32)).equals(256 ** 4 - 1);
  });

  o('should read a boolean', () => {
    const br = new BitStream([0b10]);
    o(br.bool()).equals(false);
    o(br.bool()).equals(true);
  });

  o('should read a string', () => {
    // o(new BitStream(toNullString('Hello')).string()).equals('Hello');
    // o(new BitStream(toNullString('Hello World')).string(2)).equals('He');

    const reader = new BitStream(toNullString('Hello\x00World'));
    o(reader.string()).equals('Hello');
    o(reader.string()).equals('World');
  });
});
