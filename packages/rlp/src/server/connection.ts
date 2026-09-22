import { EventEmitter } from 'node:events';
import type { Socket } from 'node:net';
import { DEFAULT_MAX_QUEUED_BYTES, ErrorCode, PacketType, PROTOCOL_VERSION } from '../constants.js';
import { FrameDecoder } from '../codec/decoder.js';
import { encodePacket } from '../codec/encoder.js';
import { decodePacket } from '../packets/index.js';
import { ConnectionState, SessionStateMachine } from '../session/state-machine.js';
import type { Command, Hello, Packet, Sample } from '../types.js';
import { RlpError } from '../types.js';

export interface AuthenticationResult { accept: boolean; capabilities?: Buffer; context?: unknown; }
export interface ConnectionOptions { authenticate(hello:Hello): Promise<AuthenticationResult> | AuthenticationResult; maxFrameSize?:number; maxQueuedBytes?:number; handshakeTimeoutMs?:number; }
export class RlpConnection extends EventEmitter {
  readonly machine=new SessionStateMachine(); readonly decoder:FrameDecoder; deviceId?:string; context?:unknown; private queued:Buffer[]=[]; private queuedBytes=0; private draining=false; private handshakeTimer?:NodeJS.Timeout;
  constructor(readonly socket:Socket, private readonly options:ConnectionOptions){super();this.decoder=new FrameDecoder(options.maxFrameSize); socket.on('data',x=>this.receive(x));socket.on('drain',()=>this.flush());socket.on('close',()=>this.closed());socket.on('error',()=>{});const ms=options.handshakeTimeoutMs??10_000;if(ms>0)this.handshakeTimer=setTimeout(()=>this.fail(ErrorCode.HANDSHAKE_TIMEOUT,'handshake timeout'),ms);}
  private async receive(chunk:Buffer){try{for(const f of this.decoder.push(chunk))await this.handle(decodePacket(f));}catch(error){this.protocolError(error);}}
  private async handle(packet:Packet){this.machine.accept(packet);if(packet.type===PacketType.HELLO){if(packet.hello.version!==PROTOCOL_VERSION)return this.fail(ErrorCode.UNSUPPORTED_VERSION,'unsupported protocol version');const result=await this.options.authenticate(packet.hello);if(!result.accept)return this.fail(ErrorCode.AUTH_FAILED,'authentication failed');this.machine.authenticated();if(this.handshakeTimer){clearTimeout(this.handshakeTimer);this.handshakeTimer=undefined;}this.deviceId=packet.hello.deviceId;this.context=result.context;this.send({type:PacketType.WELCOME,welcome:{version:PROTOCOL_VERSION,capabilities:result.capabilities??Buffer.alloc(0)}});this.machine.activate();this.emit('authenticated',this);return;}if(packet.type===PacketType.PING){this.send({type:PacketType.PONG,nonce:packet.nonce});return;}if(packet.type===PacketType.DATA)this.emit('data',packet.sample,this);else if(packet.type===PacketType.BATCH)this.emit('batch',packet.samples,this);else if(packet.type===PacketType.ACK)this.emit('ack',packet.ack,this);else if(packet.type===PacketType.DISCONNECT)this.socket.end();else if(packet.type===PacketType.ERROR)this.emit('peerError',packet.error,this);}
  command(command:Command):boolean {if(this.machine.state!==ConnectionState.ACTIVE)return false;return this.send({type:PacketType.COMMAND,command});}
  send(packet:Packet):boolean {if(this.socket.destroyed)return false;const frame=encodePacket(packet);if(this.draining){return this.enqueue(frame);}const accepted=this.socket.write(frame);if(!accepted){this.draining=true;this.emit('backpressure',this);}return true;}
  private enqueue(frame:Buffer):boolean {const limit=this.options.maxQueuedBytes??DEFAULT_MAX_QUEUED_BYTES;if(frame.length+this.queuedBytes>limit){this.emit('slowPeer',this);this.fail(ErrorCode.SLOW_PEER,'slow peer');return false;}this.queued.push(frame);this.queuedBytes+=frame.length;return true;}
  private flush(){this.draining=false;while(this.queued.length){const frame=this.queued.shift()!;this.queuedBytes-=frame.length;if(!this.socket.write(frame)){this.draining=true;break;}}}
  private protocolError(error:unknown){const e=error instanceof RlpError?error:new RlpError(ErrorCode.MALFORMED_FRAME,'malformed frame');this.fail(e.code,e.message);}
  fail(code:ErrorCode,message:string){if(this.socket.destroyed)return;try{this.socket.write(encodePacket({type:PacketType.ERROR,error:{code,message}}));}finally{this.machine.close();this.socket.end();}}
  private closed(){if(this.handshakeTimer)clearTimeout(this.handshakeTimer);this.machine.close();this.emit('close',this);}
}
