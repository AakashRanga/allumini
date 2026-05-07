// npm install firebase

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlVei-AIpw1Aaf6LfghSrj8FQ29nCLGBc",
  authDomain: "allumini-connect.firebaseapp.com",
  projectId: "allumini-connect",
  storageBucket: "allumini-connect.firebasestorage.app",
  messagingSenderId: "985795767788",
  appId: "1:985795767788:web:67709c12d3bd9a9915a4c9",
  measurementId: "G-RKMV2TRQX3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };