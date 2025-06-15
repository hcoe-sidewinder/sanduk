import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { StaticChatbot } from "../utils/chatbot";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [bot, setBot] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      const chatbot = new StaticChatbot();
      await chatbot.initialize();
      setBot(chatbot);
      setIsReady(true);
    };
    init();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !bot) return;

    setMessages((prev) => [...prev, { text: input, user: true }]);
    setInput("");

    const response = await bot.findAnswer(input);
    setMessages((prev) => [...prev, { text: response, user: false }]);
  };

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <View style={{ flex: 1 }}>
        {messages.map((msg, i) => (
          <Text
            key={i}
            style={{
              alignSelf: msg.user ? "flex-end" : "flex-start",
              backgroundColor: msg.user ? "#DCF8C6" : "#ECECEC",
              padding: 10,
              borderRadius: 10,
              marginVertical: 5,
              maxWidth: "80%",
            }}
          >
            {msg.text}
          </Text>
        ))}
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 20,
            padding: 10,
          }}
          value={input}
          onChangeText={setInput}
          placeholder="Type your question..."
        />
        <Button title="Send" onPress={handleSend} disabled={!isReady} />
      </View>

      {!isReady && <Text>Loading chatbot knowledge...</Text>}
    </View>
  );
}
