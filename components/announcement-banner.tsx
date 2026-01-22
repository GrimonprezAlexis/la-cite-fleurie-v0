'use client';

import { useSiteSettings } from '@/hooks/use-site-settings';
import { Megaphone, X } from 'lucide-react';
import { useState } from 'react';

export function AnnouncementBanner() {
  const { settings, loading } = useSiteSettings();
  const [dismissed, setDismissed] = useState(false);

  if (loading || !settings.announcementActive || !settings.announcement || dismissed) {
    return null;
  }

  return (
    <div className="bg-[#d3cbc2] text-gray-900 py-2 px-4 relative">
      <div className="container mx-auto flex items-center justify-center gap-2 text-sm font-medium">
        <Megaphone className="w-4 h-4 flex-shrink-0" />
        <span className="text-center">{settings.announcement}</span>
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-black/10 rounded p-1 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
