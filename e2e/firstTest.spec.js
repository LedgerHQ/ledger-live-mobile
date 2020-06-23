import { Server } from "ws";

let wss: Server;

describe("Ledger Live Mobile", () => {
  beforeAll(() => {
    wss = new Server({ port: 8099 });
    wss.on("connection", ws => {
      ws.send("ping");
      ws.on("message", message => {
        // eslint-disable-next-line no-console
        console.log(`[E2E Bridge]: ${message}`);
      });
    });
  });

  afterAll(() => {
    wss.close();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("should have welcome screen", async () => {
    // await element(by.id("OnboardingWelcomeContinue")).tap();
  });
});
