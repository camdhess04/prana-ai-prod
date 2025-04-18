import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { Send } from 'lucide-react-native';
import { useAppTheme } from '../context/ThemeContext';

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading?: boolean;
  value: string;
  onChangeText: (text: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  isLoading = false,
  value,
  onChangeText,
}) => {
  const { theme } = useAppTheme();

  const handlePressSend = () => {
    if (value.trim() && !isLoading) {
      onSend(value.trim());
    }
  };

  return (
    <View style={[styles.inputContainer, { borderTopColor: theme.borderColor }]}>
      <TextInput
        style={[styles.input, { backgroundColor: theme.cardBackground, color: theme.text, borderColor: theme.borderColor }]}
        value={value}
        onChangeText={onChangeText}
        placeholder="Type your message..."
        placeholderTextColor={theme.secondaryText}
        multiline
        editable={!isLoading}
        selectionColor={theme.primary}
      />
      <TouchableOpacity
        style={[styles.sendButton, { backgroundColor: isLoading || !value.trim() ? theme.secondaryText : theme.primary }]}
        onPress={handlePressSend}
        disabled={isLoading || !value.trim()}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Send size={20} color="#FFFFFF" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingBottom: Platform.OS === 'ios' ? 25 : 8,
    minHeight: 60,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 10,
    maxHeight: 100,
    marginRight: 8,
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatInput; 