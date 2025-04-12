import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView, FlatList, Alert, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importing icons
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';

const Home = () => {
    const navigation=useNavigation();
    const route = useRouter();
    const [isSelected, setIsSelected] = useState(0);
    const [categories, setCategories] = useState(["Breakfast", "Lunch", "Dinner", "Sweets", "Snacks"]);
    const [recommendedRecipes, setRecommendedRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false); // State for refresh control

    const Endpoint={
        0:"BreakFast",
        1:"Lunch",
        2:"Dinner",
        3:"Sweets",
        4:"Snacks"
    }
  

    // Function to fetch recipes
    const fetchRecipes = async () => {
        try {
            const end=`http://192.168.31.232:5000/${Endpoint[isSelected]}`;
            const response = await fetch(end); 
            const data = await response.json();
        
            if (data && data.data) {
                setRecommendedRecipes(data.data); 
                setLoading(false);
            }
        } catch (error) {
            Alert.alert("Oops!", "Network Error, try again");
            console.error("Error fetching recipes:", error);
            setLoading(true);
        } finally {
            setTimeout(()=>{
                setLoading(false);
            },2000);
            setRefreshing(false); // Stop the refresh animation
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchRecipes();
    }, [isSelected]);

    // Handle pull-to-refresh
    const onRefresh = () => {
        setRefreshing(true); // Start the refresh animation
        setTimeout(()=>{
            setLoading(true);
            fetchRecipes();
        },500);
        // fetchRecipes(); // Fetch new recipes
    };
    const selected=(index)=>{
        setLoading(true);
        setIsSelected(index);
    }

    return (
        <LinearGradient
            style={styles.container}
            colors={["#FFF8E1", "#FFD180"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            {/* Header Section */}
            <View style={styles.header}>
                <Image
                    source={require("../../assets/images/chefImg.png")}
                    style={styles.userImage}
                />
                <Text style={styles.appName}>TadkaAI</Text>
                <TouchableOpacity style={styles.generateButton} onPress={() => route.navigate("generate")}>
                    <Icon name="auto-awesome" size={20} color="black" style={styles.icon} />
                    <Text style={styles.generateButtonText}>Generate</Text>
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchBar}>
                <Icon name="search" size={23} color="#BDBDBD" style={styles.searchIcon} />
                <TextInput
                    placeholder="Search recipes, E.g., Pizza, Samosa..."
                    placeholderTextColor="#BDBDBD"
                    style={styles.searchInput}
                />
            </View>

            {/* Categories Carousel */}
            <View style={styles.categoriesContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {categories.map((category, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.categoryButton, isSelected === index ? styles.selected : null]}
                            onPress={() =>selected(index)}
                        >
                            <Text style={styles.categoryText}>{category}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Recommended Recipes */}
            <Text style={styles.sectionTitle}>Recommended for You</Text>
            {loading ? (
                <View>
                    {[...Array(4)].map((_, index) => (
                        <View
                            key={index}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: 20,
                                backgroundColor: "#FFFFFF",
                                borderRadius: 10,
                                elevation: 3,
                                padding: 10,
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 5,
                            }}
                        >
                            {/* Image Skeleton */}
                            <View style={{ width: 70, height: 70, borderRadius: 10, backgroundColor: "#E0E0E0", marginRight: 15 }} />
                            {/* Text Skeleton */}
                            <View>
                                <View style={{ width: 120, height: 20, borderRadius: 5, backgroundColor: "#E0E0E0", marginBottom: 5 }} />
                                <View style={{ width: 80, height: 15, borderRadius: 5, backgroundColor: "#E0E0E0" }} />
                            </View>
                        </View>
                    ))}
                </View>
            ) : (
                <FlatList
                    data={recommendedRecipes}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.recipeCard} onPress={() => navigation.navigate("screens/recipe",{item:item})}>
                            <Image source={{ uri: item.image }} style={styles.recipeImage} />
                            <View>
                                <Text style={styles.recipeText}>{item.name}</Text>
                                <Text style={styles.recipeDetails}>
                                    {item.cuisine} • {item.cooking_time} mins
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.recipeList}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            )}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF8E1",
        paddingHorizontal: 10,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 10,
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: "#FF9800",
    },
    appName: {
        fontSize: 30,
        fontWeight: "bold",
        color: "black",
    },
    generateButton: {
        backgroundColor: "#FF9800",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    generateButtonText: {
        color: "black",
        fontWeight: "600",
        fontSize: 16,
        marginLeft: 5,
    },
    searchBar: {
        marginVertical: 15,
        backgroundColor: "#FFFFFF",
        borderRadius: 25,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: "#FF9800",
    },
    searchInput: {
        flex: 1,
        height: 43,
        fontSize: 16,
        color: "#333333",
    },
    searchIcon: {
        marginRight: 10,
    },
    categoriesContainer: {
        marginTop: 10,
        marginBottom: 20,
    },
    categoryButton: {
        backgroundColor: "#FFE0B2",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginRight: 10,
    },
    categoryText: {
        fontSize: 16,
        fontWeight: "600",
        color: "black",
    },
    selected: {
        backgroundColor: "#FF9800",
    },
    sectionTitle: {
        fontSize: 23,
        fontWeight: "bold",
        color: "#FF7043",
        marginBottom: 15,
    },
    recipeList: {
        paddingBottom: 20,
    },
    recipeCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        marginBottom: 10,
        alignItems: "center",
        padding: 10,
        flexDirection: "row",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    recipeImage: {
        width: 70,
        height: 70,
        borderRadius: 10,
        marginRight: 15,
    },
    recipeText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333333",
        
    },
    recipeDetails: {
        fontSize: 14,
        color: "#757575",
    },
});

export default Home;
