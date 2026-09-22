import test from 'node:test';
import assert from 'node:assert/strict';
import { connect } from 'node:net';
import {
  AckStatus,
  createRlpServer,
  FrameDecoder,
  PacketType,
  PROTOCOL_VERSION,
  ValueType,
  decodePacket,
  encodeBatch,
  encodeData,
  encodeHello,
  encodePacket,
  type Packet,
} from '../index.js';

test('real TCP lifecycle including fragmentation, batch, heartbeat, command and ACK', async () => {
  const server = createRlpServer({
    port: 0,
    host: '127.0.0.1',
    authenticate: (h) => ({ accept: h.credential.equals(Buffer.from('ok')) }),
  });
  const addr = await server.listen();

  const client = connect(addr.port, '127.0.0.1');
  client.on('error', () => {});

  const d = new FrameDecoder();
  const packets: Packet[] = [];
  client.on('data', (x) => packets.push(...d.push(x).map(decodePacket)));

  await new Promise<void>((ok) => client.once('connect', ok));

  const hello = encodeHello({
    version: PROTOCOL_VERSION,
    deviceId: 'device-a',
    credential: Buffer.from('ok'),
    capabilities: Buffer.alloc(0),
  });
  for (const b of hello) client.write(Buffer.from([b]));
  await new Promise((r) => setTimeout(r, 50));
  assert.equal(packets[0].type, PacketType.WELCOME);

  let received = false;
  let batchCount = 0;
  server.once('data', () => (received = true));
  server.once('batch', (e) => (batchCount = e.samples.length));

  client.write(encodeData({ channel: 8, valueType: ValueType.BOOL, value: true }));
  client.write(
    encodeBatch([
      { channel: 1, valueType: ValueType.UINT8, value: 1 },
      { channel: 2, valueType: ValueType.UINT8, value: 2 },
    ])
  );
  client.write(encodePacket({ type: PacketType.PING, nonce: 123 }));
  await new Promise((r) => setTimeout(r, 50));

  assert.equal(received, true);
  assert.equal(batchCount, 2);
  assert.ok(packets.some((p) => p.type === PacketType.PONG));

  assert.equal(
    server.command('device-a', { channel: 9, valueType: ValueType.UINT16, value: 7 }),
    true
  );
  await new Promise((r) => setTimeout(r, 50));

  const command = packets.find(
    (p): p is Extract<Packet, { type: PacketType.COMMAND }> => p.type === PacketType.COMMAND
  );
  assert.ok(command);

  client.write(
    encodePacket({ type: PacketType.ACK, ack: { id: command.command.id, status: AckStatus.OK } })
  );

  await new Promise((r) => setTimeout(r, 50));
  client.destroy();
  await server.close();
});
