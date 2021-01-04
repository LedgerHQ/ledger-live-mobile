// @flow
import invariant from "invariant";
import { Subject } from "rxjs/Subject";
import type { AccountRaw } from "@ledgerhq/live-common/lib/types";
import { store } from "./context/LedgerStore";
import { importSettings } from "./actions/settings";
import { setAccounts } from "./actions/accounts";
import { acceptTerms } from "./logic/terms";
import accountModel from "./logic/accountModel";

let ws: WebSocket;

export function initE2EBridge() {
  const path = "localhost:8099";
  ws = new WebSocket(`ws://${path}`);
  ws.onopen = () => {
    log(`Connection opened on ${path}`);
  };

  ws.onmessage = onMessage;
}

async function onMessage(event: { data: mixed }) {
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
    case "acceptTerms":
      acceptTerms();
      break;
    case "importAccounts": {
      store.dispatch(setAccounts(msg.payload.map(accountModel.decode)));
      break;
    }
    case "importSettngs": {
      store.dispatch(importSettings(msg.payload));
      break;
    }
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
  | Message<"setGlobals", { [key: string]: any }>
  | Message<"importAccounts", { data: AccountRaw, version: number }[]>
  | Message<"importSettngs", { [key: string]: any }>
  | Message<"acceptTerms">;

function log(message: string) {
  // eslint-disable-next-line no-console
  console.log(`[E2E Bridge Client]: ${message}`);
}
