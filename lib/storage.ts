import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';
import { encryptFile } from './crypto';

export async function uploadItemImage(userId: string, file: File): Promise<string> {
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.enc`;
  const storageRef = ref(storage, `users/${userId}/items/${filename}`);
  const encrypted = await encryptFile(file, userId);
  await uploadBytes(storageRef, encrypted);
  return getDownloadURL(storageRef);
}

export async function deleteItemImage(imageUrl: string): Promise<void> {
  try {
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);
  } catch {
    // ignore if already deleted
  }
}
