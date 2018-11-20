// @flow

import React, { PureComponent } from "react";
import { View, StyleSheet, Animated } from "react-native";

import LText from "./LText";
import colors from "../colors";
import ArrowRight from "../icons/ArrowRight";

// TODO fade in animation

export class BulletItemText extends PureComponent<{
  children: React$Node,
}> {
  render() {
    return <LText style={styles.text}>{this.props.children}</LText>;
  }
}

export class BulletItem extends PureComponent<{
  value: React$Node | (() => React$Node),
  index: number,
  animated?: boolean,
  itemStyle?: {},
  bullet: React$ComponentType<*>,
}> {
  static defaultProps = {
    bullet: Bullet,
  };

  opacity = new Animated.Value(this.props.animated ? 0 : 1);

  componentDidMount() {
    if (this.props.animated) {
      Animated.timing(this.opacity, {
        toValue: 1,
        duration: 500,
        delay: this.props.index * 800,
        useNativeDriver: true,
      }).start();
    }
  }

  render() {
    const { index, value, bullet, itemStyle } = this.props;
    const { opacity } = this;
    const BulletView = bullet;

    return (
      <Animated.View style={[styles.item, { opacity }]}>
        <BulletView>{index + 1}</BulletView>
        <View style={itemStyle || styles.textContainer}>
          {typeof value === "function" ? (
            value()
          ) : (
            <BulletItemText>{value}</BulletItemText>
          )}
        </View>
      </Animated.View>
    );
  }
}

export class Bullet extends PureComponent<{ children: *, big?: boolean }> {
  render() {
    const { children, big } = this.props;
    return (
      <View style={[styles.bulletContainer, big && styles.bulletContainerBig]}>
        <LText style={[styles.number, big && styles.numberBig]} tertiary>
          {children}
        </LText>
      </View>
    );
  }
}

export class BulletChevron extends PureComponent<{}> {
  render() {
    return (
      <View style={{ alignSelf: "flex-start", paddingTop: 2 }}>
        <ArrowRight size={16} color={colors.grey} />
      </View>
    );
  }
}

class BulletList extends PureComponent<{
  list: *,
  animated?: boolean,
  bullet: React$ComponentType<*>,
  itemStyle?: {},
}> {
  static defaultProps = {
    bullet: Bullet,
  };
  render() {
    const { list, animated, bullet, itemStyle } = this.props;
    return (
      <View>
        {list.map((value, index) => (
          <BulletItem
            itemStyle={itemStyle}
            bullet={bullet}
            animated={animated}
            key={index}
            index={index}
            value={value}
          />
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  bulletContainer: {
    width: 24,
    height: 24,
    backgroundColor: "#eff3fd",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  bulletContainerBig: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  number: {
    fontSize: 12,
    color: colors.live,
  },
  numberBig: {
    fontSize: 16,
  },
  textContainer: {
    flexShrink: 1,
    flexGrow: 1,
    paddingLeft: 16,
  },
  text: {
    color: colors.smoke,
    fontSize: 14,
    lineHeight: 21,
  },
});

export default BulletList;
