import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ArrowLeft, Send } from 'lucide-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-radius: 12px;
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f8fafc;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  color: #64748b;

  &:hover {
    background: #f1f5f9;
  }
`;

const Discussion = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 0;
`;

const Message = styled.div<{ isAgent?: boolean }>`
  margin-bottom: 24px;
  padding: 16px;
  background: ${props => props.isAgent ? '#f8fafc' : 'white'};
  border: 1px solid #e2e8f0;
  border-radius: 8px;
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Author = styled.div<{ isAgent?: boolean }>`
  font-weight: 500;
  color: ${props => props.isAgent ? '#10b981' : '#1e293b'};
`;

const Timestamp = styled.div`
  color: #64748b;
  font-size: 14px;
`;

const ReplyBox = styled.div`
  display: flex;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #10b981;
  }
`;

const SendButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: #059669;
  }
`;

interface Reply {
  id: string;
  content: string;
  author: string;
  isAgent: boolean;
  timestamp: string;
}

interface TopicDiscussionProps {
  topicId: string;
  tokenId: string;
  topic: {
    title: string;
    content: string;
    createdAt: string;
  };
  onBack: () => void;
}

export const TopicDiscussion: React.FC<TopicDiscussionProps> = ({
  topicId,
  tokenId,
  topic,
  onBack,
}) => {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState('');

  useEffect(() => {
    // Load replies from localStorage
    const storedReplies = localStorage.getItem(`forum_replies_${topicId}`);
    if (storedReplies) {
      setReplies(JSON.parse(storedReplies));
    } else {
      // Add initial agent response
      const initialReply: Reply = {
        id: Date.now().toString(),
        content: "Hello! I'm here to help answer any questions you have about this token. What would you like to know?",
        author: 'Token Agent',
        isAgent: true,
        timestamp: new Date().toISOString(),
      };
      setReplies([initialReply]);
      localStorage.setItem(`forum_replies_${topicId}`, JSON.stringify([initialReply]));
    }
  }, [topicId]);

  const handleSendReply = () => {
    if (!newReply.trim()) return;

    const userReply: Reply = {
      id: Date.now().toString(),
      content: newReply,
      author: 'You',
      isAgent: false,
      timestamp: new Date().toISOString(),
    };

    // Simulate agent response
    const agentReply: Reply = {
      id: (Date.now() + 1).toString(),
      content: "Thank you for your message! I'm processing your request and will provide a detailed response shortly.",
      author: 'Token Agent',
      isAgent: true,
      timestamp: new Date().toISOString(),
    };

    const updatedReplies = [...replies, userReply, agentReply];
    setReplies(updatedReplies);
    localStorage.setItem(`forum_replies_${topicId}`, JSON.stringify(updatedReplies));
    setNewReply('');
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={onBack}>
          <ArrowLeft size={18} />
          Back to Topics
        </BackButton>
        <div>
          <h2 style={{ margin: 0 }}>{topic.title}</h2>
          <div style={{ color: '#64748b', fontSize: '14px' }}>
            Created {new Date(topic.createdAt).toLocaleDateString()}
          </div>
        </div>
      </Header>

      <Message>
        <MessageHeader>
          <Author>Original Post</Author>
          <Timestamp>{new Date(topic.createdAt).toLocaleString()}</Timestamp>
        </MessageHeader>
        <div>{topic.content}</div>
      </Message>

      <Discussion>
        {replies.map((reply) => (
          <Message key={reply.id} isAgent={reply.isAgent}>
            <MessageHeader>
              <Author isAgent={reply.isAgent}>{reply.author}</Author>
              <Timestamp>{new Date(reply.timestamp).toLocaleString()}</Timestamp>
            </MessageHeader>
            <div>{reply.content}</div>
          </Message>
        ))}
      </Discussion>

      <ReplyBox>
        <Input
          placeholder="Write your reply..."
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
        />
        <SendButton onClick={handleSendReply}>
          <Send size={18} />
          Send
        </SendButton>
      </ReplyBox>
    </Container>
  );
};
