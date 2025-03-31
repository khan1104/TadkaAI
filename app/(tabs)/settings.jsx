import React,{useState,useEffect} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity,Alert} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter,useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {db} from "../config"
import { deleteDoc, doc,getDoc, updateDoc } from 'firebase/firestore'; 


const Settings = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const navigation=useNavigation();
  const router=useRouter();
  const Logout=async ()=>{
    await AsyncStorage.clear();
    Alert.alert("LogginOut");
    router.replace("Auth/Login");
  };
  const DeleteAccount=()=>{
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete", onPress: async () => {
              try {
                const email = await AsyncStorage.getItem("userEmail");
                await deleteDoc(doc(db, 'users', email)); // Assuming you still want to delete from Firebase
                Alert.alert('Success', 'Account deleted Successfully');
                await AsyncStorage.clear(); // Clear user data
                router.replace("Auth/Login");
              } catch (error) {
                console.error('Error deleting document: ', error);
                Alert.alert('Error', 'Failed to delete document.');
            }
          }
        },
      ]
    );
  };
  const fetchData = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      setNewEmail(email);
      if (email) {
        const userDoc = doc(db, 'users', email);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        } else {
          Alert.alert('Error', 'No such document!');
        }
      } else {
        Alert.alert('Error', 'No email found in AsyncStorage');
      }
    } catch (error) {
      Alert.alert('Error fetching user data', error.message);
    }
  };
  const change=()=>{
    navigation.navigate("Auth/changepass",{mail:newEmail});
  }
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <View style={styles.container}>
      {/* User Profile Section */}
      <View style={styles.profileContainer}>
        <Image
          source={require("../../assets/images/chefImg.png")}
          style={styles.userImage}
        />
        <View style={styles.usernameContainer}>
          <Text style={styles.username}>{userDetails?.username}</Text>
          <Text style={styles.userEmail}>{userDetails?.mail}</Text>
        </View>
      </View>

      {/* Settings Options */}
      <TouchableOpacity style={styles.option} onPress={change}>
        <Ionicons name="lock-closed-outline" size={24} color="#FF9800" />
        <Text style={styles.optionText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={Logout}>
        <Ionicons name="exit-outline" size={24} color="#FF9800"/>
        <Text style={styles.optionText}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={DeleteAccount}>
        <MaterialCommunityIcons name="account-remove" size={24} color="#FF9800" />
        <Text style={styles.optionText}>Delete Account</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option}>
        <MaterialCommunityIcons name="comment-text-outline" size={24} color="#FF9800" />
        <Text style={styles.optionText}>Give Feedback</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option}>
        <MaterialCommunityIcons name="history" size={24} color="#FF9800" />
        <Text style={styles.optionText}>History</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E1",
    padding: 20,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  userImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "#FF9800",
    marginRight:5,
  },
  usernameContainer: {
    flexDirection: "column",
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#FF9800",
    marginBottom: 10,
  },
  optionText: {
    fontSize: 18,
    marginLeft: 15,
    color: "#333",
  },
});

export default Settings;
