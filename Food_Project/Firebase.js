// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import  {getAuth} from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB278uiKw_FhEozUiyBZtkLzwK9UONHLJ0",
  authDomain: "food-project-ae836.firebaseapp.com",
  projectId: "food-project-ae836",
  storageBucket: "food-project-ae836.appspot.com",
  messagingSenderId: "232265756028",
  appId: "1:232265756028:web:193bac431f8c3f540e08f9"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const fireStore = getFirestore(firebaseApp);
const firebaseAuth = getAuth(firebaseApp)

export { firebaseApp, firebaseAuth, fireStore }