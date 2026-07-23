import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'Research Bible',
    },
    links: [
      {
        text: 'Home',
        url: '/',
      },
    ],
  };
}
