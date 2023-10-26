import React, { createContext, useState } from "react";
import { auth, fs } from "../firebase";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";

export const FirebaseContext = createContext();
const storage = getStorage();

export function FirebaseProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [currentName, setCurrentName] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(true);

  const signup = async (email, password) => {
    await createUserWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        const user = userCredential.user;
        setDoc(doc(fs, "users", user.uid), { isAdmin: false });
      }
    );
  };

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        const user = userCredential.user;
        checkDetails(user);
      }
    );
  };

  const checkDetails = async (user) => {
    if (user) {
      setCurrentUser(user);
      const docRef = doc(fs, "users", user.uid);
      const docSnap = await getDoc(docRef);
      setIsAdmin(docSnap.data().isAdmin);
      setCurrentName(docSnap.data().name);
      getImage(user);
    }
  };

  const updateUser = async (user, isAdmin, newName) => {
    if (user) {
      setCurrentUser(user);
      const dbRef = collection(fs, "users");
      await setDoc(doc(dbRef, user.uid), {
        isAdmin: isAdmin,
        name: newName,
      });
    }
  };

  const uploadImage = async (user, image) => {
    const storageRef = ref(storage, user.uid);

    uploadBytes(storageRef, image).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });
  };

  const getImage = async (user) => {
    console.log("getting image");
    const image = ref(storage, user.uid);
    const dummy = ref(storage, "placeholder.png");
    try {
      await getDownloadURL(image).then((url) => {
        setImage(url);
      });
    } catch (e) {
      await getDownloadURL(dummy).then((url) => {
        setImage(url);
      });
    }
  };

  const log_out = async () => {
    await signOut(auth);
    setIsAdmin(false);
  };

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  onAuthStateChanged(
    auth,
    async (user) => {
      setCurrentUser(user);
      //setCurrentName("test");
      setLoading(false);
    },
    []
  );

  const value = {
    currentUser,
    currentName,
    image,
    isAdmin,
    signup,
    login,
    updateUser,
    uploadImage,
    getImage,
    log_out,
    resetPassword,
    checkDetails,
  };
  return (
    <FirebaseContext.Provider value={value}>
      {!loading && children}
    </FirebaseContext.Provider>
  );
}
