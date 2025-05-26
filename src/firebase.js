import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDcrEK0yE411duJU5koFnPQCDOtL9dqJg4",
    authDomain: "moodhue-7ed77.firebaseapp.com",
    projectId: "moodhue-7ed77",
    storageBucket: "moodhue-7ed77.firebasestorage.app",
    messagingSenderId: "258893022284",
    appId: "1:258893022284:web:88bf90891e818ba7df60e9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);