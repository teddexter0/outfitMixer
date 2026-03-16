/**
 * Client-side AES-GCM encryption for images before upload to Firebase Storage.
 * Even the project owner sees only encrypted blobs in the Firebase Console.
 *
 * Key is derived from the user's UID using PBKDF2 — deterministic per user,
 * never leaves the browser.
 */

const SALT = 'outfitmixer-v1'; // public constant — security comes from UID entropy

async function deriveKey(uid: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(uid),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(SALT),
      iterations: 100_000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptFile(file: File, uid: string): Promise<Blob> {
  const key = await deriveKey(uid);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const fileBuffer = await file.arrayBuffer();
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, fileBuffer);

  // Prepend IV (12 bytes) to the ciphertext so we can decrypt later
  const result = new Uint8Array(12 + encrypted.byteLength);
  result.set(iv, 0);
  result.set(new Uint8Array(encrypted), 12);
  return new Blob([result], { type: 'application/octet-stream' });
}

export async function decryptUrl(encryptedUrl: string, uid: string): Promise<string> {
  const key = await deriveKey(uid);
  const response = await fetch(encryptedUrl);
  const buffer = await response.arrayBuffer();
  const data = new Uint8Array(buffer);
  const iv = data.slice(0, 12);
  const ciphertext = data.slice(12);
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
  const blob = new Blob([decrypted]); // browser infers image type
  return URL.createObjectURL(blob);
}
