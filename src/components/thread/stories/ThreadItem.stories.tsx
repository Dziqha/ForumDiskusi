/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from '@storybook/react';
import ThreadItem from '../ThreadItem';
import { Thread, User } from '@/src/types';

/**
 * ThreadItem Component Stories
 *
 * Stories ini menunjukkan berbagai state dan variasi dari ThreadItem component.
 *
 * ## Features
 * - Thread information display
 * - Vote buttons (upvote/downvote)
 * - Comment count
 * - Category badge
 * - Owner information
 * - Clickable thread title
 */

const mockOwner: User = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar:
    'https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff',
};

const mockAuthUser: User = {
  id: 'user-2',
  name: 'Current User',
  email: 'current@example.com',
  avatar:
    'https://ui-avatars.com/api/?name=Current+User&background=F97316&color=fff',
};

const mockThread: Thread = {
  id: 'thread-1',
  title: 'Bagaimana Cara Menggunakan React Hooks dengan Redux?',
  body: '<p>Saya masih bingung bagaimana cara mengintegrasikan React Hooks dengan Redux. Apakah ada best practice yang bisa dibagikan?</p>',
  category: 'react',
  createdAt: '2024-01-15T10:30:00.000Z',
  ownerId: 'user-1',
  upVotesBy: ['user-3', 'user-4'],
  downVotesBy: ['user-5'],
  totalComments: 12,
};

const meta = {
  title: 'Components/Thread/ThreadItem',
  component: ThreadItem,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'ThreadItem component menampilkan preview thread di list. Includes voting, category, dan comment count.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-3xl mx-auto py-8 bg-gray-50 min-h-screen">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    thread: {
      description: 'Thread object berisi informasi thread',
    },
    owner: {
      description: 'User object untuk pemilik thread',
    },
    authUser: {
      description: 'Currently authenticated user (null jika belum login)',
    },
    onThreadClick: {
      action: 'thread clicked',
      description: 'Callback saat title thread diklik',
    },
    onUpVote: {
      action: 'upvoted',
      description: 'Callback saat upvote button diklik',
    },
    onDownVote: {
      action: 'downvoted',
      description: 'Callback saat downvote button diklik',
    },
  },
} satisfies Meta<typeof ThreadItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state dari ThreadItem.
 * Thread dengan beberapa votes dan comments.
 */
export const Default: Story = {
  args: {
    thread: mockThread,
    owner: mockOwner,
    authUser: mockAuthUser,
    onThreadClick: (threadId: any) => console.log('Clicked thread:', threadId),
    onUpVote: (threadId: any) => console.log('Upvoted:', threadId),
    onDownVote: (threadId: any) => console.log('Downvoted:', threadId),
  },
};

/**
 * Thread yang sudah di-upvote oleh user saat ini.
 * Menunjukkan active state pada upvote button.
 */
export const Upvoted: Story = {
  args: {
    thread: {
      ...mockThread,
      upVotesBy: ['user-2', 'user-3', 'user-4'], // user-2 adalah current user
      downVotesBy: [],
    },
    owner: mockOwner,
    authUser: mockAuthUser,
    onThreadClick: (threadId: any) => console.log('Clicked thread:', threadId),
    onUpVote: (threadId: any) => console.log('Upvoted:', threadId),
    onDownVote: (threadId: any) => console.log('Downvoted:', threadId),
  },
};

/**
 * Thread yang sudah di-downvote oleh user saat ini.
 * Menunjukkan active state pada downvote button.
 */
export const Downvoted: Story = {
  args: {
    thread: {
      ...mockThread,
      upVotesBy: [],
      downVotesBy: ['user-2', 'user-5'], // user-2 adalah current user
    },
    owner: mockOwner,
    authUser: mockAuthUser,
    onThreadClick: (threadId: any) => console.log('Clicked thread:', threadId),
    onUpVote: (threadId: any) => console.log('Upvoted:', threadId),
    onDownVote: (threadId: any) => console.log('Downvoted:', threadId),
  },
};

/**
 * Thread populer dengan banyak votes dan comments.
 * Menunjukkan thread yang sedang trending.
 */
export const Popular: Story = {
  args: {
    thread: {
      ...mockThread,
      title: 'Tutorial Lengkap Next.js 14 App Router - From Zero to Hero',
      upVotesBy: Array.from({ length: 45 }, (_, i) => `user-${i}`),
      downVotesBy: Array.from({ length: 3 }, (_, i) => `user-down-${i}`),
      totalComments: 87,
    },
    owner: mockOwner,
    authUser: mockAuthUser,
    onThreadClick: (threadId: any) => console.log('Clicked thread:', threadId),
    onUpVote: (threadId: any) => console.log('Upvoted:', threadId),
    onDownVote: (threadId: any) => console.log('Downvoted:', threadId),
  },
};

