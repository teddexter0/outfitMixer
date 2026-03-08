'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const links = [
  { href: '/dashboard', label: 'Week' },
  { href: '/wardrobe', label: 'Wardrobe' },
  { href: '/randomizer', label: 'Mix' },
  { href: '/highlights', label: 'Highlights' },
];

export function Navbar() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-1/90 backdrop-blur border-t border-surface-3">
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-1">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl text-xs transition-colors',
              pathname.startsWith(href)
                ? 'text-accent font-semibold'
                : 'text-white/40 hover:text-white/70'
            )}
          >
            {label}
          </Link>
        ))}
        <button
          onClick={signOut}
          className="flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          Out
        </button>
      </div>
    </nav>
  );
}
