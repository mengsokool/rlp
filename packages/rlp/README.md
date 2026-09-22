# @raina-iot/rlp

Raina Link Protocol (RLP) is a small binary protocol for direct, persistent TCP/TLS connections between IoT devices and an application server. It has no broker, topics, or pub/sub layer.

RLP is deliberately narrower than MQTT: it is for a device that authenticates once and exchanges numeric-channel telemetry and commands with the server that owns its connection.

## Install and use

```ts
import { createRlpServer } from '@raina-iot/rlp';
const server = createRlpServer({ port: 9000, authenticate: hello => ({ accept: checkToken(hello) }) });
server.on('data', event => console.log(event.deviceId, event.sample));
await server.listen();
await server.command('sensor-7', { channel: 4, valueType: ValueType.BOOL, value: true });
```

Codec functions (`encodeFrame`, `encodePacket`, `FrameDecoder`, `decodePacket`) are standalone and usable by test tools and alternate transports. See [the v1 specification](../../docs/rlp-spec-v1.md).

Security: use TLS where required, authenticate every HELLO, select conservative frame/queue limits, and provide an application-level idle policy. RLP is v1 / pre-1.0 and its wire format should be treated as stable only after a 1.0 release.

## Measured capacity (development environment)

On a macOS arm64 machine (8 logical CPUs, 16 GiB RAM) with Node v24.18.0 and plain TCP localhost, RLP was validated with **10,000 concurrent authenticated devices** for **10 minutes**. Each sent one FLOAT32 DATA frame every five seconds using normal jitter; the server observed approximately **1,995 DATA frames/s**, zero unexpected disconnects, zero protocol/client errors, zero backpressure events, server event-loop p99 of **1.99 ms**, and final RSS of **90.8 MiB**. This is a measured lower bound for that machine/topology, not a production capacity or maximum. At 25,000 requested devices, localhost generator networking exhausted ports/timeouts before server saturation was observed. See `docs/rlp-load-test-results.md` in the source repository.
