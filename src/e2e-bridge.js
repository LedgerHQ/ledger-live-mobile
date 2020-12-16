// @flow
import invariant from "invariant";
import { Subject } from "rxjs/Subject";

let ws: WebSocket;

export function initE2EBridge() {
  const path = "localhost:8099";
  ws = new WebSocket(`ws://${path}`);
  ws.onopen = () => {
    log(`Connection opened on ${path}`);
  };

  ws.onmessage = onMessage;
}

function onMessage(event: { data: mixed }) {
  invariant(
    typeof event.data === "string",
    "[E2E Bridge Client]: Message data must be string",
  );
  const msg: E2EBridgeMessage = JSON.parse(event.data);
  invariant(msg.type, "[E2E Bridge Client]: type is missing");

  log(`Message\n${JSON.stringify(msg, null, 2)}`);

  switch (msg.type) {
    case "add":
    case "open":
      e2eBridgeSubject.next(msg);
      break;
    case "setGlobals":
      Object.entries(msg.payload).forEach(([k, v]) => {
        global[k] = v;
      });
      break;
    default:
      break;
  }
}

export const e2eBridgeSubject = new Subject<E2EBridgeSubjectMessage>();

type Message<T: string, P: any = {}> = {
  type: T,
  payload: P,
};

type E2EBridgeSubjectMessage =
  | Message<"add", { id: string, name: string }>
  | Message<"open">;

export type E2EBridgeMessage =
  | E2EBridgeSubjectMessage
  | Message<"setGlobals", { [key: string]: any }>;

function log(message: string) {
  // eslint-disable-next-line no-console
  console.log(`[E2E Bridge Client]: ${message}`);
}
