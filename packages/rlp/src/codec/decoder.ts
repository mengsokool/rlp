import { DEFAULT_MAX_FRAME_SIZE, ErrorCode, FRAME_HEADER_BYTES, PacketType } from '../constants.js';
import type { Frame } from '../types.js';
import { RlpError } from '../types.js';

/** Incremental decoder retains incoming buffers; it only copies a payload when it spans chunks. */
export class FrameDecoder {
  private chunks: Buffer[]=[]; private offset=0; private available=0;
  constructor(private readonly maxFrameSize=DEFAULT_MAX_FRAME_SIZE) {}
  push(chunk: Buffer): Frame[] { if (!Buffer.isBuffer(chunk)) throw new TypeError('chunk must be Buffer'); if(chunk.length){this.chunks.push(chunk);this.available+=chunk.length;} const frames:Frame[]=[]; while(this.available>=4){ const h=this.peek(4); const type=h[0] as PacketType, flags=h[1], length=h.readUInt16BE(2); if(length>this.maxFrameSize) throw new RlpError(ErrorCode.FRAME_TOO_LARGE,`frame ${length} exceeds limit ${this.maxFrameSize}`); if(this.available<4+length) break; this.consume(4); frames.push({type,flags,payload:this.read(length)}); } return frames; }
  get bufferedBytes():number{return this.available;}
  private peek(n:number):Buffer { const first=this.chunks[0]; if(first.length-this.offset>=n)return first.subarray(this.offset,this.offset+n); const b=Buffer.allocUnsafe(n);let pos=0,i=0,o=this.offset;while(pos<n){const c=this.chunks[i++];const take=Math.min(n-pos,c.length-o);c.copy(b,pos,o,o+take);pos+=take;o=0;}return b; }
  private consume(n:number):void { while(n){const c=this.chunks[0], take=Math.min(n,c.length-this.offset);this.offset+=take;this.available-=take;n-=take;if(this.offset===c.length){this.chunks.shift();this.offset=0;}} }
  private read(n:number):Buffer { if(n===0)return Buffer.alloc(0); const c=this.chunks[0];if(c.length-this.offset>=n){const out=c.subarray(this.offset,this.offset+n);this.consume(n);return out;}const out=Buffer.allocUnsafe(n);let pos=0;while(pos<n){const c2=this.chunks[0],take=Math.min(n-pos,c2.length-this.offset);c2.copy(out,pos,this.offset,this.offset+take);pos+=take;this.consume(take);}return out; }
}
