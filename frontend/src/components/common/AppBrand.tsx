import { Link } from 'react-router-dom';

type AppBrandProps = {
  onNavigate?: () => void;
  compact?: boolean;
};

export default function AppBrand({ onNavigate, compact = false }: AppBrandProps) {
  return (
    <Link
      to="/home"
      onClick={onNavigate}
      className="flex items-center gap-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors p-1 -m-1 shrink-0"
    >
      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
        SW
      </div>
      {!compact && (
        <div>
          <p className="font-bold text-sm text-gray-900 dark:text-white leading-tight">SWMS</p>
          <p className="text-xs text-gray-400 leading-tight">Workflow Manager</p>
        </div>
      )}
    </Link>
  );
}
