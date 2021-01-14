// @flow

export function $proceed(): Promise<void> {
  return $("proceed").tap();
}

export function $(id: string) {
  return element(by.id(id));
}

export function $byText(text: string) {
  return element(by.text(text));
}

export function $waitFor(id: string) {
  return expect($(id)).toBeVisible();
}

export function $tap(id: string) {
  return $(id).tap();
}
