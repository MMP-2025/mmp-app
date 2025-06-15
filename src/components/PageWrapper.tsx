
import React from 'react';
import { SidebarLayout } from "@/components/layout/SidebarLayout";

interface PageWrapperProps {
  children: React.ReactNode;
  backgroundColor: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, backgroundColor }) => {
  return (
    <div className={`${backgroundColor} min-h-screen`}>
      <SidebarLayout>
        {children}
      </SidebarLayout>
    </div>
  );
};

export default PageWrapper;
