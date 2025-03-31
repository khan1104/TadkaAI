import { View, Text, StyleSheet, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { db } from '../config'; // Adjust this path to your Firebase configuration
import { collection, query, where, getDocs } from 'firebase/firestore';

const Register = () => {
  const navigation = useNavigation();
  const route=useRouter();
  const eamilRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const regex = /^(?=.*[a-z])(?=.*[A-Z]).{7,}$/;
  const [username, setUsername] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userverify, setuserverify] = useState(false);
  const [mailverify, setmailverify] = useState(false);
  const [passwordverify, setpasswordverify] = useState(false);
  const [verifysignup, setverifysingup] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const validateemail = (mail) => {
    return eamilRegex.test(mail);
  };

  const validatePassword = (password) => {
    return regex.test(password);
  };

  const handleGoogleLogin = () => {
    Alert.alert('Google Login', 'Google login functionality will be added here.');
  };

  const handleRegister =async () => {
    setuserverify(username.length > 0);
    setmailverify(validateemail(mail));
    setpasswordverify(validatePassword(password));

    if (username.length > 0 && validateemail(mail) && validatePassword(password)) {
      setLoading(true)
      try{
        const q = query(collection(db, 'users'), where('mail', '==', mail));
        const querySnapshot = await getDocs(q);
        if(querySnapshot.empty){
          setverifysingup(true);
          console.log("Signup successful");
          navigation.navigate('Auth/otp', { username: username, mail: mail, password: password });
        }
        else{
          setLoading(false)
          Alert.alert("Email Alredy Exists","this Email is alredy in use");
        }
      }catch(error){
        console.log("error"+error);
      }
    }
    else {
      setLoading(false)
      console.log("unsuccessful signup");
      setverifysingup(false);
      Alert.alert("Incomplete Data", "Enter proper details");
    }
  };

  return (
    <View style={style.container}>
      <View style={{ marginTop: 30 }}>
        <Text style={style.HeadText}>Cook smarter,</Text>
        <Text style={style.HeadText}>Not Harder</Text>
      </View>
      <View style={style.form}>
        <View style={style.inputContainer}>
          <FontAwesome name="user" size={30} color="black" style={style.icon} />
          <TextInput
            placeholder="Enter your username"
            style={style.textInput}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            accessible
            accessibilityLabel="Username input"
          />
        </View>
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
        {!validateemail(mail) && mail.length > 0 && (
            <View style={{
              flexDirection: "row",
              marginHorizontal: 20,
              marginBottom:10
            }}>
              <FontAwesome5 name="exclamation-circle" size={15} color="red" style={{
                marginTop:2
              }}/>
              <Text style={{
                color: "red",
                fontSize: 15,
                marginHorizontal:5,
              }}>Enter a proper email ID</Text>
            </View>
          )}
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
        {!validatePassword(password) && password.length > 0 && (
            <View style={{
              flexDirection: "row"
            }}>
              <FontAwesome5 name="exclamation-circle" size={15} color="red" />
              <Text style={{
                color: "red",
                fontSize: 13
              }}>Password must be at least 7 characters long and include both uppercase and lowercase letters</Text>
            </View>
          )}
      </View>
      <View style={style.buttonContainer}>
        <Pressable style={style.registerButton} onPress={handleRegister}>
          {loading ? (
            <ActivityIndicator size="large" color="#ffffff" />
          ) : (
            <Text style={style.registerButtonText}>Register</Text>
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
          <Text style={style.googleButtonText}>Register with Google</Text>
        </Pressable>
      </View>
      {/* Login Section */}
      <View style={style.loginContainer}>
        <Text style={style.loginText}>Already have an account?</Text>
        <Pressable onPress={() => route.navigate('Auth/Login')}>
          <Text style={style.loginLink}> Login</Text>
        </Pressable>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    backgroundColor: '#FFF8E1',
    flex: 1,
    padding: 20,
  },
  HeadText: {
    fontSize: 35,
    textAlign: 'center',
    fontWeight: '500',
    fontStyle: "italic"
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 20,
    height: 50,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 12,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerButton: {
    backgroundColor: '#FF9800',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  registerButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
    color: '#333333',
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#DB4437',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  googleIcon: {
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginText: {
    fontSize: 16,
    color: '#333333',
  },
  loginLink: {
    fontSize: 16,
    color: '#FF9800',
    fontWeight: 'bold',
  },
});

export default Register;
