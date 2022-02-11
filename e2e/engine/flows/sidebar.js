// @flow
// import { $tap } from "../utils";
const { element, by } = require("detox");

// change from flows to page objects?

export async function navigate(el) {
  await element(by.id(`${el}`)).tap();
}
