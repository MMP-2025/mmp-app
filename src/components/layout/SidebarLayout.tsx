import React from 'react';
import { Book, Calendar, FileText, Home, Smile, Pencil, Timer, Bell, Phone, User, Users, Settings, Wrench, X } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from 'react-router-dom';
import UserProfile from './UserProfile';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

function AppSidebar() {
  const location = useLocation();
  const { isProvider, isGuest } = useAuth();

  const baseMenuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Smile, label: 'Mood Tracker', path: '/mood' },
    { icon: FileText, label: 'Journal', path: '/journal' },
    { icon: Calendar, label: 'Planner', path: '/planner' },
    { icon: Bell, label: 'Reminders', path: '/reminders' },
    { icon: Timer, label: 'Timer', path: '/timer' },
    { icon: Book, label: 'Mindfulness', path: '/mindfulness' },
    { icon: Pencil, label: 'Gratitude', path: '/gratitude' },
    { icon: Phone, label: 'Crisis Resources', path: '/crisis' },
  ];

  const guestRestrictedItems = [
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Wrench, label: 'Support Toolkit', path: '/support-toolkit' },
    { icon: Users, label: 'Community', path: '/community' },
  ];

  // Build menu items based on user type
  const menuItems = isGuest 
    ? baseMenuItems 
    : [...baseMenuItems, ...guestRestrictedItems];

  if (isProvider) {
    menuItems.push({
      icon: Settings,
      label: 'Provider Dashboard',
      path: '/provider-dashboard'
    });
  }

  return (
    <Sidebar className="border-r border-mental-gray/20">
      <SidebarHeader className="p-4 bg-sidebar flex items-center justify-between">
        <h1 className="font-bold text-sidebar-foreground">Making Meaning Psychology</h1>
        <SidebarTrigger className="text-sidebar-foreground hover:bg-sidebar-accent" />
      </SidebarHeader>
      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.path} 
                      className={`flex items-center gap-2 text-sidebar-foreground ${
                        location.pathname === item.path ? 'font-medium' : ''
                      }`}
                    >
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
      <SidebarFooter className="p-4 text-xs text-center bg-sidebar">
        <p className="text-sidebar-foreground">© 2025 Making Meaning Psychology</p>
      </SidebarFooter>
    </Sidebar>
  );
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header bar with trigger and navigation */}
        <header className="h-16 flex items-center justify-end bg-background border-b px-4 shrink-0">
          {/* User Profile in header - only show user profile, sidebar has its own trigger */}
          <div className="bg-background/95 backdrop-blur-sm shadow-lg rounded-lg border p-2">
            <UserProfile />
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 px-4 py-6 md:px-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}