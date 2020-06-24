import { Server } from "ws";

describe("Ledger Live Mobile", () => {
  beforeAll(() => {
    initE2EBridge();
  });

  afterAll(() => {
    wss.close();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("should have welcome screen", async () => {
    await element(by.id("TermsAcceptSwitch"))?.tap();
    await element(by.id("TermsConfirm"))?.tap();
  });
});

function initE2EBridge(): Promise<void> {
  const port = 8099;
  wss = new Server({ port });
  log(`Start listening on localhost:${port}`);

  wss.on("connection", ws => {
    log(`New connection`);
    ws.on("message", onMessage);
  });
}

let wss: Server;

function postMessage(message: Message) {
  for (const ws of wss.clients.values()) {
    ws.send(JSON.stringify(message));
  }
}

type Message = HandshakeMessage;

type HandshakeMessage = {
  type: "handshake",
};

function onMessage(messageStr: string) {
  const msg = JSON.parse(messageStr);
  log(`New Message\n${JSON.stringify(msg, null, 2)}`);

  switch (msg.type) {
    case "handshake":
      break;
    default:
      break;
  }
}

function log(message: string) {
  // eslint-disable-next-line no-console
  console.log(`[E2E Bridge Server]: ${message}`);
}
