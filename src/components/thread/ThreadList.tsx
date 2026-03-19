import { Thread, User } from '@/src/types';
import ThreadItem from './ThreadItem';

interface ThreadListProps {
  threads: Thread[];
  users: User[];
  onThreadClick: (threadId: string) => void;
  onUpVote: (threadId: string) => void;
  onDownVote: (threadId: string) => void;
  authUser: User | null;
  selectedCategory?: string;
}

export default function ThreadList({
  threads,
  users,
  onThreadClick,
  onUpVote,
  onDownVote,
  authUser,
  selectedCategory,
}: ThreadListProps) {
  const filteredThreads = selectedCategory
    ? threads.filter((thread) => thread.category === selectedCategory)
    : threads;

  return (
    <div className="space-y-4">
      {filteredThreads.map((thread) => {
        const owner = users.find((user) => user.id === thread.ownerId);
        return (
          <ThreadItem
            key={thread.id}
            thread={thread}
            owner={owner}
            onThreadClick={onThreadClick}
            onUpVote={onUpVote}
            onDownVote={onDownVote}
            authUser={authUser}
          />
        );
      })}
    </div>
  );
}
