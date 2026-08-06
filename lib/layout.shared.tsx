import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'Bobby Washburn Parenting Support',
    },
    links: [
      {
        text: 'Home',
        url: '/',
      },
    ],
  };
}
