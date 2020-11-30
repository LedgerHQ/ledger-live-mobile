import { Server } from "ws";
import { delay } from "@ledgerhq/live-common/lib/promise";

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

  test("Onboarding", async () => {
    await element(by.id("OnboardingWelcomeContinue")).tap();
    await element(by.id("OnboardingDeviceNanoX")).tap();
    await element(by.id("OnboardingGetStartedChoiceInitialized")).tap();
    await element(by.id("OnboardingPinYes")).tap();
    await element(by.id("OnboardingRecoveryYes")).tap();
    await element(by.id("OnboardingSecurityContinue")).tap();
    await element(by.id("PairDevice")).tap();
    const deviceDavid = "Nano X de David";
    postMessage({
      type: "add",
      payload: { id: "mock_1", name: deviceDavid },
    });
    postMessage({
      type: "add",
      payload: { id: "mock_2", name: "Nano X de Arnaud" },
    });
    postMessage({
      type: "add",
      payload: { id: "mock_3", name: "Nano X de Didier Duchmol" },
    });
    await element(by.id(`DeviceItemEnter ${deviceDavid}`)).tap();
    postMessage({ type: "open" });
    await element(by.id("PairDevicesContinue")).tap();
    await element(by.id("OnboardingSkip")).tap();
    await element(by.id("OnboardingShareDataContinue")).tap();
    await element(by.id("OnboardingFinish")).tap();
    await element(by.id("TermsAcceptSwitch")).tap();
    await element(by.id("TermsConfirm")).tap();
  });
});

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

function postMessage(message: PostMessage) {
  for (const ws of wss.clients.values()) {
    ws.send(JSON.stringify(message));
  }
}

type Message<T: string, P: { [key: string]: any } | typeof undefined> = {
  type: T,
  payload: P,
};

type PostMessage =
  | Message<"add", { id: string, name: string }>
  | Message<"open">;

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
