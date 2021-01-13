// @flow

export function proceed(): Promise<void> {
  return $("proceed").tap();
}

export function $(id: string) {
  return element(by.id(id));
}

export function $byText(text: string) {
  return element(by.text(text));
}
