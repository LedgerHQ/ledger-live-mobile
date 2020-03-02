/* @flow */
import { PureComponent } from "react";

class FallBackCamera extends PureComponent<{
  navigation: *,
}> {
  componentDidMount() {
    const { navigation } = this.props;
    // $FlowFixMe
    navigation.replace("FallbackCameraSend");
  }

  render() {
    return null;
  }
}

export default FallBackCamera;
