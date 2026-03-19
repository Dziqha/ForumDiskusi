import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface VoteButtonProps {
  type: 'up' | 'down';
  count: number;
  isActive: boolean;
  onClick: () => void;
}

export default function VoteButton({
  type,
  count,
  isActive,
  onClick,
}: VoteButtonProps) {
  const isLike = type === 'up';
  const Icon = isLike ? ThumbsUp : ThumbsDown;

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 text-sm transition ${
        isActive
          ? isLike
            ? 'text-blue-600'
            : 'text-gray-700'
          : 'text-gray-500 hover:text-gray-800'
      }`}
    >
      <Icon size={18} className={isActive ? 'fill-current' : ''} />
      <span>{count}</span>
    </button>
  );
}
