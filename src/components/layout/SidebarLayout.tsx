
import React, { useState, useEffect } from 'react';
import { Book, Calendar, Clock, FileText, Home, Smile, Pencil, Timer, Bell, Phone, FolderOpen, User, Users, Menu, Settings } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from 'react-router-dom';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  
  const menuItems = [
    {
      icon: Home,
      label: 'Home',
      path: '/'
    },
    {
      icon: User,
      label: 'Profile',
      path: '/profile'
    },
    {
      icon: Smile,
      label: 'Mood Tracker',
      path: '/mood'
    },
    {
      icon: FileText,
      label: 'Journal',
      path: '/journal'
    },
    {
      icon: Calendar,
      label: 'Planner',
      path: '/planner'
    },
    {
      icon: Bell,
      label: 'Reminders',
      path: '/reminders'
    },
    {
      icon: Timer,
      label: 'Timer',
      path: '/timer'
    },
    {
      icon: Book,
      label: 'Mindfulness',
      path: '/mindfulness'
    },
    {
      icon: Pencil,
      label: 'Gratitude',
      path: '/gratitude'
    },
    {
      icon: FolderOpen,
      label: 'Support Toolkit',
      path: '/support-toolkit'
    },
    {
      icon: Users,
      label: 'Community',
      path: '/community'
    },
    {
      icon: Phone,
      label: 'Crisis Resources',
      path: '/crisis'
    },
    {
      icon: Settings,
      label: 'Provider Dashboard',
      path: '/provider-dashboard'
    }
  ];

  // Auto-hide after 3 seconds when not interacting
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isClicked && !isHovered) {
      timeout = setTimeout(() => {
        setIsClicked(false);
      }, 3000);
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isClicked, isHovered]);

  const sidebarVisible = isHovered || isClicked;

  return (
    <div className="flex min-h-screen">
      {/* Menu trigger button - always visible */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-sm shadow-md hover:bg-white/90"
        onClick={() => setIsClicked(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div 
        className={`fixed left-0 top-0 h-full z-40 transition-transform duration-300 ${
          sidebarVisible ? 'translate-x-0' : '-translate-x-full'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Sidebar className="border-r border-mental-gray/20 h-full">
          <SidebarHeader className="p-4 bg-[#fadcd6]">
            <h1 className="font-bold text-center text-[#7e868b]">Making Meaning Psychology</h1>
          </SidebarHeader>
          <SidebarContent className="bg-[#fadcd6]">
            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-700">Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map(item => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton asChild>
                        <Link
                          to={item.path}
                          className={`flex items-center gap-2 text-gray-800 ${
                            location.pathname === item.path ? 'text-primary font-medium' : ''
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
          <SidebarFooter className="p-4 text-xs text-center text-gray-600 bg-[#fadcd6]">
            <p>© 2025 Making Meaning Psychology</p>
          </SidebarFooter>
        </Sidebar>
      </div>

      {/* Click area to show sidebar when hidden - reduced width */}
      {!sidebarVisible && (
        <div 
          className="fixed left-0 top-0 w-2 h-full z-30 cursor-pointer"
          onClick={() => setIsClicked(true)}
          onMouseEnter={() => setIsHovered(true)}
        />
      )}

      <main className={`flex-1 p-4 md:p-6 transition-all duration-300 ${
        sidebarVisible ? 'ml-64' : 'ml-0'
      }`}>
        {children}
      </main>
    </div>
  );
}
