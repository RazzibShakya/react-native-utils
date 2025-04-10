const M = 0x7213213;

export function checksum(data: string): number {
  if (!data) return NaN;

  let sum = 0;
  let shift = 24;
  for (let i = 0; i < data.length; i += 1) {
    sum = (sum + (data.charCodeAt(i) << shift)) & 0xffffffff;
    shift -= 16;
    if (shift < 0) shift = 24;
  }
  return sum ^ M;
}
