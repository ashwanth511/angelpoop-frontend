import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send } from 'lucide-react';
import { chatWithAgent } from '../../services/aiAgent';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';

interface Message {
  id: string;
  content: string;
  isAgent: boolean;
  createdAt: string;
}

interface ForumProps {
  tokenId: string;
  tokenSymbol: string;
}

export const Forum: React.FC<ForumProps> = ({ tokenId, tokenSymbol }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Add initial agent greeting
    const initialMessage = {
      id: 'initial',
      content: `Hi! I'm your AI agent for ${tokenSymbol}. I can help you with:
1. Token analysis and statistics
2. Price trends and market data
3. Technical questions
4. Transaction history and holder information

How can I assist you today?`,
      isAgent: true,
      createdAt: new Date().toISOString()
    };
    setMessages([initialMessage]);
  }, [tokenSymbol]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      isAgent: false,
      createdAt: new Date().toISOString()
    };

    try {
      setIsLoading(true);
      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');

      // Get response from agent
      const response = await chatWithAgent(tokenId, userMessage.content);

      const agentMessage = {
        id: `agent-${Date.now()}`,
        content: response,
        isAgent: true,
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error('Error getting agent response:', error);
      toast({
        title: "Error",
        description: "Failed to get response from the AI agent. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-gray-900 rounded-lg p-4">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.isAgent ? 'bg-gray-800' : 'bg-gray-700'
            } p-4 rounded-lg`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              message.isAgent ? 'bg-blue-500' : 'bg-green-500'
            }`}>
              {message.isAgent ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div className="flex-1">
              <div className="font-medium text-white">
                {message.isAgent ? 'AI Agent' : 'You'}
              </div>
              <div className="mt-1 text-gray-300 whitespace-pre-wrap">
                {message.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div className="flex gap-2">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything about this token..."
          className="flex-1 bg-gray-800 text-white rounded-lg p-3 min-h-[50px] max-h-[150px] resize-none"
          disabled={isLoading}
        />
        <Button
          onClick={sendMessage}
          disabled={isLoading || !newMessage.trim()}
          className="bg-[#00FFA3] text-black hover:bg-[#00DD8C] px-4"
        >
          <Send size={20} />
        </Button>
      </div>
    </div>
  );
};