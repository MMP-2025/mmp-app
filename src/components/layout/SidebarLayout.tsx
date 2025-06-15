import React, { useState, useEffect } from 'react';
import { Book, Calendar, Clock, FileText, Home, Smile, Pencil, Timer, Bell, Phone, User, Users, Menu, Settings, Wrench } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UserProfile from './UserProfile';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const location = useLocation();
  const { isProvider } = useAuth();
  const [isClicked, setIsClicked] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Smile, label: 'Mood Tracker', path: '/mood' },
    { icon: FileText, label: 'Journal', path: '/journal' },
    { icon: Calendar, label: 'Planner', path: '/planner' },
    { icon: Bell, label: 'Reminders', path: '/reminders' },
    { icon: Timer, label: 'Timer', path: '/timer' },
    { icon: Book, label: 'Mindfulness', path: '/mindfulness' },
    { icon: Pencil, label: 'Gratitude', path: '/gratitude' },
    { icon: Wrench, label: 'Support Toolkit', path: '/support-toolkit' },
    { icon: Users, label: 'Community', path: '/community' },
    { icon: Phone, label: 'Crisis Resources', path: '/crisis' }
  ];

  // Add Provider Dashboard link only for providers
  if (isProvider) {
    menuItems.push({
      icon: Settings,
      label: 'Provider Dashboard',
      path: '/provider-dashboard'
    });
  }

  // Auto-hide after 3 seconds when not interacting
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isClicked) {
      timeout = setTimeout(() => {
        setIsClicked(false);
      }, 3000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isClicked]);

  return (
    <div className="flex min-h-screen">
      {/* Menu trigger button - always visible */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setIsClicked(true)} 
        className="fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-sm shadow-md hover:bg-white/90 text-neutral-500"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* User Profile in top right */}
      <div className="fixed top-4 right-4 z-50">
        <UserProfile />
      </div>

      <div 
        className={`fixed left-0 top-0 h-full z-40 transition-transform duration-300 ${
          isClicked ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar className="border-r border-mental-gray/20 h-full">
          <SidebarHeader className="p-4 bg-[#fadcd6]">
            <h1 className="font-bold text-center text-neutral-500">Making Meaning Psychology</h1>
          </SidebarHeader>
          <SidebarContent className="bg-[#fadcd6]">
            <SidebarGroup>
              <SidebarGroupLabel className="text-neutral-500">Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map(item => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton asChild>
                        <Link 
                          to={item.path} 
                          className={`flex items-center gap-2 text-neutral-500 ${
                            location.pathname === item.path ? 'font-medium' : ''
                          }`} 
                          onClick={() => setIsClicked(false)}
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
          <SidebarFooter className="p-4 text-xs text-center bg-[#fadcd6]">
            <p className="text-neutral-500">© 2025 Making Meaning Psychology</p>
          </SidebarFooter>
        </Sidebar>
      </div>

      <main className={`flex-1 p-4 md:p-6 transition-all duration-300 ${
        isClicked ? 'ml-64' : 'ml-0'
      }`}>
        {children}
      </main>
    </div>
  );
}
