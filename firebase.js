import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB-Hop8PzI9T1EaddBV2FH94dy3xVRL3Z4",
  authDomain: "controle-dividas-d151d.firebaseapp.com",
  projectId: "controle-dividas-d151d",
  storageBucket: "controle-dividas-d151d.firebasestorage.app",
  messagingSenderId: "347103421856",
  appId: "1:347103421856:web:fdd0e575474dbf32c9f0c5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
