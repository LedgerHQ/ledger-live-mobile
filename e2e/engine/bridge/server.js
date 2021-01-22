// @flow
import { Server } from "ws";
import path from "path";
import fs from "fs";
import type { E2EBridgeMessage } from "./client";
import { $waitFor } from "../utils";

let wss: Server;

export function init(port?: number = 8099) {
  wss = new Server({ port });
  log(`Start listening on localhost:${port}`);

  wss.on("connection", ws => {
    log(`Connection`);
    ws.on("message", onMessage);
  });
}

export function close() {
  wss?.close();
}

export async function loadConfig(
  fileName: string,
  agreed?: true = true,
): Promise<void> {
  if (agreed) {
    acceptTerms();
  }

  const f = fs.readFileSync(path.resolve("e2e", "setups", `${fileName}.json`));
  // $FlowFixMe
  const { data } = JSON.parse(f);

  postMessage({ type: "importAccounts", payload: data.accounts });
  postMessage({ type: "importSettngs", payload: data.settings });

  if (data.accounts.length) {
    // TODO E2E: testID not set inside component yet
    await $waitFor("TODO testID");
    return;
  }
  await $waitFor("PortfolioScreen");
}

export function add(id: string, name: string) {
  postMessage({ type: "add", payload: { id, name } });
}

export function setInstalledApps(apps: string[] = []) {
  postMessage({
    type: "setGlobals",
    payload: { _listInstalledApps_mock_result: apps },
  });
}

export function open() {
  postMessage({ type: "open" });
}

function onMessage(messageStr: string) {
  const msg = JSON.parse(messageStr);
  log(`Message\n${JSON.stringify(msg, null, 2)}`);

  switch (msg.type) {
    default:
      break;
  }
}

function log(message: string) {
  // eslint-disable-next-line no-console
  console.log(`[E2E Bridge Server]: ${message}`);
}

function acceptTerms() {
  postMessage({ type: "acceptTerms" });
}

function postMessage(message: E2EBridgeMessage) {
  for (const ws of wss.clients.values()) {
    ws.send(JSON.stringify(message));
  }
}
