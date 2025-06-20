import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";

export const useUserStore = create((set) => ({
    currentUser: null,
    isLoading: true,
    user: null,
    fetchUserInfo: async (uid) => {
        if (!uid) return set({ currentUser: null, isLoading: false });

        try {
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                set({ currentUser: docSnap.data(), isLoading: false });
            } else {
                set({ currentUser: null, isLoading: false });
            }
        } catch (err) {
            console.log(err); // ✅ error now correctly handled
            return set({ currentUser: null, isLoading: false });
        }
    },
    setUser: (userData) => set({ user: userData }),
}));
