// @flow
import invariant from "invariant";

let ws: WebSocket;

export function initE2EBridge() {
  const path = "localhost:8099";
  ws = new WebSocket(`ws://${path}`);
  ws.onopen = () => {
    log(`Start listening on ${path}`);
  };

  ws.onmessage = onMessage;
}

function onMessage(event: { data: mixed }) {
  const msg = JSON.parse(event.data);
  invariant(msg.type, "[E2E Bridge Client]: type is missing");

  log(`New Message\n${JSON.stringify(msg, null, 2)}`);

  switch (msg.type) {
    case "handshake":
      postMessage({ type: "handshake" });
      break;
    default:
      break;
  }
}

type Message = HandshakeMessage;

type HandshakeMessage = {
  type: "handshake",
};

function postMessage(msg: Message) {
  ws.send(JSON.stringify(msg));
}

function log(message: string) {
  // eslint-disable-next-line no-console
  console.log(`[E2E Bridge Client]: ${message}`);
}
