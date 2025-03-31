import {
    View,
    Text,
    StyleSheet,
    Pressable,
    SafeAreaView,
    Alert,
    ActivityIndicator,
} from "react-native";
import OtpTextInput from "react-native-otp-textinput";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { addDoc, collection, setDoc,doc } from 'firebase/firestore';
import { app, db, storage } from "../config"


const OtpScreen = () => {
    const router = useRouter();
    const [count, setCount] = useState(60);
    const [Otp, setOtp] = useState("");
    const [backendOtp, setbackendOtp] = useState("");
    const route = useRoute();
    const { username, mail, password } = route.params;
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const timer = count > 0 && setInterval(() => setCount(count - 1), 1000);
        return () => clearInterval(timer);
    }, [count]);

    //backend
    const sendDataToBackend = async () => {
        try {
            const response = await axios.post('http://192.168.163.3:5000/send-otp', {
                mail: mail,
            });
            console.log('Response from backend:', response.data);
            setbackendOtp(response.data.message);
        } catch (error) {
            console.error('Error sending data:', error);
            Alert.alert("Server Error");
        }
    };
    //store user data in database Api call
    const Register=async ()=>{
        try{
            await setDoc(doc(db, 'users', mail), {
                username,
                mail,
                password,
              });
            Alert.alert("user Registerd successfully");
            router.navigate("Auth/Login");
        }
        catch(error){
            console.log("Network Error:",error);
            Alert.alert("Server Error");
        }
    };
    const getOtp = () => {
        if (count === 0) {
            console.log("OTP sent");
            Alert.alert("OTP has been sent!");
            sendDataToBackend();
            setCount(60);
        } else {
            Alert.alert("Please wait for the timer to reset.");
        }
    };

    const verifyOtp = async () => {
        if (Otp == backendOtp) {
            setLoading(true);
            Register();
            setLoading(false);
        }
        else {
            Alert.alert("Inavlid OTP", "enter the valid OTP");
        }
    };
    useEffect(() => {
        sendDataToBackend();
        console.log("otp sent");
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Verify Your Email</Text>
                <Text style={styles.subtitle}>A code has been sent to {mail}</Text>
            </View>
            <OtpTextInput
                inputCount={6}
                handleTextChange={text => setOtp(text)}
                textInputStyle={styles.otpBox}
                tintColor="#FF9800"
                offTintColor="#BDBDBD"
                containerStyle={styles.otpContainer}
            />
            <Text style={styles.timerText}>Resend code in {count}s</Text>
            <Text
                style={[styles.resendOtp, { color: count === 0 ? "#FF9800" : "#BDBDBD" }]}
                onPress={getOtp}
            >
                Resend Code
            </Text>
            <Pressable
                style={[
                    styles.verifyBtn,
                    { backgroundColor: Otp.length === 6 ? "#FF9800" : "#BDBDBD" },
                ]}
                onPress={verifyOtp}
                disabled={Otp.length !== 6}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                    <Text style={styles.verifyText}>Verify</Text>
                )}
            </Pressable>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF8E1",
        justifyContent: "center",
    },
    header: {
        marginBottom: 30,
        alignItems: "center",
    },
    title: {
        fontSize: 33,
        fontWeight: "bold",
        color: "#FF9800",
    },
    subtitle: {
        fontSize: 20,
        color: "#333333",
        marginTop: 10,
        textAlign: "center",
    },
    otpContainer: {
        marginVertical: 20,
        alignItems: "center",
    },
    otpBox: {
        height: 50,
        width: 50,
        borderWidth: 2,
        borderRadius: 8,
        textAlign: "center",
        fontSize: 18,
        color: "#333333",
        borderColor: "#FF9800",
    },
    timerText: {
        fontSize: 20,
        textAlign: "center",
        marginVertical: 10,
        color: "#555555",
    },
    resendOtp: {
        fontSize: 20,
        textAlign: "center",
        textDecorationLine: "underline",
        marginBottom: 20,
    },
    verifyBtn: {
        height: 50,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 40,
    },
    verifyText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default OtpScreen;
