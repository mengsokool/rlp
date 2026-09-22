import { EventEmitter } from 'node:events';
import { createServer, type Server } from 'node:net';
import type { AddressInfo } from 'node:net';
import type { Command, Hello, Sample } from '../types.js';
import { RlpConnection, type AuthenticationResult, type ConnectionOptions } from './connection.js';
export interface RlpServerOptions extends ConnectionOptions { port?:number; host?:string; }
export class RlpServer extends EventEmitter { private readonly tcp:Server; private readonly devices=new Map<string,RlpConnection>(); private commandId=0;
  constructor(private readonly options:RlpServerOptions){super();this.tcp=createServer(socket=>this.attach(socket));this.tcp.on('error',e=>this.emit('serverError',e));}
  async listen():Promise<AddressInfo>{await new Promise<void>((ok,no)=>this.tcp.listen(this.options.port??9000,this.options.host,ok).once('error',no));return this.tcp.address() as AddressInfo;}
  async close():Promise<void>{for(const c of this.devices.values())c.socket.destroy();await new Promise<void>((ok,no)=>this.tcp.close(e=>e?no(e):ok()));}
  get address(){return this.tcp.address() as AddressInfo|null;} get size(){return this.devices.size;}
  command(deviceId:string, sample:Omit<Command,'id'>):boolean {const c=this.devices.get(deviceId);if(!c)return false;this.commandId=(this.commandId+1)>>>0;const command={id:this.commandId,...sample};const accepted=c.command(command);if(accepted)this.emit('command:sent',{deviceId,command,at:process.hrtime.bigint()});return accepted;}
  private attach(socket:import('node:net').Socket){const c=new RlpConnection(socket,this.options);c.on('authenticated',(x:RlpConnection)=>{const prior=this.devices.get(x.deviceId!);if(prior&&prior!==x)prior.socket.destroy();this.devices.set(x.deviceId!,x);this.emit('device:connect',x);});c.on('data',(s:Sample,x:RlpConnection)=>this.emit('data',{deviceId:x.deviceId!,sample:s,connection:x}));c.on('batch',(samples:Sample[],x:RlpConnection)=>this.emit('batch',{deviceId:x.deviceId!,samples,connection:x}));c.on('ack',(ack,x:RlpConnection)=>this.emit('ack',{deviceId:x.deviceId!,ack,connection:x}));c.on('backpressure',(x:RlpConnection)=>this.emit('backpressure',x));c.on('slowPeer',(x:RlpConnection)=>this.emit('slowPeer',x));c.on('close',(x:RlpConnection)=>{if(x.deviceId&&this.devices.get(x.deviceId)===x)this.devices.delete(x.deviceId);if(x.deviceId)this.emit('device:disconnect',x);});}
}
export function createRlpServer(options:RlpServerOptions):RlpServer{return new RlpServer(options);}
