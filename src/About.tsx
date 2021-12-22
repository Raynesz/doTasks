import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

const About = () => {
  return (
    <View style={styles.about}>
      <Image style={styles.appIcon} source={require("../assets/icon.png")}></Image>
      <Text>
        <Text style={[styles.aboutText, { fontSize: 22 }]}>doTasks</Text>
        <Text style={styles.aboutText}> - v1.0.0</Text>
      </Text>
      <Text style={{ marginTop: 30 }}>
        <Text style={styles.aboutText}>code by </Text>
        <Text style={[styles.aboutText, { fontSize: 22 }]}>&lt;Raynesz.dev /&gt;</Text>
      </Text>
      <Text>
        <Text style={styles.aboutText}>made w/ React Native </Text>
        <Image style={styles.reactNativeImage} source={require("../assets/logo192.png")}></Image>
      </Text>
      <View style={styles.squareGroup}>
        <View style={[styles.square, { backgroundColor: "#57F287" }]}></View>
        <View style={[styles.square, { backgroundColor: "#FEE75C" }]}></View>
        <View style={[styles.square, { backgroundColor: "#ED4245" }]}></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  about: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  appIcon: {
    height: 64,
    width: 64,
  },
  aboutText: {
    color: "#595959",
    fontSize: 18,
  },
  reactNativeImage: {
    height: 24,
    width: 24,
  },
  squareGroup: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  square: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginHorizontal: 20,
  },
});

export default About;
