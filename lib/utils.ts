/**
 * Calculate the CRC checksum of a packet.
 * The CRC algorithm is based on the following settings using the polycrc port to JavaScript:
 *
 * import { crc } from 'polycrc'
 * const x25crc = crc(16, 0x1021, 0, 0xffff, false)
 */
 export function x25crc(buffer: Buffer, start = 0, trim = 0, magic: number|null = null) {
  let crc = 0xffff;

  const digest = byte => {
    let tmp = (byte & 0xff) ^ (crc & 0xff);
    tmp ^= tmp << 4;
    tmp &= 0xff;
    crc = (crc >> 8) ^ (tmp << 8) ^ (tmp << 3) ^ (tmp >> 4);
    crc &= 0xffff;
  }

  for (let i = start; i < buffer.length - trim; i++) {
    digest(buffer[i])
  }

  if (magic !== null) {
    digest(magic)
  }

  return crc;
}
