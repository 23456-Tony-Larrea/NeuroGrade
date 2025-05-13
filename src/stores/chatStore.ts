import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Chat {
  id: string;
  participants: string[];
  messages: Message[];
  lastMessage?: Message;
}

interface ChatState {
  chats: Chat[];
  activeChat: string | null;
  unreadCount: number;
  sendMessage: (senderId: string, receiverId: string, content: string) => void;
  setActiveChat: (chatId: string | null) => void;
  markChatAsRead: (chatId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [
    {
      id: '1',
      participants: ['teacher1', 'parent1'],
      messages: [
        {
          id: '1',
          senderId: 'teacher1',
          receiverId: 'parent1',
          content: 'Hola, quisiera discutir el progreso de su hijo',
          timestamp: new Date().toISOString(),
          read: false
        }
      ]
    }
  ],
  activeChat: null,
  unreadCount: 1,

  sendMessage: (senderId, receiverId, content) =>
    set((state) => {
      const message = {
        id: uuidv4(),
        senderId,
        receiverId,
        content,
        timestamp: new Date().toISOString(),
        read: false
      };

      const existingChat = state.chats.find(
        (chat) =>
          chat.participants.includes(senderId) && chat.participants.includes(receiverId)
      );

      if (existingChat) {
        return {
          chats: state.chats.map((chat) =>
            chat.id === existingChat.id
              ? {
                  ...chat,
                  messages: [...chat.messages, message],
                  lastMessage: message
                }
              : chat
          ),
          unreadCount: state.unreadCount + 1
        };
      }

      const newChat = {
        id: uuidv4(),
        participants: [senderId, receiverId],
        messages: [message],
        lastMessage: message
      };

      return {
        chats: [...state.chats, newChat],
        unreadCount: state.unreadCount + 1
      };
    }),

  setActiveChat: (chatId) =>
    set({
      activeChat: chatId
    }),

  markChatAsRead: (chatId) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: chat.messages.map((msg) => ({ ...msg, read: true }))
            }
          : chat
      ),
      unreadCount: Math.max(0, state.unreadCount - 1)
    }))
}));