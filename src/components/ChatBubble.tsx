import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import { ChatMessage } from '../types/chat';

interface ChatBubbleProps {
  message: ChatMessage;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const { theme } = useAppTheme();
  const isUser = message.sender === 'user';

  return (
    <View
      style={[
        styles.container,
        {
          alignSelf: isUser ? 'flex-end' : 'flex-start',
          backgroundColor: isUser ? theme.primary : theme.cardBackground,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: isUser ? theme.buttonPrimaryText : theme.text,
          },
        ]}
      >
        {message.text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginVertical: 4,
    marginHorizontal: 8,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
});

export default ChatBubble; 