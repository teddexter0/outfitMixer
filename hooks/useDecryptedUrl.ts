'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { decryptUrl } from '@/lib/crypto';

const cache = new Map<string, string>();

export function useDecryptedUrl(encryptedUrl: string): string {
  const { user } = useAuth();
  const [objectUrl, setObjectUrl] = useState<string>(() => cache.get(encryptedUrl) ?? '');

  useEffect(() => {
    if (!user || !encryptedUrl) return;
    if (cache.has(encryptedUrl)) {
      setObjectUrl(cache.get(encryptedUrl)!);
      return;
    }
    let cancelled = false;
    decryptUrl(encryptedUrl, user.uid).then((url) => {
      if (cancelled) return;
      cache.set(encryptedUrl, url);
      setObjectUrl(url);
    });
    return () => { cancelled = true; };
  }, [encryptedUrl, user]);

  return objectUrl;
}
