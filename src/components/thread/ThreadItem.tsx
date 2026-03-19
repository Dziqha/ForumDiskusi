import { postedAt, stripHtml } from '@/src/lib/utils';
import VoteButton from './VoteButton';
import Image from 'next/image';
import { Thread, User } from '@/src/types';
import { MessageCircle } from 'lucide-react';

interface ThreadItemProps {
  thread: Thread;
  owner?: User;
  onThreadClick: (threadId: string) => void;
  onUpVote: (threadId: string) => void;
  onDownVote: (threadId: string) => void;
  authUser: User | null;
}

export default function ThreadItem({
  thread,
  owner,
  onThreadClick,
  onUpVote,
  onDownVote,
  authUser,
}: ThreadItemProps) {
  const isUpVoted = authUser ? thread.upVotesBy.includes(authUser.id) : false;

  const isDownVoted = authUser
    ? thread.downVotesBy.includes(authUser.id)
    : false;

  const handleVote = (voteFn: (id: string) => void) => {
    if (!authUser) {
      alert('Login untuk vote');
      return;
    }
    voteFn(thread.id);
  };

  return (
    <div className="bg-white p-6 rounded-xl border hover:shadow-sm transition">
      <div className="flex items-start gap-4">
        {owner?.avatar && (
          <Image
            src={owner.avatar}
            alt={owner.name}
            width={48}
            height={48}
            unoptimized
            className="rounded-full"
          />
        )}

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 text-sm">
            <span className="font-medium text-gray-800">
              {owner?.name || 'Unknown'}
            </span>
            <span className="text-gray-400">
              · {postedAt(thread.createdAt)}
            </span>
          </div>

          <h3
            onClick={() => onThreadClick(thread.id)}
            className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
          >
            {thread.title}
          </h3>

          <p className="text-gray-600 mt-1 line-clamp-2">
            {stripHtml(thread.body).slice(0, 150)}
          </p>

          <div className="flex items-center gap-4 mt-3 text-sm">
            <span className="text-blue-600">#{thread.category}</span>

            <VoteButton
              type="up"
              count={thread.upVotesBy.length}
              isActive={isUpVoted}
              onClick={() => handleVote(onUpVote)}
            />

            <VoteButton
              type="down"
              count={thread.downVotesBy.length}
              isActive={isDownVoted}
              onClick={() => handleVote(onDownVote)}
            />

            <span className="flex items-center gap-1 text-sm text-gray-500">
              <MessageCircle size={16} />
              {thread.totalComments}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
