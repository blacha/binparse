export function toHex(num: number, padding = 2): string {
  return '0x' + num.toString(16).padStart(padding, '0');
}
