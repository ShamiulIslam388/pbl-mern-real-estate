// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "pbl-mern-real-state.firebaseapp.com",
  projectId: "pbl-mern-real-state",
  storageBucket: "pbl-mern-real-state.appspot.com",
  messagingSenderId: "461917924591",
  appId: "1:461917924591:web:0fa464fe70f36b9b17ff1a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
