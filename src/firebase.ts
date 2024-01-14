import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0Sl76Ttkapy6IZ1JtpZem1G4b8GFcgdI",
  authDomain: "toptal-test-a2be6.firebaseapp.com",
  projectId: "toptal-test-a2be6",
  storageBucket: "toptal-test-a2be6.appspot.com",
  messagingSenderId: "541514098023",
  appId: "1:541514098023:web:227881d67bb91e3bb33bc2",
  measurementId: "G-SEJ37WSY3X",
};

const app = initializeApp(firebaseConfig);
const _app = initializeApp(firebaseConfig, "Secondary");
export const _auth = getAuth(_app);
export const auth = getAuth(app);
export const db = getFirestore(app);