/**
 * Thread baru tanpa votes dan comments.
 * Menunjukkan thread yang baru saja dibuat.
 */
export const NewThread: Story = {
  args: {
    thread: {
      ...mockThread,
      title: 'Apakah Vitest Lebih Baik dari Jest?',
      body: '<p>Saya sedang mempertimbangkan untuk migrasi dari Jest ke Vitest. Ada yang punya pengalaman?</p>',
      upVotesBy: [],
      downVotesBy: [],
      totalComments: 0,
      createdAt: new Date().toISOString(),
    },
    owner: mockOwner,
    authUser: mockAuthUser,
    onThreadClick: (threadId: any) => console.log('Clicked thread:', threadId),
    onUpVote: (threadId: any) => console.log('Upvoted:', threadId),
    onDownVote: (threadId: any) => console.log('Downvoted:', threadId),
  },
};

/**
 * Thread saat user belum login.
 * Voting akan trigger alert untuk login.
 */
export const NotLoggedIn: Story = {
  args: {
    thread: mockThread,
    owner: mockOwner,
    authUser: null, // User tidak login
    onThreadClick: (threadId: any) => console.log('Clicked thread:', threadId),
    onUpVote: (threadId: any) => console.log('Upvoted:', threadId),
    onDownVote: (threadId: any) => console.log('Downvoted:', threadId),
  },
};

/**
 * Thread dengan body yang panjang.
 * Menunjukkan truncation/ellipsis pada preview.
 */
export const LongContent: Story = {
  args: {
    thread: {
      ...mockThread,
      title: 'Panduan Lengkap Testing di React: Unit, Integration, dan E2E',
      body: '<p>Testing adalah aspek penting dalam pengembangan aplikasi. Dalam artikel ini, saya akan membahas secara detail tentang berbagai jenis testing yang bisa dilakukan di React, mulai dari unit testing dengan Vitest, integration testing untuk Redux thunks, component testing dengan React Testing Library, hingga end-to-end testing menggunakan Playwright. Setiap jenis testing memiliki peran dan kegunaan yang berbeda dalam memastikan kualitas aplikasi kita.</p>',
    },
    owner: mockOwner,
    authUser: mockAuthUser,
    onThreadClick: (threadId: any) => console.log('Clicked thread:', threadId),
    onUpVote: (threadId: any) => console.log('Upvoted:', threadId),
    onDownVote: (threadId: any) => console.log('Downvoted:', threadId),
  },
};

/**
 * Thread dengan kategori berbeda.
 * Menunjukkan variasi category badge.
 */
export const DifferentCategory: Story = {
  args: {
    thread: {
      ...mockThread,
      title: 'Tips Optimasi Performance Next.js',
      category: 'performance',
    },
    owner: mockOwner,
    authUser: mockAuthUser,
    onThreadClick: (threadId: any) => console.log('Clicked thread:', threadId),
    onUpVote: (threadId: any) => console.log('Upvoted:', threadId),
    onDownVote: (threadId: any) => console.log('Downvoted:', threadId),
  },
};

/**
 * Multiple thread items dalam list.
 * Menunjukkan bagaimana ThreadItem terlihat dalam daftar.
 */
export const InList: Story = {
  args: {
    thread: mockThread, // Diberikan fallback agar TypeScript Storybook tidak protes
    owner: mockOwner,
    authUser: mockAuthUser,
    onThreadClick: (threadId: any) => console.log('Clicked thread:', threadId),
    onUpVote: (threadId: any) => console.log('Upvoted:', threadId),
    onDownVote: (threadId: any) => console.log('Downvoted:', threadId),
  },
  render: (args: any) => (
    <div className="space-y-4">
      <ThreadItem
        {...args}
        thread={{ ...mockThread, id: 'thread-1', title: 'Thread Pertama' }}
      />
      <ThreadItem
        {...args}
        thread={{
          ...mockThread,
          id: 'thread-2',
          title: 'Thread Kedua',
          upVotesBy: ['user-2'],
        }}
      />
      <ThreadItem
        {...args}
        thread={{
          ...mockThread,
          id: 'thread-3',
          title: 'Thread Ketiga',
          downVotesBy: ['user-2'],
        }}
      />
    </div>
  ),
};
