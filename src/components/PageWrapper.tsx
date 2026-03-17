import React from 'react';
import { SidebarLayout } from "@/components/layout/SidebarLayout";

interface PageWrapperProps {
  children: React.ReactNode;
  backgroundColor?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <SidebarLayout>
      {children}
    </SidebarLayout>
  );
};

export default PageWrapper;
