import "react-native";
import React from "react";
import renderer from "react-test-renderer";
import SymbolDashboard from "../src/screens/SymbolDashboard";

test("SymbolDashboard snapShot", () => {
  const snap = renderer.create(<SymbolDashboard />).toJSON();

  expect(snap).toMatchSnapshot();
});
