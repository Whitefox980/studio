import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// ▼ OVDE UBACI KONFIGURACIJU ▼
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmXa8pe6z8V0e74jWcSh2jAp7Mxg1WP6A",
    authDomain: "gde-kako-rs.firebaseapp.com",
      projectId: "gde-kako-rs",
        storageBucket: "gde-kako-rs.firebasestorage.app",
          messagingSenderId: "794019303108",
            appId: "1:794019303108:web:b446c096d64d87bc25c391",
              measurementId: "G-WVKT59G7R6"
              };


    // ostali parametri...


    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Eksportuj servise koje koristiš
    export const db = getFirestore(app);       // Firestore
    export const auth = getAuth(app);         // Authentication
    export const storage = getStorage(app);    // Storage