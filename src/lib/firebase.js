import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyABt06F1Juh1pjTBIyz8-lIrJk_UvYQ5Gk",
  authDomain: "sar-ai-bda29.firebaseapp.com",
  projectId: "sar-ai-bda29",
  storageBucket: "sar-ai-bda29.firebasestorage.app",
  messagingSenderId: "83165552312",
  appId: "1:83165552312:web:6a527317598ab97dbd1e4d",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);