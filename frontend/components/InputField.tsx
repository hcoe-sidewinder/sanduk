import { Text, TextInput, View } from "react-native";

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secure = false,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secure: boolean;
}) => {
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
export default InputField;
