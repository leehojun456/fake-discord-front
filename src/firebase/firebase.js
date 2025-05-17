// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAU04L6rl26xPy_AFu6o6LzORdZdDc4H3w",
  authDomain: "fakediscord-612ea.firebaseapp.com",
  projectId: "fakediscord-612ea",
  storageBucket: "fakediscord-612ea.firebasestorage.app",
  messagingSenderId: "598179639814",
  appId: "1:598179639814:web:6600bebf0426cb3f5ec987",
  measurementId: "G-YZL9FPR9QE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };
