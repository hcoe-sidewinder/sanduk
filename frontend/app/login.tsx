import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const InputField = ({ label, value, onChangeText, placeholder, secure = false }:{label: string, value: string, onChangeText: (text:string)=> void, placeholder:string, secure: boolean}) => {
  return (
    <View className="mb-5">
      <Text className="mb-2 font-semibold text-gray-700 text-base">
        {label} <Text className="text-red-500">*</Text>
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        secureTextEntry={secure}
        className="border-2 border-gray-200 rounded-xl bg-gray-50 p-4 text-base text-gray-900 min-h-[50px]"
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
};

export default function LoginScreen() {
  const [documentId, setDocumentId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!documentId.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in both Document ID and Password");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Success", "Login successful!");
    }, 2000);
  };

  const handleDocumentIdChange = (text:string) => {
    setDocumentId(text);
  };

  const handlePasswordChange = (text:string) => {
    setPassword(text);
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-50">
      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingVertical: 20 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        <View className="flex-1 justify-center px-6">
          <View className="items-center mb-10">
            <Image
              source={require("../assets/images/login_image.png")}
              className="w-[250px] h-[125px]"
            />
            <Text className="text-3xl font-bold text-gray-800 mt-5 text-center">
              Welcome to Sanduk
            </Text>
            <Text className="text-gray-500 text-center mt-2 text-base leading-6">
              Secure document management made simple.{"\n"}
              Please sign in to continue.
            </Text>
          </View>

          <View className="bg-white rounded-3xl p-6 shadow-lg">
            <Text className="text-xl font-bold text-gray-800 text-center mb-6">
              Sign In
            </Text>

            <InputField
              label="Document ID"
              value={documentId}
              onChangeText={handleDocumentIdChange}
              placeholder="Enter your document ID"
              secure={false}
            />

            <InputField
              label="Password"
              value={password}
              onChangeText={handlePasswordChange}
              placeholder="Enter your password"
              secure={true}
            />

            <TouchableOpacity
              onPress={handleLogin}
              className={`py-4 rounded-xl mt-3 ${
                isLoading ? "bg-gray-400" : "bg-indigo-500"
              }`}
              disabled={isLoading}
            >
              <Text className="text-center text-white text-lg font-bold">
                {isLoading ? "Signing In..." : "Sign In"}
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-between mt-5">
              <TouchableOpacity>
                <Text className="text-blue-500 text-sm">Forgot Password?</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text className="text-gray-500 text-sm">Need to Signup?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
