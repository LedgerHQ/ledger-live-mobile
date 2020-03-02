/* @flow */
import { PureComponent } from "react";

class FallBackCamera extends PureComponent<{
  navigation: *,
}> {
  componentDidMount() {
    // TODO do it better way to not have flickering

    const { navigation } = this.props;
    // $FlowFixMe
    navigation.replace("FallBackCameraScreen");
  }

  render() {
    return null;
  }
}

export default FallBackCamera;
