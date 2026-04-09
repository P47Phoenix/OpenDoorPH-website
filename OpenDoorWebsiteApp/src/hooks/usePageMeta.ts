import { useEffect } from 'react';

interface PageMeta {
  title: string;
  description: string;
}

/**
 * Sets the document title and meta description on mount.
 *
 * Design decision D-4: no cleanup on unmount. Every page that needs
 * page-specific meta is expected to call this hook, so the next
 * navigation will overwrite the values. Avoids race conditions on
 * rapid navigation and keeps the implementation simple.
 */
export function usePageMeta({ title, description }: PageMeta): void {
  useEffect(() => {
    document.title = title;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const tag = document.createElement('meta');
      tag.setAttribute('name', 'description');
      tag.setAttribute('content', description);
      document.head.appendChild(tag);
    }
  }, [title, description]);
}
