// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAgLuDegT7Z88C0URLSi3urLu39xPSsJYM",
    authDomain: "maverick-2db6a.firebaseapp.com",
    projectId: "maverick-2db6a",
    storageBucket: "maverick-2db6a.appspot.com",
    messagingSenderId: "34632196394",
    appId: "1:34632196394:web:bf0a0aa476e1ec8796fe53"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage();
