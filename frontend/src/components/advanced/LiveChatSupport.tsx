import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  isAdmin: boolean;
}

interface ChatSupport {
  isOpen: boolean;
  messages: ChatMessage[];
  unreadCount: number;
}

export const LiveChatSupport: React.FC = () => {
  const [chatState, setChatState] = useState<ChatSupport>({
    isOpen: false,
    messages: [],
    unreadCount: 0
  });
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Simulate real-time chat with WebSocket (you can replace with actual Socket.io)
  useEffect(() => {
    // Simulate incoming messages
    const interval = setInterval(() => {
      if (Math.random() > 0.8 && chatState.isOpen) {
        const adminMessage: ChatMessage = {
          id: Date.now().toString(),
          sender: 'Support Agent',
          message: 'How can I help you today?',
          timestamp: new Date(),
          isAdmin: true
        };
        setChatState(prev => ({
          ...prev,
          messages: [...prev.messages, adminMessage]
        }));
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [chatState.isOpen]);

  const toggleChat = () => {
    setChatState(prev => ({
      ...prev,
      isOpen: !prev.isOpen,
      unreadCount: prev.isOpen ? prev.unreadCount : 0
    }));
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'You',
      message: newMessage,
      timestamp: new Date(),
      isAdmin: false
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage]
    }));

    setNewMessage('');
    setIsTyping(true);

    // Send to backend (simulate API call)
    try {
      await fetch('/api/support/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message: newMessage,
          timestamp: new Date()
        })
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }

    // Simulate admin response
    setTimeout(() => {
      setIsTyping(false);
      const adminResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'Support Agent',
        message: 'Thank you for your message. Let me help you with that.',
        timestamp: new Date(),
        isAdmin: true
      };
      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, adminResponse]
      }));
    }, 2000);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleChat}
          className="bg-blue-500 hover:bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center shadow-lg relative"
        >
          <span className="text-2xl">💬</span>
          {chatState.unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {chatState.unreadCount}
            </span>
          )}
        </Button>
      </div>

      {/* Chat Window */}
      {chatState.isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border z-50 flex flex-col">
          {/* Chat Header */}
          <div className="bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Live Support</h3>
              <p className="text-sm opacity-90">We're here to help!</p>
            </div>
            <Button
              onClick={toggleChat}
              className="bg-transparent hover:bg-blue-600 text-white p-1"
            >
              ✕
            </Button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {chatState.messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>👋 Hello! How can we help you today?</p>
              </div>
            ) : (
              chatState.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isAdmin ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      message.isAdmin
                        ? 'bg-gray-200 text-gray-800'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 p-3 rounded-lg">
                  <p className="text-sm">Support agent is typing...</p>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
                onKeyPress={(e: React.KeyboardEvent) => {
                  if (e.key === 'Enter') sendMessage();
                }}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-blue-500 hover:bg-blue-600 px-4"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveChatSupport;
