/**
 * Simple mechanism to convert the javascript string to a
 * Uint8 array (byte array) for transmission over UDP or
 * other channels.
 *
 * The algorithm uses the following mechanisms
 * 1. USE MSB sequence to determine size
 *      a. If the MSB of a byte is not set then use the next 7
 *         bits to represent the code point
 *      b. If the next to MSB is not set, then use the next 14
 *         bits to represent the code point
 *      c. If the 3rd to MSB is not set, then use the next 21
 *         bits to represent the code point
 *      d. This makes all UNICODE text representable within 3
 *         bytes
 * 2. XOR the code points one after another, which results in
 *    a values which is generally smaller than 128 becuase in
 *    common usage we tend to use the same characters from same
 *    language in sequence.
 */
const seed = 0x55;

export function uint8ToStr(buf: Uint8Array): string;
export function uint8ToStr(buf: Buffer, offset?: number, length?: number): string;
export function uint8ToStr(buf: Uint8Array | Buffer, offset?: number, length?: number): string {
  let res = '';
  let i = offset || 0;
  let prev = seed;
  const totalLength = i + (length ?? buf.length);
  while (i < totalLength) {
    let value = buf[i++];
    // If the first bit is not set
    if ((value & 0x80) === 0) {
    } else if ((value & 0x40) === 0) {
      value = ((value & 0x3f) << 8) | buf[i++];
    } else {
      value = ((value & 0x1f) << 16) | (buf[i++] << 8) | buf[i++];
    }
    prev = value ^ prev;
    res += String.fromCodePoint(prev);
  }

  return res;
}

export function strToUint8(str: string): Uint8Array;
export function strToUint8(str: string, buffer: Buffer, offset?: number): number
export function strToUint8(str: string, buffer?: Buffer, offset: number = 0): number | Uint8Array {
  if (str === undefined || str === null) str = '';

  const values: Buffer | number[] = buffer || [];
  let idx = offset;
  let prev = seed;

  // Perform an early check to see if the string would fit into the buffer
  if (buffer && (str.length + offset) > buffer.length) throw new Error('Out of bounds');

  for (let i = 0; i < str.length; i += 1) {
    const code = str.codePointAt(i) as number;
    const value = prev ^ code;
    if (value < 0x80) { // 7 bit values as it is
      values[idx++] = value;
    } else if (value < 0x4000) { // 14 bit values
      values[idx++] = (0x80 | (value >> 8));
      values[idx++] = (0xff & value);
    } else if (value < 0x200000) { // 21 bit values
      values[idx++] = (0xc0 | (value >> 16));
      values[idx++] = (0xff & (value >> 8));
      values[idx++] = (0xff & value);
    }
    prev = code;

    if (code > 65535) {
      // If i-th 16-bit code unit is in high-surrogates,
      // skip the folllowing 16-bit (low-surrogate).
      i++;
    }
  }

  if (buffer) {
    // Make sure the string actually fit into the buffer
    if (idx > buffer.length) throw new Error('Out of bounds')
    return idx - offset;
  }

  return new Uint8Array(values);
}
