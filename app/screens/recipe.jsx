import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useRoute, useNavigation } from "@react-navigation/native"; // Add useNavigation

const Recipe = () => {
    const route = useRoute();
    const navigation = useNavigation(); // Navigation hook for button
    const { item } = route.params;
    const [selectedTab, setSelectedTab] = useState("Ingredients"); // Tabs for switching

    return (
        <View style={styles.container}>
            {/* Recipe Image */}
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.recipeImage} />
            </View>

            {/* Recipe Details */}
            <View style={styles.recipeDetails}>
                <Text style={styles.recipeName}>{item.name}</Text>
                <Text style={styles.recipeInfo}>
                    🌍 {item.cuisine}   ⏳ {item.cooking_time} mins
                </Text>
            </View>

            {/* Start Cooking Button */}
            <TouchableOpacity 
                style={styles.startCookingButton} 
                onPress={() => navigation.navigate('screens/cooking', { recipe: item })}
            >
                <Text style={styles.startCookingText}>Start Cooking</Text>
            </TouchableOpacity>

            {/* Tab Navigation */}
            <View style={styles.tabContainer}>
                <TouchableOpacity onPress={() => setSelectedTab("Ingredients")} style={[styles.tabButton, selectedTab === "Ingredients" && styles.activeTab]}>
                    <Text style={[styles.tabText, selectedTab === "Ingredients" && styles.activeTabText]}>Ingredients</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedTab("Instructions")} style={[styles.tabButton, selectedTab === "Instructions" && styles.activeTab]}>
                    <Text style={[styles.tabText, selectedTab === "Instructions" && styles.activeTabText]}>Instructions</Text>
                </TouchableOpacity>
            </View>

            {/* Content Section */}
            <ScrollView style={styles.contentContainer}>
                {selectedTab === "Ingredients" ? (
                    <View style={styles.listContainer}>
                        {item.ingredients.map((ingredient, index) => (
                            <View key={index} style={styles.listItem}>
                                <Text style={styles.listText}>• {ingredient}</Text>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={styles.listContainer}>
                        {item.instructions.map((step, index) => (
                            <View key={index} style={styles.listItem}>
                                <Text style={styles.listText}>{step}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF8E1",
    },
    imageContainer: {
        alignItems: "center",
        marginTop: 10,
    },
    recipeImage: {
        width: 330,
        height: 200,
        borderRadius: 20,
    },
    recipeDetails: {
        alignItems: "center",
        paddingVertical: 15,
    },
    recipeName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
    },
    recipeInfo: {
        fontSize: 16,
        color: "#757575",
    },
    tabContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 10,
        backgroundColor: "#FFD180",
        borderRadius: 20,
        marginHorizontal: 20,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: "center",
    },
    activeTab: {
        backgroundColor: "#FF9800",
        borderRadius: 20,
    },
    tabText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    activeTabText: {
        color: "white",
    },
    contentContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    listContainer: {
        backgroundColor: "#FFF",
        borderRadius: 10,
        padding: 15,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    listItem: {
        marginBottom: 10,
    },
    listText: {
        fontSize: 16,
        color: "#333",
    },
    // New style for the Start Cooking button
    startCookingButton: {
        backgroundColor: "#FF9800",
        padding: 12,
        marginHorizontal: 20,
        borderRadius: 20,
        alignItems: "center",
        marginVertical: 10,
    },
    startCookingText: {
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 18,
    },
});

export default Recipe;
