import React, { useState } from 'react';
import styled from 'styled-components';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-radius: 12px;
`;

const ChatHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #eee;
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const MessageInput = styled.div`
  padding: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  gap: 0.5rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  
  &:focus {
    outline: none;
    border-color: #10b981;
  }
`;

const SendButton = styled.button`
  padding: 0.5rem 1rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  
  &:hover {
    background: #059669;
  }
`;

const Message = styled.div<{ $isOwn?: boolean }>`
  margin: 0.5rem 0;
  padding: 0.5rem 1rem;
  background: ${props => props.$isOwn ? '#10b981' : '#f3f4f6'};
  color: ${props => props.$isOwn ? 'white' : 'black'};
  border-radius: 12px;
  max-width: 80%;
  align-self: ${props => props.$isOwn ? 'flex-end' : 'flex-start'};
`;

export const ChatBox = () => {
  const [messages, setMessages] = useState<Array<{ text: string; isOwn: boolean }>>([]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    setMessages([...messages, { text: inputText, isOwn: true }]);
    setInputText('');
    
    // Simulate response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "Thanks for your message! I'll get back to you soon.", 
        isOwn: false 
      }]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <h3>Live Chat</h3>
      </ChatHeader>
      
      <ChatMessages>
        {messages.map((msg, idx) => (
          <Message key={idx} $isOwn={msg.isOwn}>
            {msg.text}
          </Message>
        ))}
      </ChatMessages>
      
      <MessageInput>
        <Input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
        />
        <SendButton onClick={handleSend}>Send</SendButton>
      </MessageInput>
    </ChatContainer>
  );
};

export default ChatBox;
