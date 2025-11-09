// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyCnXprcfFk6IMhUIpnmYrMEXsZ9cklW60c",
  authDomain: "spot-x-46d47.firebaseapp.com",
  projectId: "spot-x-46d47",
  storageBucket: "spot-x-46d47.appspot.com",
  messagingSenderId: "110427984173",
  appId: "1:110427984173:web:beae92a43162fae05343a4",
  measurementId: "G-46ZDX9MSRD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { auth, db }