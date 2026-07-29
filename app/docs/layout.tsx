import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { source } from '@/lib/source';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      {...baseOptions()}
      containerProps={{
        className: "[--fd-layout-width:min(2000px,100vw_-_2rem)]",
      }}
    >
      {children}
    </DocsLayout>
  );
}
