import { ThreadComment, User } from '@/src/types';
import { postedAt } from '@/src/lib/utils';
import VoteButton from '../thread/VoteButton';
import Image from 'next/image';

interface CommentItemProps {
  comment: ThreadComment;
  owner?: User;
  onUpVote: (commentId: string) => void;
  onDownVote: (commentId: string) => void;
  authUser: User | null;
}

export default function CommentItem({
  comment,
  owner,
  onUpVote,
  onDownVote,
  authUser,
}: CommentItemProps) {
  const isUpVoted = authUser ? comment.upVotesBy.includes(authUser.id) : false;

  const isDownVoted = authUser
    ? comment.downVotesBy.includes(authUser.id)
    : false;

  const handleVote = (fn: (id: string) => void) => {
    if (!authUser) return alert('Login untuk vote');
    fn(comment.id);
  };

  return (
    <div className="flex gap-3">
      {owner?.avatar && (
        <Image
          src={owner.avatar}
          alt={owner.name}
          width={40}
          height={40}
          unoptimized
          className="w-10 h-10 rounded-full"
        />
      )}

      <div className="flex-1">
        <div className="text-sm text-gray-500 mb-1">
          <span className="font-medium text-gray-800">{owner?.name}</span> ·{' '}
          {postedAt(comment.createdAt)}
        </div>

        <div
          dangerouslySetInnerHTML={{ __html: comment.content }}
          className="text-gray-700 text-sm"
        />

        <div className="flex gap-4 mt-2">
          <VoteButton
            type="up"
            count={comment.upVotesBy.length}
            isActive={isUpVoted}
            onClick={() => handleVote(onUpVote)}
          />
          <VoteButton
            type="down"
            count={comment.downVotesBy.length}
            isActive={isDownVoted}
            onClick={() => handleVote(onDownVote)}
          />
        </div>
      </div>
    </div>
  );
}
