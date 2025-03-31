import { initializeApp} from 'firebase/app';
import { getFirestore} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
   //your firse base details
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export {app,db,storage};