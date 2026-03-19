import {
  LeaderboardItem,
  Thread,
  ThreadDetail,
  User,
  ThreadComment,
} from '@/src/types';
import { normalizeUser } from './utils';

const API_BASE = 'https://forum-api.dicoding.dev/v1';

export const api = {
  async register(name: string, email: string, password: string): Promise<User> {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();
    if (data.status !== 'success') throw new Error(data.message);
    return data.data.user;
  },

  async login(email: string, password: string): Promise<string> {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.status !== 'success') throw new Error(data.message);
    return data.data.token;
  },

  async getOwnProfile(token: string): Promise<User> {
    const response = await fetch(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (data.status !== 'success') throw new Error(data.message);
    return data.data.user;
  },

  async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE}/users`);
    const data = await response.json();
    if (data.status !== 'success') throw new Error(data.message);
    return data.data.users;
  },

  async getThreads(): Promise<Thread[]> {
    const response = await fetch(`${API_BASE}/threads`);
    const data = await response.json();
    if (data.status !== 'success') throw new Error(data.message);
    return data.data.threads;
  },

  async getThreadDetail(id: string): Promise<ThreadDetail> {
    const response = await fetch(`${API_BASE}/threads/${id}`);
    const data = await response.json();
    if (data.status !== 'success') throw new Error(data.message);
    return data.data.detailThread;
  },

  async createThread(
    title: string,
    body: string,
    category: string,
    token: string
  ): Promise<Thread> {
    const response = await fetch(`${API_BASE}/threads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, body, category }),
    });
    const data = await response.json();
    if (data.status !== 'success') throw new Error(data.message);
    return data.data.thread;
  },

  async createComment(
    threadId: string,
    content: string,
    token: string
  ): Promise<ThreadComment> {
    const response = await fetch(`${API_BASE}/threads/${threadId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    const data = await response.json();
    if (data.status !== 'success') throw new Error(data.message);
    return data.data.comment;
  },

  async upVoteThread(threadId: string, token: string) {
    const response = await fetch(`${API_BASE}/threads/${threadId}/up-vote`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (data.status !== 'success') throw new Error(data.message);
    return data.data.vote;
  },

  async downVoteThread(threadId: string, token: string) {
    const response = await fetch(`${API_BASE}/threads/${threadId}/down-vote`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (data.status !== 'success') throw new Error(data.message);
    return data.data.vote;
  },

  async neutralVoteThread(threadId: string, token: string) {
    const response = await fetch(
      `${API_BASE}/threads/${threadId}/neutral-vote`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    if (data.status !== 'success') throw new Error(data.message);
    return data.data.vote;
  },

  async upVoteComment(threadId: string, commentId: string, token: string) {
    const response = await fetch(
      `${API_BASE}/threads/${threadId}/comments/${commentId}/up-vote`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    if (data.status !== 'success') throw new Error(data.message);
    return data.data.vote;
  },

  async downVoteComment(threadId: string, commentId: string, token: string) {
    const response = await fetch(
      `${API_BASE}/threads/${threadId}/comments/${commentId}/down-vote`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    if (data.status !== 'success') throw new Error(data.message);
    return data.data.vote;
  },

  async neutralVoteComment(threadId: string, commentId: string, token: string) {
    const response = await fetch(
      `${API_BASE}/threads/${threadId}/comments/${commentId}/neutral-vote`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    if (data.status !== 'success') throw new Error(data.message);
    return data.data.vote;
  },

  async getLeaderboards(): Promise<LeaderboardItem[]> {
    const response = await fetch(`${API_BASE}/leaderboards`);
    const data = await response.json();

    if (data.status !== 'success') {
      throw new Error(data.message);
    }

    return data.data.leaderboards.map((item: LeaderboardItem) => ({
      ...item,
      user: normalizeUser(item.user),
    }));
  },
};
