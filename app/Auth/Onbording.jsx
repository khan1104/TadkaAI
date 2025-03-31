import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";

const OnboardingScreen = () => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const router=useRouter();

  const onboardingData = [
    {
      title: "Welcome to TadkaAI!",
      description: "Discover delicious recipes with the ingredients you have.",
      animation: require("../../assets/onboardone_new.json"),
    },
    {
      title: "AI-Powered Recipe Suggestions",
      description: "Tell us what you have, and we'll suggest the perfect recipe.",
      animation: require("../../assets/onboardtwo.json"),
    },
    {
      title: "Voice & Visual Guidance",
      description: "Follow guided steps, listen to recipes, and set timers.",
      animation: require("../../assets/onboardthird.json"),
    },
  ];

  const handleNext = () => {
    if (currentScreen < onboardingData.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      router.replace("./Login");
    }
  };

  const handleBack = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={onboardingData[currentScreen].animation}
        autoPlay
        loop
        style={styles.animation}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{onboardingData[currentScreen].title}</Text>
        <Text style={styles.description}>{onboardingData[currentScreen].description}</Text>
      </View>
      <View style={styles.indicatorContainer}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentScreen === index && styles.activeIndicator,
            ]}
          />
        ))}
      </View>
      <View style={styles.buttonContainer}>
        {currentScreen > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={currentScreen==0 ? styles.nextButtonFirst : styles.nextButton} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentScreen === onboardingData.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    padding: 20,
  },
  animation: {
    width: 320,
    height: 320,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    maxHeight: 150,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 20,
    color: "#666",
    textAlign: "center",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop:30
  },
  indicator: {
    width: 10,
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: "#ff7043",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    marginTop:50
  },
  backButton: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  nextButton: {
    backgroundColor: "#ff7043",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  nextButtonFirst:{
    backgroundColor: "#ff7043",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginLeft:200
  }
});

export default OnboardingScreen;

