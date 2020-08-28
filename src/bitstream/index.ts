import { StrutParserInput } from '../type';

/**
 * Powers of two for 0-63
 * `2 ** offset`
 */
const Power2: number[] = [];
for (let i = 0; i < 64; i++) Power2[i] = Math.pow(2, i);

/** Very basic bit reader */
export class BitStream {
  offset: number;
  buffer: StrutParserInput;
  maxOffset: number;
  isLittleEndian: boolean;

  constructor(buffer: StrutParserInput, offset: number, maxOffset: number, isLittleEndian = true) {
    this.buffer = buffer;
    this.offset = offset * 8;
    this.maxOffset = maxOffset * 8;
    this.isLittleEndian = isLittleEndian;
    if (!this.isLittleEndian) throw new Error('BigEndian is not supported');
  }

  /** Number of bits left in this stream */
  get remainingBits(): number {
    return this.maxOffset - this.offset;
  }

  getBitValue(byte: number, offset: number, length: number): number {
    return (byte & (((1 << (offset + length)) - 1) & ~((1 << offset) - 1))) >> offset;
  }

  bit(): number {
    const bytePos = Math.floor(this.offset / 8);
    const bitPos = this.offset % 8;
    const byte = this.buffer[bytePos];
    if (this.remainingBits < 0) throw new Error('BitStream: Overflow ' + this.remainingBits);
    this.offset++;
    return this.getBitValue(byte, bitPos, 1);
  }

  /** Read bits little endian */
  bits(length: number): number {
    const initialLen = length;
    let bits = 0;
    while (length > 0) {
      bits += (this.bit() ? 1 : 0) * Power2[initialLen - length];
      length -= 1;
    }
    return bits;
  }
}
