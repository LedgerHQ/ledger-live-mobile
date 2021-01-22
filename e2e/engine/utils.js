// @flow

export function $proceed(): Promise<void> {
  return $("Proceed").tap();
}

export function $(id: string) {
  return element(by.id(id));
}

export function $byText(text: string) {
  return element(by.text(text));
}

export function $visible(q: Query, percentage: number = 75) {
  const el = getElement(q);
  return expect(el).toBeVisible(percentage);
}

export function $tap(q: Query) {
  return getElement(q).tap();
}

export function $scrollTill(
  visibleTarget: Query,
  scrollViewId: string = "ScrollView",
  pixel: number = 200,
  direction: ScrollDirection = "down",
) {
  const targetEl = getElement(visibleTarget);
  return waitFor(targetEl)
    .toBeVisible()
    .whileElement(by.id(scrollViewId))
    .scroll(pixel, direction);
}

type Element = any;

type Query = string | Element;

function getElement(q: Query): Element {
  return typeof q === "string" ? $(q) : q;
}

type ScrollDirection = "top" | "down" | "right" | "left";
