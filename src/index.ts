import { StrutBase } from './base';
import { StrutTypeBits, StrutTypeFlags } from './bits';
import { blu64, lu16, lu32, lu64, u8 } from './int';
import { StrutTypeEnum, StrutTypeLookup } from './lookup';
import { StrutTypeArray, StrutTypeArrayOffset, StrutTypeBytes, StrutTypeObject, StrutTypeSkip } from './object';
import { StrutTypeOffset } from './offset';
import { StrutTypeStringFixed, StrutTypeStringNull } from './string';
import { StrutAny, StrutType } from './type';
import { StrutTypeVariable } from './var';

/**
 * Read an fixed number of objects
 * @param name Name of the parser
 * @param type Type to read in
 * @param count number of objects to read in
 */
function array<T>(name: string, type: StrutType<T>, count: number): StrutTypeArray<T>;
/**
 * Read an array of objects, using a previously read in `offset` as the length for the array
 * @param name Name of the parser
 * @param varName Variable name to lookup length from
 * @param type Type to read in
 * @param isMaxLength Is the offset length the end of the packet
 */
function array<T>(name: string, type: StrutType<T>, varName: string, isMaxLength?: boolean): StrutTypeArrayOffset<T>;
function array<T>(name: string, type: StrutType<T>, count: string | number, isMaxLength?: boolean): StrutType<T[]> {
  if (typeof count === 'number') return new StrutTypeArray<T>(name, type, count);
  return new StrutTypeArrayOffset(name, type, count, isMaxLength ?? false);
}

export const bp = {
  /** Unsigned int 8  (1 byte) */
  u8,
  /** Unsigned LE int 16 (2 bytes) */
  lu16,
  /** Unsigned LE int 32 (4 bytes) */
  lu32,

  /**
   * Unsigned LE int 64 (8 bytes)
   *
   * **Warning** this can and will loose precision if the number is > `Number.MAX_SAFE_INTEGER`
   *
   * When using 64 bit for offsets all memory offsets can fit into a float without loosing precision,
   * as `Number.MAX_SAFE_INTEGER` is approx 9000TB in bytes
   *
   * @see bp.blu64 for BigInt variant
   */
  lu64,
  /** BigInt Unsigned LE 64 (8 bytes) */
  blu64,
  /** Empty object with nothing to parse (0 Bytes) */
  empty: new StrutTypeObject('Empty', {}),

  /** Read a value from a offset */
  offset<T>(offset: StrutType<number>, type: StrutType<T>): StrutTypeOffset<T> {
    return new StrutTypeOffset(offset, type);
  },

  /** Variable to read into parser context, used for arrays of variable length */
  variable(name: string, type: StrutType<number> = u8): StrutTypeVariable {
    return new StrutTypeVariable(name, type);
  },
  /**
   * Read a string
   * @param length max number of bytes to read if defined, otherwise read util finding a null or end of buffer
   */
  string(length?: number): StrutBase<string> {
    if (length == null) return new StrutTypeStringNull();
    return new StrutTypeStringFixed(length);
  },
  /** User a bit parser to extract raw bits from the buffer */
  bits<T extends Record<string, number>>(name: string, obj: T): StrutTypeBits<T> {
    return new StrutTypeBits(name, obj);
  },
  flags<T extends Record<string, number>>(name: string, type: StrutType<number>, flags: T): StrutTypeFlags<T> {
    return new StrutTypeFlags(name, type, flags);
  },
  object<T extends Record<string, StrutAny>>(name: string, obj: T): StrutTypeObject<T> {
    return new StrutTypeObject(name, obj);
  },
  /** Convert a number lookup into a human friendly output */
  lookup<T>(name: string, type: StrutType<number>, lookup: (id: number) => keyof T | undefined): StrutTypeLookup<T> {
    return new StrutTypeLookup(name, type, lookup);
  },

  /** Reverse lookup from a enumeration */
  enum<T extends Record<string, string | number>>(name: string, type: StrutType<number>, e: T): StrutTypeEnum<T> {
    return new StrutTypeEnum<T>(name, type, e);
  },
  /**
   * Read a byte array
   *
   * @param count number of bytes to read
   */
  bytes(count: number): StrutTypeBytes {
    return new StrutTypeBytes(count);
  },
  /** Skip count number of bytes */
  skip(count: number): StrutType<undefined> {
    return new StrutTypeSkip(count);
  },
  array,
};

export { StrutBase } from './base';
export { BitStream } from './bitstream';
export { toHex } from './hex';
export { StrutAny, StrutEval, StrutInfer, StrutParserContext, StrutType } from './type';
export { StrutTypeObject } from './object';
