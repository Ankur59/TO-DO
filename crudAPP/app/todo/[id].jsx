import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState,useEffect } from "react";


export default function EditScreen() {
  const { id } = useLocalSearchParams();
  return (
    <SafeAreaView>
      <View style={{ backgroundColor: "red", width: 100, height: 100 }}>
        <Text>{id}</Text>
      </View>
    </SafeAreaView>
  );
}
