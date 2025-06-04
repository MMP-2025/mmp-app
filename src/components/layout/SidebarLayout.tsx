
import React from 'react';
import { Book, Calendar, Clock, FileText, Home, Smile, Pencil, Timer, Bell, Phone } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Link, useLocation } from 'react-router-dom';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const location = useLocation();
  
  const menuItems = [
    {
      icon: Home,
      label: 'Home',
      path: '/'
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
      icon: Phone,
      label: 'Crisis Resources',
      path: '/crisis'
    }
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar className="border-r border-mental-gray/20">
        <SidebarHeader className="p-4 bg-[fadcd6] bg-mental-blue">
          <h1 className="font-bold text-center text-[_#7e868b] text-[#7e868b]">Making Meaning Psychology</h1>
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
        <SidebarFooter className="p-4 text-xs text-center text-gray-600 bg-mental-blue">
          <p>© 2025 Making Meaning Psychology</p>
        </SidebarFooter>
      </Sidebar>
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  );
}
