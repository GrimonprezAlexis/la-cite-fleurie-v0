'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

export interface SiteSettings {
  phone: string;
  email: string;
  announcement: string;
  announcementActive: boolean;
}

const defaultSettings: SiteSettings = {
  phone: '022 793 03 50',
  email: '',
  announcement: '',
  announcementActive: false,
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'site_settings', 'contact');

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setSettings({ ...defaultSettings, ...docSnap.data() } as SiteSettings);
      } else {
        setSettings(defaultSettings);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching site settings:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const phoneLink = `tel:+41${settings.phone.replace(/\s/g, '').replace(/^0/, '')}`;

  return { settings, loading, phoneLink };
}
