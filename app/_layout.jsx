import { Stack } from "expo-router";
import React,{useEffect} from "react";

export default function RootLayout() {
 
  return(
  <Stack>
      <Stack.Screen name="index" options={{
        headerShown:false
      }}/>
       <Stack.Screen name="Auth/Onbording" options={{
        headerShown:false
      }}/>
      <Stack.Screen name="Auth/Login" options={{
        headerShown:false
      }}/>
      <Stack.Screen name="Auth/Register" options={{
        headerShown:false
      }}/>
      <Stack.Screen name="Auth/forgot" options={{
        headerShown:false
      }}/>
      <Stack.Screen name="Auth/changepass" options={{
        headerShown:false
      }}/>
       <Stack.Screen name="Auth/otp" options={{
        headerShown:false
      }}/>
      <Stack.Screen name="(tabs)" options={{
        headerShown:false
      }}/>
      <Stack.Screen name="screens/recipe" options={{
        headerShown:false
      }}/>
      <Stack.Screen name="screens/cooking" options={{
        headerShown:false
      }}/>
    </Stack>
  );
}