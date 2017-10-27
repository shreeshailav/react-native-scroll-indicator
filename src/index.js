import React, { Component } from "react";
import { StyleSheet, View, Image, Animated } from "react-native";

import LinearGradient from "react-native-linear-gradient";

class Readmore extends Component {
  static defaultProps = {
    minScrollHeight: 0,
    style: {},
    scrollEnabled: true,
    showIndicator: true
  };

  constructor(props) {
    super(props);
    this.state = {
      scrollViewHeight: 0,
      contentHeight: 0,
      bottom: new Animated.Value(100)
    };
  }

  displayIndicator(includeMinScroll = true) {
    const { scrollViewHeight, contentHeight } = this.state;
    const { minScrollHeight } = this.props;

    return (
      scrollViewHeight &&
      contentHeight &&
      contentHeight >
        Math.ceil(scrollViewHeight) + (includeMinScroll ? minScrollHeight : 0)
    );
  }

  render() {
    const { scrollViewHeight, contentHeight, bottom } = this.state;
    const { children, scrollEnabled, showIndicator, style } = this.props;
    const maxValue = Math.max(contentHeight - scrollViewHeight, 0);
    const slideViewBottom = bottom.interpolate({
      inputRange: [0, maxValue],
      outputRange: [0, 100],
      extrapolate: "clamp"
    });

    const slideViewTop = bottom.interpolate({
      inputRange: [0, maxValue],
      outputRange: [60, 100],
      extrapolate: "clamp"
    });

    return (
      <View style={{ flex: 1, overflow: "hidden" }}>
        {showIndicator && this.displayIndicator(false) ? (
          <Animated.View
            style={[
              styles.swipeWrapperTop,
              {
                transform: [{ translateY: slideViewTop }]
              }
            ]}
          >
            <LinearGradient
              colors={["#212121", "transparent"]}
              style={[styles.gradientBackground]}
            />
          </Animated.View>
        ) : null}
        <Animated.ScrollView
          style={{ flex: 1 }}
          scrollEnabled={scrollEnabled}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: bottom } } }],
            { useNativeDriver: true }
          )}
          onLayout={e => {
            this.setState({
              scrollViewHeight: e.nativeEvent.layout.height
            });
          }}
          scrollEventThrottle={16}
        >
          <View
            style={[
              {
                flex: 1,
                minHeight: scrollViewHeight
              },
              style
            ]}
            onLayout={e => {
              this.setState({
                contentHeight: e.nativeEvent.layout.height
              });
            }}
          >
            {children}
          </View>
        </Animated.ScrollView>
        {showIndicator && this.displayIndicator() ? (
          <Animated.View
            onLayout={() => {
              Animated.timing(this.state.bottom, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true
              }).start();
            }}
            style={[
              styles.swipeWrapperBottom,
              {
                transform: [{ translateY: slideViewBottom }]
              }
            ]}
          >
            <LinearGradient
              colors={["transparent", "#212121"]}
              style={[styles.gradientBackground]}
            >
              <Image source={require("../../../img/swipe-up.png")} />
            </LinearGradient>
          </Animated.View>
        ) : null}
      </View>
    );
  }
}

export default Readmore;

const styles = StyleSheet.create({
  swipeWrapperTop: {
    backgroundColor: "transparent",
    position: "absolute",
    left: 0,
    right: 0,
    top: -160,
    zIndex: 999
  },
  swipeWrapperBottom: {
    backgroundColor: "transparent",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999
  },
  gradientBackground: {
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    backgroundColor: "transparent"
  }
});