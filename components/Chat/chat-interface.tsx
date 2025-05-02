'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, X, Phone, Map, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';

// Simulated socket.io implementation since we can't actually connect to a server
const mockSocketConnect = () => {
  // In a real implementation, this would be:
  // return io('your-server-url');
  
  // Mock events and listeners
  const listeners: Record<string, Function[]> = {};
  
  return {
    on: (event: string, callback: Function) => {
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event].push(callback);
    },
    emit: (event: string, ...args: any[]) => {
      // Mock receiving driver responses
      if (event === 'send_message') {
        const message = args[0];
        
        // Simulate driver response after a delay
        setTimeout(() => {
          const driverResponses = [
            "I'm on my way!",
            "I'll be there in about 5 minutes.",
            "I can see you, I'm in the blue sedan.",
            "Is there a specific spot where you'd like me to pick you up?",
            "Traffic is a bit heavy, but I'm making progress.",
            "I've arrived at the location. Where exactly are you?"
          ];
          
          const randomResponse = driverResponses[Math.floor(Math.random() * driverResponses.length)];
          
          listeners['receive_message']?.forEach(callback => {
            callback({
              id: Date.now().toString(),
              sender: 'driver',
              text: randomResponse,
              timestamp: new Date().toISOString()
            });
          });
        }, 1500 + Math.random() * 2000); // Random delay between 1.5-3.5 seconds
      }
    },
    disconnect: () => {
      // In a real implementation, this would close the socket connection
    }
  };
};

interface Message {
  id: string;
  sender: 'user' | 'driver';
  text: string;
  timestamp: string;
}

interface ChatInterfaceProps {
  driverName: string;
  driverImage?: string;
  rideId: string;
}

export default function ChatInterface({
  driverName,
  driverImage,
  rideId
}: ChatInterfaceProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'driver',
      text: `Hello! I'll be your driver today. I'm on my way to pick you up.`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [messageInput, setMessageInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);
  
  useEffect(() => {
    // Initialize socket connection
    socketRef.current = mockSocketConnect();
    
    // Listen for incoming messages
    socketRef.current.on('receive_message', (message: Message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });
    
    // Cleanup on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, []);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageInput.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: messageInput,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setMessageInput('');
    
    // Send message to server (mocked)
    socketRef.current.emit('send_message', newMessage);
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const quickReplies = [
    "I'm waiting at the pickup point",
    "How far away are you?",
    "I'll be a few minutes late",
    "I'm wearing a red jacket"
  ];
  
  return (
    <>
      {/* Floating chat button */}
      <div 
        className={`fixed bottom-20 right-4 z-30 ${isChatOpen ? 'hidden' : 'flex'}`}
        onClick={() => setIsChatOpen(true)}
      >
        <button className="bg-yellow-500 text-white p-3 rounded-full shadow-lg flex items-center justify-center">
          <span className="bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full absolute -top-1 -right-1">
            {messages.filter(m => m.sender === 'driver').length}
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </div>
      
      {/* Chat window */}
      <div className={`fixed inset-0 z-50 ${isChatOpen ? 'flex' : 'hidden'} md:items-end md:justify-end md:p-4`}>
        <div className="bg-white w-full md:w-96 md:h-[500px] flex flex-col shadow-xl rounded-t-lg md:rounded-lg overflow-hidden">
          {/* Chat header */}
          <div className="bg-yellow-500 text-white p-3 flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative h-10 w-10 mr-3">
                {driverImage ? (
                  <Image 
                    src={driverImage} 
                    alt={driverName} 
                    width={40} 
                    height={40} 
                    className="rounded-full" 
                  />
                ) : (
                  <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {driverName.charAt(0)}
                    </span>
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-yellow-500"></span>
              </div>
              <div>
                <p className="font-semibold">{driverName}</p>
                <p className="text-xs text-yellow-100">Your driver</p>
              </div>
            </div>
            <div className="flex items-center">
              <button className="text-white p-1 mr-1 rounded-full hover:bg-yellow-600" title="Call driver">
                <Phone size={20} />
              </button>
              <button className="text-white p-1 mr-1 rounded-full hover:bg-yellow-600" title="View on map">
                <Map size={20} />
              </button>
              <button 
                className="text-white p-1 rounded-full hover:bg-yellow-600"
                onClick={() => setIsChatOpen(false)}
                title="Minimize chat"
              >
                <ChevronDown size={20} />
              </button>
            </div>
          </div>
          
          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-white text-gray-800 border'
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-yellow-100' : 'text-gray-500'}`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Quick replies */}
          <div className="px-3 py-2 border-t flex overflow-x-auto space-x-2">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm whitespace-nowrap hover:bg-gray-200"
                onClick={() => {
                  setMessageInput(reply);
                }}
              >
                {reply}
              </button>
            ))}
          </div>
          
          {/* Message input */}
          <form onSubmit={handleSendMessage} className="border-t p-3 flex items-center">
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-yellow-500"
              title="Attach file"
            >
              <Paperclip size={20} />
            </button>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-1 focus:ring-yellow-500"
            />
            <button
              type="submit"
              className="ml-2 p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
              disabled={!messageInput.trim()}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
} 