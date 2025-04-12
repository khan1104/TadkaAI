import { initializeApp} from 'firebase/app';
import { getFirestore} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCvC4WvDZdozRo96r6PrYapfYw1wY1APmk",
    authDomain: "tadkaai-11882.firebaseapp.com",
    projectId: "tadkaai-11882",
    storageBucket: "tadkaai-11882.firebasestorage.app",
    messagingSenderId: "779583813454",
    appId: "1:779583813454:web:634bec5210a8620989501f",
    measurementId: "G-1CQ6X3749F"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export {app,db,storage};