import React, { useState, useRef, useEffect } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Send, X } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useTheme } from '../../context/ThemeContext';
import { useAuthStore } from '../../stores/authStore';
import { useChatStore } from '../../stores/chatStore';

interface ChatWindowProps {
  onClose?: () => void;
  isFloating?: boolean;
}

export default function ChatWindow({ onClose, isFloating = false }: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const { darkMode } = useTheme();
  const { user } = useAuthStore();
  const { chats, activeChat, sendMessage } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentChat = chats.find((chat) => chat.id === activeChat);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !user) return;

    const receiverId = isFloating ? 'admin' : currentChat?.participants.find((p) => p !== user.id);
    
    if (receiverId) {
      sendMessage(user.id, receiverId, message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className={`flex flex-col ${
        isFloating ? 'w-96 h-[500px] rounded-lg shadow-xl' : 'w-full h-full'
      } ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between p-4 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {isFloating ? 'Chat con Administración' : 'Chat'}
        </h3>
        {onClose && (
          <Button
            icon={<X className="h-4 w-4" />}
            rounded
            text
            severity="secondary"
            onClick={onClose}
          />
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {(isFloating ? [] : currentChat?.messages || []).map((msg) => {
          const isSender = msg.senderId === user?.id;
          return (
            <div
              key={msg.id}
              className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  isSender
                    ? 'bg-blue-500 text-white'
                    : darkMode
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <span
                  className={`text-xs mt-1 block ${
                    isSender ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {format(new Date(msg.timestamp), 'HH:mm', { locale: es })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <InputTextarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={2}
            autoResize
            className="flex-1"
            placeholder="Escribe un mensaje..."
          />
          <Button
            icon={<Send className="h-4 w-4" />}
            onClick={handleSendMessage}
            disabled={!message.trim()}
          />
        </div>
      </div>
    </div>
  );
}