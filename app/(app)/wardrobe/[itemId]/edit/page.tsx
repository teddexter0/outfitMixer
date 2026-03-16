'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useDecryptedUrl } from '@/hooks/useDecryptedUrl';
import { getItems, updateItem } from '@/lib/firestore';
import { inferColorFamily } from '@/lib/colorLogic';
import { WardrobeItem, Category, VibeTag, ColorFamily } from '@/types';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/LoadingSpinner';

const CATEGORIES: Category[] = ['head', 'top', 'bottom', 'shoes', 'socks', 'accessory'];
const VIBES: VibeTag[] = ['strathmore', 'chill-weekend', 'fancy-out', 'home'];

export default function EditItemPage() {
  const { itemId } = useParams<{ itemId: string }>();
  const { user } = useAuth();
  const router = useRouter();

  const [item, setItem] = useState<WardrobeItem | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('top');
  const [color, setColor] = useState('');
  const [colorFamily, setColorFamily] = useState<ColorFamily>('neutral');
  const [vibeTags, setVibeTags] = useState<VibeTag[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const previewSrc = useDecryptedUrl(item?.imageUrl ?? '');

  useEffect(() => {
    if (!user) return;
    getItems(user.uid).then((items) => {
      const found = items.find((i) => i.id === itemId);
      if (found) {
        setItem(found);
        setName(found.name ?? '');
        setCategory(found.category);
        setColor(found.color);
        setColorFamily(found.colorFamily);
        setVibeTags(found.vibeTags);
      }
      setLoading(false);
    });
  }, [user, itemId]);

  const handleColorChange = (val: string) => {
    setColor(val);
    setColorFamily(inferColorFamily(val));
  };

  const toggleVibe = (v: VibeTag) => {
    setVibeTags((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  };

  const handleSave = async () => {
    if (!user || !item || vibeTags.length === 0) return;
    setSaving(true);
    try {
      await updateItem(user.uid, item.id, {
        name: name.trim() || undefined,
        category,
        color: color.trim(),
        colorFamily,
        vibeTags,
      });
      router.push('/wardrobe');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!item) return <p className="text-white/40 text-center pt-20">Item not found</p>;

  return (
    <main className="px-4 pt-8 space-y-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="text-white/40 hover:text-white transition-colors text-sm"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold text-white">Edit Item</h1>
      </div>

      {/* Image preview (read-only) */}
      <div className="w-32 h-32 rounded-2xl overflow-hidden relative mx-auto bg-surface-2">
        {previewSrc
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={previewSrc} alt="item" className="w-full h-full object-cover" />
          : <div className="w-full h-full animate-pulse bg-surface-3" />
        }
      </div>

      {/* Name */}
      <div>
        <label className="block text-xs text-white/50 mb-1">Name (optional)</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-surface-2 border border-surface-3 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent/50"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs text-white/50 mb-1.5">Category</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
                category === c
                  ? 'bg-accent text-surface'
                  : 'bg-surface-2 text-white/50 hover:text-white/80'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="block text-xs text-white/50 mb-1">Color</label>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="flex-1 bg-surface-2 border border-surface-3 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent/50"
          />
          <span className="text-xs px-2 py-1 rounded-lg bg-surface-2 text-white/50 border border-surface-3">
            {colorFamily}
          </span>
        </div>
      </div>

      {/* Vibes */}
      <div>
        <label className="block text-xs text-white/50 mb-1.5">Vibe(s)</label>
        <div className="flex flex-wrap gap-2">
          {VIBES.map((v) => (
            <button
              key={v}
              onClick={() => toggleVibe(v)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                vibeTags.includes(v)
                  ? 'bg-accent text-surface'
                  : 'bg-surface-2 text-white/50 hover:text-white/80'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving || vibeTags.length === 0} size="lg" className="w-full">
        {saving ? 'Saving...' : 'Save Changes'}
      </Button>
    </main>
  );
}
