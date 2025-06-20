'use client';
import * as Icons from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface LucideIconRendererProps extends LucideProps {
  name: string;
}

const LucideIconRenderer: React.FC<LucideIconRendererProps> = ({ name, ...props }) => {
  const IconComponent = (Icons as any)[name];

  if (!IconComponent) {
    // Fallback icon if the specified icon name is not found
    return <Icons.HelpCircle {...props} />;
  }

  return <IconComponent {...props} />;
};

export default LucideIconRenderer;
