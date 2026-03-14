import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { WardrobeItem, Outfit, Highlight, Category, VibeTag } from '@/types';

// ── Items ────────────────────────────────────────────────────────────────────

export async function addItem(
  userId: string,
  data: Omit<WardrobeItem, 'id' | 'userId' | 'createdAt'>
): Promise<string> {
  const ref = await addDoc(collection(db, `users/${userId}/items`), {
    ...data,
    userId,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getItems(userId: string): Promise<WardrobeItem[]> {
  const snap = await getDocs(
    query(collection(db, `users/${userId}/items`), orderBy('createdAt', 'desc'))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as WardrobeItem));
}

export async function updateItem(
  userId: string,
  itemId: string,
  data: Partial<Pick<WardrobeItem, 'name' | 'category' | 'color' | 'colorFamily' | 'vibeTags'>>
): Promise<void> {
  await updateDoc(doc(db, `users/${userId}/items/${itemId}`), data);
}

export async function deleteItem(userId: string, itemId: string): Promise<void> {
  await deleteDoc(doc(db, `users/${userId}/items/${itemId}`));
}

// ── Outfits ──────────────────────────────────────────────────────────────────

export async function saveOutfit(
  userId: string,
  data: Omit<Outfit, 'id' | 'userId' | 'savedAt'>
): Promise<string> {
  const ref = await addDoc(collection(db, `users/${userId}/outfits`), {
    ...data,
    userId,
    savedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getOutfits(userId: string): Promise<Outfit[]> {
  const snap = await getDocs(
    query(collection(db, `users/${userId}/outfits`), orderBy('savedAt', 'desc'))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Outfit));
}

export async function getOutfit(userId: string, outfitId: string): Promise<Outfit | null> {
  const snap = await getDoc(doc(db, `users/${userId}/outfits/${outfitId}`));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Outfit;
}

export async function deleteOutfit(userId: string, outfitId: string): Promise<void> {
  await deleteDoc(doc(db, `users/${userId}/outfits/${outfitId}`));
}

// ── Highlights ───────────────────────────────────────────────────────────────

export async function createHighlight(
  userId: string,
  data: Omit<Highlight, 'id' | 'createdAt'>
): Promise<string> {
  const ref = await addDoc(collection(db, `users/${userId}/highlights`), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getHighlights(userId: string): Promise<Highlight[]> {
  const snap = await getDocs(
    query(collection(db, `users/${userId}/highlights`), orderBy('createdAt', 'desc'))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Highlight));
}

export async function getHighlight(userId: string, highlightId: string): Promise<Highlight | null> {
  const snap = await getDoc(doc(db, `users/${userId}/highlights/${highlightId}`));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Highlight;
}

export async function updateHighlightDay(
  userId: string,
  highlightId: string,
  day: string,
  outfitId: string | null
): Promise<void> {
  await updateDoc(doc(db, `users/${userId}/highlights/${highlightId}`), {
    [`days.${day}`]: outfitId,
  });
}

export async function deleteHighlight(userId: string, highlightId: string): Promise<void> {
  await deleteDoc(doc(db, `users/${userId}/highlights/${highlightId}`));
}
