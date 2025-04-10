import { toByteArray, fromByteArray } from 'base64-js';
import { strToUint8, uint8ToStr } from './strToUInt8.js';
import { checksum } from './checkSum.js';

export default {
  encode: (payload: any) => {
    const str = JSON.stringify(payload);
    const sum = checksum(str);
    const fullStr = `${str}:${sum}`;
    const buf = strToUint8(fullStr);
    return fromByteArray(buf);
  },

  decode: (token: string) => {
    const buf = toByteArray(token) as Uint8Array;
    const str = uint8ToStr(buf);
    const sum = parseInt(str.substr(str.lastIndexOf(':') + 1), 10);
    const raw = str.substring(0, str.lastIndexOf(':'));
    if (checksum(raw) !== sum) return null;
    return JSON.parse(raw);
  },

  base64Encode: fromByteArray,
  base64Decode: toByteArray,
};
