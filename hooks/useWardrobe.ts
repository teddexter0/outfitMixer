'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getItems } from '@/lib/firestore';
import { WardrobeItem } from '@/types';

export function useWardrobe() {
  const { user } = useAuth();
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getItems(user.uid);
      setItems(data);
    } catch (e) {
      setError('Failed to load wardrobe');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) refresh();
    else setLoading(false);
  }, [user]);

  return { items, loading, error, refresh };
}
