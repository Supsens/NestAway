// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "nestaway-6740b.firebaseapp.com",
  projectId: "nestaway-6740b",
  storageBucket: "nestaway-6740b.appspot.com",
  messagingSenderId: "665573580991",
  appId: "1:665573580991:web:16ecd883a31f891f5da60a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);