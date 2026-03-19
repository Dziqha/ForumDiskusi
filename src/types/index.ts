export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Thread {
  id: string;
  title: string;
  body: string;
  category: string;
  createdAt: string;
  ownerId: string;
  upVotesBy: string[];
  downVotesBy: string[];
  totalComments: number;
}

export interface ThreadComment {
  id: string;
  content: string;
  createdAt: string;
  owner: User;
  upVotesBy: string[];
  downVotesBy: string[];
}

export interface ThreadDetail extends Thread {
  owner: User;
  comments: ThreadComment[];
}

export interface LeaderboardItem {
  user: User;
  score: number;
}

export interface RootState {
  authUser: User | null;
  threads: Thread[];
  threadDetail: ThreadDetail | null;
  users: User[];
  leaderboards: LeaderboardItem[];
  isLoading: boolean;
}
