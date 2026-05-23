import { User } from '../../types';

type UserAvatarProps = {
  user: Pick<User, 'name' | 'profileImageUrl'> | null | undefined;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
};

const sizes = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-28 h-28 text-3xl',
};

export default function UserAvatar({ user, size = 'md', className = '' }: UserAvatarProps) {
  const dim = sizes[size];
  const initial = user?.name?.charAt(0).toUpperCase() || '?';

  if (user?.profileImageUrl) {
    return (
      <img
        src={user.profileImageUrl}
        alt={user.name}
        className={`${dim} rounded-full object-cover shrink-0 border-2 border-white dark:border-gray-700 shadow-sm ${className}`}
      />
    );
  }

  return (
    <div
      className={`${dim} rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold shrink-0 shadow-sm ${className}`}
    >
      {initial}
    </div>
  );
}
