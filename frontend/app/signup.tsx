import InputField from "@/components/InputField";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  Animated,
  Dimensions,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { api, handleApiError } from "@/api/axiosConfig";
import { Message } from "../../backend/common/messages";
import { AxiosError } from "axios";

const { width } = Dimensions.get("window");

const SEX_OPTIONS = ["MALE", "FEMALE", "OTHER"];
const BLOOD_TYPE_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const Doctor_CHECK = ["Yes", "No"];

interface DropdownProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  placeholder: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  value,
  options,
  onSelect,
  placeholder,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View className="mb-4">
      <Text className="text-gray-700 font-medium mb-2">
        {label} <Text className="text-red-500">*</Text>
      </Text>
      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 flex-row justify-between items-center"
      >
        <Text className={value ? "text-gray-800" : "text-gray-400"}>
          {value || placeholder}
        </Text>
        <Text className="text-gray-400">▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View className="bg-white rounded-xl mx-8 max-h-80 w-80">
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-semibold text-gray-800 text-center">
                Select {label}
              </Text>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="px-4 py-3 border-b border-gray-100"
                  onPress={() => {
                    onSelect(item);
                    setIsVisible(false);
                  }}
                >
                  <Text
                    className={`text-base ${
                      value === item
                        ? "text-indigo-600 font-medium"
                        : "text-gray-800"
                    }`}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              className="p-4 border-t border-gray-200"
              onPress={() => setIsVisible(false)}
            >
              <Text className="text-center text-gray-500">Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default function SignupScreen() {
  const [slideAnim] = useState(new Animated.Value(0));
  const [isLoading, setIsLoading] = useState(false);

  const [documentId, setDocumentId] = useState<string>("");

  const [fullName, setFullName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [photo, setPhoto] = useState<string>("");
  const [documentPhoto, setDocumentPhoto] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [sex, setSex] = useState<string>("");
  const [bloodType, setBloodType] = useState<string>("");
  const [doctor, setDoctor] = useState<string>("");

  const handleDocumentIdValidation = async () => {
    if (!documentId.trim()) {
      Alert.alert("Error", "Please enter your Document ID");
      return;
    }

    setIsLoading(true);

    try {
      console.log("trying");
      const response = await api.post("/users", { nidNo: documentId });
    } catch (error) {
      const message = handleApiError(error as Error);
      if (message.message === "NID_ALREADY_EXISTS") {
        setIsLoading(false);
        Alert.alert("User Already Exists");
        router.replace("/login");
      } else {
        setIsLoading(false);
        Animated.timing(slideAnim, {
          toValue: -width,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }

      setIsLoading(false);
    }

    setIsLoading(false);
  };

  const handleSignup = async () => {
    if (
      !fullName.trim() ||
      !address.trim() ||
      !dateOfBirth.trim() ||
      !password.trim() ||
      !confirmPassword.trim() ||
      !sex.trim() ||
      !bloodType.trim()
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (!photo || !documentPhoto) {
      Alert.alert("Error", "Please upload both your photo and document photo");
      return;
    }

    setIsLoading(true);
    console.log({
      nidNo: documentId,
      nidImg: documentPhoto,
      password: password,
      dob: dateOfBirth,
      sex: sex,
      name: fullName,
      bloodtype: bloodType,
      isDoctor: doctor ? true : false,
    });
    const data = {
      nidNo: documentId,
      nidImg: documentPhoto,
      password: password,
      dob: dateOfBirth,
      sex: sex,
      name: fullName,
      bloodtype: bloodType,
      isDoctor: doctor ? true : false,
    };
    try {
      const response = await api.post("/users", data);
      setIsLoading(false);
      router.replace("/login");
    } catch (error) {
      const message = handleApiError(error as Error);
      Alert.alert(message.message);
      setIsLoading(false);
    }
  };

  // setTimeout(() => {
  //   setIsLoading(false);
  //   Alert.alert("Success", "Account created successfully!");
  // }, 2000);

  const pickImage = async (type: "photo" | "document") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === "photo" ? [1, 1] : [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (type === "photo") {
        setPhoto(result.assets[0].uri);
      } else {
        setDocumentPhoto(result.assets[0].uri);
      }
    }
  };

  const goBackToStep1 = () => {
    // setCurrentStep(1);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-50 box-border">
      <KeyboardAvoidingView behavior="padding" className="flex-1">
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
                Join Sanduk
              </Text>
              <Text className="text-gray-500 text-center mt-2 text-base leading-6">
                Create your secure account{"\n"}
                to get started with document management.
              </Text>
            </View>

            <View className="relative overflow-hidden ">
              <Animated.View
                style={{
                  transform: [{ translateX: slideAnim }],
                  flexDirection: "row",
                  columnGap: 48,
                  width: width,
                }}
              >
                <View style={{ width: width - 48 }}>
                  <View className="bg-white w-full rounded-3xl p-6 shadow-lg">
                    <Text className="text-xl font-bold text-gray-800 text-center mb-6">
                      Verify Document ID
                    </Text>

                    <InputField
                      label="Document ID"
                      value={documentId}
                      onChangeText={setDocumentId}
                      placeholder="Enter your document ID"
                      secure={false}
                    />

                    <TouchableOpacity
                      onPress={handleDocumentIdValidation}
                      className={`py-4 rounded-xl mt-3 ${
                        isLoading ? "bg-gray-400" : "bg-indigo-500"
                      }`}
                      disabled={isLoading}
                    >
                      <Text className="text-center text-white text-lg font-bold">
                        {isLoading ? "Validating..." : "Verify ID"}
                      </Text>
                    </TouchableOpacity>

                    <View className="flex-row justify-center mt-5">
                      <TouchableOpacity>
                        <Link href="/login" className="text-blue-500 text-sm">
                          Already have an account? Sign In
                        </Link>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={{ width: width - 48 }}>
                  <View className="bg-white rounded-3xl p-6 shadow-lg">
                    <View className="flex-row items-center justify-between mb-6">
                      <TouchableOpacity onPress={goBackToStep1}>
                        <Text className="text-blue-500 text-sm">← Back</Text>
                      </TouchableOpacity>
                      <Text className="text-xl font-bold text-gray-800">
                        Complete Registration
                      </Text>
                      <View style={{ width: 40 }} />
                    </View>

                    <InputField
                      label="Full Name"
                      value={fullName}
                      onChangeText={setFullName}
                      placeholder="Enter your full name"
                      secure={false}
                    />

                    <InputField
                      label="Address"
                      value={address}
                      onChangeText={setAddress}
                      placeholder="Enter your address"
                      secure={false}
                    />

                    <InputField
                      label="Date of Birth"
                      value={dateOfBirth}
                      onChangeText={setDateOfBirth}
                      placeholder="YYYY-MM-DD"
                      secure={false}
                    />

                    <Dropdown
                      label="Sex"
                      value={sex}
                      options={SEX_OPTIONS}
                      onSelect={setSex}
                      placeholder="Select your sex"
                    />

                    <Dropdown
                      label="Blood Type"
                      value={bloodType}
                      options={BLOOD_TYPE_OPTIONS}
                      onSelect={setBloodType}
                      placeholder="Select your blood type"
                    />

                    <View className="mt-4">
                      <Text className="text-gray-700 font-medium mb-2">
                        Your Photo <Text className="text-red-500">*</Text>
                      </Text>
                      <TouchableOpacity
                        onPress={() => pickImage("photo")}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-4 items-center"
                      >
                        {photo ? (
                          <View className="items-center">
                            <Image
                              source={{ uri: photo }}
                              className="w-20 h-20 rounded-full mb-2"
                            />
                            <Text className="text-green-500 text-sm">
                              Photo Selected
                            </Text>
                          </View>
                        ) : (
                          <View className="items-center">
                            <Text className="text-gray-500 text-sm">
                              Tap to upload your photo
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    </View>

                    <View className="mt-4 mb-4">
                      <Text className="text-gray-700 font-medium mb-2">
                        Document Photo <Text className="text-red-500">*</Text>
                      </Text>
                      <TouchableOpacity
                        onPress={() => pickImage("document")}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-4 items-center"
                      >
                        {documentPhoto ? (
                          <View className="items-center">
                            <Image
                              source={{ uri: documentPhoto }}
                              className="w-20 h-16 rounded mb-2"
                            />
                            <Text className="text-green-500 text-sm">
                              Document Photo Selected
                            </Text>
                          </View>
                        ) : (
                          <View className="items-center">
                            <Text className="text-gray-500 text-sm">
                              Tap to upload document photo
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    </View>

                    <Dropdown
                      label="Are you a Doctor?"
                      value={doctor}
                      options={Doctor_CHECK}
                      onSelect={setDoctor}
                      placeholder="Are you a Doctor?"
                    />

                    <InputField
                      label="Password"
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Create a password"
                      secure={true}
                    />

                    <InputField
                      label="Confirm Password"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder="Confirm your password"
                      secure={true}
                    />

                    <TouchableOpacity
                      onPress={handleSignup}
                      className={`py-4 rounded-xl mt-3 ${
                        isLoading ? "bg-gray-400" : "bg-indigo-500"
                      }`}
                      disabled={isLoading}
                    >
                      <Text className="text-center text-white text-lg font-bold">
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
