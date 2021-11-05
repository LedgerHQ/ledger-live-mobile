import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import MainScreen from '../src/screens/MainScreen';

test('MainScreen snapShot', () => {
  const snap = renderer.create(
    <MainScreen />
  ).toJSON();

  expect(snap).toMatchSnapshot(); 
});
