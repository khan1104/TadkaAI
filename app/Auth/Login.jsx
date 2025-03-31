import { View, Text, StyleSheet, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { getDocs, collection } from 'firebase/firestore';
import { app, db } from "../config";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const route = useRouter();
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleLogin = () => {
    Alert.alert('Google Login', 'Google login functionality will be added here.');
  };

  const handleRegister = () => {
    route.navigate("Auth/Register");
  };
  const handleLogin = async () => {
    if (mail.length === 0 || password.length === 0) {
      Alert.alert("Please enter all details");
    } else {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        let found = false;

        querySnapshot.forEach((doc) => {
          const user = doc.data();
          if (user.mail === mail && user.password === password) {
            found = true;
            AsyncStorage.setItem('isLoggedIn', 'true');
            AsyncStorage.setItem('userEmail', mail);
            route.replace("/(tabs)/Home");
          }
        });

        if (!found) {
          Alert.alert("Invalid Email or Password");
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={style.conatiner}>
      <View style={{ marginTop: 30 }}>
        <Text style={style.HeadText}>Welcome Back!</Text>
        <Text style={style.HeadText}>Let’s cook something amazing today</Text>
      </View>
      <View style={style.form}>
        <View style={style.inputContainer}>
          <Entypo name="email" size={30} color="black" style={style.icon} />
          <TextInput
            placeholder="Enter your email"
            style={style.textInput}
            value={mail}
            onChangeText={setMail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            accessible
            accessibilityLabel="Email input"
          />
        </View>
        <View style={style.inputContainer}>
          <FontAwesome name="lock" size={30} color="black" style={style.icon} />
          <TextInput
            placeholder="Enter your password"
            style={style.textInput}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            accessible
            accessibilityLabel="Password input"
          />
          <MaterialCommunityIcons
            name={showPassword ? 'eye' : 'eye-off'}
            size={24}
            color="black"
            style={style.eyeIcon}
            onPress={toggleShowPassword}
          />
        </View>
        <Pressable onPress={() => route.navigate("Auth/forgot")}>
          <Text style={style.forgotPassword}>Forgot Password?</Text>
        </Pressable>
      </View>
      <View style={style.buttonContainer}>
        <Pressable style={style.loginButton} onPress={handleLogin}>
          {loading ? (
            <ActivityIndicator size="large" color="#ffffff" />
          ) : (
            <Text style={style.loginButtonText}>Login</Text>
          )}
        </Pressable>

        <View style={style.lineContainer}>
          <View style={style.line}></View>
          <Text style={style.orText}>or continue with</Text>
          <View style={style.line}></View>
        </View>

        {/* Google Login Button */}
        <Pressable style={style.googleButton} onPress={handleGoogleLogin}>
          <FontAwesome5 name="google" size={20} color="#FFFFFF" style={style.googleIcon} />
          <Text style={style.googleButtonText}>Login with Google</Text>
        </Pressable>
      </View>
      {/* Register Section */}
      <View style={style.registerContainer}>
        <Text style={style.registerText}>Don't have an account?</Text>
        <Pressable onPress={handleRegister}>
          <Text style={style.registerLink}> Register</Text>
        </Pressable>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  conatiner: {
    backgroundColor: "#FFF8E1",
    flex: 1,
    padding: 20,
  },
  HeadText: {
    fontSize: 32,
    textAlign: "center",
    fontWeight: "500",
  },
  form: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    height: 190,
    width: 320,
    marginTop: 50,
    paddingTop: 30
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 20,
    height: 50,
    marginBottom: 15,
  },
  icon: {
    marginHorizontal: 10,
  },
  textInput: {
    width: 200,
    fontSize: 16,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 12,
  },
  forgotPassword: {
    color: "blue",
    textAlign: "right",
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#FF9800",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    width: '100%',
  },
  loginButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D1D1',
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: "#333333",
  },
  googleButton: {
    flexDirection: "row",
    backgroundColor: "#DB4437",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    width: '100%',
  },
  googleIcon: {
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  registerText: {
    fontSize: 16,
    color: "#333333",
  },
  registerLink: {
    fontSize: 16,
    color: "#FF9800",
    fontWeight: "bold",
  },
});

export default Login;
