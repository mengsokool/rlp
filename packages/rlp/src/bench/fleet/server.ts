import { monitorEventLoopDelay, performance } from 'node:perf_hooks';
import { createRlpServer, ValueType } from '../../index.js';

const port=Number(process.env.RLP_FLEET_PORT??0), commandRate=Number(process.env.RLP_FLEET_COMMAND_RATE??0), maxQueuedBytes=Number(process.env.RLP_FLEET_MAX_QUEUE??262144);
const devices=new Set<string>(); let received=0,batches=0,bytes=0,connects=0,disconnects=0,acks=0,commandSent=0,backpressure=0,slowPeers=0;
const pending=new Map<number,bigint>(), latencies:number[]=[]; const delay=monitorEventLoopDelay({resolution:1});delay.enable();const started=performance.now();let previousCpu=process.cpuUsage();
const server=createRlpServer({port,maxQueuedBytes,authenticate:()=>({accept:true})});
server.on('device:connect',c=>{devices.add(c.deviceId!);connects++;});server.on('device:disconnect',c=>{devices.delete(c.deviceId!);disconnects++;});
server.on('data',e=>{received++;bytes+=estimate(e.sample.value);});server.on('batch',e=>{batches++;received+=e.samples.length;for(const s of e.samples)bytes+=estimate(s.value);});
server.on('command:sent',(e:{command:{id:number};at:bigint})=>pending.set(e.command.id,e.at));server.on('ack',e=>{acks++;const sent=pending.get(e.ack.id);if(sent!==undefined){latencies.push(Number(process.hrtime.bigint()-sent)/1e6);pending.delete(e.ack.id);}});
server.on('backpressure',()=>backpressure++);server.on('slowPeer',()=>slowPeers++);
function estimate(v:unknown){return Buffer.isBuffer(v)?v.length:typeof v==='string'?Buffer.byteLength(v):8;}
await server.listen();process.send?.({kind:'ready',port:server.address!.port});
let cmdTimer:NodeJS.Timeout|undefined;if(commandRate>0)cmdTimer=setInterval(()=>{if(!devices.size)return;const ids=Array.from(devices);const id=ids[Math.floor(Math.random()*ids.length)];if(server.command(id,{channel:80,valueType:ValueType.BOOL,value:true}))commandSent++;},Math.max(1,Math.floor(1000/commandRate)));
function percentile(p:number){if(!latencies.length)return null;const copy=[...latencies].sort((a,b)=>a-b);return copy[Math.min(copy.length-1,Math.ceil(copy.length*p)-1)];}setInterval(()=>{const cpu=process.cpuUsage(previousCpu);previousCpu=process.cpuUsage();process.send?.({kind:'metrics',metrics:{atMs:+(performance.now()-started).toFixed(1),active:server.size,connects,disconnects,received,batches,bytes,acks,commandSent,backpressure,slowPeers,pendingCommands:pending.size,ackLatencyMs:{p50:percentile(.5),p95:percentile(.95),p99:percentile(.99)},rss:process.memoryUsage().rss,heapUsed:process.memoryUsage().heapUsed,heapTotal:process.memoryUsage().heapTotal,cpuUserUs:cpu.user,cpuSystemUs:cpu.system,eventLoopMs:{p50:delay.percentile(50)/1e6,p95:delay.percentile(95)/1e6,p99:delay.percentile(99)/1e6,mean:delay.mean/1e6}}});delay.reset();},1000).unref();
process.on('message',async message=>{if(message==='stop'){if(cmdTimer)clearInterval(cmdTimer);await server.close();process.send?.({kind:'stopped'});process.exit(0);}});
