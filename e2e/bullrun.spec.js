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

  it("should pair a new device", async () => {
    await element(by.id("TermsAcceptSwitch"))?.tap();
    await element(by.id("TermsConfirm"))?.tap();
    await element(by.id("TabBarManager")).tap();
    await element(by.id("ReadOnlyOnboarding")).tap();
    await element(by.id("OnboardingGetStartedChoiceInitialized")).tap();
    await element(by.id("OnboardingPinYes")).tap();
    await element(by.id("OnboardingRecoveryYes")).tap();
    await element(by.id("OnboardingSecurityContinue")).tap();
    await element(by.id("PairDevice")).tap();
    postMessage({
      type: "add",
      payload: { id: "mock_1", name: "Nano X de David" },
    });
    await wait(1000);
    postMessage({
      type: "add",
      payload: { id: "mock_2", name: "Nano X de Arnaud" },
    });
    await wait(1000);
    postMessage({
      type: "add",
      payload: { id: "mock_3", name: "Nano X de Didier Duchmol" },
    });
    // await element(by.id("TabBarAccounts")).tap();
    // await element(by.id("OpenAddAccountModal")).tap();
  });
});

function wait(ms: number): Promise<void> {
  return new Promise(res => {
    setTimeout(res, ms);
  });
}

function initE2EBridge(): Promise<void> {
  const port = 8099;
  wss = new Server({ port });
  log(`Start listening on localhost:${port}`);

  wss.on("connection", ws => {
    log(`Connection`);
    ws.on("message", onMessage);
  });
}

let wss: Server;

function postMessage(message: Message) {
  for (const ws of wss.clients.values()) {
    ws.send(JSON.stringify(message));
  }
}

type Message = MessageHandshake | MessageAddDevice;

type MessageHandshake = {
  type: "handshake",
};

type MessageAddDevice = {
  type: "add",
  payload: { id: string, name: string },
};

function onMessage(messageStr: string) {
  const msg = JSON.parse(messageStr);
  log(`Message\n${JSON.stringify(msg, null, 2)}`);

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
