import React, { useState, useRef,useEffect } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList ,StatusBar} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function Chat() {
  const flatListRef = useRef(null);
  const router = useRouter();
  const [messages, setMessages] = useState([
    { id: "1", text: "Hello! Ask me anything about recipes 🍽️", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { id: Date.now().toString(), text: input, sender: "user" };
    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post("http://192.168.163.3:5000/generate", { input });
      const botMessage = { id: Date.now().toString(), text: response.data.response, sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching bot response:", error);
    }

    setInput("");
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.sender === "user" ? styles.userMessage : styles.botMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);
  return (
    <>
    <StatusBar barStyle="light-content" backgroundColor="black" />
    <View style={styles.container}>
      <View style={styles.header}>
        <AntDesign name="arrowleft" size={40} color="white" style={{
          marginHorizontal: 10,
          marginVertical: 5
        }} onPress={() => router.navigate("/(tabs)/Home")} />
        <Text style={styles.headerText}>TadkaAI Chat</Text>
        <LottieView
          source={require('../../assets/chef.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatArea}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask about recipes..."
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View></>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E1",
  },
  header: {
    backgroundColor: "#FF9800",
    height: 80,
    paddingTop: 17,
    borderBottomEndRadius: 25,
    borderBottomStartRadius: 25,
    flexDirection: "row",
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginVertical: 5,
    marginHorizontal: 10
  },
  chatArea: {
    flexGrow: 1,
    padding: 10,
  },
  messageContainer: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 15,
    marginVertical: 5,
  },
  userMessage: {
    backgroundColor: "#8df29d",
    alignSelf: "flex-end",
  },
  botMessage: {
    backgroundColor: "#E0E0E0",
    alignSelf: "flex-start",
  },
  messageText: {
    color: "black",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    backgroundColor: "#F5F5F5",
  },
  lottie: {
    width: 100,
    height: 100,
    position: "relative",
    bottom: 30,
    left: 10
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#FF9800",
    borderRadius: 25,
    padding: 10,
  },
});
