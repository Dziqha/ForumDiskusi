import { ThreadComment, User } from '@/src/types';
import CommentItem from './CommentItem';

interface CommentListProps {
  comments: ThreadComment[];
  users: User[];
  onUpVote: (commentId: string) => void;
  onDownVote: (commentId: string) => void;
  authUser: User | null;
}

export default function CommentList({
  comments,
  users,
  onUpVote,
  onDownVote,
  authUser,
}: CommentListProps) {
  return (
    <div className="bg-white border rounded-xl p-6">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">
        Komentar ({comments.length})
      </h2>

      <div className="space-y-6">
        {comments.map((comment) => {
          const owner =
            users.find((u) => u.id === comment.owner.id) ?? comment.owner;

          return (
            <CommentItem
              key={comment.id}
              comment={comment}
              owner={owner}
              onUpVote={onUpVote}
              onDownVote={onDownVote}
              authUser={authUser}
            />
          );
        })}
      </div>
    </div>
  );
}
