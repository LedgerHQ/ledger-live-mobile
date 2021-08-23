import React from "react";
import { storiesOf } from '@storybook/react-native';
import {withKnobs, number, boolean} from '@storybook/addon-knobs';
import Loader from '@components/Loader';
import CenterView from '../CenterView';

storiesOf('Loader', module)
  .addDecorator(withKnobs)
  .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
  .add('default', () => (
    <Loader progress={number('progress', 20)} displayCancelIcon={boolean('displayCancelIcon', true)} onPress={() => console.log('test')}>
    </Loader>
  ));
