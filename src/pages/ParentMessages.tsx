import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { useTheme } from '../context/ThemeContext';
import { Send, Search } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  read: boolean;
}

interface Teacher {
  id: string;
  name: string;
  subject: string;
  avatar: string;
  lastMessage?: string;
  unreadCount?: number;
}

const mockTeachers: Teacher[] = [
  {
    id: '1',
    name: 'Prof. García',
    subject: 'Matemáticas',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
    lastMessage: '¿Podemos agendar una reunión?',
    unreadCount: 2
  },
  {
    id: '2',
    name: 'Prof. Rodríguez',
    subject: 'Física',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop&q=60',
    lastMessage: 'El proyecto final se entrega el viernes',
    unreadCount: 0
  },
  {
    id: '3',
    name: 'Prof. López',
    subject: 'Química',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60',
    lastMessage: 'Gracias por la información',
    unreadCount: 1
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    text: '¿Podemos agendar una reunión para discutir el progreso de Carlos?',
    timestamp: new Date('2024-03-15T10:30:00'),
    read: false
  },
  {
    id: '2',
    senderId: 'parent',
    text: 'Claro, ¿qué horario le conviene?',
    timestamp: new Date('2024-03-15T10:35:00'),
    read: true
  },
  {
    id: '3',
    senderId: '1',
    text: '¿Le parece el jueves a las 15:00?',
    timestamp: new Date('2024-03-15T10:40:00'),
    read: false
  }
];

export default function ParentMessages() {
  const { darkMode } = useTheme();
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(mockTeachers[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTeacher) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'parent',
      text: newMessage.trim(),
      timestamp: new Date(),
      read: true
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const filteredTeachers = mockTeachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`p-4 ${bgColor} min-h-screen`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={`${cardBg} md:col-span-1`}>
          <div className="mb-4">
            <span className="p-input-icon-left w-full">
              <Search className="h-4 w-4" />
              <InputText
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar profesor..."
                className="w-full"
              />
            </span>
          </div>
          <div className="space-y-2">
            {filteredTeachers.map(teacher => (
              <div
                key={teacher.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedTeacher?.id === teacher.id
                    ? 'bg-blue-100 dark:bg-blue-900'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setSelectedTeacher(teacher)}
              >
                <div className="flex items-center gap-3">
                  <Avatar image={teacher.avatar} size="large" shape="circle" />
                  <div className="flex-1">
                    <h3 className="font-medium">{teacher.name}</h3>
                    <p className="text-sm text-gray-500">{teacher.subject}</p>
                    {teacher.lastMessage && (
                      <p className="text-sm text-gray-600 truncate">{teacher.lastMessage}</p>
                    )}
                  </div>
                  {teacher.unreadCount > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      {teacher.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className={`${cardBg} md:col-span-2`}>
          {selectedTeacher ? (
            <>
              <div className={`flex items-center gap-3 pb-4 border-b ${borderColor}`}>
                <Avatar image={selectedTeacher.avatar} size="large" shape="circle" />
                <div>
                  <h2 className="text-lg font-semibold">{selectedTeacher.name}</h2>
                  <p className="text-sm text-gray-500">{selectedTeacher.subject}</p>
                </div>
              </div>

              <div className="h-[400px] overflow-y-auto py-4 space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'parent' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.senderId === 'parent'
                          ? 'bg-blue-500 text-white'
                          : darkMode
                          ? 'bg-gray-700 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <span className="text-xs mt-1 block opacity-75">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                <InputText
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribir mensaje..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                  icon={<Send className="h-4 w-4" />}
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Seleccione un profesor para comenzar una conversación
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}