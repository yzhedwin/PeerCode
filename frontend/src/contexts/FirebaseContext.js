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
  updateProfile,
} from "firebase/auth";

export const FirebaseContext = createContext();
const storage = getStorage();

export function FirebaseProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(true);

  const signup = async (username, email, password) => {
    await createUserWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        const user = userCredential.user;
        setDoc(doc(fs, "users", user.uid), { isAdmin: false });
      }
    );
    await updateProfile(auth.currentUser, { displayName: username });
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
      getImage(user);
    }
  };

  const updateUser = async (user, isAdmin, newName) => {
    if (user) {
      setCurrentUser(user);
      const dbRef = collection(fs, "users");
      await updateProfile(auth.currentUser, { displayName: newName }).catch(
        (err) => console.log(err)
      );
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
    setCurrentUser(null);
    setIsAdmin(false);
    setImage(null);
  };

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  onAuthStateChanged(
    auth,
    async (user) => {
      setCurrentUser(user);
      setLoading(false);
    },
    []
  );

  const value = {
    currentUser,
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
