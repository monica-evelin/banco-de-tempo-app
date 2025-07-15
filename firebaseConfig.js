// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDiBF1cnCNXfsTQIgppJ7LePmYIq0j3dZs",
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
