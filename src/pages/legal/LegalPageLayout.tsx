import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  title: string;
  version: string;
  effectiveDate: string;
  children: React.ReactNode;
}

const LegalPageLayout: React.FC<Props> = ({ title, version, effectiveDate, children }) => {
  React.useEffect(() => {
    document.title = `${title} — Making Meaning Psychology`;
  }, [title]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button asChild variant="ghost" size="sm">
            <Link to="/" aria-label="Back to app">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Link>
          </Button>
          <span className="text-xs text-muted-foreground">
            Version {version} · Effective {effectiveDate}
          </span>
        </div>
      </header>
      <main
        id="main-content"
        className="max-w-3xl mx-auto px-4 py-8 prose prose-neutral dark:prose-invert prose-headings:font-merriweather prose-h1:text-3xl prose-h2:text-xl prose-h3:text-lg prose-p:text-[15px] prose-li:text-[15px]"
      >
        <h1>{title}</h1>
        <p className="text-sm text-muted-foreground">
          <strong>Version:</strong> {version} &nbsp;·&nbsp; <strong>Effective Date:</strong> {effectiveDate}
        </p>
        {children}
      </main>
    </div>
  );
};

export default LegalPageLayout;