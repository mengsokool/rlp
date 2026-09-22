import { FRAME_HEADER_BYTES, FrameFlag, PacketType, ValueType } from '../constants.js';
import type { Ack, Command, Frame, Hello, Packet, RlpValue, Sample, Welcome } from '../types.js';

function u16(n: number): Buffer { const b = Buffer.allocUnsafe(2); b.writeUInt16BE(n); return b; }
function lp8(text: string): Buffer { const b = Buffer.from(text, 'utf8'); if (b.length > 255) throw new RangeError('string exceeds uint8 length'); return Buffer.concat([Buffer.from([b.length]), b]); }
function lp16(data: Buffer): Buffer { if (data.length > 65535) throw new RangeError('bytes exceed uint16 length'); return Buffer.concat([u16(data.length), data]); }
export function encodeFrame(frame: Frame): Buffer { if (frame.payload.length > 65535) throw new RangeError('frame payload exceeds uint16'); const out = Buffer.allocUnsafe(FRAME_HEADER_BYTES + frame.payload.length); out[0] = frame.type; out[1] = frame.flags; out.writeUInt16BE(frame.payload.length, 2); frame.payload.copy(out, 4); return out; }
export function encodeValue(type: ValueType, value: RlpValue): Buffer {
  switch (type) {
    case ValueType.BOOL: if (typeof value !== 'boolean') break; return Buffer.from([value ? 1 : 0]);
    case ValueType.INT8: { const b=Buffer.allocUnsafe(1); b.writeInt8(Number(value)); return b; } case ValueType.UINT8: { const b=Buffer.allocUnsafe(1); b.writeUInt8(Number(value)); return b; }
    case ValueType.INT16: { const b=Buffer.allocUnsafe(2); b.writeInt16BE(Number(value)); return b; } case ValueType.UINT16: { const b=Buffer.allocUnsafe(2); b.writeUInt16BE(Number(value)); return b; }
    case ValueType.INT32: { const b=Buffer.allocUnsafe(4); b.writeInt32BE(Number(value)); return b; } case ValueType.UINT32: { const b=Buffer.allocUnsafe(4); b.writeUInt32BE(Number(value)); return b; }
    case ValueType.INT64: { if (typeof value !== 'number' && typeof value !== 'bigint') break; const b=Buffer.allocUnsafe(8); b.writeBigInt64BE(BigInt(value)); return b; } case ValueType.UINT64: { if (typeof value !== 'number' && typeof value !== 'bigint') break; const b=Buffer.allocUnsafe(8); b.writeBigUInt64BE(BigInt(value)); return b; }
    case ValueType.FLOAT32: { const b=Buffer.allocUnsafe(4); b.writeFloatBE(Number(value)); return b; } case ValueType.FLOAT64: { const b=Buffer.allocUnsafe(8); b.writeDoubleBE(Number(value)); return b; }
    case ValueType.STRING: if (typeof value === 'string') return lp16(Buffer.from(value, 'utf8')); break;
    case ValueType.BYTES: if (Buffer.isBuffer(value)) return lp16(value); break;
  } throw new TypeError('value does not match ValueType');
}
function sample(sample: Sample, timestampAllowed = true): { flags: number; body: Buffer } { const has = timestampAllowed && sample.timestamp !== undefined; const head=Buffer.allocUnsafe(3 + (has ? 8 : 0)); head.writeUInt16BE(sample.channel, 0); head[2]=sample.valueType; if (has) head.writeBigInt64BE(sample.timestamp!,3); return { flags: has ? FrameFlag.HAS_TIMESTAMP : 0, body: Buffer.concat([head, encodeValue(sample.valueType, sample.value)]) }; }
export function encodeHello(x: Hello): Buffer { return encodeFrame({ type: PacketType.HELLO, flags: 0, payload: Buffer.concat([Buffer.from([x.version]), lp8(x.deviceId), lp16(x.credential), lp16(x.capabilities)]) }); }
export function encodeWelcome(x: Welcome): Buffer { return encodeFrame({ type: PacketType.WELCOME, flags: 0, payload: Buffer.concat([Buffer.from([x.version]), lp16(x.capabilities)]) }); }
export function encodeData(x: Sample): Buffer { const s=sample(x); return encodeFrame({type:PacketType.DATA,flags:s.flags,payload:s.body}); }
export function encodeBatch(xs: Sample[]): Buffer { if (xs.length > 65535) throw new RangeError('too many batch samples'); const records=xs.map(x => { const s=sample(x); return Buffer.concat([Buffer.from([s.flags]),s.body]); }); return encodeFrame({type:PacketType.BATCH,flags:0,payload:Buffer.concat([u16(xs.length),...records])}); }
export function encodeCommand(x: Command): Buffer { const s=sample(x, false); const id=Buffer.allocUnsafe(4); id.writeUInt32BE(x.id); return encodeFrame({type:PacketType.COMMAND,flags:0,payload:Buffer.concat([id,s.body])}); }
export function encodeAck(x: Ack): Buffer { const b=Buffer.allocUnsafe(5); b.writeUInt32BE(x.id); b[4]=x.status; return encodeFrame({type:PacketType.ACK,flags:0,payload:b}); }
export function encodePacket(p: Packet): Buffer { switch(p.type) { case PacketType.HELLO:return encodeHello(p.hello); case PacketType.WELCOME:return encodeWelcome(p.welcome); case PacketType.DATA:return encodeData(p.sample); case PacketType.BATCH:return encodeBatch(p.samples); case PacketType.COMMAND:return encodeCommand(p.command); case PacketType.ACK:return encodeAck(p.ack); case PacketType.PING: case PacketType.PONG: { const b=Buffer.allocUnsafe(4); b.writeUInt32BE(p.nonce); return encodeFrame({type:p.type,flags:0,payload:b}); } case PacketType.ERROR: { const m=Buffer.from(p.error.message,'utf8'); if(m.length>255) throw new RangeError('error text too long'); const b=Buffer.allocUnsafe(3+m.length); b.writeUInt16BE(p.error.code); b[2]=m.length;m.copy(b,3);return encodeFrame({type:p.type,flags:0,payload:b}); } case PacketType.DISCONNECT: { const b=Buffer.allocUnsafe(2);b.writeUInt16BE(p.code);return encodeFrame({type:p.type,flags:0,payload:b}); } } }
