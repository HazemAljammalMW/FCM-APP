// firebaseStorage.ts
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

/**
 * Uploads an image file to Firebase Storage.
 * @param file The File object to upload.
 * @param path The destination path in the storage bucket.
 * @returns The public download URL of the uploaded image.
 */
export async function uploadImage(file: File, path: string): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    // Upload the file to the specified path
    const snapshot = await uploadBytes(storageRef, file);
    console.log("Upload successful:", snapshot);

    // Retrieve the download URL after successful upload
    const downloadURL = await getDownloadURL(storageRef);
    console.log("Download URL:", downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error("Error during image upload:", error);
    throw new Error("Image upload failed");
  }
}
