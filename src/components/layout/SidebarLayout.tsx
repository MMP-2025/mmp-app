
import React from 'react';
import { Book, Calendar, Clock, FileText, Home, Info, MessageSquare, Smile, Timer, User } from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { Link } from 'react-router-dom';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Smile, label: 'Mood Tracker', path: '/mood' },
    { icon: FileText, label: 'Journal', path: '/journal' },
    { icon: MessageSquare, label: 'Mindfulness', path: '/mindfulness' },
    { icon: Calendar, label: 'Planner', path: '/planner' },
    { icon: Clock, label: 'Timer', path: '/timer' },
    { icon: Info, label: 'Information', path: '/info' },
    { icon: Book, label: 'Gratitude', path: '/gratitude' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar className="border-r border-mental-gray/20">
        <SidebarHeader className="p-4">
          <h1 className="text-xl font-bold text-center">Making Meaning Psychology</h1>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild>
                      <Link to={item.path} className="flex items-center gap-2">
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-4 text-xs text-center text-mental-gray">
          <p>© 2025 Making Meaning Psychology</p>
          <p>A private psychology practice app</p>
        </SidebarFooter>
      </Sidebar>
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  );
}
