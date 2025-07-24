// firebaseConfig.js
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCy1p145PzfbK7PCYHnnZ8G9F0WIBGRQ1U",
  authDomain: "bancodetempo-24e92.firebaseapp.com",
  projectId: "bancodetempo-24e92",
  storageBucket: "bancodetempo-24e92.appspot.com", // ajustei aqui o storageBucket
  messagingSenderId: "714195227947",
  appId: "1:714195227947:web:6820137e28e04bb22d616e",
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { auth, db };
