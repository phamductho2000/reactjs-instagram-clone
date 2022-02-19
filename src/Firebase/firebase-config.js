import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import {
  getAuth,
  connectAuthEmulator,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAC9TjkCmXay6TVJG1st3JPq6z_WW49PW0",
  authDomain: "instagram-clone-d041a.firebaseapp.com",
  databaseURL: "https://instagram-clone-d041a-default-rtdb.firebaseio.com",
  projectId: "instagram-clone-d041a",
  storageBucket: "instagram-clone-d041a.appspot.com",
  messagingSenderId: "65871457028",
  appId: "1:65871457028:web:ac2baf6b16d5c06a3efe51",
  measurementId: "G-CQZWJXGT2W",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
// if (window.location.hostname == "localhost") {
//   connectFirestoreEmulator(db, "localhost", 8080);
//   connectStorageEmulator(storage, "localhost", 9199);
//   connectAuthEmulator(auth, "http://localhost:9099");
// }
// const provider = new GoogleAuthProvider();

// const signInWithGoogle = () => {
//   signInWithPopup(auth, provider)
//     .then((result) => {
//       console.log(result);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };
export { db, storage, auth };
