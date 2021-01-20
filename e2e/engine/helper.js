// @flow

export function $proceed(): Promise<void> {
  return $("Proceed").tap();
}

export function $(id: string) {
  // TODO E2E: types for Detox related globals
  return element(by.id(id));
}

export function $byText(text: string) {
  return element(by.text(text));
}

// TODO E2E: accept id or element
export function $visible(id: string, percentage: number = 75) {
  return expect($(id)).toBeVisible(percentage);
}

// TODO E2E: accept id or element
export function $tap(id: string) {
  return $(id).tap();
}

export function $scroll(
  offset: number,
  direction: "top" | "down" | "right" | "left" = "down",
) {
  return $("ScrollView").scroll(offset, direction);
}
