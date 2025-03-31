import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import { useNavigation } from 'expo-router';
import axios from 'axios';
import LottieView from 'lottie-react-native';

const Generate = () => {
  const navigation = useNavigation();
  const [ingredients, setIngredients] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [time, setTime] = useState(30);
  const [recipes, setRecipes] = useState([]);
  const [isLoding, setisLoding] = useState(null);

  const cuisines = ['Indian', 'Chinese', 'Italian', 'Mexican', 'American'];

  const handleGenerate = async () => {
    setisLoding(true);
    const array = ingredients.split(',');
    const prompt = `I have ${ingredients} and I want to cook a ${cuisine} dish. The max cooking time should be ${time} minutes. Suggest at least 2 to 3 recipes that fits these requirements.`;
    if (array.length <= 2) {
      Alert.alert("Ingredients", "Enter more than two ingredients");
      return;
    }
    if (!cuisine) {
      Alert.alert("Cuisine", "Please select a cuisine");
      return;
    }

    try {
      const response = await axios.post('http://192.168.163.3:5000/getRecipes', {
        user_input: prompt,
      });
      // const new_data = JSON.parse(response.data.data)
      setRecipes(response.data.data);
      setisLoding(false)
    } catch (error) {
      console.log("Fetching Error", error);
      Alert.alert("Server Error", "There was a problem with the server.");
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Generate Recipes</Text>

            {/* Input for Ingredients */}
            <Text style={styles.label}>Enter Ingredients:</Text>
            <TextInput
              style={styles.input}
              placeholder="E.g., eggs, tomatoes, onions"
              value={ingredients}
              onChangeText={setIngredients}
              multiline
            />

            {/* Cuisine Picker */}
            <Text style={styles.label}>Select Cuisine:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={cuisine}
                onValueChange={(value) => setCuisine(value)}
                style={styles.picker}
              >
                <Picker.Item label="Select Cuisine" value="" />
                {cuisines.map((cuisine, index) => (
                  <Picker.Item key={index} label={cuisine} value={cuisine} />
                ))}
              </Picker>
            </View>

            {/* Time Slider */}
            <Text style={styles.label}>Cooking Time (in minutes):</Text>
            <Slider
              style={styles.slider}
              minimumValue={5}
              maximumValue={120}
              step={5}
              value={time}
              onValueChange={(value) => setTime(value)}
              minimumTrackTintColor="#FF9800"
              maximumTrackTintColor="#BDBDBD"
              thumbTintColor="#FF9800"
            />
            <Text style={styles.sliderValue}>{time} minutes</Text>

            {/* Generate Button */}
            <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
              <Text style={styles.generateButtonText}>Find Recipes</Text>
            </TouchableOpacity>
            {isLoding && (
              <View style={styles.loadingContainer}>
                <LottieView
                  source={require('../../assets/cooking.json')} // Ensure you have a Lottie JSON animation file
                  autoPlay
                  loop
                  style={styles.lottie}
                />
                <Text style={styles.loadingText}>Stirring the pot... Almost there!" 🍲🥄</Text>
              </View>
            )}

            {recipes.length > 0 && <Text style={styles.subTitle}>Recommended Recipes:</Text>}
          </View>
        }
        data={recipes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.recipeCard} onPress={() => navigation.navigate("screens/recipe", { item: item })}>
            <Image source={{ uri: item.image }} style={styles.recipeImage} />
            <Text style={styles.recipeName}>{item.name}</Text>
            <Text style={styles.recipeDetails}>Cuisine: {item.cuisine}</Text>
            <Text style={styles.recipeDetails}>Time: {item.cooking_time}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#FF9800',
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF9800',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 10,
  },
  sliderValue: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  generateButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 15,
  },
  recipeCard: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
  },
  recipeImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  recipeDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  lottie: {
    width: 250,
    height: 250,
    position:"relative",
    bottom:70

  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9800',
    textAlign: 'center',
    position:"relative",
    bottom:130
  },
});

export default Generate;
