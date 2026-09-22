import type { AckStatus, ErrorCode, PacketType, ValueType } from './constants.js';

export type RlpValue = boolean | number | bigint | string | Buffer;
export interface Frame { type: PacketType; flags: number; payload: Buffer; }
export interface Hello { version: number; deviceId: string; credential: Buffer; capabilities: Buffer; }
export interface Welcome { version: number; capabilities: Buffer; }
export interface Sample { channel: number; valueType: ValueType; value: RlpValue; timestamp?: bigint; }
export interface Command extends Sample { id: number; }
export interface Ack { id: number; status: AckStatus; }
export interface ProtocolError { code: ErrorCode; message: string; }
export type Packet = { type: PacketType.HELLO; hello: Hello } | { type: PacketType.WELCOME; welcome: Welcome } | { type: PacketType.DATA; sample: Sample } | { type: PacketType.BATCH; samples: Sample[] } | { type: PacketType.COMMAND; command: Command } | { type: PacketType.ACK; ack: Ack } | { type: PacketType.PING | PacketType.PONG; nonce: number } | { type: PacketType.ERROR; error: ProtocolError } | { type: PacketType.DISCONNECT; code: ErrorCode };

export class RlpError extends Error { constructor(public readonly code: ErrorCode, message: string) { super(message); this.name = 'RlpError'; } }
