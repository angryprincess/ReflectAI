'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import Logo from './Logo';
import { Home, BookOpenText, BarChart3, Settings, Smile, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/journal', label: 'Journal', icon: BookOpenText },
  { href: '/insights', label: 'AI Insights', icon: Lightbulb },
  { href: '/mood', label: 'Mood Tracking', icon: Smile },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 border-b">
        <Logo size="md" />
      </SidebarHeader>
      <SidebarMenu className="flex-1 p-2">
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} legacyBehavior passHref>
              <SidebarMenuButton
                isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
                tooltip={{ children: item.label, side: 'right', align: 'center' }}
                className="justify-start"
              >
                <item.icon className="h-5 w-5" />
                <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarFooter className="p-4 border-t">
        <div className="group-data-[collapsible=icon]:hidden text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ReflectAI</p>
          <p>Journal with intelligence.</p>
        </div>
        <div className="hidden group-data-[collapsible=icon]:block text-center">
            <Smile size={20} className="mx-auto text-muted-foreground" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
