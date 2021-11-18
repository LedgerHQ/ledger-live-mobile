import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import Market from '../src/screens/Market';

test('Market snapShot', () => {
  const snap = renderer.create(
    <Market />
  ).toJSON();

  expect(snap).toMatchSnapshot(); 
});
