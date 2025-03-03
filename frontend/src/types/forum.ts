export interface ForumPost {
  id: string;
  tokenId: string;
  title: string;
  content: string;
  authorAddress: string;
  createdAt: Date;
  updatedAt: Date;
  replies: ForumReply[];
  tags: string[];
  upvotes: number;
  downvotes: number;
}

export interface ForumReply {
  id: string;
  postId: string;
  content: string;
  authorAddress: string;
  createdAt: Date;
  updatedAt: Date;
  isAgentResponse: boolean;
  upvotes: number;
  downvotes: number;
}

export interface TokenForum {
  tokenId: string;
  posts: ForumPost[];
  pinnedPosts: string[]; // Array of post IDs
  lastActivity: Date;
}
