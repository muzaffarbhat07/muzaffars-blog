// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "muzaffars-blog.firebaseapp.com",
  projectId: "muzaffars-blog",
  storageBucket: "muzaffars-blog.appspot.com",
  messagingSenderId: "372163984762",
  appId: "1:372163984762:web:69f96a67e0c0e2498aeac3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
