import { ThreadDetail, User } from '@/src/types';
import { postedAt } from '@/src/lib/utils';
import VoteButton from '../thread/VoteButton';
import Image from 'next/image';

interface ThreadDetailHeaderProps {
  threadDetail: ThreadDetail;
  owner?: User;
  onUpVote: () => void;
  onDownVote: () => void;
  authUser: User | null;
}

export default function ThreadDetailHeader({
  threadDetail,
  owner,
  onUpVote,
  onDownVote,
  authUser,
}: ThreadDetailHeaderProps) {
  const isUpVoted = authUser
    ? threadDetail.upVotesBy.includes(authUser.id)
    : false;

  const isDownVoted = authUser
    ? threadDetail.downVotesBy.includes(authUser.id)
    : false;

  const handleVote = (fn: () => void) => {
    if (!authUser) return alert('Login untuk vote');
    fn();
  };

  return (
    <div className="bg-white rounded-xl border p-6 mb-6">
      <div className="flex items-start gap-4 mb-4">
        {owner?.avatar && (
          <Image
            src={owner.avatar}
            alt={owner.name}
            width={56}
            height={56}
            unoptimized
            className="w-14 h-14 rounded-full"
          />
        )}

        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span className="font-medium text-gray-800">
              {owner?.name || 'Unknown'}
            </span>
            · {postedAt(threadDetail.createdAt)}
          </div>

          <h1 className="text-2xl font-semibold text-gray-900">
            {threadDetail.title}
          </h1>

          <span className="inline-block text-sm text-blue-600 mt-2">
            #{threadDetail.category}
          </span>
        </div>
      </div>

      <div
        dangerouslySetInnerHTML={{ __html: threadDetail.body }}
        className="prose prose-sm max-w-none text-gray-700"
      />

      <div className="flex items-center gap-4 mt-4 pt-4 border-t">
        <VoteButton
          type="up"
          count={threadDetail.upVotesBy.length}
          isActive={isUpVoted}
          onClick={() => handleVote(onUpVote)}
        />
        <VoteButton
          type="down"
          count={threadDetail.downVotesBy.length}
          isActive={isDownVoted}
          onClick={() => handleVote(onDownVote)}
        />
      </div>
    </div>
  );
}
