import { readFileSync } from "fs";

const DEFAULT_TIMEOUT = 30000;

export function waitAndTap(elementId, timeout) {
  console.log(`==================> Waiting for element with id: ${elementId}`);
  waitFor(element(by.id(elementId)))
    .toBeVisible()
    .withTimeout(timeout || DEFAULT_TIMEOUT);

  console.log(`==================> Tapping element with id: ${elementId}`);
  return element(by.id(elementId)).tap();
}

export function waitForElement(elementId, timeout) {
  console.log(`==================> Waiting for element with id: ${elementId}`);
  return waitFor(element(by.id(elementId)))
    .toBeVisible()
    .withTimeout(timeout || DEFAULT_TIMEOUT);
}

export function tap(elementId) {
  console.log(`==================> Tapping element with id: ${elementId}`);
  return element(by.id(elementId)).tap();
}

export function tapByText(text, index) {
  console.log(`==================> Tapping element with text: ${text}`);
  return element(by.text(text))
    .atIndex(index || 0)
    .tap();
}

export async function typeText(elementId, text, focus = true) {
  console.log(
    `==================> Typing text '${text}' into element with id ${elementId}`,
  );
  if (focus) {
    await tap(elementId);
  }
  return element(by.id(elementId)).typeText(text);
}

export function clearField(elementId) {
  console.log(`==================> Clearing field with id: ${elementId}`);
  element(by.id(elementId)).replaceText("");
}

export async function scrollToElementById(
  elementToScrollToId,
  parentElementId,
  pixelsToScroll,
  direction = "down",
  startPositionXAxis = NaN,
  startPositionYAxis = 0.5,
) {
  console.log(
    `==================> Scrolling to element with id: ${elementToScrollToId}`,
  );
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

export async function verifyIsVisible(elementId) {
  await delay(1000);
  await expect(element(by.id(elementId))).toBeVisible();
}

export async function verifyTextIsVisible(text) {
  await delay(1000);
  await expect(element(by.text(text))).toBeVisible();
}

export function delay(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve("delay complete");
    }, ms);
  });
}

// for future use for screenshot conmparison
export function expectBitmapsToBeEqual(imagePath, expectedImagePath) {
  const bitmapBuffer = readFileSync(imagePath);
  const expectedBitmapBuffer = readFileSync(expectedImagePath);
  if (!bitmapBuffer.equals(expectedBitmapBuffer)) {
    throw new Error(
      `Expected image at ${imagePath} to be equal to image at ${expectedImagePath}, but it was different!`,
    );
  }
}
