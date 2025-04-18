import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import { ChatMessage } from '../types/chat';
import ChatBubble from './ChatBubble';

interface ChatMessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages, isLoading }) => {
  const { theme } = useAppTheme();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: false });
  }, [messages]);

  return (
    <FlatList
      ref={flatListRef}
      style={styles.messageList}
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ChatBubble message={item} />}
      contentContainerStyle={styles.contentContainer}
      onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
      ListFooterComponent={
        isLoading ? <ActivityIndicator style={styles.loader} color={theme.primary} /> : null
      }
    />
  );
};

const styles = StyleSheet.create({
  messageList: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 10,
  },
  loader: {
    margin: 10,
  },
});

export default ChatMessageList; 