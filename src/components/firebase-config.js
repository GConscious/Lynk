// firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSXR8XBv0Mgw-ERGPVMTWJlAWkEvJi3oA",
  authDomain: "lynk-fc6d7.firebaseapp.com",
  projectId: "lynk-fc6d7",
  storageBucket: "lynk-fc6d7.firebasestorage.app",
  messagingSenderId: "597742920717",
  appId: "1:597742920717:web:95871a36af9569e7b2a144",
  measurementId: "G-H5LNZMSTZV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Export default Firebase app instance
export { auth };
