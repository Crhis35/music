import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { enableIndexedDbPersistence, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDOHU_MeBY2f-EDKMlsPqK98cGyl2yoPUo',
  authDomain: 'music-app-e6c60.firebaseapp.com',
  projectId: 'music-app-e6c60',
  storageBucket: 'music-app-e6c60.appspot.com',
  //   messagingSenderId: '732777939672',
  appId: '1:732777939672:web:a77076ddddf63710c68dad',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
const firestore = getFirestore(app);

enableIndexedDbPersistence(firestore)
  .then(() => {
    console.log('Connected');
  })
  .catch((err) => {
    console.log('Firebase persistence error: ', err);
  });

export default app;
export * from 'firebase/auth';

export { storage };
