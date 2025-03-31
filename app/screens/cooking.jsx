import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView ,ProgressBarAndroid} from 'react-native';
import React, { useState } from 'react';
import { useRoute } from "@react-navigation/native";
import * as Speech from 'expo-speech'; // Voice assistance

const Cooking = () => {
  const route = useRoute();
  const { recipe = { instructions: [], ingredients: [], image: '', name: '' } } = route.params || {};

  const [currentStep, setCurrentStep] = useState(0); // Track the current step
  const [progress, setProgress] = useState(0); // Track progress (0 to 1)

  const handleStartCooking = () => {
    const instruction = recipe.instructions[currentStep];
    Speech.speak(instruction); // Start voice assistance for the current step

    // Timer logic for instructions containing minutes
    if (instruction.toLowerCase().includes("minutes")) {
      const match = instruction.match(/(\d+)\s*minutes/);
      if (match) {
        const minutes = parseInt(match[1]);
        startTimer(minutes);
      }
    }
  };

  const handleListenToIngredients = () => {
    const ingredientsText = recipe.ingredients.join(", ");
    Speech.speak(`The ingredients are: ${ingredientsText}`);
  };

  const startTimer = (minutes) => {
    setTimeout(() => {
      alert("Time's up for this step! Move to the next one.");
    }, minutes * 60 * 1000); // Convert minutes to milliseconds
  };

  const handleNextStep = () => {
    if (currentStep < recipe.instructions.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      setProgress((newStep + 1) / recipe.instructions.length);
    } else {
      alert("You've completed the recipe!");
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      setProgress(newStep / recipe.instructions.length);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Recipe Image */}
      <Image source={{ uri: recipe.image }} style={styles.recipeImage} />

      {/* Title */}
      <Text style={styles.title}>{recipe.name}</Text>

      {/* Listen to Ingredients Button */}
      <TouchableOpacity style={styles.listenButton} onPress={handleListenToIngredients}>
        <Text style={styles.listenButtonText}>Listen to Ingredients</Text>
      </TouchableOpacity>

      {/* Start Cooking Button (Placed Separately) */}
      <TouchableOpacity style={styles.startCookingButton} onPress={handleStartCooking}>
        <Text style={styles.startCookingButtonText}>Start Cooking (Voice)</Text>
      </TouchableOpacity>

      {/* Current Step Section */}
      <View style={styles.stepContainer}>
        <Text style={styles.stepText}>
          Step {currentStep + 1}/{recipe.instructions.length}
        </Text>
        <Text style={styles.instructionText}>{recipe.instructions[currentStep]}</Text>
      </View>

      {/* Progress Bar */}
      <ProgressBarAndroid
        styleAttr="Horizontal"
        indeterminate={false}
        progress={progress}
        color="#FF9800"
        style={styles.progressBar}
      />

      {/* Previous & Next Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, currentStep === 0 && styles.disabledButton]} onPress={handlePreviousStep} disabled={currentStep === 0}>
          <Text style={styles.buttonText}>Previous Step</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleNextStep}>
          <Text style={styles.buttonText}>Next Step</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF8E1",
  },
  recipeImage: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  listenButton: {
    backgroundColor: "#FF9800",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  listenButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  startCookingButton: {
    backgroundColor: "#D84315",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  startCookingButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  stepContainer: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginBottom: 20,
  },
  stepText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#757575",
  },
  instructionText: {
    fontSize: 16,
    color: "#333",
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#FF9800",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#BDBDBD", // Greyed out when disabled
  },
});

export default Cooking;
