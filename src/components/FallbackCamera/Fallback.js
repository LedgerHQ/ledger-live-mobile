/* @flow */
import { PureComponent } from "react";
import { ScreenName } from "../../const";

export default class FallBackCamera extends PureComponent<{
  screenName?: string,
  navigation: any,
}> {
  componentDidMount() {
    const { navigation, screenName } = this.props;
    navigation.replace(ScreenName.FallbackCameraSend, {
      screenName,
    });
  }

  render() {
    return null;
  }
}
