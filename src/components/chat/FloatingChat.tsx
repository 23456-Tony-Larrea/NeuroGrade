import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { MessageCircle } from 'lucide-react';
import ChatWindow from './ChatWindow';

export default function FloatingChat() {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {showChat ? (
        <ChatWindow onClose={() => setShowChat(false)} isFloating />
      ) : (
        <Button
          icon={<MessageCircle className="h-6 w-6" />}
          rounded
          size="large"
          onClick={() => setShowChat(true)}
          tooltip="Chatear con Administración"
          tooltipOptions={{ position: 'left' }}
        />
      )}
    </div>
  );
}