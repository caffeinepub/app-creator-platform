export interface UploadedSound {
  id: string;
  name: string;
  base64Data: string;
  mimeType: string;
  uploadedAt: number;
}

const DB_NAME = "noventra-audio-uploads";
const STORE_NAME = "uploaded-sounds";
const DB_VERSION = 1;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/mp3",
  "audio/x-wav",
];
const ALLOWED_EXTENSIONS = [".mp3", ".wav", ".ogg"];

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function uploadAudioFile(file: File): Promise<UploadedSound> {
  // Validate extension
  const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error(
      "Unsupported format. Please upload MP3, WAV, or OGG files.",
    );
  }

  // Validate MIME type (some browsers may report differently)
  const mimeOk =
    ALLOWED_TYPES.some((t) => file.type.includes(t.split("/")[1])) ||
    file.type.startsWith("audio/");
  if (!mimeOk && file.type !== "") {
    throw new Error(
      `Unsupported file type: ${file.type}. Please upload MP3, WAV, or OGG files.`,
    );
  }

  // Validate size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File too large. Maximum size is 5MB. Your file is ${(file.size / 1024 / 1024).toFixed(1)}MB.`,
    );
  }

  // Read as ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();

  // Verify it's valid audio by decoding
  try {
    const audioCtx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    await audioCtx.decodeAudioData(arrayBuffer.slice(0));
    audioCtx.close();
  } catch {
    throw new Error(
      "Invalid audio file. The file could not be decoded as audio.",
    );
  }

  const base64Data = arrayBufferToBase64(arrayBuffer);
  const mimeType = file.type || `audio/${ext.slice(1)}`;
  const id = `uploaded-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return {
    id,
    name: file.name.replace(/\.[^.]+$/, ""),
    base64Data,
    mimeType,
    uploadedAt: Date.now(),
  };
}

export async function saveUploadedSound(sound: UploadedSound): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(sound);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getUploadedSounds(): Promise<UploadedSound[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteUploadedSound(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
