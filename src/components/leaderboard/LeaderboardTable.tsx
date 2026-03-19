import { LeaderboardItem } from '@/src/types';
import Image from 'next/image';

interface LeaderboardTableProps {
  leaderboards: LeaderboardItem[];
}

export default function LeaderboardTable({
  leaderboards,
}: LeaderboardTableProps) {
  const getTrophy = (index: number) => {
    switch (index) {
    case 0:
      return { icon: '🏆', color: 'text-yellow-500', bg: 'bg-yellow-50' };
    case 1:
      return { icon: '🥈', color: 'text-gray-400', bg: 'bg-gray-50' };
    case 2:
      return { icon: '🥉', color: 'text-orange-400', bg: 'bg-orange-50' };
    default:
      return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      <div className="grid grid-cols-12 px-6 mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
        <div className="col-span-2">Peringkat</div>
        <div className="col-span-7">Kontributor</div>
        <div className="col-span-3 text-right">Skor</div>
      </div>

      <div className="space-y-3">
        {leaderboards.map((item, index) => {
          const trophy = getTrophy(index);

          return (
            <div
              key={item.user.id}
              className="grid grid-cols-12 items-center px-6 py-4 bg-white border border-gray-100 rounded-2xl transition-all duration-300 hover:shadow-md hover:border-transparent group"
            >
              <div className="col-span-2 flex items-center gap-2">
                <span
                  className={`text-sm font-bold ${
                    trophy ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {index + 1}
                </span>
                {trophy && (
                  <span className={'text-xl drop-shadow-sm'}>
                    {trophy.icon}
                  </span>
                )}
              </div>

              <div className="col-span-7 flex items-center gap-4">
                <div className="relative">
                  <Image
                    src={item.user.avatar}
                    alt={item.user.name}
                    width={40}
                    height={40}
                    unoptimized
                    className={`rounded-full object-cover p-0.5 border ${
                      trophy ? 'border-blue-200' : 'border-gray-100'
                    }`}
                  />
                  {index === 0 && (
                    <div
                      className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
                      title="Online"
                    />
                  )}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-bold text-gray-800 truncate">
                    {item.user.name}
                  </span>
                  <span className="text-[11px] text-gray-400 truncate tracking-wide">
                    {item.user.email}
                  </span>
                </div>
              </div>

              <div className="col-span-3 text-right">
                <div className="inline-flex flex-col items-end">
                  <span
                    className={`text-lg font-black tracking-tight ${
                      trophy ? 'text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    {item.score.toLocaleString()}
                  </span>
                  <div className="h-0.5 w-4 bg-gray-100 group-hover:bg-blue-200 transition-colors rounded-full" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
