import { createNavigation } from 'next-intl/navigation';

export const routing = {
    // A list of all locales that are supported
    locales: ['en', 'ja'] as const,

    // Used when no locale matches
    defaultLocale: 'ja' as const
};

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);
