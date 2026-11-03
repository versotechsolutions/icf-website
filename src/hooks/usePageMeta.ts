import { useEffect } from 'react';
import { site } from '@/data/site';

/** Sets document title and meta description per route (SEO-ready; SSR/prerender can reuse the same values). */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${site.name} (${site.shortName})` : `${site.name} (${site.shortName})`;
    if (description) {
      let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.name = 'description';
        document.head.appendChild(tag);
      }
      tag.content = description;
    }
  }, [title, description]);
}
