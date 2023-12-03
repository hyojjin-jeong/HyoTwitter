import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDF0vkKV-iOgP0kmaMLXM9WtnlJ0Eu5gVM",
  authDomain: "hyotwitter-65102.firebaseapp.com",
  projectId: "hyotwitter-65102",
  storageBucket: "hyotwitter-65102.appspot.com",
  messagingSenderId: "239229712940",
  appId: "1:239229712940:web:842aa1c50c67c9cd5aaf89"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);