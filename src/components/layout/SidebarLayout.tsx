import React from 'react';
import { Book, Calendar, FileText, Home, Smile, Pencil, Bell, Phone, User, Users, Settings, Wrench, Brain } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Link, useLocation } from 'react-router-dom';
import UserProfile from './UserProfile';
import HomeButton from '@/components/ui/home-button';
import { useAuth } from '@/contexts/AuthContext';
import NotificationBell from '@/components/notifications/NotificationBell';
import ThemeToggle from '@/components/common/ThemeToggle';
import BottomTabBar from './BottomTabBar';
import { useIsMobile } from '@/hooks/use-mobile';
import logo from '@/assets/logo.png';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

function AppSidebar() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();
  const { isProvider, isGuest } = useAuth();

  // Desktop sidebar items — full set for desktop, simplified for mobile (handled by bottom tab bar)
  const coreItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Smile, label: 'Mood Tracker', path: '/mood' },
    { icon: FileText, label: 'Journal', path: '/journal' },
    { icon: Brain, label: 'Mindfulness', path: '/mindfulness' },
    { icon: Pencil, label: 'Gratitude', path: '/gratitude' },
    { icon: Phone, label: 'Crisis Resources', path: '/crisis' },
  ];

  const extraItems = [
    { icon: Calendar, label: 'Planner', path: '/planner' },
    { icon: Bell, label: 'Reminders', path: '/reminders' },
  ];

  const accountItems = isGuest ? [] : [
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Wrench, label: 'Support Toolkit', path: '/support-toolkit' },
    { icon: Users, label: 'Community', path: '/community' },
  ];

  const providerItems = isProvider ? [
    { icon: Settings, label: 'Provider Dashboard', path: '/provider-dashboard' },
  ] : [];

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4 flex items-center gap-3 bg-sidebar">
        <div className="rounded-lg bg-gradient-to-br from-sage-light to-mental-peach p-2 shadow-sm">
          <img src={logo} alt="" className="h-10 w-10" />
        </div>
        <h1 className="font-merriweather font-bold text-sidebar-foreground text-sm">
          Making Meaning Psychology
        </h1>
      </SidebarHeader>
      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs uppercase tracking-wider">
            Core Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {coreItems.map(item => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.path}
                      onClick={() => { if (isMobile) setOpenMobile(false); }}
                      className={`flex items-center gap-2.5 text-sidebar-foreground no-underline rounded-lg transition-colors ${
                        location.pathname === item.path
                          ? 'bg-sidebar-accent font-medium'
                          : 'hover:bg-sidebar-accent/50'
                      }`}
                    >
                      <item.icon className="h-4.5 w-4.5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {extraItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs uppercase tracking-wider">
              Planning
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {extraItems.map(item => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.path}
                        onClick={() => { if (isMobile) setOpenMobile(false); }}
                        className={`flex items-center gap-2.5 text-sidebar-foreground no-underline rounded-lg transition-colors ${
                          location.pathname === item.path
                            ? 'bg-sidebar-accent font-medium'
                            : 'hover:bg-sidebar-accent/50'
                        }`}
                      >
                        <item.icon className="h-4.5 w-4.5" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {accountItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs uppercase tracking-wider">
              Account
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {[...accountItems, ...providerItems].map(item => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.path}
                        onClick={() => { if (isMobile) setOpenMobile(false); }}
                        className={`flex items-center gap-2.5 text-sidebar-foreground no-underline rounded-lg transition-colors ${
                          location.pathname === item.path
                            ? 'bg-sidebar-accent font-medium'
                            : 'hover:bg-sidebar-accent/50'
                        }`}
                      >
                        <item.icon className="h-4.5 w-4.5" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="p-4 text-xs text-center bg-sidebar border-t border-sidebar-border">
        <p className="text-sidebar-foreground/50">© 2026 Making Meaning Psychology</p>
      </SidebarFooter>
    </Sidebar>
  );
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex w-full overflow-x-hidden">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 flex items-center justify-between border-b border-border px-4 shrink-0 bg-card/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-foreground hover:bg-accent" />
            {!isMobile && <HomeButton />}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NotificationBell />
            <UserProfile />
          </div>
        </header>

        {/* Main content */}
        <main className={`flex-1 p-4 md:p-6 overflow-auto bg-background ${isMobile ? 'pb-tab-bar' : ''}`}>
          <div className="w-full">
            {children}
          </div>
        </main>

        {/* Bottom tab bar for mobile */}
        <BottomTabBar />
      </div>
    </div>
  );
}
