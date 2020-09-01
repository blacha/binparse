import { StrutParserInput } from '../type';

/**
 * Powers of two for 0-63
 * `2 ** offset`
 */
const Power2: number[] = [];
for (let i = 0; i < 64; i++) Power2[i] = Math.pow(2, i);

/** Very basic bit reader */
export class BitStream {
  /** Number of bits through the stream */
  offset: number;
  /** Raw buffer */
  buffer: StrutParserInput;
  /** Max bits that can be read */
  maxOffset: number;
  /** How to read multiple bits at a time */
  isLittleEndian: boolean;

  constructor(buffer: StrutParserInput, offset = 0, maxOffset: number = buffer.length, isLittleEndian = true) {
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

  /**
   * Skip number of bits
   * @param bits number of bits to skip
   */
  skip(bits: number): void {
    this.offset += bits;
  }

  /** Read a single bit */
  bit(): number {
    if (this.remainingBits < 0) throw new Error('BitStream: Overflow ' + this.remainingBits);

    const bytePos = Math.floor(this.offset / 8);
    const bitPos = this.offset % 8;
    const byte = this.buffer[bytePos];
    this.offset++;
    return this.getBitValue(byte, bitPos, 1);
  }

  /** Read a boolean from a bit */
  bool(): boolean {
    return this.bit() === 1;
  }

  /** Read bits */
  bits(length: number): number {
    const initialLen = length;
    let bits = 0;
    while (length > 0) {
      const bit = this.bit();
      if (bit == 1) bits += Power2[initialLen - length];
      length--;
    }
    return bits;
  }

  /**
   * Read a string up to length
   *
   * Will break early if a null character is found
   *
   * @param length max length to read, defaults to entire buffer
   */
  string(length?: number): string {
    const buf = [];
    if (length == null) length = Math.floor(this.remainingBits / 8);
    for (let i = 0; i < length; i++) {
      const chr = this.bits(8);
      if (chr == 0x00) break;
      buf.push(String.fromCharCode(chr));
    }
    return buf.join('');
  }
}
