// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAatUF1-4atgfxO5V0-XZJSEQplOzFHQb0",
  authDomain: "portfolio-79d1a.firebaseapp.com",
  projectId: "portfolio-79d1a",
  storageBucket: "portfolio-79d1a.appspot.com",
  messagingSenderId: "7284440621",
  appId: "1:7284440621:web:20adececd7c37c76e7c2a4",
  measurementId: "G-RDTBZKTE0H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;