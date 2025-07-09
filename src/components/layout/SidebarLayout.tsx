
import React, { useState, useEffect } from 'react';
import { Book, Calendar, Clock, FileText, Home, Smile, Pencil, Timer, Bell, Phone, User, Users, Menu, Settings, Wrench } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from 'react-router-dom';
import UserProfile from './UserProfile';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const location = useLocation();
  const { isProvider, isGuest } = useAuth();
  const [isClicked, setIsClicked] = useState(false);

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
      {/* Menu trigger and Home button - only show when sidebar is closed */}
      {!isClicked && (
        <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsClicked(!isClicked)} 
            className="bg-background/95 backdrop-blur-sm shadow-lg hover:bg-background text-foreground border"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/" aria-label="Go to Home page">
            <Button variant="ghost" size="icon" className="bg-background/95 backdrop-blur-sm shadow-lg hover:bg-background text-foreground border">
                <Home className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      )}

      {/* User Profile in top right - positioned to not block content */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-background/95 backdrop-blur-sm shadow-lg rounded-lg border p-2">
          <UserProfile />
        </div>
      </div>

      <div 
        className={`fixed left-0 top-0 h-full z-40 transition-transform duration-300 ${
          isClicked ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar className="border-r border-mental-gray/20 h-full">
          <SidebarHeader className="p-4 bg-sidebar flex items-center justify-between">
            <h1 className="font-bold text-center text-sidebar-foreground">Making Meaning Psychology</h1>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsClicked(false)} 
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Menu className="h-5 w-5" />
            </Button>
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
          <SidebarFooter className="p-4 text-xs text-center bg-sidebar">
            <p className="text-sidebar-foreground">© 2025 Making Meaning Psychology</p>
          </SidebarFooter>
        </Sidebar>
      </div>

      {/* Main content with proper padding to avoid overlap */}
      <main className={`flex-1 transition-all duration-300 pt-20 px-4 pb-4 md:px-6 md:pb-6 ${
        isClicked ? 'ml-64' : 'ml-0'
      }`}>
        {children}
      </main>
    </div>
  );
}
