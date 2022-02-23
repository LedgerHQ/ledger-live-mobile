import { device, waitFor, element, by } from "detox";

const DEFAULT_TIMEOUT = 5000;

export async function waitAndTap(elementId, timeout) {
  await waitFor(element(by.id(elementId)))
    .toBeVisible()
    .withTimeout(timeout || DEFAULT_TIMEOUT);

  return element(by.id(elementId)).tap();
}

export function tap(elementId) {
  return element(by.id(elementId)).tap();
}

export function tapByText(text, index) {
  return element(by.text(text))
    .atIndex(index || 0)
    .tap();
}

export async function typeText(elementId, text, focus = true) {
  if (focus) {
    await tap(elementId);
  }
  return element(by.id(elementId)).typeText(text);
}

export async function clearField(elementId) {
  return element(by.id(elementId)).replaceText("");
}

export async function scrollToElementById(
  elementToScrollToId,
  parentElementId,
  pixelsToScroll,
  direction = "down",
  startPositionXAxis = NaN,
  startPositionYAxis = NaN,
) {
  await waitFor(element(by.id(elementToScrollToId)))
    .toBeVisible()
    .whileElement(by.id(parentElementId))
    .scroll(pixelsToScroll, direction, startPositionXAxis, startPositionYAxis);
}

export async function retryAction(action, timeout) {
  let shouldContinue = true;
  const startTime = Date.now();

  while (shouldContinue) {
    shouldContinue = false;

    try {
      await action();
    } catch {
      shouldContinue = true;
    }

    if (timeout && Date.now() - startTime > timeout) {
      throw new Error("Timed out when waiting for action");
    }

    // eslint-disable-next-line no-console
    console.log("Trying again...");
  }
}

export async function closeApp() {
  await device.terminateApp("ledgerlivemobile");
}

export async function launchApp() {
  // does newInstance wipe previous data?
  return device.launchApp({ newInstance: true });
}

export function delay(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
