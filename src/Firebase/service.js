import { db } from "./firebase-config";
import {
  doc,
  setDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

export const addDocument = async (collection, data) => {
  await setDoc(collection, { ...data, createdAt: serverTimestamp() });
};

export const updateDocument = async (collection, data) => {
  await setDoc(collection, data, { merge: true });
};

export const getDocuments = async (collection, condition) => {
  const q = query(collection, condition);
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
};
