'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { addItem } from '@/lib/firestore';
import { uploadItemImage } from '@/lib/storage';
import { inferColorFamily } from '@/lib/colorLogic';
import { Category, VibeTag, ColorFamily } from '@/types';
import { Button } from '@/components/ui/Button';

const CATEGORIES: Category[] = ['head', 'top', 'bottom', 'shoes', 'socks', 'accessory'];
const VIBES: VibeTag[] = ['strathmore', 'chill-weekend', 'fancy-out', 'home'];

interface UploadFormProps {
  onSuccess?: () => void;
}

export function UploadForm({ onSuccess }: UploadFormProps) {
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('top');
  const [color, setColor] = useState('');
  const [colorFamily, setColorFamily] = useState<ColorFamily>('neutral');
  const [vibeTags, setVibeTags] = useState<VibeTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleColorChange = (val: string) => {
    setColor(val);
    setColorFamily(inferColorFamily(val));
  };

  const toggleVibe = (v: VibeTag) => {
    setVibeTags((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  };

  const handleSubmit = async () => {
    if (!user || !file || !color || vibeTags.length === 0) {
      setError('Please fill all fields and select at least one vibe.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const imageUrl = await uploadItemImage(user.uid, file);
      await addItem(user.uid, {
        category,
        name: name.trim() || undefined,
        imageUrl,
        color: color.trim(),
        colorFamily,
        vibeTags,
      });
      onSuccess?.();
    } catch (e) {
      setError('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 max-w-md mx-auto">
      {/* Image picker */}
      <div
        onClick={() => fileRef.current?.click()}
        className="w-full aspect-square rounded-2xl border-2 border-dashed border-surface-3 hover:border-accent/50 transition-colors cursor-pointer overflow-hidden relative bg-surface-1 flex items-center justify-center"
      >
        {preview ? (
          <Image src={preview} alt="preview" fill className="object-cover" />
        ) : (
          <div className="text-center text-white/40 space-y-1">
            <div className="text-3xl">+</div>
            <p className="text-sm">Tap to add photo</p>
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      {/* Name (optional) */}
      <div>
        <label className="block text-xs text-white/50 mb-1">Name (optional)</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Blue Oxford"
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
            placeholder="e.g. navy blue"
            className="flex-1 bg-surface-2 border border-surface-3 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent/50"
          />
          <span className="text-xs px-2 py-1 rounded-lg bg-surface-2 text-white/50 border border-surface-3">
            {colorFamily}
          </span>
        </div>
      </div>

      {/* Vibe Tags */}
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

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <Button
        onClick={handleSubmit}
        disabled={loading || !file}
        size="lg"
        className="w-full"
      >
        {loading ? 'Uploading...' : 'Add to Wardrobe'}
      </Button>
    </div>
  );
}
