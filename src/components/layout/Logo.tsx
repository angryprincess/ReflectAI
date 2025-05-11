import { Waves } from 'lucide-react'; // Using Waves as a calming icon
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const textSizeClass = size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-2xl' : 'text-xl';
  const iconSize = size === 'lg' ? 30 : size === 'md' ? 24 : 20;

  return (
    <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
      <Waves size={iconSize} className="text-primary" />
      <span className={`font-semibold ${textSizeClass} tracking-tight`}>{APP_NAME}</span>
    </Link>
  );
}
