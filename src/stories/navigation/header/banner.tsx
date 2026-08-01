import * as React from 'react';
import { Link as RACLink } from 'react-aria-components';

/**
 * Props for the HeaderBanner component.
 */
export interface HeaderBannerProps {
  /**
   * If true, displays a development warning banner at the top of the header.
   */
  warnDev?: boolean;
  /**
   * The URL to the production site. Used as the link destination in the warning banner.
   * @default 'https://laniakita.com'
   */
  productionUrl?: string;
  /**
   * The text description displayed in the development warning banner.
   * @default '[WARN]: This is a dev preview. '
   */
  warnDevBannerDescription?: React.ReactNode;
  /**
   * The text for the link that returns the user to the production site.
   * @default 'Go to main site'
   */
  warnDevBannerReturnText?: React.ReactNode;
}

/**
 * A banner component typically displayed at the top of the application to warn
 * users when they are viewing a development preview or staging environment.
 * Provides a customizable message and a link back to the production site.
 */
export function HeaderBanner({
  warnDev = false,
  productionUrl = 'https://laniakita.com',
  warnDevBannerDescription = '[WARN]: This is a dev preview. ',
  warnDevBannerReturnText = 'Go to main site',
}: HeaderBannerProps) {
  if (!warnDev || !productionUrl) return null;

  return (
    <div className="bg-destructive/10 text-destructive text-xs font-medium px-4 py-1 text-center">
      {warnDevBannerDescription}{' '}
      <RACLink
        href={productionUrl}
        className="underline underline-offset-2 hover:opacity-80 transition-opacity"
      >
        {warnDevBannerReturnText}
      </RACLink>
    </div>
  );
}
