interface ContributorCardProps {
  name: string;
  wordCount: number;
  sessionCount: number;
  colorClass: string;
  onClick?: () => void;
  isHighlighted?: boolean;
}

export function ContributorCard({
  name,
  wordCount,
  sessionCount,
  colorClass,
  onClick,
  isHighlighted,
}: ContributorCardProps) {
  return (
    <button
      onClick={onClick}
      className={`${colorClass} flex flex-col items-start px-3 py-2.5 rounded-xl w-[140px] text-left transition-all duration-200 shadow-sm hover:shadow-md ${
        isHighlighted ? 'ring-2 ring-offset-2 ring-offset-gray-900 ring-green-400 shadow-md' : ''
      } ${onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''}`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-sm font-bold text-gray-800 shadow-inner">
          {name.charAt(0).toUpperCase()}
        </div>
        <p className="font-semibold text-base leading-tight text-white">{name}</p>
      </div>
      <div className="flex flex-col w-full text-sm font-medium bg-black/20 rounded-lg px-2 py-1.5">
        <div className="flex items-center justify-between w-full">
          <span className="text-white/70">Words</span>
          <span className="text-white font-semibold">{wordCount.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between w-full">
          <span className="text-white/70">Sessions</span>
          <span className="text-white font-semibold">{sessionCount}</span>
        </div>
      </div>
    </button>
  );
}
