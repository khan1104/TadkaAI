import React, { useEffect, useRef } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const App = () => {
  const animationRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
        console.log("isLoggedIn:", isLoggedIn);

        setTimeout(() => {
          if (isLoggedIn === "true") {
            router.replace("/(tabs)/Home");
          } else {
            router.navigate("Auth/Onbording");
          }
        }, 1000);
      } catch (error) {
        console.error("Error fetching login status:", error);
      }
    };

    const timer = setTimeout(() => {
      if (animationRef.current) {
        animationRef.current.pause();
        checkLoginStatus();
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#FFF8E1" />
      <View style={styles.container}>
        <LottieView
          ref={animationRef}
          source={require("../assets/second.json")}
          autoPlay
          loop
          style={styles.animation}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E1",
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: 500,
    height: 500,
  },
});

export default App;
